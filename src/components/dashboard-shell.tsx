"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import { ChevronRight, LayoutDashboard, Compass, ReceiptText, ShieldQuestion, ArrowLeft } from "lucide-react";

type NavItem = {
  label: string;
  href: string;
};

type DashboardShellProps = {
  title: string;
  description: string;
  nav: NavItem[];
  children: ReactNode;
};

export function DashboardShell({ title, description, nav, children }: DashboardShellProps) {
  const pathname = usePathname();

  // Helper to map icons based on label
  const getNavIcon = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes("overview")) return <LayoutDashboard className="h-4 w-4 shrink-0" />;
    if (l.includes("course")) return <Compass className="h-4 w-4 shrink-0" />;
    if (l.includes("order")) return <ReceiptText className="h-4 w-4 shrink-0" />;
    if (l.includes("ticket") || l.includes("support")) return <ShieldQuestion className="h-4 w-4 shrink-0" />;
    return <LayoutDashboard className="h-4 w-4 shrink-0" />;
  };

  return (
    <div className="min-h-screen bg-[#030612] text-slate-100 relative overflow-hidden bg-grid-cyber pb-12">
      {/* Decorative ambient background overlays */}
      <div className="absolute top-[10%] left-[-10%] -z-10 h-96 w-96 rounded-full bg-indigo-500/5 blur-[120px]"></div>
      <div className="absolute top-[40%] right-[-10%] -z-10 h-96 w-96 rounded-full bg-cyan-500/5 blur-[120px]"></div>

      <Container className="py-6 md:py-8 relative z-10">
        {/* Back Link to Public Site */}
        <div className="mb-4">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition duration-200">
            <ArrowLeft className="h-3 w-3" /> Back to Home Page
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* LEFT: Premium Glass Sidebar */}
          <aside className="rounded-2xl border border-white/5 bg-[#090d20]/50 p-5 shadow-[0_15px_30px_rgba(0,0,0,0.4)] backdrop-blur-xl lg:sticky lg:top-24 lg:h-fit">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-indigo-400">STUDENT LOG IN</p>
              <h1 className="mt-2 font-display text-xl font-extrabold text-white tracking-tight leading-tight">{title}</h1>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{description}</p>
            </div>

            <nav className="mt-6 flex flex-col gap-1.5">
              {nav.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-300 flex items-center justify-between border",
                      isActive 
                        ? "bg-gradient-to-r from-indigo-600 to-cyan-600 text-white border-white/10 shadow-[0_0_15px_rgba(99,102,241,0.25)]" 
                        : "bg-transparent text-slate-400 border-transparent hover:border-white/5 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <span className="flex items-center gap-2.5">
                      {getNavIcon(item.label)}
                      {item.label}
                    </span>
                    <ChevronRight className={cn("h-3 w-3 opacity-60 transition duration-300", isActive ? "translate-x-0.5" : "")} />
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* RIGHT: Main Translucent Workplace Area */}
          <main className="rounded-2xl border border-white/5 bg-[#090d20]/45 p-6 md:p-8 shadow-[0_15px_30px_rgba(0,0,0,0.3)] backdrop-blur-lg">
            {children}
          </main>
        </div>
      </Container>
    </div>
  );
}