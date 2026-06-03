import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { EnrollmentStatus } from "@prisma/client";
import { sendEnrollmentEmail } from "@/lib/email/service";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = await request.json();
    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required." }, { status: 400 });
    }

    // 1. Fetch course details
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        sections: {
          include: {
            lessons: true
          }
        }
      }
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    // 2. Check duplicate enrollment
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: course.id
        }
      }
    });

    if (existingEnrollment) {
      return NextResponse.json({ error: "Already enrolled in this course." }, { status: 400 });
    }

    const totalLessons = course.sections.reduce((sum, sec) => sum + sec.lessons.length, 0);

    // 3. Atomically create active free enrollment
    const newEnrollment = await prisma.enrollment.create({
      data: {
        userId: session.user.id,
        courseId: course.id,
        status: EnrollmentStatus.ACTIVE,
        progress: {
          create: {
            progressPercent: 0,
            completedLessonsCount: 0,
            totalLessonsCount: totalLessons
          }
        }
      }
    });

    // 4. Send background notification email
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      await sendEnrollmentEmail(session.user.email!, session.user.name || "Student", {
        name: session.user.name || "Student",
        courseTitle: course.title,
        courseSlug: course.slug,
        appUrl
      });
    } catch (emailErr) {
      console.error("[EMAIL_DISPATCH_FREE_ERROR]", emailErr);
    }

    return NextResponse.json({
      success: true,
      redirectUrl: `/order/${newEnrollment.id}/confirmation`
    });
  } catch (err: any) {
    console.error("[FREE_CHECKOUT_API_ERROR]", err);
    return NextResponse.json(
      { error: err.message || "Failed to process enrollment." },
      { status: 500 }
    );
  }
}
