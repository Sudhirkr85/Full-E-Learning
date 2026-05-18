import type { Metadata } from "next";
import Link from "next/link";
import { EnrollmentStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { makeMetadata } from "@/lib/site";
import { getCurrentUser } from "@/lib/auth";
import { enrollInCourseAction } from "@/lib/courses/actions";
import { getLearningCourseOverview } from "@/lib/courses/access";

type CourseDetailsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: CourseDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await getLearningCourseOverview(slug);

  return makeMetadata({
    title: course?.course.title ?? slug.replaceAll("-", " "),
    description: course?.course.excerpt ?? course?.course.description ?? "Published course detail page with enrollment, lesson access, and progress tracking.",
    path: `/courses/${slug}`
  });
}

export default async function CourseDetailsPage({ params }: CourseDetailsPageProps) {
  const { slug } = await params;
  const currentUser = await getCurrentUser();
  const overview = await getLearningCourseOverview(slug, currentUser?.id);

  if (!overview?.course) {
    return (
      <section className="py-16 md:py-24">
        <Container>
          <Badge variant="secondary">Course not found</Badge>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-5xl">Course unavailable</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">This course is not published yet or no longer exists.</p>
          <Button className="mt-6" asChild>
            <Link href="/courses">Back to courses</Link>
          </Button>
        </Container>
      </section>
    );
  }

  const course = overview.course;
  const totalLessonsCount = course.sections.reduce((count, section) => count + section.lessons.length, 0);
  const totalResourcesCount = course.sections.reduce((count, section) => count + section.lessons.reduce((lessonCount, lesson) => lessonCount + lesson.resources.length, 0), 0);
  const isEnrolled = overview.isEnrolled;
  const hasEnrollment = Boolean(overview.enrollment);
  const isStaff = overview.canBypass;
  const canOpenLesson = Boolean(overview.continueHref);
  const enrollmentStatus = overview.enrollment?.status;
  const firstLesson = overview.firstLesson;

  return (
    <section className="py-16 md:py-24">
      <Container>
        <Badge variant="secondary">Course details</Badge>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-5xl">{course.title}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">{course.description ?? course.excerpt ?? "Course details ready for lessons, resources, and protected enrollment flows."}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Badge variant="outline">{course.level.toLowerCase()}</Badge>
          <Badge variant="outline">{course.sections.length} sections</Badge>
          <Badge variant="outline">{totalLessonsCount} lessons</Badge>
          <Badge variant="outline">{totalResourcesCount} resources</Badge>
          {hasEnrollment ? <Badge>{enrollmentStatus?.toLowerCase()}</Badge> : null}
          {isStaff ? <Badge variant="secondary">staff access</Badge> : null}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {canOpenLesson && overview.continueHref ? (
            <Button asChild>
              <Link href={overview.continueHref}>{isEnrolled ? "Continue learning" : firstLesson?.isPreview ? "Start preview lesson" : "Open lesson"}</Link>
            </Button>
          ) : null}

          {!currentUser ? (
            <Button asChild variant="outline">
              <Link href="/login">Sign in to enroll</Link>
            </Button>
          ) : null}

          {currentUser?.role === "STUDENT" && !isEnrolled ? (
            <form action={enrollInCourseAction}>
              <input type="hidden" name="courseId" value={course.id} />
              <Button type="submit" variant="outline">
                {hasEnrollment ? "Resume enrollment" : "Enroll now"}
              </Button>
            </form>
          ) : null}

          {isEnrolled ? (
            <Button asChild variant="outline">
              <Link href="/student/courses">Go to my courses</Link>
            </Button>
          ) : null}
        </div>

        {course.trailerUrl ? (
          <Card className="mt-8 max-w-4xl">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <a href={course.trailerUrl} target="_blank" rel="noreferrer" className="text-sm font-medium text-primary underline underline-offset-4">
                Open trailer video
              </a>
            </CardContent>
          </Card>
        ) : null}

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {course.sections.map((section) => (
            <Card key={section.id}>
              <CardHeader>
                <CardTitle>
                  {section.orderIndex + 1}. {section.title}
                </CardTitle>
                <p className="text-sm leading-6 text-muted-foreground">{section.description ?? "Module overview coming soon."}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {section.lessons.map((lesson) => (
                  <div key={lesson.id} className="rounded-xl border border-border bg-background/60 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-medium text-foreground">
                        {lesson.orderIndex + 1}. {lesson.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">{lesson.contentType.toLowerCase()}</Badge>
                        {lesson.isPreview ? <Badge variant="outline">preview</Badge> : <Badge variant="outline">locked</Badge>}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{lesson.description ?? "Lesson content will be added during course build-out."}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      {lesson.isPreview || isEnrolled || isStaff ? (
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/courses/${course.slug}/lessons/${lesson.slug}`}>{lesson.isPreview ? "Open preview lesson" : "Open lesson"}</Link>
                        </Button>
                      ) : currentUser?.role === "STUDENT" ? (
                        <span className="text-sm text-muted-foreground">Enroll to unlock this lesson.</span>
                      ) : (
                        <Button asChild size="sm" variant="outline">
                          <Link href="/login">Sign in to unlock</Link>
                        </Button>
                      )}

                      <span className="text-sm text-muted-foreground">{lesson.resources.length} protected resources</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {!course.sections.length ? (
          <Card className="mt-10">
            <CardHeader>
              <CardTitle>No published lessons yet</CardTitle>
              <CardDescription>This course is published, but the learning path has not been exposed yet.</CardDescription>
            </CardHeader>
          </Card>
        ) : null}
      </Container>
    </section>
  );
}