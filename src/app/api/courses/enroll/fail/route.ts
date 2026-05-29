import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { EnrollmentStatus } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { enrollmentId, reason } = await req.json();

    if (!enrollmentId) {
      return NextResponse.json({ message: "Enrollment ID is required." }, { status: 400 });
    }

    await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        status: EnrollmentStatus.FAILED,
        paymentStatus: "FAILED",
        failureReason: reason || "Payment failed",
        failedAt: new Date()
      }
    });

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Course fail route error:", err);
    return NextResponse.json({ message: "Something went wrong." }, { status: 500 });
  }
}
