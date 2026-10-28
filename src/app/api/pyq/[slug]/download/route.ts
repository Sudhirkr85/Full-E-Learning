import { NextRequest, NextResponse } from "next/server";
import { getBlogPostBySlug } from "@/lib/blog-data";
import { auth } from "@/auth";
import { verifyDownloadToken } from "@/lib/pyq-download-token";
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
    const buffer = await getR2ObjectBuffer(post.pdfUrl);

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(post.pdfFileName)}"`,
        "Content-Length": buffer.length.toString(),
        "X-Robots-Tag": "noindex, nofollow",
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("[DOWNLOAD_R2_ERROR]", error);
    return new NextResponse("Failed to download file", { status: 500 });
  }
}
