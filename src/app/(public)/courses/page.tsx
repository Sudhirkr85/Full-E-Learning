import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { makeMetadata } from "@/lib/site";
import { getCourseCategories, getPublishedCourses } from "@/lib/courses/queries";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = makeMetadata({
  title: "Courses",
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
      return "from-blue-500 to-purple-600";
    case "Mobile Development":
      return "from-green-500 to-teal-600";
    case "Backend":
      return "from-orange-500 to-red-600";
    default:
      return "from-gray-600 to-gray-800";
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
            where: { userId: session.user.id, status: "ACTIVE" },
            select: { courseId: true }
          })
          .then((e) => e.map((x) => x.courseId))
      : Promise.resolve([] as string[])
  ]);

  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="max-w-2xl">
          <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">Courses</h1>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">Browse live published courses, organized by category and ready for SEO discovery.</p>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          <Button asChild variant={!params?.category ? "default" : "outline"} size="sm">
            <Link href="/courses">All</Link>
          </Button>
          {categories.map((category) => (
            <Button key={category.id} asChild variant={params?.category === category.slug ? "default" : "outline"} size="sm">
              <Link href={`/courses?category=${category.slug}`}>{category.name}</Link>
            </Button>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                  className="group cursor-pointer overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl"
                >
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    {course.coverImageUrl ? (
                      <img src={course.coverImageUrl} alt={course.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    ) : (
                      <div className={`h-full w-full bg-gradient-to-br ${categoryGradient(categoryName)} transition-transform duration-300 group-hover:scale-105`} />
                    )}
                    <span className="absolute bottom-3 left-3 rounded-full bg-white/85 px-2 py-1 text-xs font-medium text-slate-900">
                      {categoryName ?? "General"}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3 p-4">
                    <h3 className="line-clamp-2 text-base font-semibold">{course.title}</h3>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{shortDescription ?? "Published course ready for enrollment and lesson browsing."}</p>

                    <div className="text-sm text-muted-foreground">{sectionsCount} sections · by {teacherName}</div>

                    <div>
                      {price === 0 ? (
                        <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">Free</span>
                      ) : hasDiscount ? (
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-lg font-bold">₹{price.toLocaleString("en-IN")}</span>
                          <span className="line-through text-muted-foreground text-sm">₹{safeOriginalPrice.toLocaleString("en-IN")}</span>
                          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">{discountPercent}% OFF</span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold">₹{price.toLocaleString("en-IN")}</span>
                      )}
                    </div>

                    {isEnrolled ? (
                      <Button asChild className="w-full">
                        <Link href={`/courses/${course.slug}`}>Continue Learning</Link>
                      </Button>
                    ) : (
                      <Button asChild variant="outline" className="w-full">
                        <Link href={`/courses/${course.slug}`}>View Details</Link>
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <Card className="sm:col-span-2 lg:col-span-3 xl:col-span-4">
              <CardHeader>
                <CardTitle>No published courses yet</CardTitle>
                <CardDescription>Teachers can publish courses from the management dashboard once content is ready.</CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </Container>
    </section>
  );
}
