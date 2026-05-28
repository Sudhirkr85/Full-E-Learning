import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { makeMetadata } from "@/lib/site";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = makeMetadata({
  title: "Admin Dashboard",
  description: "Real-time administrative stats, oversight metrics, and platform operations.",
  path: "/admin/dashboard",
  noIndex: true
});

export default async function AdminDashboardPage() {
  const user = await requireRole(["ADMIN"]);

  // Fetch real statistics server-side from Prisma
  const [studentCount, teacherCount, courseCount, revenue] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.user.count({ where: { role: "TEACHER" } }),
    prisma.course.count({ where: { status: "PUBLISHED" } }),
    prisma.payment.aggregate({
      where: { status: "SUCCEEDED" },
      _sum: { amountCents: true }
    })
  ]);

  const formattedRevenue = ((revenue._sum.amountCents ?? 0) / 100).toLocaleString("en-IN");

  return (
    <div>
      <Badge variant="secondary">Admin area</Badge>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">Platform administration for {user.name ?? user.email}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Signed in as admin. Dashboard overview presenting live governance metrics, billing history sum, and catalog counts.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-[#090d20]/60 border-white/5 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Students</CardDescription>
            <CardTitle className="text-3xl font-extrabold text-white mt-1">{studentCount}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-indigo-300 font-semibold">Registered student learner roles</CardContent>
        </Card>

        <Card className="bg-[#090d20]/60 border-white/5 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Teachers</CardDescription>
            <CardTitle className="text-3xl font-extrabold text-white mt-1">{teacherCount}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-indigo-300 font-semibold">Approved instructor profiles</CardContent>
        </Card>

        <Card className="bg-[#090d20]/60 border-white/5 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-bold uppercase tracking-wider text-slate-400">Published Courses</CardDescription>
            <CardTitle className="text-3xl font-extrabold text-white mt-1">{courseCount}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-indigo-300 font-semibold">Active catalog course listings</CardContent>
        </Card>

        <Card className="bg-[#090d20]/60 border-white/5 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Revenue</CardDescription>
            <CardTitle className="text-3xl font-extrabold text-white mt-1">₹{formattedRevenue}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-indigo-300 font-semibold">Successful payments aggregate</CardContent>
        </Card>
      </div>
    </div>
  );
}