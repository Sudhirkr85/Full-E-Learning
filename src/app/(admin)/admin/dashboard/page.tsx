import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { makeMetadata } from "@/lib/site";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardCharts } from "@/components/admin/dashboard-charts";
import { ArrowUpRight, GraduationCap, Users as UsersIcon, BookOpen, IndianRupee } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata: Metadata = makeMetadata({
  title: "Admin Dashboard",
  description: "Real-time administrative stats, oversight metrics, and platform operations.",
  path: "/admin/dashboard",
  noIndex: true
});

export default async function AdminDashboardPage() {
  const user = await requireRole(["ADMIN"]);

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  // Fetch real statistics server-side from Prisma
  const [
    studentCount,
    studentsRecent,
    studentsPrior,
    teacherCount,
    teachersRecent,
    teachersPrior,
    adminCount,
    courseCount,
    coursesRecent,
    coursesPrior,
    revenueSum,
    revenueRecentSum,
    revenuePriorSum,
    payments,
    courseRevenueSum,
    courseRevenueRecentSum,
    courseRevenuePriorSum,
    coursePayments,
    recentEnrollments
  ] = await Promise.all([
    // Totals
    prisma.user.count({ where: { role: "STUDENT" } }),
    // Recent/Prior Students (last 30 days vs 30 days prior)
    prisma.user.count({ where: { role: "STUDENT", createdAt: { gte: thirtyDaysAgo } } }),
    prisma.user.count({ where: { role: "STUDENT", createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
    
    prisma.user.count({ where: { role: "TEACHER" } }),
    // Recent/Prior Teachers (last 7 days vs 7 days prior)
    prisma.user.count({ where: { role: "TEACHER", createdAt: { gte: sevenDaysAgo } } }),
    prisma.user.count({ where: { role: "TEACHER", createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo } } }),

    prisma.user.count({ where: { role: "ADMIN" } }),
    
    prisma.course.count({ where: { status: "PUBLISHED" } }),
    // Recent/Prior Courses (last 30 days vs 30 days prior)
    prisma.course.count({ where: { status: "PUBLISHED", createdAt: { gte: thirtyDaysAgo } } }),
    prisma.course.count({ where: { status: "PUBLISHED", createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),

    prisma.payment.aggregate({
      where: { status: "SUCCEEDED" },
      _sum: { amountCents: true }
    }),
    // Recent/Prior Revenue (last 30 days vs 30 days prior)
    prisma.payment.aggregate({
      where: { status: "SUCCEEDED", createdAt: { gte: thirtyDaysAgo } },
      _sum: { amountCents: true }
    }),
    prisma.payment.aggregate({
      where: { status: "SUCCEEDED", createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } },
      _sum: { amountCents: true }
    }),

    prisma.payment.findMany({
      where: {
        status: "SUCCEEDED",
        paidAt: { gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) }
      },
      select: {
        amountCents: true,
        paidAt: true,
        createdAt: true
      }
    }),
    
    // Course Revenue Aggregates
    prisma.enrollment.aggregate({
      where: { paymentStatus: { in: ["COMPLETED", "PAID"] } },
      _sum: { amountPaid: true }
    }),
    prisma.enrollment.aggregate({
      where: { paymentStatus: { in: ["COMPLETED", "PAID"] }, enrolledAt: { gte: thirtyDaysAgo } },
      _sum: { amountPaid: true }
    }),
    prisma.enrollment.aggregate({
      where: { paymentStatus: { in: ["COMPLETED", "PAID"] }, enrolledAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } },
      _sum: { amountPaid: true }
    }),
    prisma.enrollment.findMany({
      where: {
        paymentStatus: { in: ["COMPLETED", "PAID"] },
        enrolledAt: { gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) }
      },
      select: {
        amountPaid: true,
        paidAt: true,
        enrolledAt: true
      }
    }),

    prisma.enrollment.findMany({
      take: 5,
      orderBy: { enrolledAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        course: { select: { title: true, priceCents: true } }
      }
    })
  ]);

  const totalUsers = studentCount + teacherCount + adminCount;
  
  const totalStoreRevenueCents = revenueSum._sum.amountCents ?? 0;
  const totalCourseRevenueCents = (courseRevenueSum._sum.amountPaid ?? 0) * 100;
  const totalRevCents = totalStoreRevenueCents + totalCourseRevenueCents;
  const formattedRevenue = (totalRevCents / 100).toLocaleString("en-IN");

  // Compute actual percentage trends dynamically
  const studentTrend = studentsPrior > 0 
    ? Math.round(((studentsRecent - studentsPrior) / studentsPrior) * 100) 
    : (studentsRecent > 0 ? 100 : 0);

  const teacherTrend = teachersPrior > 0 
    ? Math.round(((teachersRecent - teachersPrior) / teachersPrior) * 100) 
    : (teachersRecent > 0 ? 100 : 0);

  const courseTrend = coursesPrior > 0 
    ? Math.round(((coursesRecent - coursesPrior) / coursesPrior) * 100) 
    : (coursesRecent > 0 ? 100 : 0);

  const revRecent = (revenueRecentSum._sum.amountCents ?? 0) + (courseRevenueRecentSum._sum.amountPaid ?? 0) * 100;
  const revPrior = (revenuePriorSum._sum.amountCents ?? 0) + (courseRevenuePriorSum._sum.amountPaid ?? 0) * 100;
  const revenueTrend = revPrior > 0 
    ? Math.round(((revRecent - revPrior) / revPrior) * 100) 
    : (revRecent > 0 ? 100 : 0);

  // Helper to render trend indicators with correct color scaling (emerald for growth, rose for decline)
  const renderTrend = (value: number, periodLabel: string) => {
    const isPositive = value >= 0;
    const absValue = Math.abs(value);
    return (
      <span className={cn(
        "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 font-bold text-[9px] uppercase tracking-wider",
        isPositive ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25" : "bg-rose-500/10 text-rose-400 border border-rose-500/25"
      )}>
        <ArrowUpRight className={cn("h-2.5 w-2.5 shrink-0", !isPositive && "rotate-90")} />
        {isPositive ? "+" : "-"}{absValue}% {periodLabel}
      </span>
    );
  };

  // Compute 6 months revenue history for BarChart
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const revenueByMonth: Record<string, number> = {};

  // Initialize revenue map for last 6 months
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthName = months[d.getMonth()];
    revenueByMonth[monthName] = 0;
  }

  payments.forEach((p) => {
    const date = p.paidAt || p.createdAt;
    const monthName = months[date.getMonth()];
    if (revenueByMonth[monthName] !== undefined) {
      revenueByMonth[monthName] += p.amountCents / 100;
    }
  });

  coursePayments.forEach((cp) => {
    const date = cp.paidAt || cp.enrolledAt;
    const monthName = months[date.getMonth()];
    if (revenueByMonth[monthName] !== undefined) {
      revenueByMonth[monthName] += cp.amountPaid || 0;
    }
  });

  const revenueHistory = Object.keys(revenueByMonth).map((month) => ({
    name: month,
    revenue: revenueByMonth[month]
  }));

  // User Distribution ratio for PieChart
  const userRatio = [
    { name: "Students", value: studentCount, color: "#6366f1" }, // Indigo
    { name: "Teachers", value: teacherCount, color: "#06b6d4" }, // Cyan
    { name: "Admins", value: adminCount, color: "#a855f7" }     // Purple
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <Badge variant="secondary" className="w-fit">Admin area</Badge>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-white">
          Welcome back, {user.name ?? user.email}
        </h1>
        <p className="text-xs text-slate-400">
          Monitor platform metrics, revenues, student ratios, and checkouts at a single glance. All trends calculated dynamically.
        </p>
      </div>

      {/* Top row — 4 stat cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Students */}
        <Card className="bg-[#090d20]/60 border-white/5 backdrop-blur-xl relative overflow-hidden group shadow-[0_15px_30px_rgba(0,0,0,0.5)]">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              Total Students
              <UsersIcon className="h-4 w-4 text-indigo-400/80" />
            </CardDescription>
            <CardTitle className="text-3xl font-extrabold text-white mt-2">{studentCount}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between text-xs mt-1">
            <span className="text-slate-400">Registered learners</span>
            {renderTrend(studentTrend, "30d")}
          </CardContent>
        </Card>

        {/* Card 2: Total Teachers */}
        <Card className="bg-[#090d20]/60 border-white/5 backdrop-blur-xl relative overflow-hidden group shadow-[0_15px_30px_rgba(0,0,0,0.5)]">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              Total Teachers
              <GraduationCap className="h-4 w-4 text-cyan-400/80" />
            </CardDescription>
            <CardTitle className="text-3xl font-extrabold text-white mt-2">{teacherCount}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between text-xs mt-1">
            <span className="text-slate-400">Approved instructors</span>
            {renderTrend(teacherTrend, "7d")}
          </CardContent>
        </Card>

        {/* Card 3: Published Courses */}
        <Card className="bg-[#090d20]/60 border-white/5 backdrop-blur-xl relative overflow-hidden group shadow-[0_15px_30px_rgba(0,0,0,0.5)]">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              Published Courses
              <BookOpen className="h-4 w-4 text-purple-400/80" />
            </CardDescription>
            <CardTitle className="text-3xl font-extrabold text-white mt-2">{courseCount}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between text-xs mt-1">
            <span className="text-slate-400">Active catalog items</span>
            {renderTrend(courseTrend, "30d")}
          </CardContent>
        </Card>

        {/* Card 4: Total Revenue */}
        <Card className="bg-[#090d20]/60 border-white/5 backdrop-blur-xl relative overflow-hidden group shadow-[0_15px_30px_rgba(0,0,0,0.5)]">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              Total Revenue
              <IndianRupee className="h-4 w-4 text-emerald-400/80" />
            </CardDescription>
            <CardTitle className="text-3xl font-extrabold text-white mt-2">₹{formattedRevenue}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between text-xs mt-1">
            <span className="text-slate-400">Direct wallet aggregates</span>
            {renderTrend(revenueTrend, "30d")}
          </CardContent>
        </Card>
      </div>

      {/* Middle row — 2 charts side by side */}
      <DashboardCharts 
        userRatio={userRatio} 
        revenueHistory={revenueHistory} 
        totalUsers={totalUsers} 
      />

      {/* Bottom row — 1 wide card: Recent Enrollments Table */}
      <Card className="bg-[#090d20]/50 border-white/5 shadow-[0_15px_30px_rgba(0,0,0,0.4)] backdrop-blur-xl rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400">Recent Enrollments</h3>
            <p className="text-xs text-slate-500 mt-1">Audited listing of the latest 5 course unlocks</p>
          </div>
          <Badge variant="outline" className="border-indigo-500/30 text-indigo-300 font-bold px-3.5 py-1 text-[10px] rounded-full uppercase tracking-wider bg-indigo-500/5">
            Live Stream
          </Badge>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/5 bg-slate-950/20">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01] text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4">Student</th>
                <th className="p-4">Course</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Amount Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300 font-medium">
              {recentEnrollments.length > 0 ? (
                recentEnrollments.map((enrollment) => (
                  <tr key={enrollment.id} className="hover:bg-white/[0.01] transition-colors duration-150">
                    <td className="p-4">
                      <p className="font-semibold text-white">{enrollment.user.name || "Student"}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{enrollment.user.email}</p>
                    </td>
                    <td className="p-4 max-w-xs truncate font-semibold text-slate-200">
                      {enrollment.course.title}
                    </td>
                    <td className="p-4 text-slate-400">
                      {new Date(enrollment.enrolledAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric"
                      })}
                    </td>
                    <td className="p-4 text-right font-extrabold text-emerald-400">
                      {enrollment.course.priceCents > 0 
                        ? `₹${(enrollment.course.priceCents / 100).toLocaleString("en-IN")}`
                        : "Free"
                      }
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500 italic">
                    No recent enrollments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}