"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { ArrowLeft, ShoppingCart, Minus, Plus, Trash2, Ticket, Lock, X } from "lucide-react";
import { toast } from "sonner";
import { createOrderAction, validateCouponAction } from "@/lib/store/actions";
import { ProductType } from "@prisma/client";

export default function MobileCartPage() {
  const router = useRouter();
  const { 
    cartItems: cart, 
    cartCount, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    initializeCart
  } = useCartStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    initializeCart();
    setMounted(true);
    
    // Redirect if screen is desktop width
    if (window.innerWidth >= 768) {
      router.replace("/store");
    }
  }, [initializeCart, router]);

  // Billing states
  const [billingEmail, setBillingEmail] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotalCents = cart.reduce((acc, item) => acc + (item.product.priceCents * item.quantity), 0);

  // Apply Coupon
  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    if (!couponCode) return;

    try {
      const res = await validateCouponAction(couponCode, subtotalCents);
      if (res.success && res.coupon && res.discountCents !== undefined) {
        setAppliedCoupon(res.coupon);
        setCouponDiscount(res.discountCents);
        toast.success(`Coupon applied! You saved ₹${(res.discountCents / 100).toFixed(0)}.`, { duration: 3000 });
      } else {
        let friendlyCouponError = "This coupon code is invalid or has expired.";
        if (res.error?.includes("already used") || res.error?.includes("once")) {
          friendlyCouponError = "You have already used this coupon.";
        }
        setCouponError(friendlyCouponError);
        toast.error(friendlyCouponError);
        setAppliedCoupon(null);
        setCouponDiscount(0);
      }
    } catch {
      toast.error("We couldn't verify your coupon. Please try again.");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponCode("");
    setCouponError("");
  };

  // Recalculate discount on subtotal changes
  useEffect(() => {
    if (appliedCoupon) {
      let discount = 0;
      if (appliedCoupon.couponType === "PERCENTAGE") {
        discount = Math.round((subtotalCents * appliedCoupon.discountValue) / 100);
      } else {
        discount = appliedCoupon.discountValue;
      }
      setCouponDiscount(Math.min(discount, subtotalCents));
    }
  }, [subtotalCents, appliedCoupon]);

  const hasPhysicalOrShippingNeed = cart.some(
    item => item.product.shippingRequired === true || item.product.productType === ProductType.PHYSICAL
  );

  const shippingChargeCents = hasPhysicalOrShippingNeed 
    ? (subtotalCents > 50000 ? 0 : 5000) 
    : 0;

  const totalCents = Math.max(0, subtotalCents - couponDiscount + shippingChargeCents);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!billingEmail) {
      toast.error("Please enter your billing email address.");
      return;
    }

    if (hasPhysicalOrShippingNeed) {
      toast.error("Please use desktop checkout to enter your detailed shipping address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await createOrderAction({
        billingEmail,
        cartItems: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        couponCode: appliedCoupon?.code,
        metadata: {
          shippingStatus: "NOT_APPLICABLE",
        }
      });

      setIsSubmitting(false);

      if (res.success && res.order) {
        clearCart();
        handleRemoveCoupon();
        router.push(`/checkout/${res.order.id}`);
      } else {
        toast.error("Something went wrong. Please refresh and try again.");
      }
    } catch {
      setIsSubmitting(false);
      toast.error("Something went wrong. Please refresh and try again.");
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col text-slate-100 select-none">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-[#0d1117]/95 backdrop-blur-md border-b border-white/10 px-4 py-4 flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-white/5 transition-colors" aria-label="Go back">
          <ArrowLeft className="w-5 h-5 text-slate-300" />
        </button>
        <h1 className="text-white font-bold text-lg flex-1">Your Cart</h1>
        <span className="text-slate-400 text-sm">{cartCount} items</span>
      </div>

      {cart.length === 0 ? (
        /* Empty State */
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
          <ShoppingCart className="w-16 h-16 text-violet-400/40 animate-pulse" />
          <h2 className="text-white font-bold text-lg">Your cart is empty</h2>
          <p className="text-slate-400 text-sm text-center max-w-[280px]">Browse our catalog and add items to get started.</p>
          <button 
            onClick={() => router.push("/store")} 
            className="w-full h-11 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-colors mt-2"
          >
            Browse Store
          </button>
        </div>
      ) : (
        /* Cart Form */
        <form onSubmit={handleCheckout} className="flex-1 flex flex-col justify-between overflow-hidden">
          {/* Scrollable Items area */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-3">
            {cart.map((item) => (
              <div key={item.productId} className="bg-white/5 border border-white/10 rounded-xl p-3 flex gap-3 items-center">
                <img
                  src={item.product?.coverImageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80"}
                  alt={item.product?.title}
                  className="w-14 h-14 rounded-lg object-cover bg-slate-900 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h2 className="text-white text-sm font-medium leading-tight">{item.product?.title}</h2>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    {item.product?.productType === "PHYSICAL" ? (
                      <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">Physical</span>
                    ) : (
                      <span className="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">PDF</span>
                    )}
                    <span className="text-violet-400 font-semibold text-sm">
                      ₹{((item.product?.priceCents * item.quantity) / 100).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Quantity + Remove */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, -1)}
                    className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center hover:bg-white/10 text-white transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, 1)}
                    className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center hover:bg-white/10 text-white transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.productId)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors ml-0.5"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Email input field */}
            <div className="pt-4 space-y-1.5">
              <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Billing Email Address *</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={billingEmail}
                onChange={(e) => setBillingEmail(e.target.value)}
                className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-3 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
            {hasPhysicalOrShippingNeed && (
              <p className="text-xs text-amber-400/90 font-medium bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl">
                ⚠️ Physical products are in your cart. You will need to enter your shipping details during checkout on a desktop screen.
              </p>
            )}
          </div>

          {/* Coupon section */}
          <div className="px-4 py-3 border-t border-white/10 bg-[#0a0a0f]">
            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl p-3 text-sm">
                <span className="flex items-center gap-1.5 font-medium">
                  <Ticket className="w-4 h-4" /> Code: {appliedCoupon.code}
                </span>
                <button type="button" onClick={handleRemoveCoupon} className="p-1 hover:bg-emerald-500/20 rounded-full transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="COUPONCODE"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1 h-11 bg-white/5 border border-white/10 rounded-xl px-3 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
                />
                <button 
                  type="button" 
                  onClick={handleApplyCoupon} 
                  className="h-11 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors shrink-0"
                >
                  Apply
                </button>
              </div>
            )}
            {couponError && <p className="text-xs text-rose-500 mt-1">{couponError}</p>}
          </div>

          {/* Sticky bottom bar */}
          <div className="sticky bottom-0 bg-[#0d1117] border-t border-white/10 px-4 py-4 space-y-2.5">
            <div className="flex justify-between text-slate-400 text-sm">
              <span>Subtotal</span>
              <span>₹{(subtotalCents / 100).toLocaleString("en-IN")}</span>
            </div>
            {couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-400 text-sm">
                <span>Discount Applied</span>
                <span>-₹{(couponDiscount / 100).toLocaleString("en-IN")}</span>
              </div>
            )}
            {hasPhysicalOrShippingNeed && (
              <div className="flex justify-between text-slate-400 text-sm">
                <span>Shipping</span>
                <span>{shippingChargeCents === 0 ? "FREE" : `₹${shippingChargeCents / 100}`}</span>
              </div>
            )}
            <div className="flex justify-between text-white font-bold text-base pt-1 border-t border-white/5">
              <span>Total Price</span>
              <span>₹{(totalCents / 100).toLocaleString("en-IN")}</span>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full h-12 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold mt-2 flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
            >
              <Lock className="w-4 h-4" />
              {isSubmitting ? "Processing..." : "Secure Checkout"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
