import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { requireRole, getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { makeMetadata } from "@/lib/site";
import { 
  Package, Calendar, Download, ExternalLink, ArrowLeft, Printer, ShieldCheck, 
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
      {/* Page Header (Hidden on print) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <Button asChild variant="ghost" size="sm">
          <Link href={isStaff && !isBuyer ? "/teacher/dashboard" : "/student/orders"} className="flex items-center gap-1.5 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
        </Button>

        <div className="flex gap-2">
          <Button onClick={() => window.print()} variant="outline" size="sm" className="flex items-center gap-1">
            <Printer className="h-4 w-4" />
            Print Invoice
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Invoice Body Details */}
        <div className="lg:col-span-8 space-y-6 print:w-full print:col-span-12">
          {/* Printable Invoice Header */}
          <Card className="border-border/60 shadow-soft overflow-hidden rounded-2xl">
            <div className="p-6 bg-slate-900 text-white flex justify-between items-start flex-wrap gap-4">
              <div>
                <span className="text-[10px] text-amber-500 uppercase tracking-widest font-mono font-bold block mb-1">Receipt Invoice</span>
                <h2 className="font-mono text-lg font-bold tracking-tight">{order.orderNumber}</h2>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {dateStr}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <Badge className={order.status === "PAID" ? "bg-emerald-500 text-white border-none py-1 px-3" : "bg-amber-500 text-black border-none py-1 px-3"}>
                  {order.status.toLowerCase()}
                </Badge>
                <span className="text-[10px] text-slate-400 block mt-2">Billing: {order.billingEmail}</span>
              </div>
            </div>

            <CardContent className="p-6 divide-y divide-border/80">
              {/* Product Listing */}
              <div className="py-4 space-y-4">
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest block font-bold mb-2">Purchased items</span>
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start gap-4 text-sm">
                    <div>
                      <p className="font-semibold text-foreground">{item.productName}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Type: {item.productType?.replace("_", " ") || "Digital"}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">
                        {(item.totalPriceCents / 100).toLocaleString("en-US", {
                          style: "currency",
                          currency: item.currency,
                        })}
                      </span>
                      {item.quantity > 1 && (
                        <span className="text-xs text-muted-foreground block mt-0.5">
                          {item.quantity} x ${(item.unitPriceCents / 100).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Invoice Totals */}
              <div className="py-4 space-y-2 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formattedSubtotal}</span>
                </div>
                {order.discountCents > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount Applied</span>
                    <span>-{formattedDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-foreground font-extrabold pt-2 border-t border-dashed">
                  <span>Total Paid</span>
                  <span className="text-lg text-foreground font-mono">{formattedTotal}</span>
                </div>
              </div>

              {/* Digital File Delivery Secure Reader */}
              {order.status === "PAID" && order.items.some(i => i.productType === "DIGITAL_RESOURCE" && i.product?.assetUrl) && (
                <div className="py-6 space-y-3 print:hidden">
                  <span className="text-[10px] text-emerald-600 uppercase tracking-widest block font-extrabold mb-1">PDF Books Unlocked! 📖</span>
                  <p className="text-xs text-muted-foreground mb-3">Your digital PDF books are authorized and ready. Click below to open and read them directly within the secure in-app reader:</p>
                  
                  <div className="grid gap-2">
                    {order.items.map((item) => {
                      if (item.productType === "DIGITAL_RESOURCE" && item.product?.assetUrl) {
                        return (
                          <div key={item.id} className="flex items-center justify-between p-3 border border-emerald-500/20 bg-emerald-500/[0.02] rounded-xl">
                            <span className="text-xs font-semibold text-foreground truncate max-w-sm">{item.productName}</span>
                            <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 rounded-xl">
                              <Link href={`/student/orders/${order.id}/pdf-viewer?productId=${item.productId}`}>
                                <BookOpen className="h-3.5 w-3.5" />
                                Read PDF Book
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
        <div className="lg:col-span-4 space-y-6 print:hidden">
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
    </section>
  );
}
