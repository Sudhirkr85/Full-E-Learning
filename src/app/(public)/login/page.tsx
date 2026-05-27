import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { makeMetadata, siteConfig } from "@/lib/site";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { Zap, Award, GraduationCap, Laptop, Sparkles, Target } from "lucide-react";

export const metadata: Metadata = makeMetadata({
  title: "Login",
  description: "Secure login page for the LMS platform.",
  path: "/login",
  noIndex: true
});

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
    registered?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await auth();

  if (session?.user?.id) {
    redirect("/dashboard");
  }

  const params = searchParams ? await searchParams : undefined;
  const errorMessage = params?.error === "invalid_credentials" 
    ? "Invalid email or password." 
    : params?.error === "invalid_input" 
    ? "Check the form fields and try again." 
    : params?.error === "oauth_error"
    ? "An error occurred during social login. Please try again or check your account settings."
    : null;
  const successMessage = params?.registered === "1" ? "Account created. You can sign in now." : null;

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-start justify-center overflow-x-hidden py-6 sm:py-10 md:items-center md:py-16">
      {/* Immersive cinematic background */}
      <div className="absolute inset-0 bg-[#030614] -z-20" />
      <div className="absolute inset-0 bg-grid-cyber opacity-70 -z-10" />
      <div className="particles-bg -z-10 animate-pulse duration-10000" />
      
      {/* High-end ambient backing glow nodes */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[450px] rounded-full bg-gradient-to-br from-indigo-500/10 to-transparent blur-[110px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 h-[450px] w-[450px] rounded-full bg-gradient-to-br from-cyan-500/10 to-transparent blur-[110px] -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-[#8b5cf6]/5 blur-[150px] -z-10" />

      <Container className="max-w-6xl w-full px-3 sm:px-6 lg:px-8 relative z-10">
        <div className="grid gap-6 lg:gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* LEFT SIDE: Cinematic Branding / Trust Column */}
          <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 flex-col space-y-8 pr-6">
            
            {/* Immersive Header Badge */}
            <div className="flex items-center gap-2.5 animate-in fade-in duration-300">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 p-[1.5px] shadow-[0_0_25px_rgba(99,102,241,0.35)]">
                <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#0b0f1e] text-indigo-400">
                  <Zap className="h-4.5 w-4.5 fill-indigo-400/25" />
                </div>
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-white">
                {siteConfig.name}
              </span>
            </div>

            {/* Premium Typographical Title */}
            <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-500 delay-100">
              <h2 className="font-display text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight text-white">
                Learn software engineering <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 shadow-sm">
                  the right way.
                </span>
              </h2>
              <p className="max-w-lg text-sm leading-relaxed text-slate-400 font-sans tracking-wide">
                Bridging the critical gap between average state-college curriculum and modern high-end software development roles at global tech giants.
              </p>
            </div>

            {/* Gorgeous Placement Ticker (High-Impact Trust Addition) */}
            <div className="p-[1px] rounded-2xl bg-gradient-to-r from-white/5 via-white/[0.02] to-transparent xl:max-w-md shadow-[0_10px_30px_rgba(0,0,0,0.4)] animate-in fade-in slide-in-from-left-5 duration-500 delay-150">
              <div className="bg-slate-950/60 backdrop-blur-xl p-4 rounded-[15px] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Live Placements Track</span>
                  </div>
                  <span className="text-[9px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/25 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Indian Tech Hubs
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Highest Package</span>
                    <p className="text-2xl font-extrabold font-display bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400">
                      ₹45 LPA
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Average Package</span>
                    <p className="text-2xl font-extrabold font-display bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                      ₹12.4 LPA
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Immersive Benefit Showcase Deck */}
            <div className="grid gap-4 xl:max-w-xl animate-in fade-in slide-in-from-left-6 duration-600 delay-200">
              
              {/* Feature 1 */}
              <div className="flex gap-4 p-4 rounded-2xl border border-white/5 bg-white/[0.01] backdrop-blur-sm transition-all hover:bg-white/[0.03] hover:border-white/10 group duration-300 shadow-[0_5px_15px_rgba(0,0,0,0.3)]">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all duration-300">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-200 group-hover:text-white transition">Placement-Focused Modules</h4>
                  <p className="text-xs leading-relaxed text-slate-400 font-sans">Custom curriculum engineered specifically to crack senior developer interviews.</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex gap-4 p-4 rounded-2xl border border-white/5 bg-white/[0.01] backdrop-blur-sm transition-all hover:bg-white/[0.03] hover:border-white/10 group duration-300 shadow-[0_5px_15px_rgba(0,0,0,0.3)]">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all duration-300">
                  <Laptop className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-200 group-hover:text-white transition">Cinematic Coding Dashboard</h4>
                  <p className="text-xs leading-relaxed text-slate-400 font-sans">Simulated technical assessments, code playground, and active developer pipelines.</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex gap-4 p-4 rounded-2xl border border-white/5 bg-white/[0.01] backdrop-blur-sm transition-all hover:bg-white/[0.03] hover:border-white/10 group duration-300 shadow-[0_5px_15px_rgba(0,0,0,0.3)]">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all duration-300">
                  <Award className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-200 group-hover:text-white transition">LinkedIn Verifiable Certificates</h4>
                  <p className="text-xs leading-relaxed text-slate-400 font-sans">Verify 100% course completions with cryptographically signed digital certificates.</p>
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT SIDE: Auth Card column */}
          <div className="col-span-12 lg:col-span-6 xl:col-span-5 flex justify-center w-full relative">
            
            {/* Cinematic pulsing backing shadow glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[105%] w-[105%] rounded-3xl bg-indigo-500/5 blur-[50px] -z-10 group-hover:bg-indigo-500/10 transition-all duration-500" />

            {/* Glowing card border container */}
            <div className="w-full max-w-[460px] glass-card-premium p-4 sm:p-8 rounded-2xl relative overflow-hidden group shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] hover:border-white/10 hover:shadow-[0_0_50px_rgba(99,102,241,0.1)] transition-all duration-500">
              
              {/* Top animated laser border */}
              <div className="absolute top-0 left-0 w-full h-[1px] overflow-hidden bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent">
                <div className="w-full h-full animate-cyber-line-x bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
              </div>

              {/* Bottom animated laser border */}
              <div className="absolute bottom-0 left-0 w-full h-[1px] overflow-hidden bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent">
                <div className="w-full h-full animate-cyber-line-x bg-gradient-to-r from-transparent via-purple-400/50 to-transparent" />
              </div>
              
              <LoginForm errorMessage={errorMessage} successMessage={successMessage} />

            </div>

          </div>
          
        </div>
      </Container>
    </section>
  );
}
