import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "STUDENT") {
      return NextResponse.json({ error: "Forbidden: Students only" }, { status: 403 });
    }

    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId: session.user.id,
        status: "ACTIVE"
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            coverImageUrl: true,
            priceCents: true,
            level: true
          }
        }
      }
    });

    // We can map these enrolled items as the library products for the mobile bookshelf
    const products = enrollments.map(e => ({
      id: e.course.id,
      title: e.course.title,
      slug: e.course.slug,
      coverImageUrl: e.course.coverImageUrl,
      priceCents: e.course.priceCents,
      productType: "DIGITAL_RESOURCE"
    }));

    return NextResponse.json({ products });
  } catch (err: any) {
    console.error("[GET_STUDENT_LIBRARY_API_ERROR]", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
