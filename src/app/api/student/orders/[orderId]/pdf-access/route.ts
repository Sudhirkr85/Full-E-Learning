import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required." }, { status: 400 });
    }

    // Validate UUID format to prevent database crashes
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(orderId) || !uuidRegex.test(productId)) {
      return NextResponse.json({ error: "Invalid parameters." }, { status: 400 });
    }

    // Verify order exists, belongs to user, is PAID, and contains this product
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          where: { productId }
        }
      }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    const isBuyer = order.userId === session.user.id;
    const isStaff = session.user.role === "ADMIN" || session.user.role === "TEACHER";

    if (!isBuyer && !isStaff) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 403 });
    }

    if (order.status !== "PAID") {
      return NextResponse.json({ error: "This order is unpaid." }, { status: 403 });
    }

    if (order.items.length === 0) {
      return NextResponse.json({ error: "Product not found in this order." }, { status: 404 });
    }

    // Fetch the product from database to get the secure assetUrl
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product || !product.assetUrl) {
      return NextResponse.json({ error: "Digital document not available." }, { status: 404 });
    }

    return NextResponse.json({ fileUrl: product.assetUrl }, { status: 200 });
  } catch (err: any) {
    console.error("[SECURE_PDF_ACCESS_ERROR]", err);
    return NextResponse.json({ error: err.message || "Something went wrong." }, { status: 500 });
  }
}
