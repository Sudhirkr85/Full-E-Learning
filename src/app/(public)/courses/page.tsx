import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { makeMetadata } from "@/lib/site";

export const metadata: Metadata = makeMetadata({
  title: "Courses",
  description: "Browse the course catalog and discover learning paths for every role.",
  path: "/courses"
});

export default function CoursesPage() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="max-w-2xl">
          <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">Courses</h1>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">Placeholder catalog page ready for course cards, filters, and SEO content later.</p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[
            { title: "Introduction to Learning Systems", slug: "intro-learning-systems" },
            { title: "Modern Teaching Workflow", slug: "modern-teaching-workflow" },
            { title: "Student Success Toolkit", slug: "student-success-toolkit" }
          ].map((course) => (
            <Card key={course.slug}>
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
                <CardDescription>SEO-friendly placeholder card for future catalog data.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline">
                  <Link href={`/courses/${course.slug}`}>View details</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}