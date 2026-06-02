import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { makeMetadata } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  PlayCircle, 
  CheckCircle2, 
  Circle, 
  Award, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  User, 
  ArrowLeft,
  Star,
  HelpCircle
} from "lucide-react";
import { toggleLessonCompletionAction } from "@/lib/courses/actions";
import { revalidatePath } from "next/cache";
import { getYoutubeEmbedUrl, getYoutubeVideoId } from "@/lib/utils";
import { CustomYoutubePlayer } from "@/components/custom-youtube-player";
import ClassroomQuizPortal from "./classroom-quiz-portal";

export const dynamic = "force-dynamic";

type LearnPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{
    lesson?: string;
    attemptId?: string;
  }>;
};

export async function generateMetadata({ params }: LearnPageProps): Promise<Metadata> {
  const { slug } = await params;
  return makeMetadata({
    title: "Classroom - Learning Player",
    description: "Access your protected course lessons, track progress, and earn certifications.",
    path: `/courses/${slug}/learn`,
    noIndex: true
  });
}

function isUUID(val: string) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(val);
}

export default async function LearnPage({ params, searchParams }: LearnPageProps) {
  const { slug: routeParam } = await params;
  const sParams = searchParams ? await searchParams : undefined;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/courses/${routeParam}/learn`);
  }

  // 1. Resolve Course (by slug or UUID id)
  const course = await prisma.course.findFirst({
    where: {
      OR: [
        isUUID(routeParam) ? { id: routeParam } : undefined,
        { slug: routeParam }
      ].filter(Boolean) as any
    },
    include: {
      sections: {
        where: { isPublished: true },
        orderBy: { orderIndex: "asc" },
        include: {
          lessons: {
            where: { isPublished: true },
            orderBy: { orderIndex: "asc" }
          }
        }
      },
      teachers: {
        include: { teacher: { select: { name: true } } }
      }
    }
  });

  if (!course) {
    redirect("/courses");
  }

  // 2. Access Control: Admins, teachers bypass. Students must be enrolled.
  const userRole = session.user.role;
  const isStaff = userRole === "ADMIN" || userRole === "TEACHER";

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId: course.id
      }
    },
    include: {
      progress: true,
      lessonProgresses: true,
      certificate: true
    }
  });

  const hasAccess = isStaff || (enrollment && (enrollment.status === "ACTIVE" || enrollment.status === "COMPLETED"));

  if (!hasAccess) {
    redirect(`/courses/${course.slug}`);
  }

  // 3. Flat lessons hierarchy for navigation
  const allLessons = course.sections.flatMap((s) => s.lessons);
  if (allLessons.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center p-6">
        <h2 className="text-xl font-bold">This course does not have any published lessons yet.</h2>
        <Button asChild className="mt-4 bg-indigo-600 hover:bg-indigo-500">
          <Link href={`/courses/${course.slug}`}>Back to Course</Link>
        </Button>
      </div>
    );
  }

  // 4. Resolve Active Lesson
  const completedLessonIds = new Set(
    enrollment?.lessonProgresses.filter((lp) => lp.isCompleted).map((lp) => lp.lessonId) || []
  );

  let activeLesson = allLessons[0];
  if (sParams?.lesson) {
    const matched = allLessons.find((l) => l.slug === sParams.lesson);
    if (matched) activeLesson = matched;
  } else if (enrollment) {
    // Default to the first incomplete lesson
    const firstIncomplete = allLessons.find((l) => !completedLessonIds.has(l.id));
    if (firstIncomplete) {
      activeLesson = firstIncomplete;
    }
  }

  const activeIndex = allLessons.findIndex((l) => l.id === activeLesson.id);
  const previousLesson = activeIndex > 0 ? allLessons[activeIndex - 1] : null;
  const nextLesson = activeIndex < allLessons.length - 1 ? allLessons[activeIndex + 1] : null;

  const isActiveCompleted = completedLessonIds.has(activeLesson.id);

  let quizTest = null;
  let quizAttempts: any[] = [];
  let quizActiveAttempt = null;
  let quizReviewAttempt = null;
  let quizQuestions: any[] = [];

  const activeAttemptId = sParams?.attemptId;

  if (activeLesson.contentType === "QUIZ") {
    const testId = (activeLesson.metadata as any)?.testId;
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

      if (quizTest) {
        quizAttempts = await prisma.attempt.findMany({
          where: {
            testId: quizTest.id,
            userId: session.user.id
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
              explanation: isTakingPhase ? undefined : o.explanation
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
        if (quizReviewAttempt && quizReviewAttempt.scorePercent !== null && quizReviewAttempt.scorePercent >= quizTest.passingScore && enrollment) {
          const isCompleted = completedLessonIds.has(activeLesson.id);
          if (!isCompleted) {
            await prisma.lessonProgress.upsert({
              where: {
                enrollmentId_lessonId: {
                  enrollmentId: enrollment.id,
                  lessonId: activeLesson.id
                }
              },
              create: {
                enrollmentId: enrollment.id,
                lessonId: activeLesson.id,
                isCompleted: true,
                completedAt: new Date()
              },
              update: {
                isCompleted: true,
                completedAt: new Date()
              }
            });
            completedLessonIds.add(activeLesson.id);
          }
        }
      }
    }
  }

  // 5. Calculate overall progress stats
  const totalLessonsCount = allLessons.length;
  const completedLessonsCount = completedLessonIds.size;
  const progressPercent = totalLessonsCount > 0 ? Math.round((completedLessonsCount / totalLessonsCount) * 100) : 0;

  // Handle Review submission in action
  const handleReviewSubmit = async (formData: FormData) => {
    "use server";
    const rating = parseInt(formData.get("rating")?.toString() || "5");
    const body = formData.get("reviewText")?.toString() || "";
    
    if (enrollment) {
      try {
        await prisma.courseReview.upsert({
          where: { enrollmentId: enrollment.id },
          create: {
            enrollmentId: enrollment.id,
            rating,
            body,
            status: "PUBLISHED"
          },
          update: {
            rating,
            body,
            status: "PUBLISHED"
          }
        });
        revalidatePath(`/courses/${course.slug}/learn`);
      } catch (err) {
        console.error("Failed to submit review:", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#06060a] text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="h-16 border-b border-white/5 bg-[#0a0a12]/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-40 shrink-0">
        <div className="flex items-center gap-3">
          <Link href={`/courses/${course.slug}`} className="text-slate-400 hover:text-white transition">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex flex-col">
            <span className="text-xs text-indigo-400 font-bold uppercase tracking-widest font-mono">Classroom Player</span>
            <h1 className="text-sm font-extrabold text-white line-clamp-1">{course.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs text-slate-400 font-medium">{progressPercent}% Completed</span>
            <span className="text-[10px] text-slate-500 font-mono">{completedLessonsCount}/{totalLessonsCount} Lessons</span>
          </div>
          <div className="w-24 h-2 bg-slate-900 rounded-full overflow-hidden border border-white/[0.03] hidden sm:block">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col md:grid md:grid-cols-[1fr_360px] overflow-hidden">
        {/* Left Side: Lesson Viewer */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Active Content Viewer */}
            {activeLesson.contentType === "QUIZ" ? (
              quizTest ? (
                <ClassroomQuizPortal
                  phase={
                    quizReviewAttempt 
                      ? (quizReviewAttempt.status === "IN_PROGRESS" ? "taking" : "review")
                      : (quizActiveAttempt ? "taking" : "overview")
                  }
                  courseSlug={course.slug}
                  lessonSlug={activeLesson.slug}
                  test={{
                    id: quizTest.id,
                    title: quizTest.title,
                    description: quizTest.description,
                    type: quizTest.type,
                    passingScore: quizTest.passingScore,
                    timeLimitMinutes: quizTest.timeLimitMinutes,
                    attemptLimit: quizTest.attemptLimit,
                    courseId: course.id
                  }}
                  attempts={quizAttempts}
                  activeAttempt={quizActiveAttempt}
                  reviewAttempt={quizReviewAttempt}
                  questions={quizQuestions}
                  onRefresh={async () => {
                    "use server";
                    revalidatePath(`/courses/${course.slug}/learn`);
                  }}
                />
              ) : (
                <div className="w-full flex flex-col items-center justify-center gap-2 text-slate-500 py-16 border border-dashed border-white/10 rounded-2xl">
                  <HelpCircle className="h-12 w-12 text-slate-600" />
                  <span>This Quiz Lesson has not been configured with any questions yet.</span>
                </div>
              )
            ) : (
              <div className="aspect-video w-full overflow-hidden rounded-2xl border border-white/5 bg-[#030306] relative shadow-2xl">
                {activeLesson.youtubeUrl && getYoutubeVideoId(activeLesson.youtubeUrl) ? (
                  <CustomYoutubePlayer 
                    videoId={getYoutubeVideoId(activeLesson.youtubeUrl)!} 
                    title={activeLesson.title} 
                  />
                ) : activeLesson.r2AssetUrl ? (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-6 text-center">
                    <BookOpen className="h-16 w-16 text-indigo-400" />
                    <h3 className="text-lg font-bold">This lesson contains a digital article playbook.</h3>
                    <p className="text-sm text-slate-400 max-w-sm">Use the link below to open this protected study resource.</p>
                    <Button asChild className="bg-indigo-600 hover:bg-indigo-500">
                      <a href={activeLesson.r2AssetUrl} target="_blank" rel="noreferrer">Open Lesson Playbook</a>
                    </Button>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-500">
                    <PlayCircle className="h-12 w-12" />
                    <span>No primary video asset has been published for this lesson.</span>
                  </div>
                )}
              </div>
            )}

            {/* Lesson Title & Actions Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
              <div className="space-y-1.5 text-left">
                <Badge variant="secondary" className="bg-indigo-950/60 border-indigo-500/20 text-indigo-300 capitalize text-xs">
                  Lesson {activeIndex + 1} • {activeLesson.contentType.toLowerCase()}
                </Badge>
                <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">{activeLesson.title}</h2>
                <p className="text-sm text-slate-400">{activeLesson.description ?? "Access the complete sandbox instructions below."}</p>
              </div>

              {/* Progress Tracking Action */}
              {enrollment && userRole === "STUDENT" && (
                <form action={toggleLessonCompletionAction} className="shrink-0 text-left">
                  <input type="hidden" name="courseId" value={course.id} />
                  <input type="hidden" name="lessonId" value={activeLesson.id} />
                  <input type="hidden" name="completed" value={isActiveCompleted ? "false" : "true"} />
                  <Button 
                    type="submit" 
                    className={`h-10 rounded-xl font-bold px-5 uppercase tracking-wide text-xs ${
                      isActiveCompleted 
                        ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20" 
                        : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/10"
                    }`}
                  >
                    {isActiveCompleted ? "✓ Completed" : "Mark Complete"}
                  </Button>
                </form>
              )}
            </div>

            {/* Curriculum Chronological Navigation */}
            <div className="flex items-center justify-between gap-4 border-t border-white/5 pt-4">
              {previousLesson ? (
                <Button asChild variant="outline" className="border-white/5 bg-slate-950/40 text-slate-300 hover:text-white rounded-xl">
                  <Link href={`/courses/${course.slug}/learn?lesson=${previousLesson.slug}`} className="flex items-center gap-1.5">
                    <ChevronLeft className="h-4 w-4" /> Prev Lesson
                  </Link>
                </Button>
              ) : (
                <div />
              )}
              {nextLesson ? (
                <Button asChild variant="outline" className="border-white/5 bg-slate-950/40 text-slate-300 hover:text-white rounded-xl">
                  <Link href={`/courses/${course.slug}/learn?lesson=${nextLesson.slug}`} className="flex items-center gap-1.5">
                    Next Lesson <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <div />
              )}
            </div>

            {/* Celebration Card / 100% Completion Block */}
            {progressPercent === 100 && enrollment && (
              <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/40 to-slate-950/40 p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0 animate-bounce">
                    <Award className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-white">Congratulations! You finished the course!</h3>
                    <p className="text-xs text-slate-400">Your digital blockchain-verified certification is generated successfully.</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {enrollment.certificate ? (
                    <Button asChild className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold">
                      <Link href={`/certificates/verify/${enrollment.certificate.verificationCode}`} target="_blank">
                        View Certificate
                      </Link>
                    </Button>
                  ) : (
                    <span className="text-xs text-slate-500 italic">Certificate generation is complete. Refresh to download.</span>
                  )}
                </div>

                {/* Review Prompt Form */}
                <form action={handleReviewSubmit} className="border-t border-white/5 pt-4 space-y-3">
                  <h4 className="text-sm font-bold text-white">Share Your Feedback</h4>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <label key={star} className="cursor-pointer">
                        <input type="radio" name="rating" value={star} className="hidden" defaultChecked={star === 5} />
                        <Star className="h-5 w-5 text-amber-400 fill-amber-400 hover:scale-110 transition" />
                      </label>
                    ))}
                  </div>
                  <textarea
                    name="reviewText"
                    placeholder="Tell us what you liked or how we can improve this study curriculum..."
                    className="w-full bg-slate-950/80 border border-white/10 rounded-xl p-3 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white min-h-[70px]"
                  />
                  <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-500">
                    Submit Review
                  </Button>
                </form>
              </div>
            )}
          </div>
        </main>

        {/* Right Side: Curriculum Sidebar */}
        <aside className="border-t md:border-t-0 md:border-l border-white/5 bg-[#08080f] overflow-y-auto shrink-0 z-30">
          <div className="p-4 border-b border-white/5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Course Syllabus</h3>
            <span className="text-[10px] text-slate-500">{course.sections.length} modules · {totalLessonsCount} lessons</span>
          </div>

          <div className="divide-y divide-white/[0.03]">
            {course.sections.map((section) => (
              <div key={section.id} className="p-3 space-y-1.5 text-left">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{section.title}</span>
                <div className="space-y-1">
                  {section.lessons.map((lesson) => {
                    const isLessonActive = lesson.id === activeLesson.id;
                    const isLessonCompleted = completedLessonIds.has(lesson.id);

                    return (
                      <Link
                        key={lesson.id}
                        href={`/courses/${course.slug}/learn?lesson=${lesson.slug}`}
                        className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-left transition ${
                          isLessonActive 
                            ? "bg-indigo-600/10 border border-indigo-500/20 text-white font-medium" 
                            : "hover:bg-white/[0.02] text-slate-400 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {isLessonCompleted ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                          ) : (
                            <Circle className="h-4 w-4 text-slate-600 shrink-0" />
                          )}
                          <span className="text-xs line-clamp-1">{lesson.title}</span>
                        </div>
                        <span className="text-[9px] uppercase font-mono text-slate-600 shrink-0">
                          {lesson.contentType.toLowerCase()}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
