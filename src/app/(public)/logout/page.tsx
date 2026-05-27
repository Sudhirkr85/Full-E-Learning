import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { makeMetadata } from "@/lib/site";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { LogoutForm } from "@/components/auth/logout-form";

export const metadata: Metadata = makeMetadata({
  title: "Sign Out",
  description: "End your active session securely.",
  path: "/logout",
  noIndex: true
});

export default async function LogoutPage() {
  const session = await auth();

  // Redirect to home if there is no active session
  if (!session?.user?.id) {
    redirect("/");
  }

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 overflow-hidden">
      {/* Immersive cinematic background */}
      <div className="absolute inset-0 bg-[#030614] -z-20" />
      <div className="absolute inset-0 bg-grid-cyber opacity-70 -z-10" />
      <div className="particles-bg -z-10" />
      
      {/* Glowing 3D depth halos */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[450px] rounded-full bg-gradient-to-br from-indigo-500/10 to-transparent blur-[110px] -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full bg-[#f43f5e]/5 blur-[90px] -z-10" />

      <Container className="max-w-md w-full px-4 relative z-10">
        
        {/* Glowing glassmorphic centered dialog */}
        <div className="w-full glass-card-premium p-6 sm:p-8 rounded-2xl relative overflow-hidden group shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] hover:shadow-[0_0_50px_rgba(244,63,94,0.08)] hover:border-white/10 transition-all duration-500">
          
          {/* Top animated laser border */}
          <div className="absolute top-0 left-0 w-full h-[1px] overflow-hidden bg-gradient-to-r from-transparent via-rose-500/30 to-transparent">
            <div className="w-full h-full animate-cyber-line-x bg-gradient-to-r from-transparent via-orange-400/50 to-transparent" />
          </div>

          {/* Bottom animated laser border */}
          <div className="absolute bottom-0 left-0 w-full h-[1px] overflow-hidden bg-gradient-to-r from-transparent via-rose-500/30 to-transparent">
            <div className="w-full h-full animate-cyber-line-x bg-gradient-to-r from-transparent via-rose-400/50 to-transparent" />
          </div>

          {/* Render interactive form */}
          <LogoutForm />

        </div>

      </Container>
    </section>
  );
}
