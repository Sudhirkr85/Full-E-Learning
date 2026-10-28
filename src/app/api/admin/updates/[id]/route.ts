import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { updatePostSchema } from "@/lib/updates/validation";
import { revalidatePath } from "next/cache";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const post = await (prisma as any).updatePost.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch update" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await (prisma as any).updatePost.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = await req.json();
    const validated = updatePostSchema.parse(body);

    if (validated.slug !== existing.slug) {
      const slugTaken = await (prisma as any).updatePost.findUnique({
        where: { slug: validated.slug },
      });
      if (slugTaken) {
        return NextResponse.json({ error: "Slug is already taken by another update." }, { status: 400 });
      }
    }

    // Set publishedAt if transitioning to PUBLISHED and previously unset
    let publishedAt = existing.publishedAt;
    if (validated.status === "PUBLISHED" && !publishedAt) {
      publishedAt = validated.publishedAt ? new Date(validated.publishedAt) : new Date();
    } else if (validated.publishedAt) {
      publishedAt = new Date(validated.publishedAt);
    }

    const updated = await (prisma as any).updatePost.update({
      where: { id },
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

    // Revalidate paths
    revalidatePath("/updates");
    revalidatePath(`/updates/${existing.slug}`);
    revalidatePath(`/updates/${validated.slug}`);
    revalidatePath("/blog");
    revalidatePath("/sitemap.xml");

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("[API_ADMIN_UPDATES_PUT]", error);
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors[0]?.message || "Validation failed" }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await (prisma as any).updatePost.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await (prisma as any).updatePost.delete({
      where: { id },
    });

    revalidatePath("/updates");
    revalidatePath(`/updates/${existing.slug}`);
    revalidatePath("/blog");
    revalidatePath("/sitemap.xml");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[API_ADMIN_UPDATES_DELETE]", error);
    return NextResponse.json({ error: error.message || "Failed to delete" }, { status: 500 });
  }
}
