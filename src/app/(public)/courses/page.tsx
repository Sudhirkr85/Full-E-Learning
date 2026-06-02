import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { makeMetadata } from "@/lib/site";
import { getCourseCategories, getPublishedCourses } from "@/lib/courses/queries";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { EnrollButton } from "./[slug]/enroll-button";

export const metadata: Metadata = makeMetadata({
  title: "Courses - Learning Paths",
  description: "Browse the published course catalog and discover learning paths for every role.",
  path: "/courses"
});

export const dynamic = "force-dynamic";

type CoursesPageProps = {
  searchParams?: Promise<{
    category?: string;
  }>;
};

function categoryGradient(categoryName?: string) {
  switch (categoryName) {
    case "Web Development":
      return "from-blue-600 to-purple-700";
    case "Mobile Development":
      return "from-emerald-600 to-teal-700";
    case "Backend":
      return "from-orange-600 to-red-700";
    default:
      return "from-slate-700 to-slate-900";
  }
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const session = await auth();
  const [courses, categories, enrolledCourseIds] = await Promise.all([
    getPublishedCourses(params?.category),
    getCourseCategories(),
    session?.user
      ? prisma.enrollment
          .findMany({
            where: { 
              userId: session.user.id, 
              status: { in: ["ACTIVE", "COMPLETED"] } 
            },
            select: { courseId: true }
          })
          .then((e) => e.map((x) => x.courseId))
      : Promise.resolve([] as string[])
  ]);

  const dbUser = session?.user?.id
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { phone: true, email: true, name: true }
      })
    : null;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden bg-grid-cyber">
      {/* Radial Glow Overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent rounded-full filter blur-[100px] pointer-events-none" />

      <section className="px-4 md:px-8 py-12 max-w-7xl mx-auto relative z-10 space-y-10">
        {/* Header Section */}
        <div className="max-w-2xl space-y-4">
          <h1 className="font-display text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            Explore Courses
          </h1>
          <p className="text-sm sm:text-base text-slate-400">
            Browse live published courses, organized by professional category and ready to accelerate your tech career.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2.5">
          <Link href="/courses">
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border cursor-pointer transition-all duration-200 ${
              !params?.category
                ? "bg-indigo-600 text-white border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
            }`}>
              All
            </span>
          </Link>
          {categories.map((category) => (
            <Link key={category.id} href={`/courses?category=${category.slug}`}>
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border cursor-pointer transition-all duration-200 ${
                params?.category === category.slug
                  ? "bg-indigo-600 text-white border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                  : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
              }`}>
                {category.name}
              </span>
            </Link>
          ))}
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.length ? (
            courses.map((course) => {
              const categoryName = course.categories[0]?.category.name;
              const teacherName = course.teachers[0]?.teacher.name ?? "Unknown Teacher";
              const isEnrolled = enrolledCourseIds.includes(course.id);
              const sectionsCount = (course as { sections?: Array<{ id: string }>; _count: { sections: number } }).sections?.length ?? course._count.sections;
              const shortDescription = course.subtitle ?? course.excerpt ?? course.description;
              const price = course.priceCents !== null ? Math.round(course.priceCents / 100) : 0;

              let originalPrice: number | null = null;
              if (course.metadata && typeof course.metadata === "object") {
                const meta = course.metadata as { originalPrice?: unknown };
                if (meta.originalPrice !== undefined && meta.originalPrice !== null) {
                  const parsed = Number(meta.originalPrice);
                  if (!Number.isNaN(parsed) && parsed > 0) {
                    originalPrice = Math.round(parsed);
                  }
                }
              }

              const hasDiscount = originalPrice !== null && originalPrice > price && price > 0;
              const safeOriginalPrice = Number(originalPrice ?? 0);
              const discountPercent = hasDiscount ? Math.round(((safeOriginalPrice - price) / safeOriginalPrice) * 100) : 0;

              return (
                <div
                  key={course.id}
                  className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 shadow-[0_15px_30px_rgba(0,0,0,0.3)] hover:-translate-y-1.5 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Thumbnail Hero Section */}
                  <div className="relative h-48 w-full overflow-hidden shrink-0">
                    {course.coverImageUrl ? (
                      <img 
                        src={course.coverImageUrl} 
                        alt={course.title} 
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" 
                      />
                    ) : (
                      <div className={`h-full w-full bg-gradient-to-br ${categoryGradient(categoryName)} transition-transform duration-300 group-hover:scale-105`} />
                    )}

                    {/* Dark gradient overlay on top */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent pointer-events-none" />

                    {/* Translucent category badge top-left */}
                    <span className="absolute top-3.5 left-3.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                      {categoryName ?? "General"}
                    </span>

                    {/* Course title in white overlaid on the banner */}
                    <div className="absolute bottom-3 left-3 right-3 z-10">
                      <h3 className="line-clamp-2 text-sm sm:text-base font-bold text-white tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        {course.title}
                      </h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="flex flex-col flex-1 justify-between p-4.5 gap-4">
                    <div className="space-y-2">
                      <p className="line-clamp-2 text-xs text-slate-400 font-medium">
                        {shortDescription ?? "Immersive published EdTech course pathway ready for immediate enrollment."}
                      </p>
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        {sectionsCount} sections <span className="text-slate-700">•</span> by {teacherName}
                      </div>
                    </div>

                    <div className="space-y-3.5">
                      {/* Price Row */}
                      <div>
                        {price === 0 ? (
                          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1">
                            Free
                          </Badge>
                        ) : hasDiscount ? (
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-base font-extrabold text-white">₹{price.toLocaleString("en-IN")}</span>
                            <span className="line-through text-slate-500 text-xs font-semibold">₹{safeOriginalPrice.toLocaleString("en-IN")}</span>
                            <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-bold text-emerald-300 uppercase tracking-wide">
                              {discountPercent}% OFF
                            </span>
                          </div>
                        ) : (
                          <span className="text-base font-extrabold text-white">₹{price.toLocaleString("en-IN")}</span>
                        )}
                      </div>

                      {/* CTA Action Buttons side-by-side */}
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <Link href={`/courses/${course.slug}`} className="w-full">
                          <button className="w-full h-11 rounded-xl font-extrabold border border-white/10 hover:border-white/20 text-slate-200 hover:text-white bg-white/5 hover:bg-white/10 transition text-xs uppercase tracking-normal flex items-center justify-center">
                            View Details
                          </button>
                        </Link>
                        <EnrollButton
                          variant="card"
                          courseId={course.id}
                          coursePrice={price}
                          courseName={course.title}
                          courseSlug={course.slug}
                          isEnrolled={isEnrolled}
                          isFree={price === 0}
                          userPhone={dbUser?.phone || ""}
                          userEmail={dbUser?.email || session?.user?.email || ""}
                          userName={dbUser?.name || session?.user?.name || ""}
                          isLoggedIn={Boolean(session?.user)}
                          originalPrice={originalPrice}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <Card className="sm:col-span-2 lg:col-span-3 xl:col-span-4 bg-white/5 border-white/5 backdrop-blur-md p-6">
              <CardHeader className="text-center">
                <CardTitle className="text-white font-bold">No published courses yet</CardTitle>
                <CardDescription className="text-slate-400">
                  Our instructors are working on exciting curriculum tracks. Please check back shortly!
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
