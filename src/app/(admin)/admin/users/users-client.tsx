"use client";

import { useEffect, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { promoteToTeacherAction } from "./actions";

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
