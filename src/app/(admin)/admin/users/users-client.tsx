"use client";

import { useEffect, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, GraduationCap, Phone, Share2 } from "lucide-react";
import { promoteToTeacherAction } from "./actions";
import { UserDetailsModal, UserDetailData } from "@/components/admin/user-details-modal";
import { GrantAccessModal } from "../enrollments/grant-access-modal";

export function UsersSearchFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialQ = searchParams.get("q") || "";
  const initialFilter = searchParams.get("filter") || "ALL";

  const [q, setQ] = useState(initialQ);
  const [filter, setFilter] = useState(initialFilter);
  const [, startTransition] = useTransition();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (q.trim()) {
          params.set("q", q.trim());
        } else {
          params.delete("q");
        }
        params.set("page", "0");
        router.push(`/admin/users?${params.toString()}`);
      });
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [q, router, searchParams]);

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    const params = new URLSearchParams(searchParams.toString());
    if (newFilter !== "ALL") {
      params.set("filter", newFilter);
    } else {
      params.delete("filter");
    }
    params.set("page", "0");
    router.push(`/admin/users?${params.toString()}`);
  };

  const roles = ["ALL", "STUDENT", "TEACHER", "ADMIN"];

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full">
      <div className="relative max-w-md w-full">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users by name or email..."
          className="pl-9 bg-white/5 border-white/10 text-white placeholder-slate-500 focus-visible:ring-indigo-500"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-1.5 bg-[#090d20]/80 p-1 rounded-xl border border-white/5 w-fit">
        {roles.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => handleFilterChange(r)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
              filter === r
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  );
}

export function PromoteButton({ userId, userRole }: { userId: string; userRole: string }) {
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (userRole !== "STUDENT") {
    return null;
  }

  const handlePromote = () => {
    setIsModalOpen(true);
  };

  const confirmPromote = () => {
    setIsModalOpen(false);
    setErrorMessage(null);
    startTransition(async () => {
      const res = await promoteToTeacherAction(userId);
      if (res.error) {
        setErrorMessage(res.error);
      }
    });
  };

  return (
    <>
      <Button
        onClick={handlePromote}
        disabled={isPending}
        variant="secondary"
        size="sm"
        className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl border border-white/10 shadow-[0_0_10px_rgba(99,102,241,0.2)] disabled:opacity-50"
      >
        {isPending ? "Promoting..." : "Promote to Teacher"}
      </Button>

      {/* Reusable Viewport-Centered Confirm Modal with Glassmorphism */}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmPromote}
        isPending={isPending}
        title="Promote to Teacher?"
        description="Are you sure you want to promote this student to a Teacher? They will instantly gain full teacher/instructor access privileges."
        confirmText="PROMOTE"
        cancelText="CANCEL"
      />

      {/* Floating Error Alert */}
      {errorMessage && (
        <div className="fixed bottom-4 right-4 z-[250] rounded-xl border border-red-500/10 bg-red-500/5 px-4 py-2.5 text-xs font-semibold text-red-400 shadow-lg backdrop-blur-md">
          {errorMessage}
        </div>
      )}
    </>
  );
}

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isPending?: boolean;
}

function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isPending = false
}: ConfirmModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed top-0 left-0 w-screen h-screen z-[200] flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />
      
      {/* Glassmorphic card */}
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#070a14]/95 p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] backdrop-blur-xl relative z-10 animate-in zoom-in-95 duration-200">
        
        {/* Neon top/bottom line designs */}
        <div className="absolute top-0 left-0 w-full h-[1px] overflow-hidden bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent">
          <div className="w-full h-full animate-cyber-line-x bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[1px] overflow-hidden bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent">
          <div className="w-full h-full animate-cyber-line-x bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent" />
        </div>

        {/* Modal content */}
        <div className="space-y-5 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.15)] animate-bounce duration-1000">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <div className="space-y-1.5">
            <h3 className="font-display text-lg font-extrabold text-white">
              {title}
            </h3>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              {description}
            </p>
          </div>

          {/* Action triggers */}
          <div className="flex flex-col sm:flex-row gap-2.5 pt-1.5">
            <Button
              onClick={onConfirm}
              disabled={isPending}
              className="flex-1 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white bg-gradient-to-r from-indigo-600 to-cyan-600 shadow-[0_4px_15px_-4px_rgba(99,102,241,0.4)] hover:from-indigo-500 hover:to-cyan-500 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {isPending ? "Processing..." : confirmText}
            </Button>

            <Button
              onClick={onClose}
              variant="outline"
              disabled={isPending}
              className="flex-1 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest border-white/5 bg-slate-950/40 hover:bg-slate-900/60 hover:text-white text-slate-300 transition-all duration-300 disabled:opacity-50"
            >
              {cancelText}
            </Button>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
}

interface UsersTableClientProps {
  users: any[];
  courses: any[];
  currentUserEmail: string;
}

