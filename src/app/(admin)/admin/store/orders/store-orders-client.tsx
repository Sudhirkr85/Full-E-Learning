"use client";

import React, { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  ShoppingCart, 
  Search, 
  BookOpen, 
  Package, 
  ExternalLink,
  Copy,
  Check,
  X,
  Truck,
  Loader2,
  Calendar,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

type User = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
};

type Product = {
  id: string;
  title: string;
  productType: string;
};

type OrderItem = {
  id: string;
  productName: string;
  productType: string | null;
  product: Product | null;
};

type OrderData = {
  id: string;
  orderNumber: string;
  billingEmail: string;
  status: string;
  totalCents: number;
  metadata?: any;
  createdAt: Date;
  items: OrderItem[];
  user: User | null;
};

type StoreOrdersClientProps = {
  initialOrders: any[];
};

export function StoreOrdersClient({ initialOrders }: StoreOrdersClientProps) {
  const [orders, setOrders] = useState<OrderData[]>(initialOrders);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<"All" | "Processing" | "Shipped" | "Delivered" | "PDF Orders" | "Cancelled">("All");

  // Tracking Modal/Bottom Sheet States
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [courierName, setCourierName] = useState("");
  const [customCourier, setCustomCourier] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [dispatchDate, setDispatchDate] = useState("");
  const [shippingStatus, setShippingStatus] = useState<"PROCESSING" | "SHIPPED" | "DELIVERED">("SHIPPED");
  const [internalNote, setInternalNote] = useState("");
  const [saving, setSaving] = useState(false);

  // Copy Clipboard State Tracker
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 300ms Debounce Search effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Sync initialOrders from prop
  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  const handleCopyId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success("Order ID copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Open Modal shipping parameters
  const openShippingDesk = (order: OrderData) => {
    const meta = order.metadata || {};
    const hasTracking = !!meta.trackingId;
    
    setCourierName(meta.courierName || "Delhivery");
    setCustomCourier(meta.courierName && !["Delhivery", "BlueDart", "India Post", "DTDC", "Ekart", "Xpressbees"].includes(meta.courierName) ? meta.courierName : "");
    setTrackingId(meta.trackingId || "");
    setDispatchDate(meta.dispatchDate || new Date().toISOString().split("T")[0]);
    setShippingStatus(meta.shippingStatus || (hasTracking ? "SHIPPED" : "SHIPPED"));
    setInternalNote(meta.internalNote || "");
    setSelectedOrder(order);
  };

  const handleSaveShipping = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    const finalCourier = courierName === "Other" ? customCourier : courierName;
    if (!finalCourier.trim()) {
      toast.error("Please enter or select a courier name.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}/shipping`, {
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
        // Optimistic State Update
        const updated = orders.map(o => {
          if (o.id === selectedOrder.id) {
            return {
              ...o,
              metadata: {
                ...(o.metadata || {}),
                courierName: finalCourier,
                trackingId: trackingId.toUpperCase(),
                dispatchDate,
                shippingStatus,
                internalNote
              }
            };
          }
          return o;
        });
        setOrders(updated);
        toast.success("Tracking updated. Student notified by email.");
        setSelectedOrder(null);
      } else {
        const errData = await res.json();
        toast.error(errData.error || "Failed to update tracking. Please try again.");
      }
    } catch {
      toast.error("Failed to update tracking. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Helper formats
  const formatINR = (paise: number) => {
    return "Rs. " + new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0
    }).format(paise / 100);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-indigo-600/20 text-indigo-300 border-indigo-500/30",
      "bg-cyan-600/20 text-cyan-300 border-cyan-500/30",
      "bg-emerald-600/20 text-emerald-300 border-emerald-500/30",
      "bg-purple-600/20 text-purple-300 border-purple-500/30",
      "bg-pink-600/20 text-pink-300 border-pink-500/30",
    ];
    let hash = 0;
    const str = name || "Student";
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const getInitials = (name: string | null, email: string) => {
    const displayName = name || email;
    const parts = displayName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  // Statistics Calculations
  const metrics = useMemo(() => {
    const totalCount = orders.length;
    
    const processingCount = orders.filter(o => {
      const isPhys = o.items.some(item => item.productType === "PHYSICAL");
      const shipStatus = (o.metadata || {}).shippingStatus || (isPhys ? "PROCESSING" : "");
      return isPhys && shipStatus === "PROCESSING";
    }).length;

    const shippedCount = orders.filter(o => {
      const shipStatus = (o.metadata || {}).shippingStatus;
      return shipStatus === "SHIPPED";
    }).length;

    const totalRev = orders
      .filter(o => o.status === "PAID")
      .reduce((sum, o) => sum + o.totalCents, 0);

    return {
      totalCount,
      processingCount,
      shippedCount,
      totalRev
    };
  }, [orders]);

  // Main filter and search combination
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const isPhys = order.items.some(item => item.productType === "PHYSICAL");
      const shipStatus = (order.metadata || {}).shippingStatus || (isPhys ? "PROCESSING" : "");
      const isDigital = order.items.some(item => item.productType === "DIGITAL_RESOURCE");

      // Category Pill Filters
      if (activeFilter === "Processing" && (!isPhys || shipStatus !== "PROCESSING")) return false;
      if (activeFilter === "Shipped" && shipStatus !== "SHIPPED") return false;
      if (activeFilter === "Delivered" && shipStatus !== "DELIVERED") return false;
      if (activeFilter === "PDF Orders" && !isDigital) return false;
      if (activeFilter === "Cancelled" && order.status !== "CANCELLED") return false;

      // Debounced search queries
      if (debouncedSearch) {
        const query = debouncedSearch.toLowerCase();
        const userName = (order.user?.name || "").toLowerCase();
        const userEmail = (order.user?.email || "").toLowerCase();
        const orderIdLast8 = order.id.slice(-8).toLowerCase();
        const orderNumberLast8 = (order.orderNumber || "").slice(-8).toLowerCase();
        const matchesProduct = order.items.some(item => item.productName.toLowerCase().includes(query));

        const matches = 
          userName.includes(query) ||
          userEmail.includes(query) ||
          orderIdLast8.includes(query) ||
          orderNumberLast8.includes(query) ||
          matchesProduct;

        if (!matches) return false;
      }

      return true;
    });
  }, [orders, activeFilter, debouncedSearch]);

  const getProductIcon = (type: string | null) => {
    const t = (type || "").toUpperCase();
    if (t.includes("PDF") || t.includes("DIGITAL")) {
      return <BookOpen className="h-4 w-4 text-indigo-400 shrink-0" />;
    }
    return <Package className="h-4 w-4 text-cyan-400 shrink-0" />;
  };

  const getStatusBadge = (order: OrderData) => {
    const isPhys = order.items.some(item => item.productType === "PHYSICAL");
    const shipStatus = (order.metadata || {}).shippingStatus || (isPhys ? "PROCESSING" : "PAID");
    
    if (order.status === "CANCELLED") {
      return <span className="rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">CANCELLED</span>;
    }

    if (!isPhys) {
      return <span className="rounded-full px-2.5 py-0.5 text-xs font-medium bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">PAID (PDF)</span>;
    }

    switch (shipStatus) {
      case "PROCESSING":
        return <span className="rounded-full px-2.5 py-0.5 text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30">PROCESSING</span>;
      case "SHIPPED":
        return <span className="rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">SHIPPED</span>;
      case "DELIVERED":
        return <span className="rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">DELIVERED</span>;
      default:
        return <span className="rounded-full px-2.5 py-0.5 text-xs font-medium bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">PAID</span>;
    }
  };

  return (
    <div className="space-y-6 select-none overflow-x-hidden">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-white">Physical Orders & Shipping Desk</h1>
        <p className="text-sm text-slate-400">Dispatch physical products, manage shipment tracking, and confirm courier drop-offs.</p>
      </div>

      {/* STEP 2 - Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: "Total Orders", val: metrics.totalCount, sub: "All store orders" },
          { label: "Processing", val: metrics.processingCount, sub: "Pending dispatch" },
          { label: "Shipped", val: metrics.shippedCount, sub: "Courier in transit" },
          { label: "Total Revenue", val: formatINR(metrics.totalRev), sub: "Paid store amount" }
        ].map((item, idx) => (
          <Card key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4 shadow-lg backdrop-blur-md flex flex-col justify-between">
            <div>
              <p className="text-2xl md:text-3xl font-bold text-white tracking-tight">{item.val}</p>
              <p className="text-xs text-slate-400 font-medium mt-1">{item.label}</p>
            </div>
            <span className="text-[10px] text-slate-500 mt-2 block">{item.sub}</span>
          </Card>
        ))}
      </div>

      {/* STEP 3 - Search & Filter Bar */}
      <div className="space-y-4 bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student, email, order ID, product..."
              className="bg-white/5 border-white/10 text-white placeholder-slate-500 focus-visible:ring-indigo-500 h-11 pl-10 pr-10 text-sm rounded-xl w-full"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter Pills scroll area */}
          <div className="overflow-x-auto scrollbar-none flex gap-2 py-1 shrink-0 -mx-4 px-4 md:mx-0 md:px-0">
            {(["All", "Processing", "Shipped", "Delivered", "PDF Orders", "Cancelled"] as const).map((filter) => {
              const active = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition h-[34px] min-h-[34px] flex items-center justify-center ${
                    active
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-white/5 border border-white/10 text-slate-300 hover:text-white"
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        <p className="text-xs text-slate-400 font-medium">
          Showing {filteredOrders.length} of {orders.length} orders
        </p>
      </div>

      {/* STEP 4 - Orders List */}
      {filteredOrders.length === 0 ? (
        // STEP 10 - Empty States
        <Card className="bg-white/5 border border-white/10 py-16 text-center rounded-xl backdrop-blur-md">
          <div className="flex flex-col items-center justify-center space-y-4 max-w-sm mx-auto px-4">
            {orders.length === 0 ? (
              <>
                <div className="h-12 w-12 rounded-full bg-slate-900 border border-white/5 text-slate-600 flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-white text-base font-semibold">No store orders yet</h3>
                  <p className="text-xs text-slate-500">
                    PDF books and physical products purchased by students will appear here.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="h-12 w-12 rounded-full bg-slate-900 border border-white/5 text-slate-600 flex items-center justify-center">
                  <Search className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-white text-base font-semibold">No orders match your search</h3>
                  <p className="text-xs text-slate-500">
                    Try a different name, order ID, or clear the filters.
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setSearch("");
                    setActiveFilter("All");
                  }}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg h-9 px-4 uppercase tracking-wider"
                >
                  Clear filters
                </Button>
              </>
            )}
          </div>
        </Card>
      ) : (
        <>
          {/* FIX 2 — Desktop view (md+) - Scrollable Independent Table Container */}
          <div className="hidden md:block w-full overflow-x-auto rounded-xl border border-white/10 bg-white/5 backdrop-blur-md table-scroll">
            <table className="w-full text-left border-collapse table-fixed min-w-[950px]">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="p-4 w-[100px]">Order ID</th>
                  <th className="p-4 w-[200px]">Student</th>
                  <th className="p-4 w-[160px]">Products</th>
                  <th className="p-4 w-[90px]">Amount</th>
                  <th className="p-4 w-[120px]">Status</th>
                  <th className="p-4 w-[240px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-xs text-slate-300 font-medium">
                {filteredOrders.map((order) => {
                  const isPhys = order.items.some(item => item.productType === "PHYSICAL");
                  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                  });

                  return (
                    <tr key={order.id} className="hover:bg-white/[0.01] transition-colors duration-150">
                      <td className="p-4">
                        <button
                          onClick={(e) => handleCopyId(order.id, e)}
                          className="font-mono text-slate-400 hover:text-white transition flex items-center gap-1 text-[11px]"
                          title="Click to copy Order ID"
                        >
                          <span>{order.id.slice(-8)}</span>
                          {copiedId === order.id ? (
                            <Check className="h-3 w-3 text-emerald-400" />
                          ) : (
                            <Copy className="h-3 w-3 opacity-40 hover:opacity-100" />
                          )}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-full border flex items-center justify-center font-bold text-[11px] shrink-0 ${getAvatarColor(order.user?.name || order.user?.email || "Student")}`}>
                            {getInitials(order.user?.name || null, order.user?.email || "Student")}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-white truncate">{order.user?.name || "Student"}</p>
                            <p className="text-[10px] text-slate-500 truncate mt-0.5">{order.user?.email}</p>
                            {/* Merge date into second line of student cell */}
                            <p className="text-[10px] text-slate-500 mt-1 font-semibold">{formattedDate}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-1.5 min-w-0">
                              {getProductIcon(item.productType)}
                              <span className="font-semibold text-slate-200 truncate">{item.productName}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 font-extrabold text-emerald-400">
                        {formatINR(order.totalCents)}
                      </td>
                      <td className="p-4">
                        {getStatusBadge(order)}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isPhys && order.status !== "CANCELLED" ? (
                            <Button
                              onClick={() => openShippingDesk(order)}
                              className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-[10px] font-bold uppercase tracking-wider h-8 gap-1 shadow-sm px-2.5 whitespace-nowrap"
                            >
                              <Truck className="h-3 w-3" />
                              {order.metadata?.trackingId ? "Update" : "Add Tracking"}
                            </Button>
                          ) : null}
                          {/* VIEW ORDER links to Dedicated Admin Order Detail Page */}
                          <Link 
                            href={"/admin/store/orders/" + order.id} 
                            className="text-[10px] font-bold uppercase tracking-wider h-8 px-2.5 rounded-lg border border-white/10 text-slate-300 hover:bg-white/5 whitespace-nowrap flex items-center gap-1 transition"
                          >
                            <ExternalLink className="h-3 w-3" />
                            View Order
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* FIX 4 — Mobile view (< md) - Stacked Glassmorphic Cards */}
          <div className="block md:hidden space-y-3">
            {filteredOrders.map((order) => {
              const isPhys = order.items.some(item => item.productType === "PHYSICAL");
              const formattedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric"
              });

              return (
                <div
                  key={order.id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3 shadow-md backdrop-blur-md"
                >
                  {/* Row 1: Order ID + Status Badge */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={(e) => handleCopyId(order.id, e)}
                      className="font-mono text-slate-400 hover:text-white transition flex items-center gap-1 text-[11px]"
                    >
                      <span>#{order.id.slice(-8).toUpperCase()}</span>
                      {copiedId === order.id ? (
                        <Check className="h-3 w-3 text-emerald-400" />
                      ) : (
                        <Copy className="h-3 w-3 opacity-40" />
                      )}
                    </button>
                    {getStatusBadge(order)}
                  </div>

                  {/* Row 2: Student */}
                  <div className="flex items-center gap-2.5 border-t border-white/5 pt-2">
                    <div className={`h-8 w-8 rounded-full border flex items-center justify-center font-bold text-[11px] shrink-0 ${getAvatarColor(order.user?.name || order.user?.email || "Student")}`}>
                      {getInitials(order.user?.name || null, order.user?.email || "Student")}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{order.user?.name || "Student"}</p>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{order.user?.email}</p>
                    </div>
                  </div>

                  {/* Row 3: Product + Amount */}
                  <div className="flex items-center justify-between border-t border-white/5 pt-2">
                    <div className="flex items-center gap-1.5 text-xs text-slate-300 min-w-0">
                      {getProductIcon(order.items[0]?.productType)}
                      <span className="truncate">{order.items[0]?.productName || "Product"}</span>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-400 shrink-0">
                      {formatINR(order.totalCents)}
                    </span>
                  </div>

                  {/* Row 4: Date */}
                  <p className="text-xs text-slate-500 border-t border-white/5 pt-2">
                    Ordered: {formattedDate}
                  </p>

                  {/* Row 5: Action Button - Full Width */}
                  <div className="pt-1">
                    {isPhys && order.status !== "CANCELLED" ? (
                      <Button
                        onClick={() => openShippingDesk(order)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold h-11 w-full flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(99,102,241,0.25)]"
                      >
                        <Truck className="h-4 w-4" />
                        {order.metadata?.trackingId ? "Update Tracking" : "Add Tracking"}
                      </Button>
                    ) : (
                      <Link 
                        href={"/admin/store/orders/" + order.id} 
                        className="w-full block"
                      >
                        <Button
                          variant="outline"
                          className="border-white/10 hover:bg-white/5 text-slate-400 hover:text-white rounded-xl text-xs font-semibold h-11 w-full flex items-center justify-center gap-1.5"
                        >
                          <ExternalLink className="h-4 w-4" />
                          View Order
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* STEP 5 - Add/Update Tracking Modal / Bottom Sheet */}
      {selectedOrder && mounted && createPortal(
        <div 
          className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-[#06060a]/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedOrder(null)}
        >
          {/* Faux Wrapper / Modal content */}
          <div
            className="w-full md:max-w-md bg-[#0d0d14] border-t md:border border-white/10 rounded-t-2xl md:rounded-2xl p-6 space-y-4 shadow-2xl relative animate-in slide-in-from-bottom md:zoom-in duration-300 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle bar for mobile bottom sheet */}
            <div className="md:hidden w-12 h-1 bg-white/20 rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between">
              <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                <Truck className="h-5 w-5 text-amber-500" />
                <span>{selectedOrder.metadata?.trackingId ? "Update Tracking Details" : "Add Shipment Details"}</span>
              </h3>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-white h-9 px-3 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold transition flex items-center justify-center"
              >
                Close
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Shipment for order <strong className="font-mono text-white">#{selectedOrder.id.slice(-8)}</strong>
            </p>

            <form onSubmit={handleSaveShipping} className="space-y-4">
              {/* Courier Name */}
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Courier Name *</label>
                <select
                  required
                  autoFocus
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 h-11 text-base text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40"
                >
                  {["Delhivery", "BlueDart", "India Post", "DTDC", "Ekart", "Xpressbees", "Other"].map((partner) => (
                    <option key={partner} value={partner} className="bg-[#0d0d14]">
                      {partner}
                    </option>
                  ))}
                </select>
              </div>

              {/* Free text for other */}
              {courierName === "Other" && (
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Courier Details *</label>
                  <input
                    type="text"
                    required
                    value={customCourier}
                    onChange={(e) => setCustomCourier(e.target.value)}
                    placeholder="Enter custom courier name"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 h-11 text-base text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 placeholder:text-slate-600"
                  />
                </div>
              )}

              {/* Tracking ID */}
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Tracking ID *</label>
                <input
                  type="text"
                  required
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                  placeholder="e.g. DEL123456789"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 h-11 text-base text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 placeholder:text-slate-600 font-mono tracking-wider"
                />
              </div>

              {/* Dispatch Date */}
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Dispatch Date *</label>
                <input
                  type="date"
                  required
                  value={dispatchDate}
                  onChange={(e) => setDispatchDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 h-11 text-base text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40"
                />
              </div>

              {/* Shipping Status */}
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Shipping Status *</label>
                <select
                  required
                  value={shippingStatus}
                  onChange={(e) => setShippingStatus(e.target.value as any)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 h-11 text-base text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40"
                >
                  <option value="PROCESSING" className="bg-[#0d0d14]">PROCESSING</option>
                  <option value="SHIPPED" className="bg-[#0d0d14]">SHIPPED</option>
                  <option value="DELIVERED" className="bg-[#0d0d14]">DELIVERED</option>
                </select>
              </div>

              {/* Internal Note */}
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Internal Note (optional)</label>
                <textarea
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  placeholder="e.g. Left at reception, fragile item"
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-base text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 placeholder:text-slate-600 resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-col md:flex-row gap-2 pt-2">
                <Button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  variant="ghost"
                  className="h-11 border border-white/10 text-slate-300 hover:bg-white/5 hover:text-white rounded-xl text-base font-semibold w-full md:flex-1 order-2 md:order-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="h-11 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-base font-bold w-full md:flex-1 flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(99,102,241,0.25)] order-1 md:order-2"
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
        </div>,
        document.body
      )}
    </div>
  );
}
