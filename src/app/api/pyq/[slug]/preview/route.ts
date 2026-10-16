import { NextRequest, NextResponse } from "next/server";
import { getBlogPostBySlug } from "@/lib/blog-data";
import https from "node:https";

async function getPdfBuffer(url: string): Promise<Buffer> {
  // First attempt: native fetch
  try {
    const upstream = await fetch(url);
    if (upstream.ok) {
      const arrayBuffer = await upstream.arrayBuffer();
      return Buffer.from(arrayBuffer);
    }
  } catch (err) {
    console.warn("[PREVIEW_PROXY] Standard fetch failed, attempting https fallback:", err);
  }

  // Fallback attempt: https.get with local certificate support
  return new Promise<Buffer>((resolve, reject) => {
    https
      .get(url, { rejectUnauthorized: false }, (res) => {
        if (res.statusCode && res.statusCode >= 400) {
          return reject(new Error(`Upstream returned ${res.statusCode}`));
        }
        const chunks: Buffer[] = [];
        res.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
        res.on("end", () => resolve(Buffer.concat(chunks)));
        res.on("error", reject);
      })
      .on("error", reject);
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post || !post.pdfUrl) {
    return new NextResponse("File not found", { status: 404 });
  }

  // Anti-theft 1: Prevent direct opening in browser tab to avoid browser download button
  const secFetchDest = request.headers.get("sec-fetch-dest");
  if (secFetchDest === "document") {
    return NextResponse.redirect(new URL(`/blog/${slug}`, request.url), 302);
  }

  // Anti-theft 2: Check referer to block direct hotlinking from outside
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
    const buffer = await getPdfBuffer(post.pdfUrl);

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline",
        "Content-Length": buffer.length.toString(),
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "SAMEORIGIN",
        "Content-Security-Policy": "frame-ancestors 'self'",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("[PREVIEW_PROXY_ERROR]", error);
    // Ultimate fallback: redirect directly to the public PDF URL
    return NextResponse.redirect(post.pdfUrl, 302);
  }
}

