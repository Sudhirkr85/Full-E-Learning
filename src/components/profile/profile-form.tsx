"use client";

import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  User, 
  Mail, 
  Phone, 
  FileText, 
  Save, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Pencil,
  X
} from "lucide-react";

type ProfileData = {
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  bio: string | null;
  image: string | null;
  role: string;
  createdAt: string;
};

type ProfileFormProps = {
  user: ProfileData;
};

export function ProfileForm({ user }: ProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    name: user.name ?? "",
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    email: user.email,
    phone: user.phone ?? "",
    bio: user.bio ?? ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (status !== "idle") setStatus("idle");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user.name ?? "",
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      email: user.email,
      phone: user.phone ?? "",
      bio: user.bio ?? ""
    });
    setStatus("idle");
    setErrorMessage("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("idle");
    setErrorMessage("");

    startTransition(async () => {
      try {
        const res = await fetch("/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });

        if (!res.ok) {
          const data = await res.json();
          setStatus("error");
          setErrorMessage(data.error || "Failed to update profile.");
          return;
        }

        setStatus("success");
        setIsEditing(false);

        // Auto-dismiss success after 4s
        setTimeout(() => setStatus("idle"), 4000);
      } catch {
        setStatus("error");
        setErrorMessage("Network error. Please try again.");
      }
    });
  };

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const initials = (user.name ?? user.email).slice(0, 2).toUpperCase();

  return (
    <div className="space-y-8">
      {/* Profile Header Card */}
      <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-[#0a0f24] to-[#040715] p-6">
        {/* Ambient Glow */}
        <div className="absolute right-0 top-0 -z-10 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl"></div>
        <div className="absolute left-0 bottom-0 -z-10 h-32 w-32 rounded-full bg-cyan-500/5 blur-2xl"></div>

        <div className="flex flex-col sm:flex-row items-center gap-5">
          {/* Avatar */}
          {user.image ? (
            <img
              src={user.image}
              alt={user.name ?? "Profile"}
              className="h-20 w-20 rounded-2xl border-2 border-indigo-500/20 object-cover shadow-[0_0_20px_rgba(99,102,241,0.15)]"
            />
          ) : (
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-600 flex items-center justify-center text-white text-2xl font-extrabold shadow-[0_0_20px_rgba(99,102,241,0.2)] border border-white/10">
              {initials}
            </div>
          )}

          <div className="text-center sm:text-left space-y-1.5">
            <h2 className="text-xl font-extrabold text-white font-display tracking-tight">
              {user.name ?? user.email}
            </h2>
            <p className="text-xs text-slate-400">{user.email}</p>
            <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                {user.role}
              </span>
              <span className="text-[10px] text-slate-500">
                Member since {memberSince}
              </span>
            </div>
          </div>

          {/* Edit / Cancel Button */}
          <div className="sm:ml-auto shrink-0">
            {isEditing ? (
              <Button
                type="button"
                onClick={handleCancel}
                variant="outline"
                className="border-white/10 bg-slate-950/40 hover:bg-slate-900/60 text-slate-300 hover:text-white rounded-xl text-xs gap-1.5"
              >
                <X className="h-3.5 w-3.5" />
                Cancel
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold hover:from-indigo-500 hover:to-cyan-500 rounded-xl text-xs gap-1.5 shadow-[0_0_15px_rgba(99,102,241,0.2)] transition duration-300"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Status Banners */}
      {status === "success" && (
        <div className="flex items-center gap-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-xs font-semibold text-emerald-300 animate-in fade-in slide-in-from-top-2 duration-300">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          Profile updated successfully!
        </div>
      )}
      {status === "error" && (
        <div className="flex items-center gap-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-3 text-xs font-semibold text-rose-300 animate-in fade-in slide-in-from-top-2 duration-300">
          <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
          {errorMessage}
        </div>
      )}

      {/* Form / Read-Only Grid */}
      <form onSubmit={handleSubmit}>
        <div className="rounded-2xl border border-white/5 bg-[#090d22]/50 p-6 space-y-6">
          <div className="flex items-center gap-2 mb-1">
            <User className="h-4 w-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Personal Information</h3>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {/* Display Name */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <User className="h-3 w-3" />
                Display Name
              </label>
              {isEditing ? (
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your display name"
                  className="bg-slate-950/60 border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-indigo-500/20"
                />
              ) : (
                <p className="text-sm text-white font-medium py-2.5 px-4 rounded-xl bg-white/[0.02] border border-white/5">
                  {formData.name || <span className="text-slate-500 italic">Not set</span>}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="h-3 w-3" />
                Email Address
              </label>
              {isEditing ? (
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                  className="bg-slate-950/60 border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-indigo-500/20"
                />
              ) : (
                <p className="text-sm text-white font-medium py-2.5 px-4 rounded-xl bg-white/[0.02] border border-white/5">
                  {formData.email}
                </p>
              )}
            </div>

            {/* First Name */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <User className="h-3 w-3" />
                First Name
              </label>
              {isEditing ? (
                <Input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  className="bg-slate-950/60 border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-indigo-500/20"
                />
              ) : (
                <p className="text-sm text-white font-medium py-2.5 px-4 rounded-xl bg-white/[0.02] border border-white/5">
                  {formData.firstName || <span className="text-slate-500 italic">Not set</span>}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <User className="h-3 w-3" />
                Last Name
              </label>
              {isEditing ? (
                <Input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  className="bg-slate-950/60 border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-indigo-500/20"
                />
              ) : (
                <p className="text-sm text-white font-medium py-2.5 px-4 rounded-xl bg-white/[0.02] border border-white/5">
                  {formData.lastName || <span className="text-slate-500 italic">Not set</span>}
                </p>
              )}
            </div>

            {/* Phone / Mobile */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="h-3 w-3" />
                Mobile Number
              </label>
              {isEditing ? (
                <Input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="bg-slate-950/60 border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-indigo-500/20"
                />
              ) : (
                <p className="text-sm text-white font-medium py-2.5 px-4 rounded-xl bg-white/[0.02] border border-white/5">
                  {formData.phone || <span className="text-slate-500 italic">Not set</span>}
                </p>
              )}
            </div>

            {/* Bio (full width) */}
            <div className="space-y-2 sm:col-span-2">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="h-3 w-3" />
                Bio
              </label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  maxLength={500}
                  placeholder="Tell us about yourself..."
                  className="flex w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white ring-offset-background placeholder:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                />
              ) : (
                <p className="text-sm text-white font-medium py-2.5 px-4 rounded-xl bg-white/[0.02] border border-white/5 min-h-[60px]">
                  {formData.bio || <span className="text-slate-500 italic">No bio added yet</span>}
                </p>
              )}
              {isEditing && (
                <p className="text-[10px] text-slate-500 text-right">{formData.bio.length}/500</p>
              )}
            </div>
          </div>

          {/* Save Button */}
          {isEditing && (
            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={isPending}
                className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold hover:from-indigo-500 hover:to-cyan-500 rounded-xl px-6 py-5 shadow-[0_0_20px_rgba(99,102,241,0.3)] transition duration-300 hover:scale-[1.02] active:scale-[0.98] gap-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
