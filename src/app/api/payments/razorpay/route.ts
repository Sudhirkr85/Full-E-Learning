import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { razorpay } from "@/lib/razorpay";
import { OrderStatus } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required." }, { status: 400 });
    }

    // 1. Fetch pending order from database
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    if (order.status !== OrderStatus.PENDING) {
      return NextResponse.json(
        { error: `Order is already in ${order.status.toLowerCase()} state.` },
        { status: 400 }
      );
    }

    // 2. Map currency code safely. (Note: Razorpay sandbox supports USD and INR)
    const currency = order.currency.toUpperCase() === "USD" ? "USD" : "INR";

    // 3. Generate Razorpay checkout order
    // Razorpay amount is in paise (cents). TotalCents is in cents, perfectly aligned.
    const rzpOrderOptions = {
      amount: order.totalCents,
      currency,
      receipt: order.orderNumber,
      notes: {
        orderId: order.id,
        userId: order.userId || "GUEST",
      },
    };

    console.log("[RAZORPAY_CREATE_ORDER_OPTIONS]", rzpOrderOptions);
    const rzpOrder = await razorpay.orders.create(rzpOrderOptions);
    console.log("[RAZORPAY_CREATE_ORDER_SUCCESS]", rzpOrder);

    // Save Razorpay order ID in our payment logs as a pending entry
    await prisma.payment.upsert({
      where: { providerPaymentId: rzpOrder.id },
      update: {
        amountCents: order.totalCents,
        status: "PENDING",
      },
      create: {
        orderId: order.id,
        provider: "STRIPE", // Map standard credit/merchant cards or manual
        providerPaymentId: rzpOrder.id,
        status: "PENDING",
        amountCents: order.totalCents,
        currency: order.currency,
        metadata: {
          rzpOrderId: rzpOrder.id,
        },
      },
    });

    return NextResponse.json({
      success: true,
      keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_51I2V3X4Y5Z6A7B",
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      orderId: rzpOrder.id,
      receipt: rzpOrder.receipt,
    });
  } catch (err: any) {
    console.error("[RAZORPAY_ORDER_API_ERROR]", err);
    return NextResponse.json(
      { error: err.message ?? "Failed to initialize payment gateway order." },
      { status: 500 }
    );
  }
}
