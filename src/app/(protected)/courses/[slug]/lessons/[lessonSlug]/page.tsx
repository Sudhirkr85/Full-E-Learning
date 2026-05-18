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

export default async function LessonPlayerPage({ params }: LessonPlayerPageProps) {
  const { slug, lessonSlug } = await params;
  const currentUser = await getCurrentUser();
  const bundle = await getLessonPlayerBundle(slug, lessonSlug, currentUser?.id);

  if (!bundle.course || !bundle.lesson) {
    return (
      <section className="py-16 md:py-24">
        <Container>
          <Badge variant="secondary">Lesson not found</Badge>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-5xl">Lesson unavailable</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">The lesson could not be located in this course or it is no longer available.</p>
          <Button className="mt-6" asChild>
            <Link href={`/courses/${slug}`}>Back to course</Link>
          </Button>
        </Container>
      </section>
    );
  }

  const currentProgress = bundle.enrollment?.lessonProgresses.find((item) => item.lessonId === bundle.lesson?.id);
  const isCompleted = Boolean(currentProgress?.isCompleted);
  const canTrackProgress = Boolean(bundle.enrollment && bundle.canAccess && currentUser?.role === "STUDENT");

  if (!bundle.canAccess) {
    return (
      <section className="py-16 md:py-24">
        <Container>
          <Badge variant="secondary">Locked lesson</Badge>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-5xl">{bundle.lesson.title}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">This lesson requires an active enrollment unless it is published as a free preview or accessed by teaching staff.</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href={`/courses/${bundle.course.slug}`}>Back to course</Link>
            </Button>

            {currentUser?.role === "STUDENT" ? (
              <form action={enrollInCourseAction}>
                <input type="hidden" name="courseId" value={bundle.course.id} />
                <Button type="submit">Enroll to continue</Button>
              </form>
            ) : (
              <Button asChild>
                <Link href="/login">Sign in to enroll</Link>
              </Button>
            )}
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <Badge variant="secondary">Lesson player</Badge>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-5xl">{bundle.lesson.title}</h1>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">{bundle.lesson.description ?? bundle.course.description ?? "Course lesson content with server-side permission validation."}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{bundle.lesson.contentType.toLowerCase()}</Badge>
            {bundle.lesson.isPreview ? <Badge variant="outline">preview</Badge> : null}
            {bundle.enrollment ? <Badge>{bundle.enrollment.status.toLowerCase()}</Badge> : null}
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle>Player</CardTitle>
              <CardDescription>Lesson content and protected resources are resolved on the server.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {bundle.lesson.youtubeUrl ? (
                <div className="overflow-hidden rounded-2xl border border-border bg-muted/30">
                  <iframe
                    className="aspect-video w-full"
                    src={bundle.lesson.youtubeUrl}
                    title={bundle.lesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="rounded-2xl border border-border bg-muted/30 p-6 text-sm text-muted-foreground">
                  {bundle.lesson.r2AssetUrl ? (
                    <a href={bundle.lesson.r2AssetUrl} target="_blank" rel="noreferrer" className="font-medium text-primary underline underline-offset-4">
                      Open lesson asset
                    </a>
                  ) : (
                    "This lesson does not have a primary video asset yet."
                  )}
                </div>
              )}

              {bundle.lesson.transcriptUrl ? (
                <Button asChild variant="outline">
                  <Link href={bundle.lesson.transcriptUrl} target="_blank" rel="noreferrer">
                    Open transcript
                  </Link>
                </Button>
              ) : null}

              {bundle.lesson.resources.length ? (
                <div className="space-y-3">
                  <h2 className="font-medium">Lesson resources</h2>
                  <div className="grid gap-3 md:grid-cols-2">
                    {bundle.lesson.resources.map((resource) => (
                      <Button key={resource.id} asChild variant="outline" className="justify-start">
                        <Link href={`/courses/${bundle.course.slug}/lessons/${bundle.lesson.slug}/resources/${resource.id}`}>{resource.title}</Link>
                      </Button>
                    ))}
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <div className="space-y-6">
            {bundle.enrollment ? (
              <Card>
                <CardHeader>
                  <CardTitle>Progress</CardTitle>
                  <CardDescription>{bundle.enrollment.progress?.progressPercent ?? 0}% complete</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                  <p>
                    {bundle.enrollment.progress?.completedLessonsCount ?? 0}/{bundle.enrollment.progress?.totalLessonsCount ?? 0} lessons completed
                  </p>

                  {canTrackProgress ? (
                    <form action={toggleLessonCompletionAction} className="space-y-3">
                      <input type="hidden" name="courseId" value={bundle.course.id} />
                      <input type="hidden" name="lessonId" value={bundle.lesson.id} />
                      <input type="hidden" name="completed" value={isCompleted ? "false" : "true"} />
                      <Button type="submit" className="w-full" variant={isCompleted ? "outline" : "default"}>
                        {isCompleted ? "Mark incomplete" : "Mark complete"}
                      </Button>
                    </form>
                  ) : (
                    <p>Progress tracking is available to enrolled students.</p>
                  )}
                </CardContent>
              </Card>
            ) : null}

            <Card>
              <CardHeader>
                <CardTitle>Lesson navigation</CardTitle>
                <CardDescription>Move through the course in order.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {bundle.previousLesson ? (
                  <Button asChild variant="outline">
                    <Link href={getLessonHref(bundle.course.slug, bundle.previousLesson.slug)}>Previous lesson</Link>
                  </Button>
                ) : null}
                {bundle.nextLesson ? (
                  <Button asChild variant="outline">
                    <Link href={getLessonHref(bundle.course.slug, bundle.nextLesson.slug)}>Next lesson</Link>
                  </Button>
                ) : null}
                <Button asChild variant="ghost">
                  <Link href={`/courses/${bundle.course.slug}`}>Back to course</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  );
}