import { prisma } from "@/lib/prisma";
import { UpdatePostData, UpdateLink, ImportantDate, FAQItem, SourceItem } from "./types";
import { UpdateType, UpdateStatus } from "@prisma/client";

function transformDbPost(raw: any): UpdatePostData {
  return {
    ...raw,
    links: (raw.links as unknown as UpdateLink[]) || [],
    importantDates: (raw.importantDates as unknown as ImportantDate[]) || [],
    faqs: (raw.faqs as unknown as FAQItem[]) || [],
    sources: (raw.sources as unknown as SourceItem[]) || [],
  };
}

/**
 * Get published updates for public display.
 * Safe fallback returning [] if the table does not exist yet in DB.
 */
export async function getPublishedUpdates(limit = 20): Promise<UpdatePostData[]> {
  try {
    const posts = await (prisma as any).updatePost.findMany({
      where: {
        status: "PUBLISHED",
      },
      orderBy: [
        { publishedAt: "desc" },
        { createdAt: "desc" },
      ],
      take: limit,
    });

    return posts.map(transformDbPost);
  } catch (error) {
    console.warn("[UPDATES_QUERY_FALLBACK] getPublishedUpdates failed (table may not exist yet):", error);
    return [];
  }
}

/**
 * Get list of updates for /updates page (both PUBLISHED and EXPIRED).
 */
export async function getPublicUpdatesList(filters?: {
  type?: string;
  exam?: string;
}): Promise<UpdatePostData[]> {
  try {
    const whereClause: any = {
      status: {
        in: ["PUBLISHED", "EXPIRED"],
      },
    };

    if (filters?.type && filters.type !== "ALL") {
      whereClause.type = filters.type as UpdateType;
    }

    if (filters?.exam && filters.exam !== "ALL") {
      whereClause.exam = filters.exam;
    }

    const posts = await (prisma as any).updatePost.findMany({
      where: whereClause,
      orderBy: [
        { publishedAt: "desc" },
        { createdAt: "desc" },
      ],
    });

    return posts.map(transformDbPost);
  } catch (error) {
    console.warn("[UPDATES_QUERY_FALLBACK] getPublicUpdatesList failed (table may not exist yet):", error);
    return [];
  }
}

/**
 * Get an update by its slug.
 * Safe fallback returning null if the table does not exist yet or not found.
 */
export async function getUpdateBySlug(slug: string): Promise<UpdatePostData | null> {
  try {
    const post = await (prisma as any).updatePost.findUnique({
      where: { slug },
    });

    if (!post) return null;
    return transformDbPost(post);
  } catch (error) {
    console.warn(`[UPDATES_QUERY_FALLBACK] getUpdateBySlug(${slug}) failed:`, error);
    return null;
  }
}

/**
 * Get all public slugs (PUBLISHED or EXPIRED) for sitemap generation.
 * Safe fallback returning [] if table does not exist.
 */
export async function getPublicSlugs(): Promise<{ slug: string; updatedAt: Date }[]> {
  try {
    const posts = await (prisma as any).updatePost.findMany({
      where: {
        status: {
          in: ["PUBLISHED", "EXPIRED"],
        },
      },
      select: {
        slug: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return posts;
  } catch (error) {
    console.warn("[UPDATES_QUERY_FALLBACK] getPublicSlugs failed:", error);
    return [];
  }
}

/**
 * Get all updates for admin panel.
 */
export async function getAllUpdatesAdmin(): Promise<UpdatePostData[]> {
  try {
    const posts = await (prisma as any).updatePost.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    });

    return posts.map(transformDbPost);
  } catch (error) {
    console.warn("[UPDATES_QUERY_FALLBACK] getAllUpdatesAdmin failed:", error);
    return [];
  }
}

/**
 * Get a single update by ID for admin editing.
 */
export async function getUpdateByIdAdmin(id: string): Promise<UpdatePostData | null> {
  try {
    const post = await (prisma as any).updatePost.findUnique({
      where: { id },
    });

    if (!post) return null;
    return transformDbPost(post);
  } catch (error) {
    console.warn(`[UPDATES_QUERY_FALLBACK] getUpdateByIdAdmin(${id}) failed:`, error);
    return null;
  }
}
