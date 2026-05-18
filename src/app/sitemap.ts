import type { MetadataRoute } from "next";
import { mainNav, siteConfig } from "@/lib/site";

const staticPaths = ["/", "/courses", "/store", "/login", "/register", "/student/dashboard", "/teacher/dashboard", "/admin/dashboard"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return staticPaths.concat(mainNav.map((item) => item.href)).map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7
  }));
}