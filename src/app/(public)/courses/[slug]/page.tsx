import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { makeMetadata } from "@/lib/site";
import { enrollInCourseAction } from "@/lib/courses/actions";
import { prisma } from "@/lib/prisma";
import { BookOpen, Clapperboard, Clock3, Globe, Award, Smartphone, Infinity, UserCircle2 } from "lucide-react";
import { CourseDetailClient } from "./course-detail-client";

export const dynamic = "force-dynamic";

type CourseDetailsPageProps = {
  params: Promise<{
    slug: string;
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

function initials(name?: string | null) {
  if (!name) return "IN";
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
}

export async function generateMetadata({ params }: CourseDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await prisma.course.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: {
      title: true,
      excerpt: true,
      description: true
    }
  });

  return makeMetadata({
    title: course?.title ?? slug.replaceAll("-", " "),
    description: course?.excerpt ?? course?.description ?? "Published course detail page with enrollment, lesson access, and progress tracking.",
    path: `/courses/${slug}`
  });
}

export default async function CourseDetailsPage({ params }: CourseDetailsPageProps) {
  const { slug } = await params;
  const session = await auth();

  const course = await prisma.course.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: {
      categories: {
        include: { category: true }
      },
      teachers: {
        include: {
          teacher: {
            select: { id: true, name: true, image: true }
          }
        },
        take: 1,
        orderBy: { sortOrder: "asc" }
      },
      sections: {
        where: { isPublished: true },
        orderBy: { orderIndex: "asc" },
        include: {
          lessons: {
            where: { isPublished: true },
            orderBy: { orderIndex: "asc" },
            select: {
              id: true,
              title: true,
              slug: true,
              contentType: true,
              isPreview: true,
              orderIndex: true
            }
          }
        }
      }
    }
  });

  if (!course) {
    return (
      <section className="py-16 md:py-24">
        <Container>
          <Badge variant="secondary">Course not found</Badge>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-5xl">Course unavailable</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">This course is not published yet or no longer exists.</p>
          <Button className="mt-6" asChild>
            <Link href="/courses">Back to courses</Link>
          </Button>
        </Container>
      </section>
    );
  }

  const enrollment = session?.user?.id
    ? await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: session.user.id,
            courseId: course.id
          }
        }
      })
    : null;

  const isEnrolled = Boolean(enrollment);
  const price = course.priceCents ? Math.round(course.priceCents / 100) : 0;

  let originalPrice: number | null = null;
  if (course.metadata && typeof course.metadata === "object") {
    const meta = course.metadata as { originalPrice?: unknown; learningOutcomes?: unknown; highlights?: unknown };
    const parsedOriginal = Number(meta.originalPrice);
    if (!Number.isNaN(parsedOriginal) && parsedOriginal > 0) {
      originalPrice = Math.round(parsedOriginal);
    }
  }

  const hasDiscount = originalPrice !== null && originalPrice > price && price > 0;
  const safeOriginalPrice = Number(originalPrice ?? 0);
  const discountPercent = hasDiscount ? Math.round(((safeOriginalPrice - price) / safeOriginalPrice) * 100) : 0;

  const categoryName = course.categories[0]?.category.name ?? "General";
  const teacher = course.teachers[0]?.teacher;
  const sectionsCount = course.sections.length;
  const lessonsCount = course.sections.reduce((count, section) => count + section.lessons.length, 0);

  const metadataObj = course.metadata && typeof course.metadata === "object" ? (course.metadata as { learningOutcomes?: unknown; highlights?: unknown }) : null;
  const learningOutcomes = Array.isArray(metadataObj?.learningOutcomes)
    ? metadataObj.learningOutcomes.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : Array.isArray(metadataObj?.highlights)
      ? metadataObj.highlights.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
      : [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            {course.coverImageUrl ? (
              <img src={course.coverImageUrl} alt={course.title} className="w-full rounded-xl max-h-72 object-cover" />
            ) : (
              <div className={`w-full rounded-xl max-h-72 h-72 bg-gradient-to-br ${categoryGradient(categoryName)}`} />
            )}

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="rounded-full px-2 py-1 text-xs">{categoryName}</Badge>
              <Badge variant="outline" className="rounded-full px-2 py-1 text-xs">{course.level.toLowerCase()}</Badge>
            </div>

            <h1 className="text-3xl font-bold">{course.title}</h1>
            <p className="text-muted-foreground text-base">{course.subtitle ?? course.excerpt ?? "Published course ready for learning."}</p>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1"><BookOpen className="h-4 w-4" /> {sectionsCount} sections</span>
              <span className="inline-flex items-center gap-1"><Clapperboard className="h-4 w-4" /> {lessonsCount} lessons</span>
              <span className="inline-flex items-center gap-1"><Clock3 className="h-4 w-4" /> {course.level.toLowerCase()}</span>
              <span className="inline-flex items-center gap-1"><Globe className="h-4 w-4" /> {course.language}</span>
            </div>

            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              {teacher?.image ? (
                <img src={teacher.image} alt={teacher.name ?? "Instructor"} className="h-9 w-9 rounded-full object-cover" />
              ) : (
                <div className="h-9 w-9 rounded-full border flex items-center justify-center text-xs font-semibold">{teacher?.name ? initials(teacher.name) : <UserCircle2 className="h-4 w-4" />}</div>
              )}
              <span>Instructor: {teacher?.name ?? "TBA"}</span>
            </div>
          </div>

          <CourseDetailClient
            slug={course.slug}
            description={course.description ?? course.excerpt ?? "Course details will be updated soon."}
            sections={course.sections}
            isEnrolled={isEnrolled}
            outcomes={learningOutcomes}
          />
        </div>

        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-6 border rounded-xl p-6 flex flex-col gap-4 bg-card">
            <div>
              {price === 0 ? (
                <span className="text-3xl font-bold text-green-600">Free</span>
              ) : hasDiscount ? (
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-3xl font-bold">₹{price.toLocaleString("en-IN")}</span>
                  <span className="text-lg line-through text-muted-foreground">₹{safeOriginalPrice.toLocaleString("en-IN")}</span>
                  <span className="bg-green-100 text-green-700 text-sm font-bold px-2 py-1 rounded-full">{discountPercent}% OFF</span>
                </div>
              ) : (
                <span className="text-3xl font-bold">₹{price.toLocaleString("en-IN")}</span>
              )}
            </div>

            {!session?.user ? (
              <Button size="lg" className="w-full" asChild>
                <Link href="/login">Login to Enroll</Link>
              </Button>
            ) : isEnrolled ? (
              <Button size="lg" className="w-full" asChild>
                <Link href={`/student/courses/${course.slug}`}>Continue Learning</Link>
              </Button>
            ) : (
              <form action={enrollInCourseAction} className="w-full">
                <input type="hidden" name="courseId" value={course.id} />
                <Button size="lg" className="w-full" type="submit">
                  {price === 0 ? "Start Learning for Free" : `Enroll Now — ₹${price.toLocaleString("en-IN")}`}
                </Button>
              </form>
            )}

            <div className="flex flex-col gap-2 text-sm text-muted-foreground border-t pt-4 mt-2">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>{sectionsCount} sections · {lessonsCount} lessons</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                <span>Certificate on completion</span>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                <span>Access on mobile & desktop</span>
              </div>
              <div className="flex items-center gap-2">
                <Infinity className="h-4 w-4" />
                <span>Lifetime access</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
