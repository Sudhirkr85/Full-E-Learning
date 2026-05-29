import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ courseId: string }> }) {
  try {
    const { courseId } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ enrolled: false, status: null, paymentStatus: null });
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId
        }
      },
      select: { status: true, paymentStatus: true }
    });

    return NextResponse.json({
      enrolled: enrollment?.status === "ACTIVE",
      status: enrollment?.status || null,
      paymentStatus: enrollment?.paymentStatus || null
    });

  } catch (err) {
    console.error("Enrollment status check error:", err);
    return NextResponse.json({ enrolled: false, status: null, paymentStatus: null });
  }
}
