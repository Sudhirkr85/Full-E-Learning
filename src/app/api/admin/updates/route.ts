import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { updatePostSchema } from "@/lib/updates/validation";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const posts = await (prisma as any).updatePost.findMany({
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(posts);
  } catch (error: any) {
    console.error("[API_ADMIN_UPDATES_GET]", error);
    return NextResponse.json({ error: error.message || "Failed to fetch updates" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = updatePostSchema.parse(body);

    // Check slug uniqueness
    const existing = await (prisma as any).updatePost.findUnique({
      where: { slug: validated.slug },
    });

    if (existing) {
      return NextResponse.json({ error: "Slug is already taken. Please choose another." }, { status: 400 });
    }

    const publishedAt =
      validated.status === "PUBLISHED"
        ? validated.publishedAt
          ? new Date(validated.publishedAt)
          : new Date()
        : validated.publishedAt
        ? new Date(validated.publishedAt)
        : null;

    const newPost = await (prisma as any).updatePost.create({
      data: {
        slug: validated.slug,
        title: validated.title,
        summary: validated.summary,
        body: validated.body,
        type: validated.type,
        exam: validated.exam,
        state: validated.state || null,
        status: validated.status,
        links: validated.links,
        importantDates: validated.importantDates,
        faqs: validated.faqs,
        sources: validated.sources,
        seoTitle: validated.seoTitle || null,
        seoDescription: validated.seoDescription || null,
        showAds: validated.showAds,
        publishedAt,
      },
    });

    // Revalidate public pages and sitemap
    revalidatePath("/updates");
    revalidatePath(`/updates/${validated.slug}`);
    revalidatePath("/blog");
    revalidatePath("/sitemap.xml");

    return NextResponse.json(newPost);
  } catch (error: any) {
    console.error("[API_ADMIN_UPDATES_POST]", error);
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors[0]?.message || "Validation failed" }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || "Failed to create update post" }, { status: 500 });
  }
}
