import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId, rating, comment } = await req.json();

    if (!courseId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid or missing fields" }, { status: 400 });
    }

    // Verify user is enrolled in this course
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: session.user.id,
        courseId: courseId
      }
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "You must enroll in this course before writing a review." },
        { status: 403 }
      );
    }

    // Check no existing review from this user for this course
    const existingReview = await prisma.courseReview.findFirst({
      where: {
        enrollmentId: enrollment.id
      }
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this course." },
        { status: 409 }
      );
    }

    // Create course review in DB
    const review = await prisma.courseReview.create({
      data: {
        enrollmentId: enrollment.id,
        rating: Number(rating),
        body: comment || null
      },
      include: {
        enrollment: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    // Map the returned review to match ReviewWithUser shape in frontend
    const formattedReview = {
      id: review.id,
      rating: review.rating,
      comment: review.body,
      createdAt: review.createdAt,
      user: {
        name: review.enrollment.user?.name || "Verified Student"
      }
    };

    return NextResponse.json({ success: true, review: formattedReview }, { status: 201 });
  } catch (err: any) {
    console.error("[COURSE_REVIEW_CREATE_ERROR]", err);
    return NextResponse.json({ error: err.message || "Something went wrong." }, { status: 500 });
  }
}
