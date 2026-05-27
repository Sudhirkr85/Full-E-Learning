"use client";

import React from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationBellProps {
  role?: "STUDENT" | "TEACHER" | "ADMIN";
  unreadCount: number;
}

export function NotificationBell({ role, unreadCount }: NotificationBellProps) {
  const notificationLink = role === "ADMIN" ? "/admin/notifications" : "/student/notifications";

  return (
    <Link
      href={notificationLink}
      className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/5 bg-slate-950/20 text-slate-400 hover:text-white hover:border-white/10 transition-all duration-300 group"
      aria-label="View notifications"
    >
      <Bell className="h-4.5 w-4.5 transition duration-300 group-hover:scale-105" />
      
      {unreadCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-black text-white shadow-[0_0_10px_rgba(244,63,94,0.6)] border border-[#030712] animate-pulse">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </Link>
  );
}
