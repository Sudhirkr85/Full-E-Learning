import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { makeMetadata } from "@/lib/site";
import { 
  Package, 
  CreditCard, 
  ChevronRight, 
  ShoppingCart, 
  Calendar, 
  Tag, 
  CheckCircle2, 
  AlertCircle,
  XCircle,
  Truck,
  BookOpen,
  ExternalLink
} from "lucide-react";
import { CopyButton } from "@/components/ui/copy-button";
import { OrderStatusPoller } from "./order-status-poller";

export const metadata: Metadata = makeMetadata({
  title: "My Orders | Dashboard",
  description: "Track your purchases, digital file downloads, and physical item shipping logs.",
  path: "/student/orders",
  noIndex: true
});

export default async function StudentOrdersPage() {
  const student = await requireRole(["STUDENT"]);

  // Auto-cancel pending orders older than 30 minutes
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
  try {
    await prisma.order.updateMany({
      where: {
        userId: student.id,
        status: "PENDING",
        placedAt: {
          lt: thirtyMinutesAgo,
        },
      },
      data: {
        status: "CANCELLED",
        failureReason: "Payment window expired (30 minutes timeout)",
        failedAt: new Date(),
      },
    });
  } catch (err) {
    console.error("Failed to auto-cancel expired pending orders:", err);
  }

  // Fetch all orders for this student
  const orders = await prisma.order.findMany({
    where: { userId: student.id },
    orderBy: { placedAt: "desc" },
    include: {
      items: true,
    },
  });

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertCircle className="h-3.5 w-3.5" />
            Pending
          </span>
        );
      case "PAID":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Paid
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="h-3.5 w-3.5" />
            Cancelled
          </span>
        );
      case "REFUNDED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <CreditCard className="h-3.5 w-3.5" />
            Refunded
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-500/10 text-slate-300 border border-slate-500/20">
            {status.toLowerCase()}
          </span>
        );
    }
  };

  const getShippingStatusBadge = (order: any) => {
    const meta: any = order.metadata || {};
    const status = meta.shippingStatus || "NOT_APPLICABLE";

    switch (status) {
      case "NOT_APPLICABLE":
        return null;
      case "PROCESSING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 ml-2">
            <Truck className="h-3.5 w-3.5 animate-pulse" />
            Processing
          </span>
        );
      case "SHIPPED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/20 ml-2">
            <Truck className="h-3.5 w-3.5" />
            Shipped
          </span>
        );
      case "DELIVERED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ml-2">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Delivered
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-500/10 text-slate-300 border border-slate-500/20 ml-2">
            {status.toLowerCase()}
          </span>
        );
    }
  };

  return (
    <section className="space-y-8 pb-12">
      {/* Header Panel */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/30 border border-white/5 p-6 md:p-8 backdrop-blur-md">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/5 rounded-full filter blur-[80px] pointer-events-none" />
        
        <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-300 border-indigo-500/20 px-3 py-1 rounded-full text-xs font-semibold gap-1.5 self-start w-fit">
          <Package className="h-3.5 w-3.5 text-indigo-400" />
          Purchase Records
        </Badge>
        
        <h1 className="mt-4 font-display text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
          Your Orders & Billing
        </h1>
        <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-400 max-w-2xl">
          Access receipts, download digital guides, track physical shipping status, or retry pending checkout orders directly in your secure student ledger.
        </p>
      </div>

      {/* Main Container */}
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="max-w-lg mx-auto py-16 text-center rounded-3xl bg-slate-900/20 border border-dashed border-slate-800 p-8">
            <ShoppingCart className="h-16 w-16 text-slate-600 mx-auto opacity-35 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No purchases yet</h3>
            <p className="text-sm text-slate-400 mb-6">
              You haven't placed any store orders or digital item purchases yet.
            </p>
            <Link 
              href="/store"
              className="inline-flex items-center justify-center h-11 px-6 rounded-xl font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition duration-200"
            >
              Browse Learning Store
            </Link>
          </div>
        ) : (
          <div className="grid gap-5">
            {orders.map((order) => {
              const formattedTotal = (order.totalCents / 100).toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 0
              });

              const dateStr = new Date(order.placedAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });

              const meta: any = order.metadata || {};
              const shippingStatus = meta.shippingStatus || "PROCESSING";
              const courierName = meta.courierName || "";
              const trackingId = meta.trackingId || "";
              const trackingUrl = meta.trackingUrl || "";
              
              const hasPhysical = order.items.some(item => item.productType === "PHYSICAL");
              
              const getCourierDeepLink = (courier: string, trId: string) => {
                const c = courier.toLowerCase();
                if (c.includes("delhivery")) return `https://www.delhivery.com/track/package/${trId}`;
                if (c.includes("bluedart") || c.includes("blue dart")) return `https://www.bluedart.com/tracking?trackid=${trId}`;
                if (c.includes("india post") || c.includes("speed post")) return `https://www.indiapost.gov.in/`;
                return null;
              };

              const activeTrackingUrl = trackingUrl || (trackingId ? getCourierDeepLink(courierName, trackingId) : null);

              return (
                <div 
                  key={order.id} 
                  className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-[0_0_25px_rgba(99,102,241,0.12)] p-5 md:p-6 backdrop-blur-md flex flex-col gap-6"
                >
                  {/* Top Row: Ref, Date, Status Badges */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-mono text-xs font-bold text-slate-200 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
                          Order Reference: #{order.orderNumber.slice(-8)}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                          <Calendar className="h-3.5 w-3.5 text-slate-500" />
                          {dateStr}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2">
                        {getPaymentStatusBadge(order.status)}
                        {order.status === "PENDING" && (
                          <OrderStatusPoller orderId={order.id} initialStatus={order.status} />
                        )}
                        {getShippingStatusBadge(order)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-6 shrink-0">
                      <div className="text-left md:text-right">
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block mb-1">Total Paid</span>
                        <span className="text-2xl font-black text-white tracking-tight">{formattedTotal}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {order.status === "PENDING" && (
                          <Link 
                            href={`/checkout/${order.id}`}
                            className="h-10 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center gap-1.5 transition-all shadow-[0_0_15px_rgba(245,158,11,0.25)] hover:scale-[1.02]"
                          >
                            <CreditCard className="h-3.5 w-3.5" />
                            Pay Now
                          </Link>
                        )}
                        <Link 
                          href={`/student/orders/${order.id}`}
                          className="h-10 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-white/5 hover:bg-white/10 text-white border border-white/10 flex items-center justify-center gap-1.5 transition-all"
                        >
                          Details
                          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* List of items in the order */}
                  <div className="pt-3 border-t border-white/5 space-y-3">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Purchased Items</p>
                    {order.items.map((item) => {
                      const isPdf = item.productType === "DIGITAL_RESOURCE";
                      const price = (item.totalPriceCents / 100).toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                        minimumFractionDigits: 0
                      });
                      return (
                        <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                              {isPdf ? <BookOpen className="h-4 w-4" /> : <Package className="h-4 w-4" />}
                            </span>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-white truncate">{item.productName}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">
                                Type: {isPdf ? "PDF Book" : "Physical Product"} • Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between sm:justify-end gap-4">
                            <span className="text-xs font-bold text-slate-300 font-mono">{price}</span>
                            {order.status === "PAID" && isPdf && (
                              <Link
                                href={`/student/orders/${order.id}/pdf-viewer?productId=${item.productId}`}
                                className="h-8 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-1 transition"
                              >
                                <BookOpen className="h-3 w-3" />
                                Read Now
                              </Link>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Shipping tracking timeline card for physical items */}
                  {order.status === "PAID" && hasPhysical && (
                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-white">
                        <Truck className="h-4 w-4 text-indigo-400" />
                        <span>Shipping Status</span>
                      </div>
                      
                      {/* Shipping Timeline: horizontal on desktop, vertical on mobile */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                        {/* Step 1: Processing */}
                        <div className="flex items-center gap-2.5">
                          <span className={`h-6 w-6 rounded-full flex items-center justify-center border-2 text-[10px] font-bold ${
                            shippingStatus === "PROCESSING" || shippingStatus === "SHIPPED" || shippingStatus === "DELIVERED"
                              ? "bg-indigo-600 border-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                              : "bg-transparent border-white/10 text-slate-500"
                          }`}>
                            1
                          </span>
                          <div>
                            <p className="text-xs font-bold text-white">Processing</p>
                            <p className="text-[10px] text-slate-400">Items being packed</p>
                          </div>
                        </div>

                        {/* Arrow/Line divider between 1 & 2 */}
                        <div className="hidden sm:block flex-1 h-[2px] bg-white/10 mx-2" />

                        {/* Step 2: Shipped */}
                        <div className="flex items-center gap-2.5">
                          <span className={`h-6 w-6 rounded-full flex items-center justify-center border-2 text-[10px] font-bold ${
                            shippingStatus === "SHIPPED" || shippingStatus === "DELIVERED"
                              ? "bg-indigo-600 border-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                              : "bg-transparent border-white/10 text-slate-500"
                          }`}>
                            2
                          </span>
                          <div>
                            <p className="text-xs font-bold text-white">Shipped</p>
                            <p className="text-[10px] text-slate-400">Dispatched from hub</p>
                          </div>
                        </div>

                        {/* Arrow/Line divider between 2 & 3 */}
                        <div className="hidden sm:block flex-1 h-[2px] bg-white/10 mx-2" />

                        {/* Step 3: Delivered */}
                        <div className="flex items-center gap-2.5">
                          <span className={`h-6 w-6 rounded-full flex items-center justify-center border-2 text-[10px] font-bold ${
                            shippingStatus === "DELIVERED"
                              ? "bg-emerald-600 border-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                              : "bg-transparent border-white/10 text-slate-500"
                          }`}>
                            3
                          </span>
                          <div>
                            <p className="text-xs font-bold text-white">Delivered</p>
                            <p className="text-[10px] text-slate-400">Arrived at destination</p>
                          </div>
                        </div>
                      </div>

                      {/* Extra tracking information if dispatched */}
                      {(shippingStatus === "SHIPPED" || shippingStatus === "DELIVERED") && trackingId && (
                        <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          <div className="space-y-1">
                            <p className="text-slate-400">
                              Courier: <span className="font-semibold text-white">{courierName || "Standard Delivery"}</span>
                            </p>
                            <p className="text-slate-400 flex items-center flex-wrap gap-1">
                              Tracking ID: <CopyButton text={trackingId} />
                            </p>
                          </div>
                          
                          {activeTrackingUrl && (
                            <a
                              href={activeTrackingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="h-9 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold tracking-wide flex items-center justify-center gap-1 transition self-start sm:self-center"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              Track on Courier Site
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
