import { NextRequest, NextResponse } from "next/server";
import { getBlogPostBySlug } from "@/lib/blog-data";
import { auth } from "@/auth";
import { verifyDownloadToken } from "@/lib/pyq-download-token";
import https from "node:https";

async function getPdfBuffer(url: string): Promise<Buffer> {
  try {
    const upstream = await fetch(url);
    if (upstream.ok) {
      const arrayBuffer = await upstream.arrayBuffer();
      return Buffer.from(arrayBuffer);
    }
  } catch (err) {
    console.warn("[DOWNLOAD_PROXY] Standard fetch failed, attempting https fallback:", err);
  }

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

  // 1. Check if Admin is logged in
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";

  // 2. Check if a valid paid download token is provided
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token") || "";
  const isPaidTokenValid = verifyDownloadToken(token, slug);

  if (!isAdmin && !isPaidTokenValid) {
    return NextResponse.json(
      {
        error: "payment_required",
        message: "PDF डाउनलोड करने के लिए ₹49 का भुगतान आवश्यक है। आप वेबसाइट पर इसे निःशुल्क पढ़ सकते हैं।",
      },
      { status: 402 }
    );
  }

  try {
    const buffer = await getPdfBuffer(post.pdfUrl);

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(post.pdfFileName)}"`,
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch (error) {
    console.error("PDF download proxy error:", error);
    return NextResponse.redirect(post.pdfUrl, 302);
  }
}

