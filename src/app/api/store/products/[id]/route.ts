import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        status: true,
        priceCents: true,
        inventoryCount: true
      }
    });

    if (!product || (product.status !== "ACTIVE" && product.status !== "PUBLISHED")) {
      return NextResponse.json({ error: "Product not available" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
