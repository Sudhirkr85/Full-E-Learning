import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { makeMetadata } from "@/lib/site";
import { requireRole } from "@/lib/auth";
import { getStudentCourseEnrollments } from "@/lib/courses/access";
import { EnrollmentStatus } from "@prisma/client";
import { 
  GraduationCap, 
  Sparkles, 
  Play, 
  Clock, 
  Award,
  ArrowRight,
  ShieldCheck,
  Zap,
  Bookmark
} from "lucide-react";

function getLessonHref(enrollment: Awaited<ReturnType<typeof getStudentCourseEnrollments>>[number]) {
  const lastLesson = enrollment.progress?.lastLesson;

  if (lastLesson?.section?.course?.slug === enrollment.course.slug) {
    return `/courses/${enrollment.course.slug}/lessons/${lastLesson.slug}`;
  }

  for (const section of enrollment.course.sections) {
    const firstLesson = section.lessons[0];
    if (firstLesson) {
      return `/courses/${enrollment.course.slug}/lessons/${firstLesson.slug}`;
    }
  }

  return `/courses/${enrollment.course.slug}`;
}

export const metadata: Metadata = makeMetadata({
  title: "Student Dashboard",
  description: "Student dashboard with enrollment, continue-learning, and progress summaries.",
  path: "/student/dashboard",
  noIndex: true
});

