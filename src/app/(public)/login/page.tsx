import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { makeMetadata, siteConfig } from "@/lib/site";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { Zap, Award, GraduationCap, Laptop, Sparkles } from "lucide-react";

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
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-10 md:py-16 overflow-hidden">
      {/* Visual cyber mesh background */}
      <div className="absolute inset-0 bg-[#020512] -z-20" />
      <div className="absolute inset-0 bg-grid-cyber opacity-60 -z-10" />
      <div className="particles-bg -z-10" />
      
      {/* Premium background mesh glow balls */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full bg-indigo-500/10 blur-[80px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 h-[350px] w-[350px] rounded-full bg-cyan-500/10 blur-[80px] -z-10" />

      <Container className="max-w-6xl w-full px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Widescreen Double Column split layout grid */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          
          {/* LEFT SIDE: Branding / Benefits Column (Desktop only, hidden on small screens) */}
          <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 flex-col space-y-8 pr-4">
            
            {/* Branding Logo */}
            <div className="flex items-center gap-2.5 animate-in fade-in duration-300">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 p-[1px] shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                <div className="flex h-full w-full items-center justify-center rounded-[15px] bg-[#0b0f1e] text-indigo-400">
                  <Zap className="h-4.5 w-4.5 fill-indigo-400/20" />
                </div>
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-white">
                {siteConfig.name}
              </span>
            </div>

            {/* High-impact Bold Headline */}
            <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-500 delay-100">
              <h2 className="font-display text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight text-white">
                Learn software engineering <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
                  the right way.
                </span>
              </h2>
              <p className="max-w-lg text-base leading-relaxed text-slate-400">
                Built explicitly for ambitious Indian students and developers to bridge the gap between college curricula and high-tier placement realities.
              </p>
            </div>

            {/* Benefit Showcase Card Deck */}
            <div className="grid gap-4 xl:max-w-xl animate-in fade-in slide-in-from-left-6 duration-600 delay-200">
              
              {/* Feature 1 */}
              <div className="flex gap-4 p-4 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm transition-all hover:bg-white/[0.04] hover:border-white/10 group duration-300">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 transition duration-300">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-200 group-hover:text-white transition">Placement-Focused Learning</h4>
                  <p className="text-xs leading-relaxed text-slate-400">Structured roadmaps, real-world patterns, and mock interviews matching top tech expectations.</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex gap-4 p-4 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm transition-all hover:bg-white/[0.04] hover:border-white/10 group duration-300">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition duration-300">
                  <Laptop className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-200 group-hover:text-white transition">Unified Interactive Ecosystem</h4>
                  <p className="text-xs leading-relaxed text-slate-400">Access video courses, code playgrounds, assessments, achievements, and custom digital store purchases.</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex gap-4 p-4 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm transition-all hover:bg-white/[0.04] hover:border-white/10 group duration-300">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20 group-hover:scale-110 transition duration-300">
                  <Award className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-200 group-hover:text-white transition">Industrial Credentials</h4>
                  <p className="text-xs leading-relaxed text-slate-400">Earn direct digital certificates to showcase your competence on LinkedIn and resumes.</p>
                </div>
              </div>

            </div>

            {/* Indian trust banner details */}
            <div className="flex items-center gap-2 pt-2 text-xs text-indigo-400 font-semibold uppercase tracking-wider animate-in fade-in duration-500 delay-300">
              <Sparkles className="h-4 w-4 text-cyan-400 fill-cyan-400/20" />
              <span>Empowering 10,000+ Indian Developers Nationwide</span>
            </div>

          </div>

          {/* RIGHT SIDE: Auth Card column (Takes full width on mobile, stacked first) */}
          <div className="col-span-12 lg:col-span-6 xl:col-span-5 flex justify-center w-full">
            
            {/* Sleek card container wrapper */}
            <div className="w-full max-w-[460px] glass-card-premium p-6 sm:p-8 rounded-2xl relative overflow-hidden group shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)] hover:border-indigo-500/20 duration-500">
              {/* Outer decorative laser border animation trigger */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"></div>
              
              {/* Load interactive client component */}
              <LoginForm errorMessage={errorMessage} successMessage={successMessage} />

            </div>

          </div>
          
        </div>
      </Container>
    </section>
  );
}