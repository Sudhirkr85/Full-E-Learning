import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { makeMetadata } from "@/lib/site";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/components/auth/profile-form";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = makeMetadata({
  title: "My Account",
  description: "Manage your developer profile preferences.",
  path: "/profile",
  noIndex: true,
});

export default async function ProfilePage() {
  // Enforce session check on the server
  const currentUser = await requireUser();

  // Query metadata directly from the database to obtain phone settings
  const dbUser = await prisma.user.findUnique({
    where: { id: currentUser.id },
    select: { metadata: true },
  });

  // Safely extract the phone/mobile number from user's metadata JSON
  const metadata = (dbUser?.metadata as Record<string, any>) || {};
  const phone = metadata.phone || "";

  const safeUserData = {
    name: currentUser.name,
    email: currentUser.email,
    phone: phone,
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#030611] text-slate-100 relative overflow-hidden font-sans">
      <SiteHeader />

      <main className="flex-1 relative py-12 sm:py-16 md:py-20 flex items-center justify-center">
        {/* Cinematic background lighting nodes */}
        <div className="absolute inset-0 bg-grid-cyber opacity-70 -z-10" />
        <div className="absolute top-[10%] left-[-10%] -z-10 h-96 w-96 rounded-full bg-indigo-500/5 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-10%] -z-10 h-96 w-96 rounded-full bg-cyan-500/5 blur-[120px]" />

        <Container className="max-w-md w-full px-4 relative z-10">
          {/* Header design tags */}
          <div className="text-center mb-6 space-y-2">
            <Badge className="bg-indigo-950/60 border-indigo-500/30 text-indigo-300 text-xs px-3 py-1 rounded-full uppercase tracking-wider">
              Student Profile
            </Badge>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-white">
              My Profile
            </h1>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Configure your credentials, personal info, and mobile number.
            </p>
          </div>

          {/* Premium glassmorphic double-scrolling laser card */}
          <div className="w-full glass-card-premium p-6 sm:p-8 rounded-2xl relative overflow-hidden group shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] hover:shadow-[0_0_50px_rgba(99,102,241,0.08)] hover:border-white/10 transition-all duration-500">
            
            {/* Top animated laser border */}
            <div className="absolute top-0 left-0 w-full h-[1px] overflow-hidden bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent">
              <div className="w-full h-full animate-cyber-line-x bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
            </div>

            {/* Bottom animated laser border */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] overflow-hidden bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent">
              <div className="w-full h-full animate-cyber-line-x bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent" />
            </div>

            {/* Render interactive profile preferences form */}
            <ProfileForm user={safeUserData} />

          </div>
        </Container>
      </main>

      <SiteFooter />
    </div>
  );
}