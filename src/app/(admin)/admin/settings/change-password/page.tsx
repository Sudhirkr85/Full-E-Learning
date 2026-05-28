import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { makeMetadata } from "@/lib/site";
import { ChangePasswordForm } from "./change-password-form";

export const metadata: Metadata = makeMetadata({
  title: "Change Password - Settings",
  description: "Securely update your administrator security credentials.",
  path: "/admin/settings/change-password",
  noIndex: true
});

export default async function ChangePasswordPage() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div>
        <Badge variant="secondary">Admin Settings</Badge>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white animate-fade-in">Change Password</h1>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
          Update your platform administrator account credentials securely. Please verify your current password before saving new access credentials.
        </p>
      </div>

      <ChangePasswordForm />
    </div>
  );
}
