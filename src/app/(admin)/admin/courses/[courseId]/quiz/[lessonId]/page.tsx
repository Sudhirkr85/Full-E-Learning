import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { makeMetadata } from "@/lib/site";
import { QuizEditorPageClient } from "@/components/courses/quiz-editor-page-client";

export const metadata: Metadata = makeMetadata({
  title: "Quiz Editor - Admin Desk",
  description: "Configure quiz questions, options, point weights, and passing thresholds.",
  path: "/admin/courses",
  noIndex: true
});

type AdminQuizEditPageProps = {
  params: Promise<{
    courseId: string;
    lessonId: string;
  }>;
};

export default async function AdminQuizEditPage({ params }: AdminQuizEditPageProps) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const { courseId, lessonId } = await params;

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
      role="ADMIN" 
    />
  );
}
