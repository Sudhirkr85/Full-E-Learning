import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { makeMetadata } from "@/lib/site";
import { requireRole } from "@/lib/auth";
import { 
  getStudentTestOverview, 
  getStudentTestTakingBundle, 
  getStudentAttemptReview 
} from "@/lib/tests/queries";
import { prisma } from "@/lib/prisma";
import TestPortalClient from "./test-portal-client";

type TestPortalPageProps = {
  params: Promise<{
    slug: string;
    testSlug: string;
  }>;
  searchParams: Promise<{
    attemptId?: string;
  }>;
};

export async function generateMetadata({ params }: TestPortalPageProps): Promise<Metadata> {
  const { testSlug } = await params;
  return makeMetadata({
    title: `Assessment Portal`,
    description: "Interactive timed assessment taking and automated grading system.",
    path: `/courses/tests/${testSlug}`,
    noIndex: true
  });
}

export const dynamic = "force-dynamic";

export default async function TestPortalPage({ params, searchParams }: TestPortalPageProps) {
  const student = await requireRole(["STUDENT", "TEACHER", "ADMIN"]);
  const { slug, testSlug } = await params;
  const { attemptId } = await searchParams;

  // ----------------------------------------------------
  // ACTIVE TAKING / REVIEW DYNAMIC ROUTING
  // ----------------------------------------------------
  if (attemptId) {
    const attempt = await prisma.attempt.findUnique({
      where: { id: attemptId },
      include: {
        test: {
          select: {
            id: true,
            courseId: true,
          }
        }
      }
    });

    if (!attempt) {
      return (
        <section className="py-16 md:py-24">
          <Container>
            <Badge variant="secondary">Attempt not found</Badge>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-5xl">Session expired</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
              This quiz attempt session could not be retrieved. Please go back and start a new attempt.
            </p>
            <Button className="mt-6" asChild>
              <Link href={`/courses/${slug}`}>Back to course</Link>
            </Button>
          </Container>
        </section>
      );
    }

    const isStaff = student.role === "TEACHER" || student.role === "ADMIN";
    const isOwner = attempt.userId === student.id;

    // Verify course access / staff access
    if (!isOwner && !isStaff) {
      const isCourseTeacher = await prisma.courseTeacher.findFirst({
        where: {
          courseId: attempt.test.courseId,
          teacherId: student.id,
        },
      });

      if (!isCourseTeacher) {
        return (
          <section className="py-16 md:py-24">
            <Container>
              <Badge variant="secondary">Unauthorized</Badge>
              <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">Access Restricted</h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
                You do not have permission to view or review this attempt.
              </p>
              <Button className="mt-6" asChild>
                <Link href={`/courses/${slug}`}>Back to course</Link>
              </Button>
            </Container>
          </section>
        );
      }
    }

    if (attempt.status === "IN_PROGRESS") {
      // ----------------------------------------------------
      // ACTIVE TAKING PHASE (SECURE BUNDLE - STRIPPED ANSWER FLAGS)
      // ----------------------------------------------------
      const bundle = await getStudentTestTakingBundle(slug, testSlug, attemptId, attempt.userId);
      if (!bundle) {
        return (
          <section className="py-16 md:py-24">
            <Container>
              <Badge variant="secondary">Bundle unavailable</Badge>
              <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">Questions not found</h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
                We failed to load questions for this quiz session securely.
              </p>
              <Button className="mt-6" asChild>
                <Link href={`/courses/${slug}`}>Back to course</Link>
              </Button>
            </Container>
          </section>
        );
      }

      return (
        <TestPortalClient
          phase="taking"
          courseSlug={slug}
          testSlug={testSlug}
          test={{
            id: bundle.attempt.test.id,
            title: bundle.attempt.test.title,
            description: null,
            type: "QUIZ",
            passingScore: 70,
            timeLimitMinutes: bundle.attempt.test.timeLimitMinutes,
            attemptLimit: null,
          }}
          isEnrolled={true}
          activeAttempt={{
            id: bundle.attempt.id,
            testId: bundle.attempt.testId,
            status: bundle.attempt.status,
            attemptNumber: bundle.attempt.attemptNumber,
            startedAt: bundle.attempt.startedAt,
            submittedAt: bundle.attempt.submittedAt,
            scorePercent: bundle.attempt.scorePercent,
            correctAnswersCount: bundle.attempt.correctAnswersCount,
            totalQuestionsCount: bundle.attempt.totalQuestionsCount,
            timeSpentSeconds: bundle.attempt.timeSpentSeconds,
          }}
          questions={bundle.questions.map((q) => ({
            id: q.id,
            prompt: q.prompt,
            kind: q.kind,
            points: q.points,
            options: q.options.map((o) => ({
              id: o.id,
              label: o.label,
            })),
          }))}
        />
      );
    } else {
      // ----------------------------------------------------
      // GRADED REVIEW PHASE (FULL DETAILS - CORRECT MARKERS + FEEDBACK)
      // ----------------------------------------------------
      const review = await getStudentAttemptReview(attemptId, student.id);
      if (!review) {
        return (
          <section className="py-16 md:py-24">
            <Container>
              <Badge variant="secondary">Review blocked</Badge>
              <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">Security Block</h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
                This attempt has not been graded or is locked.
              </p>
              <Button className="mt-6" asChild>
                <Link href={`/courses/${slug}`}>Back to course</Link>
              </Button>
            </Container>
          </section>
        );
      }

      return (
        <TestPortalClient
          phase="review"
          courseSlug={slug}
          testSlug={testSlug}
          test={{
            id: review.attempt.test.id,
            title: review.attempt.test.title,
            description: null,
            type: "QUIZ",
            passingScore: review.attempt.test.passingScore,
            timeLimitMinutes: null,
            attemptLimit: null,
          }}
          isEnrolled={true}
          reviewAttempt={{
            id: review.attempt.id,
            testId: review.attempt.testId,
            status: review.attempt.status,
            attemptNumber: review.attempt.attemptNumber,
            startedAt: review.attempt.startedAt,
            submittedAt: review.attempt.submittedAt,
            scorePercent: review.attempt.scorePercent,
            correctAnswersCount: review.attempt.correctAnswersCount,
            totalQuestionsCount: review.attempt.totalQuestionsCount,
            timeSpentSeconds: review.attempt.timeSpentSeconds,
          }}
          questions={review.questions.map((q) => ({
            id: q.id,
            prompt: q.prompt,
            kind: q.kind,
            points: q.points,
            explanation: q.explanation,
            options: q.options.map((o) => ({
              id: o.id,
              label: o.label,
              isCorrect: o.isCorrect,
              explanation: o.explanation,
            })),
            answers: q.answers.map((a) => ({
              selectedOptionId: a.selectedOptionId,
              answerText: a.answerText,
              isCorrect: a.isCorrect,
              metadata: a.metadata,
            })),
          }))}
        />
      );
    }
  }

  // ----------------------------------------------------
  // OVERVIEW PHASE (DEFAULT LANDING PRE-ATTEMPT)
  // ----------------------------------------------------
  const overview = await getStudentTestOverview(slug, testSlug, student.id);
  if (!overview) {
    return (
      <section className="py-16 md:py-24">
        <Container>
          <Badge variant="secondary">Assessment not found</Badge>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-5xl">Quiz Unavailable</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
            This quiz is draft only, belongs to an unpublished course, or has been removed.
          </p>
          <Button className="mt-6" asChild>
            <Link href={`/courses/${slug}`}>Back to course</Link>
          </Button>
        </Container>
      </section>
    );
  }

  // Check if they are a course teacher or admin
  const isTeacherOrAdmin = student.role === "TEACHER" || student.role === "ADMIN";
  const isEnrolled = overview.isEnrolled || isTeacherOrAdmin;

  return (
    <TestPortalClient
      phase="overview"
      courseSlug={slug}
      testSlug={testSlug}
      test={{
        id: overview.test.id,
        courseId: overview.test.courseId,
        title: overview.test.title,
        description: overview.test.description,
        type: overview.test.type,
        passingScore: overview.test.passingScore,
        timeLimitMinutes: overview.test.timeLimitMinutes,
        attemptLimit: overview.test.attemptLimit,
      }}
      isEnrolled={isEnrolled}
      attempts={overview.attempts.map((att) => ({
        id: att.id,
        testId: att.testId,
        status: att.status,
        attemptNumber: att.attemptNumber,
        startedAt: att.startedAt,
        submittedAt: att.submittedAt,
        scorePercent: att.scorePercent,
        correctAnswersCount: att.correctAnswersCount,
        totalQuestionsCount: att.totalQuestionsCount,
        timeSpentSeconds: att.timeSpentSeconds,
      }))}
    />
  );
}
