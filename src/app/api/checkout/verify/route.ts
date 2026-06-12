import { NextResponse } from "next/server";
import crypto from "crypto";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import { sendEnrollmentEmail, sendPaymentSuccessEmail } from "@/lib/email/service";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = await request.json();
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courseId) {
      return NextResponse.json({ error: "Missing required parameters." }, { status: 400 });
    }

    // 1. Verify Razorpay signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid signature. Potential fraud attempt blocked." }, { status: 400 });
    }

    // 2. Fetch course and order
    const [course, order, pendingPayment] = await Promise.all([
      prisma.course.findUnique({ where: { id: courseId } }),
      prisma.order.findUnique({ where: { orderNumber: razorpay_order_id } }),
      prisma.payment.findFirst({ where: { providerPaymentId: razorpay_order_id } })
    ]);

    if (!course) {
      return NextResponse.json({ error: "Associated course not found." }, { status: 404 });
    }

    if (!order) {
      return NextResponse.json({ error: "Associated order invoice not found." }, { status: 404 });
    }

    // 3. Atomically update order, payment log, and create course enrollment in a single transaction
    await prisma.$transaction([
      prisma.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.PAID }
      }),
      pendingPayment
        ? prisma.payment.update({
            where: { id: pendingPayment.id },
            data: {
              status: "SUCCEEDED",
              providerPaymentId: razorpay_payment_id,
              paidAt: new Date()
            }
          })
        : prisma.payment.create({
            data: {
              orderId: order.id,
              provider: "STRIPE", // Map standard credit/merchant card log
              providerPaymentId: razorpay_payment_id,
              status: "SUCCEEDED",
              amountCents: course.priceCents,
              currency: "INR",
              paidAt: new Date()
            }
          }),
      prisma.enrollment.upsert({
        where: {
          userId_courseId: {
            userId: session.user.id,
            courseId: course.id
          }
        },
        update: { status: "ACTIVE" },
        create: {
          userId: session.user.id,
          courseId: course.id,
          status: "ACTIVE"
        }
      })
    ]);

    // 4. Dispatch transactional notification emails in the background
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      
      await sendEnrollmentEmail(session.user.email!, session.user.name || "Student", {
        name: session.user.name || "Student",
        courseTitle: course.title,
        courseSlug: course.slug,
        appUrl
      });

      await sendPaymentSuccessEmail(session.user.email!, session.user.name || "Student", {
        name: session.user.name || "Student",
        orderNumber: order.orderNumber,
        totalAmountCents: course.priceCents,
        currency: "INR",
        items: [{
          productName: course.title,
          quantity: 1,
          totalPriceCents: course.priceCents
        }],
        supportEmail: "support@sagarcoachingcentre.com"
      });
    } catch (emailErr) {
      console.error("[EMAIL_DISPATCH_VERIFY_ERROR]", emailErr);
    }

    // 5. Redirect to dedicated payment success confirmation screen
    return NextResponse.json({
      success: true,
      redirectUrl: `/order/${order.id}/confirmation`
    });
  } catch (err: any) {
    console.error("[PAYMENT_VERIFICATION_API_ERROR]", err);
    return NextResponse.json(
      { error: err.message || "Failed to verify transaction." },
      { status: 500 }
    );
  }
}
