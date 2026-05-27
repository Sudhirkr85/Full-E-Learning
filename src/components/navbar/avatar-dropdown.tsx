"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { 
  User as UserIcon, 
  LayoutDashboard, 
  BookOpen, 
  Award, 
  History, 
  Settings, 
  LogOut, 
  Shield, 
  Users, 
  FileText, 
  MessageSquare 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AvatarDropdownProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: "STUDENT" | "TEACHER" | "ADMIN";
  };
}

export function AvatarDropdown({ user }: AvatarDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  // Get user initials for placeholder
  const getInitials = () => {
    if (!user.name) return "U";
    const parts = user.name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  // Define role-based navigation items
  const menuItems = {
    STUDENT: [
      { label: "My Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
      { label: "My Learning", href: "/student/courses", icon: BookOpen },
      { label: "Certificates", href: "/certificates", icon: Award },
      { label: "Orders", href: "/student/orders", icon: History },
      { label: "Settings", href: "/profile", icon: Settings },
    ],
    TEACHER: [
      { label: "Teacher Dashboard", href: "/teacher/dashboard", icon: LayoutDashboard },
      { label: "My Courses", href: "/teacher/courses", icon: BookOpen },
      { label: "Settings", href: "/profile", icon: Settings },
    ],
    ADMIN: [
      { label: "Admin Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { label: "Manage Users", href: "/admin/users", icon: Users },
      { label: "Manage Orders", href: "/admin/orders", icon: History },
      { label: "Support Desk", href: "/admin/support", icon: MessageSquare },
      { label: "Audit Logs", href: "/admin/audit", icon: FileText },
      { label: "Settings", href: "/profile", icon: Settings },
    ],
  };

  const currentItems = menuItems[user.role || "STUDENT"];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 overflow-hidden bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 focus:outline-none focus:ring-1 focus:ring-indigo-500/40 transition hover:scale-[1.03]"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
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
      </button>

      {/* Glassmorphic Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3.5 w-60 rounded-2xl border border-white/10 bg-[#0d1224]/95 p-2.5 shadow-[0_15px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200 z-50">
          
          {/* Header (Non-clickable) */}
          <div className="px-3.5 py-2.5 space-y-1">
            <p className="text-xs font-extrabold text-white truncate">{user.name || "Developer Account"}</p>
            <p className="text-[10px] text-slate-400 truncate">{user.email || "dev@college.edu"}</p>
            <div className="inline-flex items-center gap-1.5 pt-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-400">
                {user.role} Account
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-[1px] bg-white/5 my-2" />

          {/* Dynamic Links */}
          <nav className="flex flex-col gap-0.5">
            {currentItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/5 hover:text-white transition-all duration-200 group"
                >
                  <Icon className="h-4 w-4 text-slate-500 group-hover:text-indigo-400 transition" />
                  {item.label}
                </Link>
              );
            })}

            {/* Divider */}
            <div className="h-[1px] bg-white/5 my-2" />

            {/* Logout Trigger */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-200 group"
            >
              <LogOut className="h-4 w-4 text-rose-500/60 group-hover:text-rose-400 transition" />
              Logout
            </button>
          </nav>

        </div>
      )}
    </div>
  );
}
