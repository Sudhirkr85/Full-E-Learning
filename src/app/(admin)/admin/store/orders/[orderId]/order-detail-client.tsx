"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  User, 
  ShoppingBag, 
  Truck, 
  CreditCard, 
  BookOpen, 
  Package, 
  Mail, 
  Phone, 
  ExternalLink,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type UserData = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
};

type ProductData = {
  id: string;
  title: string;
  productType: string;
};

type OrderItemData = {
  id: string;
  productName: string;
  productType: string | null;
  totalPriceCents: number;
  productId: string | null;
  product: ProductData | null;
};

type PaymentData = {
  id: string;
  providerPaymentId: string | null;
  providerOrderId: string | null;
  amountCents: number;
  status: string;
  createdAt: Date | string;
};

type OrderData = {
  id: string;
  orderNumber: string;
  status: string;
  totalCents: number;
  metadata?: any;
  createdAt: Date | string;
  user: UserData | null;
  items: any[];
  payments: any[];
};

type OrderDetailClientProps = {
  order: OrderData;
};

// Reusable CopyChip Component
function CopyChip({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        toast.success("Copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
      }}
      className="inline-flex items-center gap-1.5 font-mono text-[11px] bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-slate-300 hover:bg-white/10 transition-colors w-full sm:w-auto shrink-0 select-text"
      title="Click to copy"
    >
      <span className="truncate max-w-[200px] sm:max-w-xs">{value}</span>
      {copied ? (
        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
      ) : (
        <Copy className="w-3.5 h-3.5 text-slate-500 shrink-0 hover:text-slate-300" />
      )}
    </button>
  );
}

