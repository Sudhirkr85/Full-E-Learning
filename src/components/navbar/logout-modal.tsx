"use client";

import React, { useTransition, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { LogOut, X, Loader2 } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleLogout = () => {
    startTransition(async () => {
      try {
        await signOut({ callbackUrl: "/" });
      } catch (err) {
        console.error("Signout critical failure:", err);
      }
    });
  };

  return createPortal(
    <div className="fixed top-0 left-0 w-screen h-screen z-[200] flex items-center justify-center p-4">
      {/* Backdrop overlay — covers entire screen including navbar */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />
      
      {/* Glassmorphic modal card — centered with safe margins */}
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#070a14]/95 p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] backdrop-blur-xl relative z-10 animate-in zoom-in-95 duration-200">
        
        {/* Animated neon laser top border */}
        <div className="absolute top-0 left-0 w-full h-[1px] overflow-hidden bg-gradient-to-r from-transparent via-rose-500/30 to-transparent">
          <div className="w-full h-full animate-cyber-line-x bg-gradient-to-r from-transparent via-orange-400/50 to-transparent" />
        </div>

        {/* Animated neon laser bottom border */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] overflow-hidden bg-gradient-to-r from-transparent via-rose-500/30 to-transparent">
          <div className="w-full h-full animate-cyber-line-x bg-gradient-to-r from-transparent via-rose-400/50 to-transparent" />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isPending}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        {/* Modal content */}
        <div className="space-y-5 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.15)] animate-bounce duration-1000">
            <LogOut className="h-5 w-5" />
          </div>

          <div className="space-y-1.5">
            <h3 className="font-display text-lg font-extrabold text-white">
              End Session?
            </h3>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Are you sure you want to log out? You will need to re-authenticate to access your course modules, compilers, and dashboard.
            </p>
          </div>

          {/* Action triggers */}
          <div className="flex flex-col sm:flex-row gap-2.5 pt-1.5">
            <Button
              onClick={handleLogout}
              disabled={isPending}
              className="flex-1 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white bg-gradient-to-r from-rose-600 to-orange-600 shadow-[0_4px_15px_-4px_rgba(244,63,94,0.4)] hover:from-rose-500 hover:to-orange-500 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <>
                  Log Out
                  <LogOut className="h-3.5 w-3.5" />
                </>
              )}
            </Button>

            <Button
              onClick={onClose}
              variant="outline"
              disabled={isPending}
              className="flex-1 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest border-white/5 bg-slate-950/40 hover:bg-slate-900/60 hover:text-white text-slate-300 transition-all duration-300 disabled:opacity-50"
            >
              Cancel
            </Button>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
}
