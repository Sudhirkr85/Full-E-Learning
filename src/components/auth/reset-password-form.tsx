"use client";

import React, { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, Loader2, ArrowRight, Check, X, ShieldAlert, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { resetPasswordAction } from "@/app/(public)/reset-password/actions";

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: "Empty", color: "bg-slate-800", shadow: "" });
  const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null);

  const [isPending, startTransition] = useTransition();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    setSuccessMessage(null);
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setPasswordsMatch(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      try {
        const result = await resetPasswordAction(token, formData);
        if (result.success) {
          setSuccessMessage(result.message);
          // Redirect to login page after 2.5 seconds
          setTimeout(() => {
            router.push("/login?registered=1");
          }, 2500);
        } else {
          setErrorMessage(result.message);
        }
      } catch (err) {
        console.error("Reset password form submit error:", err);
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    });
  };

  return (
    <div className="w-full space-y-6 relative z-10">
      
      {/* Icon header */}
      <div className="text-center space-y-2">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)] animate-pulse">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h2 className="font-display text-2xl font-extrabold text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
          Reset Password
        </h2>
        <p className="text-sm text-slate-400 font-sans leading-relaxed max-w-xs mx-auto">
          Choose a new, secure password for your developer account.
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
          
          {/* New Password Input */}
          <div className="space-y-1.5 text-left">
            <label htmlFor="password" className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400 block px-0.5">
              New Password
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
                required
                disabled={isPending}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 h-12 w-full rounded-xl border-white/5 bg-slate-950/60 text-slate-200 placeholder-slate-600 focus-visible:ring-1 focus-visible:ring-indigo-500/40 focus-visible:border-indigo-500/40 focus-visible:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300 disabled:opacity-50"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword(!showPassword)}
                disabled={isPending}
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
          <div className="space-y-1.5 text-left">
            <label htmlFor="confirmPassword" className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400 block px-0.5">
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
                required
                disabled={isPending}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 pr-10 h-12 w-full rounded-xl border-white/5 bg-slate-950/60 text-slate-200 placeholder-slate-600 focus-visible:ring-1 focus-visible:ring-indigo-500/40 focus-visible:border-indigo-500/40 focus-visible:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300 disabled:opacity-50"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isPending}
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
            disabled={isPending || (confirmPassword !== "" && !passwordsMatch) || password.length < 8}
            className="relative w-full h-12 rounded-xl text-xs font-bold uppercase tracking-widest text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 shadow-[0_4px_25px_-5px_rgba(99,102,241,0.5)] hover:shadow-[0_8px_35px_-5px_rgba(99,102,241,0.7)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:hover:scale-100 disabled:pointer-events-none"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Update Password
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 duration-200" />
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
          Return to Login
        </Link>
      </div>
    </div>
  );
}
