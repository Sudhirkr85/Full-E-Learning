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

    const { courseId } = await req.json();
    if (!courseId) {
      return NextResponse.json({ message: "This course is no longer available." }, { status: 400 });
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course || course.status !== "PUBLISHED") {
      return NextResponse.json({ message: "This course is no longer available." }, { status: 404 });
    }

    const priceCents = course.priceCents || 0;
    if (priceCents <= 0) {
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

    // Create pending enrollment. Since previous enrollment may exist in non-active status,
    // let's handle upsert or create:
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
          paidAt: null
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
          amountPaid: Math.round(priceCents / 100)
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
