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
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">Your enrolled courses</h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">Course access is evaluated server-side, free preview lessons remain public, and your progress is saved as you complete lessons.</p>
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

            return (
              <Card key={enrollment.id}>
                <CardHeader>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={isCompleted ? "default" : enrollment.status === EnrollmentStatus.PAUSED ? "secondary" : "outline"}>{enrollment.status.toLowerCase()}</Badge>
                    <Badge variant="outline">{progressPercent}% complete</Badge>
                  </div>
                  <CardTitle className="mt-2">{enrollment.course.title}</CardTitle>
                  <CardDescription>{enrollment.course.subtitle ?? enrollment.course.excerpt ?? "Continue where you left off."}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>{completedLessonsCount}/{totalLessonsCount} lessons completed</p>
                    <p>{enrollment.progress?.lastLesson?.title ?? "No lesson progress yet"}</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild>
                      <Link href={resumeHref}>{primaryLabel}</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href={`/courses/${enrollment.course.slug}`}>Course details</Link>
                    </Button>
                  </div>
                </CardContent>
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