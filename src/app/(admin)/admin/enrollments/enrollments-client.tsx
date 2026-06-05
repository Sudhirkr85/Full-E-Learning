"use client";

import React, { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  GraduationCap, 
  Users, 
  IndianRupee, 
  Package, 
  Search, 
  BookOpen, 
  FileText, 
  ShoppingBag, 
  ArrowRight,
  ExternalLink,
  Truck
} from "lucide-react";
import Link from "next/link";

type User = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  firstName?: string | null;
  lastName?: string | null;
};

type Course = {
  id: string;
  title: string;
  priceCents: number;
};

type CourseProgress = {
  progressPercent: number;
};

type EnrollmentItem = {
  id: string;
  createdAt: Date;
  user: User;
  course: Course;
  progress: CourseProgress | null;
};

type Product = {
  id: string;
  title: string;
  productType: string;
  course?: Course | null;
};

type OrderItem = {
  id: string;
  productName: string;
  productType: string | null;
  product: Product | null;
};

type Payment = {
  id: string;
  status: string;
  amountCents: number;
};

type OrderItemData = {
  id: string;
  createdAt: Date;
  status: string;
  user: User | null;
  items: OrderItem[];
  payments: Payment[];
  metadata?: any;
};

type EnrollmentsClientProps = {
  enrollments: EnrollmentItem[];
  orders: OrderItemData[];
  metrics: {
    totalEnrollments: number;
    activeLearners: number;
    storeRevenue: number;
    courseRevenue: number;
    totalRevenue: number;
    pendingDispatch: number;
  };
};

