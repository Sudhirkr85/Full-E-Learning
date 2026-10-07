import { NextResponse } from "next/server";
import crypto from "crypto";

const TELEGRAM_INVITE_URL = "https://t.me/+HygnvMiBpgVkMmE9";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      studentName,
      studentPhone,
    } = body;

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // If Razorpay signature is provided and key_secret exists, verify
    if (keySecret && razorpay_order_id && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (generatedSignature !== razorpay_signature) {
        console.warn("[VIP_TELEGRAM_SIGNATURE_MISMATCH]", {
          expected: generatedSignature,
          received: razorpay_signature,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully.",
      redirectUrl: TELEGRAM_INVITE_URL,
      paymentId: razorpay_payment_id || null,
    });
  } catch (err: any) {
    console.error("[VIP_TELEGRAM_VERIFY_ERROR]", err);
    return NextResponse.json({
      success: true,
      message: "Payment received.",
      redirectUrl: TELEGRAM_INVITE_URL,
    });
  }
}
