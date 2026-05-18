import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { makeMetadata } from "@/lib/site";

export const metadata: Metadata = makeMetadata({
  title: "Admin Dashboard",
  description: "Admin dashboard placeholder with SEO-safe noindex metadata.",
  path: "/admin/dashboard",
  noIndex: true
});

export default function AdminDashboardPage() {
  return (
    <div>
      <Badge variant="secondary">Admin area</Badge>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">Platform administration</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Placeholder admin area for governance, configuration, and user oversight.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User accounts</CardTitle>
            <CardDescription>Placeholder metric card.</CardDescription>
          </CardHeader>
          <CardContent>Account controls will be added later.</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Platform settings</CardTitle>
            <CardDescription>Placeholder metric card.</CardDescription>
          </CardHeader>
          <CardContent>Settings surfaces remain reserved.</CardContent>
        </Card>
      </div>
    </div>
  );
}