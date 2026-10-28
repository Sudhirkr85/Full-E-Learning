import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { getPublishedCourseSlugs } from "@/lib/courses/queries";
import { prisma } from "@/lib/prisma";
import { BLOG_POSTS } from "@/lib/blog-data";
import { getPublicSlugs } from "@/lib/updates/queries";

// Caching configurations for Vercel static generation
export const revalidate = 86400; // Cache sitemap for 24 hours
export const dynamic = "force-static";

const publicStaticPaths = [
  "/", 
  "/about", 
  "/contact", 
  "/disclaimer", 
  "/blog", 
  "/updates",
  "/courses", 
  "/store", 
  "/vip-telegram", 
  "/privacy-policy", 
  "/terms", 
  "/refund-policy"
];

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

  // 4. Educational PYQ & Blog Posts
  BLOG_POSTS.filter((post) => !post.canonicalSlug).forEach((post) => {
    sitemapEntries.push({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: "weekly",
      priority: 0.9
    });
  });

  // 5. Published & Expired Updates Posts
  let updateSlugs: Array<{ slug: string; updatedAt: Date }> = [];
  try {
    updateSlugs = await getPublicSlugs();
  } catch {
    updateSlugs = [];
  }

  updateSlugs.forEach((post) => {
    sitemapEntries.push({
      url: `${baseUrl}/updates/${post.slug}`,
      lastModified: post.updatedAt || now,
      changeFrequency: "daily",
      priority: 0.9,
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
