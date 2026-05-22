import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { makeMetadata } from "@/lib/site";
import { CheckoutClient } from "./checkout-client";

export const dynamic = "force-dynamic";

type CheckoutPageProps = {
  params: Promise<{
    orderId: string;
  }>;
};

export async function generateMetadata({ params }: CheckoutPageProps): Promise<Metadata> {
  const { orderId } = await params;
  return makeMetadata({
    title: `Order Payment | Store`,
    description: `Complete your checkout for order ID ${orderId}.`,
    path: `/checkout/${orderId}`,
    noIndex: true
  });
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { orderId } = await params;

  // Fetch the order from the database
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  return <CheckoutClient order={order} />;
}
