"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, ShoppingCart, Trash2, Minus, Plus, Ticket, 
  Lock, ArrowRight, Package, Archive, GraduationCap, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { createOrderAction, validateCouponAction } from "@/lib/store/actions";
import { Product, ProductType } from "@prisma/client";

interface CartItem {
  product: Product;
  quantity: number;
}

export default function MobileCartPage() {
  const router = useRouter();
  
  // State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isMobile, setIsMobile] = useState(true); // Default to true, then verify
  const [isLoading, setIsLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [billingEmail, setBillingEmail] = useState("");
  const [billingPhone, setBillingPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [shippingState, setShippingState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("India");
  const [shippingPhone1, setShippingPhone1] = useState("");
  const [shippingPhone2, setShippingPhone2] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  // Media Query check & load details
  useEffect(() => {
    // Screen size detection
    const media = window.matchMedia("(max-width: 768px)");
    setIsMobile(media.matches);
    if (!media.matches) {
      router.replace("/store");
      return;
    }

    // Load Cart
    try {
      const storedCart = localStorage.getItem("el_store_cart");
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    } catch (e) {
      console.error("Failed to load cart", e);
    }

    // Fetch user details from profile API if logged in
    fetch("/api/profile")
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data && data.user) {
          setBillingEmail(data.user.email || "");
          setBillingPhone(data.user.phone || "");
          setFullName(data.user.name || "");
          setShippingPhone1(data.user.phone || "");
        }
      })
      .catch((e) => console.error("Error loading user profile", e))
      .finally(() => setIsLoading(false));

    const handler = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
      if (!e.matches) {
        router.replace("/store");
      }
    };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [router]);

  // Sync cart to localStorage
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    try {
      localStorage.setItem("el_store_cart", JSON.stringify(newCart));
      window.dispatchEvent(new Event("cart-updated"));
    } catch (e) {
      console.error("Failed to save cart", e);
    }
  };

  // Remove item
  const removeFromCart = (productId: string) => {
    const newCart = cart.filter(item => item.product.id !== productId);
    saveCart(newCart);
    if (newCart.length === 0) {
      handleRemoveCoupon();
    }
  };

  // Update quantity
  const updateQuantity = (productId: string, delta: number) => {
    const existingIndex = cart.findIndex(item => item.product.id === productId);
    if (existingIndex > -1) {
      const newCart = [...cart];
      const newQty = newCart[existingIndex].quantity + delta;
      
      const product = newCart[existingIndex].product;
      if (product.inventoryCount !== null && delta > 0 && product.inventoryCount < newQty) {
        alert(`Only ${product.inventoryCount} items left in stock.`);
        return;
      }

      if (newQty <= 0) {
        newCart.splice(existingIndex, 1);
      } else {
        newCart[existingIndex].quantity = newQty;
      }
      saveCart(newCart);
      
      if (newCart.length === 0) {
        handleRemoveCoupon();
      }
    }
  };

  // Subtotal in cents
  const subtotalCents = cart.reduce((acc, item) => acc + (item.product.priceCents * item.quantity), 0);

  // Apply Coupon
  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    if (!couponCode) return;

    const res = await validateCouponAction(couponCode, subtotalCents);
    if (res.success && res.coupon && res.discountCents !== undefined) {
      setAppliedCoupon(res.coupon);
      setCouponDiscount(res.discountCents);
    } else {
      setCouponError(res.error ?? "Invalid coupon code.");
      setAppliedCoupon(null);
      setCouponDiscount(0);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponCode("");
    setCouponError("");
  };

  // Recalculate coupon discount when subtotal changes
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

  // Shipping validation checks
  const hasPhysicalOrShippingNeed = cart.some(
    item => item.product.shippingRequired === true || item.product.productType === ProductType.PHYSICAL
  );

  const shippingChargeCents = hasPhysicalOrShippingNeed 
    ? (subtotalCents > 50000 ? 0 : 5000) 
    : 0;

  const totalCents = Math.max(0, subtotalCents - couponDiscount + shippingChargeCents);

  // Checkout submission
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError("");
    
    if (cart.length === 0) {
      setCheckoutError("Your cart is empty.");
      return;
    }

    if (!billingEmail) {
      setCheckoutError("Please enter your billing email address.");
      return;
    }

    if (hasPhysicalOrShippingNeed && (!fullName || !addressLine1 || !city || !postalCode || !shippingState || !shippingPhone1)) {
      setCheckoutError("Please fill out all required shipping fields.");
      return;
    }

    setIsSubmitting(true);

    const shippingDetails = hasPhysicalOrShippingNeed ? {
      fullName,
      addressLine1,
      addressLine2,
      city,
      state: shippingState,
      postalCode,
      country,
      primaryPhone: shippingPhone1,
      secondaryPhone: shippingPhone2,
    } : null;

    const res = await createOrderAction({
      billingEmail,
      cartItems: cart.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
      couponCode: appliedCoupon?.code,
      notes,
      metadata: {
        billingPhone,
        shippingAddress: shippingDetails,
        shippingStatus: hasPhysicalOrShippingNeed ? "PROCESSING" : "NOT_APPLICABLE",
      }
    });

    setIsSubmitting(false);

    if (res.success && res.order) {
      saveCart([]);
      handleRemoveCoupon();
      router.push(`/checkout/${res.order.id}`);
    } else {
      setCheckoutError(res.error ?? "Failed to process checkout. Please try again.");
    }
  };

  const getProductIcon = (type: ProductType) => {
    switch (type) {
      case ProductType.COURSE_ACCESS:
        return <GraduationCap className="h-4.5 w-4.5 text-indigo-400" />;
      case ProductType.DIGITAL_RESOURCE:
        return <Package className="h-4.5 w-4.5 text-amber-400" />;
      case ProductType.BUNDLE:
        return <Archive className="h-4.5 w-4.5 text-purple-400" />;
      default:
        return <Package className="h-4.5 w-4.5" />;
    }
  };

  if (!isMobile) {
    return null; // Prevents flashing while redirecting
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-slate-400 text-sm">
        Loading cart details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100 flex flex-col relative overflow-x-hidden">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-white/10 bg-[#0d1117] px-4">
        <div className="flex items-center gap-3">
          <Link href="/store" className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/5 bg-slate-950/20 text-slate-400">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <span className="text-base font-bold text-white">Your Cart</span>
          {cart.length > 0 && (
            <Badge className="bg-violet-500/20 text-violet-300 border border-violet-500/30 font-bold px-2 py-0.5 rounded-full text-xs">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </Badge>
          )}
        </div>
      </header>

      {/* Main Cart Body Scrollable */}
      <main className="flex-1 overflow-y-auto p-4 space-y-6 pb-4">
        {cart.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-slate-500">
              <ShoppingCart className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Your cart is empty</h3>
            <p className="text-sm text-slate-400 max-w-[280px] leading-relaxed">
              Explore the catalog and equip your workspace with premium templates, playbooks, and course vouchers.
            </p>
            <Button asChild size="sm" className="bg-violet-600 hover:bg-violet-500 text-white rounded-xl">
              <Link href="/store">Browse Store</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleCheckout} className="space-y-6">
            {/* Cart Items list */}
            <div className="space-y-3">
              <h3 className="text-slate-400 text-xs tracking-widest uppercase font-semibold px-1">Cart Items</h3>
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.product.id} className="p-4 flex gap-3 items-center bg-white/5 border border-white/10 rounded-2xl">
                    <img
                      src={item.product.coverImageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80"}
                      alt={item.product.title}
                      className="w-12 h-12 object-cover rounded-xl bg-slate-900 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-white truncate">{item.product.title}</h4>
                      <p className="text-xs text-violet-400 font-semibold mt-0.5">
                        ₹{((item.product.priceCents * item.quantity) / 100).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, -1)}
                        className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center bg-white/5 hover:bg-white/10 text-white text-xs transition duration-200"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm font-semibold w-5 text-center text-white">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, 1)}
                        className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center bg-white/5 hover:bg-white/10 text-white text-xs transition duration-200"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeFromCart(item.product.id)}
                        className="h-8 w-8 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg ml-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Discount Coupon Code input */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <h3 className="text-slate-400 text-xs tracking-widest uppercase font-semibold px-1">Discount Coupon</h3>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl p-3.5 text-sm">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Ticket className="h-4 w-4 text-emerald-400" />
                    <span>Code: {appliedCoupon.code} Applied</span>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={handleRemoveCoupon} 
                    className="h-6 w-6 p-0 text-emerald-400 hover:bg-emerald-500/10 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="PROMOCODE10"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 bg-white/5 border border-white/10 text-white placeholder:text-slate-500 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <Button type="button" onClick={handleApplyCoupon} size="sm" className="px-4 text-xs bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-10 shrink-0">
                    Apply
                  </Button>
                </div>
              )}
              {couponError && <p className="text-xs text-destructive px-1">{couponError}</p>}
            </div>

            {/* Billing details form */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <h3 className="text-slate-400 text-xs tracking-widest uppercase font-semibold px-1">Billing & Delivery</h3>
              
              <div className="space-y-3.5">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Billing Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="sudhir.kumar@gmail.com"
                    value={billingEmail}
                    onChange={(e) => setBillingEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-500 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Billing Phone / Mobile (Editable)</label>
                  <input
                    type="tel"
                    placeholder="+91 99999 88888"
                    value={billingPhone}
                    onChange={(e) => setBillingPhone(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-500 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>

                {/* Shipping info if shippingRequired */}
                {hasPhysicalOrShippingNeed && (
                  <div className="space-y-3.5 p-4 border border-white/10 bg-white/5 rounded-2xl">
                    <div className="flex items-center gap-1.5 text-violet-400 font-semibold text-xs mb-1 uppercase tracking-wide">
                      <Package className="h-3.5 w-3.5" />
                      <span>Shipping Address Required</span>
                    </div>
                    
                    <div>
                      <label className="text-[9px] text-slate-400 uppercase tracking-wider block mb-1">Recipient Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Sudhir Kumar"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-500 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-violet-500"
                      />
                    </div>

                    <div>
                      <label className="text-[9px] text-slate-400 uppercase tracking-wider block mb-1">Address Line 1 *</label>
                      <input
                        type="text"
                        required
                        placeholder="A-12, Ring Road, Lajpat Nagar IV"
                        value={addressLine1}
                        onChange={(e) => setAddressLine1(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-500 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-violet-500"
                      />
                    </div>

                    <div>
                      <label className="text-[9px] text-slate-400 uppercase tracking-wider block mb-1">Address Line 2 (Optional)</label>
                      <input
                        type="text"
                        placeholder="Near Metro Station"
                        value={addressLine2}
                        onChange={(e) => setAddressLine2(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-500 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-violet-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] text-slate-400 uppercase tracking-wider block mb-1">City *</label>
                        <input
                          type="text"
                          required
                          placeholder="New Delhi"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-500 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-violet-500"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-400 uppercase tracking-wider block mb-1">State *</label>
                        <input
                          type="text"
                          required
                          placeholder="Delhi"
                          value={shippingState}
                          onChange={(e) => setShippingState(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-500 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-violet-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] text-slate-400 uppercase tracking-wider block mb-1">PIN Code *</label>
                        <input
                          type="text"
                          required
                          placeholder="110024"
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-500 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-violet-500"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-400 uppercase tracking-wider block mb-1">Country *</label>
                        <input
                          type="text"
                          required
                          placeholder="India"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-500 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-violet-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] text-slate-400 uppercase tracking-wider block mb-1">Primary Phone *</label>
                        <input
                          type="tel"
                          required
                          placeholder="+91 99999 88888"
                          value={shippingPhone1}
                          onChange={(e) => setShippingPhone1(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-500 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-violet-500"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-400 uppercase tracking-wider block mb-1">Secondary Phone</label>
                        <input
                          type="tel"
                          placeholder="+91 88888 77777"
                          value={shippingPhone2}
                          onChange={(e) => setShippingPhone2(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-500 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-violet-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Order Notes</label>
                  <textarea
                    placeholder="Any special instructions for this order..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-500 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>
              </div>
            </div>

            {/* STICKY BOTTOM CHECKOUT ACTION PANEL */}
            <div className="sticky bottom-0 left-0 right-0 bg-[#0d1117] border-t border-white/10 px-4 py-4 -mx-4 -mb-4 z-20 space-y-4 shadow-2xl">
              {checkoutError && <p className="text-xs text-destructive font-medium text-center">{checkoutError}</p>}
              
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-slate-300">
                  <span>Cart Subtotal</span>
                  <span>₹{(subtotalCents / 100).toLocaleString("en-IN")}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Discount</span>
                    <span>-₹{(couponDiscount / 100).toLocaleString("en-IN")}</span>
                  </div>
                )}
                {hasPhysicalOrShippingNeed && (
                  <div className="flex justify-between text-slate-300">
                    <span>Shipping</span>
                    <span>
                      {shippingChargeCents === 0 ? (
                        <span className="text-emerald-400 font-semibold">FREE</span>
                      ) : (
                        `₹${(shippingChargeCents / 100).toLocaleString("en-IN")}`
                      )}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-dashed border-white/10">
                  <span>Total Due</span>
                  <span>₹{(totalCents / 100).toLocaleString("en-IN")}</span>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-12 bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm flex items-center justify-center gap-1.5 rounded-xl transition duration-200"
              >
                <Lock className="h-4.5 w-4.5" />
                {isSubmitting ? "Generating Secure Order..." : "Secure Checkout Payment"}
                <ArrowRight className="h-4.5 w-4.5 shrink-0" />
              </Button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
