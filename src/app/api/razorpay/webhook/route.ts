import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail, sendCourseEnrollmentEmail } from "@/lib/email/brevo";
import { OrderStatus, PaymentStatus } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    if (!signature) {
      console.error('Missing webhook signature');
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || "sec_test_secret_placeholder_value_123")
      .update(body)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);

    // Handle payment.captured — payment successful
    if (event.event === 'payment.captured') {
      const razorpayOrderId = event.payload.payment.entity.order_id;
      const razorpayPaymentId = event.payload.payment.entity.id;

      // Check if this is a course enrollment payment
      const enrollment = await prisma.enrollment.findFirst({
        where: { razorpayOrderId },
        include: { course: true, user: true }
      });

      if (enrollment && enrollment.status !== 'ACTIVE') {
        await prisma.enrollment.update({
          where: { id: enrollment.id },
          data: {
            status: 'ACTIVE',
            paymentStatus: 'COMPLETED',
            razorpayPaymentId,
            enrolledAt: new Date(),
            paidAt: new Date()
          }
        });

        // Initialize course progress if not existing
        try {
          const existingProgress = await prisma.courseProgress.findUnique({
            where: { enrollmentId: enrollment.id }
          });
          if (!existingProgress) {
            const courseWithSections = await prisma.course.findUnique({
              where: { id: enrollment.courseId },
              include: {
                sections: {
                  include: { lessons: true }
                }
              }
            });
            const totalLessons = courseWithSections?.sections.reduce((sum, sec) => sum + sec.lessons.length, 0) || 0;
            await prisma.courseProgress.create({
              data: {
                enrollmentId: enrollment.id,
                progressPercent: 0,
                completedLessonsCount: 0,
                totalLessonsCount: totalLessons
              }
            });
          }
        } catch (progressErr) {
          console.error("Webhook progress creation failed:", progressErr);
        }

        // Send email only once
        if (!enrollment.emailSentAt) {
          try {
            await sendCourseEnrollmentEmail({
              userEmail: enrollment.user.email,
              userName: enrollment.user.name,
              courseTitle: enrollment.course.title,
              courseId: enrollment.course.id
            });
            await prisma.enrollment.update({
              where: { id: enrollment.id },
              data: { emailSentAt: new Date() }
            });
          } catch (emailErr) {
            console.error("Webhook welcome email dispatch error:", emailErr);
          }
        }
      }

      // Find the internal order
      const order = await prisma.order.findFirst({
        where: {
          OR: [
            { orderNumber: razorpayOrderId },
            { metadata: { path: ["razorpayOrderId"], equals: razorpayOrderId } }
          ]
        },
        include: { 
          items: { include: { product: true } },
          user: true 
        }
      });

      if (!order) {
        console.error('Order not found for razorpayOrderId:', razorpayOrderId);
        return NextResponse.json({ received: true });
      }

      // Only process if not already PAID (idempotency)
      if (order.status === OrderStatus.PAID) {
        return NextResponse.json({ received: true });
      }

      const updatedMetadata = {
        ...(order.metadata as any || {}),
        razorpayPaymentId
      };

      // Mark PAID
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: OrderStatus.PAID,
          paidAt: new Date(),
          metadata: updatedMetadata
        }
      });

      // Create success payment ledger if missing
      await prisma.payment.upsert({
        where: { providerPaymentId: razorpayPaymentId },
        update: { status: PaymentStatus.SUCCEEDED },
        create: {
          orderId: order.id,
          provider: "STRIPE",
          providerPaymentId: razorpayPaymentId,
          status: PaymentStatus.SUCCEEDED,
          amountCents: order.totalCents,
          currency: order.currency,
          paidAt: new Date()
        }
      });

      // Update physical items
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

      // Clear server-side cart
      if (order.userId) {
        await prisma.cartItem.deleteMany({ where: { userId: order.userId } }).catch(() => {});
      }

      // Send confirmation email (only if not already sent)
      if (!order.emailSentAt) {
        try {
          await sendOrderConfirmationEmail({ order, user: order.user || { name: "Valued Customer", email: order.billingEmail } });
          await prisma.order.update({
            where: { id: order.id },
            data: { emailSentAt: new Date() }
          });
        } catch (emailErr) {
          console.error("[BREVO_WEBHOOK_EMAIL_ERROR]", emailErr);
        }
      }
    }

    // Handle payment.failed
    if (event.event === 'payment.failed') {
      const razorpayOrderId = event.payload.payment.entity.order_id;
      const errorDescription = event.payload.payment.entity.error_description;

      // Fail course enrollment if matched
      await prisma.enrollment.updateMany({
        where: {
          razorpayOrderId,
          status: { not: 'ACTIVE' }
        },
        data: {
          status: 'FAILED',
          paymentStatus: 'FAILED',
          failureReason: errorDescription || 'Payment failed',
          failedAt: new Date()
        }
      });

      // Find internal orders associated with the Razorpay Order ID
      const order = await prisma.order.findFirst({
        where: {
          OR: [
            { orderNumber: razorpayOrderId },
            { metadata: { path: ["razorpayOrderId"], equals: razorpayOrderId } }
          ]
        }
      });

      if (order && order.status !== OrderStatus.PAID) {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: OrderStatus.CANCELLED,
            failureReason: errorDescription || 'Payment failed',
            failedAt: new Date(),
          }
        });
      }
    }

    return NextResponse.json({ received: true });

  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
