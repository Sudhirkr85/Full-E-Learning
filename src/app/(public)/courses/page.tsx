import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { makeMetadata } from "@/lib/site";
import { getCourseCategories, getPublishedCourses } from "@/lib/courses/queries";

export const metadata: Metadata = makeMetadata({
  title: "Courses",
  description: "Browse the published course catalog and discover learning paths for every role.",
  path: "/courses"
});

export const dynamic = "force-dynamic";

type CoursesPageProps = {
  searchParams?: Promise<{
    category?: string;
  }>;
};

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const [courses, categories] = await Promise.all([getPublishedCourses(params?.category), getCourseCategories()]);

  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="max-w-2xl">
          <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">Courses</h1>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">Browse live published courses, organized by category and ready for SEO discovery.</p>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          <Button asChild variant={!params?.category ? "default" : "outline"} size="sm">
            <Link href="/courses">All</Link>
          </Button>
          {categories.map((category) => (
            <Button key={category.id} asChild variant={params?.category === category.slug ? "default" : "outline"} size="sm">
              <Link href={`/courses?category=${category.slug}`}>{category.name}</Link>
            </Button>
          ))}
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {courses.length ? (
            courses.map((course) => (
              <Card key={course.id}>
                <CardHeader>
                  <div className="flex flex-wrap gap-2">
                    {course.categories.map(({ category }) => (
                      <Badge key={category.id} variant="secondary">
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                  <CardTitle className="mt-2">{course.title}</CardTitle>
                  <CardDescription>{course.subtitle ?? course.excerpt ?? "Published course ready for enrollment and lesson browsing."}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {course._count.sections} sections · {course.teachers.length} teacher{course.teachers.length === 1 ? "" : "s"}
                  </p>
                  <Button asChild variant="outline">
                    <Link href={`/courses/${course.slug}`}>View details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="md:col-span-2 xl:col-span-3">
              <CardHeader>
                <CardTitle>No published courses yet</CardTitle>
                <CardDescription>Teachers can publish courses from the management dashboard once content is ready.</CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </Container>
    </section>
  );
}