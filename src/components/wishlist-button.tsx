"use client";

import React, { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Heart, Loader2 } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist-store";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  courseId: string;
  initialWishlisted: boolean;
  isLoggedIn: boolean;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function WishlistButton({
  courseId,
  initialWishlisted,
  isLoggedIn,
  size = "sm",
  showLabel = false
}: WishlistButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { wishlistedIds, toggleWishlist, isWishlisted } = useWishlistStore();
  const active = isWishlisted(courseId);

  // Sync initial state to Zustand store on mount
  useEffect(() => {
    if (initialWishlisted && !wishlistedIds.includes(courseId)) {
      useWishlistStore.getState().addToWishlist(courseId);
    }
  }, [courseId, initialWishlisted, wishlistedIds]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      const currentPath = typeof window !== "undefined" ? window.location.pathname + window.location.search : "/courses";
      toast.info("Please login to save courses");
      router.push(`/login?callbackUrl=${encodeURIComponent(currentPath)}`);
      return;
    }

    // Toggle client state optimistically
    toggleWishlist(courseId);

    startTransition(async () => {
      try {
        const res = await fetch("/api/wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ courseId })
        });

        const data = await res.json();
        if (res.ok) {
          if (data.wishlisted) {
            toast.success("Added to wishlist ♡");
          } else {
            toast.info("Removed from wishlist");
          }
          // Sync exact state from DB
          useWishlistStore.getState().initWishlist(
            useWishlistStore.getState().wishlistedIds
          );
        } else {
          // Revert on failure
          toggleWishlist(courseId);
          toast.error("Something went wrong");
        }
      } catch (err) {
        // Revert on failure
        toggleWishlist(courseId);
        toast.error("Something went wrong");
      }
    });
  };

  const getButtonStyles = () => {
    switch (size) {
      case "sm":
        return "h-7 w-7 rounded-lg bg-black/60 border border-white/10 backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95";
      case "md":
        return "h-9 w-9 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95";
      case "lg":
        return "w-full h-11 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white transition duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]";
    }
  };

  const getIconStyles = () => {
    if (active) {
      return "text-rose-500 fill-rose-500 transition-colors duration-300";
    }
    return "text-slate-400 hover:text-rose-400 transition-colors duration-300";
  };

  const getIconSize = () => {
    switch (size) {
      case "sm":
        return "h-3.5 w-3.5";
      case "md":
        return "h-4.5 w-4.5";
      case "lg":
        return "h-5 w-5";
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={getButtonStyles()}
      disabled={isPending}
      title={active ? "Remove from wishlist" : "Add to wishlist"}
    >
      {isPending ? (
        <Loader2 className={cn("animate-spin text-slate-400", getIconSize())} />
      ) : (
        <Heart className={cn(getIconStyles(), getIconSize(), "transition duration-300 active:scale-125")} />
      )}
      {showLabel && size === "lg" && (
        <span className={cn("text-xs font-semibold", active ? "text-rose-400" : "text-slate-200")}>
          {active ? "Saved ✓" : "Save to Wishlist"}
        </span>
      )}
    </button>
  );
}
