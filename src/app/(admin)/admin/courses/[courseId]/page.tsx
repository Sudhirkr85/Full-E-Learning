import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { makeMetadata } from "@/lib/site";
import { ArrowLeft, BookOpen, Clock, FileText, LayoutList, PlayCircle, Users } from "lucide-react";
import { AddSectionForm, AddLessonForm } from "./outline-client";

export const metadata: Metadata = makeMetadata({
  title: "Course Curriculum Details - Admin Desk",
  description: "Curriculum outline details, sections compilation, and interactive lessons setup.",
  path: "/admin/courses",
  noIndex: true
});

type CourseDetailPageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

export default async function AdminCourseDetailPage({ params }: CourseDetailPageProps) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const { courseId } = await params;

  // Query course by ID, including sections (ordered) and lessons (ordered)
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      sections: {
        include: {
          lessons: {
            orderBy: { orderIndex: "asc" }
          }
        },
        orderBy: { orderIndex: "asc" }
      },
      _count: {
        select: { enrollments: true }
      }
    }
  });

  if (!course) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header back-link */}
      <div>
        <Link href="/admin/courses" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition duration-200 mb-4">
          <ArrowLeft className="h-3 w-3" /> Back to Course Manager
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">Admin Curriculum Desk</Badge>
              <Badge
                variant={
                  course.status === "PUBLISHED"
                    ? "default"
                    : course.status === "ARCHIVED"
                    ? "secondary"
                    : "outline"
                }
                className={
                  course.status === "PUBLISHED"
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-bold"
                    : course.status === "ARCHIVED"
                    ? "bg-slate-500/20 text-slate-300 border-slate-500/30"
                    : "bg-amber-500/20 text-amber-300 border-amber-500/30 font-bold"
                }
              >
                {course.status}
              </Badge>
            </div>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-white mt-2">{course.title}</h1>
            <p className="text-sm text-slate-400 max-w-3xl mt-1">{course.subtitle ?? course.description ?? "No description provided."}</p>
          </div>

          <div className="flex items-center gap-4 bg-[#090d20]/80 p-3 rounded-2xl border border-white/5 w-fit shrink-0">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-indigo-400" />
              <div className="text-left">
                <span className="block text-xs text-slate-400 leading-none">Enrollments</span>
                <span className="text-lg font-bold text-white leading-none">{course._count.enrollments}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: Section and Curriculum Outline */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <LayoutList className="h-4.5 w-4.5 text-indigo-400" />
            Curriculum Structure ({course.sections.length} Sections)
          </h2>

          {course.sections.length > 0 ? (
            <div className="space-y-4">
              {course.sections.map((s, sIndex) => (
                <Card key={s.id} className="bg-[#090d20]/50 border-white/5 backdrop-blur-xl">
                  <CardHeader className="pb-3 border-b border-white/5 flex flex-row items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest leading-none">Section {sIndex + 1}</span>
                      <CardTitle className="text-white text-base mt-1 leading-none">{s.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-3 space-y-2">
                    {s.lessons.length > 0 ? (
                      <div className="space-y-1.5">
                        {s.lessons.map((l, lIndex) => {
                          const Icon = l.contentType === "VIDEO" ? PlayCircle : FileText;
                          return (
                            <div key={l.id} className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all">
                              <span className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                                <Icon className="h-4 w-4 text-indigo-400 shrink-0" />
                                {lIndex + 1}. {l.title}
                              </span>
                              <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 border border-white/5 px-1.5 py-0.5 rounded-lg bg-white/[0.02]">
                                {l.contentType}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center text-slate-500 py-3 text-xs">
                        No lessons created in this section yet.
                      </div>
                    )}
                    {/* Inline Lesson Creation */}
                    <AddLessonForm courseId={course.id} sectionId={s.id} />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="py-12 border border-dashed border-white/10 rounded-2xl text-center text-slate-500 text-sm">
              No sections created in this course curriculum. Add your first section below!
            </div>
          )}

          {/* Add Section Form */}
          <AddSectionForm courseId={course.id} />
        </div>

        {/* Right column: Course Details Info */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="h-4.5 w-4.5 text-indigo-400" />
            Meta Data
          </h2>
          <Card className="bg-[#090d20]/50 border-white/5 backdrop-blur-xl">
            <CardContent className="p-4 space-y-4">
              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Course ID</span>
                <span className="block font-mono text-[10px] text-slate-300 mt-1 truncate bg-white/5 px-2 py-1 rounded-lg border border-white/5">{course.id}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                <div>
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">Language</span>
                  <span className="text-sm font-semibold text-white mt-1 block capitalize">{course.language}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">Level</span>
                  <span className="text-sm font-semibold text-white mt-1 block capitalize">{course.level.toLowerCase().replace('_', ' ')}</span>
                </div>
              </div>
              <div className="border-t border-white/5 pt-4">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">Price</span>
                <span className="text-lg font-bold text-white mt-1 block">
                  {course.priceCents > 0 ? `₹${(course.priceCents / 100).toLocaleString('en-IN')}` : "Free"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
