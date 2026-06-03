import type { Metadata } from "next";
import { makeMetadata } from "@/lib/site";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { WishlistClient } from "./wishlist-client";

export const metadata: Metadata = makeMetadata({
  title: "My Wishlist",
  description: "View and manage your saved courses.",
  path: "/student/wishlist",
  noIndex: true
});

export const dynamic = "force-dynamic";

export default async function StudentWishlistPage() {
  const user = await requireRole(["STUDENT"]);

  const wishlists = await prisma.wishlist.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      course: {
        include: {
          teachers: {
            include: {
              teacher: { select: { name: true } }
            }
          },
          categories: {
            include: {
              category: true
            }
          }
        }
      }
    }
  });

  // Extract the courses and map them nicely
  const wishlistedCourses = wishlists.map((w) => {
    const price = w.course.priceCents !== null ? Math.round(w.course.priceCents / 100) : 0;
    
    let originalPrice: number | null = null;
    if (w.course.metadata && typeof w.course.metadata === "object") {
      const meta = w.course.metadata as { originalPrice?: unknown };
      if (meta.originalPrice !== undefined && meta.originalPrice !== null) {
        const parsed = Number(meta.originalPrice);
        if (!Number.isNaN(parsed) && parsed > 0) {
          originalPrice = Math.round(parsed);
        }
      }
    }

    return {
      id: w.course.id,
      title: w.course.title,
      slug: w.course.slug,
      coverImageUrl: w.course.coverImageUrl,
      price,
      originalPrice,
      teacherName: w.course.teachers[0]?.teacher.name ?? "TBA",
      categoryName: w.course.categories[0]?.category.name ?? "General"
    };
  });

  return (
    <WishlistClient
      courses={wishlistedCourses}
      userId={user.id}
    />
  );
}
