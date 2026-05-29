import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.role || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      code,
      name,
      description,
      couponType,
      discountValue,
      minimumOrderAmountCents,
      maxDiscountCents,
      maxRedemptions,
      perUserLimit,
      startsAt,
      endsAt,
      appliesTo,
      appliesToIds,
      isActive
    } = await req.json();

    if (!code || !name || discountValue === undefined) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const uppercaseCode = code.replace(/[^A-Za-z0-9]/g, "").toUpperCase().trim();

    // Check uniqueness
    const existing = await prisma.coupon.findUnique({
      where: { code: uppercaseCode }
    });

    if (existing) {
      return NextResponse.json({ error: "A coupon with this code already exists." }, { status: 400 });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: uppercaseCode,
        name,
        description: description || null,
        couponType,
        discountValue: Number(discountValue),
        minimumOrderAmountCents: minimumOrderAmountCents ? Number(minimumOrderAmountCents) : null,
        maxDiscountCents: maxDiscountCents ? Number(maxDiscountCents) : null,
        maxRedemptions: maxRedemptions ? Number(maxRedemptions) : null,
        perUserLimit: perUserLimit ? Number(perUserLimit) : 1,
        startsAt: startsAt ? new Date(startsAt) : null,
        endsAt: endsAt ? new Date(endsAt) : null,
        appliesTo: appliesTo || "ALL",
        appliesToIds: appliesToIds || [],
        isActive: isActive !== undefined ? !!isActive : true
      }
    });

    return NextResponse.json({ success: true, coupon });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.role || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        usages: {
          select: { id: true }
        }
      }
    });

    return NextResponse.json({ coupons });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error." }, { status: 500 });
  }
}
