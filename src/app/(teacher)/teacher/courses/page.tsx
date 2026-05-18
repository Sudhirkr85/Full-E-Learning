import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { makeMetadata } from "@/lib/site";
import { getTeacherCourses } from "@/lib/courses/queries";
import { requireRole } from "@/lib/auth";

export const metadata: Metadata = makeMetadata({
  title: "Manage Courses",
  description: "Teacher course management dashboard for creating and editing courses.",
  path: "/teacher/courses",
  noIndex: true
});

export const dynamic = "force-dynamic";

type TeacherCoursesPageProps = {
  searchParams?: Promise<{
    created?: string;
    updated?: string;
    deleted?: string;
    error?: string;
  }>;
};

export default async function TeacherCoursesPage({ searchParams }: TeacherCoursesPageProps) {
  const teacher = await requireRole(["TEACHER"]);
  const courses = await getTeacherCourses(teacher.id);
  const params = searchParams ? await searchParams : undefined;

  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <Badge variant="secondary">Teacher workspace</Badge>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-5xl">Course management</h1>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">Create, edit, publish, and organize the courses assigned to you.</p>
          </div>

          <Button asChild>
            <Link href="/teacher/courses/new">Create course</Link>
          </Button>
        </div>

        {params?.created ? <p className="mt-8 rounded-2xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm">Course created successfully.</p> : null}
        {params?.updated ? <p className="mt-8 rounded-2xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm">Course updated successfully.</p> : null}
        {params?.deleted ? <p className="mt-8 rounded-2xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm">Course deleted successfully.</p> : null}
        {params?.error ? <p className="mt-8 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">Something went wrong. Please retry.</p> : null}

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {courses.length ? (
            courses.map((course) => (
              <Card key={course.id}>
                <CardHeader>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={course.status === "PUBLISHED" ? "default" : "secondary"}>{course.status.toLowerCase()}</Badge>
                    {course.categories.map(({ category }) => (
                      <Badge key={category.id} variant="outline">
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                  <CardTitle className="mt-2">{course.title}</CardTitle>
                  <CardDescription>{course.subtitle ?? course.excerpt ?? "Ready for course editing and publishing."}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {course._count.sections} sections · {course.teachers.length} teacher{course.teachers.length === 1 ? "" : "s"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/teacher/courses/${course.id}`}>Manage</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/teacher/courses/${course.id}/sections`}>Sections</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="md:col-span-2 xl:col-span-3">
              <CardHeader>
                <CardTitle>No courses assigned yet</CardTitle>
                <CardDescription>Create the first course to start building sections and lessons.</CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </Container>
    </section>
  );
}