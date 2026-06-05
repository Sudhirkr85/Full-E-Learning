import type { Metadata } from "next";
import Link from "next/link";
import { EnrollmentStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { makeMetadata } from "@/lib/site";
import { getCurrentUser } from "@/lib/auth";
import { enrollInCourseAction, toggleLessonCompletionAction } from "@/lib/courses/actions";
import { getLessonPlayerBundle } from "@/lib/courses/access";

import { prisma } from "@/lib/prisma";
import { LessonPlayerClient } from "./lesson-player-client";

type LessonPlayerPageProps = {
  params: Promise<{
    slug: string;
    lessonSlug: string;
  }>;
  searchParams?: Promise<{
    attemptId?: string;
  }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: LessonPlayerPageProps): Promise<Metadata> {
  const { slug, lessonSlug } = await params;
  const bundle = await getLessonPlayerBundle(slug, lessonSlug);

  return makeMetadata({
    title: bundle.lesson?.title ?? lessonSlug.replaceAll("-", " "),
    description: bundle.lesson?.description ?? bundle.course?.description ?? "Protected lesson player with enrollment and progress tracking.",
    path: `/courses/${slug}/lessons/${lessonSlug}`,
    noIndex: true
  });
}

function getLessonHref(courseSlug: string, lessonSlug: string) {
  return `/courses/${courseSlug}/lessons/${lessonSlug}`;
}

import { 
  PlayCircle, 
  FileText, 
  Lock, 
  CheckCircle, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Trophy, 
  Download, 
  BookOpen, 
  ExternalLink,
  GraduationCap,
  Eye,
  Loader2
} from "lucide-react";

export default async function LessonPlayerPage({ params, searchParams }: LessonPlayerPageProps) {
  const { slug, lessonSlug } = await params;
  const sParams = searchParams ? await searchParams : undefined;
  const currentUser = await getCurrentUser();
  const bundle = await getLessonPlayerBundle(slug, lessonSlug, currentUser?.id);

  if (!bundle.course || !bundle.lesson) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden bg-grid-cyber flex items-center justify-center py-20 px-4">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full filter blur-[120px] pointer-events-none" />
        
        <div className="max-w-md w-full bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl relative z-10 text-center space-y-6">
          <div className="h-12 w-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-400">
            <Lock className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-extrabold tracking-wide text-white">Lesson Unavailable</h1>
            <p className="text-sm text-slate-400 leading-relaxed">The requested curriculum resource could not be found or has been restricted.</p>
          </div>
          <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-11 font-bold uppercase tracking-wider text-xs">
            <Link href={`/courses/${slug}`}>Back to Course</Link>
          </Button>
        </div>
      </div>
    );
  }

  const currentProgress = bundle.enrollment?.lessonProgresses.find((item) => item.lessonId === bundle.lesson?.id);
  const isCompleted = Boolean(currentProgress?.isCompleted);
  const canTrackProgress = Boolean(bundle.enrollment && bundle.canAccess && currentUser?.role === "STUDENT");

  if (!bundle.canAccess) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden bg-grid-cyber flex items-center justify-center py-20 px-4">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full filter blur-[120px] pointer-events-none" />
        
        <div className="max-w-lg w-full bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl relative z-10 text-center space-y-6">
          <div className="h-12 w-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400">
            <Lock className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
              LMS Locked Lesson
            </span>
            <h1 className="text-2xl font-black tracking-wide text-white pt-2">{bundle.lesson.title}</h1>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">This lesson is locked. Please purchase this course to unlock all lessons and start learning.</p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <button className="px-5 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl h-11 text-xs font-bold uppercase tracking-wider transition-all duration-200">
              <Link href={`/courses/${bundle.course.slug}`}>Go Back</Link>
            </button>

            {currentUser?.role === "STUDENT" ? (
              <Link 
                href={`/courses/${bundle.course.slug}?checkout=true`}
                className="inline-flex items-center justify-center w-full sm:w-auto px-6 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl h-11 text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all duration-200"
              >
                Buy Course to Unlock
              </Link>
            ) : (
              <button className="px-6 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl h-11 text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all duration-200">
                <Link href="/login">Sign in to Enroll</Link>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Fetch Quiz specifications if lesson contentType is QUIZ
  let quizTest = null;
  let quizAttempts: any[] = [];
  let quizActiveAttempt = null;
  let quizReviewAttempt = null;
  let quizQuestions: any[] = [];

  const activeAttemptId = sParams?.attemptId;

  if (bundle.lesson.contentType === "QUIZ") {
    const fullLesson = await prisma.lesson.findUnique({
      where: { id: bundle.lesson.id },
      select: { metadata: true }
    });
    const testId = (fullLesson?.metadata as any)?.testId;
    if (testId) {
      quizTest = await prisma.test.findUnique({
        where: { id: testId },
        include: {
          questions: {
            include: {
              options: true
            },
            orderBy: { orderIndex: "asc" }
          }
        }
      });

      if (quizTest && currentUser) {
        quizAttempts = await prisma.attempt.findMany({
          where: {
            testId: quizTest.id,
            userId: currentUser.id
          },
          orderBy: { attemptNumber: "desc" }
        });

        quizActiveAttempt = quizAttempts.find(att => att.status === "IN_PROGRESS") || null;

        if (activeAttemptId) {
          quizReviewAttempt = quizAttempts.find(att => att.id === activeAttemptId) || null;
        }

        const isTakingPhase = quizActiveAttempt && (!quizReviewAttempt || quizReviewAttempt.status === "IN_PROGRESS");
        
        quizQuestions = await Promise.all(quizTest.questions.map(async (q) => {
          const answers = activeAttemptId ? await prisma.attemptAnswer.findMany({
            where: { attemptId: activeAttemptId, questionId: q.id }
          }) : [];

          return {
            id: q.id,
            prompt: q.prompt,
            kind: q.kind,
            points: q.points,
            explanation: q.explanation,
            options: q.options.map((o) => ({
              id: o.id,
              label: o.label,
              isCorrect: isTakingPhase ? undefined : o.isCorrect,
              explanation: isTakingPhase ? undefined : o.explanation,
              value: o.value
            })),
            answers: answers.map(a => ({
              selectedOptionId: a.selectedOptionId,
              answerText: a.answerText,
              isCorrect: a.isCorrect,
              metadata: a.metadata
            }))
          };
        }));

        // Automatic lesson completion when passed
        if (quizReviewAttempt && quizReviewAttempt.scorePercent !== null && quizReviewAttempt.scorePercent >= quizTest.passingScore && bundle.enrollment) {
          const isLessonAlreadyCompleted = bundle.enrollment.lessonProgresses.some(lp => lp.lessonId === bundle.lesson?.id && lp.isCompleted);
          if (!isLessonAlreadyCompleted) {
            await prisma.lessonProgress.upsert({
              where: {
                enrollmentId_lessonId: {
                  enrollmentId: bundle.enrollment.id,
                  lessonId: bundle.lesson.id
                }
              },
              create: {
                enrollmentId: bundle.enrollment.id,
                lessonId: bundle.lesson.id,
                isCompleted: true,
                completedAt: new Date()
              },
              update: {
                isCompleted: true,
                completedAt: new Date()
              }
            });
          }
        }
      }
    }
  }

  const isEnrolled = Boolean(bundle.enrollment && (bundle.enrollment.status === "ACTIVE" || bundle.enrollment.status === "COMPLETED"));
  const isStaff = currentUser?.role === "ADMIN" || currentUser?.role === "TEACHER";
  const isGuest = !currentUser;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden bg-grid-cyber pb-20">
      {/* Cinematic glows */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent rounded-full filter blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-indigo-500/5 rounded-full filter blur-[120px] pointer-events-none" />

      <LessonPlayerClient
        slug={slug}
        lessonSlug={lessonSlug}
        currentUser={currentUser}
        bundle={bundle}
        isCompleted={isCompleted}
        canTrackProgress={canTrackProgress}
        quizTest={quizTest}
        quizAttempts={quizAttempts}
        quizActiveAttempt={quizActiveAttempt}
        quizReviewAttempt={quizReviewAttempt}
        quizQuestions={quizQuestions}
        isEnrolled={isEnrolled}
        isStaff={isStaff}
        isGuest={isGuest}
      />
    </div>
  );
}