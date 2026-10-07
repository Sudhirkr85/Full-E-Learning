import { NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { name, phone, email } = body;

    const amount = 4900; // ₹49 in paise
    const currency = "INR";
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_TISkDZFFSf8SF1";

    try {
      const order = await razorpay.orders.create({
        amount,
        currency,
        receipt: `vip_tg_${Date.now().toString().slice(-8)}`,
        notes: {
          product: "NMMS VIP Telegram Alert Channel",
          studentName: name || "Student",
          studentPhone: phone || "",
          studentEmail: email || "",
        },
      });

      return NextResponse.json({
        success: true,
        orderId: order.id,
        amount,
        currency,
        keyId,
      });
    } catch (orderErr) {
      console.warn("[VIP_TELEGRAM_RAZORPAY_ORDER_WARN]", orderErr);
      // Fallback for direct client-side checkout
      return NextResponse.json({
        success: true,
        orderId: null,
        amount,
        currency,
        keyId,
      });
    }
  } catch (err: any) {
    console.error("[VIP_TELEGRAM_CHECKOUT_ERROR]", err);
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Failed to initialize VIP checkout.",
        keyId: "rzp_live_TISkDZFFSf8SF1",
        amount: 4900,
        currency: "INR",
      },
      { status: 500 }
    );
  }
}
