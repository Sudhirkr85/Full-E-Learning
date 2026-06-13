import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const session = await auth();

    // Fetch the course with its sections and lessons
    const course = await prisma.course.findUnique({
      where: { slug },
      include: {
        sections: {
          orderBy: { orderIndex: "asc" },
          include: {
            lessons: {
              orderBy: { orderIndex: "asc" },
            }
          }
        }
      }
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // If logged in, fetch user's lesson progress to mark completed lessons
    let completedLessonIds: string[] = [];
    if (session?.user?.id) {
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: session.user.id,
            courseId: course.id,
          }
        },
        include: {
          lessonProgresses: {
            where: { isCompleted: true }
          }
        }
      });

      if (enrollment) {
        completedLessonIds = enrollment.lessonProgresses.map(lp => lp.lessonId);
      }
    }

    // Map course data structure for mobile app compatibility
    const sections = course.sections.map(section => ({
      id: section.id,
      title: section.title,
      lessons: section.lessons.map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        slug: lesson.slug,
        contentType: lesson.contentType,
        youtubeUrl: lesson.youtubeUrl,
        r2AssetUrl: lesson.r2AssetUrl,
        isPreview: lesson.isPreview,
        isCompleted: completedLessonIds.includes(lesson.id),
      }))
    }));

    return NextResponse.json({
      course: {
        id: course.id,
        title: course.title,
        slug: course.slug,
        sections,
      }
    });
  } catch (err: any) {
    console.error("[GET_SYLLABUS_ERROR]", err);
    return NextResponse.json(
      { error: err.message || "Something went wrong." },
      { status: 500 }
    );
  }
}
