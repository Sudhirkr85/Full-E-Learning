"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { ShoppingCart } from "lucide-react";

export function HeaderCartButton() {
  const router = useRouter();
  const { cartCount, openDrawer, initializeCart } = useCartStore();

  useEffect(() => {
    initializeCart();
  }, [initializeCart]);

  const handleCartClick = () => {
    if (window.innerWidth < 768) {
      router.push("/cart");
    } else {
      openDrawer();
    }
  };

  return (
    <button
      onClick={handleCartClick}
      className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/5 bg-slate-950/20 text-slate-400 hover:text-white hover:border-white/10 transition-all duration-300 group"
      aria-label="View shopping cart"
    >
      <ShoppingCart className="h-4.5 w-4.5 transition duration-300 group-hover:scale-105" />
      
      {cartCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-violet-600 px-1 text-[10px] font-black text-white shadow-[0_0_10px_rgba(124,58,237,0.6)] border border-[#030712] animate-pulse">
          {cartCount > 99 ? "99+" : cartCount}
        </span>
      )}
    </button>
  );
}
