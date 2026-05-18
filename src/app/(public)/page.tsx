import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BookOpen, GraduationCap, Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { makeMetadata } from "@/lib/site";

export const metadata: Metadata = makeMetadata({
  title: "Home",
  description: "Explore courses, learning tools, and platform access for students, teachers, and administrators.",
  path: "/"
});

export default function HomePage() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="max-w-3xl">
          <Badge variant="secondary">Learning platform foundation</Badge>
          <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-foreground md:text-6xl">A clean, scalable base for a modern LMS.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Public pages, dashboard shells, and SEO-ready structure are wired in so product work can start without redoing the foundation.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/courses">
                Browse courses <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/register">Create account</Link>
            </Button>
          </div>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <GraduationCap className="h-5 w-5 text-accent" />
              <CardTitle>Student-ready</CardTitle>
              <CardDescription>Dedicated dashboard shell for learning-focused experiences.</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <BookOpen className="h-5 w-5 text-accent" />
              <CardTitle>Teacher workspace</CardTitle>
              <CardDescription>Separate dashboard structure for course and classroom management.</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Store className="h-5 w-5 text-accent" />
              <CardTitle>Store-ready</CardTitle>
              <CardDescription>Reserved route and layout space for learning resources and product browsing.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Container>
    </section>
  );
}