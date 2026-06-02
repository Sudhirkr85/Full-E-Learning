import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, rating, comment } = await req.json();

    if (!productId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid or missing fields" }, { status: 400 });
    }

    // Verify user has a PAID order containing this productId
    const paidOrder = await prisma.order.findFirst({
      where: {
        userId: session.user.id,
        status: "PAID",
        items: {
          some: {
            productId: productId
          }
        }
      }
    });

    if (!paidOrder) {
      return NextResponse.json(
        { error: "You must purchase this product before writing a review." },
        { status: 403 }
      );
    }

    // Check no existing review from this user for this product
    const existingReview = await prisma.review.findFirst({
      where: {
        productId,
        userId: session.user.id
      }
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this product." },
        { status: 409 }
      );
    }

    // Create review in DB
    const review = await prisma.review.create({
      data: {
        productId,
        userId: session.user.id,
        rating: Number(rating),
        comment: comment || null
      },
      include: {
        user: {
          select: {
            name: true
          }
        }
      }
    });

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (err: any) {
    console.error("[REVIEW_CREATE_ERROR]", err);
    return NextResponse.json({ error: err.message || "Something went wrong." }, { status: 500 });
  }
}
