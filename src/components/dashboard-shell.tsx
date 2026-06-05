"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { 
  ChevronRight, 
  LayoutDashboard, 
  Compass, 
  ReceiptText, 
  ShieldQuestion, 
  ArrowLeft, 
  LogOut, 
  UserCircle, 
  Menu, 
  X,
  Users,
  FolderOpen,
  ShoppingBag,
  Lock,
  BookOpen,
  GraduationCap,
  Heart,
  Award
} from "lucide-react";
import { LogoutModal } from "@/components/navbar/logout-modal";
import { useWishlistStore } from "@/store/wishlist-store";
import { useProductWishlistStore } from "@/store/product-wishlist-store";

type NavItem = {
  label: string;
  href: string;
};

type DashboardShellProps = {
  title: string;
  description: string;
  nav: NavItem[];
  children: ReactNode;
  role?: string;
};

export function DashboardShell({ title, description, nav, children, role }: DashboardShellProps) {
  const pathname = usePathname();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { count } = useWishlistStore();
  const { count: productCount } = useProductWishlistStore();
  const totalWishlistCount = count + productCount;

  const labelText =
    role === "ADMIN" ? "ADMIN PANEL" :
    role === "TEACHER" ? "TEACHER PANEL" :
    "STUDENT LOG IN";

  // Helper to map icons based on label
  const getNavIcon = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes("overview")) return <LayoutDashboard className="h-4 w-4 shrink-0" />;
    if (l.includes("profile")) return <UserCircle className="h-4 w-4 shrink-0" />;
    if (l.includes("course")) return <BookOpen className="h-4 w-4 shrink-0" />;
    if (l.includes("enrollment")) return <GraduationCap className="h-4 w-4 shrink-0" />;
    if (l.includes("student")) return <Users className="h-4 w-4 shrink-0" />;
    if (l.includes("user")) return <Users className="h-4 w-4 shrink-0" />;
    if (l.includes("category")) return <FolderOpen className="h-4 w-4 shrink-0" />;
    if (l.includes("store") || l.includes("order")) return <ShoppingBag className="h-4 w-4 shrink-0" />;
    if (l.includes("ticket") || l.includes("support")) return <ShieldQuestion className="h-4 w-4 shrink-0" />;
    if (l.includes("password")) return <Lock className="h-4 w-4 shrink-0" />;
    if (l.includes("wishlist")) return <Heart className="h-4 w-4 shrink-0" />;
    if (l.includes("certificate")) return <Award className="h-4 w-4 shrink-0" />;
    return <LayoutDashboard className="h-4 w-4 shrink-0" />;
  };

  const renderSidebarLinks = (closeMobileMenu?: () => void) => {
    const linkClasses = (item: { href: string; label: string }) => {
      const isActive = pathname === item.href && (item.href !== "/admin/dashboard" || item.label === "Overview");
      return cn(
        "rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-300 flex items-center justify-between border",
        isActive 
          ? "bg-gradient-to-r from-indigo-600 to-cyan-600 text-white border-white/10 shadow-[0_0_15px_rgba(99,102,241,0.25)]" 
          : "bg-transparent text-slate-400 border-transparent hover:border-white/5 hover:bg-white/5 hover:text-white"
      );
    };

    const renderLink = (item: { href: string; label: string }) => {
      const isActive = pathname === item.href && (item.href !== "/admin/dashboard" || item.label === "Overview");
      const isWishlist = item.label === "Wishlist";
      return (
        <Link
          key={`${item.label}-${item.href}`}
          href={item.href}
          onClick={closeMobileMenu}
          className={linkClasses(item)}
        >
          <span className="flex items-center gap-2.5">
            {getNavIcon(item.label)}
            {item.label}
          </span>
          {isWishlist && totalWishlistCount > 0 ? (
            <span className="ml-auto bg-rose-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center">
              {totalWishlistCount}
            </span>
          ) : (
            <ChevronRight className={cn("h-3 w-3 opacity-60 transition duration-300", isActive ? "translate-x-0.5" : "")} />
          )}
        </Link>
      );
    };

    if (role === "ADMIN") {
      // Custom structured rendering for Admin:
      // My Profile -> divider -> Overview, Users, Enrollments, Courses, Categories, Store, Support Tickets, Audit Logs, Coupons -> divider -> Settings Label -> Change Password, Platform Config
      const profileLink = { label: "My Profile", href: "/admin/profile" };
      const mainLinks = [
        { label: "Overview", href: "/admin/dashboard" },
        { label: "Users", href: "/admin/users" },
        { label: "Enrollments", href: "/admin/enrollments" },
        { label: "Courses", href: "/admin/courses" },
        { label: "Categories", href: "/admin/categories" },
        { label: "Store", href: "/admin/store" },
        { label: "Store Orders", href: "/admin/store/orders" },
        { label: "Coupons", href: "/admin/coupons" },
        { label: "Certificates", href: "/admin/certificates" }
      ];

      return (
        <div className="flex flex-col gap-1.5">
          {renderLink(profileLink)}
          <hr className="my-1.5 border-white/5" />
          {mainLinks.map(renderLink)}
        </div>
      );
    }

    if (role === "STUDENT") {
      const studentLinks = [
        { label: "Overview", href: "/student/dashboard" },
        { label: "My Profile", href: "/student/profile" },
        { label: "My Courses", href: "/student/courses" },
        { label: "My Library", href: "/student/library" },
        { label: "Wishlist", href: "/student/wishlist" },
        { label: "Certificates", href: "/student/certificates" },
        { label: "My Orders", href: "/student/orders" }
      ];
      return (
        <div className="flex flex-col gap-1.5">
          {studentLinks.map(renderLink)}
        </div>
      );
    }

    // Default rendering for other roles:
    return (
      <div className="flex flex-col gap-1.5">
        {nav.map(renderLink)}
      </div>
    );
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

        <div className="mb-4 flex items-center justify-end lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200"
            aria-label="Open dashboard menu"
          >
            <Menu className="h-4 w-4" />
            Menu
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* LEFT: Premium Glass Sidebar */}
          <aside className="hidden rounded-2xl border border-white/5 bg-[#090d20]/50 p-5 shadow-[0_15px_30px_rgba(0,0,0,0.4)] backdrop-blur-xl lg:sticky lg:top-24 lg:flex lg:flex-col lg:h-[calc(100vh-120px)] overflow-hidden">
            <div className="flex-shrink-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-indigo-400">{labelText}</p>
              <h1 className="mt-2 font-display text-xl font-extrabold text-white tracking-tight leading-tight">{title}</h1>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{description}</p>
            </div>

            <nav className="mt-6 flex-1 overflow-y-auto sidebar-nav pr-1 flex flex-col gap-1.5">
              {renderSidebarLinks()}
            </nav>

            <div className="flex-shrink-0 mt-auto pt-4 border-t border-white/5">
              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="w-full rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-300 flex items-center justify-between border bg-transparent text-rose-400 border-transparent hover:border-rose-500/10 hover:bg-rose-500/5 hover:text-rose-300"
              >
                <span className="flex items-center gap-2.5">
                  <LogOut className="h-4 w-4 shrink-0 text-rose-500/60" />
                  Logout
                </span>
                <ChevronRight className="h-3 w-3 opacity-60" />
              </button>
            </div>
          </aside>

          {/* RIGHT: Main Translucent Workplace Area */}
          <main className="rounded-2xl border border-white/5 bg-[#090d20]/45 p-4 md:p-8 shadow-[0_15px_30px_rgba(0,0,0,0.3)] backdrop-blur-lg min-w-0 w-full">
            {children}
          </main>
        </div>

        {isMobileMenuOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-[#020617]/80 backdrop-blur-sm"
              aria-label="Close dashboard menu"
            />
            <aside className="absolute left-4 right-4 top-6 bottom-6 rounded-2xl border border-white/5 bg-[#090d20] p-5 shadow-[0_15px_30px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden max-h-[calc(100vh-48px)]">
              <div className="mb-3 flex items-center justify-end flex-shrink-0">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-300"
                >
                  <X className="h-4 w-4" />
                  Close
                </button>
              </div>
              <div className="flex-shrink-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-indigo-400">{labelText}</p>
                <h1 className="mt-2 font-display text-xl font-extrabold text-white tracking-tight leading-tight">{title}</h1>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{description}</p>
              </div>
              <nav className="mt-6 flex-1 overflow-y-auto sidebar-nav pr-1 flex flex-col gap-1.5">
                {renderSidebarLinks(() => setIsMobileMenuOpen(false))}
              </nav>
              <div className="flex-shrink-0 mt-auto pt-4 border-t border-white/5">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsLogoutModalOpen(true);
                  }}
                  className="w-full rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-300 flex items-center justify-between border bg-transparent text-rose-400 border-transparent hover:border-rose-500/10 hover:bg-rose-500/5 hover:text-rose-300"
                >
                  <span className="flex items-center gap-2.5">
                    <LogOut className="h-4 w-4 shrink-0 text-rose-500/60" />
                    Logout
                  </span>
                  <ChevronRight className="h-3 w-3 opacity-60" />
                </button>
              </div>
            </aside>
          </div>
        ) : null}
      </Container>
      
      {/* Reusable Logout Confirmation Popup */}
      <LogoutModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} />
    </div>
  );
}
