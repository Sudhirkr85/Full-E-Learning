import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, ArrowRight, ShieldCheck, Mail, ArrowLeft, ShoppingBag } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { makeMetadata } from "@/lib/site";
import { OrderStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";

type OrderConfirmationPageProps = {
  params: Promise<{
    orderId: string;
  }>;
};

export async function generateMetadata({ params }: OrderConfirmationPageProps): Promise<Metadata> {
  const { orderId } = await params;
  return makeMetadata({
    title: `Order Status | Store`,
    description: `Track your order summary for transaction reference ${orderId}.`,
    path: `/order-confirmation/${orderId}`,
    noIndex: true
  });
}

export default async function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const { orderId } = await params;
  const user = await getCurrentUser();

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

  const isFailed = order.status === OrderStatus.CANCELLED || order.status === "FAILED" as any;
  const isPaid = order.status === OrderStatus.PAID;

  // Check types of items purchased
  const hasPdf = order.items.some(item => item.productType === "DIGITAL_RESOURCE");
  const hasPhysical = order.items.some(item => item.productType === "PHYSICAL");
  
  // Find first PDF product ID for in-app reader button
  const firstPdfItem = order.items.find(item => item.productType === "DIGITAL_RESOURCE");
  const pdfProductId = firstPdfItem?.productId || "";

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-4 py-16 text-slate-100 select-none">
      {!isFailed ? (
        /* Success State Card */
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 max-w-md w-full mx-auto space-y-6 shadow-2xl">
          <div className="flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <CheckCircle className="w-16 h-16 text-emerald-400" />
            </div>
            <h1 className="text-white text-2xl font-bold">Payment Successful!</h1>
            <p className="text-slate-400 text-sm">Your order has been confirmed.</p>
            <div className="font-mono text-slate-500 text-xs bg-slate-950/40 px-3 py-1 rounded-lg">
              Order #{order.orderNumber}
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="space-y-3 border-t border-b border-white/10 py-4">
            <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Items Purchased</h3>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-white font-medium truncate">{item.productName}</span>
                    {item.productType === "PHYSICAL" ? (
                      <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0">PHYSICAL</span>
                    ) : (
                      <span className="bg-blue-500/20 text-blue-400 text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0">PDF</span>
                    )}
                  </div>
                  <span className="text-slate-300 font-semibold flex-shrink-0">
                    ₹{(item.totalPriceCents / 100).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            {/* Price breakdown if we have a shipping charge or discount */}
            {(() => {
              const shippingFeeCents = Math.max(0, order.totalCents - (order.subtotalCents - order.discountCents));
              if (order.discountCents > 0 || shippingFeeCents > 0) {
                return (
                  <div className="space-y-1.5 pt-2 text-xs text-slate-400 border-t border-white/5">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{(order.subtotalCents / 100).toLocaleString("en-IN")}</span>
                    </div>
                    {order.discountCents > 0 && (
                      <div className="flex justify-between text-emerald-400">
                        <span>Discount</span>
                        <span>-₹{(order.discountCents / 100).toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    {shippingFeeCents > 0 && (
                      <div className="flex justify-between">
                        <span>Shipping Fee</span>
                        <span>₹{(shippingFeeCents / 100).toLocaleString("en-IN")}</span>
                      </div>
                    )}
                  </div>
                );
              }
              return null;
            })()}

            <div className="flex justify-between items-center pt-3 border-t border-dashed border-white/10 text-sm font-bold">
              <span className="text-slate-400">Total Paid</span>
              <span className="text-emerald-400 text-lg">
                ₹{(order.totalCents / 100).toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3">
            {hasPdf && pdfProductId && (
              <Button asChild className="h-11 rounded-xl font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-colors">
                <Link href={`/student/orders/${order.id}/pdf-viewer?productId=${pdfProductId}`}>Access your PDF</Link>
              </Button>
            )}
            
            {hasPhysical && (
              <Button asChild className="h-11 rounded-xl font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-colors">
                <Link href="/student/orders">Track your order</Link>
              </Button>
            )}

            {!hasPdf && !hasPhysical && (
              <Button asChild className="h-11 rounded-xl font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-colors">
                <Link href="/student/dashboard">Go to Dashboard</Link>
              </Button>
            )}

            {user && (
              <Button asChild variant="ghost" className="h-11 rounded-xl font-semibold border border-white/10 text-slate-300 hover:bg-white/5 hover:text-white transition-colors w-full">
                <Link href="/student/orders">
                  <ShoppingBag className="w-4 h-4 mr-2 inline-block text-slate-400" />
                  View My Orders
                </Link>
              </Button>
            )}

            <div className="grid grid-cols-2 gap-2.5">
              <Button asChild variant="ghost" className="h-11 rounded-xl font-semibold border border-white/10 text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                <Link href="/store">Continue Shopping</Link>
              </Button>
              <Button asChild className="h-11 rounded-xl font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-colors">
                <Link href="/student/dashboard">Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* Failed State Card */
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 max-w-md w-full mx-auto space-y-6 shadow-2xl text-center">
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-20 h-20 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
              <XCircle className="w-16 h-16 text-rose-400" />
            </div>
            <h1 className="text-white text-xl font-bold">Payment Failed</h1>
            <p className="text-slate-400 text-sm">Your payment could not be processed. No amount was charged.</p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
            <Button asChild className="w-full h-11 rounded-xl font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-colors">
              <Link href="/store">Try Again</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
