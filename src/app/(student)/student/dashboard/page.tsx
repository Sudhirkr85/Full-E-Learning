import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { makeMetadata } from "@/lib/site";
import { requireRole } from "@/lib/auth";
import { getStudentCourseEnrollments } from "@/lib/courses/access";
import { EnrollmentStatus } from "@prisma/client";

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
  const continueLabel = continueEnrollment?.status === EnrollmentStatus.PAUSED ? "Resume enrollment" : "Resume";

  return (
    <div className="space-y-8">
      <Badge variant="secondary">Student area</Badge>
      <div className="max-w-3xl">
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">Welcome back, {user.name ?? user.email}</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">Your enrollment state, lesson progress, and next lesson entry point are tracked server-side so you can resume from the last place you left off.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Active</CardTitle>
            <CardDescription>Enrolled and in progress.</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{activeEnrollments.length}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Completed</CardTitle>
            <CardDescription>Finished courses.</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{completedEnrollments.length}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Paused</CardTitle>
            <CardDescription>Waiting to resume.</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{pausedEnrollments.length}</CardContent>
        </Card>
      </div>

      {continueEnrollment ? (
        <Card>
          <CardHeader>
            <CardTitle>Continue learning</CardTitle>
            <CardDescription>{continueEnrollment.course.title}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {continueEnrollment.progress?.progressPercent ?? 0}% complete · {continueEnrollment.progress?.completedLessonsCount ?? 0}/{continueEnrollment.progress?.totalLessonsCount ?? 0} lessons finished
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {continueEnrollment.progress?.lastLesson?.title ?? "Start the first lesson to begin tracking progress."}
              </p>
            </div>
            {continueHref ? (
              continueEnrollment.status === EnrollmentStatus.PAUSED ? (
                <Button asChild>
                  <Link href={`/courses/${continueEnrollment.course.slug}`}>{continueLabel}</Link>
                </Button>
              ) : (
                <Button asChild>
                  <Link href={continueHref}>{continueLabel}</Link>
                </Button>
              )
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>My courses</CardTitle>
          <CardDescription>Open the student course list to manage progress and lesson access.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link href="/student/courses">View all enrolled courses</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}