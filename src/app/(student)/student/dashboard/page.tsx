import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { makeMetadata } from "@/lib/site";

export const metadata: Metadata = makeMetadata({
  title: "Student Dashboard",
  description: "Student dashboard placeholder with SEO-safe noindex metadata.",
  path: "/student/dashboard",
  noIndex: true
});

export default function StudentDashboardPage() {
  return (
    <div>
      <Badge variant="secondary">Student area</Badge>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">Welcome, student</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Placeholder dashboard content ready for progress, assignments, and course updates later.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Active courses</CardTitle>
            <CardDescription>Placeholder metric card.</CardDescription>
          </CardHeader>
          <CardContent>0 courses connected</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Progress</CardTitle>
            <CardDescription>Placeholder metric card.</CardDescription>
          </CardHeader>
          <CardContent>Progress tracking will be added later.</CardContent>
        </Card>
      </div>
    </div>
  );
}