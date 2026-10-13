import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { generateDownloadToken } from "@/lib/pyq-download-token";

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, slug } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !slug) {
      return NextResponse.json({ error: "Missing required payment fields." }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json({ error: "Server payment configuration missing." }, { status: 500 });
    }

    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto.createHmac("sha256", secret).update(text).digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature." }, { status: 400 });
    }

    // Payment is authentic! Generate secure timed download token
    const token = generateDownloadToken(slug);
    const downloadUrl = `/api/pyq/${slug}/download?token=${token}`;

    return NextResponse.json({
      success: true,
      downloadUrl,
      message: "Payment verified successfully! Starting download...",
    });
  } catch (error: any) {
    console.error("[PYQ_VERIFY_PAYMENT_ERROR]", error);
    return NextResponse.json({ error: error.message || "Payment verification failed" }, { status: 500 });
  }
}
