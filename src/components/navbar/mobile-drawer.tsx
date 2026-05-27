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
  FileText, 
  MessageSquare,
  Zap
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

  // Close on escape key
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
        return [...base, { label: "Admin Panel", href: "/admin/dashboard" }];
      default:
        return [...base];
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
          { label: "Manage Users", href: "/admin/users", icon: Users },
          { label: "Manage Orders", href: "/admin/orders", icon: History },
          { label: "Support Desk", href: "/admin/support", icon: MessageSquare },
          { label: "Audit Logs", href: "/admin/audit", icon: FileText },
          { label: "Settings", href: "/profile", icon: Settings },
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
          "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        className={cn(
          "fixed top-0 right-0 bottom-0 z-50 flex h-full w-72 flex-col border-l border-white/10 bg-[#070a13]/95 backdrop-blur-xl transition-transform duration-300 ease-out md:hidden shadow-[[-10px_0_30px_rgba(0,0,0,0.5)]]",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Drawer Header */}
        <div className="flex h-14 items-center justify-between border-b border-white/5 px-5">
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

        {/* Drawer Body Scroll Area */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-8">
          {/* User Section (If logged in) */}
          {user && (
            <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 overflow-hidden bg-gradient-to-br from-indigo-500/10 to-cyan-500/10">
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
                <div className="max-w-[130px]">
                  <p className="text-xs font-bold text-white truncate">{user.name || "Developer"}</p>
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-indigo-400">
                    {user.role}
                  </span>
                </div>
              </div>

              {/* Notification Bell inside Drawer */}
              <Link
                href={notificationLink}
                onClick={onClose}
                className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-white/5 bg-slate-950/40 text-slate-400 hover:text-white transition-colors"
                aria-label="View notifications"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-600 px-1 text-[8px] font-black text-white shadow-[0_0_8px_rgba(244,63,94,0.6)]">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>
            </div>
          )}

          {/* Primary Navigation Stack */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block px-2">
              Menu
            </span>
            <nav className="flex flex-col gap-1">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200",
                    isActive(item.href)
                      ? "bg-indigo-500/10 text-white border border-indigo-500/15"
                      : "text-slate-400 hover:bg-white/[0.03] hover:text-white border border-transparent"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Role-Specific Menu Stack (if logged in) */}
          {user && roleMenuItems.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block px-2">
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
                        "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200",
                        isActive(item.href)
                          ? "bg-indigo-500/10 text-white border border-indigo-500/15"
                          : "text-slate-400 hover:bg-white/[0.03] hover:text-white border border-transparent"
                      )}
                    >
                      <Icon className="h-4 w-4 text-slate-500" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        <div className="border-t border-white/5 bg-[#05070e] p-5">
          {user ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-2.5 text-sm font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          ) : (
            <div className="flex flex-col gap-2.5">
              <Link
                href="/login"
                onClick={onClose}
                className="w-full text-center rounded-xl border border-white/10 bg-white/[0.02] py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/[0.05] hover:text-white transition-all duration-200"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={onClose}
                className="w-full text-center rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 py-2.5 text-sm font-semibold text-white shadow-[0_4px_20px_-4px_rgba(99,102,241,0.4)] transition-all duration-200"
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
