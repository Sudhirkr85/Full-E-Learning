"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, ArrowLeft, ArrowRight, Lock, CheckCircle, Sparkles, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@prisma/client";

import { useCartStore } from "@/store/cart-store";

interface DetailClientProps {
  product: Product;
}

export function DetailClient({ product }: DetailClientProps) {
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);
  const openDrawer = useCartStore((state) => state.openDrawer);

  const cartItems = useCartStore((state) => state.cartItems);
  
  const handleGoToCart = () => {
    if (window.innerWidth < 768) {
      router.push('/cart');
    } else {
      router.push('/store?cart=open');
    }
  };

  const handleAddToCart = (buyNow = false) => {
    addToCart(product);
    if (buyNow) {
      handleGoToCart();
    }
  };

  const handleBuyNow = () => {
    if (!isInCart) {
      addToCart(product);
    }
    handleGoToCart();
  };

  const isInCart = cartItems.some(item => item.productId === product.id);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
      {isInCart ? (
        <button 
          onClick={handleGoToCart}
          className="group relative flex-1 h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all duration-300 font-extrabold text-sm uppercase tracking-wide flex items-center justify-center gap-2.5 shadow-[0_0_20px_rgba(16,185,129,0.3)] border border-emerald-400/20 active:scale-95 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none rounded-2xl opacity-10"></div>
          <CheckCircle className="h-5 w-5 animate-bounce-subtle" />
          <span>In Your Cart</span>
        </button>
      ) : (
        <button 
          onClick={() => handleAddToCart(false)}
          className="group relative flex-1 h-14 rounded-2xl bg-white/5 border border-white/10 hover:border-violet-500/50 text-slate-200 hover:text-white hover:bg-violet-500/10 transition-all duration-300 font-extrabold text-sm uppercase tracking-wide flex items-center justify-center gap-2.5 backdrop-blur-md active:scale-95 overflow-hidden"
        >
          <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-violet-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
          <ShoppingCart className="h-5 w-5 transition-transform group-hover:-translate-y-1" />
          <span>Add to Cart</span>
        </button>
      )}
      
      <button 
        onClick={handleBuyNow}
        className="group relative flex-1 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white transition-all duration-300 font-extrabold text-sm uppercase tracking-wide flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(79,70,229,0.4)] hover:shadow-[0_0_35px_rgba(79,70,229,0.6)] border border-white/10 active:scale-95 overflow-hidden"
      >
        {/* Animated Shimmer */}
        <div className="absolute inset-0 w-[50%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-[25deg] -translate-x-[150%] group-hover:animate-shimmer pointer-events-none"></div>
        
        <div className="absolute top-0 right-0 p-1 opacity-40 group-hover:opacity-100 transition-opacity">
          <Sparkles className="h-3 w-3 text-indigo-200 animate-pulse" />
        </div>

        <CreditCard className="h-5 w-5 transition-transform group-hover:scale-110" />
        <span className="relative z-10">Buy Now</span>
        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  );
}
