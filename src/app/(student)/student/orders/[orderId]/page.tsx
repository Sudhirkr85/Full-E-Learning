import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { PrintInvoiceButton } from "./print-invoice-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { requireRole, getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { makeMetadata } from "@/lib/site";
import { 
  Package, Calendar, Download, ExternalLink, ArrowLeft, ShieldCheck, 
  Truck, CheckCircle, Clock, ChevronRight, RefreshCw, BookOpen
} from "lucide-react";

type OrderDetailPageProps = {
  params: Promise<{
    orderId: string;
  }>;
};

export async function generateMetadata({ params }: OrderDetailPageProps): Promise<Metadata> {
  const { orderId } = await params;
  return makeMetadata({
    title: `Order #${orderId.substring(0, 8)} | Dashboard`,
    description: `Track your order tracking and digital downloads.`,
    path: `/student/orders/${orderId}`,
    noIndex: true
  });
}

// Client action component for administrative/staff quick updates
import { updateShippingAction } from "@/lib/shipping/actions";
async function handleAdminStatusSubmit(formData: FormData) {
  "use server";
  const orderId = formData.get("orderId") as string;
  const shippingStatus = formData.get("shippingStatus") as any;
  const courierName = formData.get("courierName") as string;
  const trackingId = formData.get("trackingId") as string;
  const trackingUrl = formData.get("trackingUrl") as string;

  await updateShippingAction({
    orderId,
    shippingStatus,
    courierName,
    trackingId,
    trackingUrl
  });
}

