"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, ArrowLeft, ArrowRight, Lock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@prisma/client";

interface DetailClientProps {
  product: Product;
}

export function DetailClient({ product }: DetailClientProps) {
  const router = useRouter();

  const handleAddToCart = (openCart = false) => {
    try {
      let cart = [];
      const storedCart = localStorage.getItem("el_store_cart");
      if (storedCart) {
        cart = JSON.parse(storedCart);
      }

      const existingIndex = cart.findIndex((item: any) => item.product.id === product.id);
      if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
      } else {
        cart.push({ product, quantity: 1 });
      }

      localStorage.setItem("el_store_cart", JSON.stringify(cart));
      
      if (openCart) {
        // Redirect to store page with query parameter to auto-open cart
        router.push("/store?open_cart=true");
      } else {
        alert(`"${product.title}" has been added to your shopping cart!`);
        router.push("/store");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-8">
      <Button 
        onClick={() => handleAddToCart(false)}
        variant="outline" 
        size="lg"
        className="flex-1 h-12 flex items-center justify-center gap-2 border-border text-foreground hover:bg-muted"
      >
        <ShoppingCart className="h-5 w-5" />
        Add to Cart
      </Button>
      <Button 
        onClick={() => handleAddToCart(true)}
        size="lg"
        className="flex-1 h-12 bg-amber-500 hover:bg-amber-600 text-background font-bold flex items-center justify-center gap-2"
      >
        <Lock className="h-4 w-4" />
        Buy Now
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
