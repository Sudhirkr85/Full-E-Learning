import { NextRequest, NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";
import { getBlogPostBySlug } from "@/lib/blog-data";

export async function POST(req: NextRequest) {
  try {
    const { slug } = await req.json();

    if (!slug) {
      return NextResponse.json({ error: "Slug is required." }, { status: 400 });
    }

    const post = getBlogPostBySlug(slug);
    if (!post) {
      return NextResponse.json({ error: "Paper not found." }, { status: 404 });
    }

    // 4900 paise = ₹49.00
    const orderOptions = {
      amount: 4900,
      currency: "INR",
      receipt: `rcpt_pyq_${Date.now()}`,
      notes: {
        type: "PYQ_DOWNLOAD",
        slug: slug,
        title: post.title.slice(0, 40),
      },
    };

    const rzpOrder = await razorpay.orders.create(orderOptions);

    return NextResponse.json({
      orderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
      title: post.title,
    });
  } catch (error: any) {
    console.error("[PYQ_CREATE_ORDER_ERROR]", error);
    return NextResponse.json({ error: error.message || "Failed to create payment order" }, { status: 500 });
  }
}
