import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    const session = await auth();

    if (session?.user?.id) {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        select: { userId: true }
      });

      if (order && order.userId !== session.user.id) {
        const isStaff = 
          session.user.role === "ADMIN" ||
          session.user.role === "TEACHER";
        if (!isStaff) {
          return NextResponse.json(
            { error: "Unauthorized" },
            { status: 403 }
          );
        }
      }
    }

    // Check if the orderId is an Enrollment ID first. 
    // In our system, paid/free course enrollments also behave as orders.
    // Let's first search for an Order record, and if not found, check if it's an Enrollment record.
    let order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
      },
    });

    if (order) {
      // Auto-cancel if PENDING and placed more than 30 minutes ago
      if (order.status === "PENDING") {
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
        if (new Date(order.placedAt) < thirtyMinutesAgo) {
          order = await prisma.order.update({
            where: { id: order.id },
            data: {
              status: "CANCELLED",
              failureReason: "Payment window expired (30 minutes timeout)",
              failedAt: new Date(),
            },
            include: {
              items: true,
            },
          });
        }
      }

      // Check if this store order is related to a course enrollment
      let courseSlug: string | null = null;
      let courseName: string | null = null;
      let orderType: "COURSE" | "STORE" = "STORE";

      // If the order has items, check if there's any course product type
      const courseItem = order.items.find(item => item.productType === "COURSE_ACCESS");
      if (courseItem) {
        orderType = "COURSE";
        courseName = courseItem.productName;
        courseSlug = courseItem.productSlug;
      } else {
        // Fallback check: look up metadata for enrollment or course info
        const meta = order.metadata as any || {};
        if (meta.courseSlug) {
          courseSlug = meta.courseSlug;
          orderType = "COURSE";
        }
        if (meta.courseTitle || meta.courseName) {
          courseName = meta.courseTitle || meta.courseName;
          orderType = "COURSE";
        }
      }

      return NextResponse.json({
        status: order.status,
        orderType,
        courseSlug,
        courseName,
        items: order.items.map(item => ({
          name: item.productName,
          quantity: item.quantity
        })),
        totalAmount: order.totalCents / 100,
        createdAt: order.placedAt.toISOString(),
        paidAt: order.paidAt ? order.paidAt.toISOString() : null
      });
    }

    // Fallback: Check if this is a Course Enrollment ID directly (e.g. course checkout creates Enrollment directly)
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: orderId },
      include: {
        course: true,
      },
    });

    if (enrollment) {
      // Auto-cancel if PENDING and placed more than 30 minutes ago
      let enrollmentStatus = enrollment.status;
      if (enrollment.status === "PENDING" && enrollment.createdAt) {
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
        if (new Date(enrollment.createdAt) < thirtyMinutesAgo) {
          await prisma.enrollment.update({
            where: { id: enrollment.id },
            data: {
              status: "FAILED",
              paymentStatus: "FAILED",
              failureReason: "Payment window expired (30 minutes timeout)",
              failedAt: new Date(),
            }
          });
          enrollmentStatus = "FAILED";
        }
      }

      // Map EnrollmentStatus to the required Order confirmation statuses:
      // status: "PENDING" | "PAID" | "FAILED" | "CANCELLED"
      let mappedStatus: "PENDING" | "PAID" | "FAILED" | "CANCELLED" = "PENDING";
      if (enrollmentStatus === "ACTIVE" || enrollmentStatus === "COMPLETED") {
        mappedStatus = "PAID";
      } else if (enrollmentStatus === "FAILED") {
        mappedStatus = "FAILED";
      } else if (enrollmentStatus === "CANCELLED") {
        mappedStatus = "CANCELLED";
      }

      return NextResponse.json({
        status: mappedStatus,
        orderType: "COURSE",
        courseSlug: enrollment.course.slug,
        courseName: enrollment.course.title,
        items: [{
          name: enrollment.course.title,
          quantity: 1
        }],
        totalAmount: (enrollment.amountPaid || (enrollment.course.priceCents / 100)),
        createdAt: enrollment.enrolledAt ? enrollment.enrolledAt.toISOString() : enrollment.createdAt.toISOString(),
        paidAt: enrollment.paidAt ? enrollment.paidAt.toISOString() : null
      });
    }

    return NextResponse.json({ error: "Order or enrollment not found" }, { status: 404 });
  } catch (err) {
    console.error("Error fetching order status:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
