import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { makeMetadata } from "@/lib/site";

type CourseDetailsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: CourseDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;

  return makeMetadata({
    title: slug.replaceAll("-", " "),
    description: "Placeholder course detail page prepared for rich course content and structured SEO later.",
    path: `/courses/${slug}`
  });
}

export default async function CourseDetailsPage({ params }: CourseDetailsPageProps) {
  const { slug } = await params;

  return (
    <section className="py-16 md:py-24">
      <Container>
        <Badge variant="secondary">Course details</Badge>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-5xl">{slug.replaceAll("-", " ")}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
          This route is wired for future course content, lesson breakdowns, and structured data without any business logic yet.
        </p>

        <Card className="mt-10 max-w-3xl">
          <CardHeader>
            <CardTitle>Placeholder course overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-muted-foreground">
              Add syllabus content, lessons, instructors, pricing, and enrollment actions in a later phase.
            </p>
          </CardContent>
        </Card>
      </Container>
    </section>
  );
}