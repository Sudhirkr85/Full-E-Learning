import { NextRequest, NextResponse } from "next/server";
import { getBlogPostBySlug } from "@/lib/blog-data";
import { getR2ObjectBuffer } from "@/lib/r2";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post || !post.pdfUrl) {
    return new NextResponse("File not found", { status: 404 });
  }

  // Refuse direct opening in browser tab or embedding in document/iframe/embed/object
  // Only allow same-origin fetch from our own reader
  const secFetchSite = request.headers.get("sec-fetch-site");
  const secFetchDest = request.headers.get("sec-fetch-dest");
  const blockedDestinations = ["document", "iframe", "embed", "object"];

  if (
    secFetchSite !== "same-origin" ||
    (secFetchDest && blockedDestinations.includes(secFetchDest))
  ) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const buffer = await getR2ObjectBuffer(post.pdfUrl);

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline",
        "Content-Length": buffer.length.toString(),
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "SAMEORIGIN",
        "Content-Security-Policy": "frame-ancestors 'self'",
        "X-Robots-Tag": "noindex, nofollow",
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("[PREVIEW_R2_ERROR]", error);
    return new NextResponse("Failed to load document", { status: 500 });
  }
}
