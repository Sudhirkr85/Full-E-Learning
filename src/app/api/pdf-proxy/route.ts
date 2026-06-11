import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { getDownloadPresignedUrl } from "@/lib/r2";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
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

    // Check if the lesson is a preview first
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

    const isPreviewLesson = lesson?.isPreview === true;

    let hasAccess = false;
    let userId: string | null = null;
    let userRole: string | null = null;

    if (isPreviewLesson) {
      hasAccess = true;
    } else {
      const secureCookie = request.nextUrl.protocol === "https:";
      const cookieName = secureCookie ? "__Secure-authjs.session-token" : "authjs.session-token";
      
      const token = await getToken({
        req: request,
        secret: process.env.AUTH_SECRET,
        secureCookie,
        cookieName
      });

      const session = token && token.sub ? {
        user: {
          id: token.sub as string,
          role: (token.role as string) || "STUDENT"
        }
      } : null;

      if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 });
      }

      userId = session.user.id;
      userRole = session.user.role;

      // Staff (Admin/Teacher) always have full access — skip DB lookup entirely
      if (userRole === "ADMIN" || userRole === "TEACHER") {
        try {
          const key = new URL(normalizedUrl).pathname.substring(1);
          const downloadUrl = await getDownloadPresignedUrl(key);
          return NextResponse.redirect(downloadUrl, 302);
        } catch (err) {
          return NextResponse.redirect(normalizedUrl, 302);
        }
      }
    }
    if (!hasAccess && userId) {
      if (lesson) {
        const courseId = lesson.section.courseId;
        const enrollment = await prisma.enrollment.findUnique({
          where: {
            userId_courseId: {
              userId,
              courseId
            }
          }
        });
        if (enrollment && (enrollment.status === "ACTIVE" || enrollment.status === "COMPLETED")) {
          hasAccess = true;
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
                userId,
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
      console.warn(`[PDF_PROXY] 403 — user ${userId || "guest"} tried to access: ${normalizedUrl}`);
      return new NextResponse("Unauthorized to access this document", { status: 403 });
    }

    // Redirect user to the secure presigned download link
    try {
      const key = new URL(normalizedUrl).pathname.substring(1);
      const downloadUrl = await getDownloadPresignedUrl(key);
      return NextResponse.redirect(downloadUrl, 302);
    } catch (err) {
      return NextResponse.redirect(normalizedUrl, 302);
    }
  } catch (error) {
    console.error("[PDF_PROXY_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

