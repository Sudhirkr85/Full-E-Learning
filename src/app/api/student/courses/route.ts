import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "STUDENT") {
      return NextResponse.json({ error: "Forbidden: Students only" }, { status: 403 });
    }

    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId: session.user.id,
        status: "ACTIVE"
      },
      include: {
        course: {
          include: {
            teachers: {
              include: {
                teacher: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        }
      }
    });

    const courses = enrollments.map(e => ({
      ...e.course,
      isEnrolled: true,
      progressPercent: e.metadata && (e.metadata as any).progressPercent ? (e.metadata as any).progressPercent : 0
    }));

    return NextResponse.json({ courses });
  } catch (err: any) {
    console.error("[GET_STUDENT_COURSES_API_ERROR]", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
