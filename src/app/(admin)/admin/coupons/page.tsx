import type { Metadata } from "next";
import { makeMetadata } from "@/lib/site";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CouponsClient } from "./coupons-client";

export const metadata: Metadata = makeMetadata({
  title: "Coupon Dashboard - Admin Desk",
  description: "Manage global platform discount vouchers, flat rates, specific product coupons, and metrics.",
  path: "/admin/coupons",
  noIndex: true
});

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  await requireRole(["ADMIN"]);

  // Fetch all existing coupons in database
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      usages: {
        select: { id: true }
      }
    }
  });

  // Fetch active store products for selector
  const storeProducts = await prisma.product.findMany({
    where: { status: "PUBLISHED" },
    select: { id: true, title: true, productType: true }
  });

  // Fetch active courses for selector
  const courses = await prisma.course.findMany({
    where: { status: "PUBLISHED" },
    select: { id: true, title: true }
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <CouponsClient 
        initialCoupons={coupons}
        products={storeProducts}
        courses={courses}
      />
    </div>
  );
}
