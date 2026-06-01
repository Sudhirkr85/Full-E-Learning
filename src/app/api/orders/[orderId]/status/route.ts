import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await params;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        status: true,
        userId: true,
        placedAt: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Security check: Only the buyer or admin/teacher can check the status
    const isBuyer = order.userId === session.user.id;
    const isStaff = session.user.role === "ADMIN" || session.user.role === "TEACHER";

    if (!isBuyer && !isStaff) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Auto-cancel if PENDING and placed more than 30 minutes ago
    if (order.status === "PENDING") {
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      if (new Date(order.placedAt) < thirtyMinutesAgo) {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: "CANCELLED",
            failureReason: "Payment window expired (30 minutes timeout)",
            failedAt: new Date(),
          },
        });
        return NextResponse.json({ status: "CANCELLED" });
      }
    }

    return NextResponse.json({ status: order.status });
  } catch (err) {
    console.error("Error fetching order status:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
