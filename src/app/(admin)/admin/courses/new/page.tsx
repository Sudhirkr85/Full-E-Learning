import Link from "next/link";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { makeMetadata } from "@/lib/site";
import { createCourseAction } from "@/lib/courses/actions";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = makeMetadata({
  title: "Create Course - Admin Desk",
  description: "Initialize a new course shell with custom slug, category, and metadata settings.",
  path: "/admin/courses/new",
  noIndex: true
});

export default async function AdminNewCoursePage() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header back-link */}
      <div>
        <Link href="/admin/courses" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition duration-200 mb-4">
          <ArrowLeft className="h-3 w-3" /> Back to Course Manager
        </Link>
        <Badge variant="secondary">Admin oversight</Badge>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white">Create Course</h1>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
          Initialize a new course catalog shell. You can add section curriculum outlines, lesson contents, and downloadable resources after creation.
        </p>
      </div>

      <Card className="bg-[#090d20]/60 border-white/5 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white text-lg">Course Shell Details</CardTitle>
          <CardDescription className="text-slate-400">Fill in the required information to establish this course in the catalog.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createCourseAction} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Course Title</label>
                <Input name="title" placeholder="e.g. Master React & Next.js" className="bg-white/5 border-white/10 text-white placeholder-slate-500 focus-visible:ring-indigo-500" required />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Short Subtitle</label>
                <Input name="subtitle" placeholder="e.g. From beginner to production ready" className="bg-white/5 border-white/10 text-white placeholder-slate-500 focus-visible:ring-indigo-500" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Course Description</label>
              <textarea 
                name="description" 
                rows={6} 
                placeholder="Write a comprehensive overview of what students will master..." 
                className="min-h-40 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none ring-offset-background placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">SEO Excerpt</label>
              <Input name="excerpt" placeholder="Short description used in lists and Google snippet cards..." className="bg-white/5 border-white/10 text-white placeholder-slate-500 focus-visible:ring-indigo-500" />
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Level</label>
                <select name="level" defaultValue="BEGINNER" className="h-11 w-full rounded-xl border border-white/10 bg-[#0b0f1e] px-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500">
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                  <option value="ALL_LEVELS">All levels</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Language</label>
                <Input name="language" defaultValue="en" className="bg-white/5 border-white/10 text-white placeholder-slate-500 focus-visible:ring-indigo-500" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Price (In Cents)</label>
                <Input name="priceCents" type="number" min="0" step="1" placeholder="e.g. 4900 for $49.00" className="bg-white/5 border-white/10 text-white placeholder-slate-500 focus-visible:ring-indigo-500" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Currency</label>
                <Input name="currency" defaultValue="USD" className="bg-white/5 border-white/10 text-white placeholder-slate-500 focus-visible:ring-indigo-500" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Cover Image URL</label>
                <Input name="coverImageUrl" placeholder="https://..." className="bg-white/5 border-white/10 text-white placeholder-slate-500 focus-visible:ring-indigo-500" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Trailer Video URL</label>
                <Input name="trailerUrl" placeholder="https://..." className="bg-white/5 border-white/10 text-white placeholder-slate-500 focus-visible:ring-indigo-500" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Categories (Comma separated)</label>
                <Input name="categoryNames" placeholder="e.g. Next.js, React, Tailwind" className="bg-white/5 border-white/10 text-white placeholder-slate-500 focus-visible:ring-indigo-500" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Additional Teacher Emails (Optional)</label>
                <Input name="teacherEmails" placeholder="teacher1@example.com, teacher2@example.com" className="bg-white/5 border-white/10 text-white placeholder-slate-500 focus-visible:ring-indigo-500" />
              </div>
            </div>

            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl border border-white/10 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              Create Course Shell
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
