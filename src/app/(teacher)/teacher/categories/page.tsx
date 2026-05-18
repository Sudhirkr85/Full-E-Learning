import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { makeMetadata } from "@/lib/site";
import { requireRole } from "@/lib/auth";
import { getCourseCategories } from "@/lib/courses/queries";
import { createCategoryAction, deleteCategoryAction, updateCategoryAction } from "@/lib/courses/actions";

export const metadata: Metadata = makeMetadata({
  title: "Manage Categories",
  description: "Create and edit course categories used across the catalog.",
  path: "/teacher/categories",
  noIndex: true
});

export const dynamic = "force-dynamic";

export default async function TeacherCategoriesPage() {
  await requireRole(["TEACHER"]);
  const categories = await getCourseCategories();

  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="max-w-2xl">
          <Badge variant="secondary">Category system</Badge>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-5xl">Categories</h1>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">Manage the taxonomy used to organize courses across the public catalog and teacher dashboard.</p>
        </div>

        <Card className="mt-10 max-w-2xl">
          <CardHeader>
            <CardTitle>Create category</CardTitle>
            <CardDescription>Categories are global and can be attached to courses from the editor.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createCategoryAction} className="grid gap-4">
              <Input name="name" placeholder="Category name" required />
              <Input name="description" placeholder="Category description" />
              <Button type="submit">Create category</Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <Badge variant="outline">{category._count.courses} courses</Badge>
                <CardTitle className="mt-2">{category.name}</CardTitle>
                <CardDescription>{category.description ?? category.slug}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form action={updateCategoryAction} className="grid gap-3">
                  <input type="hidden" name="categoryId" value={category.id} />
                  <Input name="name" defaultValue={category.name} required />
                  <Input name="description" defaultValue={category.description ?? ""} placeholder="Description" />
                  <Button type="submit" variant="outline" size="sm">
                    Save
                  </Button>
                </form>
                <form action={deleteCategoryAction}>
                  <input type="hidden" name="categoryId" value={category.id} />
                  <Button type="submit" variant="destructive" size="sm">
                    Delete
                  </Button>
                </form>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}