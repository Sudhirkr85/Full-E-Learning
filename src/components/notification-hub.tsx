"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Bell, Check, Shield, GraduationCap, Package, 
  HelpCircle, Award, CheckCircle, Info, Inbox
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  getNotificationsAction, 
  markAsReadAction, 
  markAllAsReadAction 
} from "@/lib/notifications/actions";

export function NotificationHub() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    const res = await getNotificationsAction();
    if (res.success && res.notifications) {
      setNotifications(res.notifications);
      setUnreadCount(res.unreadCount);
    }
  };

  // Mount polling setup
  useEffect(() => {
    fetchNotifications();

    // Poll for notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mark single item read & navigate
  const handleItemClick = async (item: any) => {
    setIsOpen(false);
    if (!item.isRead) {
      await markAsReadAction(item.id);
      fetchNotifications();
    }
    if (item.linkUrl) {
      router.push(item.linkUrl);
    }
  };

  // Mark all read
  const handleMarkAllRead = async () => {
    await markAllAsReadAction();
    fetchNotifications();
  };

  // Get icons matching type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "SYSTEM":
        return <Info className="h-4 w-4 text-blue-500" />;
      case "COURSE":
        return <GraduationCap className="h-4 w-4 text-indigo-500" />;
      case "ORDER":
        return <Package className="h-4 w-4 text-amber-500" />;
      case "SUPPORT":
        return <HelpCircle className="h-4 w-4 text-rose-500" />;
      case "CERTIFICATE":
        return <Award className="h-4 w-4 text-emerald-500" />;
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative h-9 w-9 rounded-full border-border/80 bg-background/50 hover:bg-muted"
        aria-label="View notifications"
      >
        <Bell className="h-4.5 w-4.5 text-muted-foreground hover:text-foreground transition" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground font-bold text-[9px] h-4.5 w-4.5 rounded-full flex items-center justify-center border border-background">
            {unreadCount}
          </span>
        )}
      </Button>

      {/* Bell Dropdown Tray */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl border border-border/80 bg-card/95 backdrop-blur shadow-soft p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-3 border-b border-border flex items-center justify-between">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Bell className="h-4 w-4 text-amber-500" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="secondary" className="px-1.5 py-0.5 text-[9px]">
                  {unreadCount} new
                </Badge>
              )}
            </span>
            {unreadCount > 0 && (
              <Button 
                onClick={handleMarkAllRead} 
                variant="ghost" 
                className="h-6 px-2 text-[10px] font-semibold text-amber-600 hover:text-amber-700 hover:bg-amber-500/5 rounded-lg flex items-center gap-1"
              >
                <Check className="h-3 w-3" />
                Mark all read
              </Button>
            )}
          </div>

          {/* List Content */}
          <div className="max-h-80 overflow-y-auto divide-y divide-border py-1">
            {notifications.length === 0 ? (
              <div className="py-10 text-center space-y-2">
                <Inbox className="h-8 w-8 text-muted-foreground opacity-30 mx-auto" />
                <p className="text-xs text-muted-foreground font-medium">All caught up! No notifications.</p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`p-3 text-left cursor-pointer transition-colors duration-150 flex gap-3 rounded-xl hover:bg-muted/60 ${
                    !item.isRead ? "bg-amber-500/[0.02]" : ""
                  }`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center">
                      {getTypeIcon(item.type)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-bold text-foreground leading-snug truncate">{item.title}</p>
                      {!item.isRead && (
                        <span className="h-2 w-2 rounded-full bg-amber-500 mt-1 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-normal line-clamp-2">{item.message}</p>
                    <span className="text-[9px] text-muted-foreground/60 block">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
