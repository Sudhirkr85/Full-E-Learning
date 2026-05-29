import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { orderId, errorCode, errorDescription } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "Missing order ID" }, { status: 400 });
    }

    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.CANCELLED,
        failureReason: errorDescription || errorCode || 'Payment dismissed',
        failedAt: new Date(),
      }
    });

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error('Fail route error:', err);
    return NextResponse.json({ message: "Something went wrong." }, { status: 500 });
  }
}
