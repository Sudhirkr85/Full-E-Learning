import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { razorpay } from "@/lib/razorpay";
import { EnrollmentStatus } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Please login to enroll in this course." }, { status: 401 });
    }

    const { courseId, couponCode } = await req.json();
    if (!courseId) {
      return NextResponse.json({ message: "This course is no longer available." }, { status: 400 });
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course || course.status !== "PUBLISHED") {
      return NextResponse.json({ message: "This course is no longer available." }, { status: 404 });
    }

    const originalPriceCents = course.priceCents || 0;
    if (originalPriceCents <= 0) {
      return NextResponse.json({ message: "This is a free course. Please use free enrollment." }, { status: 400 });
    }

    // Check already enrolled and active
    const existing = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId
        }
      }
    });

    if (existing && existing.status === "ACTIVE") {
      return NextResponse.json({ message: "You are already enrolled in this course." }, { status: 400 });
    }

    // Process Coupon discount
    let discountCents = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase() },
        include: {
          usages: {
            where: { userId: session.user.id }
          }
        }
      });

      if (!coupon || !coupon.isActive) {
        return NextResponse.json({ message: "This coupon is invalid or expired." }, { status: 400 });
      }

      const now = new Date();
      if (coupon.startsAt && now < new Date(coupon.startsAt)) {
        return NextResponse.json({ message: "This coupon is not active yet." }, { status: 400 });
      }
      if (coupon.endsAt && now > new Date(coupon.endsAt)) {
        return NextResponse.json({ message: "This coupon is invalid or expired." }, { status: 400 });
      }

      if (coupon.maxRedemptions !== null && coupon.redeemedCount >= coupon.maxRedemptions) {
        return NextResponse.json({ message: "This coupon is invalid or expired." }, { status: 400 });
      }

      const userLimit = coupon.perUserLimit ?? 1;
      if (coupon.usages.length >= userLimit) {
        return NextResponse.json({ message: "You have already used this coupon." }, { status: 400 });
      }

      if (coupon.minimumOrderAmountCents !== null && originalPriceCents < coupon.minimumOrderAmountCents) {
        return NextResponse.json({ message: `Minimum order amount of ₹${(coupon.minimumOrderAmountCents / 100).toFixed(0)} is required.` }, { status: 400 });
      }

      // Scope verification
      if (coupon.appliesTo !== "ALL" && coupon.appliesTo !== "COURSES" && coupon.appliesTo !== "SPECIFIC_COURSES") {
        return NextResponse.json({ message: "This coupon is not applicable to course enrollments." }, { status: 400 });
      }
      if (coupon.appliesTo === "SPECIFIC_COURSES") {
        const matches = (coupon.appliesToIds || []).includes(courseId);
        if (!matches) {
          return NextResponse.json({ message: "This coupon is not applicable to this course." }, { status: 400 });
        }
      }

      if (coupon.couponType === 'PERCENTAGE') {
        const calc = Math.floor(originalPriceCents * coupon.discountValue / 100);
        discountCents = coupon.maxDiscountCents !== null ? Math.min(calc, coupon.maxDiscountCents) : calc;
      } else {
        discountCents = coupon.discountValue;
      }
    }

    const priceCents = Math.max(originalPriceCents - discountCents, 0);

    // Create Razorpay order
    const orderNumber = `ENR_${Date.now()}_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const razorpayOrder = await razorpay.orders.create({
      amount: priceCents,
      currency: "INR",
      receipt: orderNumber,
      notes: {
        courseId,
        userId: session.user.id
      }
    });

    // Create pending enrollment. Save coupon information in JSON metadata
    const metadata = {
      couponCode: couponCode || null,
      discountCents,
      originalPriceCents
    };

    let enrollment;
    if (existing) {
      enrollment = await prisma.enrollment.update({
        where: { id: existing.id },
        data: {
          status: EnrollmentStatus.PENDING,
          paymentStatus: "PENDING",
          razorpayOrderId: razorpayOrder.id,
          amountPaid: Math.round(priceCents / 100),
          failureReason: null,
          failedAt: null,
          paidAt: null,
          metadata
        }
      });
    } else {
      enrollment = await prisma.enrollment.create({
        data: {
          userId: session.user.id,
          courseId,
          status: EnrollmentStatus.PENDING,
          paymentStatus: "PENDING",
          razorpayOrderId: razorpayOrder.id,
          amountPaid: Math.round(priceCents / 100),
          metadata
        }
      });
    }

    return NextResponse.json({
      razorpayOrderId: razorpayOrder.id,
      enrollmentId: enrollment.id,
      amount: priceCents
    });

  } catch (err) {
    console.error("Course checkout error:", err);
    return NextResponse.json({ message: "Something went wrong. Please refresh and try again." }, { status: 500 });
  }
}
