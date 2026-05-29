import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { EnrollmentStatus } from "@prisma/client";
import { sendCourseEnrollmentEmail } from "@/lib/email/brevo";

export async function POST(req: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      enrollmentId
    } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !enrollmentId) {
      return NextResponse.json({ message: "Something went wrong. Please refresh and try again." }, { status: 400 });
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      await prisma.enrollment.update({
        where: { id: enrollmentId },
        data: {
          status: EnrollmentStatus.FAILED,
          paymentStatus: "FAILED",
          failureReason: "Invalid signature",
          failedAt: new Date()
        }
      });
      return NextResponse.json({ message: "Payment verification failed. If amount was deducted, contact support." }, { status: 400 });
    }

    // Retrieve enrollment with course and user info
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        course: {
          include: {
            sections: {
              include: { lessons: true }
            }
          }
        },
        user: true,
        progress: true
      }
    });

    if (!existingEnrollment) {
      return NextResponse.json({ message: "This course is no longer available." }, { status: 404 });
    }

    const totalLessons = existingEnrollment.course.sections.reduce((sum, sec) => sum + sec.lessons.length, 0);

    // Activate enrollment
    const enrollment = await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        status: EnrollmentStatus.ACTIVE,
        paymentStatus: "COMPLETED",
        razorpayPaymentId: razorpay_payment_id,
        enrolledAt: new Date(),
        paidAt: new Date()
      }
    });

    // Write CouponUsage and increment Coupon redeemedCount for course enrollments
    const enrollMeta = existingEnrollment.metadata as any || {};
    if (enrollMeta.couponCode) {
      try {
        const coupon = await prisma.coupon.findUnique({
          where: { code: enrollMeta.couponCode.toUpperCase() }
        });
        if (coupon) {
          await prisma.couponUsage.create({
            data: {
              couponId: coupon.id,
              userId: existingEnrollment.userId,
              enrollmentId: enrollment.id,
              discountCents: enrollMeta.discountCents || 0,
            }
          });
          await prisma.coupon.update({
            where: { id: coupon.id },
            data: {
              redeemedCount: { increment: 1 }
            }
          });
        }
      } catch (couponErr) {
        console.error("Failed to log course enrollment coupon usage in verify route:", couponErr);
      }
    }

    // Create progress tracking if missing
    if (!existingEnrollment.progress) {
      try {
        await prisma.courseProgress.create({
          data: {
            enrollmentId: enrollment.id,
            progressPercent: 0,
            completedLessonsCount: 0,
            totalLessonsCount: totalLessons
          }
        });
      } catch (progressErr) {
        console.error("Failed to create course progress inside verify route:", progressErr);
      }
    }

    // Send welcome email
    try {
      await sendCourseEnrollmentEmail({
        userEmail: existingEnrollment.user.email,
        userName: existingEnrollment.user.name,
        courseTitle: existingEnrollment.course.title,
        courseId: existingEnrollment.course.id
      });
      
      await prisma.enrollment.update({
        where: { id: enrollment.id },
        data: { emailSentAt: new Date() }
      });
    } catch (emailErr) {
      console.error("Verification welcome email dispatch error:", emailErr);
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Course verify error:", err);
    return NextResponse.json({ message: "Something went wrong. Please refresh and try again." }, { status: 500 });
  }
}
