"use client";

import React, { useState, useTransition, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { 
  UserPlus, 
  Search, 
  Check, 
  Copy, 
  Share2, 
  Calendar, 
  IndianRupee, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  X, 
  Loader2,
  GraduationCap,
  Phone,
  Mail,
  User,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  adminGrantCourseAccessAction, 
  searchStudentsAction, 
  GrantCourseAccessInput 
} from "./actions";

interface CourseOption {
  id: string;
  title: string;
  slug: string;
  priceCents: number;
  status: string;
}

interface GrantAccessModalProps {
  courses: CourseOption[];
  preSelectedStudent?: {
    id: string;
    name: string | null;
    email: string;
    phone?: string | null;
  } | null;
  onSuccess?: () => void;
  triggerButton?: React.ReactNode;
}

export function GrantAccessModal({
  courses,
  preSelectedStudent = null,
  onSuccess,
  triggerButton
}: GrantAccessModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Mode: EXISTING vs NEW
  const [mode, setMode] = useState<"EXISTING" | "NEW">(preSelectedStudent ? "EXISTING" : "EXISTING");

  // Existing student search states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{
    id: string;
    name: string | null;
    email: string;
    phone?: string | null;
  }>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    name: string | null;
    email: string;
    phone?: string | null;
  } | null>(preSelectedStudent || null);

  // New student states
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Course & Pricing states
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || "");
  const [paymentType, setPaymentType] = useState<GrantCourseAccessInput["paymentType"]>("OFFLINE_CASH");
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [notes, setNotes] = useState("");

  // Duration plan states
  const [durationPlan, setDurationPlan] = useState<GrantCourseAccessInput["durationPlan"]>("LIFETIME");
  const [customExpiresAt, setCustomExpiresAt] = useState("");

  // Result & Feedback states
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    studentName: string;
    studentEmail: string;
    courseTitle: string;
    courseSlug: string;
    durationPlan: string;
    expiresAt: string | null;
    amountPaid: number;
    temporaryPassword?: string;
    wasUserCreated: boolean;
  } | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update selected course default price
  useEffect(() => {
    const course = courses.find((c) => c.id === selectedCourseId);
    if (course) {
      const price = Math.round((course.priceCents || 0) / 100);
      if (paymentType === "FREE" || paymentType === "SCHOLARSHIP") {
        setAmountPaid(0);
      } else {
        setAmountPaid(price);
      }
    }
  }, [selectedCourseId, paymentType, courses]);

  // Debounced live user search
  useEffect(() => {
    if (mode !== "EXISTING" || selectedUser) return;
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const res = await searchStudentsAction(searchQuery);
      setIsSearching(false);
      if (res.success && res.users) {
        setSearchResults(res.users);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, mode, selectedUser]);

  const handleOpen = () => {
    setIsOpen(true);
    setErrorMessage(null);
    setSuccessData(null);
    if (preSelectedStudent) {
      setSelectedUser(preSelectedStudent);
      setMode("EXISTING");
    }
  };

  const handleClose = () => {
    if (isPending) return;
    setIsOpen(false);
    setSuccessData(null);
    setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (mode === "EXISTING" && !selectedUser) {
      setErrorMessage("Please search and select a student first.");
      return;
    }

    if (mode === "NEW") {
      if (!newName.trim()) {
        setErrorMessage("Please enter the student's full name.");
        return;
      }
      if (!newEmail.trim() || !newEmail.includes("@")) {
        setErrorMessage("Please enter a valid student email address.");
        return;
      }
    }

    if (!selectedCourseId) {
      setErrorMessage("Please choose a course.");
      return;
    }

    if ((durationPlan === "CUSTOM" || durationPlan === "EXAM_DATE") && !customExpiresAt) {
      setErrorMessage("Please pick an expiration date for the custom plan.");
      return;
    }

    startTransition(async () => {
      const payload: GrantCourseAccessInput = {
        mode,
        courseId: selectedCourseId,
        paymentType,
        amountPaid: Number(amountPaid) || 0,
        notes,
        durationPlan,
        customExpiresAt: customExpiresAt || undefined
      };

      if (mode === "EXISTING") {
        payload.userId = selectedUser?.id;
      } else {
        payload.name = newName.trim();
        payload.email = newEmail.trim().toLowerCase();
        payload.phone = newPhone.trim() || undefined;
        payload.password = newPassword.trim() || undefined;
      }

      const res = await adminGrantCourseAccessAction(payload);
      if (!res.success) {
        setErrorMessage(res.error || "Failed to grant course access.");
      } else {
        setSuccessData({
          studentName: res.studentName || "Student",
          studentEmail: res.studentEmail || "",
          courseTitle: res.courseTitle || "Course",
          courseSlug: res.courseSlug || "",
          durationPlan: res.durationPlan || "LIFETIME",
          expiresAt: res.expiresAt || null,
          amountPaid: res.amountPaid || 0,
          temporaryPassword: res.temporaryPassword,
          wasUserCreated: !!res.wasUserCreated
        });
        if (onSuccess) onSuccess();
      }
    });
  };

  // Generate WhatsApp message
  const getWhatsAppMessage = () => {
    if (!successData) return "";
    const siteUrl = typeof window !== "undefined" ? window.location.origin : "https://sagarcoaching.tech";
    const courseUrl = `${siteUrl}/courses/${successData.courseSlug}/learn`;
    const loginUrl = `${siteUrl}/login`;

    let validityText = "आजीवन (Lifetime Access)";
    if (successData.expiresAt) {
      const d = new Date(successData.expiresAt);
      validityText = d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    }

    let msg = `नमस्ते ${successData.studentName}! 🎓\n\n`;
    msg += `सागर कोचिंग सेंटर के कोर्स *${successData.courseTitle}* में आपका नामांकन (Enrollment) सफलतापूर्वक पूरा हो गया है।\n\n`;
    msg += `📌 *कोर्स वैधता (Validity):* ${validityText}\n`;
    msg += `📌 *रजिस्ट्रेशन ईमेल:* ${successData.studentEmail}\n`;
    if (successData.temporaryPassword) {
      msg += `🔑 *आपका लॉगिन पासवर्ड:* ${successData.temporaryPassword}\n`;
    }
    msg += `\n▶️ *पढ़ाई शुरू करने के लिए यहाँ क्लिक करें:*\n${courseUrl}\n\n`;
    msg += `लॉगिन लिंक: ${loginUrl}\n`;
    msg += `किसी भी सहायता के लिए संपर्क करें: 854338 / सागर सर। धन्यवाद! 🙏`;

    return msg;
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(getWhatsAppMessage());
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleCopyDetails = () => {
    navigator.clipboard.writeText(getWhatsAppMessage());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);

  return (
    <>
      {triggerButton ? (
        <span onClick={handleOpen}>{triggerButton}</span>
      ) : (
        <Button
          onClick={handleOpen}
          className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all duration-300 gap-2 h-10 px-4"
        >
          <UserPlus className="h-4 w-4" />
          <span>+ Grant Course Access</span>
        </Button>
      )}

      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
            onClick={handleClose}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl border border-white/10 bg-[#070b18] text-white shadow-2xl backdrop-blur-2xl z-10 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header neon accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-purple-500 shrink-0" />

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 p-5 shrink-0 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-white leading-tight">
                    Grant Course Access (Manual Enrollment)
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Assign full access for offline cash, direct UPI, or scholarship.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                disabled={isPending}
                className="h-8 w-8 rounded-full text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
              {/* SUCCESS VIEW */}
              {successData ? (
                <div className="space-y-6 py-4 text-center animate-in zoom-in-95 duration-200">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-display text-xl font-bold text-white">
                      Course Access Granted Successfully!
                    </h3>
                    <p className="text-xs text-slate-300">
                      Student has been enrolled in <span className="text-indigo-400 font-semibold">{successData.courseTitle}</span>.
                    </p>
                  </div>

                  {/* Summary Card */}
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-left text-xs space-y-2.5 max-w-md mx-auto">
                    <div className="flex justify-between items-center pb-2 border-b border-white/5">
                      <span className="text-slate-400">Student Name:</span>
                      <span className="font-bold text-white">{successData.studentName}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-white/5">
                      <span className="text-slate-400">Registered Email:</span>
                      <span className="font-mono text-slate-200">{successData.studentEmail}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-white/5">
                      <span className="text-slate-400">Validity:</span>
                      <span className="font-bold text-cyan-400">
                        {successData.expiresAt
                          ? new Date(successData.expiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                          : "Lifetime Access"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-white/5">
                      <span className="text-slate-400">Amount Recorded:</span>
                      <span className="font-bold text-emerald-400">
                        {successData.amountPaid === 0 ? "Free (₹0)" : `₹${successData.amountPaid}`}
                      </span>
                    </div>
                    {successData.temporaryPassword && (
                      <div className="flex justify-between items-center pt-1 text-amber-300 font-semibold bg-amber-500/10 p-2 rounded-lg">
                        <span>Temporary Password:</span>
                        <span className="font-mono">{successData.temporaryPassword}</span>
                      </div>
                    )}
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2 max-w-md mx-auto">
                    <Button
                      type="button"
                      onClick={handleShareWhatsApp}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl h-11 flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                    >
                      <Share2 className="h-4 w-4" />
                      <span>Send on WhatsApp</span>
                    </Button>

                    <Button
                      type="button"
                      onClick={handleCopyDetails}
                      variant="outline"
                      className="flex-1 border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider rounded-xl h-11 flex items-center justify-center gap-2"
                    >
                      {isCopied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                      <span>{isCopied ? "Copied!" : "Copy Message"}</span>
                    </Button>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="button"
                      onClick={handleClose}
                      variant="ghost"
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Close Window
                    </Button>
                  </div>
                </div>
              ) : (
                /* FORM VIEW */
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Mode Selector Tabs */}
                  <div className="flex p-1 bg-white/[0.04] rounded-2xl border border-white/5">
                    <button
                      type="button"
                      onClick={() => { setMode("EXISTING"); setErrorMessage(null); }}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                        mode === "EXISTING"
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      1. Existing Student (Search)
                    </button>
                    <button
                      type="button"
                      onClick={() => { setMode("NEW"); setErrorMessage(null); }}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                        mode === "NEW"
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      2. New Student (Quick Add)
                    </button>
                  </div>

                  {/* Section A: Student Selection */}
                  {mode === "EXISTING" ? (
                    <div className="space-y-3">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Select Student
                      </label>

                      {selectedUser ? (
                        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-white">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xs uppercase">
                              {(selectedUser.name || selectedUser.email).slice(0, 2)}
                            </div>
                            <div>
                              <p className="font-bold text-sm text-white">{selectedUser.name || "Student"}</p>
                              <p className="text-xs text-slate-300 font-mono">{selectedUser.email}</p>
                              {selectedUser.phone && (
                                <p className="text-[11px] text-indigo-300 font-mono">{selectedUser.phone}</p>
                              )}
                            </div>
                          </div>
                          {!preSelectedStudent && (
                            <button
                              type="button"
                              onClick={() => { setSelectedUser(null); setSearchQuery(""); }}
                              className="text-xs text-indigo-400 hover:text-indigo-300 underline font-semibold px-2 py-1"
                            >
                              Change
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-2 relative">
                          <div className="relative">
                            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                            <Input
                              type="text"
                              placeholder="Type name, email, or mobile number to search..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="pl-10 h-11 bg-white/5 border-white/10 rounded-xl text-white placeholder:text-slate-500 focus-visible:ring-indigo-500"
                            />
                            {isSearching && (
                              <Loader2 className="absolute right-3.5 top-3.5 h-4 w-4 animate-spin text-indigo-400" />
                            )}
                          </div>

                          {/* Search Dropdown Results */}
                          {searchResults.length > 0 && (
                            <div className="absolute top-12 left-0 right-0 z-30 max-h-56 overflow-y-auto rounded-2xl border border-white/10 bg-[#0d1226] p-1.5 shadow-2xl space-y-1">
                              {searchResults.map((user) => (
                                <div
                                  key={user.id}
                                  onClick={() => { setSelectedUser(user); setSearchResults([]); }}
                                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/10 cursor-pointer transition text-left"
                                >
                                  <div>
                                    <p className="font-semibold text-xs text-white">{user.name || "N/A"}</p>
                                    <p className="text-[11px] text-slate-400 font-mono">{user.email}</p>
                                  </div>
                                  {user.phone && (
                                    <span className="text-[10px] text-slate-400 font-mono">{user.phone}</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {searchQuery.length >= 2 && !isSearching && searchResults.length === 0 && (
                            <p className="text-xs text-slate-400 pt-1">
                              No matching student found. Click &quot;New Student (Quick Add)&quot; above to create their account.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* NEW STUDENT QUICK FORM */
                    <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-400 uppercase">
                            Full Name *
                          </label>
                          <Input
                            placeholder="e.g. Rahul Kumar"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="h-10 bg-white/5 border-white/10 rounded-xl text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-400 uppercase">
                            Email Address *
                          </label>
                          <Input
                            type="email"
                            placeholder="e.g. rahul@gmail.com"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="h-10 bg-white/5 border-white/10 rounded-xl text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-400 uppercase">
                            WhatsApp / Mobile Number (Optional)
                          </label>
                          <Input
                            placeholder="e.g. 9876543210"
                            value={newPhone}
                            onChange={(e) => setNewPhone(e.target.value)}
                            className="h-10 bg-white/5 border-white/10 rounded-xl text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-400 uppercase">
                            Password (Optional)
                          </label>
                          <Input
                            placeholder="Default: student123"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="h-10 bg-white/5 border-white/10 rounded-xl text-white"
                          />
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        A new student account will be automatically created and this course will be immediately unlocked.
                      </p>
                    </div>
                  )}

                  {/* Section B: Course Selection */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Select Course *
                    </label>
                    <select
                      value={selectedCourseId}
                      onChange={(e) => setSelectedCourseId(e.target.value)}
                      className="w-full h-11 bg-[#090d20] border border-white/10 rounded-xl px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    >
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title} {c.priceCents > 0 ? `(₹${Math.round(c.priceCents / 100)})` : "(Free)"}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Section C: Plan Duration (Validity) */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Course Validity / Plan Duration *</span>
                    </label>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { id: "LIFETIME", label: "Lifetime (आजीवन)" },
                        { id: "30_DAYS", label: "1 Month (30 Din)" },
                        { id: "90_DAYS", label: "3 Months (90 Din)" },
                        { id: "180_DAYS", label: "6 Months (180 Din)" },
                        { id: "365_DAYS", label: "1 Year (365 Din)" },
                        { id: "EXAM_DATE", label: "Exam Date / Custom" }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setDurationPlan(item.id as any)}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-left ${
                            durationPlan === item.id
                              ? "bg-cyan-500/15 border-cyan-500/50 text-cyan-300 shadow-sm"
                              : "bg-white/[0.02] border-white/5 text-slate-400 hover:text-white hover:bg-white/[0.05]"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>

                    {(durationPlan === "EXAM_DATE" || durationPlan === "CUSTOM") && (
                      <div className="pt-1 space-y-1">
                        <label className="text-[11px] font-bold text-cyan-400">
                          Select Expiration / Exam Date:
                        </label>
                        <Input
                          type="date"
                          value={customExpiresAt}
                          min={new Date().toISOString().split("T")[0]}
                          onChange={(e) => setCustomExpiresAt(e.target.value)}
                          className="h-10 bg-white/5 border-white/10 rounded-xl text-white font-mono"
                        />
                      </div>
                    )}
                  </div>

                  {/* Section D: Payment Mode & Amount */}
                  <div className="space-y-3 pt-1 border-t border-white/5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <IndianRupee className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Payment / Access Type *</span>
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {[
                        { id: "FREE", label: "Free / Scholarship", sub: "₹0 Free access" },
                        { id: "OFFLINE_CASH", label: "Offline Cash", sub: "Coaching cash payment" },
                        { id: "DIRECT_UPI", label: "Direct UPI", sub: "GPay / PhonePe / Paytm" }
                      ].map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setPaymentType(p.id as any)}
                          className={`p-3 rounded-2xl border text-left transition-all ${
                            paymentType === p.id
                              ? "bg-indigo-600/20 border-indigo-500/60 text-white shadow-md"
                              : "bg-white/[0.02] border-white/5 text-slate-400 hover:text-white"
                          }`}
                        >
                          <p className="font-bold text-xs">{p.label}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{p.sub}</p>
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-400 uppercase">
                          Amount Received (₹)
                        </label>
                        <Input
                          type="number"
                          min={0}
                          value={amountPaid}
                          onChange={(e) => setAmountPaid(Number(e.target.value))}
                          disabled={paymentType === "FREE" || paymentType === "SCHOLARSHIP"}
                          className="h-10 bg-white/5 border-white/10 rounded-xl text-white font-mono font-bold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-400 uppercase">
                          Payment Note / Txn ID (Optional)
                        </label>
                        <Input
                          placeholder="e.g. Cash in Supaul office / Txn 1029..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="h-10 bg-white/5 border-white/10 rounded-xl text-white text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Error Alert */}
                  {errorMessage && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Submit Action */}
                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                    <Button
                      type="button"
                      onClick={handleClose}
                      disabled={isPending}
                      variant="ghost"
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </Button>

                    <Button
                      type="submit"
                      disabled={isPending}
                      className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl h-11 px-6 shadow-lg shadow-indigo-600/30 flex items-center gap-2"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4" />
                          <span>Grant Access Now</span>
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
