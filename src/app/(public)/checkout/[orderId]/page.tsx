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

import { redirect } from "next/navigation";

export default function CheckoutPage() {
  redirect("/store");
}
