import Link from "next/link";
import { Container } from "@/components/ui/container";
import { footerNav, siteConfig } from "@/lib/site";
import { Zap, Github, Twitter, Linkedin } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="relative border-t border-white/5 bg-[#020512] py-12 md:py-16 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/15 to-transparent"></div>
      
      {/* Decorative ambient background glows */}
      <div className="absolute bottom-0 right-0 -z-10 h-72 w-72 rounded-full bg-cyan-500/5 blur-[80px]"></div>
      <div className="absolute bottom-0 left-0 -z-10 h-72 w-72 rounded-full bg-indigo-500/5 blur-[80px]"></div>

      <Container className="grid gap-10 md:grid-cols-[2fr_1fr] md:items-start relative z-10">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 p-[1px]">
              <div className="flex h-full w-full items-center justify-center rounded-[7px] bg-[#0b0f1e] text-indigo-400">
                <Zap className="h-3.5 w-3.5 fill-indigo-400/20" />
              </div>
            </div>
            <span className="font-display text-base font-bold tracking-tight text-white">
              {siteConfig.name}
            </span>
          </Link>
          <p className="max-w-md text-sm leading-6 text-slate-400">
            {siteConfig.description} Next-generation learning modules tailored for real-world excellence and high-impact placement readiness.
          </p>
          <div className="flex gap-4 pt-2">
            <a href="#" className="text-slate-500 hover:text-white transition duration-300">
              <Twitter className="h-4 w-4" />
            </a>
            <a href="#" className="text-slate-500 hover:text-white transition duration-300">
              <Linkedin className="h-4 w-4" />
            </a>
            <a href="#" className="text-slate-500 hover:text-white transition duration-300">
              <Github className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="space-y-4 md:text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">Navigation</p>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 md:justify-end">
            {footerNav.map((item) => (
              <Link 
                key={item.href} 
                href={item.href} 
                className="text-sm font-medium text-slate-400 hover:text-white transition duration-300"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </Container>

      <div className="relative z-10 mt-12 border-t border-white/5 pt-8">
        <Container className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {siteConfig.name}. Designed for high-potential Indian developers & innovators.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-300 transition">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition">Terms of Service</a>
          </div>
        </Container>
      </div>
    </footer>
  );
}