import type { MetadataRoute } from "next";
import { mainNav, siteConfig } from "@/lib/site";
import { getPublishedCourseSlugs } from "@/lib/courses/queries";

const staticPaths = ["/", "/courses", "/store", "/login", "/register", "/student/dashboard", "/teacher/dashboard", "/admin/dashboard"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  let publishedCourses: Awaited<ReturnType<typeof getPublishedCourseSlugs>> = [];

  try {
    publishedCourses = await getPublishedCourseSlugs();
  } catch {
    publishedCourses = [];
  }

  return staticPaths
    .concat(mainNav.map((item) => item.href))
    .concat(publishedCourses.map((course) => `/courses/${course.slug}`))
    .map((path) => ({
      url: `${siteConfig.url}${path}`,
      lastModified: now,
      changeFrequency: path.startsWith("/courses/") ? "daily" : "weekly",
      priority: path === "/" ? 1 : path.startsWith("/courses/") ? 0.8 : 0.7
    }));
}