import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendCourseEnrollmentEmail } from "@/lib/email/brevo";

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

    // Check course exists and is published
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

    if (!course || course.status !== "PUBLISHED") {
      return NextResponse.json({ message: "This course is no longer available." }, { status: 404 });
    }

    const price = course.priceCents ? Math.round(course.priceCents / 100) : 0;
    if (price > 0) {
      return NextResponse.json({ message: "This is a paid course." }, { status: 400 });
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

    const totalLessons = course.sections.reduce((sum, sec) => sum + sec.lessons.length, 0);

    // Create or update enrollment to ACTIVE
    let activeEnrollmentId = existing ? existing.id : "";
    await prisma.$transaction(async (tx) => {
      if (existing) {
        const updated = await tx.enrollment.update({
          where: { id: existing.id },
          data: {
            status: "ACTIVE",
            paymentStatus: "FREE",
            enrolledAt: new Date(),
            amountPaid: 0
          }
        });
        activeEnrollmentId = updated.id;
      } else {
        const created = await tx.enrollment.create({
          data: {
            userId: session.user.id,
            courseId,
            status: "ACTIVE",
            paymentStatus: "FREE",
            enrolledAt: new Date(),
            amountPaid: 0,
            progress: {
              create: {
                progressPercent: 0,
                completedLessonsCount: 0,
                totalLessonsCount: totalLessons
              }
            }
          }
        });
        activeEnrollmentId = created.id;
      }
    });

    // Send welcome email
    try {
      await sendCourseEnrollmentEmail({
        userEmail: session.user.email || "",
        userName: session.user.name || "Student",
        courseTitle: course.title,
        courseId: course.id
      });
    } catch (emailErr) {
      console.error("Free enrollment email dispatch error:", emailErr);
    }

    return NextResponse.json({ success: true, enrollmentId: activeEnrollmentId });
  } catch (err) {
    console.error("Free enrollment error:", err);
    return NextResponse.json({ message: "Something went wrong. Please refresh and try again." }, { status: 500 });
  }
}
