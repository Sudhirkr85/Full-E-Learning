import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { syncCourseProgress } from "@/lib/courses/actions";
import { EnrollmentStatus } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId, lessonId, isCompleted } = await req.json();

    if (!courseId || !lessonId) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Verify user is enrolled in the course
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId,
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json({ error: "Enrollment not found." }, { status: 404 });
    }

    // Update or create LessonProgress
    const now = new Date();
    await prisma.lessonProgress.upsert({
      where: {
        enrollmentId_lessonId: {
          enrollmentId: enrollment.id,
          lessonId,
        },
      },
      create: {
        enrollmentId: enrollment.id,
        lessonId,
        isCompleted: !!isCompleted,
        completedAt: isCompleted ? now : null,
        lastViewedAt: now,
      },
      update: {
        isCompleted: !!isCompleted,
        completedAt: isCompleted ? now : null,
        lastViewedAt: now,
      },
    });

    // Synchronize overall course progress stats
    await syncCourseProgress(enrollment.id, courseId, lessonId);

    // Fetch the updated progress to return
    const updatedProgress = await prisma.courseProgress.findUnique({
      where: { enrollmentId: enrollment.id },
    });

    return NextResponse.json({
      success: true,
      progress: updatedProgress,
    });
  } catch (err: any) {
    console.error("[PROGRESS_UPDATE_ERROR]", err);
    return NextResponse.json(
      { error: err.message || "Something went wrong." },
      { status: 500 }
    );
  }
}
