import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";
export const revalidate = 86400; // Cache for 24 hours

export async function GET() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap/static.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap/topics-1.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap/topics-2.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap/topics-3.xml</loc>
  </sitemap>
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200",
    },
  });
}
