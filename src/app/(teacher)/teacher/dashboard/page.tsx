import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { makeMetadata } from "@/lib/site";

export const metadata: Metadata = makeMetadata({
  title: "Teacher Dashboard",
  description: "Teacher dashboard placeholder with SEO-safe noindex metadata.",
  path: "/teacher/dashboard",
  noIndex: true
});

export default function TeacherDashboardPage() {
  return (
    <div>
      <Badge variant="secondary">Teacher area</Badge>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">Instructor dashboard</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Placeholder workspace for course authoring, grading, and student support.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Published courses</CardTitle>
            <CardDescription>Placeholder metric card.</CardDescription>
          </CardHeader>
          <CardContent>Course management will live here.</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending reviews</CardTitle>
            <CardDescription>Placeholder metric card.</CardDescription>
          </CardHeader>
          <CardContent>Review flow not implemented yet.</CardContent>
        </Card>
      </div>
    </div>
  );
}