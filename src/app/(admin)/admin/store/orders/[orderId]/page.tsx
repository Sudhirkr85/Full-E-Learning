import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { makeMetadata } from "@/lib/site";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OrderDetailClient } from "./order-detail-client";

type AdminOrderDetailPageProps = {
  params: Promise<{
    orderId: string;
  }>;
};

export async function generateMetadata({ params }: AdminOrderDetailPageProps): Promise<Metadata> {
  const { orderId } = await params;
  return makeMetadata({
    title: `Admin Order Detail | Store`,
    description: `Detailed shipping and transaction desk for order ${orderId}.`,
    path: `/admin/store/orders/${orderId}`,
    noIndex: true
  });
}

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  const { orderId } = await params;
  const session = await getSession();

  // Enforce ADMIN role
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  // Fetch the order from the database
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
      payments: true,
    },
  });

  if (!order) {
    notFound();
  }

  return <OrderDetailClient order={order} />;
}
