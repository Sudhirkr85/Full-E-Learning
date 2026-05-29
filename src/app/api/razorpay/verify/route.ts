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

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || "sec_test_secret_placeholder_value_123")
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      await prisma.order.update({
        where: { id: orderId },
        data: { 
          status: OrderStatus.CANCELLED,
          failureReason: "Invalid signature"
        }
      });
      return NextResponse.json({ message: "Payment verification failed." }, { status: 400 });
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

    // Update order status to PAID
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { 
        status: OrderStatus.PAID,
        paidAt: new Date(),
        metadata: updatedMetadata
      },
      include: { 
        items: { include: { product: true } },
        user: true 
      }
    });

    // Create or update payment success ledger transaction
    await prisma.payment.upsert({
      where: { providerPaymentId: razorpay_payment_id },
      update: { status: PaymentStatus.SUCCEEDED },
      create: {
        orderId: order.id,
        provider: "STRIPE", // Maps to card sandbox logs
        providerPaymentId: razorpay_payment_id,
        status: PaymentStatus.SUCCEEDED,
        amountCents: order.totalCents,
        currency: order.currency,
        paidAt: new Date()
      }
    });

    // Update physical items to PROCESSING in metadata/fulfillment status
    for (const item of order.items) {
      if (item.productType === 'PHYSICAL') {
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

    // Clear server-side cart items if any exist in the database
    if (order.userId) {
      await prisma.cartItem.deleteMany({ where: { userId: order.userId } }).catch(() => {});
    }

    // Send confirmation email via Brevo
    try {
      await sendOrderConfirmationEmail({ order, user: order.user || { name: "Valued Customer", email: order.billingEmail } });
      await prisma.order.update({
        where: { id: order.id },
        data: { emailSentAt: new Date() }
      }).catch(() => {});
    } catch (emailErr) {
      console.error("[BREVO_SEND_CONFIRMATION_EMAIL_ERROR]", emailErr);
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error('Verify error:', err);
    return NextResponse.json({ message: "Something went wrong." }, { status: 500 });
  }
}
