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
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      router.push('/cart');
    } else {
      openDrawer();
    }
  };

  const handleAddToCart = (buyNow = false) => {
    addToCart(product);
    if (buyNow) {
      openDrawer();
    }
  };

  const isInCart = cartItems.some(item => item.productId === product.id);

  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-8">
      {isInCart ? (
        <Button 
          onClick={handleGoToCart}
          size="lg"
          className="flex-1 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingCart className="h-5 w-5" />
          Go to Cart
        </Button>
      ) : (
        <Button 
          onClick={() => handleAddToCart(false)}
          variant="ghost" 
          size="lg"
          className="flex-1 h-12 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingCart className="h-5 w-5" />
          Add to Cart
        </Button>
      )}
      <Button 
        onClick={() => handleAddToCart(true)}
        size="lg"
        className="flex-1 h-12 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-colors flex items-center justify-center gap-2"
      >
        <Lock className="h-4 w-4" />
        Buy Now
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
