"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, ArrowLeft, ArrowRight, Lock, CheckCircle } from "lucide-react";
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
    <div className="flex flex-col sm:flex-row gap-4 mt-8">
      {isInCart ? (
        <button 
          onClick={handleGoToCart}
          className="flex-1 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition font-extrabold text-xs uppercase tracking-normal flex items-center justify-center gap-2 shadow-md shadow-emerald-600/10 border border-transparent"
        >
          <ShoppingCart className="h-4.5 w-4.5" />
          Go to Cart
        </button>
      ) : (
        <button 
          onClick={() => handleAddToCart(false)}
          className="flex-1 h-12 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-slate-200 hover:text-white hover:bg-white/10 transition font-extrabold text-xs uppercase tracking-normal flex items-center justify-center gap-2"
        >
          <ShoppingCart className="h-4.5 w-4.5" />
          Add to Cart
        </button>
      )}
      <button 
        onClick={handleBuyNow}
        className="flex-1 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition font-extrabold text-xs uppercase tracking-normal flex items-center justify-center gap-2 shadow-md shadow-indigo-600/10 border border-transparent"
      >
        <Lock className="h-3.5 w-3.5" />
        Buy Now
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
