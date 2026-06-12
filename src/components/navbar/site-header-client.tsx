"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Zap } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { Container } from "@/components/ui/container";
import { AvatarDropdown } from "./avatar-dropdown";
import { MobileDrawer } from "./mobile-drawer";
import { LogoutModal } from "./logout-modal";
import { cn } from "@/lib/utils";

interface SiteHeaderClientProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: "STUDENT" | "TEACHER" | "ADMIN";
  } | null;
  unreadCount: number;
}

export function SiteHeaderClient({ user, unreadCount }: SiteHeaderClientProps) {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-close mobile drawer on route transition
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href);
  };

  // Nav links based on role
  const getNavLinks = () => {
    const base = [
      { label: "Courses", href: "/courses" },
      { label: "Store", href: "/store" },
    ];

    if (!user) {
      return base;
    }

    switch (user.role) {
      case "STUDENT":
        return [...base, { label: "My Learning", href: "/student/courses" }];
      case "TEACHER":
        return [...base, { label: "Teacher Panel", href: "/teacher/dashboard" }];
      case "ADMIN":
        return [...base];
      default:
        return base;
    }
  };

  const navLinks = getNavLinks();

  return (
    <>
      <header className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled 
          ? "bg-[#0d1117]/95 backdrop-blur-md border-b border-white/10" 
          : "bg-[#0d1117]/80 backdrop-blur-sm border-b border-transparent"
      )}>
        {/* Premium subtle bottom border glow */}
        {isScrolled && (
          <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
        )}

        <Container className="flex h-14 md:h-16 items-center justify-between gap-4 px-4 max-w-7xl mx-auto">
          
          {/* Left Side: Logo & Brand */}
          <Link href="/" className="flex items-center gap-2 group" title="Sagar Coaching Centre — Home" aria-label="Sagar Coaching Centre Logo">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 p-[1px] transition duration-300 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.5)]">
              <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-[#0b0f1e] text-indigo-400 group-hover:text-indigo-300 transition duration-300">
                <Zap className="h-4 w-4 fill-indigo-400/20" />
              </div>
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-white group-hover:text-slate-200 transition duration-300">
              {siteConfig.name}
            </span>
          </Link>

          {/* Center Section: Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative text-sm font-medium transition-colors duration-200 py-1 group",
                  isActive(item.href)
                    ? "text-white font-semibold"
                    : "text-slate-400 hover:text-white"
                )}
              >
                {item.label}
                {/* Dynamic bottom active bar line */}
                <span
                  className={cn(
                    "absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-indigo-400 to-cyan-400 transition-all duration-300",
                    isActive(item.href) ? "w-full" : "w-0 group-hover:w-full"
                  )}
                />
              </Link>
            ))}
          </nav>

          {/* Right Section: Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              /* Logged In View (Desktop) */
              <div className="hidden md:flex items-center gap-4">
                <AvatarDropdown user={user} onLogoutClick={() => setIsLogoutModalOpen(true)} />
              </div>
            ) : (
              /* Public View (Desktop) */
              <div className="hidden md:flex items-center gap-4">
                <Link
                  href="/login"
                  className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="inline-flex h-9 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-4 text-sm font-semibold text-white shadow-[0_4px_20px_-4px_rgba(99,102,241,0.4)] border border-white/10 transition-all duration-300 hover:scale-[1.02] hover:from-indigo-500 hover:to-cyan-500 active:scale-[0.98]"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Hamburger Menu (Mobile Only) */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="flex md:hidden h-9 w-9 items-center justify-center rounded-xl border border-white/5 bg-slate-950/20 text-slate-400 hover:text-white hover:border-white/10 transition-all duration-300"
              aria-label="Open mobile navigation drawer"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </Container>

      </header>

      {/* Responsive Slide Drawer */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        user={user}
        unreadCount={unreadCount}
        onLogoutClick={() => setIsLogoutModalOpen(true)}
      />

      {/* Reusable Logout Confirmation Popup - Rendered outside <header> to bypass backdrop-blur coordinate containment */}
      <LogoutModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} />
    </>
  );
}
