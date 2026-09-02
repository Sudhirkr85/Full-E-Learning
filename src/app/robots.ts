import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/dashboard/",
        "/student/",
        "/teacher/",
        "/profile/",
        "/cart",
        "/cart/",
        "/checkout/",
        "/order/",
        "/order-confirmation/",
        "/verify/",
        "/certificates/verify/",
        "/api/",
        "/_next/"
      ]
    },
    sitemap: `${baseUrl}/sitemap.xml`
  };
}