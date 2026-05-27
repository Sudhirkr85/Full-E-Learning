"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Loader2, Chrome, Github, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { loginAction, loginWithGoogleAction, loginWithGithubAction } from "@/app/(public)/login/actions";

interface LoginFormProps {
  errorMessage?: string | null;
  successMessage?: string | null;
}

export function LoginForm({ errorMessage, successMessage }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [isPending, startTransition] = useTransition();
  const [isGooglePending, startGoogleTransition] = useTransition();
  const [isGithubPending, startGithubTransition] = useTransition();

  const isAnyPending = isPending || isGooglePending || isGithubPending;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isAnyPending) return;

    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await loginAction(formData);
      } catch (err) {
        console.error("Login submission error:", err);
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
          Welcome back
        </h1>
        <p className="text-sm text-slate-400 font-sans tracking-wide">
          Enter your credentials to access your secure compiler workspace.
        </p>
      </div>

      {/* Alert states */}
      {errorMessage && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-950/20 px-4 py-3.5 text-sm text-rose-400 flex items-center gap-2.5 animate-in fade-in duration-300">
          <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
          <p className="font-medium tracking-wide">{errorMessage}</p>
        </div>
      )}

      {successMessage && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 px-4 py-3.5 text-sm text-emerald-400 flex items-center gap-2.5 animate-in fade-in duration-300">
          <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          <p className="font-medium tracking-wide">{successMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        
        {/* Email Input */}
        <div className="space-y-2">
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
              placeholder="you@college.edu"
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
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 hover:text-indigo-300 transition duration-200"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors duration-200">
              <Lock className="h-4 w-4" />
            </span>
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
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
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isAnyPending}
          className="relative w-full h-12 rounded-xl text-xs font-bold uppercase tracking-widest text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 shadow-[0_4px_25px_-5px_rgba(99,102,241,0.5)] hover:shadow-[0_8px_35px_-5px_rgba(99,102,241,0.7)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:hover:scale-100 disabled:pointer-events-none"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Sign In
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
            variant="outline"
            disabled={isAnyPending}
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
            variant="outline"
            disabled={isAnyPending}
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
        New here?{" "}
        <Link
          href="/register"
          className="font-bold text-indigo-400 hover:text-indigo-300 hover:underline underline-offset-4 transition"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
