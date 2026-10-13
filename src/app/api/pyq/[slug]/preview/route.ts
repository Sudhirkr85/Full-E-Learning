import { NextRequest, NextResponse } from "next/server";
import { getBlogPostBySlug } from "@/lib/blog-data";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post || !post.pdfUrl) {
    return new NextResponse("File not found", { status: 404 });
  }

  // Security: Check referer to block direct hotlinking from outside
  const referer = request.headers.get("referer") || "";
  const host = request.headers.get("host") || "";
  const isAllowedOrigin =
    referer.includes(host) ||
    referer.includes("localhost") ||
    referer.includes("127.0.0.1") ||
    referer.includes("sagarcoaching.tech");

  if (!isAllowedOrigin && referer !== "") {
    return new NextResponse("Forbidden: Hotlinking blocked.", { status: 403 });
  }

  try {
    const upstream = await fetch(post.pdfUrl);
    if (!upstream.ok) {
      return new NextResponse("Error fetching preview", { status: upstream.status });
    }

    const arrayBuffer = await upstream.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "SAMEORIGIN",
        "Content-Security-Policy": "frame-ancestors 'self'",
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (error) {
    console.error("[PREVIEW_PROXY_ERROR]", error);
    return new NextResponse("Server Error", { status: 500 });
  }
}
