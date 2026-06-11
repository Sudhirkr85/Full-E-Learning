import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUploadPresignedUrl } from "@/lib/r2";

const ALLOWED_TYPES = ["application/pdf"];
const MAX_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id || (session.user.role !== "ADMIN" && session.user.role !== "TEACHER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { filename, contentType, size } = body;

    if (!filename || !contentType || size === undefined) {
      return NextResponse.json({ error: "Missing required parameters (filename, contentType, size)." }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(contentType)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF documents are allowed." },
        { status: 400 }
      );
    }

    if (size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 100 MB." },
        { status: 400 }
      );
    }

    // Generate a unique key for the PDF
    const sanitizedName = filename.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
    const key = `pdfs/${session.user.id}/${Date.now()}_${sanitizedName}.pdf`;

    // Generate Presigned Upload URL
    const uploadUrl = await getUploadPresignedUrl(key, contentType);
    const pdfUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

    return NextResponse.json({ uploadUrl, pdfUrl });
  } catch (error) {
    console.error("PDF upload presign error:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL. Please try again." },
      { status: 500 }
    );
  }
}

