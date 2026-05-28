"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export function HeaderCartButton() {
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = () => {
    try {
      const storedCart = localStorage.getItem("el_store_cart");
      if (storedCart) {
        const cartItems = JSON.parse(storedCart);
        if (Array.isArray(cartItems)) {
          const totalItems = cartItems.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
          setCartCount(totalItems);
          return;
        }
      }
      setCartCount(0);
    } catch (e) {
      console.error(e);
      setCartCount(0);
    }
  };

  useEffect(() => {
    // Initial load
    updateCartCount();

    // Event listeners for cross-component storage updates
    window.addEventListener("cart-updated", updateCartCount);
    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("cart-updated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  return (
    <Link
      href="/store"
      className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/5 bg-slate-950/20 text-slate-400 hover:text-white hover:border-white/10 transition-all duration-300 group"
      aria-label="View shopping cart"
    >
      <ShoppingCart className="h-4.5 w-4.5 transition duration-300 group-hover:scale-105" />
      
      {cartCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-black text-slate-950 shadow-[0_0_10px_rgba(245,158,11,0.6)] border border-[#030712] animate-pulse">
          {cartCount > 99 ? "99+" : cartCount}
        </span>
      )}
    </Link>
  );
}
