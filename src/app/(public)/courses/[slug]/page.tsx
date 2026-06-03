import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { EnrollButton } from "./enroll-button";
import { WishlistButton } from "@/components/wishlist-button";
import { makeMetadata } from "@/lib/site";
import { prisma } from "@/lib/prisma";
import { BookOpen, Clapperboard, Clock3, Globe, Award, Smartphone, Infinity, UserCircle2 } from "lucide-react";
import { CourseDetailClient } from "./course-detail-client";
import { CourseReviewsClient } from "./course-reviews-client";

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

  const dbUser = session?.user?.id
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { phone: true, email: true, name: true }
      })
    : null;

  const isEnrolled = Boolean(enrollment && (enrollment.status === "ACTIVE" || enrollment.status === "COMPLETED"));

  const userWishlisted = session?.user?.id && session.user.role === "STUDENT"
    ? await prisma.wishlist.findUnique({
        where: {
          userId_courseId: {
            userId: session.user.id,
            courseId: course.id
          }
        }
      }).then(w => !!w)
    : false;

  let hasReviewed = false;
  let userReviewData = null;
  if (enrollment) {
    const existingReview = await prisma.courseReview.findFirst({
      where: { enrollmentId: enrollment.id }
    });
    hasReviewed = !!existingReview;
    if (existingReview) {
      userReviewData = {
        rating: existingReview.rating,
        comment: existingReview.body
      };
    }
  }

  // --- SECTION 3: COURSE REVIEWS DATA ---
  const reviewsCount = await prisma.courseReview.count({
    where: { enrollment: { courseId: course.id }, status: "PUBLISHED" }
  });

  const courseReviews = await prisma.courseReview.findMany({
    where: { enrollment: { courseId: course.id }, status: "PUBLISHED" },
    include: {
      enrollment: {
        include: {
          user: { select: { name: true } }
        }
      }
    },
    orderBy: { createdAt: "desc" },
    take: 4
  });

  const ratingSummary = await prisma.courseReview.aggregate({
    where: { enrollment: { courseId: course.id }, status: "PUBLISHED" },
    _avg: {
      rating: true
    }
  });

  const avgRating = ratingSummary._avg.rating || null;

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
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden bg-grid-cyber">
      {/* Cinematic glows */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-indigo-500/5 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="flex flex-col gap-5 text-left">
              {/* Premium Media Card Thumbnail */}
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl group shrink-0">
                {course.coverImageUrl ? (
                  <img 
                    src={course.coverImageUrl} 
                    alt={course.title} 
                    className="w-full max-h-80 object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                ) : (
                  <div className={`w-full max-h-80 h-72 bg-gradient-to-br ${categoryGradient(categoryName)} transition-transform duration-500 group-hover:scale-105`} />
                )}
                {/* Cinematic dark bottom gradient cover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
              </div>

              <div className="flex flex-wrap gap-2.5">
                <Badge className="rounded-full px-3 py-1 text-xs bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-bold uppercase tracking-wide">
                  {categoryName}
                </Badge>
                <Badge variant="outline" className="rounded-full px-3 py-1 text-xs border-white/15 text-slate-300 font-medium capitalize">
                  {course.level.toLowerCase().replace("_", " ")}
                </Badge>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl font-black tracking-tight text-white drop-shadow-[0_2px_10px_rgba(99,102,241,0.15)] leading-tight">
                {course.title}
              </h1>

              <p className="text-base text-slate-300 leading-relaxed font-medium">
                {course.subtitle ?? course.excerpt ?? "Published course ready for learning."}
              </p>

              <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-slate-400 font-medium border-y border-white/5 py-3.5">
                <span className="inline-flex items-center gap-1.5"><BookOpen className="h-4.5 w-4.5 text-indigo-400" /> {sectionsCount} Sections</span>
                <span className="inline-flex items-center gap-1.5"><Clapperboard className="h-4.5 w-4.5 text-indigo-400" /> {lessonsCount} Lessons</span>
                <span className="inline-flex items-center gap-1.5"><Clock3 className="h-4.5 w-4.5 text-indigo-400" /> {course.level.toLowerCase().replace("_", " ")}</span>
                <span className="inline-flex items-center gap-1.5"><Globe className="h-4.5 w-4.5 text-indigo-400" /> {course.language}</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-300 font-semibold mt-1">
                {teacher?.image ? (
                  <img src={teacher.image} alt={teacher.name ?? "Instructor"} className="h-9 w-9 rounded-full object-cover border border-white/10" />
                ) : (
                  <div className="h-9 w-9 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-xs font-bold text-indigo-400">{teacher?.name ? initials(teacher.name) : <UserCircle2 className="h-4.5 w-4.5" />}</div>
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

            <CourseReviewsClient
              courseId={course.id}
              initialReviews={courseReviews.map(r => ({
                id: r.id,
                rating: r.rating,
                comment: r.body,
                createdAt: r.createdAt,
                user: { name: r.enrollment.user?.name || "Verified Student" }
              }))}
              avgRating={avgRating}
              isLoggedIn={Boolean(session?.user)}
              isEnrolled={isEnrolled}
              hasReviewed={hasReviewed}
              totalReviewsCount={reviewsCount}
              initialUserReview={userReviewData}
            />
          </div>

          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-6 border border-white/10 rounded-xl p-6 flex flex-col gap-4 bg-[#090d20]/50 backdrop-blur-md shadow-2xl text-slate-100">
              <EnrollButton
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

              <WishlistButton
                courseId={course.id}
                initialWishlisted={userWishlisted}
                isLoggedIn={Boolean(session?.user)}
                size="lg"
                showLabel={true}
              />

              <div className="flex flex-col gap-2 text-sm text-slate-300 border-t border-white/10 pt-4 mt-2">
                <div className="flex items-center gap-2 text-slate-300">
                  <BookOpen className="h-4 w-4 text-indigo-400" />
                  <span>{sectionsCount} sections · {lessonsCount} lessons</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Award className="h-4 w-4 text-indigo-400" />
                  <span>Certificate on completion</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Smartphone className="h-4 w-4 text-indigo-400" />
                  <span>Access on mobile & desktop</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Infinity className="h-4 w-4 text-indigo-400" />
                  <span>Lifetime access</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
