"use client";

import React, { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Award,
  Plus,
  Settings,
  FolderOpen,
  HelpCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  FileText,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MessageSquare
} from "lucide-react";
import Link from "next/link";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

type User = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
};

type CourseProgress = {
  progressPercent: number;
};

type Course = {
  id: string;
  title: string;
  status: string;
  _count?: {
    enrollments: number;
  };
  enrollments?: {
    progress: CourseProgress | null;
  }[];
};

type Enrollment = {
  id: string;
  createdAt: Date;
  enrolledAt: Date;
  user: User;
  course: {
    id: string;
    title: string;
  };
  progress: CourseProgress | null;
};

type Attempt = {
  id: string;
  test: {
    title: string;
  };
  user: User;
  scorePercent: number | null;
  submittedAt: Date | null;
  status: string;
};

type LessonProgressItem = {
  id: string;
  completedAt: Date | null;
  enrollment: {
    user: User;
  };
  lesson: {
    title: string;
  };
};

type SupportTicket = {
  id: string;
  createdAt: Date;
  subject: string;
  status: string;
  priority: string;
  reporter: User;
};

type TeacherDashboardClientProps = {
  teacherName: string;
  stats: {
    totalCourses: number;
    totalStudents: number;
    activeEnrollments: number;
    avgCompletionRate: number;
  };
  courses: Course[];
  students: {
    id: string;
    name: string | null;
    email: string;
    courseTitle: string;
    progressPercent: number;
    joinedAt: Date;
  }[];
  recentActivity: {
    recentEnrollments: Enrollment[];
    recentSubmissions: Attempt[];
    recentCompletions: LessonProgressItem[];
  };
  charts: {
    enrollmentTrend: { month: string; enrollments: number }[];
    completionRatio: { name: string; value: number; color: string }[];
  };
};

