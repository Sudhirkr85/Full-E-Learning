"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ShoppingCart, Search, X, Plus, Minus, Trash2, 
  Ticket, ArrowRight, Lock, Package, GraduationCap, Archive
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { createOrderAction, validateCouponAction } from "@/lib/store/actions";
import { Product, ProductType } from "@prisma/client";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { toast } from "sonner";

const ERROR_MESSAGES = {
  PRODUCT_NOT_FOUND: "One or more items are no longer available and have been removed from your cart.",
  ALL_ITEMS_INVALID: "Your cart is empty. The items you added are no longer available.",
  NETWORK_ERROR: "We couldn't verify your cart. Please check your connection and try again.",
  PAYMENT_FAILED: "Payment could not be processed. Please try again or use a different method.",
  COUPON_INVALID: "This coupon code is invalid or has expired.",
  COUPON_USED: "You have already used this coupon.",
  OUT_OF_STOCK: (name: string) => `'${name}' is out of stock and has been removed from your cart.`,
  SERVER_ERROR: "Something went wrong. Please refresh and try again.",
};

interface StoreClientProps {
  products: Product[];
  profileUser?: {
    email: string;
    name: string;
    phone: string;
  } | null;
}

export function StoreClient({ products, profileUser }: StoreClientProps) {
  const router = useRouter();
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [isMobile, setIsMobile] = useState(false);

  // Zustand Store Integration
  const isCartOpen = useCartStore((state) => state.isDrawerOpen);
  const cart = useCartStore((state) => state.cartItems);
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const initializeCart = useCartStore((state) => state.initializeCart);
  const closeDrawer = useCartStore((state) => state.closeDrawer);

  useEffect(() => {
    initializeCart();
  }, [initializeCart]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    setIsMobile(media.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  // Listen for open-cart event from HeaderCartButton
  useEffect(() => {
    const handleOpenCart = () => useCartStore.getState().openDrawer();
    window.addEventListener("open-cart", handleOpenCart);
    return () => window.removeEventListener("open-cart", handleOpenCart);
  }, []);

  // Body scroll lock when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  // Stale item auto-cleanup on cart open
  const validateCartItems = async () => {
    const removedNames = [];
    for (const item of cart) {
      try {
        const res = await fetch(`/api/store/products/${item.productId}`);
        if (!res.ok) {
          removeFromCart(item.productId);
          removedNames.push(item.product?.title || "An item");
        }
      } catch {
        removeFromCart(item.productId);
      }
    }
    if (removedNames.length > 0) {
      removedNames.forEach(name => 
        toast.warning(`'${name}' is no longer available and was removed from your cart.`, { duration: 4000 })
      );
    }
  };

  useEffect(() => {
    if (cart.length > 0) {
      validateCartItems();
    }
  }, [isCartOpen]);

  const handleCartTrigger = () => {
    if (isMobile) {
      router.push("/cart");
    } else {
      useCartStore.getState().openDrawer();
    }
  };

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");

  // Billing and shipping details
  const [billingEmail, setBillingEmail] = useState(profileUser?.email || "");
  const [billingPhone, setBillingPhone] = useState(profileUser?.phone || "");
  const [fullName, setFullName] = useState(profileUser?.name || "");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [shippingState, setShippingState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("India");
  const [shippingPhone1, setShippingPhone1] = useState(profileUser?.phone || "");
  const [shippingPhone2, setShippingPhone2] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  // Subtotal in cents
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
        let friendlyCouponError = ERROR_MESSAGES.COUPON_INVALID;
        if (res.error?.includes("already used") || res.error?.includes("once")) {
          friendlyCouponError = ERROR_MESSAGES.COUPON_USED;
        }
        setCouponError(friendlyCouponError);
        toast.error(friendlyCouponError);
        setAppliedCoupon(null);
        setCouponDiscount(0);
      }
    } catch {
      toast.error(ERROR_MESSAGES.NETWORK_ERROR);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponCode("");
    setCouponError("");
  };

  // Recalculate discount when subtotal changes
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

  // Submit checkout
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError("");
    
    await validateCartItems();
    if (cart.length === 0) {
      const emptyError = ERROR_MESSAGES.ALL_ITEMS_INVALID;
      setCheckoutError(emptyError);
      toast.error(emptyError);
      return;
    }

    if (!billingEmail) {
      const emailError = "Please enter your billing email address.";
      setCheckoutError(emailError);
      toast.error(emailError);
      return;
    }

    if (hasPhysicalOrShippingNeed && (!fullName || !addressLine1 || !city || !postalCode || !shippingState || !shippingPhone1)) {
      const shippingError = "Please fill out all required shipping fields.";
      setCheckoutError(shippingError);
      toast.error(shippingError);
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

    try {
      const res = await createOrderAction({
        billingEmail,
        cartItems: cart.map(item => ({
          productId: item.productId,
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
        clearCart();
        handleRemoveCoupon();
        closeDrawer();
        router.push(`/checkout/${res.order.id}`);
      } else {
        let friendlyError = ERROR_MESSAGES.SERVER_ERROR;
        const rawError = res.error || "";
        
        if (rawError.includes("no longer available") || rawError.includes("not available")) {
          friendlyError = ERROR_MESSAGES.PRODUCT_NOT_FOUND;
          await validateCartItems();
        } else if (rawError.includes("Insufficient stock") || rawError.includes("stock")) {
          friendlyError = ERROR_MESSAGES.SERVER_ERROR;
          await validateCartItems();
        } else if (rawError.includes("Coupon") || rawError.includes("coupon")) {
          friendlyError = ERROR_MESSAGES.COUPON_INVALID;
        } else if (rawError.includes("network") || rawError.includes("fetch")) {
          friendlyError = ERROR_MESSAGES.NETWORK_ERROR;
        }

        setCheckoutError(friendlyError);
        toast.error(friendlyError);
      }
    } catch {
      setIsSubmitting(false);
      setCheckoutError(ERROR_MESSAGES.SERVER_ERROR);
      toast.error(ERROR_MESSAGES.SERVER_ERROR);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = 
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (selectedType === "ALL") return matchesSearch;
    return product.productType === selectedType && matchesSearch;
  });

  const getProductIcon = (type: ProductType) => {
    switch (type) {
      case ProductType.COURSE_ACCESS:
        return <GraduationCap className="h-4 w-4" />;
      case ProductType.DIGITAL_RESOURCE:
        return <Package className="h-4 w-4" />;
      case ProductType.BUNDLE:
        return <Archive className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  return (
    <div className="relative min-h-screen pb-20 bg-[#0a0a0f] text-slate-100">
      {/* Floating Shopping Cart Trigger */}
      <div className="fixed bottom-6 right-6 z-30">
        <Button 
          onClick={handleCartTrigger}
          className="h-14 w-14 rounded-full shadow-lg bg-violet-600 hover:bg-violet-500 text-white p-0 relative transition-transform hover:scale-105"
        >
          <ShoppingCart className="h-6 w-6" />
          {cart.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-violet-600 text-white font-bold text-xs h-6 w-6 rounded-full flex items-center justify-center border-2 border-background animate-pulse">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
        </Button>
      </div>

      {/* Modern Jumbotron/Banner */}
      <div className="relative py-12 md:py-16 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-b border-slate-800 text-white">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "radial-gradient(circle, #f59e0b 1px, transparent 1px)",
          backgroundSize: "24px 24px"
        }} />
        <Container>
          <div className="max-w-3xl">
            <Badge variant="outline" className="border-amber-500/30 text-amber-500 bg-amber-500/[0.05] tracking-wide uppercase px-3 py-1 text-xs">
              Digital Resources & Materials
            </Badge>
            <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl text-slate-100">
              The Learning <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500">Store</span>
            </h1>
            <p className="mt-4 text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Equip your study setup with premium architected design playbooks, complete responsive UI component bundles, full course access passes, and training bundles.
            </p>
          </div>

          {/* Interactive Filters Bar */}
          <div className="mt-10 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {[
                { label: "All Items", val: "ALL" },
                { label: "PDF Books", val: ProductType.DIGITAL_RESOURCE },
                { label: "Physical Products", val: ProductType.PHYSICAL },
              ].map((item) => (
                <button
                  key={item.val}
                  onClick={() => setSelectedType(item.val)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide border transition-all duration-200 ${
                    selectedType === item.val
                      ? "bg-amber-500 text-slate-950 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)]"
                      : "bg-transparent text-slate-300 border-slate-700 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-white bg-slate-950/40"
              />
            </div>
          </div>
        </Container>
      </div>

      {/* Catalog Grid */}
      <Container className="mt-12">
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-border rounded-3xl max-w-lg mx-auto px-6">
            <Package className="h-12 w-12 text-muted-foreground mx-auto opacity-40 mb-4" />
            <h3 className="text-lg font-semibold">No products found</h3>
            <p className="text-sm text-muted-foreground mt-2">
              We couldn't find any active store products matching your filters. Try checking other categories or adjusting search keywords.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const meta = product.metadata as { originalPrice?: unknown } | null;
              const originalPrice = meta?.originalPrice ? Number(meta.originalPrice) : null;
              const price = product.priceCents / 100;
              const hasDiscount = originalPrice !== null && originalPrice > price && price > 0;
              const discountPercent = hasDiscount ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

              return (
                <Card 
                  key={product.id}
                  className="flex flex-col bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:-translate-y-1.5 hover:shadow-lg hover:shadow-violet-500/20 transition-all duration-300"
                >
                  {/* Card Image */}
                  <div className="relative aspect-[16/10] bg-muted overflow-hidden">
                    <img
                      src={product.coverImageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80"}
                      alt={product.title}
                      className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-slate-900/90 text-white hover:bg-slate-900 backdrop-blur-sm flex items-center gap-1">
                        {getProductIcon(product.productType)}
                        {product.productType.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="flex flex-col flex-1 p-6 bg-transparent">
                    <div className="flex-1 space-y-3">
                      <h3 className="font-display text-lg font-semibold text-white leading-tight hover:text-violet-400 transition">
                        <Link href={`/store/${product.slug}`}>{product.title}</Link>
                      </h3>
                      <p className="text-sm text-slate-400 line-clamp-3">
                        {product.description || "Unlock premium architecture designs and tools."}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-2xl font-bold text-white">
                          <span className="text-violet-400">₹</span>
                          {price.toLocaleString("en-IN")}
                        </span>
                        {hasDiscount && (
                          <div className="flex items-center">
                            <span className="line-through text-slate-500 text-xs font-semibold">₹{originalPrice.toLocaleString("en-IN")}</span>
                            <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full ml-1.5">{discountPercent}% OFF</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          asChild
                          variant="ghost" 
                          size="sm" 
                          className="text-xs border border-white/20 text-slate-300 hover:bg-white/10 hover:text-white"
                        >
                          <Link href={`/store/${product.slug}`}>Details</Link>
                        </Button>
                        <Button 
                          onClick={() => addToCart(product)}
                          size="sm"
                          className="bg-violet-600 hover:bg-violet-500 text-white flex items-center gap-1.5 animate-none"
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Container>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <div 
            onClick={closeDrawer}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" 
          />

          {/* Drawer Body */}
          <div className="fixed inset-y-0 right-0 z-50 flex flex-col w-full sm:w-[420px] max-w-full bg-[#0d1117] border-l border-white/10 shadow-2xl">
            {/* Header Sticky */}
            <div className="sticky top-0 z-10 bg-[#0d1117] border-b border-white/10 px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-violet-400" />
                <h2 className="text-lg font-semibold text-white">Your Shopping Cart</h2>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={closeDrawer}
                className="h-8 w-8 rounded-full text-white hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Scrollable Drawer Content */}
            <form onSubmit={handleCheckout} className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-3 space-y-6">
                {cart.length === 0 ? (
                  /* Fix 2: Empty Cart State Styling */
                  <div className="flex flex-col items-center justify-center flex-1 px-6 py-12 gap-4 h-full">
                    <ShoppingCart className="w-16 h-16 text-violet-400/40" />
                    <h3 className="text-white font-bold text-lg">Your cart is empty</h3>
                    <p className="text-slate-400 text-sm text-center">Browse our catalog and add playbooks or access vouchers.</p>
                    <button 
                      type="button" 
                      onClick={closeDrawer} 
                      className="w-full h-11 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-colors"
                    >
                      Back to Shopping
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Cart Items list */}
                    <div className="space-y-4">
                      <h3 className="text-slate-400 text-xs tracking-widest uppercase font-semibold">Cart Items ({cart.reduce((sum, item) => sum + item.quantity, 0)})</h3>
                      <div className="space-y-3">
                        {cart.map((item) => (
                          <div key={item.productId} className="p-4 flex gap-4 items-center bg-white/5 border border-white/10 rounded-xl">
                            <img
                              src={item.product?.coverImageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80"}
                              alt={item.product?.title}
                              className="w-12 h-12 object-cover rounded-lg bg-muted flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm text-white truncate">{item.product?.title}</h4>
                              <p className="text-sm text-violet-400 font-semibold mt-0.5">
                                ₹{((item.product?.priceCents * item.quantity) / 100).toLocaleString("en-IN")}
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.productId, -1)}
                                className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center hover:bg-white/10 text-white text-xs transition duration-200"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="text-sm font-semibold w-5 text-center text-white">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.productId, 1)}
                                className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center hover:bg-white/10 text-white text-xs transition duration-200"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                              <Button 
                                type="button"
                                variant="ghost" 
                                size="icon" 
                                onClick={() => removeFromCart(item.productId)}
                                className="h-8 w-8 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg ml-1"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Coupon Code section */}
                    <div className="space-y-3 pt-4 border-t border-white/10">
                      <h3 className="text-slate-400 text-xs tracking-widest uppercase font-semibold">Discount Coupon</h3>
                      {appliedCoupon ? (
                        <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl p-3 text-sm">
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
                            className="flex-1 bg-white/5 border border-white/10 text-white placeholder:text-slate-500 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                          <Button type="button" onClick={handleApplyCoupon} size="sm" className="px-3 text-xs bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg">
                            Apply
                          </Button>
                        </div>
                      )}
                      {couponError && <p className="text-xs text-destructive">{couponError}</p>}
                    </div>

                    {/* Billing Details */}
                    <div className="space-y-4 pt-4 border-t border-white/10">
                      <h3 className="text-slate-400 text-xs tracking-widest uppercase font-semibold">Billing Details</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Billing Email *</label>
                          <input
                            type="email"
                            required
                            placeholder="sudhir.kumar@gmail.com"
                            value={billingEmail}
                            onChange={(e) => setBillingEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-500 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Billing Phone / Mobile</label>
                          <input
                            type="tel"
                            placeholder="+91 99999 88888"
                            value={billingPhone}
                            onChange={(e) => setBillingPhone(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-500 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
                          />
                        </div>

                        {/* Physical shipping fields */}
                        {hasPhysicalOrShippingNeed && (
                          <div className="space-y-3 p-4 border border-white/10 bg-white/5 rounded-2xl">
                            <div className="flex items-center gap-1.5 text-violet-400 font-semibold text-xs mb-1 uppercase tracking-wide">
                              <Package className="h-3.5 w-3.5" />
                              <span>Shipping Address Required</span>
                            </div>
                            
                            <div>
                              <label className="text-[9px] text-slate-400 uppercase tracking-wider block mb-1">Recipient Name *</label>
                              <input
                                type="text"
                                required
                                placeholder="Sudhir Kumar"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-500 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-violet-500"
                              />
                            </div>

                            <div>
                              <label className="text-[9px] text-slate-400 uppercase tracking-wider block mb-1">Address *</label>
                              <input
                                type="text"
                                required
                                placeholder="A-12, Ring Road"
                                value={addressLine1}
                                onChange={(e) => setAddressLine1(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-500 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-violet-500"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[9px] text-slate-400 uppercase tracking-wider block mb-1">City *</label>
                                <input
                                  type="text"
                                  required
                                  placeholder="New Delhi"
                                  value={city}
                                  onChange={(e) => setCity(e.target.value)}
                                  className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-500 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-violet-500"
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
                                  className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-500 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-violet-500"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[9px] text-slate-400 uppercase tracking-wider block mb-1">PIN Code *</label>
                                <input
                                  type="text"
                                  required
                                  placeholder="110024"
                                  value={postalCode}
                                  onChange={(e) => setPostalCode(e.target.value)}
                                  className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-500 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-violet-500"
                                />
                              </div>
                              <div>
                                <label className="text-[9px] text-slate-400 uppercase tracking-wider block mb-1">Primary Phone *</label>
                                <input
                                  type="tel"
                                  required
                                  placeholder="+91 99999 88888"
                                  value={shippingPhone1}
                                  onChange={(e) => setShippingPhone1(e.target.value)}
                                  className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-500 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-violet-500"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        <div>
                          <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Order Notes</label>
                          <textarea
                            placeholder="Special instructions..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={2}
                            className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-500 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Sticky Footer */}
              {cart.length > 0 && (
                <div className="p-4 border-t border-white/10 bg-[#0d1117] sticky bottom-0 z-10 space-y-3">
                  {checkoutError && <p className="text-xs text-rose-500 font-medium">{checkoutError}</p>}
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Subtotal</span>
                      <span>₹{(subtotalCents / 100).toLocaleString("en-IN")}</span>
                    </div>
                    {couponDiscount > 0 && (
                      <div className="flex justify-between text-emerald-400">
                        <span>Discount Applied</span>
                        <span>-₹{(couponDiscount / 100).toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    {hasPhysicalOrShippingNeed && (
                      <div className="flex justify-between text-slate-400">
                        <span>Shipping</span>
                        <span>{shippingChargeCents === 0 ? "FREE" : `₹${shippingChargeCents / 100}`}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-bold text-white pt-1.5 border-t border-white/10">
                      <span>Total</span>
                      <span>₹{(totalCents / 100).toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-12 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    {isSubmitting ? "Processing..." : "Secure Checkout"}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
