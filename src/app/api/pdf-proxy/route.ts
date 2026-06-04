import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return new NextResponse("Bad Request: url parameter is required", { status: 400 });
    }

    // Determine access by checking if the URL is associated with a Product or Lesson
    let hasAccess = false;

    // Check if it's a Lesson PDF
    const lesson = await prisma.lesson.findFirst({
      where: { r2AssetUrl: url },
      include: {
        section: {
          include: {
            course: true
          }
        }
      }
    });

    if (lesson) {
      const courseId = lesson.section.courseId;
      // Is staff (Admin/Teacher) or enrolled student
      if (session.user.role === "ADMIN" || session.user.role === "TEACHER") {
        hasAccess = true;
      } else {
        const enrollment = await prisma.enrollment.findUnique({
          where: {
            userId_courseId: {
              userId: session.user.id,
              courseId
            }
          }
        });
        if (enrollment && (enrollment.status === "ACTIVE" || enrollment.status === "COMPLETED")) {
          hasAccess = true;
        }
      }
    } else {
      // Check if it's a Product PDF
      const product = await prisma.product.findFirst({
        where: { assetUrl: url }
      });

      if (product) {
        if (session.user.role === "ADMIN" || session.user.role === "TEACHER") {
          hasAccess = true;
        } else {
          // Check if there is a PAID order containing this product for this user
          const orderItem = await prisma.orderItem.findFirst({
            where: {
              productId: product.id,
              order: {
                userId: session.user.id,
                status: "PAID"
              }
            }
          });
          if (orderItem) {
            hasAccess = true;
          }
        }
      }
    }

    if (!hasAccess) {
      return new NextResponse("Unauthorized to access this document", { status: 403 });
    }

    // Fetch the PDF from remote storage
    const response = await fetch(url);
    if (!response.ok) {
      return new NextResponse("Failed to fetch document from source storage", { status: response.status });
    }

    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline",
      },
    });
  } catch (error) {
    console.error("[PDF_PROXY_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
