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
    const rawUrl = searchParams.get("url");

    if (!rawUrl) {
      return new NextResponse("Bad Request: url parameter is required", { status: 400 });
    }

    // Normalize URL: decode any double-encoding that may happen in query params
    let normalizedUrl = rawUrl;
    try {
      normalizedUrl = decodeURIComponent(rawUrl);
    } catch {
      normalizedUrl = rawUrl;
    }

    // Staff (Admin/Teacher) always have full access — skip DB lookup entirely
    if (session.user.role === "ADMIN" || session.user.role === "TEACHER") {
      const response = await fetch(normalizedUrl);
      if (!response.ok) {
        return new NextResponse("Failed to fetch document from source storage", { status: response.status });
      }
      const buffer = await response.arrayBuffer();
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": "inline",
          "Cache-Control": "private, max-age=3600",
        },
      });
    }

    let hasAccess = false;

    // Check Lesson PDF — try both raw and normalized URL to handle encoding differences
    const lesson = await prisma.lesson.findFirst({
      where: {
        OR: [
          { r2AssetUrl: normalizedUrl },
          { r2AssetUrl: rawUrl },
        ]
      },
      include: {
        section: {
          include: {
            course: true
          }
        }
      }
    });

    if (lesson) {
      // Preview lessons are accessible to any authenticated user
      if (lesson.isPreview) {
        hasAccess = true;
      } else {
        const courseId = lesson.section.courseId;
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
        where: {
          OR: [
            { assetUrl: normalizedUrl },
            { assetUrl: rawUrl },
          ]
        }
      });

      if (product) {
        // Check if the user has a PAID order for this product
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

    if (!hasAccess) {
      console.warn(`[PDF_PROXY] 403 — user ${session.user.id} tried to access: ${normalizedUrl}`);
      return new NextResponse("Unauthorized to access this document", { status: 403 });
    }

    // Fetch the PDF from remote R2 storage
    const response = await fetch(normalizedUrl);
    if (!response.ok) {
      return new NextResponse("Failed to fetch document from source storage", { status: response.status });
    }

    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline",
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (error) {
    console.error("[PDF_PROXY_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
