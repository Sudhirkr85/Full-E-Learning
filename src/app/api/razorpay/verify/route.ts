import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail } from "@/lib/email/brevo";
import { OrderStatus, PaymentStatus } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return NextResponse.json({ error: "Missing required parameters." }, { status: 400 });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "sec_test_secret_placeholder_value_123")
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      await prisma.order.update({ 
        where: { id: orderId }, 
        data: { status: OrderStatus.CANCELLED } // cancelled/failed status mapping
      });
      return NextResponse.json({ error: "Payment verification failed." }, { status: 400 });
    }

    // Retrieve order first to capture metadata safely
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    const updatedMetadata = {
      ...(existingOrder.metadata as any || {}),
      razorpayPaymentId: razorpay_payment_id
    };

    // Update order status and attach razorpay payment logs
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { 
        status: OrderStatus.PAID,
        metadata: updatedMetadata
      },
      include: { 
        items: { 
          include: { 
            product: true 
          } 
        }, 
        user: true 
      }
    });

    // Create payment success ledger transaction
    await prisma.payment.upsert({
      where: { providerPaymentId: razorpay_payment_id },
      update: { status: PaymentStatus.SUCCEEDED },
      create: {
        orderId: order.id,
        provider: "STRIPE",
        providerPaymentId: razorpay_payment_id,
        status: PaymentStatus.SUCCEEDED,
        amountCents: order.totalCents,
        currency: order.currency,
        paidAt: new Date()
      }
    });

    // Set PHYSICAL items to PROCESSING in metadata
    for (const item of order.items) {
      if (item.product?.productType === "PHYSICAL") {
        await prisma.orderItem.update({ 
          where: { id: item.id }, 
          data: { 
            metadata: {
              ...(item.metadata as any || {}),
              status: "PROCESSING"
            }
          } 
        });
      }
    }

    // Send confirmation email via Brevo
    try {
      await sendOrderConfirmationEmail({ order, user: order.user || { name: "Valued Customer", email: order.billingEmail } });
    } catch (emailErr) {
      console.error("[BREVO_SEND_CONFIRMATION_EMAIL_ERROR]", emailErr);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[RAZORPAY_VERIFY_ROUTE_ERROR]", err);
    return NextResponse.json({ error: "Payment verification failed." }, { status: 500 });
  }
}