export function UsersTableClient({ users, courses, currentUserEmail }: UsersTableClientProps) {
  const [selectedUserForDetails, setSelectedUserForDetails] = useState<UserDetailData | null>(null);
  const [selectedUserForGrant, setSelectedUserForGrant] = useState<any | null>(null);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-200 border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-slate-400 text-xs font-bold uppercase tracking-wider">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Mobile</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Courses</th>
              <th className="px-4 py-3">Joined Date</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((u) => {
              const isSelf = u.email === currentUserEmail;
              const cleanPhone = u.phone ? u.phone.replace(/[^0-9]/g, "") : "";
              const whatsappUrl = cleanPhone 
                ? `https://api.whatsapp.com/send?phone=91${cleanPhone}&text=${encodeURIComponent(`नमस्ते ${u.name || "Student"}! सागर कोचिंग सेंटर से संपर्क करने के लिए धन्यवाद।`)}`
                : null;

              return (
                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                  {/* Name cell - Clickable to open full details */}
                  <td 
                    onClick={() => setSelectedUserForDetails(u)}
                    className="px-4 py-3.5 font-semibold text-white cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs uppercase group-hover:border-indigo-400 transition">
                        {(u.name || u.email).slice(0, 2)}
                      </div>
                      <span className="group-hover:text-indigo-400 transition underline-offset-4 group-hover:underline">
                        {u.name || "N/A"}
                      </span>
                    </div>
                  </td>

                  {/* Mobile cell - with quick WhatsApp & Call link */}
                  <td className="px-4 py-3.5">
                    {u.phone ? (
                      <div className="flex items-center gap-1.5 font-mono text-xs text-white">
                        <Phone className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                        <span 
                          onClick={() => setSelectedUserForDetails(u)}
                          className="cursor-pointer hover:underline text-slate-200"
                        >
                          {u.phone}
                        </span>
                        {whatsappUrl && (
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Chat on WhatsApp"
                            onClick={(e) => e.stopPropagation()}
                            className="text-emerald-400 hover:text-emerald-300 ml-1 p-0.5 rounded hover:bg-emerald-500/10"
                          >
                            <Share2 className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-600 italic">Not set</span>
                    )}
                  </td>

                  {/* Email cell */}
                  <td className="px-4 py-3.5 font-mono text-slate-300 text-xs">
                    {u.email}
                  </td>

                  {/* Role cell */}
                  <td className="px-4 py-3.5">
                    <Badge
                      variant={
                        u.role === "ADMIN"
                          ? "default"
                          : u.role === "TEACHER"
                          ? "secondary"
                          : "outline"
                      }
                      className={
                        u.role === "ADMIN"
                          ? "bg-rose-500/20 text-rose-300 border-rose-500/30 font-bold"
                          : u.role === "TEACHER"
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/30 font-bold"
                          : "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
                      }
                    >
                      {u.role}
                    </Badge>
                  </td>

                  {/* Enrolled Courses count badge */}
                  <td className="px-4 py-3.5 text-xs text-slate-300">
                    <span 
                      onClick={() => setSelectedUserForDetails(u)}
                      className="cursor-pointer hover:underline text-indigo-400 font-semibold"
                    >
                      {u.enrollments?.length ?? 0} Courses
                    </span>
                  </td>

                  {/* Joined Date */}
                  <td className="px-4 py-3.5 text-xs text-slate-400">
                    {new Date(u.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })}
                  </td>

                  {/* Actions cell */}
                  <td className="px-4 py-3.5 text-right">
                    {isSelf ? (
                      <span className="text-xs text-indigo-400 font-bold">Logged In</span>
                    ) : (
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Eye / View Details button */}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedUserForDetails(u)}
                          className="h-8 px-2.5 rounded-xl text-[10px] font-bold text-slate-300 hover:text-white hover:bg-white/10 gap-1 uppercase"
                          title="View Full Profile & Mobile Details"
                        >
                          <Eye className="h-3.5 w-3.5 text-indigo-400" />
                          <span>Details</span>
                        </Button>

                        {/* Grant Course button */}
                        {u.role === "STUDENT" && courses.length > 0 && (
                          <GrantAccessModal
                            courses={courses}
                            preSelectedStudent={u}
                            triggerButton={
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 rounded-xl text-[10px] font-bold border-cyan-500/30 text-cyan-300 hover:text-white bg-cyan-500/10 hover:bg-cyan-500/20 gap-1 uppercase"
                              >
                                <GraduationCap className="h-3.5 w-3.5" />
                                <span>Grant Course</span>
                              </Button>
                            }
                          />
                        )}

                        <PromoteButton userId={u.id} userRole={u.role} />
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* User Details Modal */}
      <UserDetailsModal
        user={selectedUserForDetails}
        isOpen={!!selectedUserForDetails}
        onClose={() => setSelectedUserForDetails(null)}
        onGrantCourseClick={(userToGrant) => {
          setSelectedUserForGrant(userToGrant);
        }}
      />

      {/* Trigger GrantAccessModal when opened from inside UserDetailsModal */}
      {selectedUserForGrant && (
        <GrantAccessModal
          courses={courses}
          preSelectedStudent={selectedUserForGrant}
          triggerButton={<span className="hidden" />}
          onSuccess={() => setSelectedUserForGrant(null)}
        />
      )}
    </>
  );
}
