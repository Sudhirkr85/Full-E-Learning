import type { Metadata } from "next";
import { makeMetadata } from "@/lib/site";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StoreClient } from "./store-client";

export const metadata: Metadata = makeMetadata({
  title: "Store Catalog - Admin Desk",
  description: "Manage e-learning physical products, resources, course codes, and packages.",
  path: "/admin/store",
  noIndex: true
});

export const dynamic = "force-dynamic";

export default async function AdminStorePage() {
  // Enforce ADMIN role
  await requireRole(["ADMIN"]);

  // Fetch products
  const products = await prisma.product.findMany({
    where: {
      productType: {
        in: ["DIGITAL_RESOURCE", "PHYSICAL"]
      }
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      productType: true,
      status: true,
      priceCents: true,
      stockQuantity: true,
      createdAt: true
    }
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <StoreClient initialProducts={products} />
    </div>
  );
}
