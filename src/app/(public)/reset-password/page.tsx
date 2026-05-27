import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { makeMetadata } from "@/lib/site";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { ArrowLeft, ShieldAlert } from "lucide-react";

export const metadata: Metadata = makeMetadata({
  title: "Reset Password",
  description: "Set a new password for your account.",
  path: "/reset-password",
  noIndex: true,
});

type ResetPasswordPageProps = {
  searchParams?: Promise<{
    token?: string;
  }>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const session = await auth();

  // Redirect to dashboard if already logged in
  if (session?.user?.id) {
    redirect("/dashboard");
  }

  const params = searchParams ? await searchParams : undefined;
  const token = params?.token || "";

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 overflow-hidden">
      {/* Immersive cinematic background */}
      <div className="absolute inset-0 bg-[#030614] -z-20" />
      <div className="absolute inset-0 bg-grid-cyber opacity-70 -z-10" />
      <div className="particles-bg -z-10" />
      
      {/* Glowing 3D depth halos */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[450px] rounded-full bg-gradient-to-br from-indigo-500/10 to-transparent blur-[110px] -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full bg-cyan-500/5 blur-[90px] -z-10" />

      <Container className="max-w-md w-full px-4 relative z-10">
        
        {/* Glowing glassmorphic centered card */}
        <div className="w-full glass-card-premium p-6 sm:p-8 rounded-2xl relative overflow-hidden group shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] hover:shadow-[0_0_50px_rgba(6,182,212,0.08)] hover:border-white/10 transition-all duration-500">
          
          {/* Top animated laser border */}
          <div className="absolute top-0 left-0 w-full h-[1px] overflow-hidden bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent">
            <div className="w-full h-full animate-cyber-line-x bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent" />
          </div>

          {/* Bottom animated laser border */}
          <div className="absolute bottom-0 left-0 w-full h-[1px] overflow-hidden bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent">
            <div className="w-full h-full animate-cyber-line-x bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent" />
          </div>

          {token ? (
            /* Render interactive form if token is present */
            <ResetPasswordForm token={token} />
          ) : (
            /* Show descriptive error state if reset token is missing */
            <div className="space-y-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.15)] animate-bounce duration-1000">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h2 className="font-display text-2xl font-extrabold text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
                  Invalid Request
                </h2>
                <p className="text-sm text-slate-400 font-sans leading-relaxed max-w-sm mx-auto">
                  A secure password reset token is required to access this portal. Please request a new verification link.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/forgot-password"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors group"
                >
                  <ArrowLeft className="h-3.5 w-3.5 transition group-hover:-translate-x-0.5" />
                  Request Reset Link
                </Link>
              </div>
            </div>
          )}

        </div>

      </Container>
    </section>
  );
}
