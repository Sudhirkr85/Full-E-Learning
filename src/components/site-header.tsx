"use client";

import Link from "next/link";
import { Menu, X, Zap } from "lucide-react";
import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { mainNav, siteConfig } from "@/lib/site";

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#030712]/80 backdrop-blur-md supports-[backdrop-filter]:bg-[#030712]/60">
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
      <Container className="flex min-h-16 items-center justify-between gap-4 py-3">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 p-[1px] transition duration-300 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.5)]">
            <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-[#0b0f1e] text-indigo-400 group-hover:text-indigo-300 transition duration-300">
              <Zap className="h-4 w-4 fill-indigo-400/20" />
            </div>
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-white group-hover:text-slate-200 transition duration-300">
            {siteConfig.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {mainNav.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className="relative text-sm font-medium text-slate-300 hover:text-white transition duration-300 py-1 group"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-indigo-400 to-cyan-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button asChild className="hidden sm:inline-flex bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-medium hover:from-indigo-500 hover:to-cyan-500 rounded-xl shadow-[0_4px_20px_-4px_rgba(99,102,241,0.4)] border border-white/10 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] py-2 px-4 h-9">
            <Link href="/register">Get Started</Link>
          </Button>

          <div className="md:hidden">
            <div className="relative">
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
                aria-expanded={isMenuOpen}
                onClick={() => setIsMenuOpen((current) => !current)}
                className="rounded-xl border-white/10 bg-slate-900/50 hover:bg-slate-900 text-slate-300"
              >
                {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-3 w-[min(14rem,calc(100vw-2rem))] rounded-2xl border border-white/10 bg-[#0d1224] p-2 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                <nav className="flex flex-col gap-1">
                  {mainNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="rounded-xl px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-all duration-200"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <div className="h-[1px] bg-white/5 my-1"></div>
                  <Link
                    href="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-xl px-3 py-2 text-sm font-semibold text-center text-white bg-indigo-600 hover:bg-indigo-500 transition-all duration-200"
                  >
                    Get Started
                  </Link>
                </nav>
              </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
}
