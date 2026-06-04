import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { makeMetadata } from "@/lib/site";
import { requireRole } from "@/lib/auth";
import { QuizEditorPageClient } from "@/components/courses/quiz-editor-page-client";

export const metadata: Metadata = makeMetadata({
  title: "Quiz Editor - Teacher Desk",
  description: "Configure quiz questions, options, point weights, and passing thresholds.",
  path: "/teacher/courses",
  noIndex: true
});

type TeacherQuizEditPageProps = {
  params: Promise<{
    courseId: string;
    lessonId: string;
  }>;
};

export default async function TeacherQuizEditPage({ params }: TeacherQuizEditPageProps) {
  const teacher = await requireRole(["TEACHER"]);
  const { courseId, lessonId } = await params;

  // Query the course to verify teacher is assigned to it
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      teachers: {
        include: {
          teacher: true
        }
      }
    }
  });

  if (!course) {
    notFound();
  }

  // Auth/ownership guard: Verify teacher is assigned to this course
  const isAssigned = course.teachers.some((t) => t.teacher.id === teacher.id);
  if (!isAssigned) {
    redirect("/teacher/dashboard");
  }

  // Query the lesson
  const lesson = await prisma.lesson.findFirst({
    where: { 
      id: lessonId,
      section: {
        courseId: courseId
      }
    }
  });

  if (!lesson || lesson.contentType !== "QUIZ") {
    notFound();
  }

  // Find the associated test
  const testId = (lesson.metadata as any)?.testId;
  const test = await prisma.test.findFirst({
    where: {
      courseId,
      OR: [
        ...(testId ? [{ id: testId }] : []),
        { slug: { contains: lesson.slug } }
      ]
    },
    include: {
      questions: {
        include: {
          options: true
        },
        orderBy: { orderIndex: "asc" }
      }
    }
  });

  if (!test) {
    notFound();
  }

  return (
    <QuizEditorPageClient 
      courseId={courseId} 
      lesson={lesson} 
      test={test} 
      role="TEACHER" 
    />
  );
}
