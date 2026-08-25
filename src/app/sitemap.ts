import type { MetadataRoute } from "next";
import { mainNav, siteConfig } from "@/lib/site";
import { getPublishedCourseSlugs } from "@/lib/courses/queries";
import { getKeywordByIndex } from "@/lib/seo/generator";

const staticPaths = ["/", "/courses", "/store", "/login", "/register", "/student/dashboard", "/teacher/dashboard", "/admin/dashboard"];

export async function generateSitemaps() {
  return [
    { id: "static" },
    { id: "topics-1" },
    { id: "topics-2" },
    { id: "topics-3" }
  ];
}

export default async function sitemap({ id }: { id: string }): Promise<MetadataRoute.Sitemap> {
  const resolvedId = id && typeof (id as any).then === "function" ? await (id as any) : id;
  const now = new Date();
  const baseUrl = siteConfig.url.replace(/\/$/, "");

  if (resolvedId === "topics-1" || resolvedId === "topics-2" || resolvedId === "topics-3") {
    let start = 0;
    let end = 40000;
    if (resolvedId === "topics-2") {
      start = 40000;
      end = 80000;
    } else if (resolvedId === "topics-3") {
      start = 80000;
      end = 120000;
    }

    const sitemapEntries: MetadataRoute.Sitemap = [];
    for (let i = start; i < end; i++) {
      const keywordData = getKeywordByIndex(i);
      sitemapEntries.push({
        url: `${baseUrl}/topic/${keywordData.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.5
      });
    }
    return sitemapEntries;
  }

  // Default fallback: static paths and courses
  let publishedCourses: Awaited<ReturnType<typeof getPublishedCourseSlugs>> = [];

  try {
    publishedCourses = await getPublishedCourseSlugs();
  } catch {
    publishedCourses = [];
  }

  const allPaths = staticPaths
    .concat(mainNav.map((item) => item.href))
    .concat(publishedCourses.map((course) => `/courses/${course.slug}`));

  // Deduplicate paths
  const uniquePaths = Array.from(new Set(allPaths));

  return uniquePaths.map((path) => ({
    url: `${baseUrl}${path === "/" ? "" : path}`,
    lastModified: now,
    changeFrequency: path.startsWith("/courses/") ? "daily" : "weekly",
    priority: path === "/" ? 1 : path.startsWith("/courses/") ? 0.8 : 0.7
  }));
}