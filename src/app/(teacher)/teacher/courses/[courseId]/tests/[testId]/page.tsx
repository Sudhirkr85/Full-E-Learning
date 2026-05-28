import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { makeMetadata } from "@/lib/site";
import { requireRole } from "@/lib/auth";
import { getTeacherTestEditor } from "@/lib/tests/queries";
import { prisma } from "@/lib/prisma";
import TestEditorTabs from "./test-editor-tabs";

type TestEditorPageProps = {
  params: Promise<{
    courseId: string;
    testId: string;
  }>;
};

export async function generateMetadata({ params }: TestEditorPageProps): Promise<Metadata> {
  const { testId } = await params;
  return makeMetadata({
    title: `Assessment Builder`,
    description: "Manage questions, configure settings, and review student grades for this assessment.",
    path: `/teacher/courses/tests/${testId}`,
    noIndex: true
  });
}

export const dynamic = "force-dynamic";

export default async function TestEditorPage({ params }: TestEditorPageProps) {
  const teacher = await requireRole(["TEACHER"]);
  const { courseId, testId } = await params;

  // Retrieve test editor bundle (including questions and options) with course access assertion
  const test = await getTeacherTestEditor(testId, teacher.id);

  if (!test) {
    return (
      <section className="py-16 md:py-24">
        <Container>
          <Badge variant="secondary">Assessment not found</Badge>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-5xl">Assessment unavailable</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
            You do not have access to this assessment, or it does not exist.
          </p>
          <Button className="mt-6" asChild>
            <Link href={`/teacher/courses/${courseId}/tests`}>Back to assessments</Link>
          </Button>
        </Container>
      </section>
    );
  }

  // Fetch sections in this course for links
  const sections = await prisma.courseSection.findMany({
    where: { courseId },
    orderBy: { orderIndex: "asc" },
    select: {
      id: true,
      title: true,
      orderIndex: true,
    },
  });

  // Fetch student attempts
  const attempts = await prisma.attempt.findMany({
    where: { testId },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: { startedAt: "desc" },
  });

  return (
    <section className="py-10">
      <Container>
        <TestEditorTabs
          test={{
            id: test.id,
            courseId: test.courseId,
            sectionId: test.sectionId,
            title: test.title,
            description: test.description,
            type: test.type,
            passingScore: test.passingScore,
            timeLimitMinutes: test.timeLimitMinutes,
            attemptLimit: test.attemptLimit,
            shuffleQuestions: test.shuffleQuestions,
            isPublished: test.isPublished,
          }}
          sections={sections}
          questions={test.questions}
          attempts={attempts.map(att => ({
            id: att.id,
            attemptNumber: att.attemptNumber,
            startedAt: att.startedAt,
            submittedAt: att.submittedAt,
            status: att.status,
            scorePercent: att.scorePercent,
            correctAnswersCount: att.correctAnswersCount,
            totalQuestionsCount: att.totalQuestionsCount,
            timeSpentSeconds: att.timeSpentSeconds,
            user: {
              name: att.user.name,
              email: att.user.email,
            }
          }))}
          courseId={courseId}
        />
      </Container>
    </section>
  );
}
