import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { uploadToR2 } from "@/lib/r2";
import sharp from "sharp";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // Allow up to 10 MB input which will be compressed

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id || (session.user.role !== "ADMIN" && session.user.role !== "TEACHER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("banner") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10 MB." },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const rawBuffer = Buffer.from(arrayBuffer);

    let processedBuffer: Buffer = rawBuffer;
    let contentType = file.type;
    let ext = file.type.split("/")[1] ?? "jpg";

    // Perform server-side image compression & optimization using sharp
    try {
      if (file.type !== "image/gif") {
        processedBuffer = await sharp(rawBuffer)
          .resize(1920, 1080, { fit: "inside", withoutEnlargement: true })
          .webp({ quality: 82, effort: 4 })
          .toBuffer();
        contentType = "image/webp";
        ext = "webp";
      }
    } catch (sharpErr) {
      console.warn("Sharp image processing fallback:", sharpErr);
      processedBuffer = rawBuffer;
    }

    // Generate a unique key for the banner
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
    const key = `banners/${session.user.id}/${Date.now()}_${sanitizedName}.${ext}`;

    // Upload to S3/Cloudflare R2
    const imageUrl = await uploadToR2(key, processedBuffer, contentType);

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Banner upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload banner. Please try again." },
      { status: 500 }
    );
  }
}
