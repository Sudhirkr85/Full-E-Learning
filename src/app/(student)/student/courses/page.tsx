import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { makeMetadata } from "@/lib/site";
import { requireRole } from "@/lib/auth";
import { EnrollmentStatus } from "@prisma/client";
import { getStudentCourseEnrollments } from "@/lib/courses/access";

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
  title: "My Courses",
  description: "Enrolled courses with progress tracking and continue-learning access.",
  path: "/student/courses",
  noIndex: true
});

export default async function StudentCoursesPage() {
  const user = await requireRole(["STUDENT"]);
  const enrollments = await getStudentCourseEnrollments(user.id);

  return (
    <section>
      <div className="max-w-3xl">
        <Badge variant="secondary">My courses</Badge>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-white">Your enrolled courses</h1>
        <p className="mt-4 text-lg leading-8 text-slate-300">Course access is evaluated server-side, free preview lessons remain public, and your progress is saved as you complete lessons.</p>
      </div>

      <div className="mt-10 grid gap-6 xl:grid-cols-2">
        {enrollments.length ? (
          enrollments.map((enrollment) => {
            const progressPercent = enrollment.progress?.progressPercent ?? 0;
            const totalLessonsCount = enrollment.progress?.totalLessonsCount ?? enrollment.course.sections.reduce((count, section) => count + section.lessons.length, 0);
            const completedLessonsCount = enrollment.progress?.completedLessonsCount ?? 0;
            const isCompleted = enrollment.status === EnrollmentStatus.COMPLETED || progressPercent === 100;
            const resumeHref = enrollment.status === EnrollmentStatus.PAUSED ? `/courses/${enrollment.course.slug}` : getLessonHref(enrollment);
            const primaryLabel = enrollment.status === EnrollmentStatus.PAUSED ? "Resume enrollment" : isCompleted ? "Review course" : "Continue learning";

            const hasCoverImage = !!enrollment.course.coverImageUrl;
            const getCoverGradient = (title: string) => {
              const gradients = [
                "from-violet-600 to-indigo-800",
                "from-cyan-600 to-blue-800",
                "from-emerald-600 to-teal-800",
                "from-pink-600 to-purple-800",
                "from-amber-600 to-rose-800",
              ];
              let hash = 0;
              for (let i = 0; i < title.length; i++) {
                hash = title.charCodeAt(i) + ((hash << 5) - hash);
              }
              const index = Math.abs(hash) % gradients.length;
              return gradients[index];
            };
            const coverGradient = getCoverGradient(enrollment.course.title);

            return (
              <Card key={enrollment.id} className="overflow-hidden hover:scale-[1.01] transition-all duration-300 group flex flex-col justify-between shadow-lg border-white/5 bg-slate-900/10">
                <div>
                  {/* Premium Course Cover / Thumbnail Banner */}
                  <div className={`h-32 w-full ${hasCoverImage ? "" : `bg-gradient-to-br ${coverGradient}`} relative overflow-hidden shadow-inner flex-shrink-0`}>
                    {hasCoverImage && (
                      <img 
                        src={enrollment.course.coverImageUrl!} 
                        alt={enrollment.course.title} 
                        className="absolute inset-0 w-full h-full object-cover z-0 group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    {/* Gloss / Readability Shadow */}
                    <div className={`absolute inset-0 ${hasCoverImage ? "bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-transparent" : "bg-gradient-to-tr from-transparent via-white/5 to-white/10"} z-0 pointer-events-none`}></div>
                    
                    <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 z-10">
                      <Badge className={isCompleted ? "bg-purple-600 hover:bg-purple-500 text-white font-bold border-none" : enrollment.status === EnrollmentStatus.PAUSED ? "bg-slate-700 text-white font-bold border-none" : "bg-indigo-600 hover:bg-indigo-500 text-white font-bold border-none"}>
                        {enrollment.status.toLowerCase()}
                      </Badge>
                      <Badge className="bg-white/10 backdrop-blur-md text-white border-white/10 font-bold">{progressPercent}% complete</Badge>
                    </div>
                  </div>

                  <CardHeader className="pt-4 pb-2">
                    <CardTitle className="mt-1 text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">{enrollment.course.title}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-1 text-slate-300">{enrollment.course.subtitle ?? enrollment.course.excerpt ?? "Continue where you left off."}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-1">
                    <div className="space-y-2 text-sm text-slate-300">
                      <p>{completedLessonsCount}/{totalLessonsCount} lessons completed</p>
                      <p className="text-slate-300/80 italic text-xs">{enrollment.progress?.lastLesson?.title ?? "No lesson progress yet"}</p>
                    </div>
                  </CardContent>
                </div>

                <div className="p-6 pt-0">
                  <div className="flex flex-wrap gap-3">
                    <Button asChild>
                      <Link href={resumeHref}>{primaryLabel}</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href={`/courses/${enrollment.course.slug}`}>Course details</Link>
                    </Button>
                    {isCompleted && (
                      <Button asChild variant="outline" className="border-amber-500/30 text-amber-600 hover:text-amber-700 hover:bg-amber-500/10">
                        <Link href={`/student/courses/${enrollment.course.slug}/certificate`}>
                          {enrollment.certificate ? "View Certificate" : "Claim Certificate"}
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle>No enrolled courses yet</CardTitle>
              <CardDescription>Browse the catalog and enroll in a course to unlock protected lessons and progress tracking.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/courses">Browse courses</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}