export function TeacherDashboardClient({
  teacherName,
  stats,
  courses,
  students,
  recentActivity,
  charts
}: TeacherDashboardClientProps) {
  const [activeActivityTab, setActiveActivityTab] = useState<"enrollments" | "submissions" | "completions">("enrollments");

  // Custom tooltips to match glassmorphism dark UI
  const renderCustomTooltipArea = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-xl border border-white/10 bg-[#070b19]/90 px-3.5 py-2.5 shadow-2xl backdrop-blur-xl text-xs font-semibold">
          <p className="text-slate-400 mb-0.5">{data.month}</p>
          <p className="text-indigo-400 font-extrabold">{data.enrollments} enrollments</p>
        </div>
      );
    }
    return null;
  };

  const renderCustomTooltipPie = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-xl border border-white/10 bg-[#070b19]/90 px-3.5 py-2.5 shadow-2xl backdrop-blur-xl text-xs font-semibold">
          <p className="text-white mb-0.5">{data.name}</p>
          <p className="text-indigo-400 font-extrabold">{data.value}% of Students</p>
        </div>
      );
    }
    return null;
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-indigo-600/20 text-indigo-300 border-indigo-500/30",
      "bg-cyan-600/20 text-cyan-300 border-cyan-500/30",
      "bg-emerald-600/20 text-emerald-300 border-emerald-500/30",
      "bg-purple-600/20 text-purple-300 border-purple-500/30",
      "bg-pink-600/20 text-pink-300 border-pink-500/30",
    ];
    let hash = 0;
    const str = name || "Student";
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const getInitials = (name: string | null, email: string) => {
    const displayName = name || email;
    const parts = displayName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <div className="space-y-8 pb-10">
      {/* 1. Hero / Welcome Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gradient-to-r from-[#090d20]/80 to-slate-950 border border-white/5 rounded-3xl p-6 lg:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full filter blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-cyan-500/5 rounded-full filter blur-[60px] pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <Badge variant="secondary" className="w-fit bg-indigo-500/10 text-indigo-300 border-indigo-500/20 font-bold uppercase tracking-wider text-[10px]">
            Instructor hub
          </Badge>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-1">
            Good morning, <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">{teacherName}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Welcome back to your curriculum workstation. Here is a unified snapshot of your active students, course progressions, and learning milestones.
          </p>
        </div>

        {/* Quick actions panel */}
        <div className="flex flex-wrap gap-2.5 shrink-0 relative z-10">
          <Link href="/teacher/courses/new">
            <Button size="sm" className="h-9.5 rounded-xl font-bold bg-gradient-to-r from-indigo-600 via-cyan-600 to-cyan-500 text-white shadow-lg shadow-indigo-600/15 hover:shadow-indigo-600/30 transition-all duration-300 gap-1.5 uppercase text-[10px] tracking-wider">
              <Plus className="h-4 w-4" />
              Create Course
            </Button>
          </Link>
          <Link href="/teacher/courses">
            <Button size="sm" variant="outline" className="h-9.5 rounded-xl font-bold border-white/10 hover:border-indigo-500/40 text-slate-300 hover:text-white bg-slate-950/60 hover:bg-indigo-500/5 transition-all duration-300 gap-1.5 uppercase text-[10px] tracking-wider">
              <FolderOpen className="h-4 w-4 text-indigo-400" />
              Manage Courses
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Courses", val: stats.totalCourses, desc: "Created shell assets", icon: BookOpen, color: "text-indigo-400" },
          { label: "Total Students", val: stats.totalStudents, desc: "Unique enrolled accounts", icon: Users, color: "text-cyan-400" },
          { label: "Active Enrollments", val: stats.activeEnrollments, desc: "Active learning seats", icon: UserCheck, color: "text-emerald-400" },
          { label: "Avg Completion Rate", val: `${stats.avgCompletionRate}%`, desc: "Syllabus checkpoints met", icon: Award, color: "text-purple-400" }
        ].map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="bg-[#090d20]/50 border-white/5 backdrop-blur-xl p-5 shadow-[0_15px_30px_rgba(0,0,0,0.4)] hover:border-white/10 hover:shadow-indigo-500/5 transition-all duration-300 group">
              <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                {card.label}
                <Icon className={`h-4.5 w-4.5 ${card.color} group-hover:scale-110 transition-transform duration-300`} />
              </div>
              <p className="text-3xl font-extrabold text-white mt-3">{card.val}</p>
              <p className="text-[10px] text-slate-500 mt-1">{card.desc}</p>
            </Card>
          );
        })}
      </div>

      {/* 2. Analytics Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Enrollment Trend */}
        <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-[#090d20]/30 p-5 sm:p-6 shadow-[0_15px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl flex flex-col justify-between min-h-[350px]">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-slate-300">Enrollment Metrics</h3>
              <Badge className="bg-indigo-500/10 text-indigo-300 border-indigo-500/20 text-[9px] font-bold uppercase tracking-wider">6 months</Badge>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Timeline representation of registrations across all your courses</p>
          </div>

          <div className="flex-1 mt-6 min-h-[220px]">
            {charts.enrollmentTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={charts.enrollmentTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="enrollGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    stroke="rgba(255,255,255,0.3)" 
                    fontSize={9} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.3)" 
                    fontSize={9} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <Tooltip content={renderCustomTooltipArea} />
                  <Area 
                    type="monotone" 
                    dataKey="enrollments" 
                    stroke="#6366f1" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#enrollGrad)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-600 text-xs italic">
                No registrations tracked yet.
              </div>
            )}
          </div>
        </div>

        {/* Right: Progress Donut Chart */}
        <div className="rounded-2xl border border-white/5 bg-[#090d20]/30 p-6 shadow-[0_15px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl flex flex-col justify-between min-h-[350px]">
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-slate-300">Completion Ratios</h3>
            <p className="text-[10px] text-slate-500 mt-1">Syllabus progression levels among learners</p>
          </div>

          <div className="relative flex-1 flex items-center justify-center my-4 min-h-[170px]">
            {stats.totalStudents > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={170}>
                  <PieChart>
                    <Pie
                      data={charts.completionRatio}
                      cx="50%"
                      cy="50%"
                      innerRadius={52}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {charts.completionRatio.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={renderCustomTooltipPie} />
                  </PieChart>
                </ResponsiveContainer>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-1">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Learners</span>
                  <span className="text-xl font-black text-white">{stats.totalStudents}</span>
                </div>
              </>
            ) : (
              <div className="text-slate-600 text-xs italic">
                No learning records found.
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="flex flex-col gap-2 text-[10px] font-bold uppercase tracking-wider">
            {charts.completionRatio.map((item, index) => (
              <div key={`legend-${index}`} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-400">{item.name}</span>
                </div>
                <span className="text-white font-extrabold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Recent Activity & Quick Navigation */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity Panel */}
        <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-[#090d20]/30 p-5 sm:p-6 shadow-[0_15px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-slate-300">Live Activity Tracker</h3>
            
            {/* Activity tab buttons */}
            <div className="flex bg-slate-950/60 border border-white/5 rounded-xl p-0.5 text-[9px] font-bold uppercase tracking-wider">
              {[
                { id: "enrollments", label: "Enrollments" },
                { id: "submissions", label: "Quizzes" },
                { id: "completions", label: "Lessons" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveActivityTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeActivityTab === tab.id
                      ? "bg-indigo-600 text-white shadow-md font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-[220px]">
            {/* Enrollments Tab */}
            {activeActivityTab === "enrollments" && (
              <div className="divide-y divide-white/5">
                {recentActivity.recentEnrollments.length > 0 ? (
                  recentActivity.recentEnrollments.map((item) => (
                    <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <div className={`h-8.5 w-8.5 rounded-xl border flex items-center justify-center font-bold text-xs shrink-0 ${getAvatarColor(item.user.name || item.user.email)}`}>
                          {getInitials(item.user.name, item.user.email)}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{item.user.name || "Student"}</p>
                          <p className="text-[10px] text-slate-500">Enrolled in <span className="text-slate-300">{item.course.title}</span></p>
                        </div>
                      </div>
                      <span className="text-[9px] text-slate-500 font-medium font-mono shrink-0">
                        {new Date(item.enrolledAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-10 text-slate-500 italic text-xs">No recent student registrations.</p>
                )}
              </div>
            )}

            {/* Quizzes Tab */}
            {activeActivityTab === "submissions" && (
              <div className="divide-y divide-white/5">
                {recentActivity.recentSubmissions.length > 0 ? (
                  recentActivity.recentSubmissions.map((item) => (
                    <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="h-8.5 w-8.5 rounded-xl border border-purple-500/20 bg-purple-500/5 flex items-center justify-center font-bold shrink-0">
                          <FileText className="h-4 w-4 text-purple-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{item.user.name || item.user.email}</p>
                          <p className="text-[10px] text-slate-500">Completed <span className="text-slate-300">{item.test.title}</span></p>
                        </div>
                      </div>
                      <Badge className={`text-[9px] font-mono shrink-0 font-bold border ${
                        (item.scorePercent ?? 0) >= 75
                          ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-300 border-amber-500/20"
                      }`}>
                        Score: {item.scorePercent ?? 0}%
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-10 text-slate-500 italic text-xs">No recent test attempts completed.</p>
                )}
              </div>
            )}

            {/* Lessons Tab */}
            {activeActivityTab === "completions" && (
              <div className="divide-y divide-white/5">
                {recentActivity.recentCompletions.length > 0 ? (
                  recentActivity.recentCompletions.map((item) => (
                    <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="h-8.5 w-8.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-center font-bold shrink-0">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{item.enrollment.user.name || "Student"}</p>
                          <p className="text-[10px] text-slate-500">Completed lesson: <span className="text-slate-300 italic">{item.lesson.title}</span></p>
                        </div>
                      </div>
                      <span className="text-[9px] text-slate-500 font-mono shrink-0">
                        {item.completedAt ? new Date(item.completedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : ""}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-10 text-slate-500 italic text-xs">No recent curriculum milestones.</p>
                )}
              </div>
            )}

          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="rounded-2xl border border-white/5 bg-[#090d20]/30 p-5 sm:p-6 shadow-[0_15px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl flex flex-col justify-between">
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-slate-300">Quick Utility Desk</h3>
            <p className="text-[10px] text-slate-500 mt-1">Accelerated shortcuts for dashboard workspaces</p>
          </div>

          <div className="grid gap-2.5 my-6">
            {[
              { label: "Create Course", href: "/teacher/courses/new", icon: Plus, color: "text-indigo-400 border-indigo-500/25 bg-indigo-500/5" },
              { label: "Manage Courses", href: "/teacher/courses", icon: BookOpen, color: "text-cyan-400 border-cyan-500/25 bg-cyan-500/5" },
              { label: "Active Enrollments", href: "/teacher/enrollments", icon: GraduationCap, color: "text-emerald-400 border-emerald-500/25 bg-emerald-500/5" },
              { label: "View Categories", href: "/teacher/categories", icon: FolderOpen, color: "text-purple-400 border-purple-500/25 bg-purple-500/5" }
            ].map((action, idx) => {
              const ActionIcon = action.icon;
              return (
                <Link key={idx} href={action.href} className="w-full">
                  <Button variant="outline" className={`w-full h-11.5 rounded-xl border justify-between px-4 text-xs font-bold text-slate-200 hover:text-white transition-all duration-200 group ${action.color}`}>
                    <span className="flex items-center gap-2">
                      <ActionIcon className="h-4 w-4" />
                      {action.label}
                    </span>
                    <ArrowRight className="h-3 w-3 translate-x-0 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              );
            })}
          </div>

          <div className="border-t border-white/5 pt-4 text-center">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Instructor Portal v1.2</span>
          </div>
        </div>
      </div>

      {/* 4. My Courses Section */}
      <div className="rounded-2xl border border-white/5 bg-[#090d20]/30 p-5 sm:p-6 shadow-[0_15px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-slate-300">My Course Syllabus Shells</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Authoring shells managed by you</p>
          </div>
          <Link href="/teacher/courses">
            <Button size="sm" variant="ghost" className="text-indigo-400 hover:text-indigo-300 font-bold text-[10px] uppercase tracking-wider gap-1.5 hover:bg-transparent">
              View All
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/5 bg-slate-950/20">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01] text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                <th className="p-3.5">Course Title</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-center">Enrolled</th>
                <th className="p-3.5">Avg Progress</th>
                <th className="p-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300 font-medium">
              {courses.length > 0 ? (
                courses.slice(0, 5).map((course) => {
                  const enrolledCount = course._count?.enrollments ?? course.enrollments?.length ?? 0;
                  
                  // Compute average progress
                  const progressList = course.enrollments?.map((e) => e.progress?.progressPercent ?? 0) || [];
                  const avgProgress = progressList.length > 0 
                    ? Math.round(progressList.reduce((a, b) => a + b, 0) / progressList.length)
                    : 0;

                  return (
                    <tr key={course.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="p-3.5 font-semibold text-slate-200">{course.title}</td>
                      <td className="p-3.5">
                        <Badge className={`text-[8px] font-bold uppercase tracking-widest border ${
                          course.status === "PUBLISHED"
                            ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                            : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                        }`}>
                          {course.status}
                        </Badge>
                      </td>
                      <td className="p-3.5 text-center font-mono font-bold text-slate-400">{enrolledCount}</td>
                      <td className="p-3.5 w-44">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[9px] text-slate-500 font-extrabold">
                            <span>{avgProgress}% avg</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5">
                            <div 
                              className="h-full rounded-full bg-indigo-500" 
                              style={{ width: `${avgProgress}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 text-center">
                        <Link href={`/teacher/courses/${course.id}`}>
                          <Button size="sm" variant="outline" className="h-7.5 rounded-lg text-[9px] font-bold border-indigo-500/20 text-indigo-400 hover:text-white bg-indigo-500/5 hover:bg-indigo-500/10 uppercase tracking-wider gap-1">
                            Manage
                            <Settings className="h-3 w-3" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 italic">
                    No courses authored yet. Click "Create Course" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. My Students Section */}
      <div className="rounded-2xl border border-white/5 bg-[#090d20]/30 p-5 sm:p-6 shadow-[0_15px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-slate-300">My Students</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Learners pursuing your curriculum</p>
          </div>
          <Link href="/teacher/enrollments">
            <Button size="sm" variant="ghost" className="text-cyan-400 hover:text-cyan-300 font-bold text-[10px] uppercase tracking-wider gap-1.5 hover:bg-transparent">
              View All
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/5 bg-slate-950/20">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01] text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                <th className="p-3.5">Student</th>
                <th className="p-3.5">Enrolled Course</th>
                <th className="p-3.5">Progress</th>
                <th className="p-3.5">Joined Date</th>
                <th className="p-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300 font-medium">
              {students.length > 0 ? (
                students.slice(0, 5).map((student) => (
                  <tr key={student.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-xl border flex items-center justify-center font-bold text-xs shrink-0 ${getAvatarColor(student.name || student.email)}`}>
                          {getInitials(student.name, student.email)}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{student.name || "Student"}</p>
                          <p className="text-[9px] text-slate-500 mt-0.5">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 font-semibold text-slate-300">{student.courseTitle}</td>
                    <td className="p-3.5 w-40">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[9px] text-slate-400 font-extrabold">
                          <span>{student.progressPercent}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5">
                          <div 
                            className="h-full rounded-full bg-cyan-500" 
                            style={{ width: `${student.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-400">
                      {new Date(student.joinedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </td>
                    <td className="p-3.5 text-center">
                      <Link href="/teacher/enrollments">
                        <Button size="sm" variant="outline" className="h-7.5 rounded-lg text-[9px] font-bold border-cyan-500/20 text-cyan-400 hover:text-white bg-cyan-500/5 hover:bg-cyan-500/10 uppercase tracking-wider gap-1">
                          View progress
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 italic">
                    No active student enrollments tracked yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
