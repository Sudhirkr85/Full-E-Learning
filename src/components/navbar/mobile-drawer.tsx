"use client";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
  X, 
  Bell, 
  LogOut,
  LayoutDashboard, 
  BookOpen, 
  Award, 
  History, 
  Settings, 
  Users, 
  MessageSquare,
  Zap,
  GraduationCap,
  FolderOpen,
  ShoppingBag,
  Tag,
  Lock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: "STUDENT" | "TEACHER" | "ADMIN";
  } | null;
  unreadCount: number;
  onLogoutClick?: () => void;
}

export function MobileDrawer({ isOpen, onClose, user, unreadCount, onLogoutClick }: MobileDrawerProps) {
  const pathname = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key press, handle body scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleLogout = async () => {
    onClose();
    if (onLogoutClick) {
      onLogoutClick();
    } else {
      await signOut({ callbackUrl: "/" });
    }
  };

  const getInitials = () => {
    if (!user?.name) return "U";
    const parts = user.name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href);
  };

  // Main navigation links based on role
  const getNavLinks = () => {
    const base = [
      { label: "Courses", href: "/courses" },
      { label: "Store", href: "/store" },
    ];

    if (!user) {
      return [...base, { label: "About", href: "/about" }];
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

  // Dropdown specific menu items per role
  const getRoleMenuItems = () => {
    if (!user) return [];
    
    switch (user.role) {
      case "STUDENT":
        return [
          { label: "My Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
          { label: "My Learning", href: "/student/courses", icon: BookOpen },
          { label: "Certificates", href: "/certificates", icon: Award },
          { label: "Orders", href: "/student/orders", icon: History },
          { label: "Settings", href: "/profile", icon: Settings },
        ];
      case "TEACHER":
        return [
          { label: "Teacher Dashboard", href: "/teacher/dashboard", icon: LayoutDashboard },
          { label: "My Courses", href: "/teacher/courses", icon: BookOpen },
          { label: "Settings", href: "/profile", icon: Settings },
        ];
      case "ADMIN":
        return [
          { label: "Admin Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
          { label: "Users", href: "/admin/users", icon: Users },
          { label: "Enrollments", href: "/admin/enrollments", icon: GraduationCap },
          { label: "Courses (admin)", href: "/admin/courses", icon: BookOpen },
          { label: "Categories", href: "/admin/categories", icon: FolderOpen },
          { label: "Store (admin)", href: "/admin/store", icon: ShoppingBag },
          { label: "Store Orders", href: "/admin/store/orders", icon: ShoppingBag },
          { label: "Coupons", href: "/admin/coupons", icon: Tag },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();
  const roleMenuItems = getRoleMenuItems();
  const notificationLink = user?.role === "ADMIN" ? "/admin/notifications" : "/student/notifications";

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Slide in from LEFT drawer panel */}
      <div
        ref={drawerRef}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[85vw] max-w-[320px] flex-col bg-[#0d1117] border-r border-white/10 transition-transform duration-300 ease-in-out md:hidden shadow-2xl overscroll-contain",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Drawer Header & User Profile Info at top */}
        <div className="flex flex-col border-b border-white/10 p-5 gap-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group" onClick={onClose}>
              <div className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 p-[1px]">
                <div className="flex h-full w-full items-center justify-center rounded-[7px] bg-[#0b0f1e] text-indigo-400">
                  <Zap className="h-3 w-3 fill-indigo-400/20" />
                </div>
              </div>
              <span className="font-display text-sm font-bold tracking-tight text-white">
                LMS
              </span>
            </Link>

            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/5 bg-slate-950/20 text-slate-400 hover:text-white hover:border-white/10 transition-colors"
              aria-label="Close drawer"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* User profile layout */}
          {user ? (
            <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 overflow-hidden bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 shrink-0">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "User profile"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-bold tracking-wider text-indigo-300">
                      {getInitials()}
                    </span>
                  )}
                </div>
                <div className="min-w-0 max-w-[140px]">
                  <p className="text-xs font-bold text-white truncate">{user.name || "Student Account"}</p>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{user.email}</p>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] font-extrabold uppercase tracking-widest bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mt-1">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">Welcome to the Platform</p>
          )}
        </div>

        {/* Drawer Body Scroll Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 overscroll-contain">
          {/* Main navigation list */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block px-2 mb-1">
              Menu
            </span>
            <nav className="flex flex-col gap-1">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center px-4 min-h-[44px] text-sm font-semibold rounded-lg transition-all duration-200 border border-transparent",
                    isActive(item.href)
                      ? "bg-white/10 text-white border-white/5"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Account/Role-Specific Operations stack */}
          {user && roleMenuItems.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block px-2 mb-1">
                Account Operations
              </span>
              <nav className="flex flex-col gap-1">
                {roleMenuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 px-4 min-h-[44px] text-sm font-semibold rounded-lg transition-all duration-200 border border-transparent",
                        isActive(item.href)
                          ? "bg-white/10 text-white border-white/5"
                          : "text-slate-400 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <Icon className="h-4 w-4 text-slate-500 shrink-0" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}
        </div>

        {/* Drawer Footer actions pinned to bottom */}
        <div className="mt-auto border-t border-white/10 p-4 bg-[#090d16]">
          {user ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 h-11 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200 text-sm font-semibold"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              Logout
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                href="/login"
                onClick={onClose}
                className="w-full h-11 flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] text-sm font-semibold text-slate-300 hover:bg-white/[0.05] hover:text-white transition-all duration-200"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={onClose}
                className="w-full h-11 flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-sm font-semibold text-white shadow-lg transition-all duration-200"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
