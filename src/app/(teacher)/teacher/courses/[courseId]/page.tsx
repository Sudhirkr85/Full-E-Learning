import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { makeMetadata } from "@/lib/site";
import { requireRole } from "@/lib/auth";
import { getTeacherCourseEditor } from "@/lib/courses/queries";
import {
  assignTeacherAction,
  attachCategoryToCourseAction,
  deleteCourseAction,
  detachCategoryFromCourseAction,
  removeTeacherAction,
  toggleCourseStatusAction,
  updateCourseAction
} from "@/lib/courses/actions";

type CourseEditorPageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

export async function generateMetadata({ params }: CourseEditorPageProps): Promise<Metadata> {
  const { courseId } = await params;
  return makeMetadata({
    title: `Edit Course ${courseId}`,
    description: "Course editor for managing the course shell, teachers, and catalog data.",
    path: `/teacher/courses/${courseId}`,
    noIndex: true
  });
}

export const dynamic = "force-dynamic";

export default async function CourseEditorPage({ params }: CourseEditorPageProps) {
  const teacher = await requireRole(["TEACHER"]);
  const { courseId } = await params;
  const course = await getTeacherCourseEditor(courseId, teacher.id);

  if (!course) {
    return (
      <section className="py-16 md:py-24">
        <Container>
          <Badge variant="secondary">Course not found</Badge>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-5xl">Course unavailable</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">You do not have access to this course or it does not exist.</p>
          <Button className="mt-6" asChild>
            <Link href="/teacher/courses">Back to courses</Link>
          </Button>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <Badge variant={course.status === "PUBLISHED" ? "default" : "secondary"}>{course.status.toLowerCase()}</Badge>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-5xl">{course.title}</h1>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">Manage core course data, attached teachers, categories, and publish state.</p>
          </div>

          <Button asChild variant="outline">
            <Link href={`/teacher/courses/${course.id}/sections`}>Manage sections</Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle>Course details</CardTitle>
              <CardDescription>Slug generation updates automatically when the title changes.</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={updateCourseAction} className="grid gap-4">
                <input type="hidden" name="courseId" value={course.id} />
                <div className="grid gap-2 md:grid-cols-2">
                  <Input name="title" defaultValue={course.title} required />
                  <Input name="subtitle" defaultValue={course.subtitle ?? ""} placeholder="Subtitle" />
                </div>
                <textarea name="description" rows={6} defaultValue={course.description ?? ""} className="min-h-40 rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" required />
                <Input name="excerpt" defaultValue={course.excerpt ?? ""} placeholder="SEO excerpt" />
                <div className="grid gap-2 md:grid-cols-4">
                  <select name="level" defaultValue={course.level} className="h-11 rounded-xl border border-input bg-background px-4 text-sm">
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                    <option value="ALL_LEVELS">All levels</option>
                  </select>
                  <Input name="language" defaultValue={course.language} />
                  <Input name="priceCents" type="number" min="0" step="1" defaultValue={course.priceCents} />
                  <Input name="currency" defaultValue={course.currency} />
                </div>
                <Input name="coverImageUrl" defaultValue={course.coverImageUrl ?? ""} placeholder="Cover image URL" />
                <Input name="trailerUrl" defaultValue={course.trailerUrl ?? ""} placeholder="Trailer URL" />
                <div className="flex flex-wrap gap-2">
                  <Button type="submit">Save changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Publish state</CardTitle>
                <CardDescription>Publish or archive the course without touching content.</CardDescription>
              </CardHeader>
              <CardContent>
                <form action={toggleCourseStatusAction} className="grid gap-4">
                  <input type="hidden" name="courseId" value={course.id} />
                  <select name="status" defaultValue={course.status} className="h-11 rounded-xl border border-input bg-background px-4 text-sm">
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                  <Button type="submit" variant="outline">
                    Update status
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
                <CardDescription>Attach or remove categories from this course.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form action={attachCategoryToCourseAction} className="grid gap-3">
                  <input type="hidden" name="courseId" value={course.id} />
                  <Input name="categoryName" placeholder="New or existing category name" />
                  <Button type="submit" variant="outline">
                    Attach category
                  </Button>
                </form>

                <div className="flex flex-wrap gap-2">
                  {course.categories.map(({ category }) => (
                    <form key={category.id} action={detachCategoryFromCourseAction}>
                      <input type="hidden" name="courseId" value={course.id} />
                      <input type="hidden" name="categoryId" value={category.id} />
                      <Button type="submit" variant="secondary" size="sm">
                        {category.name} ×
                      </Button>
                    </form>
                  ))}
                  {!course.categories.length ? <p className="text-sm text-muted-foreground">No categories attached yet.</p> : null}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Teachers</CardTitle>
                <CardDescription>Assign additional teachers to this course.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form action={assignTeacherAction} className="grid gap-3">
                  <input type="hidden" name="courseId" value={course.id} />
                  <Input name="teacherEmail" placeholder="Teacher email" />
                  <Button type="submit" variant="outline">
                    Add teacher
                  </Button>
                </form>

                <div className="grid gap-3">
                  {course.teachers.map(({ teacher: assignedTeacher }) => (
                    <div key={assignedTeacher.id} className="flex items-center justify-between gap-3 rounded-xl border border-border p-3">
                      <div>
                        <p className="font-medium">{assignedTeacher.name ?? assignedTeacher.email}</p>
                        <p className="text-xs text-muted-foreground">{assignedTeacher.email}</p>
                      </div>
                      <form action={removeTeacherAction}>
                        <input type="hidden" name="courseId" value={course.id} />
                        <input type="hidden" name="teacherId" value={assignedTeacher.id} />
                        <Button type="submit" variant="ghost" size="sm">
                          Remove
                        </Button>
                      </form>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Danger zone</CardTitle>
                <CardDescription>Delete the course and all nested content.</CardDescription>
              </CardHeader>
              <CardContent>
                <form action={deleteCourseAction}>
                  <input type="hidden" name="courseId" value={course.id} />
                  <Button type="submit" variant="destructive">
                    Delete course
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  );
}