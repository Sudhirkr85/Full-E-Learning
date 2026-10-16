"use client";

import React, { useState, useMemo, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  FileSpreadsheet,
  Download,
  Printer,
  Search,
  Users,
  GraduationCap,
  ShoppingBag,
  IndianRupee,
  Phone,
  Share2,
  Calendar,
  CheckCircle2,
  Clock,
  Trash2,
  Filter,
  RefreshCw,
  Sparkles,
  BookOpen
} from "lucide-react";
import { adminResetTestRevenueAction } from "./actions";

export type CourseOption = {
  id: string;
  title: string;
  slug: string;
};

export type StudentReportItem = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  createdAt: string;
  coursesCount: number;
  enrolledCourseIds: string[];
};

export type EnrollmentReportItem = {
  id: string;
  courseId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string | null;
  courseTitle: string;
  paymentStatus: string;
  amountPaid: number;
  validity: string;
  progressPercent: number;
  enrolledAt: string;
  expiresAt: string | null;
};

export type OrderReportItem = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  itemTitle: string;
  productType: string;
  amount: number;
  status: string;
  placedAt: string;
};

interface ReportsClientProps {
  students: StudentReportItem[];
  enrollments: EnrollmentReportItem[];
  orders: OrderReportItem[];
  courses: CourseOption[];
  totalRevenueRupees: number;
}

