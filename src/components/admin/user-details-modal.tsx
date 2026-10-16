"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  BookOpen, 
  CheckCircle2, 
  X, 
  Copy, 
  Check, 
  Share2, 
  PhoneCall, 
  ExternalLink,
  GraduationCap,
  Sparkles,
  AlertCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface UserDetailData {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  role: string;
  isActive?: boolean;
  image?: string | null;
  createdAt: Date | string;
  lastLoginAt?: Date | string | null;
  enrollments?: Array<{
    id: string;
    status: string;
    paymentStatus?: string | null;
    amountPaid?: number | null;
    expiresAt?: Date | string | null;
    enrolledAt?: Date | string;
    course: {
      id: string;
      title: string;
      slug?: string;
    };
    progress?: {
      progressPercent: number;
      completedLessonsCount?: number;
      totalLessonsCount?: number;
    } | null;
  }>;
}

interface UserDetailsModalProps {
  user: UserDetailData | null;
  isOpen: boolean;
  onClose: () => void;
  onGrantCourseClick?: (user: UserDetailData) => void;
}

export function UserDetailsModal({
  user,
  isOpen,
  onClose,
  onGrantCourseClick
}: UserDetailsModalProps) {
  const [mounted, setMounted] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !user || !mounted) return null;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const cleanPhone = user.phone ? user.phone.replace(/[^0-9]/g, "") : "";
  const whatsappUrl = cleanPhone 
    ? `https://api.whatsapp.com/send?phone=91${cleanPhone}&text=${encodeURIComponent(`नमस्ते ${user.name || "Student"}! सागर कोचिंग सेंटर से संपर्क करने के लिए धन्यवाद।`)}`
    : null;

  const formattedJoinedDate = new Date(user.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const formattedJoinedTime = new Date(user.createdAt).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });

  const formattedLastLogin = user.lastLoginAt 
    ? new Date(user.lastLoginAt).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      })
    : "Never logged in";

  return createPortal(
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl border border-white/10 bg-[#070b18] text-white shadow-2xl backdrop-blur-2xl z-10 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Neon top accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-purple-500 shrink-0" />

        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-white/10 p-6 shrink-0 bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-600 border border-white/20 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-indigo-600/30 uppercase">
              {(user.name || user.email).slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-display text-xl font-bold text-white leading-tight">
                  {user.name || "Student"}
                </h2>
                <Badge
                  className={
                    user.role === "ADMIN"
                      ? "bg-rose-500/20 text-rose-300 border-rose-500/30 font-bold text-[10px]"
                      : user.role === "TEACHER"
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/30 font-bold text-[10px]"
                      : "bg-indigo-500/20 text-indigo-300 border-indigo-500/30 font-bold text-[10px]"
                  }
                >
                  {user.role}
                </Badge>
                <Badge className={user.isActive !== false ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20 text-[10px]" : "bg-rose-500/10 text-rose-300 border-rose-500/20 text-[10px]"}>
                  {user.isActive !== false ? "Active Account" : "Suspended"}
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-slate-500" />
                <span>Joined on {formattedJoinedDate} at {formattedJoinedTime}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-full text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
          
          {/* Card 1: Contact Information (Mobile & Email) */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-cyan-400" />
              <span>Contact Information (संपर्क विवरण)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Mobile Phone Card */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Mobile / Phone Number
                  </span>
                  {user.phone && (
                    <button
                      type="button"
                      onClick={() => handleCopy(user.phone!, "phone")}
                      className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      {copiedField === "phone" ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedField === "phone" ? "Copied" : "Copy"}</span>
                    </button>
                  )}
                </div>

                {user.phone ? (
                  <div className="space-y-3">
                    <p className="font-mono text-base font-bold text-white tracking-wider">
                      {user.phone}
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      {whatsappUrl && (
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 h-8 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition"
                        >
                          <Share2 className="h-3.5 w-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      )}
                      <a
                        href={`tel:${user.phone}`}
                        className="flex-1 h-8 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition"
                      >
                        <PhoneCall className="h-3.5 w-3.5" />
                        <span>Call</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="py-2 text-slate-500 text-xs italic">
                    Mobile number not provided
                  </div>
                )}
              </div>

              {/* Email Card */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Email Address
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(user.email, "email")}
                    className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    {copiedField === "email" ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedField === "email" ? "Copied" : "Copy"}</span>
                  </button>
                </div>

                <div className="space-y-3">
                  <p className="font-mono text-xs font-semibold text-white truncate" title={user.email}>
                    {user.email}
                  </p>
                  <a
                    href={`mailto:${user.email}`}
                    className="w-full h-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    <span>Send Email</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Account Details */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">User System ID</span>
              <span className="font-mono text-slate-300 text-[11px] truncate block" title={user.id}>{user.id}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Last Login</span>
              <span className="text-slate-300 font-medium block">{formattedLastLogin}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Active Enrollments</span>
              <span className="font-bold text-indigo-400 block">{user.enrollments?.length ?? 0} Courses</span>
            </div>
          </div>

          {/* Card 3: Enrolled Courses List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-indigo-400" />
                <span>Enrolled Courses & Tests ({user.enrollments?.length ?? 0})</span>
              </h3>

              {onGrantCourseClick && user.role === "STUDENT" && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onGrantCourseClick(user);
                  }}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
                >
                  <GraduationCap className="h-3.5 w-3.5" />
                  <span>+ Grant Course</span>
                </button>
              )}
            </div>

            {user.enrollments && user.enrollments.length > 0 ? (
              <div className="space-y-2.5">
                {user.enrollments.map((enr) => {
                  const isExpired = Boolean(enr.expiresAt && new Date(enr.expiresAt).getTime() < Date.now());
                  const progress = enr.progress?.progressPercent ?? 0;

                  return (
                    <div
                      key={enr.id}
                      className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <h4 className="font-bold text-sm text-white line-clamp-1">
                          {enr.course.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] flex-wrap">
                          {/* Payment status badge */}
                          {enr.paymentStatus === "FREE" ? (
                            <Badge className="bg-emerald-500/15 text-emerald-300 border-emerald-500/30 text-[9px] font-bold">
                              Free (₹0)
                            </Badge>
                          ) : enr.paymentStatus === "MANUAL_PAID" ? (
                            <Badge className="bg-indigo-500/15 text-indigo-300 border-indigo-500/30 text-[9px] font-bold">
                              Offline ₹{enr.amountPaid ?? 0}
                            </Badge>
                          ) : (
                            <Badge className="bg-cyan-500/15 text-cyan-300 border-cyan-500/30 text-[9px] font-bold">
                              Online ₹{enr.amountPaid ?? 0}
                            </Badge>
                          )}

                          {/* Validity badge */}
                          {!enr.expiresAt ? (
                            <span className="text-cyan-400 font-semibold flex items-center gap-1">
                              <Clock className="h-3 w-3" /> Lifetime Access
                            </span>
                          ) : isExpired ? (
                            <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/30 text-[9px] font-bold">
                              Expired
                            </Badge>
                          ) : (
                            <span className="text-slate-300 flex items-center gap-1">
                              <Clock className="h-3 w-3 text-emerald-400" />
                              Valid till {new Date(enr.expiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="sm:w-32 shrink-0 space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                          <span>Progress</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-6 text-center text-slate-500 text-xs italic rounded-2xl border border-dashed border-white/10">
                No active course enrollments for this user yet.
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-white/10 p-4 shrink-0 bg-white/[0.02]">
          <div className="text-xs text-slate-500">
            {user.role === "STUDENT" ? "Student Account" : `${user.role} Privilege`}
          </div>

          <div className="flex items-center gap-2">
            {onGrantCourseClick && user.role === "STUDENT" && (
              <Button
                type="button"
                onClick={() => {
                  onClose();
                  onGrantCourseClick(user);
                }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl h-10 px-4 flex items-center gap-1.5"
              >
                <GraduationCap className="h-4 w-4" />
                <span>Grant Course Access</span>
              </Button>
            )}

            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider rounded-xl h-10 px-4"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
