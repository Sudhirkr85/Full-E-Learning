"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import { LogOut, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/app/(public)/logout/actions";

export function LogoutForm() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPending) return;

    startTransition(async () => {
      try {
        await logoutAction();
      } catch (err) {
        console.error("Signout error:", err);
      }
    });
  };

  return (
    <div className="space-y-6 text-center">
      {/* Visual Icon */}
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.15)] animate-bounce duration-1000">
        <LogOut className="h-6 w-6" />
      </div>

      {/* Confirmation text */}
      <div className="space-y-2">
        <h2 className="font-display text-2xl font-extrabold text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
          Sign Out Confirmation
        </h2>
        <p className="text-sm text-slate-400 font-sans leading-relaxed max-w-sm mx-auto">
          Are you sure you want to end your current developer session? You will need to re-authenticate to access your compilers and placement dashboard.
        </p>
      </div>

      {/* Primary and secondary triggers */}
      <form onSubmit={handleLogout} className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          type="submit"
          disabled={isPending}
          className="flex-1 h-12 rounded-xl text-xs font-bold uppercase tracking-widest text-white bg-gradient-to-r from-rose-600 to-orange-600 shadow-[0_4px_20px_-5px_rgba(244,63,94,0.4)] hover:shadow-[0_6px_25px_-5px_rgba(244,63,94,0.6)] hover:from-rose-500 hover:to-orange-500 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Yes, Sign Out
              <LogOut className="h-4 w-4" />
            </>
          )}
        </Button>

        <Button
          asChild
          variant="outline"
          disabled={isPending}
          className="flex-1 h-12 rounded-xl text-xs font-bold uppercase tracking-widest border-white/5 bg-slate-950/40 hover:bg-slate-900/60 hover:text-white text-slate-300 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            Cancel & Return
          </Link>
        </Button>
      </form>
    </div>
  );
}
