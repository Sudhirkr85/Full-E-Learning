import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { makeMetadata } from "@/lib/site";
import { AddCategoryForm, CategoryRowActions } from "./categories-client";

export const metadata: Metadata = makeMetadata({
  title: "Category Management - Teacher Desk",
  description: "Browse platform taxonomy tags, organize catalog layers, and CRUD course tags.",
  path: "/teacher/categories",
  noIndex: true,
});

export default async function TeacherCategoriesPage() {
  const session = await auth();
  if (!session || !["ADMIN", "TEACHER"].includes(session.user.role)) {
    redirect("/login");
  }

  // Fetch all categories with count of associated courses
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { courses: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <Badge variant="secondary">Teacher oversight</Badge>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white">Categories taxonomy</h1>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed max-w-3xl">
          Manage the structural tags used to catalog courses. Establish new tags, rename existing entries, and delete unused categories securely.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left column: categories list table */}
        <div className="md:col-span-2">
          <Card className="bg-[#090d20]/60 border-white/5 backdrop-blur-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-base">Course Categories</CardTitle>
              <CardDescription className="text-slate-400">Manage catalog categories. Total of {categories.length} taxonomy items in database.</CardDescription>
            </CardHeader>
            <CardContent className="px-0 md:px-6">
              {categories.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-200 border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 text-slate-400 text-xs font-bold uppercase tracking-wider">
                        <th className="px-4 py-3">Category Name</th>
                        <th className="px-4 py-3">Slug Key</th>
                        <th className="px-4 py-3 text-center">Attached Courses</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {categories.map((c) => (
                        <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-4 py-3 font-semibold text-white">{c.name}</td>
                          <td className="px-4 py-3 font-mono text-xs text-slate-400">{c.slug}</td>
                          <td className="px-4 py-3 text-center font-mono font-bold text-xs text-slate-300">
                            {c._count.courses}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <CategoryRowActions categoryId={c.id} categoryName={c.name} coursesCount={c._count.courses} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-500 text-sm">
                  No categories found. Create a taxonomy classification on the right panel.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column: Category Creation Card */}
        <div>
          <AddCategoryForm />
        </div>
      </div>
    </div>
  );
}