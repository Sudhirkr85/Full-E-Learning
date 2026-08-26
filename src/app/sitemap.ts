import type { MetadataRoute } from "next";
import { mainNav, siteConfig } from "@/lib/site";
import { getPublishedCourseSlugs } from "@/lib/courses/queries";
import { SEO_LOCATIONS } from "@/data/seo-locations";
import { SEO_TOPICS } from "@/data/seo-topics";
import { SEO_MODIFIERS } from "@/data/seo-modifiers";

// Caching configurations for Vercel Free Tier static generation
export const revalidate = 604800; // Cache sitemap for 7 days
export const dynamic = "force-static";

const staticPaths = ["/", "/courses", "/store", "/login", "/register", "/student/dashboard", "/teacher/dashboard", "/admin/dashboard"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const baseUrl = siteConfig.url.replace(/\/$/, "");

  // 1. Compile static routes
  const sitemapEntries: MetadataRoute.Sitemap = staticPaths
    .concat(mainNav.map((item) => item.href))
    .map((path) => ({
      url: `${baseUrl}${path === "/" ? "" : path}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: path === "/" ? 1.0 : 0.7
    }));

  // 2. Fetch database courses
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
      changeFrequency: "daily",
      priority: 0.8
    });
  });

  // 3. Programmatic SEO: City x Topic (e.g. /courses/delhi/sainik-school)
  for (const location of SEO_LOCATIONS) {
    for (const topic of SEO_TOPICS) {
      sitemapEntries.push({
        url: `${baseUrl}/courses/${location.city}/${topic.topic}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.6
      });

      // 4. Programmatic SEO: City x Modifier x Topic (e.g. /courses/delhi/best/sainik-school)
      for (const modifier of SEO_MODIFIERS) {
        sitemapEntries.push({
          url: `${baseUrl}/courses/${location.city}/${modifier.modifier}/${topic.topic}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.5
        });
      }
    }
  }

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