export default async function StudentOrderDetailPage({ params }: OrderDetailPageProps) {
  const { orderId } = await params;
  const session = await getSession();
  
  // Enforce auth
  if (!session?.user) {
    return notFound();
  }

  // Fetch the order with items and products
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

  // Ensure security: Only the buyer OR an admin/teacher can view details
  const isBuyer = order.userId === session.user.id;
  const isStaff = session.user.role === "ADMIN" || session.user.role === "TEACHER";

  if (!isBuyer && !isStaff) {
    return notFound();
  }

  const formattedSubtotal = (order.subtotalCents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: order.currency,
  });

  const formattedDiscount = (order.discountCents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: order.currency,
  });

  const formattedTotal = (order.totalCents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: order.currency,
  });

  const shippingFeeCents = Math.max(0, order.totalCents - (order.subtotalCents - order.discountCents));
  const formattedShipping = (shippingFeeCents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: order.currency,
  });

  const dateStr = new Date(order.placedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  const meta: any = order.metadata || {};
  const shippingStatus = meta.shippingStatus || "NOT_APPLICABLE";
  const shippingAddress = meta.shippingAddress;
  const courierName = meta.courierName || "";
  const trackingId = meta.trackingId || "";
  const trackingUrl = meta.trackingUrl || "";

  return (
    <section className="space-y-8 pb-16">
      <style>{`
        @media print {
          body {
            background: white;
            color: black;
          }
          .print\\:hidden {
            display: none !important;
          }
          .bg-gradient-to-r.from-slate-900 {
            background: linear-gradient(to right, rgb(30, 41, 59), rgb(30, 41, 59)) !important;
          }
          .text-white {
            color: white !important;
          }
          .text-slate-300 {
            color: rgb(148, 163, 184) !important;
          }
          .shadow-lg {
            box-shadow: none !important;
          }
          @page {
            margin: 1cm;
            size: A4;
          }
        }
      `}</style>
      {/* Page Header (Hidden on print) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <Button asChild variant="ghost" size="sm" className="hover:bg-white/5">
          <Link href={isStaff && !isBuyer ? "/teacher/dashboard" : "/student/orders"} className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4 text-slate-400" />
            Back to dashboard
          </Link>
        </Button>

        <div className="flex gap-2">
          <PrintInvoiceButton orderId={order.id} />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Invoice Body Details */}
        <div className="lg:col-span-9 space-y-6 print:w-full print:col-span-12">
          {/* Printable Invoice Header */}
          <Card className="mx-auto max-w-4xl w-full border border-slate-200 shadow-lg overflow-hidden rounded-2xl bg-white" data-invoice-content>
            <div className="p-6 md:p-8 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex justify-between items-start flex-wrap gap-4">
              <div className="space-y-2">
                <span className="text-[11px] text-amber-400 uppercase tracking-widest font-mono font-extrabold block">📄 Receipt Invoice</span>
                <h2 className="font-mono text-base sm:text-xl font-black tracking-tight break-all text-white" data-order-number>{order.orderNumber}</h2>
                <p className="text-sm text-slate-300 mt-2 flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {dateStr}
                </p>
              </div>
              <div className="text-left sm:text-right space-y-2">
                <Badge className={order.status === "PAID" ? "bg-emerald-500 text-white border-none py-2 px-4 text-sm font-bold" : "bg-amber-500 text-slate-900 border-none py-2 px-4 text-sm font-bold"}>
                  ✓ {order.status.toLowerCase()}
                </Badge>
                <p className="text-[12px] text-slate-300 mt-2">Email: <span className="text-white font-semibold">{order.billingEmail}</span></p>
              </div>
            </div>

            <CardContent className="p-6 md:p-8 divide-y divide-slate-200 space-y-8 bg-white">
              {/* Billing & Shipping Details Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8">
                {/* Billing Info */}
                <div className="space-y-3 bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <span className="text-[12px] text-slate-600 uppercase tracking-widest font-extrabold block mb-1">👤 Billing Details</span>
                  <div className="space-y-3 border-t border-slate-200 pt-4">
                    <div>
                      <p className="text-xs text-slate-500 font-semibold">Full Name</p>
                      <p className="text-slate-900 font-bold text-base mt-1">{shippingAddress?.fullName || session.user.name || "Customer"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-semibold">Email Address</p>
                      <p className="text-slate-900 font-medium text-sm mt-1 break-all">{order.billingEmail}</p>
                    </div>
                    {order.billingPhone && (
                      <div>
                        <p className="text-xs text-slate-500 font-semibold">Phone</p>
                        <p className="text-slate-900 font-medium text-sm mt-1">{order.billingPhone}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Shipping Info */}
                {shippingAddress ? (
                  <div className="space-y-3 bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <span className="text-[12px] text-slate-600 uppercase tracking-widest font-extrabold block mb-1">🚚 Delivery Address</span>
                    <div className="space-y-3 border-t border-slate-200 pt-4">
                      <div>
                        <p className="text-xs text-slate-500 font-semibold">Recipient Name</p>
                        <p className="text-slate-900 font-bold text-base mt-1">{shippingAddress.fullName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-semibold">Phone</p>
                        <p className="text-slate-900 font-medium text-sm mt-1">{shippingAddress.primaryPhone || order.billingPhone}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-semibold">Full Address</p>
                        <p className="text-slate-900 font-medium text-sm mt-1 leading-relaxed">
                          {shippingAddress.addressLine1}
                          {shippingAddress.addressLine2 ? `, ${shippingAddress.addressLine2}` : ""}
                          <br />
                          {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.postalCode}
                          <br />
                          {shippingAddress.country}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 bg-emerald-50 p-6 rounded-xl border border-emerald-200">
                    <span className="text-[12px] text-emerald-700 uppercase tracking-widest font-extrabold block mb-1">📦 Delivery Method</span>
                    <div className="border-t border-emerald-200 pt-4 space-y-2">
                      <p className="font-bold text-emerald-700 text-base">Instant Digital Access</p>
                      <p className="text-emerald-700 leading-relaxed text-sm">✓ Authorized PDF resources and online course access are unlocked immediately on your dashboard.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Product Listing */}
              <div className="py-8 space-y-4">
                <span className="text-[12px] text-slate-600 uppercase tracking-widest font-extrabold block mb-4">📋 Purchased Items</span>
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={item.id} className="flex justify-between items-start gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 mb-2">
                          <span className="text-xs font-bold text-slate-500 bg-slate-200 px-2 py-1 rounded">Item {idx + 1}</span>
                          <span className="text-xs font-semibold text-slate-600 bg-blue-100 text-blue-700 px-2 py-1 rounded uppercase">{item.productType?.replace("_", " ") || "Digital"}</span>
                        </div>
                        <p className="font-bold text-slate-900 text-sm md:text-base">{item.productName}</p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-slate-600 mt-1.5">Quantity: <span className="font-semibold">{item.quantity}</span> × <span className="font-semibold">₹{(item.unitPriceCents / 100).toFixed(2)}</span></p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-slate-600 font-semibold mb-1">Amount</p>
                        <span className="font-black text-slate-900 text-base md:text-lg">
                          {(item.totalPriceCents / 100).toLocaleString("en-US", {
                            style: "currency",
                            currency: item.currency,
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Invoice Totals */}
              <div className="py-8 space-y-4">
                <div className="space-y-3 bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-700 font-semibold">Subtotal:</span>
                    <span className="text-slate-900 font-bold text-base">{formattedSubtotal}</span>
                  </div>
                  {order.discountCents > 0 && (
                    <div className="flex justify-between items-center text-sm border-t border-slate-200 pt-2">
                      <span className="text-slate-700 font-semibold">Discount Applied:</span>
                      <span className="text-emerald-700 font-bold text-base">-{formattedDiscount}</span>
                    </div>
                  )}
                  {shippingFeeCents > 0 && (
                    <div className="flex justify-between items-center text-sm border-t border-slate-200 pt-2">
                      <span className="text-slate-700 font-semibold">Shipping Fee:</span>
                      <span className="text-slate-900 font-bold text-base">{formattedShipping}</span>
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center pt-4 px-6 py-5 border-t-4 border-slate-900 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl shadow-lg">
                  <span className="font-black text-base md:text-lg uppercase tracking-wider">💰 Total Paid</span>
                  <span className="text-2xl md:text-3xl font-mono font-black">{formattedTotal}</span>
                </div>
              </div>

              {/* Digital File Delivery Secure Reader */}
              {order.status === "PAID" && order.items.some(i => i.productType === "DIGITAL_RESOURCE" && i.product?.assetUrl) && (
                <div className="py-8 space-y-4 print:hidden">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] text-emerald-400 uppercase tracking-widest font-extrabold">✓ PDF Books Unlocked</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed mb-4">Your digital PDF books are authorized and ready to read. Click below to open them in the secure in-app reader:</p>
                  
                  <div className="grid gap-3">
                    {order.items.map((item) => {
                      if (item.productType === "DIGITAL_RESOURCE" && item.product?.assetUrl) {
                        return (
                          <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-emerald-500/30 bg-emerald-500/[0.05] rounded-xl hover:border-emerald-500/50 transition">
                            <span className="text-sm font-semibold text-white truncate flex-1">{item.productName}</span>
                            <Button asChild size="sm" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-1.5 rounded-lg">
                              <Link href={`/student/orders/${order.id}/pdf-viewer?productId=${item.productId}`}>
                                <BookOpen className="h-4 w-4" />
                                Open PDF
                              </Link>
                            </Button>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Shipping details timeline & tracking sidebar */}
        <div className="lg:col-span-3 space-y-6 print:hidden">
          {shippingStatus !== "NOT_APPLICABLE" && (
            <Card className="border-border/60 shadow-soft overflow-hidden rounded-2xl">
              <CardHeader className="bg-muted/40 p-4 border-b border-border">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
                  <Truck className="h-4 w-4 text-amber-500" />
                  <span>Shipping Tracker</span>
                </CardTitle>
                <CardDescription className="text-xs">Live tracking timeline for your package.</CardDescription>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* Visual Timeline Graphics */}
                <div className="space-y-4 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-border">
                  {/* Step 1: Processing */}
                  <div className="relative">
                    <span className={`absolute -left-6 top-0.5 rounded-full h-4.5 w-4.5 flex items-center justify-center border-2 ${
                      shippingStatus === "PROCESSING" || shippingStatus === "SHIPPED" || shippingStatus === "DELIVERED"
                        ? "bg-amber-500 border-amber-500 text-background"
                        : "bg-background border-border text-muted-foreground"
                    }`}>
                      <Clock className="h-2.5 w-2.5" />
                    </span>
                    <p className={`text-xs font-bold ${shippingStatus === "PROCESSING" ? "text-amber-600" : "text-foreground"}`}>Processing</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Order items are being packed in the storehouse.</p>
                  </div>

                  {/* Step 2: Shipped */}
                  <div className="relative">
                    <span className={`absolute -left-6 top-0.5 rounded-full h-4.5 w-4.5 flex items-center justify-center border-2 ${
                      shippingStatus === "SHIPPED" || shippingStatus === "DELIVERED"
                        ? "bg-amber-500 border-amber-500 text-background"
                        : "bg-background border-border text-muted-foreground"
                    }`}>
                      <Truck className="h-2.5 w-2.5" />
                    </span>
                    <p className={`text-xs font-bold ${shippingStatus === "SHIPPED" ? "text-amber-600" : "text-foreground"}`}>Dispatched / Shipped</p>
                    {shippingStatus === "SHIPPED" || shippingStatus === "DELIVERED" ? (
                      <p className="text-[10px] text-muted-foreground mt-0.5">In transit via {courierName || "Courier"}. ID: {trackingId}.</p>
                    ) : (
                      <p className="text-[10px] text-muted-foreground mt-0.5">Waiting for dispatch from warehouse.</p>
                    )}
                  </div>

                  {/* Step 3: Delivered */}
                  <div className="relative">
                    <span className={`absolute -left-6 top-0.5 rounded-full h-4.5 w-4.5 flex items-center justify-center border-2 ${
                      shippingStatus === "DELIVERED"
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "bg-background border-border text-muted-foreground"
                    }`}>
                      <CheckCircle className="h-2.5 w-2.5" />
                    </span>
                    <p className={`text-xs font-bold ${shippingStatus === "DELIVERED" ? "text-emerald-600" : "text-foreground"}`}>Delivered</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Package arrived and received.</p>
                  </div>
                </div>

                {/* Tracking Link button */}
                {shippingStatus === "SHIPPED" && trackingUrl && (
                  <Button asChild size="sm" className="w-full bg-amber-500 hover:bg-amber-600 text-background flex items-center gap-1.5 rounded-xl">
                    <a href={trackingUrl} target="_blank">
                      <ExternalLink className="h-3.5 w-3.5" />
                      Track Shipment Live
                    </a>
                  </Button>
                )}

                {/* Recipient Shipping Address details */}
                {shippingAddress && (
                  <div className="pt-4 border-t border-border space-y-1.5 text-xs text-muted-foreground">
                    <span className="font-semibold text-[10px] text-foreground uppercase tracking-widest block mb-1">Destination</span>
                    <p className="font-semibold text-foreground">{shippingAddress.fullName}</p>
                    <p>{shippingAddress.addressLine1}, {shippingAddress.addressLine2 && `${shippingAddress.addressLine2}, `}{shippingAddress.city}, {shippingAddress.state} - {shippingAddress.postalCode}</p>
                    <p>{shippingAddress.country}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* ADMIN/STAFF SHIPPNG CONTROLS (Development Simulator Desk) */}
          {isStaff && shippingStatus !== "NOT_APPLICABLE" && (
            <Card className="border-emerald-500/20 bg-emerald-500/[0.02] rounded-2xl overflow-hidden shadow-sm">
              <CardHeader className="p-4 border-b border-emerald-500/10 bg-emerald-500/5">
                <CardTitle className="text-xs font-bold text-emerald-700 uppercase tracking-widest flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Admin Shipping Desk</span>
                </CardTitle>
                <CardDescription className="text-[10px] text-emerald-600">Simulate courier delivery state modifications.</CardDescription>
              </CardHeader>

              <CardContent className="p-4">
                <form action={handleAdminStatusSubmit} className="space-y-3">
                  <input type="hidden" name="orderId" value={order.id} />
                  
                  <div>
                    <label className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Shipping State</label>
                    <select 
                      name="shippingStatus" 
                      defaultValue={shippingStatus}
                      className="w-full bg-background border border-border rounded-lg px-2 py-1 text-xs focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Courier Service</label>
                    <input 
                      type="text" 
                      name="courierName" 
                      placeholder="Blue Dart, DHL" 
                      defaultValue={courierName}
                      className="w-full bg-background border border-border rounded-lg px-2 py-1 text-xs focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Tracking ID</label>
                      <input 
                        type="text" 
                        name="trackingId" 
                        placeholder="BD12345" 
                        defaultValue={trackingId}
                        className="w-full bg-background border border-border rounded-lg px-2 py-1 text-xs focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Tracking Link</label>
                      <input 
                        type="text" 
                        name="trackingUrl" 
                        placeholder="https://track..." 
                        defaultValue={trackingUrl}
                        className="w-full bg-background border border-border rounded-lg px-2 py-1 text-xs focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <Button type="submit" size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 rounded-xl">
                    <RefreshCw className="h-3 w-3" />
                    Save & Notify Student
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Mobile sticky actions (compact) */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-50 print:hidden">
        <div className="mx-auto max-w-4xl w-full bg-slate-900/90 backdrop-blur-md rounded-xl p-3 shadow-lg border border-white/10 flex items-center justify-between gap-3">
          <div className="flex-1">
            <p className="text-xs text-slate-300">Order {order.orderNumber?.slice(0,8)}</p>
            <p className="text-sm font-bold text-white">{formattedTotal}</p>
          </div>
          <div className="flex items-center gap-2">
            <PrintInvoiceButton orderId={order.id} />
          </div>
        </div>
      </div>
    </section>
  );
}
