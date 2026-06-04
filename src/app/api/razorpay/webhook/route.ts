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

    // Verify webhook signature using the configured secret (fallback to a test secret if missing)
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "replace-with-your-razorpay-webhook-secret";
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
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

      // Handle Course Enrollment Order Type
      try {
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
      } catch (enrollErr) {
        console.error("Error processing enrollment in webhook:", enrollErr);
      }

      // Handle Store Order Type
      try {
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

        if (order) {
          // If the order has associated course enrollments via metadata (or references), verify/activate them too
          const orderMeta = order.metadata as any || {};
          if (orderMeta.enrollmentId) {
            try {
              const enrollment = await prisma.enrollment.findUnique({
                where: { id: orderMeta.enrollmentId },
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

                // Initialize course progress
                const existingProgress = await prisma.courseProgress.findUnique({
                  where: { enrollmentId: enrollment.id }
                });
                if (!existingProgress) {
                  const courseWithSections = await prisma.course.findUnique({
                    where: { id: enrollment.courseId },
                    include: { sections: { include: { lessons: true } } }
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
              }
            } catch (e) {
              console.error("Failed to update related enrollment for store order metadata:", e);
            }
          }

          if (order.status !== OrderStatus.PAID) {
            const hasPhysical = order.items.some(item => item.productType === "PHYSICAL");
            const updatedMetadata = {
              ...(order.metadata as any || {}),
              razorpayPaymentId,
              shippingStatus: hasPhysical ? "PROCESSING" : undefined
            };

            // Mark PAID
            await prisma.order.update({
              where: { id: order.id },
              data: {
                status: OrderStatus.PAID,
                paidAt: new Date(),
                shippingStatus: hasPhysical ? "PROCESSING" : "PENDING",
                metadata: updatedMetadata
              }
            });

            // Create success payment ledger if missing
            await prisma.payment.upsert({
              where: { providerPaymentId: razorpayPaymentId },
              update: { status: PaymentStatus.SUCCEEDED },
              create: {
                orderId: order.id,
                provider: "STRIPE", // Matches payment provider config/fallback
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
        }
      } catch (orderErr) {
        console.error("Error processing order in webhook:", orderErr);
      }
    }

    // Handle payment.failed
    if (event.event === 'payment.failed') {
      const razorpayOrderId = event.payload.payment.entity.order_id;
      const errorDescription = event.payload.payment.entity.error_description;

      try {
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
      } catch (enrollFailErr) {
        console.error("Error updating enrollment status on payment.failed webhook event:", enrollFailErr);
      }

      try {
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
      } catch (orderFailErr) {
        console.error("Error updating order status on payment.failed webhook event:", orderFailErr);
      }
    }

    return NextResponse.json({ received: true });

  } catch (err) {
    console.error('Webhook error:', err);
    // Never crash webhook: log error and return 200 to Razorpay
    return NextResponse.json({ error: "Webhook processing failed but ignored to prevent retries" }, { status: 200 });
  }
}
