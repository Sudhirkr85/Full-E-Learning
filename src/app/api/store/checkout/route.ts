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
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase() },
        include: {
          usages: {
            where: { userId: session.user.id }
          }
        }
      });
      if (!coupon || !coupon.isActive) {
        return NextResponse.json({ message: "This coupon is invalid or expired." }, { status: 400 });
      }

      const now = new Date();
      if (coupon.startsAt && now < new Date(coupon.startsAt)) {
        return NextResponse.json({ message: "This coupon is not active yet." }, { status: 400 });
      }
      if (coupon.endsAt && now > new Date(coupon.endsAt)) {
        return NextResponse.json({ message: "This coupon is invalid or expired." }, { status: 400 });
      }

      if (coupon.maxRedemptions !== null && coupon.redeemedCount >= coupon.maxRedemptions) {
        return NextResponse.json({ message: "This coupon is invalid or expired." }, { status: 400 });
      }

      const userLimit = coupon.perUserLimit ?? 1;
      if (coupon.usages.length >= userLimit) {
        return NextResponse.json({ message: "You have already used this coupon." }, { status: 400 });
      }

      if (coupon.minimumOrderAmountCents !== null && subtotalCents < coupon.minimumOrderAmountCents) {
        return NextResponse.json({ message: `Minimum order amount of ₹${(coupon.minimumOrderAmountCents / 100).toFixed(0)} is required.` }, { status: 400 });
      }

      // Check Scope (ALL, STORE, SPECIFIC_PRODUCTS)
      if (coupon.appliesTo === "COURSES" || coupon.appliesTo === "SPECIFIC_COURSES") {
        return NextResponse.json({ message: "This coupon is not applicable to store products." }, { status: 400 });
      }
      if (coupon.appliesTo === "SPECIFIC_PRODUCTS") {
        const itemIds = validItems.map(i => i.product.id);
        const matches = itemIds.some(id => (coupon.appliesToIds || []).includes(id));
        if (!matches) {
          return NextResponse.json({ message: "This coupon is not applicable to the products in your cart." }, { status: 400 });
        }
      }

      if (coupon.couponType === 'PERCENTAGE') {
        const calc = Math.floor(subtotalCents * coupon.discountValue / 100);
        discountCents = coupon.maxDiscountCents !== null ? Math.min(calc, coupon.maxDiscountCents) : calc;
      } else {
        discountCents = coupon.discountValue; 
      }
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
