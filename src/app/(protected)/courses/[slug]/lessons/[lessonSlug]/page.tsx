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

type LessonPlayerPageProps = {
  params: Promise<{
    slug: string;
    lessonSlug: string;
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

export default async function LessonPlayerPage({ params }: LessonPlayerPageProps) {
  const { slug, lessonSlug } = await params;
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
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">This lesson requires an active learning path enrollment. Sign up below to unlock all lessons, resources, and earn certificates.</p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="outline" className="border-white/10 text-slate-300 hover:bg-white/10 hover:text-white rounded-xl h-11 text-xs font-bold uppercase tracking-wider">
              <Link href={`/courses/${bundle.course.slug}`}>Back to Syllabus</Link>
            </Button>

            {currentUser?.role === "STUDENT" ? (
              <form action={enrollInCourseAction} className="shrink-0">
                <input type="hidden" name="courseId" value={bundle.course.id} />
                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-11 text-xs px-6 font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                  Enroll to Unlock
                </Button>
              </form>
            ) : (
              <Button asChild className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-11 text-xs px-6 font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                <Link href="/login">Sign in to Enroll</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden bg-grid-cyber pb-20">
      {/* Cinematic glows */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent rounded-full filter blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-indigo-500/5 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 pt-8 relative z-10">
        {/* Compact & Premium Header */}
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 mb-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded">
              LMS Learning Player
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded capitalize">
              {bundle.lesson.contentType.toLowerCase()}
            </span>
            {bundle.lesson.isPreview && (
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded flex items-center gap-1">
                <Eye className="h-3 w-3" /> Preview
              </span>
            )}
            {bundle.enrollment && (
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-violet-300 bg-violet-500/10 border border-violet-500/20 px-2.5 py-0.5 rounded capitalize">
                {bundle.enrollment.status.toLowerCase()} Path
              </span>
            )}
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
              {bundle.lesson.title}
            </h1>
            <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
              {bundle.lesson.description ?? bundle.course.description ?? "Access protected modules, system designs, and code playbooks."}
            </p>
          </div>
        </div>

        {/* Core Layout Grid */}
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          {/* Main content Area (Left) */}
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-md shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-violet-500/5 opacity-40 pointer-events-none" />
              
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5 relative z-10">
                <PlayCircle className="h-4.5 w-4.5 text-indigo-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Mastery Sandbox Screen</h3>
              </div>

              {/* Media Player Container */}
              <div className="relative z-10">
                {bundle.lesson.youtubeUrl ? (
                  <div className="overflow-hidden rounded-xl border border-white/10 bg-black/60 shadow-[0_0_30px_rgba(99,102,241,0.1)] relative">
                    <iframe
                      className="aspect-video w-full"
                      src={bundle.lesson.youtubeUrl}
                      title={bundle.lesson.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.01] p-10 text-center flex flex-col items-center justify-center min-h-[300px]">
                    <div className="h-12 w-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 mb-4 shadow-[0_0_15px_rgba(255,255,255,0.02)]">
                      <FileText className="h-6 w-6 text-indigo-400" />
                    </div>
                    {bundle.lesson.r2AssetUrl ? (
                      <div className="space-y-3">
                        <h4 className="text-slate-200 font-bold text-sm">Interactive Syllabus Document</h4>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">This lesson features an online playbook resource instead of a primary video stream.</p>
                        <a 
                          href={bundle.lesson.r2AssetUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-10 px-5 text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-[0_0_15px_rgba(99,102,241,0.2)] mt-2"
                        >
                          Open Playbook Document
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">No video or playbook asset published for this lesson yet.</p>
                    )}
                  </div>
                )}
              </div>

              {/* Action Rows */}
              <div className="mt-6 flex flex-wrap gap-3 justify-between items-center relative z-10 pt-4 border-t border-white/5">
                {bundle.lesson.transcriptUrl ? (
                  <Button asChild variant="outline" className="border-white/10 text-slate-300 hover:bg-white/10 hover:text-white rounded-xl h-10 text-xs font-bold uppercase tracking-wider">
                    <Link href={bundle.lesson.transcriptUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4" />
                      View Transcript
                    </Link>
                  </Button>
                ) : <div />}

                {bundle.lesson.resources.length ? (
                  <div className="w-full space-y-3 mt-4">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Download className="h-4 w-4 text-emerald-400" />
                      Downloadable Study Materials
                    </h4>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {bundle.lesson.resources.map((resource) => (
                        <Button key={resource.id} asChild variant="outline" className="justify-start border-white/10 text-slate-300 hover:bg-white/10 hover:text-white rounded-xl text-xs h-11 font-medium p-3">
                          <Link href={`/courses/${bundle.course.slug}/lessons/${bundle.lesson.slug}/resources/${resource.id}`} className="truncate flex items-center w-full gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                            <span className="truncate">{resource.title}</span>
                          </Link>
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Sidebar Modules (Right) */}
          <div className="space-y-6">
            {/* Progress Card */}
            {bundle.enrollment ? (
              <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-indigo-500/5 opacity-40 pointer-events-none" />
                
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5 relative z-10">
                  <Trophy className="h-4.5 w-4.5 text-indigo-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Module Milestone Progress</h3>
                </div>

                <div className="space-y-5 relative z-10">
                  <div className="space-y-2.5">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                      <span>Milestone Percent</span>
                      <span className="text-indigo-400">{bundle.enrollment.progress?.progressPercent ?? 0}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                        style={{ width: `${bundle.enrollment.progress?.progressPercent ?? 0}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1.5 mt-1">
                      <GraduationCap className="h-4 w-4 text-slate-400" />
                      <span>{bundle.enrollment.progress?.completedLessonsCount ?? 0} of {bundle.enrollment.progress?.totalLessonsCount ?? 0} lessons mastered</span>
                    </div>
                  </div>

                  {canTrackProgress ? (
                    <form action={toggleLessonCompletionAction} className="pt-2">
                      <input type="hidden" name="courseId" value={bundle.course.id} />
                      <input type="hidden" name="lessonId" value={bundle.lesson.id} />
                      <input type="hidden" name="completed" value={isCompleted ? "false" : "true"} />
                      
                      {isCompleted ? (
                        <Button 
                          type="submit" 
                          variant="outline" 
                          className="w-full border-emerald-500/30 text-emerald-400 hover:bg-emerald-600 hover:text-white rounded-xl h-11 text-xs font-extrabold uppercase tracking-wider transition-all duration-200"
                        >
                          <CheckCircle className="mr-2 h-4.5 w-4.5" />
                          Mastery Completed!
                        </Button>
                      ) : (
                        <Button 
                          type="submit" 
                          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-11 text-xs font-extrabold uppercase tracking-wider shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_25px_rgba(99,102,241,0.3)] transition-all duration-200"
                        >
                          Mark Lesson Complete
                        </Button>
                      )}
                    </form>
                  ) : (
                    <p className="text-xs text-slate-500 italic">Progress tracking triggers are enabled for actively enrolled paths.</p>
                  )}
                </div>
              </div>
            ) : null}

            {/* Navigation Card */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-violet-500/5 opacity-40 pointer-events-none" />
              
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5 relative z-10">
                <BookOpen className="h-4.5 w-4.5 text-indigo-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Classroom Navigation</h3>
              </div>

              <div className="flex flex-col gap-3 relative z-10">
                {bundle.nextLesson ? (
                  <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-11 text-xs font-extrabold uppercase tracking-wider shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-200">
                    <Link href={getLessonHref(bundle.course.slug, bundle.nextLesson.slug)} className="flex items-center justify-center gap-1.5">
                      Next Lesson
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                ) : null}

                {bundle.previousLesson ? (
                  <Button asChild variant="outline" className="w-full border-white/10 text-slate-300 hover:bg-white/10 hover:text-white rounded-xl h-11 text-xs font-bold uppercase tracking-wider transition-all">
                    <Link href={getLessonHref(bundle.course.slug, bundle.previousLesson.slug)} className="flex items-center justify-center gap-1.5">
                      <ArrowLeft className="h-4 w-4" />
                      Previous Lesson
                    </Link>
                  </Button>
                ) : null}

                <Button asChild variant="ghost" className="w-full text-slate-400 hover:text-white hover:bg-white/5 rounded-xl h-11 text-xs font-bold uppercase tracking-wider pt-2 border-t border-white/5 mt-2">
                  <Link href={`/courses/${bundle.course.slug}`}>
                    Back to Syllabus
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}