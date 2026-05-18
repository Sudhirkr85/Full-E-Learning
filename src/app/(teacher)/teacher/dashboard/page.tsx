import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { makeMetadata } from "@/lib/site";
import { requireRole } from "@/lib/auth";

export const metadata: Metadata = makeMetadata({
  title: "Teacher Dashboard",
  description: "Teacher dashboard placeholder with SEO-safe noindex metadata.",
  path: "/teacher/dashboard",
  noIndex: true
});

export default async function TeacherDashboardPage() {
  const user = await requireRole(["TEACHER"]);

  return (
    <div>
      <Badge variant="secondary">Teacher area</Badge>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">Instructor dashboard for {user.name ?? user.email}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Signed in as teacher. Placeholder workspace for course authoring, grading, and student support.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Published courses</CardTitle>
            <CardDescription>Manage course shells, categories, and teaching assignments.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/teacher/courses">Open course manager</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
            <CardDescription>Organize the catalog taxonomy used by public course pages.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/teacher/categories">Manage categories</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}