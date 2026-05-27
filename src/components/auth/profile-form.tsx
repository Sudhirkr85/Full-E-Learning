"use client";

import React, { useState, useTransition } from "react";
import { User, Mail, Phone, Lock, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateProfileAction } from "@/app/(protected)/profile/actions";

interface ProfileFormProps {
  user: {
    name?: string | null;
    email: string;
    phone?: string;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
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
        const result = await updateProfileAction(formData);
        if (result.success) {
          setSuccessMessage(result.message);
          // Auto clear success message after 4 seconds
          setTimeout(() => setSuccessMessage(null), 4000);
        } else {
          setErrorMessage(result.message);
        }
      } catch (err) {
        console.error("Profile form update error:", err);
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    });
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Alert states */}
      {successMessage && (
        <div className="flex gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-emerald-400 text-xs leading-relaxed transition-all duration-300 animate-in fade-in">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex gap-3 rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 text-rose-400 text-xs leading-relaxed transition-all duration-300 animate-in fade-in">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 text-left">
        
        {/* Full Name Input */}
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400 block px-0.5">
            Full Name
          </label>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors duration-200">
              <User className="h-4 w-4" />
            </span>
            <Input
              id="name"
              name="name"
              type="text"
              required
              disabled={isPending}
              defaultValue={user.name || ""}
              placeholder="Arjun Kumar"
              className="pl-10 h-12 w-full rounded-xl border-white/5 bg-slate-950/60 text-slate-200 placeholder-slate-600 focus-visible:ring-1 focus-visible:ring-indigo-500/40 focus-visible:border-indigo-500/40 focus-visible:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300 disabled:opacity-50"
            />
          </div>
        </div>

        {/* Email Address Input (Read-only/Secured) */}
        <div className="space-y-1.5 opacity-80">
          <div className="flex items-center justify-between px-0.5">
            <label htmlFor="email" className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
              Email Address
            </label>
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-indigo-400 flex items-center gap-1">
              <Lock className="h-2.5 w-2.5" /> Secure Credentials Key
            </span>
          </div>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-600">
              <Mail className="h-4 w-4" />
            </span>
            <Input
              id="email"
              type="email"
              readOnly
              disabled
              defaultValue={user.email}
              className="pl-10 h-12 w-full rounded-xl border-white/5 bg-slate-950/30 text-slate-500 cursor-not-allowed selection:bg-transparent"
            />
          </div>
        </div>

        {/* Mobile Number Input */}
        <div className="space-y-1.5">
          <label htmlFor="phone" className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400 block px-0.5">
            Mobile Number
          </label>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors duration-200">
              <Phone className="h-4 w-4" />
            </span>
            <Input
              id="phone"
              name="phone"
              type="tel"
              disabled={isPending}
              defaultValue={user.phone || ""}
              placeholder="+91 98765 43210"
              className="pl-10 h-12 w-full rounded-xl border-white/5 bg-slate-950/60 text-slate-200 placeholder-slate-600 focus-visible:ring-1 focus-visible:ring-indigo-500/40 focus-visible:border-indigo-500/40 focus-visible:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300 disabled:opacity-50"
            />
          </div>
        </div>

        {/* Submit Actions */}
        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-12 rounded-xl text-xs font-bold uppercase tracking-widest text-white bg-gradient-to-r from-indigo-600 to-cyan-600 shadow-[0_4px_20px_-5px_rgba(99,102,241,0.4)] hover:shadow-[0_6px_25px_-5px_rgba(99,102,241,0.6)] hover:from-indigo-500 hover:to-cyan-500 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Save Preferences"
          )}
        </Button>

      </form>
    </div>
  );
}
