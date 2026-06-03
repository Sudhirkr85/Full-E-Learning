"use client";

import { useEffect } from "react";
import { useWishlistStore } from "@/store/wishlist-store";

interface WishlistInitializerProps {
  isLoggedIn: boolean;
}

export function WishlistInitializer({ isLoggedIn }: WishlistInitializerProps) {
  const initWishlist = useWishlistStore((state) => state.initWishlist);

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchWishlist = async () => {
      try {
        const res = await fetch("/api/wishlist");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            initWishlist(data.map((c: any) => c.id));
          }
        }
      } catch (err) {
        console.error("Error loading wishlist:", err);
      }
    };

    fetchWishlist();
  }, [isLoggedIn, initWishlist]);

  return null;
}
