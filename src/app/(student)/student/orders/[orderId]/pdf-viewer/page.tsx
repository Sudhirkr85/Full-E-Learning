import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { makeMetadata } from "@/lib/site";
import { PdfReader } from "@/components/pdf-reader/PdfReader";

type PdfViewerPageProps = {
  params: Promise<{
    orderId: string;
  }>;
  searchParams: Promise<{
    productId?: string;
  }>;
};

export async function generateMetadata({ params }: PdfViewerPageProps): Promise<Metadata> {
  const { orderId } = await params;
  return makeMetadata({
    title: `Reading Book | Order #${orderId.substring(0, 8)}`,
    description: `Read your purchased PDF book online.`,
    path: `/student/orders/${orderId}/pdf-viewer`,
    noIndex: true
  });
}

export const dynamic = "force-dynamic";

export default async function StudentPdfViewerPage({ params, searchParams }: PdfViewerPageProps) {
  const { orderId } = await params;
  const { productId } = await searchParams;
  const session = await getSession();

  if (!session?.user) {
    return notFound();
  }

  if (!productId) {
    redirect(`/student/orders/${orderId}`);
  }

  // Validate if orderId and productId are valid UUIDs to prevent Prisma database runtime casting errors
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(orderId) || !uuidRegex.test(productId)) {
    return notFound();
  }

  // Fetch the order with items to verify purchase using try-catch for absolute database safety
  let order;
  try {
    order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          where: { productId },
          include: {
            product: true
          }
        }
      }
    });
  } catch (err) {
    console.error("[PDF_VIEWER_DB_ERROR]", err);
    return notFound();
  }

  if (!order || order.status !== "PAID" || order.items.length === 0) {
    return notFound();
  }

  // Ensure security: Only buyer or admin/teacher
  const isBuyer = order.userId === session.user.id;
  const isStaff = session.user.role === "ADMIN" || session.user.role === "TEACHER";

  if (!isBuyer && !isStaff) {
    return notFound();
  }

  const item = order.items[0];
  const pdfUrl = item.product?.assetUrl;

  if (!pdfUrl) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto px-4 py-16 text-center">
        <Badge variant="secondary" className="bg-red-500/20 text-red-300 border-red-500/30">Document unavailable</Badge>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white">PDF Book is missing</h1>
        <p className="mt-4 text-slate-400 max-w-md mx-auto">This PDF book has no digital asset attached by the administrator yet.</p>
        <Button className="mt-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl" asChild>
          <Link href={`/student/orders/${orderId}`}>Back to Receipt</Link>
        </Button>
      </div>
    );
  }

  return (
    <PdfReader
      productId={productId}
      orderId={orderId}
      fileUrl={pdfUrl}
      userName={session.user.name || "Student"}
      userEmail={session.user.email || ""}
      productName={item.productName}
    />
  );
}
