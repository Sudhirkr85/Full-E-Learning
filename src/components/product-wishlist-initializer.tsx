"use client";

import { useEffect } from "react";
import { useProductWishlistStore } from "@/store/product-wishlist-store";

interface ProductWishlistInitializerProps {
  isLoggedIn: boolean;
}

export function ProductWishlistInitializer({ isLoggedIn }: ProductWishlistInitializerProps) {
  const initWishlist = useProductWishlistStore((state) => state.initWishlist);

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchWishlist = async () => {
      try {
        const res = await fetch("/api/store/wishlist");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            initWishlist(data.map((p: any) => p.id));
          }
        }
      } catch (err) {
        console.error("Error loading product wishlist:", err);
      }
    };

    fetchWishlist();
  }, [isLoggedIn, initWishlist]);

  return null;
}
