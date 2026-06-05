import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json({ error: "productId is required" }, { status: 400 });
    }

    const userId = session.user.id;

    // Check if wishlist record exists
    const existing = await prisma.productWishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    });

    if (existing) {
      await prisma.productWishlist.delete({
        where: {
          userId_productId: {
            userId,
            productId
          }
        }
      });
      
      const count = await prisma.productWishlist.count({
        where: { userId }
      });

      return NextResponse.json({ wishlisted: false, count });
    } else {
      await prisma.productWishlist.create({
        data: {
          userId,
          productId
        }
      });

      const count = await prisma.productWishlist.count({
        where: { userId }
      });

      return NextResponse.json({ wishlisted: true, count });
    }
  } catch (error) {
    console.error("Product Wishlist POST Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const wishlists = await prisma.productWishlist.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            slug: true,
            coverImageUrl: true,
            priceCents: true,
            originalPriceCents: true,
            productType: true,
            description: true,
            shortDescription: true,
            metadata: true
          }
        }
      }
    });

    const products = wishlists.map(w => w.product);
    return NextResponse.json(products);
  } catch (error) {
    console.error("Product Wishlist GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
