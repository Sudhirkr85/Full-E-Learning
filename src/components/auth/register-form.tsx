"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { User, Mail, Lock, Eye, EyeOff, Loader2, Chrome, Github, ArrowRight, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { registerAction } from "@/app/(public)/register/actions";
import { loginWithGoogleAction, loginWithGithubAction } from "@/app/(public)/login/actions";

interface RegisterFormProps {
  errorMessage?: string | null;
}

export function RegisterForm({ errorMessage }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isPending, startTransition] = useTransition();
  const [isGooglePending, startGoogleTransition] = useTransition();
  const [isGithubPending, startGithubTransition] = useTransition();

  const isAnyPending = isPending || isGooglePending || isGithubPending;

  // Real-time password strength checklist calculations (calculated inline for perfect reactivity)
  const criteria = [
    { id: "length", label: "At least 8 characters", met: password.length >= 8 },
    { id: "upper", label: "One uppercase letter (A-Z)", met: /[A-Z]/.test(password) },
    { id: "lower", label: "One lowercase letter (a-z)", met: /[a-z]/.test(password) },
    { id: "number", label: "One number (0-9)", met: /[0-9]/.test(password) },
    { id: "special", label: "One special character (e.g., @, $, !, %)", met: /[^A-Za-z0-9]/.test(password) },
  ];

  const satisfiedCount = criteria.filter((c) => c.met).length;

  let strengthLabel = "Very Weak";
  let strengthColor = "bg-rose-500";
  let strengthWidth = "w-0";

  if (password.length > 0) {
    if (satisfiedCount === 5) {
      strengthLabel = "Excellent / Strong";
      strengthColor = "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]";
      strengthWidth = "w-full";
    } else if (satisfiedCount >= 3) {
      strengthLabel = "Good";
      strengthColor = "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]";
      strengthWidth = "w-3/5";
    } else {
      strengthLabel = "Weak";
      strengthColor = "bg-rose-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]";
      strengthWidth = "w-1/5";
    }
  }

  const passwordsMatch = confirmPassword.length > 0 ? password === confirmPassword : null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isAnyPending) return;

    if (password !== confirmPassword) {
      return;
    }

    if (satisfiedCount < 5) {
      return;
    }

    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await registerAction(formData);
      } catch (err) {
        console.error("Register submission error:", err);
      }
    });
  };

  const handleGoogleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAnyPending) return;

    startGoogleTransition(async () => {
      try {
        await loginWithGoogleAction();
      } catch (err) {
        console.error("Google Auth error:", err);
      }
    });
  };

  const handleGithubLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAnyPending) return;

    startGithubTransition(async () => {
      try {
        await loginWithGithubAction();
      } catch (err) {
        console.error("GitHub Auth error:", err);
      }
    });
  };

  return (
    <div className="w-full space-y-5 sm:space-y-6 relative z-10">
      
      {/* Visual Header */}
      <div className="flex flex-col space-y-2 text-center md:text-left">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
          Create Account
        </h1>
        <p className="text-sm text-slate-400 font-sans tracking-wide">
          Sign up to get placement-ready and access learning resources.
        </p>
      </div>

      {/* Alert states */}
      {errorMessage && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-950/20 px-4 py-3.5 text-sm text-rose-400 flex items-center gap-2.5 animate-in fade-in duration-300">
          <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
          <p className="font-medium tracking-wide">{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Full Name Input */}
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
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
              placeholder="Arjun Kumar"
              autoComplete="name"
              required
              disabled={isAnyPending}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10 h-12 w-full rounded-xl border-white/5 bg-slate-950/60 text-slate-200 placeholder-slate-600 focus-visible:ring-1 focus-visible:ring-indigo-500/40 focus-visible:border-indigo-500/40 focus-visible:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300 disabled:opacity-50"
            />
          </div>
        </div>

        {/* Email Input */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
            Email Address
          </label>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors duration-200">
              <Mail className="h-4 w-4" />
            </span>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="arjun@college.edu"
              autoComplete="email"
              required
              disabled={isAnyPending}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12 w-full rounded-xl border-white/5 bg-slate-950/60 text-slate-200 placeholder-slate-600 focus-visible:ring-1 focus-visible:ring-indigo-500/40 focus-visible:border-indigo-500/40 focus-visible:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300 disabled:opacity-50"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-1.5">
          <label htmlFor="password" className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
            Password
          </label>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors duration-200">
              <Lock className="h-4 w-4" />
            </span>
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="new-password"
              required
              disabled={isAnyPending}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10 h-12 w-full rounded-xl border-white/5 bg-slate-950/60 text-slate-200 placeholder-slate-600 focus-visible:ring-1 focus-visible:ring-indigo-500/40 focus-visible:border-indigo-500/40 focus-visible:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300 disabled:opacity-50"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword(!showPassword)}
              disabled={isAnyPending}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500 hover:text-slate-300 focus:outline-none transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4.5 w-4.5" aria-hidden="true" />
              ) : (
                <Eye className="h-4.5 w-4.5" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Real-time Password Strength Meter */}
          {password.length > 0 && (
            <div className="space-y-2 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 animate-in fade-in duration-300">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">Password Strength:</span>
                <span className={cn(
                  "font-bold uppercase tracking-widest text-[10px] px-2 py-0.5 rounded",
                  satisfiedCount === 5 ? "text-emerald-400 bg-emerald-950/40" :
                  satisfiedCount >= 3 ? "text-amber-400 bg-amber-950/40" :
                  "text-rose-400 bg-rose-950/40"
                )}>
                  {strengthLabel}
                </span>
              </div>
              
              {/* Strength Track */}
              <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-white/[0.02]">
                <div className={`h-full ${strengthColor} ${strengthWidth} transition-all duration-500 ease-out`} />
              </div>

              {/* Requirement Checklist */}
              <div className="grid gap-2 sm:grid-cols-2 mt-3 pt-2 border-t border-white/5">
                {criteria.map((c) => (
                  <div key={c.id} className="flex items-center gap-2 text-[10px] font-medium transition duration-200">
                    {c.met ? (
                      <span className="h-4 w-4 rounded-full bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center shrink-0">
                        <Check className="h-2.5 w-2.5 text-emerald-400" />
                      </span>
                    ) : (
                      <span className="h-4 w-4 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        <X className="h-2 w-2 text-slate-500" />
                      </span>
                    )}
                    <span className={c.met ? "text-emerald-300" : "text-slate-500"}>
                      {c.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password Input */}
        <div className="space-y-1.5">
          <label htmlFor="confirmPassword" className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
            Confirm Password
          </label>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors duration-200">
              <Lock className="h-4 w-4" />
            </span>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="new-password"
              required
              disabled={isAnyPending}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10 pr-10 h-12 w-full rounded-xl border-white/5 bg-slate-950/60 text-slate-200 placeholder-slate-600 focus-visible:ring-1 focus-visible:ring-indigo-500/40 focus-visible:border-indigo-500/40 focus-visible:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300 disabled:opacity-50"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isAnyPending}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500 hover:text-slate-300 focus:outline-none transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4.5 w-4.5" aria-hidden="true" />
              ) : (
                <Eye className="h-4.5 w-4.5" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Passwords Match Visualizer */}
          {confirmPassword.length > 0 && (
            <div className="flex items-center gap-1.5 pt-1 animate-in fade-in duration-200">
              {passwordsMatch ? (
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold uppercase tracking-wider">
                  <Check className="h-3 w-3 shadow-[0_0_5px_rgba(16,185,129,0.3)]" /> Passwords match
                </span>
              ) : (
                <span className="text-[10px] text-rose-400 flex items-center gap-1 font-bold uppercase tracking-wider">
                  <X className="h-3 w-3 shadow-[0_0_5px_rgba(244,63,94,0.3)]" /> Passwords do not match
                </span>
              )}
            </div>
          )}
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          disabled={isAnyPending || (password.length > 0 && satisfiedCount < 5) || passwordsMatch === false}
          className="relative w-full h-12 rounded-xl text-xs font-bold uppercase tracking-widest text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 shadow-[0_4px_25px_-5px_rgba(99,102,241,0.5)] hover:shadow-[0_8px_35px_-5px_rgba(99,102,241,0.7)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:hover:scale-100 disabled:pointer-events-none"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Sign Up
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 duration-200" />
            </>
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative flex py-2 items-center justify-center">
        <div className="flex-grow border-t border-white/5"></div>
        <span className="flex-shrink mx-2 whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 bg-[#070b19] px-2 sm:mx-4 sm:tracking-[0.25em] sm:px-2.5">
          Or continue with
        </span>
        <div className="flex-grow border-t border-white/5"></div>
      </div>

      {/* Custom Glowing Social buttons */}
      <div className="grid grid-cols-2 gap-4">
        <form onSubmit={handleGoogleLogin} className="w-full">
          <Button
            type="submit"
            disabled={isAnyPending}
            variant="outline"
            className="w-full h-11 rounded-xl border-white/5 bg-slate-950/40 hover:bg-slate-900/60 hover:border-cyan-500/30 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:text-white text-slate-300 transition-all duration-300 flex items-center justify-center gap-2 text-xs font-semibold disabled:opacity-50"
          >
            {isGooglePending ? (
              <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
            ) : (
              <>
                <Chrome className="h-4 w-4 text-cyan-400 fill-cyan-400/10" />
                Google
              </>
            )}
          </Button>
        </form>

        <form onSubmit={handleGithubLogin} className="w-full">
          <Button
            type="submit"
            disabled={isAnyPending}
            variant="outline"
            className="w-full h-11 rounded-xl border-white/5 bg-slate-950/40 hover:bg-slate-900/60 hover:border-purple-500/30 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] hover:text-white text-slate-300 transition-all duration-300 flex items-center justify-center gap-2 text-xs font-semibold disabled:opacity-50"
          >
            {isGithubPending ? (
              <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
            ) : (
              <>
                <Github className="h-4 w-4 text-purple-400 fill-purple-400/10" />
                GitHub
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Navigation Footer */}
      <p className="text-center text-sm text-slate-400 font-sans">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-bold text-indigo-400 hover:text-indigo-300 hover:underline underline-offset-4 transition"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
