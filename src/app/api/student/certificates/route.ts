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

    const certificates = await prisma.certificate.findMany({
      where: {
        enrollment: {
          userId: session.user.id
        }
      },
      orderBy: {
        issuedAt: "desc"
      },
      include: {
        enrollment: {
          include: {
            course: {
              select: {
                title: true,
                slug: true,
                coverImageUrl: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json({ certificates });
  } catch (err: any) {
    console.error("[GET_CERTIFICATES_API_ERROR]", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
