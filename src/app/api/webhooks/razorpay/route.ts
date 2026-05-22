import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { OrderStatus, PaymentStatus, EnrollmentStatus, NotificationType } from "@prisma/client";

// Disable Next.js default body parsing since we need the RAW body to verify the signature
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // 1. Capture raw request body and signature header
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      console.error("[RAZORPAY_WEBHOOK] Missing signature header.");
      return NextResponse.json({ error: "Missing signature header." }, { status: 400 });
    }

    // 2. Perform HMAC-SHA256 signature verification
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "sec_webhook_secret_placeholder_value_123";
    const shasum = crypto.createHmac("sha256", webhookSecret);
    shasum.update(rawBody);
    const digest = shasum.digest("hex");

    if (digest !== signature) {
      console.error("[RAZORPAY_WEBHOOK] Signature verification failed.", {
        expected: signature,
        computed: digest,
      });
      return NextResponse.json({ error: "Signature verification failed." }, { status: 400 });
    }

    console.log("[RAZORPAY_WEBHOOK] Signature verified successfully.");
    const payload = JSON.parse(rawBody);
    const event = payload.event;
    console.log(`[RAZORPAY_WEBHOOK] Event received: ${event}`);

    // 3. Process the paid order event
    if (event === "order.paid" || event === "payment.captured") {
      const rzpOrderId = payload.payload.payment.entity.order_id || payload.payload.order.entity.id;
      const rzpPaymentId = payload.payload.payment.entity.id;

      if (!rzpOrderId) {
        console.error("[RAZORPAY_WEBHOOK] Missing Razorpay Order ID.");
        return NextResponse.json({ error: "Missing order_id." }, { status: 400 });
      }

      // 4. Locate pending order via payment mapping
      const paymentRecord = await prisma.payment.findFirst({
        where: { providerPaymentId: rzpOrderId },
        include: {
          order: {
            include: {
              items: {
                include: {
                  product: true,
                },
              },
            },
          },
        },
      });

      if (!paymentRecord) {
        console.error(`[RAZORPAY_WEBHOOK] No matching payment log found for Razorpay Order: ${rzpOrderId}`);
        return NextResponse.json({ error: "No matching payment record found." }, { status: 404 });
      }

      const order = paymentRecord.order;
      if (order.status === OrderStatus.PAID) {
        console.log(`[RAZORPAY_WEBHOOK] Order ${order.orderNumber} is already marked as paid.`);
        return NextResponse.json({ success: true, message: "Order already completed." });
      }

      // 5. Execute secure state updates and learning upgrades inside a Prisma transaction
      await prisma.$transaction(async (tx) => {
        // Update Order
        await tx.order.update({
          where: { id: order.id },
          data: {
            status: OrderStatus.PAID,
          },
        });

        // Update Payment Log
        await tx.payment.update({
          where: { id: paymentRecord.id },
          data: {
            status: PaymentStatus.SUCCEEDED,
            providerPaymentId: rzpPaymentId, // Save the captured payment reference
            paidAt: new Date(),
          },
        });

        // Find or create User by billingEmail if not mapped
        let studentUserId = order.userId;
        if (!studentUserId) {
          const existingUser = await tx.user.findUnique({
            where: { email: order.billingEmail },
          });

          if (existingUser) {
            studentUserId = existingUser.id;
            await tx.order.update({
              where: { id: order.id },
              data: { userId: studentUserId },
            });
          } else {
            // Generate standard student record
            const tempPasswordHash = crypto.randomBytes(16).toString("hex");
            const newUser = await tx.user.create({
              data: {
                email: order.billingEmail,
                name: order.billingEmail.split("@")[0],
                passwordHash: tempPasswordHash, // placeholder password hash
                role: "STUDENT",
              },
            });
            studentUserId = newUser.id;
            await tx.order.update({
              where: { id: order.id },
              data: { userId: studentUserId },
            });
          }
        }

        // Grant entitlements for products
        for (const item of order.items) {
          const product = item.product;
          if (!product) continue;

          // Entitlement Rule A: COURSE_ACCESS
          if (product.productType === "COURSE_ACCESS" && product.courseId) {
            const course = await tx.course.findUnique({
              where: { id: product.courseId },
              include: {
                sections: {
                  include: {
                    lessons: true,
                  },
                },
              },
            });

            if (course) {
              const totalLessons = course.sections.reduce((sum, sec) => sum + sec.lessons.length, 0);

              // Enroll Student in Course
              await tx.enrollment.upsert({
                where: {
                  userId_courseId: {
                    userId: studentUserId,
                    courseId: course.id,
                  },
                },
                update: {
                  status: EnrollmentStatus.ACTIVE,
                  lastAccessedAt: new Date(),
                },
                create: {
                  userId: studentUserId,
                  courseId: course.id,
                  status: EnrollmentStatus.ACTIVE,
                  progress: {
                    create: {
                      progressPercent: 0,
                      completedLessonsCount: 0,
                      totalLessonsCount: totalLessons,
                    },
                  },
                },
              });

              // Create student in-app notification
              await tx.notification.create({
                data: {
                  userId: studentUserId,
                  type: NotificationType.COURSE,
                  title: "Enrollment Activated! 🎉",
                  message: `You have successfully unlocked enrollment access for course: ${course.title}. Click to start studying.`,
                  linkUrl: `/student/courses`,
                  isRead: false,
                },
              });
            }
          }

          // Entitlement Rule B: DIGITAL_RESOURCE
          if (product.productType === "DIGITAL_RESOURCE") {
            await tx.notification.create({
              data: {
                userId: studentUserId,
                type: NotificationType.ORDER,
                title: "Digital Download Unlocked! 📚",
                message: `Your guide "${product.title}" is ready for download in your dashboard logs.`,
                linkUrl: `/student/orders`,
                isRead: false,
              },
            });
          }

          // Entitlement Rule C: BUNDLE
          if (product.productType === "BUNDLE") {
            // Can be extended to enroll in multiple courses or deliver complex bundle packages
            await tx.notification.create({
              data: {
                userId: studentUserId,
                type: NotificationType.ORDER,
                title: "Ultimate Bundle Active! 🎁",
                message: `Your package "${product.title}" features have been deployed. View order logs.`,
                linkUrl: `/student/orders`,
                isRead: false,
              },
            });
          }
        }

        // Write Audit Log
        await tx.auditLog.create({
          data: {
            userId: studentUserId,
            action: "UPDATE",
            entityType: "Order",
            entityId: order.id,
            afterState: { status: "PAID", rzpPaymentId },
            metadata: {
              reason: "Razorpay Webhook payment capture",
              orderNumber: order.orderNumber,
              amountPaidCents: order.totalCents,
            },
          },
        });
      });

      console.log(`[RAZORPAY_WEBHOOK] Successfully completed transaction upgrades for Order: ${order.orderNumber}`);
      return NextResponse.json({ success: true, message: "Order processed successfully." });
    }

    return NextResponse.json({ success: true, message: "Ignored event." });
  } catch (err: any) {
    console.error("[RAZORPAY_WEBHOOK_HANDLER_ERROR]", err);
    return NextResponse.json(
      { error: err.message ?? "Internal Webhook error." },
      { status: 500 }
    );
  }
}
