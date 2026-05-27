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
        // Redirects are handled by Next.js throwing errors in actions
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
    <div className="w-full space-y-6">
      <div className="flex flex-col space-y-2 text-center md:text-left">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-white md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
          Welcome back
        </h1>
        <p className="text-sm text-slate-400">
          Enter your credentials to access your placement dashboard.
        </p>
      </div>

      {errorMessage && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3.5 text-sm text-rose-400 flex items-center gap-2 animate-in fade-in-50 slide-in-from-top-1 duration-200">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0 animate-pulse" />
          <p>{errorMessage}</p>
        </div>
      )}

      {successMessage && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3.5 text-sm text-emerald-400 flex items-center gap-2 animate-in fade-in-50 slide-in-from-top-1 duration-200">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
          <p>{successMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Email Address
          </label>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors duration-200">
              <Mail className="h-4.5 w-4.5" />
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
              className="pl-10 h-12 w-full rounded-xl border-white/10 bg-slate-950/40 text-slate-200 placeholder-slate-600 focus-visible:ring-1 focus-visible:ring-indigo-500/40 focus-visible:border-indigo-500/50 transition-all duration-300 disabled:opacity-50"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-indigo-400 hover:text-indigo-300 hover:underline underline-offset-4 transition"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors duration-200">
              <Lock className="h-4.5 w-4.5" />
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
              className="pl-10 pr-10 h-12 w-full rounded-xl border-white/10 bg-slate-950/40 text-slate-200 placeholder-slate-600 focus-visible:ring-1 focus-visible:ring-indigo-500/40 focus-visible:border-indigo-500/50 transition-all duration-300 disabled:opacity-50"
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

        {/* Submit button */}
        <Button
          type="submit"
          disabled={isAnyPending}
          className="relative w-full h-12 rounded-xl text-sm font-semibold tracking-wide text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 shadow-[0_4px_25px_-5px_rgba(99,102,241,0.5)] hover:shadow-[0_6px_30px_-5px_rgba(99,102,241,0.7)] hover:from-indigo-500 hover:via-purple-500 hover:to-cyan-500 hover:scale-[1.01] active:scale-[0.99] active:duration-75 transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden group disabled:opacity-50 disabled:hover:scale-100 disabled:pointer-events-none"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Sign In
              <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1 duration-200" />
            </>
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative flex py-2 items-center justify-center">
        <div className="flex-grow border-t border-white/5"></div>
        <span className="flex-shrink mx-4 text-xs font-semibold uppercase tracking-widest text-slate-500 bg-[#070b19] px-2">
          Or continue with
        </span>
        <div className="flex-grow border-t border-white/5"></div>
      </div>

      {/* Social login */}
      <div className="grid grid-cols-2 gap-4">
        <form onSubmit={handleGoogleLogin} className="w-full">
          <Button
            type="submit"
            variant="outline"
            disabled={isAnyPending}
            className="w-full h-11 rounded-xl border-white/10 bg-slate-950/20 hover:bg-slate-900/80 hover:text-white text-slate-300 transition-all duration-300 flex items-center justify-center gap-2 text-xs font-semibold disabled:opacity-50"
          >
            {isGooglePending ? (
              <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
            ) : (
              <>
                <Chrome className="h-4 w-4 text-indigo-400 fill-indigo-400/10" />
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
            className="w-full h-11 rounded-xl border-white/10 bg-slate-950/20 hover:bg-slate-900/80 hover:text-white text-slate-300 transition-all duration-300 flex items-center justify-center gap-2 text-xs font-semibold disabled:opacity-50"
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

      {/* Navigation footer */}
      <p className="text-center text-sm text-slate-400">
        New to the platform?{" "}
        <Link
          href="/register"
          className="font-semibold text-indigo-400 hover:text-indigo-300 hover:underline underline-offset-4 transition"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
