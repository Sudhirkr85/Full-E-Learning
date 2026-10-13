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

  // Prevent external hotlinking / direct browser access without referer
  const referer = request.headers.get("referer") || "";
  const host = request.headers.get("host") || "";

  // Allow if localhost or sagarcoaching.tech
  const isAllowedHost =
    referer.includes(host) ||
    referer.includes("localhost") ||
    referer.includes("127.0.0.1") ||
    referer.includes("sagarcoaching.tech");

  if (!isAllowedHost && process.env.NODE_ENV === "production") {
    return new NextResponse("Direct access forbidden. Please view on website.", { status: 403 });
  }

  try {
    const upstream = await fetch(post.pdfUrl);
    if (!upstream.ok) {
      return new NextResponse("Error fetching PDF stream", { status: upstream.status });
    }

    const arrayBuffer = await upstream.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline",
        "Content-Length": arrayBuffer.byteLength.toString(),
        "Cache-Control": "private, max-age=3600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("PDF preview stream error:", error);
    return new NextResponse("Server Error", { status: 500 });
  }
}
