import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { getPublishedCourseSlugs } from "@/lib/courses/queries";
import { prisma } from "@/lib/prisma";
import { CURATED_TOPIC_LIST } from "@/lib/seo/generator";

// Caching configurations for Vercel static generation
export const revalidate = 86400; // Cache sitemap for 24 hours
export const dynamic = "force-static";

const publicStaticPaths = ["/", "/courses", "/store", "/privacy-policy", "/terms", "/refund-policy"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const baseUrl = siteConfig.url.replace(/\/$/, "");

  // 1. Clean public static routes
  const sitemapEntries: MetadataRoute.Sitemap = publicStaticPaths.map((path) => ({
    url: `${baseUrl}${path === "/" ? "" : path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "daily" : "weekly",
    priority: path === "/" ? 1.0 : 0.8
  }));

  // 2. Published database courses
  let publishedCourses: Awaited<ReturnType<typeof getPublishedCourseSlugs>> = [];
  try {
    publishedCourses = await getPublishedCourseSlugs();
  } catch {
    publishedCourses = [];
  }

  publishedCourses.forEach((course) => {
    sitemapEntries.push({
      url: `${baseUrl}/courses/${course.slug}`,
      lastModified: course.updatedAt || now,
      changeFrequency: "weekly",
      priority: 0.8
    });
  });

  // 3. Published store products
  let publishedProducts: Array<{ slug: string; updatedAt: Date }> = [];
  try {
    publishedProducts = await prisma.product.findMany({
      where: { status: { in: ["PUBLISHED", "ACTIVE"] } },
      select: { slug: true, updatedAt: true }
    });
  } catch {
    publishedProducts = [];
  }

  publishedProducts.forEach((product) => {
    sitemapEntries.push({
      url: `${baseUrl}/store/${product.slug}`,
      lastModified: product.updatedAt || now,
      changeFrequency: "weekly",
      priority: 0.8
    });
  });

  // 4. Curated distinct educational topic study guides
  CURATED_TOPIC_LIST.forEach((topicItem) => {
    sitemapEntries.push({
      url: `${baseUrl}/topic/${topicItem.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6
    });
  });

  // Deduplicate entries by URL to be fully compliant
  const seenUrls = new Set<string>();
  const finalEntries = sitemapEntries.filter((entry) => {
    if (seenUrls.has(entry.url)) {
      return false;
    }
    seenUrls.add(entry.url);
    return true;
  });

  return finalEntries;
}