export function OrderDetailClient({ order }: OrderDetailClientProps) {
  const router = useRouter();
  
  // Tracking Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courierName, setCourierName] = useState("");
  const [customCourier, setCustomCourier] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [dispatchDate, setDispatchDate] = useState("");
  const [shippingStatus, setShippingStatus] = useState<"PROCESSING" | "SHIPPED" | "DELIVERED">("SHIPPED");
  const [internalNote, setInternalNote] = useState("");
  const [saving, setSaving] = useState(false);

  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  const formatINR = (cents: number) => {
    return "Rs. " + new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0
    }).format(cents / 100);
  };

  const getInitials = (name: string | null, email: string) => {
    const displayName = name || email;
    const parts = displayName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  // Check if any product is PHYSICAL
  const hasPhysical = order.items.some(item => item.productType === "PHYSICAL");
  
  // Find first PDF product
  const firstPdfItem = order.items.find(item => item.productType === "DIGITAL_RESOURCE");

  // Read shipping parameters
  const shippingMeta = order.metadata || {};
  const shipStatus = shippingMeta.shippingStatus || (hasPhysical ? "PROCESSING" : "");
  const hasTracking = !!shippingMeta.trackingId;

  const openShippingDesk = () => {
    setCourierName(shippingMeta.courierName || "Delhivery");
    setCustomCourier(
      shippingMeta.courierName && !["Delhivery", "BlueDart", "India Post", "DTDC", "Ekart", "Xpressbees"].includes(shippingMeta.courierName)
        ? shippingMeta.courierName
        : ""
    );
    setTrackingId(shippingMeta.trackingId || "");
    setDispatchDate(shippingMeta.dispatchDate || new Date().toISOString().split("T")[0]);
    setShippingStatus(shippingMeta.shippingStatus || "SHIPPED");
    setInternalNote(shippingMeta.internalNote || "");
    setIsModalOpen(true);
  };

  const handleSaveShipping = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalCourier = courierName === "Other" ? customCourier : courierName;
    if (!finalCourier.trim()) {
      toast.error("Please enter a courier name.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/shipping`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courierName: finalCourier,
          trackingId: trackingId.toUpperCase(),
          dispatchDate,
          shippingStatus,
          internalNote
        })
      });

      if (res.ok) {
        toast.success("Tracking updated successfully!");
        setIsModalOpen(false);
        router.refresh();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to update tracking.");
      }
    } catch {
      toast.error("Failed to update tracking.");
    } finally {
      setSaving(false);
    }
  };

  // Helper for tracking links
  const getTrackingLink = (courier: string, tId: string) => {
    const cName = courier.toLowerCase();
    if (cName.includes("delhivery")) return `https://www.delhivery.com/tracking/?ref=${tId}`;
    if (cName.includes("bluedart")) return `https://www.bluedart.com/tracking?trackFor=0&id=${tId}`;
    if (cName.includes("india post")) return `https://www.indiapost.gov.in/vas/pages/trackconsignment.aspx`;
    if (cName.includes("dtdc")) return `https://www.dtdc.in/tracking/tracking_results.asp?Ttype=T&strCnno=${tId}`;
    if (cName.includes("ekart")) return `https://ekartlogistics.com/shipmenttrack/${tId}`;
    return null;
  };

  const hasDirectTrackingButton = () => {
    const courier = (shippingMeta.courierName || "").toLowerCase();
    return ["delhivery", "bluedart", "india post", "dtdc", "ekart"].some(c => courier.includes(c));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 sm:px-6 py-8 select-none text-slate-100">
      
      {/* Top Bar Navigation */}
      <div className="flex items-center gap-3">
        <Link 
          href="/admin/store/orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition h-10 px-3 rounded-lg border border-white/5 bg-white/[0.02]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Store Orders
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/10 pb-5">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Order Details</h1>
          <p className="text-xs text-slate-500 font-mono mt-1 uppercase tracking-wider">
            Order #{order.id.slice(-8)}
          </p>
        </div>
        <div>
          {order.status === "PAID" ? (
            <span className="rounded-full px-3 py-1 text-xs font-bold bg-green-500/20 text-emerald-400 border border-green-500/30 tracking-wider">PAID</span>
          ) : order.status === "PENDING" ? (
            <span className="rounded-full px-3 py-1 text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 tracking-wider">PENDING</span>
          ) : (
            <span className="rounded-full px-3 py-1 text-xs font-bold bg-red-500/20 text-rose-400 border border-red-500/30 tracking-wider">CANCELLED</span>
          )}
        </div>
      </div>

      {/* SECTION 1 - Order Summary */}
      <Card className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 shadow-lg backdrop-blur-md">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 border-b border-white/5 pb-2">Order Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
          <div className="space-y-1">
            <span className="text-slate-500 block uppercase text-[10px] tracking-widest">Order ID</span>
            <CopyChip value={order.id} />
          </div>
          <div className="space-y-1">
            <span className="text-slate-500 block uppercase text-[10px] tracking-widest">Order Date</span>
            <p className="text-white text-sm font-semibold">{formattedDate}</p>
          </div>
          <div className="space-y-1">
            <span className="text-slate-500 block uppercase text-[10px] tracking-widest">Payment Status</span>
            <div>
              {order.status === "PAID" ? (
                <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold bg-green-500/20 text-emerald-400 border border-green-500/30">PAID</span>
              ) : order.status === "PENDING" ? (
                <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">PENDING</span>
              ) : (
                <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold bg-red-500/20 text-rose-400 border border-red-500/30">CANCELLED</span>
              )}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-slate-500 block uppercase text-[10px] tracking-widest">Razorpay ID</span>
            {order.payments?.[0]?.providerPaymentId ? (
              <CopyChip value={order.payments[0].providerPaymentId} />
            ) : (
              <p className="text-slate-400 font-semibold">—</p>
            )}
          </div>
          <div className="space-y-1 sm:col-span-2 pt-2 border-t border-white/5">
            <span className="text-slate-500 block uppercase text-[10px] tracking-widest mb-1">Total Amount</span>
            <p className="text-emerald-400 text-xl font-extrabold">{formatINR(order.totalCents)}</p>
          </div>
        </div>
      </Card>

      {/* SECTION 2 - Student Details */}
      <Card className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
          <User className="h-4 w-4 text-slate-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Student</h2>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center font-bold text-sm text-indigo-300 shrink-0 self-start sm:self-center shadow-inner">
            {getInitials(order.user?.name || null, order.user?.email || "Student")}
          </div>
          <div className="space-y-1.5 min-w-0 flex-1">
            <p className="text-base font-semibold text-white truncate">{order.user?.name || "Student"}</p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 text-xs">
              <a 
                href={`mailto:${order.user?.email}`}
                className="text-slate-400 hover:text-white transition flex items-center gap-1.5 truncate"
              >
                <Mail className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                {order.user?.email}
              </a>
              {order.user?.phone ? (
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                  {order.user.phone}
                </span>
              ) : (
                <span className="text-slate-500 flex items-center gap-1.5 italic">
                  <Phone className="h-3.5 w-3.5 text-slate-600 shrink-0" />
                  Not provided
                </span>
              )}
            </div>
            <div className="pt-1">
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-widest">STUDENT</span>
            </div>
          </div>
        </div>
      </Card>

      {/* SECTION 3 - Order Items */}
      <Card className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
          <ShoppingBag className="h-4 w-4 text-slate-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Items Ordered</h2>
        </div>
        <div className="divide-y divide-white/5">
          {order.items.map((item) => {
            const isPdf = item.productType === "DIGITAL_RESOURCE";
            return (
              <div key={item.id} className="py-4 first:pt-0 last:pb-0">
                {/* Desktop layout */}
                <div className="hidden sm:flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {isPdf ? (
                      <BookOpen className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                    ) : (
                      <Package className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                    )}
                    <span className="text-sm font-semibold text-white truncate">{item.productName}</span>
                    {isPdf ? (
                      <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full px-2.5 py-0.5 text-[10px] font-bold">PDF</span>
                    ) : (
                      <span className="bg-violet-500/20 text-violet-400 border border-violet-500/30 rounded-full px-2.5 py-0.5 text-[10px] font-bold">PHYSICAL</span>
                    )}
                  </div>
                  <div className="flex items-center gap-6 shrink-0">
                    <span className="text-xs text-slate-500 font-semibold">x1</span>
                    <span className="text-sm font-extrabold text-emerald-400 w-24 text-right">
                      {formatINR(item.totalPriceCents)}
                    </span>
                  </div>
                </div>

                {/* Mobile layout */}
                <div className="sm:hidden space-y-2">
                  <div className="flex items-start gap-2.5">
                    {isPdf ? (
                      <BookOpen className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    ) : (
                      <Package className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    )}
                    <p className="text-xs font-semibold text-white leading-tight">{item.productName}</p>
                  </div>
                  <div className="flex items-center gap-2 pl-6.5 text-[10px] font-semibold text-slate-400">
                    {isPdf ? (
                      <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full px-2.5 py-0.5 text-[10px] font-bold">PDF</span>
                    ) : (
                      <span className="bg-violet-500/20 text-violet-400 border border-violet-500/30 rounded-full px-2.5 py-0.5 text-[10px] font-bold">PHYSICAL</span>
                    )}
                    <span>•</span>
                    <span>Qty 1</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-extrabold">{formatINR(item.totalPriceCents)}</span>
                  </div>
                </div>
              </div>
            );
          })}
          
          <div className="border-t border-white/10 mt-3 pt-3 flex justify-between items-center text-sm font-bold">
            <span className="text-white font-bold">Total</span>
            <span className="text-emerald-400 text-base font-extrabold">{formatINR(order.totalCents)}</span>
          </div>
        </div>
      </Card>

      {/* SECTION 4 - Shipping Details (PHYSICAL ONLY) */}
      {hasPhysical && (
        <Card className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
            <Truck className="h-4 w-4 text-slate-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Shipping</h2>
          </div>
          
          {!hasTracking || shipStatus === "PROCESSING" ? (
            <div className="py-2 space-y-4">
              <div className="flex items-center gap-2">
                <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">PROCESSING</span>
                <span className="text-xs text-slate-400 font-semibold">Tracking details not added yet.</span>
              </div>
              <Button 
                onClick={openShippingDesk}
                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-4 py-2 h-9 text-xs font-bold uppercase tracking-wider w-full sm:w-auto shadow-md transition"
              >
                Add Tracking
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium border-b border-white/5 pb-4">
                <div className="space-y-1">
                  <span className="text-slate-500 block uppercase text-[10px] tracking-widest">Shipping Status</span>
                  <div>
                    {shipStatus === "SHIPPED" ? (
                      <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">SHIPPED</span>
                    ) : (
                      <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold bg-green-500/20 text-emerald-400 border border-green-500/30">DELIVERED</span>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500 block uppercase text-[10px] tracking-widest">Courier Name</span>
                  <p className="text-white text-sm font-semibold">{shippingMeta.courierName}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500 block uppercase text-[10px] tracking-widest">Tracking ID</span>
                  <CopyChip value={shippingMeta.trackingId} />
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500 block uppercase text-[10px] tracking-widest">Dispatch Date</span>
                  <p className="text-white text-sm font-semibold">
                    {new Date(shippingMeta.dispatchDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })}
                  </p>
                </div>
                {shippingMeta.internalNote && (
                  <div className="space-y-1 sm:col-span-2 pt-2 border-t border-white/5">
                    <span className="text-slate-500 block uppercase text-[10px] tracking-widest">Internal Note</span>
                    <p className="text-slate-400 italic text-xs leading-relaxed">{shippingMeta.internalNote}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  onClick={openShippingDesk}
                  variant="ghost"
                  className="border border-white/10 text-slate-300 hover:bg-white/5 rounded-xl px-4 py-2 h-10 text-xs font-bold uppercase tracking-wider w-full sm:w-auto"
                >
                  Update Tracking
                </Button>
                {hasDirectTrackingButton() && getTrackingLink(shippingMeta.courierName, shippingMeta.trackingId) && (
                  <Button asChild className="bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 rounded-xl px-4 py-2 h-10 text-xs font-bold uppercase tracking-wider w-full sm:w-auto">
                    <a 
                      href={getTrackingLink(shippingMeta.courierName, shippingMeta.trackingId)!} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Track on Courier Site
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* SECTION 5 - Payment Details */}
      <Card className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
          <CreditCard className="h-4 w-4 text-slate-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Payment</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
          <div className="space-y-1">
            <span className="text-slate-500 block uppercase text-[10px] tracking-widest">Payment Status</span>
            <div>
              {order.status === "PAID" ? (
                <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold bg-green-500/20 text-emerald-400 border border-green-500/30">SUCCEEDED</span>
              ) : order.status === "PENDING" ? (
                <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">PENDING</span>
              ) : (
                <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold bg-red-500/20 text-rose-400 border border-red-500/30">FAILED</span>
              )}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-slate-500 block uppercase text-[10px] tracking-widest">Payment Method</span>
            <p className="text-white text-sm font-semibold flex items-center gap-1">
              Razorpay <span className="text-[9px] text-slate-500 font-normal font-mono">Gateway</span>
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-slate-500 block uppercase text-[10px] tracking-widest">Razorpay Order ID</span>
            {order.payments?.[0]?.providerOrderId ? (
              <CopyChip value={order.payments[0].providerOrderId} />
            ) : (
              <p className="text-slate-400 font-semibold">—</p>
            )}
          </div>
          <div className="space-y-1">
            <span className="text-slate-500 block uppercase text-[10px] tracking-widest">Razorpay Payment ID</span>
            {order.payments?.[0]?.providerPaymentId ? (
              <CopyChip value={order.payments[0].providerPaymentId} />
            ) : (
              <p className="text-slate-400 font-semibold">—</p>
            )}
          </div>
          <div className="space-y-1">
            <span className="text-slate-500 block uppercase text-[10px] tracking-widest">Amount Paid</span>
            <p className="text-emerald-400 text-sm font-extrabold">{formatINR(order.totalCents)}</p>
          </div>
          <div className="space-y-1">
            <span className="text-slate-500 block uppercase text-[10px] tracking-widest">Payment Date</span>
            <p className="text-white text-sm font-semibold">
              {order.payments?.[0]?.createdAt ? (
                new Date(order.payments[0].createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })
              ) : (
                formattedDate
              )}
            </p>
          </div>
        </div>

        {order.status !== "PAID" && (
          <div className="mt-4 flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-400">
            <AlertCircle className="h-4.5 w-4.5 shrink-0 text-amber-500" />
            <span>Payment not completed. Order may need manual verification.</span>
          </div>
        )}
      </Card>

      {/* TRACKING MODAL */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full md:max-w-md bg-[#0d0d14] border-t md:border border-white/10 rounded-t-2xl md:rounded-2xl p-6 space-y-4 shadow-2xl relative animate-in slide-in-from-bottom md:zoom-in duration-300 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="md:hidden w-12 h-1 bg-white/20 rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between">
              <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                <Truck className="h-5 w-5 text-amber-500" />
                <span>{hasTracking ? "Update Tracking Details" : "Add Shipment Details"}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white h-9 px-3 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold transition flex items-center justify-center"
              >
                Close
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Shipment for order <strong className="font-mono text-white">#{order.id.slice(-8)}</strong>
            </p>

            <form onSubmit={handleSaveShipping} className="space-y-4">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Courier Name *</label>
                <select
                  required
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  className="w-full bg-[#0d0d14] border border-white/10 rounded-xl px-4 h-11 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  {["Delhivery", "BlueDart", "India Post", "DTDC", "Ekart", "Xpressbees", "Other"].map((partner) => (
                    <option key={partner} value={partner}>
                      {partner}
                    </option>
                  ))}
                </select>
              </div>

              {courierName === "Other" && (
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Courier Details *</label>
                  <input
                    type="text"
                    required
                    value={customCourier}
                    onChange={(e) => setCustomCourier(e.target.value)}
                    placeholder="Enter custom courier name"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 h-11 text-sm text-white focus:outline-none focus:border-indigo-500 placeholder:text-slate-600"
                  />
                </div>
              )}

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Tracking ID *</label>
                <input
                  type="text"
                  required
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                  placeholder="e.g. DEL123456789"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 h-11 text-sm text-white focus:outline-none focus:border-indigo-500 placeholder:text-slate-600 font-mono tracking-wider"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Dispatch Date *</label>
                <input
                  type="date"
                  required
                  value={dispatchDate}
                  onChange={(e) => setDispatchDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 h-11 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Shipping Status *</label>
                <select
                  required
                  value={shippingStatus}
                  onChange={(e) => setShippingStatus(e.target.value as any)}
                  className="w-full bg-[#0d0d14] border border-white/10 rounded-xl px-4 h-11 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Internal Note (optional)</label>
                <textarea
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  placeholder="e.g. Left at reception, fragile item"
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 placeholder:text-slate-600 resize-none"
                />
              </div>

              <div className="flex flex-col md:flex-row gap-2 pt-2">
                <Button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  variant="ghost"
                  className="h-11 border border-white/10 text-slate-300 hover:bg-white/5 hover:text-white rounded-xl text-sm font-semibold w-full md:flex-1 order-2 md:order-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="h-11 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold w-full md:flex-1 flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(99,102,241,0.25)] order-1 md:order-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
