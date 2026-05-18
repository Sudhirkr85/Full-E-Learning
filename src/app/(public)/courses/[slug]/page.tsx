import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { makeMetadata } from "@/lib/site";
import { getPublishedCourseBySlug } from "@/lib/courses/queries";

type CourseDetailsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: CourseDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await getPublishedCourseBySlug(slug);

  return makeMetadata({
    title: course?.title ?? slug.replaceAll("-", " "),
    description: course?.excerpt ?? course?.description ?? "Published course detail page with SEO metadata and structured course content.",
    path: `/courses/${slug}`
  });
}

export default async function CourseDetailsPage({ params }: CourseDetailsPageProps) {
  const { slug } = await params;
  const course = await getPublishedCourseBySlug(slug);

  if (!course) {
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

  return (
    <section className="py-16 md:py-24">
      <Container>
        <Badge variant="secondary">Course details</Badge>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-5xl">{course.title}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">{course.description ?? course.excerpt ?? "Course details ready for lessons, resources, and enrollment flows later."}</p>

        <div className="mt-8 flex flex-wrap gap-2">
          {course.categories.map(({ category }) => (
            <Badge key={category.id} variant="outline">
              {category.name}
            </Badge>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span>{course.level.toLowerCase()}</span>
          <span>{course.sections.length} sections</span>
          <span>{course.teachers.length} teacher{course.teachers.length === 1 ? "" : "s"}</span>
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
                <CardContent>
                  <p className="text-sm leading-6 text-muted-foreground">{section.description ?? "Module overview coming soon."}</p>
                </CardContent>
              </CardHeader>
              <CardContent className="space-y-4">
                {section.lessons.map((lesson) => (
                  <div key={lesson.id} className="rounded-xl border border-border bg-background/60 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-medium text-foreground">
                        {lesson.orderIndex + 1}. {lesson.title}
                      </h3>
                      <Badge variant="secondary">{lesson.contentType.toLowerCase()}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{lesson.description ?? "Lesson content will be added during course build-out."}</p>
                    {lesson.resources.length ? (
                      <div className="mt-3 space-y-2">
                        {lesson.resources.map((resource) => (
                          <a key={resource.id} href={resource.url} target="_blank" rel="noreferrer" className="block text-sm font-medium text-primary underline underline-offset-4">
                            {resource.title}
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}