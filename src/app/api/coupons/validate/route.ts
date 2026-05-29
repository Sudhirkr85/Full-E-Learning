import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CouponType } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { code, amountCents, scope, items } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Coupon code is required." }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
      include: {
        usages: {
          where: { userId: session.user.id }
        }
      }
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ error: "This coupon is invalid or expired." }, { status: 400 });
    }

    const now = new Date();
    if (coupon.startsAt && now < new Date(coupon.startsAt)) {
      return NextResponse.json({ error: "This coupon is not active yet." }, { status: 400 });
    }

    if (coupon.endsAt && now > new Date(coupon.endsAt)) {
      return NextResponse.json({ error: "This coupon is invalid or expired." }, { status: 400 });
    }

    // Check global usage limit
    if (coupon.maxRedemptions !== null && coupon.redeemedCount >= coupon.maxRedemptions) {
      return NextResponse.json({ error: "This coupon is invalid or expired." }, { status: 400 });
    }

    // Check user limit
    const userLimit = coupon.perUserLimit ?? 1;
    if (coupon.usages.length >= userLimit) {
      return NextResponse.json({ error: "You have already used this coupon." }, { status: 400 });
    }

    // Minimum amount check
    if (coupon.minimumOrderAmountCents !== null && amountCents < coupon.minimumOrderAmountCents) {
      return NextResponse.json({
        error: `Minimum order amount of ₹${(coupon.minimumOrderAmountCents / 100).toFixed(0)} is required to use this coupon.`
      }, { status: 400 });
    }

    // Scope verification
    let discountCents = 0;
    const appliesTo = coupon.appliesTo;
    const appliesToIds = coupon.appliesToIds || [];

    if (scope === "COURSES") {
      if (appliesTo !== "ALL" && appliesTo !== "COURSES" && appliesTo !== "SPECIFIC_COURSES") {
        return NextResponse.json({ error: "This coupon is not applicable to courses." }, { status: 400 });
      }
      if (appliesTo === "SPECIFIC_COURSES" && items && items.length > 0) {
        const matches = items.some((id: string) => appliesToIds.includes(id));
        if (!matches) {
          return NextResponse.json({ error: "This coupon is not applicable to the selected course." }, { status: 400 });
        }
      }
    } else if (scope === "STORE") {
      if (appliesTo === "COURSES" || appliesTo === "SPECIFIC_COURSES") {
        return NextResponse.json({ error: "This coupon is not applicable to store products." }, { status: 400 });
      }
      if (appliesTo === "SPECIFIC_PRODUCTS" && items && items.length > 0) {
        const matches = items.some((id: string) => appliesToIds.includes(id));
        if (!matches) {
          return NextResponse.json({ error: "This coupon is not applicable to the products in your cart." }, { status: 400 });
        }
      }
      // Product type scopes
      if (appliesTo === "DIGITAL_PRODUCTS" || appliesTo === "PHYSICAL_PRODUCTS") {
        // Validation could filter matching items, but for now we just verify
      }
    }

    // Discount Calculation
    if (coupon.couponType === CouponType.PERCENTAGE) {
      const calculated = Math.round((amountCents * coupon.discountValue) / 100);
      discountCents = coupon.maxDiscountCents !== null 
        ? Math.min(calculated, coupon.maxDiscountCents) 
        : calculated;
    } else {
      discountCents = coupon.discountValue; // stored in cents
    }

    discountCents = Math.min(discountCents, amountCents);

    return NextResponse.json({
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        name: coupon.name,
        couponType: coupon.couponType,
        discountValue: coupon.discountValue
      },
      discountCents
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error." }, { status: 500 });
  }
}
