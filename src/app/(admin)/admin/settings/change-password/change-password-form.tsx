"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { changePasswordAction } from "./actions";
import { Check, X, ShieldAlert, Key, ShieldCheck } from "lucide-react";

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Client-side real-time strong password checklist
  const criteria = [
    { id: "length", label: "At least 8 characters", met: newPassword.length >= 8 },
    { id: "upper", label: "One uppercase letter (A-Z)", met: /[A-Z]/.test(newPassword) },
    { id: "lower", label: "One lowercase letter (a-z)", met: /[a-z]/.test(newPassword) },
    { id: "number", label: "One number (0-9)", met: /[0-9]/.test(newPassword) },
    { id: "special", label: "One special character (e.g., @, $, !, %)", met: /[^A-Za-z0-9]/.test(newPassword) },
  ];

  const satisfiedCount = criteria.filter((c) => c.met).length;

  let strengthLabel = "Very Weak";
  let strengthColor = "bg-rose-500";
  let strengthWidth = "w-0";

  if (newPassword.length > 0) {
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

  const isPasswordMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Client-side validation checks
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    if (satisfiedCount < 5) {
      setError("Please satisfy all password strength requirements.");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append("currentPassword", currentPassword);
      formData.append("newPassword", newPassword);
      formData.append("confirmPassword", confirmPassword);

      const res = await changePasswordAction(null, formData);

      if (res.error) {
        setError(res.error);
      } else if (res.success) {
        setSuccess(res.success);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    });
  };

  return (
    <Card className="bg-[#090d20]/60 border-white/5 backdrop-blur-xl relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute right-0 top-0 -z-10 h-24 w-24 rounded-full bg-cyan-500/5 blur-2xl"></div>

      <CardHeader>
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <Key className="h-5 w-5 text-indigo-400" />
          Admin Security Credentials
        </CardTitle>
        <CardDescription className="text-slate-400">
          Verify your current password before setting new platform administrative credentials.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Current Password */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Current Password</label>
            <Input
              type="password"
              placeholder="Enter current password"
              className="bg-white/5 border-white/10 text-white placeholder-slate-500 focus-visible:ring-indigo-500 h-11"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">New Password</label>
            <Input
              type="password"
              placeholder="Enter new password"
              className="bg-white/5 border-white/10 text-white placeholder-slate-500 focus-visible:ring-indigo-500 h-11"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          {/* Real-time Password Strength Meter */}
          {newPassword.length > 0 && (
            <div className="space-y-2 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 animate-fade-in">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-semibold">Password Strength:</span>
                <span className={`font-bold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded ${
                  satisfiedCount === 5 ? "text-emerald-400 bg-emerald-950/40" :
                  satisfiedCount >= 3 ? "text-amber-400 bg-amber-950/40" :
                  "text-rose-400 bg-rose-950/40"
                }`}>
                  {strengthLabel}
                </span>
              </div>
              
              {/* Strength Track */}
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
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

          {/* Confirm New Password */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Confirm New Password</label>
            <Input
              type="password"
              placeholder="Confirm new password"
              className="bg-white/5 border-white/10 text-white placeholder-slate-500 focus-visible:ring-indigo-500 h-11"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {confirmPassword.length > 0 && (
              <div className="flex items-center gap-1.5 mt-1.5 animate-fade-in text-[10px]">
                {isPasswordMatch ? (
                  <>
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Passwords match successfully.</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="h-3.5 w-3.5 text-rose-400 animate-pulse" />
                    <span className="text-rose-400 font-semibold">Passwords do not match yet.</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Message Prompts */}
          {error && (
            <div className="rounded-xl border border-rose-500/10 bg-rose-500/5 px-4 py-2.5 text-xs font-semibold text-rose-400 animate-fade-in">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/5 px-4 py-2.5 text-xs font-semibold text-emerald-400 animate-fade-in">
              {success}
            </div>
          )}

          <Button
            type="submit"
            disabled={isPending || (newPassword.length > 0 && satisfiedCount < 5) || !isPasswordMatch}
            className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl border border-white/10 shadow-[0_0_15px_rgba(99,102,241,0.2)] disabled:opacity-50 transition duration-200"
          >
            {isPending ? "Updating Security Credentials..." : "Update Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
