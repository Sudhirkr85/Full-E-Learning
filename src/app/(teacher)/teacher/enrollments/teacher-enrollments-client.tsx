"use client";

import React, { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Users, 
  GraduationCap, 
  Search, 
  ArrowRight,
  Sparkles
} from "lucide-react";
import Link from "next/link";

type User = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
};

type Course = {
  id: string;
  title: string;
};

type CourseProgress = {
  progressPercent: number;
};

type EnrollmentItem = {
  id: string;
  createdAt: Date;
  user: User;
  course: Course;
  progress: CourseProgress | null;
};

type TeacherEnrollmentsClientProps = {
  enrollments: EnrollmentItem[];
  metrics: {
    myTotalStudents: number;
    activeLearners: number;
    completions: number;
  };
};

export function TeacherEnrollmentsClient({ enrollments, metrics }: TeacherEnrollmentsClientProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all, active, completed

  // Helper to hash initials to colors
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

  const daysSince = (date: Date) => {
    const diffTime = Math.abs(new Date().getTime() - new Date(date).getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Filter & Search
  const filteredEnrollments = useMemo(() => {
    return enrollments.filter((e) => {
      const name = (e.user.name || "").toLowerCase();
      const email = e.user.email.toLowerCase();
      const query = search.toLowerCase();
      const matchesSearch = name.includes(query) || email.includes(query);

      const progress = e.progress?.progressPercent ?? 0;
      if (filter === "completed") {
        return matchesSearch && progress === 100;
      }
      if (filter === "active") {
        return matchesSearch && progress < 100;
      }
      return matchesSearch;
    });
  }, [enrollments, search, filter]);

  return (
    <div className="space-y-6">
      {/* 3 Metric Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Metric 1 */}
        <Card className="bg-[#090d20]/60 border-white/5 backdrop-blur-xl p-5 shadow-[0_15px_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            My Total Students
            <Users className="h-4.5 w-4.5 text-indigo-400" />
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{metrics.myTotalStudents}</p>
          <p className="text-[10px] text-slate-500 mt-1">Students registered in your courses</p>
        </Card>

        {/* Metric 2 */}
        <Card className="bg-[#090d20]/60 border-white/5 backdrop-blur-xl p-5 shadow-[0_15px_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            Active Learners
            <Sparkles className="h-4.5 w-4.5 text-cyan-400" />
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{metrics.activeLearners}</p>
          <p className="text-[10px] text-slate-500 mt-1">Students actively in-progress</p>
        </Card>

        {/* Metric 3 */}
        <Card className="bg-[#090d20]/60 border-white/5 backdrop-blur-xl p-5 shadow-[0_15px_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            Completions
            <GraduationCap className="h-4.5 w-4.5 text-purple-400" />
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{metrics.completions}</p>
          <p className="text-[10px] text-slate-500 mt-1">Students who finished curriculum</p>
        </Card>
      </div>

      {/* Search and Filters panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#090d20]/40 border border-white/5 rounded-2xl p-4">
        {/* Enrollment Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 px-1">Filter status:</span>
          {[
            { label: "All Students", val: "all" },
            { label: "Active", val: "active" },
            { label: "Completed", val: "completed" }
          ].map((pill) => (
            <button
              key={pill.val}
              onClick={() => setFilter(pill.val)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition ${
                filter === pill.val
                  ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                  : "bg-transparent text-slate-400 border-white/5 hover:border-white/10 hover:text-white"
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student name or email..."
            className="pl-10 rounded-xl bg-slate-950/60 border-white/5 text-white placeholder-slate-600 focus-visible:ring-1 focus-visible:ring-indigo-500/40"
          />
        </div>
      </div>

      {/* Enrollments Table */}
      <div className="overflow-x-auto rounded-2xl border border-white/5 bg-[#090d20]/30 shadow-[0_15px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.01] text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <th className="p-4">Student</th>
              <th className="p-4">Course</th>
              <th className="p-4">Mobile</th>
              <th className="p-4">Progress</th>
              <th className="p-4">Status</th>
              <th className="p-4">Enrolled On</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-300 font-medium">
            {filteredEnrollments.length > 0 ? (
              filteredEnrollments.map((e) => {
                const progress = e.progress?.progressPercent ?? 0;
                const isCompleted = progress === 100;
                return (
                  <tr key={e.id} className="hover:bg-white/[0.01] transition-colors duration-150">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-xl border flex items-center justify-center font-bold text-xs shrink-0 ${getAvatarColor(e.user.name || e.user.email)}`}>
                          {getInitials(e.user.name, e.user.email)}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{e.user.name || "Student"}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{e.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-slate-200">{e.course.title}</td>
                    <td className="p-4 text-slate-400">{e.user.phone || <span className="text-slate-600 italic">Not set</span>}</td>
                    <td className="p-4 w-40">
                      {progress === 0 && daysSince(e.createdAt) < 7 ? (
                        <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/20 font-bold text-[9px] uppercase tracking-widest">Not started</Badge>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[10px] text-slate-400 font-extrabold">
                            <span>{progress}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5">
                            <div 
                              className={`h-full rounded-full transition-all duration-300 ${isCompleted ? "bg-purple-500" : "bg-emerald-500"}`} 
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      {isCompleted ? (
                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 font-bold text-[9px] uppercase tracking-widest">Completed</Badge>
                      ) : (
                        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-bold text-[9px] uppercase tracking-widest">Active</Badge>
                      )}
                    </td>
                    <td className="p-4 text-slate-400">
                      {new Date(e.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500 italic">
                  No students enrolled in your courses yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
