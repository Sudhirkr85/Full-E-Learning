"use client";

import React, { useState, useTransition, useEffect } from "react";
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

  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: "Empty", color: "bg-slate-850", shadow: "" });
  const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null);

  const [isPending, startTransition] = useTransition();
  const [isGooglePending, startGoogleTransition] = useTransition();
  const [isGithubPending, startGithubTransition] = useTransition();

  const isAnyPending = isPending || isGooglePending || isGithubPending;

  // Real-time password strength checker
  useEffect(() => {
    if (!password) {
      setPasswordStrength({ score: 0, label: "Empty", color: "bg-slate-800", shadow: "" });
      return;
    }

    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    let label = "Weak";
    let color = "bg-rose-500";
    let shadow = "shadow-[0_0_10px_rgba(244,63,94,0.3)]";

    if (score === 2) {
      label = "Fair";
      color = "bg-orange-500";
      shadow = "shadow-[0_0_10px_rgba(249,115,22,0.3)]";
    } else if (score === 3) {
      label = "Good";
      color = "bg-indigo-500";
      shadow = "shadow-[0_0_10px_rgba(99,102,241,0.3)]";
    } else if (score === 4) {
      label = "Strong";
      color = "bg-emerald-500";
      shadow = "shadow-[0_0_10px_rgba(16,185,129,0.3)]";
    }

    setPasswordStrength({ score, label, color, shadow });
  }, [password]);

  // Real-time password matching check
  useEffect(() => {
    if (!confirmPassword) {
      setPasswordsMatch(null);
      return;
    }
    setPasswordsMatch(password === confirmPassword);
  }, [password, confirmPassword]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isAnyPending) return;

    if (password !== confirmPassword) {
      setPasswordsMatch(false);
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

          {/* Password Strength Indicator */}
          {password && (
            <div className="space-y-1.5 pt-1.5 animate-in fade-in duration-300">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">Strength</span>
                <span className={cn(
                  "font-bold uppercase tracking-widest text-[10px]",
                  passwordStrength.score <= 1 && "text-rose-400",
                  passwordStrength.score === 2 && "text-orange-400",
                  passwordStrength.score === 3 && "text-indigo-400",
                  passwordStrength.score === 4 && "text-emerald-400"
                )}>
                  {passwordStrength.label}
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-950 overflow-hidden flex gap-0.5 border border-white/[0.02]">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={cn(
                      "h-full flex-1 transition-all duration-500",
                      step <= passwordStrength.score ? `${passwordStrength.color} ${passwordStrength.shadow}` : "bg-slate-900"
                    )}
                  />
                ))}
              </div>
              {password.length < 8 && (
                <p className="text-[10px] text-rose-400/90 flex items-center gap-1 font-medium">
                  <span className="h-1 w-1 rounded-full bg-rose-400 shrink-0" />
                  Must be at least 8 characters.
                </p>
              )}
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
          {confirmPassword && (
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
          disabled={isAnyPending || (confirmPassword !== "" && !passwordsMatch)}
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
