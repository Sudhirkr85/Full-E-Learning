import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { makeMetadata } from "@/lib/site";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, BookOpen, Layers, ShieldAlert, Sparkles, Tag, Users } from "lucide-react";
import {
  adminAssignTeacherAction,
  adminAttachCategoryToCourseAction,
  adminDeleteCourseAction,
  adminDetachCategoryFromCourseAction,
  adminRemoveTeacherAction,
  adminToggleCourseStatusAction,
  adminUpdateCourseAction
} from "./actions";
import { BannerUploadField } from "@/components/courses/banner-upload-field";

type CourseEditorPageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

export async function generateMetadata({ params }: CourseEditorPageProps): Promise<Metadata> {
  const { courseId } = await params;
  return makeMetadata({
    title: `Edit Course ${courseId} - Admin Desk`,
    description: "Course editor for managing the course shell, teachers, and catalog data.",
    path: `/admin/courses/${courseId}/edit`,
    noIndex: true
  });
}

export const dynamic = "force-dynamic";

export default async function CourseEditorPage({ params }: CourseEditorPageProps) {
  const admin = await requireRole(["ADMIN"]);
  const { courseId } = await params;

  // Direct fetch for the admin to allow editing any course catalog shell, including categories and teachers
  const [course, allCategories, allTeachers] = await Promise.all([
    prisma.course.findUnique({
      where: { id: courseId },
      include: {
        categories: {
          orderBy: { sortOrder: "asc" },
          include: {
            category: true
          }
        },
        teachers: {
          orderBy: { sortOrder: "asc" },
          include: {
            teacher: {
              select: {
                id: true,
                name: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true
              }
            }
          }
        }
      }
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.user.findMany({
      where: { role: { in: ["TEACHER", "ADMIN"] } },
      orderBy: { name: "asc" }
    })
  ]);

  if (!course) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
        <Badge variant="secondary" className="bg-red-500/20 text-red-300 border-red-500/30">Course not found</Badge>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-white">Course unavailable</h1>
        <p className="mt-4 text-slate-400 max-w-md mx-auto">You do not have access to this course or it does not exist.</p>
        <Button className="mt-6" asChild>
          <Link href="/admin/courses">Back to courses</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header & Back Link */}
      <div>
        <Link href="/admin/courses" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition duration-200 mb-4">
          <ArrowLeft className="h-3 w-3" /> Back to Course Manager
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">Admin Workspace Desk</Badge>
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
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-bold animate-pulse"
                    : course.status === "ARCHIVED"
                    ? "bg-slate-500/20 text-slate-300 border-slate-500/30"
                    : "bg-amber-500/20 text-amber-300 border-amber-500/30 font-bold"
                }
              >
                {course.status}
              </Badge>
            </div>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-white mt-2">{course.title}</h1>
            <p className="text-sm text-slate-400 max-w-3xl mt-1">Manage core course data, attached teachers, categories, and publish state.</p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0 self-start md:self-center">
            <Button asChild className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl border border-white/10 shadow-[0_0_15px_rgba(99,102,241,0.25)]">
              <Link href={`/admin/courses/${course.id}`}>Manage Curriculum Sections</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Form Workspaces */}
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        {/* Course Details Block */}
        <Card className="bg-[#090d20]/60 border-white/5 backdrop-blur-xl relative overflow-hidden h-fit">
          <div className="absolute right-0 top-0 -z-10 h-32 w-32 rounded-full bg-indigo-500/5 blur-2xl"></div>
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-indigo-400" />
              Course details
            </CardTitle>
            <CardDescription className="text-slate-400">Slug generation updates automatically when the title changes.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={adminUpdateCourseAction} className="space-y-4">
              <input type="hidden" name="courseId" value={course.id} />
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Course Title</label>
                  <Input 
                    name="title" 
                    defaultValue={course.title} 
                    className="bg-white/5 border-white/10 text-white placeholder-slate-500 focus-visible:ring-indigo-500 h-11 text-xs" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Subtitle</label>
                  <Input 
                    name="subtitle" 
                    defaultValue={course.subtitle ?? ""} 
                    placeholder="Subtitle" 
                    className="bg-white/5 border-white/10 text-white placeholder-slate-500 focus-visible:ring-indigo-500 h-11 text-xs" 
                  />
                </div>
              </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Course Description</label>
                  <textarea 
                    name="description" 
                    rows={6} 
                    maxLength={1000}
                    defaultValue={course.description ?? ""} 
                    className="min-h-32 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none ring-offset-background placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
                    required 
                  />
                  <p className="text-[10px] text-slate-500">Maximum 1000 characters.</p>
                </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">SEO excerpt</label>
                <Input 
                  name="excerpt" 
                  defaultValue={course.excerpt ?? ""} 
                  placeholder="SEO excerpt" 
                  className="bg-white/5 border-white/10 text-white placeholder-slate-500 focus-visible:ring-indigo-500 h-11 text-xs" 
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Level</label>
                  <select 
                    name="level" 
                    defaultValue={course.level} 
                    className="h-11 w-full rounded-xl border border-white/10 bg-[#0a0f24] px-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                    <option value="ALL_LEVELS">All levels</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Language</label>
                  <Input 
                    name="language" 
                    defaultValue={course.language} 
                    className="bg-white/5 border-white/10 text-white placeholder-slate-500 focus-visible:ring-indigo-500 h-11 text-xs" 
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Course Price (₹)</label>
                  <Input 
                    name="priceInRupees" 
                    type="number" 
                    min="0" 
                    step="1" 
                    defaultValue={course.priceCents ? Math.round(course.priceCents / 100) : 0} 
                    className="bg-white/5 border-white/10 text-white placeholder-slate-500 focus-visible:ring-indigo-500 h-11 text-xs" 
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Original Price (₹)</label>
                  <Input 
                    name="originalPriceInRupees" 
                    type="number" 
                    min="0" 
                    step="1" 
                    defaultValue={(course.metadata as any)?.originalPrice ?? ""} 
                    className="bg-white/5 border-white/10 text-white placeholder-slate-500 focus-visible:ring-indigo-500 h-11 text-xs" 
                  />
                </div>
              </div>

              <BannerUploadField initialImageUrl={course.coverImageUrl} courseTitle={course.title} />

              <div className="flex flex-wrap gap-2 pt-2">
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl">
                  Save changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Right side controls panel */}
        <div className="space-y-6">
          {/* Publish State */}
          <Card className="bg-[#090d20]/60 border-white/5 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-400" />
                Publish state
              </CardTitle>
              <CardDescription className="text-slate-400">Publish or archive the course without touching content.</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={adminToggleCourseStatusAction} className="grid gap-4">
                <input type="hidden" name="courseId" value={course.id} />
                <select 
                  name="status" 
                  defaultValue={course.status} 
                  className="h-11 w-full rounded-xl border border-white/10 bg-[#0a0f24] px-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 mb-2"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
                <Button type="submit" variant="outline" className="text-indigo-400 hover:text-white border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10 rounded-xl">
                  Update status
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Categories */}
          <Card className="bg-[#090d20]/60 border-white/5 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Tag className="h-5 w-5 text-indigo-400" />
                Categories
              </CardTitle>
              <CardDescription className="text-slate-400">Attach or remove categories from this course.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form action={adminAttachCategoryToCourseAction} className="grid gap-3">
                <input type="hidden" name="courseId" value={course.id} />
                <select 
                  name="categoryName" 
                  className="h-11 w-full rounded-xl border border-white/10 bg-[#0a0f24] px-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 mb-2"
                  required
                >
                  <option value="">Select category...</option>
                  {allCategories.map((cat: any) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <Button type="submit" variant="outline" className="text-indigo-400 hover:text-white border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10 rounded-xl">
                  Attach category
                </Button>
              </form>

              <div className="flex flex-wrap gap-2 pt-2">
                {course.categories.map(({ category }: any) => (
                  <form key={category.id} action={adminDetachCategoryFromCourseAction}>
                    <input type="hidden" name="courseId" value={course.id} />
                    <input type="hidden" name="categoryId" value={category.id} />
                    <Button type="submit" variant="secondary" size="sm" className="rounded-xl bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white">
                      {category.name} ×
                    </Button>
                  </form>
                ))}
                {!course.categories.length ? <p className="text-xs text-slate-500">No categories attached yet.</p> : null}
              </div>
            </CardContent>
          </Card>

          {/* Teachers */}
          <Card className="bg-[#090d20]/60 border-white/5 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-400" />
                Teachers
              </CardTitle>
              <CardDescription className="text-slate-400">Assign additional teachers to this course.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form action={adminAssignTeacherAction} className="grid gap-3">
                <input type="hidden" name="courseId" value={course.id} />
                <select 
                  name="teacherEmail" 
                  className="h-11 w-full rounded-xl border border-white/10 bg-[#0a0f24] px-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 mb-2"
                  required
                >
                  <option value="">Select teacher...</option>
                  {allTeachers.map((t: any) => (
                    <option key={t.id} value={t.email}>
                      {t.name ?? t.email} ({t.role.toLowerCase()})
                    </option>
                  ))}
                </select>
                <Button type="submit" variant="outline" className="text-indigo-400 hover:text-white border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10 rounded-xl">
                  Add teacher
                </Button>
              </form>

              <div className="grid gap-2.5 pt-2">
                {course.teachers.map(({ teacher: assignedTeacher }: any) => (
                  <div key={assignedTeacher.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.01] p-3">
                    <div>
                      <p className="font-semibold text-xs text-white">{assignedTeacher.name ?? assignedTeacher.email}</p>
                      <p className="text-[10px] text-slate-400">{assignedTeacher.email}</p>
                    </div>
                    <form action={adminRemoveTeacherAction}>
                      <input type="hidden" name="courseId" value={course.id} />
                      <input type="hidden" name="teacherId" value={assignedTeacher.id} />
                      <Button type="submit" variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-500/5 rounded-xl">
                        Remove
                      </Button>
                    </form>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="bg-[#090d20]/60 border-red-500/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-red-400 text-lg flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-red-400" />
                Danger zone
              </CardTitle>
              <CardDescription className="text-slate-400">Delete the course and all nested content.</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={adminDeleteCourseAction}>
                <input type="hidden" name="courseId" value={course.id} />
                <Button type="submit" variant="destructive" className="bg-red-500 hover:bg-red-600 text-white rounded-xl w-full">
                  Delete course
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
