import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { makeMetadata } from "@/lib/site";
import { createCourseAction } from "@/lib/courses/actions";

export const metadata: Metadata = makeMetadata({
  title: "Create Course",
  description: "Create a new course with slug generation, teacher ownership, and category support.",
  path: "/teacher/courses/new",
  noIndex: true
});

export default function NewCoursePage() {
  return (
    <section className="py-16 md:py-24">
      <Container className="max-w-4xl">
        <div>
          <Button asChild variant="outline">
            <Link href="/teacher/courses">Back to courses</Link>
          </Button>
          <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight md:text-5xl">Create course</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">Start with the course shell. Sections, lessons, and resources can be added after creation.</p>
        </div>

        <Card className="mt-10">
          <CardHeader>
            <CardTitle>Course details</CardTitle>
            <CardDescription>Required fields plus optional metadata for SEO and future storefront integrations.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createCourseAction} className="grid gap-4">
              <div className="grid gap-2 md:grid-cols-2">
                <Input name="title" placeholder="Course title" required />
                <Input name="subtitle" placeholder="Short subtitle" />
              </div>
              <textarea name="description" rows={6} placeholder="Course description" className="min-h-40 rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" required />
              <Input name="excerpt" placeholder="SEO excerpt" />
              <div className="grid gap-2 md:grid-cols-4">
                <select name="level" defaultValue="BEGINNER" className="h-11 rounded-xl border border-input bg-background px-4 text-sm">
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                  <option value="ALL_LEVELS">All levels</option>
                </select>
                <Input name="language" defaultValue="en" placeholder="Language" />
                <Input name="priceCents" type="number" min="0" step="1" placeholder="Price in cents" />
                <Input name="currency" defaultValue="USD" placeholder="Currency" />
              </div>
              <Input name="coverImageUrl" placeholder="Cover image URL" />
              <Input name="trailerUrl" placeholder="Trailer URL" />
              <Input name="categoryNames" placeholder="Categories, comma separated" />
              <Input name="teacherEmails" placeholder="Additional teacher emails, comma separated" />
              <Button type="submit">Create course</Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </section>
  );
}