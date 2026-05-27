"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Loader2, KeyRound, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { forgotPasswordAction } from "@/app/(public)/forgot-password/actions";

export function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        const result = await forgotPasswordAction(formData);
        if (result.success) {
          setSuccessMessage(result.message || "Reset link sent successfully!");
        } else {
          setErrorMessage(result.message || "Failed to process request.");
        }
      } catch (err) {
        console.error("Forgot password form submit error:", err);
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Icon header */}
      <div className="text-center space-y-2">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.15)] animate-pulse">
          <KeyRound className="h-6 w-6" />
        </div>
        <h2 className="font-display text-2xl font-extrabold text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
          Forgot Password?
        </h2>
        <p className="text-sm text-slate-400 font-sans leading-relaxed max-w-xs mx-auto">
          Enter your registered email address and we will dispatch a secure link to reset your account credentials.
        </p>
      </div>

      {/* Success Alert */}
      {successMessage && (
        <div className="flex gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-emerald-400 text-xs leading-relaxed transition-all">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="flex gap-3 rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 text-rose-400 text-xs leading-relaxed transition-all">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {!successMessage && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email input field */}
          <div className="space-y-2 text-left">
            <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-slate-400 block px-0.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 transition-colors" />
              <input
                id="email"
                name="email"
                type="email"
                required
                disabled={isPending}
                placeholder="developer@college.edu"
                className="w-full h-12 rounded-xl pl-11 pr-4 text-sm bg-slate-950/60 border border-white/5 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/40 focus:bg-slate-950 transition-all"
              />
            </div>
          </div>

          {/* Submit Trigger */}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-12 rounded-xl text-xs font-bold uppercase tracking-widest text-white bg-gradient-to-r from-indigo-600 to-cyan-600 shadow-[0_4px_20px_-5px_rgba(99,102,241,0.4)] hover:shadow-[0_6px_25px_-5px_rgba(99,102,241,0.6)] hover:from-indigo-500 hover:to-cyan-500 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Send Reset Link
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </>
            )}
          </Button>
        </form>
      )}

      {/* Return to Login link */}
      <div className="pt-2 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition group-hover:-translate-x-0.5" />
          Back to Login
        </Link>
      </div>
    </div>
  );
}
