import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.role || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const current = await prisma.coupon.findUnique({
      where: { id }
    });

    if (!current) {
      return NextResponse.json({ error: "Coupon not found." }, { status: 404 });
    }

    const updateData: any = {};
    if (body.code !== undefined) updateData.code = body.code.replace(/[^A-Za-z0-9]/g, "").toUpperCase().trim();
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description || null;
    if (body.couponType !== undefined) updateData.couponType = body.couponType;
    if (body.discountValue !== undefined) updateData.discountValue = Number(body.discountValue);
    if (body.minimumOrderAmountCents !== undefined) {
      updateData.minimumOrderAmountCents = body.minimumOrderAmountCents ? Number(body.minimumOrderAmountCents) : null;
    }
    if (body.maxDiscountCents !== undefined) {
      updateData.maxDiscountCents = body.maxDiscountCents ? Number(body.maxDiscountCents) : null;
    }
    if (body.maxRedemptions !== undefined) {
      updateData.maxRedemptions = body.maxRedemptions ? Number(body.maxRedemptions) : null;
    }
    if (body.perUserLimit !== undefined) {
      updateData.perUserLimit = body.perUserLimit ? Number(body.perUserLimit) : 1;
    }
    if (body.startsAt !== undefined) {
      updateData.startsAt = body.startsAt ? new Date(body.startsAt) : null;
    }
    if (body.endsAt !== undefined) {
      updateData.endsAt = body.endsAt ? new Date(body.endsAt) : null;
    }
    if (body.appliesTo !== undefined) updateData.appliesTo = body.appliesTo;
    if (body.appliesToIds !== undefined) updateData.appliesToIds = body.appliesToIds;
    if (body.isActive !== undefined) updateData.isActive = !!body.isActive;

    const coupon = await prisma.coupon.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ success: true, coupon });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error." }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.role || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.coupon.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: "Coupon deleted successfully." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error." }, { status: 500 });
  }
}
