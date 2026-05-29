import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { razorpay } from "@/lib/razorpay";
import { OrderStatus } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { items, billingEmail, billingPhone, couponCode, orderNotes } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ message: "Your cart is empty." }, { status: 400 });
    }

    // Validate all items exist in DB
    const validItems = [];
    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product || product.status !== "PUBLISHED") continue;
      validItems.push({ product, quantity: item.quantity });
    }

    if (validItems.length === 0) {
      return NextResponse.json({ 
        message: "Your cart is empty. All previously added items are no longer available." 
      }, { status: 400 });
    }

    // Calculate total in cents/paise
    let subtotalCents = validItems.reduce((sum, i) => sum + (i.product.priceCents * i.quantity), 0);
    let discountCents = 0;

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
      if (!coupon || !coupon.isActive) {
        return NextResponse.json({ message: "This coupon code is invalid or has expired." }, { status: 400 });
      }
      // Check if already used
      const alreadyUsed = await prisma.couponUsage.findFirst({
        where: { couponId: coupon.id, userId: session.user.id }
      });
      if (alreadyUsed) {
        return NextResponse.json({ message: "You have already used this coupon." }, { status: 400 });
      }
      discountCents = coupon.couponType === 'PERCENTAGE'
        ? Math.floor(subtotalCents * coupon.discountValue / 100)
        : coupon.discountValue; // Fixed amount in cents
    }

    const totalCents = Math.max(subtotalCents - discountCents, 0);
    
    // For physical items, check if shipping charge applies (e.g. ₹50 shipping if under ₹500/50000 cents)
    const hasPhysical = validItems.some(i => i.product.productType === "PHYSICAL" || i.product.shippingRequired);
    const shippingChargeCents = hasPhysical ? (subtotalCents > 50000 ? 0 : 5000) : 0;
    const finalTotalCents = totalCents + shippingChargeCents;

    // Create Razorpay order
    const orderNumber = `ORD_${Date.now()}_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const razorpayOrder = await razorpay.orders.create({
      amount: finalTotalCents, // Amount in paise/cents
      currency: "INR",
      receipt: orderNumber,
    });

    // Create internal order in DB with status PENDING
    const order = await prisma.order.create({
      data: {
        orderNumber: razorpayOrder.id, // Store Razorpay Order ID as the unique orderNumber key for webhooks
        userId: session.user.id,
        status: OrderStatus.PENDING,
        billingEmail,
        billingPhone,
        orderNotes,
        subtotalCents,
        discountCents,
        taxCents: 0,
        totalCents: finalTotalCents,
        currency: "INR",
        notes: orderNotes || `Store Purchase of ${validItems.length} item(s)`,
        metadata: {
          razorpayOrderId: razorpayOrder.id,
          couponCode: couponCode || null,
        },
        // Populate custom database columns added in migration
        subtotal: Math.floor(subtotalCents / 100),
        discount: Math.floor(discountCents / 100),
        items: {
          create: validItems.map(i => ({
            productId: i.product.id,
            productName: i.product.title,
            productSlug: i.product.slug,
            productType: i.product.productType,
            quantity: i.quantity,
            unitPriceCents: i.product.priceCents,
            totalPriceCents: i.product.priceCents * i.quantity,
            currency: "INR",
          }))
        }
      }
    });

    // Create a pending Payment ledger entry for tracking
    await prisma.payment.create({
      data: {
        orderId: order.id,
        provider: "STRIPE", // maps to credit card / checkout sandbox
        providerPaymentId: razorpayOrder.id,
        status: "PENDING",
        amountCents: finalTotalCents,
        currency: "INR",
        metadata: {
          rzpOrderId: razorpayOrder.id
        }
      }
    });

    return NextResponse.json({
      razorpayOrderId: razorpayOrder.id,
      internalOrderId: order.id,
      amount: finalTotalCents,
    });

  } catch (err) {
    console.error('Checkout error:', err);
    return NextResponse.json({ message: "Something went wrong. Please try again." }, { status: 500 });
  }
}
