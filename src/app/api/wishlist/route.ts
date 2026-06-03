import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { courseId } = await req.json();
    if (!courseId) {
      return NextResponse.json({ error: "courseId is required" }, { status: 400 });
    }

    const userId = session.user.id;

    // Check if wishlist record exists
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    });

    if (existing) {
      await prisma.wishlist.delete({
        where: {
          userId_courseId: {
            userId,
            courseId
          }
        }
      });
      
      const count = await prisma.wishlist.count({
        where: { userId }
      });

      return NextResponse.json({ wishlisted: false, count });
    } else {
      await prisma.wishlist.create({
        data: {
          userId,
          courseId
        }
      });

      const count = await prisma.wishlist.count({
        where: { userId }
      });

      return NextResponse.json({ wishlisted: true, count });
    }
  } catch (error) {
    console.error("Wishlist POST Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const wishlists = await prisma.wishlist.findMany({
      where: { userId: session.user.id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            coverImageUrl: true,
            priceCents: true,
            metadata: true,
            teachers: {
              include: {
                teacher: {
                  select: { name: true }
                }
              }
            },
            categories: {
              include: {
                category: true
              }
            }
          }
        }
      }
    });

    const courses = wishlists.map(w => w.course);
    return NextResponse.json(courses);
  } catch (error) {
    console.error("Wishlist GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