export function ReportsClient({
  students,
  enrollments,
  orders,
  courses,
  totalRevenueRupees
}: ReportsClientProps) {
  const [activeTab, setActiveTab] = useState<"enrollments" | "students" | "orders">("enrollments");
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState<"ALL" | "TODAY" | "7DAYS" | "30DAYS" | "MONTH">("ALL");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("ALL");
  const [isResetting, startResetTransition] = useTransition();
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  // Date filtering logic
  const filterByDate = (dateStr: string) => {
    if (dateFilter === "ALL") return true;
    const itemDate = new Date(dateStr).getTime();
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    if (dateFilter === "TODAY") {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      return itemDate >= todayStart.getTime();
    }
    if (dateFilter === "7DAYS") {
      return itemDate >= now - 7 * oneDay;
    }
    if (dateFilter === "30DAYS") {
      return itemDate >= now - 30 * oneDay;
    }
    if (dateFilter === "MONTH") {
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime();
      return itemDate >= startOfMonth;
    }
    return true;
  };

  // Filtered Students
  const filteredStudents = useMemo(() => {
    const q = search.toLowerCase().trim();
    return students.filter((s) => {
      const matchesDate = filterByDate(s.createdAt);
      if (!matchesDate) return false;
      if (selectedCourseId !== "ALL" && !s.enrolledCourseIds.includes(selectedCourseId)) {
        return false;
      }
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        (s.phone && s.phone.includes(q))
      );
    });
  }, [students, search, dateFilter, selectedCourseId]);

  // Filtered Enrollments
  const filteredEnrollments = useMemo(() => {
    const q = search.toLowerCase().trim();
    return enrollments.filter((e) => {
      const matchesDate = filterByDate(e.enrolledAt);
      if (!matchesDate) return false;
      if (selectedCourseId !== "ALL" && e.courseId !== selectedCourseId) {
        return false;
      }
      if (!q) return true;
      return (
        e.studentName.toLowerCase().includes(q) ||
        e.studentEmail.toLowerCase().includes(q) ||
        (e.studentPhone && e.studentPhone.includes(q)) ||
        e.courseTitle.toLowerCase().includes(q) ||
        e.paymentStatus.toLowerCase().includes(q)
      );
    });
  }, [enrollments, search, dateFilter, selectedCourseId]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    const q = search.toLowerCase().trim();
    return orders.filter((o) => {
      const matchesDate = filterByDate(o.placedAt);
      if (!matchesDate) return false;
      if (!q) return true;
      return (
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        (o.customerPhone && o.customerPhone.includes(q)) ||
        o.itemTitle.toLowerCase().includes(q) ||
        o.orderNumber.toLowerCase().includes(q) ||
        o.status.toLowerCase().includes(q)
      );
    });
  }, [orders, search, dateFilter]);

  // CSV Generator Helper (with UTF-8 BOM so Excel opens Hindi properly)
  const downloadCSV = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const escapeCell = (val: string | number | null | undefined) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const csvContent =
      "\uFEFF" +
      headers.map(escapeCell).join(",") +
      "\n" +
      rows.map((row) => row.map(escapeCell).join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Export Handlers
  const handleExportStudents = () => {
    const headers = [
      "Student Name",
      "Mobile Number",
      "Email Address",
      "Role",
      "Total Courses",
      "Registration Date"
    ];
    const rows = filteredStudents.map((s) => [
      s.name,
      s.phone || "Not Provided",
      s.email,
      s.role,
      s.coursesCount,
      new Date(s.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      })
    ]);
    const selectedCourse = courses.find((c) => c.id === selectedCourseId);
    const filename = selectedCourse
      ? `students_${selectedCourse.slug || "course"}`
      : "students_directory_report";
    downloadCSV(filename, headers, rows);
  };

  const handleExportEnrollments = () => {
    const headers = [
      "Student Name",
      "Mobile Number",
      "Email Address",
      "Course Title",
      "Payment Mode",
      "Amount Paid (INR)",
      "Validity Plan",
      "Progress (%)",
      "Admission Date",
      "Expires On"
    ];
    const rows = filteredEnrollments.map((e) => [
      e.studentName,
      e.studentPhone || "Not Provided",
      e.studentEmail,
      e.courseTitle,
      e.paymentStatus,
      e.amountPaid,
      e.validity,
      `${e.progressPercent}%`,
      new Date(e.enrolledAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }),
      e.expiresAt
        ? new Date(e.expiresAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
          })
        : "Lifetime Access"
    ]);
    const selectedCourse = courses.find((c) => c.id === selectedCourseId);
    const filename = selectedCourse
      ? `enrollments_${selectedCourse.slug || "course"}`
      : "course_admissions_report";
    downloadCSV(filename, headers, rows);
  };

  const handleExportOrders = () => {
    const headers = [
      "Order Number",
      "Customer Name",
      "Mobile Number",
      "Email Address",
      "Item Purchased",
      "Item Type",
      "Amount (INR)",
      "Payment Status",
      "Order Date"
    ];
    const rows = filteredOrders.map((o) => [
      o.orderNumber,
      o.customerName,
      o.customerPhone || "Not Provided",
      o.customerEmail,
      o.itemTitle,
      o.productType,
      o.amount,
      o.status,
      new Date(o.placedAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      })
    ]);
    downloadCSV("orders_and_revenue_report", headers, rows);
  };

  // Master All-in-One Export
  const handleExportMaster = () => {
    handleExportEnrollments();
    setTimeout(() => handleExportStudents(), 500);
    setTimeout(() => handleExportOrders(), 1000);
  };

  // Reset Test Revenue Handler
  const handleResetTestRevenue = () => {
    if (
      !confirm(
        "क्या आप जून 2026 के पुराने टेस्ट ट्रांजेक्शन (₹1,609) को रीसेट करना चाहते हैं?\n\nइससे केवल टेस्ट/डेमो पेमेंट्स हटेंगे और असली छात्रों का डेटा सुरक्षित रहेगा।"
      )
    ) {
      return;
    }

    startResetTransition(async () => {
      const res = await adminResetTestRevenueAction();
      if (res.success) {
        setResetMessage("पुराना टेस्ट रेवेन्यू सफलतापूर्वक ₹0 रीसेट कर दिया गया!");
        setTimeout(() => setResetMessage(null), 5000);
      } else {
        alert(res.error || "Reset failed");
      }
    });
  };

  return (
    <div className="space-y-6 print:space-y-4 print:text-black">
      {/* Header with Title & Quick Export Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-300 border-indigo-500/20">
            Official Platform Reports
          </Badge>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-white print:text-black">
            Reports & Data Export
          </h1>
          <p className="mt-1 text-sm text-slate-400 print:text-slate-600">
            छात्र सूची, कोर्स एडमिशन, वैधता और वित्तीय विवरणों को एक्सेल (CSV) या PDF में डाउनलोड करें।
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap print:hidden">
          <Button
            onClick={() => window.print()}
            variant="outline"
            className="h-9 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-bold gap-1.5"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print / PDF</span>
          </Button>

          <Button
            onClick={handleExportMaster}
            className="h-9 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download All Reports (CSV)</span>
          </Button>
        </div>
      </div>

      {/* Reset Alert notification */}
      {resetMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>{resetMessage}</span>
          </div>
        </div>
      )}

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#090d20]/60 border-white/5 backdrop-blur-xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Students</p>
              <h3 className="text-2xl font-black text-white mt-1">{students.length}</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">पंजीकृत छात्र</p>
            </div>
            <div className="h-10 w-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#090d20]/60 border-white/5 backdrop-blur-xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Admissions</p>
              <h3 className="text-2xl font-black text-white mt-1">{enrollments.length}</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">कोर्स एनरोलमेंट्स</p>
            </div>
            <div className="h-10 w-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <GraduationCap className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#090d20]/60 border-white/5 backdrop-blur-xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Store Orders</p>
              <h3 className="text-2xl font-black text-white mt-1">{orders.length}</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">किताबें और नोट्स ऑर्डर्स</p>
            </div>
            <div className="h-10 w-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#090d20]/60 border-white/5 backdrop-blur-xl relative overflow-hidden">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Recorded Revenue</p>
              <h3 className="text-2xl font-black text-emerald-400 mt-1">
                ₹{totalRevenueRupees.toLocaleString("en-IN")}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <p className="text-[10px] text-slate-500">कुल दर्ज शुल्क</p>
                {totalRevenueRupees > 0 && (
                  <button
                    onClick={handleResetTestRevenue}
                    disabled={isResetting}
                    className="text-[9px] text-rose-400 hover:text-rose-300 underline font-semibold flex items-center gap-0.5"
                    title="यदि यह पुराना टेस्ट रेवेन्यू है, तो इसे ₹0 रीसेट करें"
                  >
                    <Trash2 className="h-2.5 w-2.5" />
                    <span>Reset Test</span>
                  </button>
                )}
              </div>
            </div>
            <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <IndianRupee className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls Bar: Search, Date Filter & Tab Switcher */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-[#090d20]/80 p-3 rounded-2xl border border-white/5 print:hidden">
        {/* Tab Selectors */}
        <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/5">
          <button
            onClick={() => setActiveTab("enrollments")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === "enrollments"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <GraduationCap className="h-3.5 w-3.5" />
            <span>Course Admissions ({filteredEnrollments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("students")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === "students"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>Students Directory ({filteredStudents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === "orders"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Orders & Revenue ({filteredOrders.length})</span>
          </button>
        </div>

        {/* Date Filter Pills & Search */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5 text-[11px] font-semibold text-slate-400">
            <span className="px-2 text-[10px] uppercase font-bold text-slate-500">Date:</span>
            {[
              { label: "All Time", val: "ALL" },
              { label: "Today", val: "TODAY" },
              { label: "7 Days", val: "7DAYS" },
              { label: "30 Days", val: "30DAYS" },
              { label: "This Month", val: "MONTH" }
            ].map((p) => (
              <button
                key={p.val}
                onClick={() => setDateFilter(p.val as any)}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase transition ${
                  dateFilter === p.val
                    ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-black"
                    : "hover:text-white"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Course-wise Filter Selector */}
          {courses && courses.length > 0 && (
            <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-xl border border-white/5">
              <BookOpen className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="h-6 bg-transparent text-[11px] font-semibold text-slate-200 focus:outline-none cursor-pointer max-w-[200px] truncate"
              >
                <option value="ALL" className="bg-slate-900 text-white">
                  All Courses (सभी कोर्स)
                </option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="relative min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone, email..."
              className="h-8 pl-8 text-xs bg-black/30 border-white/10 text-white rounded-xl placeholder:text-slate-500"
            />
          </div>

          {/* Current Tab CSV Download Button */}
          {activeTab === "enrollments" && (
            <Button
              onClick={handleExportEnrollments}
              size="sm"
              className="h-8 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold gap-1 shadow"
            >
              <Download className="h-3 w-3" />
              <span>Export CSV</span>
            </Button>
          )}

          {activeTab === "students" && (
            <Button
              onClick={handleExportStudents}
              size="sm"
              className="h-8 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold gap-1 shadow"
            >
              <Download className="h-3 w-3" />
              <span>Export CSV</span>
            </Button>
          )}

          {activeTab === "orders" && (
            <Button
              onClick={handleExportOrders}
              size="sm"
              className="h-8 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold gap-1 shadow"
            >
              <Download className="h-3 w-3" />
              <span>Export CSV</span>
            </Button>
          )}
        </div>
      </div>

      {/* Main Table Content based on active tab */}
      <Card className="bg-[#090d20]/60 border-white/5 backdrop-blur-xl">
        <CardHeader className="pb-3 flex flex-row items-center justify-between border-b border-white/5">
          <div>
            <CardTitle className="text-white text-base">
              {activeTab === "enrollments" && "Course Admissions & Access Validity Report"}
              {activeTab === "students" && "Registered Students & Contact Directory Report"}
              {activeTab === "orders" && "Store Orders, Deliveries & Transactions Report"}
            </CardTitle>
            <CardDescription className="text-slate-400 text-xs mt-0.5">
              {activeTab === "enrollments" &&
                `Showing ${filteredEnrollments.length} matching admission records with course access status.`}
              {activeTab === "students" &&
                `Showing ${filteredStudents.length} registered students with contact phone numbers.`}
              {activeTab === "orders" &&
                `Showing ${filteredOrders.length} store and physical product purchase orders.`}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-0">
          {/* TAB 1: ENROLLMENTS */}
          {activeTab === "enrollments" && (
            <div className="overflow-x-auto">
              {filteredEnrollments.length > 0 ? (
                <table className="w-full text-left text-xs text-slate-200 border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02] text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                      <th className="px-4 py-3">Student Name</th>
                      <th className="px-4 py-3">Mobile</th>
                      <th className="px-4 py-3">Course</th>
                      <th className="px-4 py-3">Payment</th>
                      <th className="px-4 py-3">Validity</th>
                      <th className="px-4 py-3">Progress</th>
                      <th className="px-4 py-3">Admission Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredEnrollments.map((e) => {
                      const cleanPhone = e.studentPhone ? e.studentPhone.replace(/[^0-9]/g, "") : "";
                      const whatsappUrl = cleanPhone
                        ? `https://api.whatsapp.com/send?phone=91${cleanPhone}&text=${encodeURIComponent(
                            `नमस्ते ${e.studentName}! सागर कोचिंग सेंटर में आपका स्वागत है।`
                          )}`
                        : null;

                      return (
                        <tr key={e.id} className="hover:bg-white/[0.02] transition">
                          <td className="px-4 py-3 font-semibold text-white">
                            <div>
                              <p className="font-semibold text-white">{e.studentName}</p>
                              <p className="text-[10px] text-slate-500 font-mono">{e.studentEmail}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {e.studentPhone ? (
                              <div className="flex items-center gap-1.5 font-mono text-white">
                                <Phone className="h-3 w-3 text-cyan-400" />
                                <span>{e.studentPhone}</span>
                                {whatsappUrl && (
                                  <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="WhatsApp message"
                                    className="text-emerald-400 hover:text-emerald-300 ml-1 p-0.5 rounded hover:bg-emerald-500/10"
                                  >
                                    <Share2 className="h-2.5 w-2.5" />
                                  </a>
                                )}
                              </div>
                            ) : (
                              <span className="text-[11px] text-slate-600 italic">Not set</span>
                            )}
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-200">{e.courseTitle}</td>
                          <td className="px-4 py-3">
                            <Badge
                              className={`text-[9px] uppercase font-bold tracking-wide ${
                                e.paymentStatus === "FREE"
                                  ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                                  : e.paymentStatus.includes("MANUAL")
                                  ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/30"
                                  : "bg-cyan-500/15 text-cyan-300 border-cyan-500/30"
                              }`}
                            >
                              {e.paymentStatus === "FREE"
                                ? "Free"
                                : e.paymentStatus.includes("MANUAL")
                                ? `Offline ₹${e.amountPaid}`
                                : `Online ₹${e.amountPaid}`}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            {e.expiresAt ? (
                              <div className="flex items-center gap-1 text-[11px] text-amber-300 font-medium">
                                <Clock className="h-3 w-3" />
                                <span>
                                  {new Date(e.expiresAt).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric"
                                  })}
                                </span>
                              </div>
                            ) : (
                              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[9px] font-bold uppercase">
                                Lifetime
                              </Badge>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-16 bg-white/10 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-indigo-500 rounded-full"
                                  style={{ width: `${e.progressPercent}%` }}
                                />
                              </div>
                              <span className="text-[10px] font-mono text-slate-400">
                                {e.progressPercent}%
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-400 text-[11px]">
                            {new Date(e.enrolledAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric"
                            })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="py-12 text-center text-slate-400 text-sm">
                  कोई एनरोलमेंट रिकॉर्ड नहीं मिला।
                </div>
              )}
            </div>
          )}

          {/* TAB 2: STUDENTS */}
          {activeTab === "students" && (
            <div className="overflow-x-auto">
              {filteredStudents.length > 0 ? (
                <table className="w-full text-left text-xs text-slate-200 border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02] text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                      <th className="px-4 py-3">Student Name</th>
                      <th className="px-4 py-3">Mobile Number</th>
                      <th className="px-4 py-3">Email Address</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Enrolled Courses</th>
                      <th className="px-4 py-3">Joined Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredStudents.map((s) => {
                      const cleanPhone = s.phone ? s.phone.replace(/[^0-9]/g, "") : "";
                      const whatsappUrl = cleanPhone
                        ? `https://api.whatsapp.com/send?phone=91${cleanPhone}&text=${encodeURIComponent(
                            `नमस्ते ${s.name}! सागर कोचिंग सेंटर से संपर्क करने के लिए धन्यवाद।`
                          )}`
                        : null;

                      return (
                        <tr key={s.id} className="hover:bg-white/[0.02] transition">
                          <td className="px-4 py-3 font-semibold text-white">{s.name}</td>
                          <td className="px-4 py-3">
                            {s.phone ? (
                              <div className="flex items-center gap-1.5 font-mono text-white">
                                <Phone className="h-3 w-3 text-cyan-400" />
                                <span>{s.phone}</span>
                                {whatsappUrl && (
                                  <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="WhatsApp Chat"
                                    className="text-emerald-400 hover:text-emerald-300 ml-1 p-0.5 rounded hover:bg-emerald-500/10"
                                  >
                                    <Share2 className="h-2.5 w-2.5" />
                                  </a>
                                )}
                              </div>
                            ) : (
                              <span className="text-[11px] text-slate-600 italic">Not set</span>
                            )}
                          </td>
                          <td className="px-4 py-3 font-mono text-slate-300">{s.email}</td>
                          <td className="px-4 py-3">
                            <Badge
                              variant="outline"
                              className={
                                s.role === "ADMIN"
                                  ? "bg-rose-500/20 text-rose-300 border-rose-500/30 font-bold text-[9px]"
                                  : "bg-indigo-500/20 text-indigo-300 border-indigo-500/30 text-[9px]"
                              }
                            >
                              {s.role}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 font-semibold text-indigo-400">
                            {s.coursesCount} Courses
                          </td>
                          <td className="px-4 py-3 text-slate-400 text-[11px]">
                            {new Date(s.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric"
                            })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="py-12 text-center text-slate-400 text-sm">
                  कोई छात्र रिकॉर्ड नहीं मिला।
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ORDERS */}
          {activeTab === "orders" && (
            <div className="overflow-x-auto">
              {filteredOrders.length > 0 ? (
                <table className="w-full text-left text-xs text-slate-200 border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02] text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                      <th className="px-4 py-3">Order #</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Mobile</th>
                      <th className="px-4 py-3">Item Purchased</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Order Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-white/[0.02] transition">
                        <td className="px-4 py-3 font-mono text-cyan-400 text-[11px]">
                          {o.orderNumber}
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-white">{o.customerName}</p>
                          <p className="text-[10px] text-slate-500">{o.customerEmail}</p>
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-300">
                          {o.customerPhone || "N/A"}
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-200">{o.itemTitle}</td>
                        <td className="px-4 py-3 font-bold text-white">₹{o.amount}</td>
                        <td className="px-4 py-3">
                          <Badge
                            className={`text-[9px] uppercase font-bold tracking-wide ${
                              o.status === "PAID" || o.status === "SUCCEEDED"
                                ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                                : o.status === "CANCELLED" || o.status === "FAILED"
                                ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
                                : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                            }`}
                          >
                            {o.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-[11px]">
                          {new Date(o.placedAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="py-12 text-center text-slate-400 text-sm">
                  कोई ऑर्डर रिकॉर्ड नहीं मिला।
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