export default async function StudentDashboardPage() {
  const user = await requireRole(["STUDENT"]);
  const enrollments = await getStudentCourseEnrollments(user.id);
  
  const activeEnrollments = enrollments.filter((enrollment) => enrollment.status === EnrollmentStatus.ACTIVE);
  const completedEnrollments = enrollments.filter((enrollment) => enrollment.status === EnrollmentStatus.COMPLETED || enrollment.progress?.progressPercent === 100);
  const pausedEnrollments = enrollments.filter((enrollment) => enrollment.status === EnrollmentStatus.PAUSED);
  
  const continueEnrollment = enrollments.find((enrollment) => enrollment.progress?.lastLesson) ?? enrollments[0] ?? null;
  const continueHref = continueEnrollment ? getLessonHref(continueEnrollment) : null;
  const continueLabel = continueEnrollment?.status === EnrollmentStatus.PAUSED ? "Resume Enrollment" : "Resume Learning";

  return (
    <div className="space-y-8 text-left">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-[#0a0f24] to-[#040715] p-6">
        {/* Glow Effects */}
        <div className="absolute right-0 top-0 -z-10 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl"></div>
        <div className="absolute left-0 bottom-0 -z-10 h-32 w-32 rounded-full bg-cyan-500/5 blur-2xl"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <Badge className="bg-indigo-950/60 border-indigo-500/30 text-indigo-300 text-xs px-2.5 py-0.5 rounded-full">
              <Sparkles className="h-3 w-3 text-indigo-400 mr-1.5 animate-pulse inline" />
              Student Profile Active
            </Badge>
            <h1 className="font-display text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user.name ?? user.email}
            </h1>
            <p className="text-xs md:text-sm text-slate-400 max-w-xl leading-relaxed">
              Your comprehensive course enrollments, interactive code labs, and progress matrices are tracked dynamically to optimize your career outcomes.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3 bg-slate-950/50 rounded-xl p-3 border border-white/[0.03]">
            <div className="h-9 w-9 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500">Earned Certs</p>
              <p className="text-sm font-bold text-white">{completedEnrollments.length} Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Widgets Grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Active Courses */}
        <div className="relative overflow-hidden rounded-2xl border border-cyan-500/10 bg-[#090d22]/50 p-5 shadow-sm transition duration-300 hover:border-cyan-500/30">
          <div className="absolute top-0 right-0 h-16 w-16 bg-cyan-500/5 rounded-full blur-xl"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active</p>
              <p className="mt-4 text-3xl font-extrabold text-white font-display">{activeEnrollments.length}</p>
            </div>
            <div className="h-8 w-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 text-xs font-bold">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <p className="text-[10px] text-slate-500 mt-3">Enrolled and currently in progress</p>
        </div>

        {/* Completed Courses */}
        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/10 bg-[#090d22]/50 p-5 shadow-sm transition duration-300 hover:border-emerald-500/30">
          <div className="absolute top-0 right-0 h-16 w-16 bg-emerald-500/5 rounded-full blur-xl"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed</p>
              <p className="mt-4 text-3xl font-extrabold text-white font-display">{completedEnrollments.length}</p>
            </div>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-xs font-bold">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <p className="text-[10px] text-slate-500 mt-3">Course materials fully finalized</p>
        </div>

        {/* Paused Courses */}
        <div className="relative overflow-hidden rounded-2xl border border-amber-500/10 bg-[#090d22]/50 p-5 shadow-sm transition duration-300 hover:border-amber-500/30">
          <div className="absolute top-0 right-0 h-16 w-16 bg-amber-500/5 rounded-full blur-xl"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Paused</p>
              <p className="mt-4 text-3xl font-extrabold text-white font-display">{pausedEnrollments.length}</p>
            </div>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 text-xs font-bold">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="text-[10px] text-slate-500 mt-3">Waiting on upcoming resume actions</p>
        </div>
      </div>

      {/* Primary Action Widget: Continue Learning */}
      {continueEnrollment ? (
        <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-r from-[#080d22] to-[#040817] p-5 md:p-6">
          <div className="absolute right-0 top-0 h-32 w-32 bg-indigo-500/5 rounded-full blur-xl"></div>
          <div className="absolute left-0 bottom-0 h-32 w-32 bg-cyan-500/5 rounded-full blur-xl"></div>

          <div className="flex flex-col gap-6 md:flex-row md:items-center justify-between">
            <div className="space-y-3.5 flex-1 text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400">
                <Bookmark className="h-3.5 w-3.5" />
                <span>Jump Back In</span>
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-white leading-tight">{continueEnrollment.course.title}</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Active Lesson: <span className="text-slate-200 font-semibold">{continueEnrollment.progress?.lastLesson?.title ?? "Overview & First Module"}</span>
                </p>
              </div>

              {/* Glowing Progress bar */}
              <div className="space-y-1.5 max-w-md">
                <div className="flex justify-between text-[10px] font-medium text-slate-400">
                  <span>{continueEnrollment.progress?.progressPercent ?? 0}% completed</span>
                  <span>{continueEnrollment.progress?.completedLessonsCount ?? 0} / {continueEnrollment.progress?.totalLessonsCount ?? 0} lessons finished</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-white/[0.02]">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full" style={{ width: `${continueEnrollment.progress?.progressPercent ?? 0}%` }}></div>
                </div>
              </div>
            </div>

            {continueHref ? (
              <div className="shrink-0 flex items-center justify-start md:justify-end">
                {continueEnrollment.status === EnrollmentStatus.PAUSED ? (
                  <Button asChild className="bg-amber-600 text-white font-semibold hover:bg-amber-500 rounded-xl px-5 py-5 transition duration-300">
                    <Link href={`/courses/${continueEnrollment.course.slug}`}>Resume Enrollment</Link>
                  </Button>
                ) : (
                  <Button asChild className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold hover:from-indigo-500 hover:to-cyan-500 rounded-xl px-6 py-5 shadow-[0_0_20px_rgba(99,102,241,0.3)] transition duration-300 hover:scale-[1.02] active:scale-[0.98] group">
                    <Link href={continueHref} className="flex items-center gap-1.5">
                      <Play className="h-3.5 w-3.5 fill-white" />
                      {continueLabel}
                      <ArrowRight className="h-4 w-4 transition duration-200 group-hover:translate-x-0.5" />
                    </Link>
                  </Button>
                )}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* Directory Action Footer Card */}
      <div className="rounded-2xl border border-white/5 bg-[#090d20]/50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-left">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
            <GraduationCap className="h-5.5 w-5.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Full-Access Course Library</h3>
            <p className="text-xs text-slate-400 mt-0.5">Explore additional modules, practice assessments, and verify certificates.</p>
          </div>
        </div>
        <Button asChild variant="outline" className="border-white/10 bg-slate-950/40 hover:bg-slate-900/60 text-slate-300 hover:text-white rounded-xl">
          <Link href="/student/courses" className="flex items-center gap-1.5">
            View All Enrolled Courses
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}