import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { makeMetadata } from "@/lib/site";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StoreOrdersClient } from "./store-orders-client";

export const metadata: Metadata = makeMetadata({
  title: "Store Orders Manager - Admin Desk",
  description: "Track store purchases, manage physical shipments, and update courier tracking.",
  path: "/admin/store/orders",
  noIndex: true
});

export const dynamic = "force-dynamic";

export default async function AdminStoreOrdersPage() {
  const session = await getSession();

  // Enforce ADMIN role
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  // Fetch store orders
  // - status is not CANCELLED
  // - at least one OrderItem has product type !== "COURSE_ACCESS"
  // - include nested: items (with product), user (name, email, phone)
  const orders = await prisma.order.findMany({
    where: {
      status: {
        not: "CANCELLED"
      },
      items: {
        some: {
          productType: {
            not: "COURSE_ACCESS"
          }
        }
      }
    },
    include: {
      items: {
        include: {
          product: true
        }
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return <StoreOrdersClient initialOrders={orders} />;
}
