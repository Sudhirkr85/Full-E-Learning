import { NextRequest, NextResponse } from "next/server";
import { getBlogPostBySlug } from "@/lib/blog-data";
import { auth } from "@/auth";
import { verifyDownloadToken } from "@/lib/pyq-download-token";

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
    const upstream = await fetch(post.pdfUrl);
    if (!upstream.ok) {
      return new NextResponse("Error fetching PDF", { status: upstream.status });
    }

    const arrayBuffer = await upstream.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(post.pdfFileName)}"`,
        "Content-Length": arrayBuffer.byteLength.toString(),
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch (error) {
    console.error("PDF download proxy error:", error);
    return new NextResponse("Server Error", { status: 500 });
  }
}
