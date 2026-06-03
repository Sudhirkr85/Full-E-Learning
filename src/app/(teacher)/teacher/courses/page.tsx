import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { makeMetadata } from "@/lib/site";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CoursesSearchFilter, CourseActionButtons } from "./courses-client";

export const metadata: Metadata = makeMetadata({
  title: "Manage Courses - Teacher Workspace",
  description: "Teacher course management dashboard for creating, editing, and supervising courses.",
  path: "/teacher/courses",
  noIndex: true
});

export const dynamic = "force-dynamic";

type TeacherCoursesPageProps = {
  searchParams?: Promise<{
    q?: string;
    filter?: string;
    page?: string;
    created?: string;
    updated?: string;
    deleted?: string;
    error?: string;
  }>;
};

export default async function TeacherCoursesPage({ searchParams }: TeacherCoursesPageProps) {
  const teacher = await requireRole(["TEACHER"]);
  const params = searchParams ? await searchParams : {};
  const q = params.q?.trim() || "";
  const filter = params.filter || "ALL";
  const page = params.page ? parseInt(params.page, 10) : 0;
  const currentPage = isNaN(page) || page < 0 ? 0 : page;

  // Build query where filter (Teacher sees only their courses)
  const where: any = {
    teachers: {
      some: {
        teacherId: teacher.id
      }
    }
  };
  if (filter !== "ALL") {
    where.status = filter;
  }
  if (q) {
    where.title = { contains: q, mode: "insensitive" };
  }

  // Fetch courses with nested teacher name/email & count of enrollments
  const [courses, totalCount] = await Promise.all([
    prisma.course.findMany({
      where,
      include: {
        teachers: {
          include: {
            teacher: {
              select: { name: true, email: true }
            }
          }
        },
        _count: {
          select: { enrollments: true }
        }
      },
      orderBy: { createdAt: "desc" },
      take: 20,
      skip: currentPage * 20
    }),
    prisma.course.count({ where })
  ]);

  const hasNextPage = (currentPage + 1) * 20 < totalCount;
  const hasPrevPage = currentPage > 0;

  const buildPageUrl = (targetPage: number) => {
    const searchPart = q ? `&q=${encodeURIComponent(q)}` : "";
    const filterPart = filter !== "ALL" ? `&filter=${filter}` : "";
    return `/teacher/courses?page=${targetPage}${searchPart}${filterPart}`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Badge variant="secondary">Teacher workspace</Badge>
          <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white">Course Management</h1>
          <p className="mt-2 text-sm text-slate-400 leading-relaxed max-w-3xl">
            Supervise all your teaching catalog materials. Monitor section outlines, review publishing states (draft/published/archived), and track student enrollment counts.
          </p>
        </div>
        <Button asChild className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl border border-white/10 shadow-[0_0_15px_rgba(99,102,241,0.25)] shrink-0 self-start">
          <Link href="/teacher/courses/new">Create Course</Link>
        </Button>
      </div>

      {params?.created ? <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">Course created successfully.</p> : null}
      {params?.updated ? <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">Course updated successfully.</p> : null}
      {params?.deleted ? <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">Course deleted successfully.</p> : null}
      {params?.error ? <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">Something went wrong. Please retry.</p> : null}

      <CoursesSearchFilter />

      <Card className="bg-[#090d20]/60 border-white/5 backdrop-blur-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg">Platform Courses</CardTitle>
          <CardDescription className="text-slate-400">Total of {totalCount} course shells recorded in catalog database.</CardDescription>
        </CardHeader>
        <CardContent className="px-0 md:px-6">
          {courses.length > 0 ? (
            <div>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-200 border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-slate-400 text-xs font-bold uppercase tracking-wider">
                      <th className="px-4 py-3">Course Title</th>
                      <th className="px-4 py-3">Instructor</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-center">Enrollments</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {courses.map((c) => {
                      const primaryTeacher = c.teachers[0]?.teacher?.name ?? c.teachers[0]?.teacher?.email ?? "Unassigned";
                      return (
                        <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-4 py-3.5 font-semibold text-white">
                            <Link href={`/teacher/courses/${c.id}`} className="hover:underline hover:text-indigo-400 transition">
                              {c.title}
                            </Link>
                          </td>
                          <td className="px-4 py-3.5 text-xs text-slate-300">{primaryTeacher}</td>
                          <td className="px-4 py-3.5">
                            <Badge
                              variant={
                                c.status === "PUBLISHED"
                                  ? "default"
                                  : c.status === "ARCHIVED"
                                  ? "secondary"
                                  : "outline"
                              }
                              className={
                                c.status === "PUBLISHED"
                                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-bold"
                                  : c.status === "ARCHIVED"
                                  ? "bg-slate-500/20 text-slate-300 border-slate-500/30"
                                  : "bg-amber-500/20 text-amber-300 border-amber-500/30 font-bold"
                              }
                            >
                              {c.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3.5 text-center font-mono font-bold text-xs text-slate-300">
                            {c._count.enrollments}
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Button asChild variant="ghost" size="sm" className="text-indigo-400 hover:text-white hover:bg-white/5 rounded-xl">
                                <Link href={`/teacher/courses/${c.id}`}>Manage</Link>
                              </Button>
                              <Button asChild variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-white/5 rounded-xl">
                                <Link href={`/teacher/courses/${c.id}`}>Edit</Link>
                              </Button>
                              <CourseActionButtons courseId={c.id} status={c.status} />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Stacked Card View */}
              <div className="block md:hidden space-y-4 px-4 pb-4">
                {courses.map((c) => {
                  const primaryTeacher = c.teachers[0]?.teacher?.name ?? c.teachers[0]?.teacher?.email ?? "Unassigned";
                  return (
                    <div key={c.id} className="bg-white/[0.02] border border-white/5 p-4 rounded-xl space-y-4">
                      <div>
                        <Link href={`/teacher/courses/${c.id}`} className="font-semibold text-white hover:text-indigo-400 transition leading-tight block text-sm">
                          {c.title}
                        </Link>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <Badge
                            variant={
                              c.status === "PUBLISHED"
                                ? "default"
                                : c.status === "ARCHIVED"
                                ? "secondary"
                                : "outline"
                            }
                            className={
                              c.status === "PUBLISHED"
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px] font-bold"
                                : c.status === "ARCHIVED"
                                ? "bg-slate-500/20 text-slate-300 border-slate-500/30 text-[10px]"
                                : "bg-amber-500/20 text-amber-300 border-amber-500/30 text-[10px] font-bold"
                            }
                          >
                            {c.status}
                          </Badge>
                          <span className="text-[11px] text-slate-400">Instructor: {primaryTeacher}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs border-y border-white/5 py-2">
                        <span className="text-slate-400 font-medium">Enrollments</span>
                        <span className="text-slate-200 font-bold font-mono">{c._count.enrollments}</span>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <Button asChild variant="ghost" size="sm" className="text-indigo-400 hover:text-white hover:bg-white/5 rounded-xl text-xs h-9 px-3">
                          <Link href={`/teacher/courses/${c.id}`}>Manage</Link>
                        </Button>
                        <Button asChild variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-white/5 rounded-xl text-xs h-9 px-3">
                          <Link href={`/teacher/courses/${c.id}`}>Edit</Link>
                        </Button>
                        <CourseActionButtons courseId={c.id} status={c.status} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-sm">
              No courses matching selected filters found in catalog.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      {totalCount > 20 && (
        <div className="flex items-center justify-between mt-4">
          <Button
            asChild
            variant="outline"
            disabled={!hasPrevPage}
            className={`bg-white/5 border-white/10 text-white rounded-xl ${
              !hasPrevPage ? "opacity-50 pointer-events-none" : "hover:bg-white/10 hover:text-white"
            }`}
          >
            <Link href={buildPageUrl(currentPage - 1)}>Previous</Link>
          </Button>

          <span className="text-xs text-slate-400 font-semibold">
            Page {currentPage + 1} of {Math.ceil(totalCount / 20)}
          </span>

          <Button
            asChild
            variant="outline"
            disabled={!hasNextPage}
            className={`bg-white/5 border-white/10 text-white rounded-xl ${
              !hasNextPage ? "opacity-50 pointer-events-none" : "hover:bg-white/10 hover:text-white"
            }`}
          >
            <Link href={buildPageUrl(currentPage + 1)}>Next</Link>
          </Button>
        </div>
      )}
    </div>
  );
}