export function EnrollmentsClient({ enrollments, orders, metrics }: EnrollmentsClientProps) {
  const [activeTab, setActiveTab] = useState<"enrollments" | "orders">("enrollments");
  const [search, setSearch] = useState("");
  const [enrollmentFilter, setEnrollmentFilter] = useState("all"); // all, active, completed
  const [orderFilter, setOrderFilter] = useState("all"); // all, succeeded, pending, failed
  
  // Shipping Desk Modal States and Handlers removed (moved to dedicated /admin/store/orders page)

  // Formats paise (from Razorpay) to INR Rupees representation
  const formatINR = (paise: number) => {
    return "₹" + (paise / 100).toLocaleString("en-IN");
  };

  // Helper to hash initials to colors
  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-indigo-600/20 text-indigo-300 border-indigo-500/30",
      "bg-cyan-600/20 text-cyan-300 border-cyan-500/30",
      "bg-emerald-600/20 text-emerald-300 border-cyan-500/30",
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

  // Filter & Search Enrollments
  const filteredEnrollments = useMemo(() => {
    return enrollments.filter((e) => {
      const name = (e.user.name || "").toLowerCase();
      const email = e.user.email.toLowerCase();
      const query = search.toLowerCase();
      const matchesSearch = name.includes(query) || email.includes(query);

      const progress = e.progress?.progressPercent ?? 0;
      if (enrollmentFilter === "completed") {
        return matchesSearch && progress === 100;
      }
      if (enrollmentFilter === "active") {
        return matchesSearch && progress < 100;
      }
      return matchesSearch;
    });
  }, [enrollments, search, enrollmentFilter]);
  // Filter & Search Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const userObj = o.user;
      const name = (userObj?.name || "").toLowerCase();
      const email = (userObj?.email || "").toLowerCase();
      const query = search.toLowerCase();
      const matchesSearch = name.includes(query) || email.includes(query);

      const paymentStatus = o.payments[0]?.status || "PENDING";
      const isSucceeded = paymentStatus === "SUCCEEDED" || paymentStatus === "COMPLETED" || o.status === "PAID";
      const isFailed = paymentStatus === "FAILED" || o.status === "CANCELLED";
      const isPending = !isSucceeded && !isFailed;

      if (orderFilter === "succeeded") {
        return matchesSearch && isSucceeded;
      }
      if (orderFilter === "pending") {
        return matchesSearch && isPending;
      }
      if (orderFilter === "failed") {
        return matchesSearch && isFailed;
      }
      // "all" tab should show all orders
      return matchesSearch;
    });
  }, [orders, search, orderFilter]);

  const getProductIcon = (type: string | null) => {
    if (!type) return <BookOpen className="h-3.5 w-3.5" />;
    const t = type.toUpperCase();
    if (t.includes("PDF") || t.includes("DIGITAL")) return <FileText className="h-3.5 w-3.5 text-indigo-400" />;
    if (t.includes("PHYSICAL")) return <Package className="h-3.5 w-3.5 text-cyan-400" />;
    return <BookOpen className="h-3.5 w-3.5 text-emerald-400" />;
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "SUCCEEDED":
        return <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-bold text-[10px]">SUCCEEDED</Badge>;
      case "PENDING":
        return <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 font-bold text-[10px]">PENDING</Badge>;
      case "FAILED":
        return <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/30 font-bold text-[10px]">FAILED</Badge>;
      case "REFUNDED":
        return <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 font-bold text-[10px]">REFUNDED</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px]">{status}</Badge>;
    }
  };

  const daysSince = (date: Date) => {
    const diffTime = Math.abs(new Date().getTime() - new Date(date).getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Readable labels for product types
  const typeLabel: Record<string, string> = {
    COURSE_ACCESS: "Course access",
    DIGITAL_RESOURCE: "PDF / Digital",
    BUNDLE: "Bundle",
    MEMBERSHIP: "Membership",
    PHYSICAL: "Physical product",
  };

  return (
    <div className="space-y-6">
      {/* 4 Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1 */}
        <Card className="bg-[#090d20]/60 border-white/5 backdrop-blur-xl p-5 shadow-[0_15px_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            Total Enrollments
            <GraduationCap className="h-4.5 w-4.5 text-indigo-400" />
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{metrics.totalEnrollments}</p>
          <p className="text-[10px] text-slate-500 mt-1">Platform-wide course purchases</p>
        </Card>

        {/* Metric 2 */}
        <Card className="bg-[#090d20]/60 border-white/5 backdrop-blur-xl p-5 shadow-[0_15px_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            Active Learners
            <Users className="h-4.5 w-4.5 text-cyan-400" />
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{metrics.activeLearners}</p>
          <p className="text-[10px] text-slate-500 mt-1">Unique enrolled student accounts</p>
        </Card>

        {/* Metric 3 */}
        <Card className="bg-[#090d20]/60 border-white/5 backdrop-blur-xl p-5 shadow-[0_15px_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            Total Platform Revenue
            <IndianRupee className="h-4.5 w-4.5 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{formatINR(metrics.totalRevenue)}</p>
          <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-400 font-medium">
            <span>Store: {formatINR(metrics.storeRevenue)}</span>
            <span className="text-slate-600">•</span>
            <span>Courses: {formatINR(metrics.courseRevenue)}</span>
          </div>
        </Card>

        {/* Metric 4 */}
        <Card className="bg-[#090d20]/60 border-white/5 backdrop-blur-xl p-5 shadow-[0_15px_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            Pending Dispatch
            <Package className="h-4.5 w-4.5 text-purple-400" />
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{metrics.pendingDispatch}</p>
          <p className="text-[10px] text-slate-500 mt-1">Physical items awaiting tracking</p>
        </Card>
      </div>

      {/* Tabs Layout */}
      <div className="w-full space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#090d20]/40 border border-white/5 rounded-2xl p-4">
          {/* Custom Tabs */}
          <div className="flex bg-slate-950/60 border border-white/5 rounded-xl p-1 shrink-0">
            <button
              onClick={() => { setSearch(""); setActiveTab("enrollments"); }}
              className={`rounded-lg text-xs font-bold px-4 py-2 uppercase tracking-wider transition ${
                activeTab === "enrollments"
                  ? "bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Enrollments
            </button>
            <button
              onClick={() => { setSearch(""); setActiveTab("orders"); }}
              className={`rounded-lg text-xs font-bold px-4 py-2 uppercase tracking-wider transition ${
                activeTab === "orders"
                  ? "bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Store Orders
            </button>
          </div>

          {/* Search bar */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student name or email..."
              className="pl-10 rounded-xl bg-slate-950/60 border-white/5 text-white placeholder-slate-600 focus-visible:ring-1 focus-visible:ring-indigo-500/40"
            />
          </div>
        </div>

        {/* Content Tab 1: Enrollments */}
        {activeTab === "enrollments" && (
          <div className="space-y-4">
            {/* Enrollment Filter Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 px-1">Filter status:</span>
              {[
                { label: "All Enrollments", val: "all" },
                { label: "Active", val: "active" },
                { label: "Completed", val: "completed" }
              ].map((pill) => (
                <button
                  key={pill.val}
                  onClick={() => setEnrollmentFilter(pill.val)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition ${
                    enrollmentFilter === pill.val
                      ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                      : "bg-transparent text-slate-400 border-white/5 hover:border-white/10 hover:text-white"
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-white/5 bg-[#090d20]/30 shadow-[0_15px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01] text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-4">Student</th>
                    <th className="p-4">Course</th>
                    <th className="p-4">Mobile</th>
                    <th className="p-4">Progress</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Enrolled On</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300 font-medium">
                  {filteredEnrollments.length > 0 ? (
                    filteredEnrollments.map((e) => {
                      const progress = e.progress?.progressPercent ?? 0;
                      const isCompleted = progress === 100;
                      const isNew = daysSince(e.createdAt) < 7;
                      const studentName = e.user.name || `${e.user.firstName || ""} ${e.user.lastName || ""}`.trim() || "Student";
                      return (
                        <tr key={e.id} className="hover:bg-white/[0.01] transition-colors duration-150">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className={`h-8 w-8 rounded-xl border flex items-center justify-center font-bold text-xs shrink-0 ${getAvatarColor(studentName || e.user.email)}`}>
                                {getInitials(studentName, e.user.email)}
                              </div>
                              <div>
                                <p className="font-semibold text-white">{studentName}</p>
                                <p className="text-[10px] text-slate-500 mt-0.5">{e.user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 font-semibold text-slate-200">{e.course.title}</td>
                          <td className="p-4 text-slate-400">{e.user.phone || <span className="text-slate-600 italic">Not set</span>}</td>
                          <td className="p-4 w-40">
                            {progress === 0 && isNew ? (
                              <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/20 font-bold text-[9px] uppercase tracking-widest">Not started</Badge>
                            ) : (
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-[10px] text-slate-400 font-extrabold">
                                  <span>{progress}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5">
                                  <div 
                                    className={`h-full rounded-full transition-all duration-300 ${isCompleted ? "bg-purple-500" : "bg-emerald-500"}`} 
                                    style={{ width: `${progress}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </td>
                          <td className="p-4">
                            {isCompleted ? (
                              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 font-bold text-[9px] uppercase tracking-widest">Completed</Badge>
                            ) : (
                              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-bold text-[9px] uppercase tracking-widest">Active</Badge>
                            )}
                          </td>
                          <td className="p-4 text-slate-400">
                            {new Date(e.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric"
                            })}
                          </td>
                          <td className="p-4 text-center">
                            <Link href={`/admin/courses/${e.course.id}`}>
                              <Button size="sm" variant="outline" className="h-8 rounded-lg text-[10px] font-bold border-indigo-500/20 text-indigo-400 hover:text-white bg-indigo-500/5 hover:bg-indigo-500/10 uppercase tracking-wider gap-1">
                                View
                                <ArrowRight className="h-3 w-3" />
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500 italic">
                        No enrollments found matching parameters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Content Tab 2: Orders */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {/* Info Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3.5 text-xs text-indigo-300">
              <div className="flex items-center gap-2">
                <Truck className="h-4.5 w-4.5 text-indigo-400 shrink-0" />
                <span>
                  Physical order shipping is now managed in the dedicated <strong>Store Orders</strong> desk.
                </span>
              </div>
              <Link 
                href="/admin/store/orders"
                className="font-bold underline hover:text-indigo-200 transition shrink-0 flex items-center gap-0.5"
              >
                Go to Store Orders →
              </Link>
            </div>
            {/* Order Filter Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 px-1">Filter payment:</span>
              {[
                { label: "All Orders", val: "all" },
                { label: "Paid", val: "succeeded" },
                { label: "Pending", val: "pending" },
                { label: "Failed", val: "failed" }
              ].map((pill) => (
                <button
                  key={pill.val}
                  onClick={() => setOrderFilter(pill.val)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition ${
                    orderFilter === pill.val
                      ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                      : "bg-transparent text-slate-400 border-white/5 hover:border-white/10 hover:text-white"
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-white/5 bg-[#090d20]/30 shadow-[0_15px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01] text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-4">Student</th>
                    <th className="p-4">Product</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Payment Status</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300 font-medium">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((o) => {
                      const productItem = o.items[0];
                      const amountPaid = o.payments[0]?.amountCents ?? 0;
                      const rawPaymentStatus = o.payments[0]?.status ?? "PENDING";
                      const status = o.status === "CANCELLED" ? "FAILED" : (o.status === "PAID" ? "SUCCEEDED" : rawPaymentStatus);
                      const productLabel = productItem?.product?.title ?? productItem?.product?.course?.title ?? productItem?.productName ?? "Unknown";
                      const rawType = productItem?.productType ?? "COURSE_ACCESS";
                      const typeBadgeLabel = typeLabel[rawType] ?? rawType;
                      const studentName = o.user?.name || `${o.user?.firstName || ""} ${o.user?.lastName || ""}`.trim() || "Student";
                      return (
                        <tr key={o.id} className="hover:bg-white/[0.01] transition-colors duration-150">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className={`h-8 w-8 rounded-xl border flex items-center justify-center font-bold text-xs shrink-0 ${getAvatarColor(studentName || o.user?.email || "Student")}`}>
                                {getInitials(studentName, o.user?.email || "Student")}
                              </div>
                              <div>
                                <p className="font-semibold text-white">{studentName}</p>
                                <p className="text-[10px] text-slate-500 mt-0.5">{o.user?.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {getProductIcon(productItem?.productType)}
                              <span className="font-semibold text-slate-200">
                                {productLabel}
                                {o.items.length > 1 && ` + ${o.items.length - 1} more`}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline" className="border-white/5 bg-white/[0.02] text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                                {typeBadgeLabel}
                            </Badge>
                          </td>
                          <td className="p-4 font-extrabold text-emerald-400">
                            {formatINR(amountPaid)}
                          </td>
                          <td className="p-4">{getPaymentBadge(status)}</td>
                          <td className="p-4 text-slate-400">
                            {new Date(o.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric"
                            })}
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {rawType === "PHYSICAL" && status === "SUCCEEDED" && (
                                <Link href="/admin/store/orders">
                                  <Button
                                    size="sm"
                                    className="h-8 rounded-lg text-[10px] font-bold border-amber-500/20 text-amber-400 hover:text-white bg-amber-500/5 hover:bg-amber-500/10 uppercase tracking-wider gap-1"
                                  >
                                    <Truck className="h-3.5 w-3.5" />
                                    Manage Shipping
                                  </Button>
                                </Link>
                              )}
                              <Link href={`/student/orders/${o.id}`}>
                                <Button size="sm" variant="outline" className="h-8 rounded-lg text-[10px] font-bold border-cyan-500/20 text-cyan-400 hover:text-white bg-cyan-500/5 hover:bg-cyan-500/10 uppercase tracking-wider gap-1">
                                  Details
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500 italic">
                        {orders.length === 0
                          ? "No store orders yet. PDF books and physical products purchased by students will appear here."
                          : "No orders found matching parameters."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal removed (moved to dedicated /admin/store/orders shipping desk) */}
    </div>
  );
}
