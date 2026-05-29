"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ShoppingCart, Search, X, Plus, Minus, Trash2, 
  Ticket, ArrowRight, Lock, HelpCircle, Package, GraduationCap, Archive
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { createOrderAction, validateCouponAction } from "@/lib/store/actions";
import { Product, ProductType } from "@prisma/client";
import { cn } from "@/lib/utils";

interface StoreClientProps {
  products: Product[];
  profileUser?: {
    email: string;
    name: string;
    phone: string;
  } | null;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export function StoreClient({ products, profileUser }: StoreClientProps) {
  const router = useRouter();
  
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Custom Toast State
  const [toast, setToast] = useState<{ message: string; type: "amber" | "green" | "neutral" | "red" } | null>(null);

  const showToast = (message: string, type: "amber" | "green" | "neutral" | "red" = "neutral") => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    setIsMobile(media.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  // Silently validate all cart item IDs
  const validateCartItems = async (currentCart: CartItem[]): Promise<CartItem[]> => {
    if (currentCart.length === 0) return [];
    
    let validItems: CartItem[] = [];
    let removedNames: string[] = [];
    let hasChanges = false;
    
    for (const item of currentCart) {
      try {
        const res = await fetch(`/api/store/products/${item.product.id}`);
        if (res.ok) {
          const data = await res.json();
          // Update product object just in case price or stock changed
          validItems.push({
            product: data.product,
            quantity: Math.min(item.quantity, data.product.inventoryCount ?? item.quantity)
          });
          if (item.quantity !== Math.min(item.quantity, data.product.inventoryCount ?? item.quantity)) {
            hasChanges = true;
          }
        } else {
          removedNames.push(item.product.title || "An item");
          hasChanges = true;
        }
      } catch (e) {
        console.error("Failed to validate item", item.product.id, e);
        // Fallback: keep item in cart if validation endpoint fails due to network/timeout
        validItems.push(item);
      }
    }
    
    if (hasChanges) {
      saveCart(validItems);
      if (removedNames.length > 0) {
        showToast("One or more items in your cart are no longer available and have been removed.", "amber");
      }
    }
    return validItems;
  };

  // Run validation on cart open
  useEffect(() => {
    if (isCartOpen) {
      validateCartItems(cart);
    }
  }, [isCartOpen]);

  // Run validation on initial load
  useEffect(() => {
    const storedCart = localStorage.getItem("el_store_cart");
    if (storedCart) {
      try {
        const parsed = JSON.parse(storedCart);
        if (Array.isArray(parsed) && parsed.length > 0) {
          validateCartItems(parsed);
        }
      } catch (e) {
        console.error("Error parsing cart in initial load validation", e);
      }
    }
  }, []);

  const handleCartTrigger = () => {
    if (isMobile) {
      router.push("/cart");
    } else {
      setIsCartOpen(true);
    }
  };
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
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

  // Load cart from localStorage
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("el_store_cart");
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    }
  }, []);

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

  // Add to cart
  const addToCart = (product: Product) => {
    const existingIndex = cart.findIndex(item => item.product.id === product.id);
    let newCart = [...cart];
    if (existingIndex > -1) {
      newCart[existingIndex].quantity += 1;
    } else {
      newCart.push({ product, quantity: 1 });
    }
    saveCart(newCart);
    showToast("Item added to cart.", "green");
    
    if (isMobile) {
      router.push("/cart");
    } else {
      setIsCartOpen(true);
    }
  };

  // Remove from cart
  const removeFromCart = (productId: string) => {
    const item = cart.find(item => item.product.id === productId);
    const newCart = cart.filter(item => item.product.id !== productId);
    saveCart(newCart);
    showToast("Item removed from cart.", "neutral");
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
      
      // Stock check if applicable
      const product = newCart[existingIndex].product;
      if (product.inventoryCount !== null && delta > 0 && product.inventoryCount < newQty) {
        showToast(`'${product.title}' is currently out of stock and has been removed from your cart.`, "amber");
        return;
      }

      if (newQty <= 0) {
        newCart.splice(existingIndex, 1);
        showToast("Item removed from cart.", "neutral");
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
      showToast(`Coupon applied! You saved ₹${(res.discountCents / 100).toFixed(0)}.`, "green");
    } else {
      let friendlyCouponError = "This coupon code is invalid or has expired. Please try a different code.";
      if (res.error?.includes("already used") || res.error?.includes("once")) {
        friendlyCouponError = "You have already used this coupon. Each coupon can only be used once.";
      }
      setCouponError(friendlyCouponError);
      showToast(friendlyCouponError, "red");
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

  // Check if cart contains physical product / shipping need
  const hasPhysicalOrShippingNeed = cart.some(
    item => item.product.shippingRequired === true || item.product.productType === ProductType.PHYSICAL
  );

  // Free shipping above ₹500 (50000 cents), otherwise shipping is ₹50 (5000 cents)
  const shippingChargeCents = hasPhysicalOrShippingNeed 
    ? (subtotalCents > 50000 ? 0 : 5000) 
    : 0;

  const totalCents = Math.max(0, subtotalCents - couponDiscount + shippingChargeCents);

  // Checkout submission
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError("");
    
    // 1. Silent pre-validation before submission
    const verifiedCart = await validateCartItems(cart);
    if (verifiedCart.length === 0) {
      const emptyError = "Your cart is empty. The items you added are no longer available in the store.";
      setCheckoutError(emptyError);
      showToast(emptyError, "red");
      return;
    }

    if (!billingEmail) {
      const emailError = "Please enter your billing email address.";
      setCheckoutError(emailError);
      showToast(emailError, "red");
      return;
    }

    if (hasPhysicalOrShippingNeed && (!fullName || !addressLine1 || !city || !postalCode || !shippingState || !shippingPhone1)) {
      const shippingError = "Please fill out all required shipping fields for products in your cart.";
      setCheckoutError(shippingError);
      showToast(shippingError, "red");
      return;
    }

    setIsSubmitting(true);

    // Build shipping metadata if applicable
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
      cartItems: verifiedCart.map(item => ({
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
      // Clear cart
      saveCart([]);
      handleRemoveCoupon();
      setIsCartOpen(false);
      // Redirect to secure payment gateway route
      router.push(`/checkout/${res.order.id}`);
    } else {
      // technical to friendly error mapping
      let friendlyError = "Something went wrong. Please refresh the page and try again.";
      const rawError = res.error || "";
      
      if (rawError.includes("no longer available") || rawError.includes("not available")) {
        friendlyError = "One or more items in your cart are no longer available and have been removed.";
        validateCartItems(verifiedCart); // Reclean just in case
      } else if (rawError.includes("Insufficient stock") || rawError.includes("stock")) {
        friendlyError = "An item in your cart is currently out of stock and has been adjusted or removed.";
        validateCartItems(verifiedCart); // Reclean to sync with stock limits
      } else if (rawError.includes("Coupon") || rawError.includes("coupon")) {
        friendlyError = "This coupon code is invalid or has expired. Please try a different code.";
      } else if (rawError.includes("network") || rawError.includes("fetch")) {
        friendlyError = "We couldn't verify your cart items. Please check your connection and try again.";
      }

      setCheckoutError(friendlyError);
      showToast(friendlyError, "red");
    }
  };

  // Filter products
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
            <span className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground font-bold text-xs h-6 w-6 rounded-full flex items-center justify-center border-2 border-background animate-pulse">
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
                className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50"
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
                          className="bg-violet-600 hover:bg-violet-500 text-white flex items-center gap-1.5"
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

      {/* Animated Slide-out Cart & Checkout Drawer (Desktop/Tablet Only) */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <div 
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-background/60 backdrop-blur-sm transition-opacity" 
          />

          {/* Drawer Body */}
          <div className="relative w-[420px] max-w-full bg-[#0d0d18] border-l border-white/10 h-full shadow-2xl flex flex-col z-10 transition-transform duration-300">
            {/* Drawer Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-violet-400" />
                <h2 className="text-lg font-semibold text-white">Your Shopping Cart</h2>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsCartOpen(false)}
                className="h-8 w-8 rounded-full text-white hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Scrollable Drawer Content */}
            <form onSubmit={handleCheckout} className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent overscroll-contain">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
                    <ShoppingCart className="h-12 w-12 text-violet-400/40" />
                    <h3 className="font-semibold text-lg text-white">Your cart is empty</h3>
                    <p className="text-sm text-slate-400 max-w-[250px]">
                      Browse our items catalog and add playbooks or access vouchers to get started.
                    </p>
                    <Button onClick={() => setIsCartOpen(false)} size="sm" className="w-full h-11 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-colors">
                      Back to shopping
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* Cart Items list */}
                    <div className="space-y-4">
                      <h3 className="text-slate-400 text-xs tracking-widest uppercase font-semibold">Cart Items ({cart.reduce((sum, item) => sum + item.quantity, 0)})</h3>
                      <div className="space-y-3">
                        {cart.map((item) => (
                          <div key={item.product.id} className="p-4 flex gap-4 items-center bg-white/5 border border-white/10 rounded-xl">
                            <img
                              src={item.product.coverImageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80"}
                              alt={item.product.title}
                              className="w-12 h-12 object-cover rounded-lg bg-muted flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm text-white truncate">{item.product.title}</h4>
                              <p className="text-sm text-violet-400 font-semibold mt-0.5">
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

                    {/* Billing & Checkout Details */}
                    <div className="space-y-4 pt-4 border-t border-white/10">
                      <h3 className="text-slate-400 text-xs tracking-widest uppercase font-semibold">Billing Details</h3>
                      
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 gap-3">
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
                            <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Billing Phone / Mobile (Editable)</label>
                            <input
                              type="tel"
                              placeholder="+91 99999 88888"
                              value={billingPhone}
                              onChange={(e) => setBillingPhone(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-500 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
                            />
                          </div>
                        </div>

                        {/* Render physical shipping address if needed */}
                        {hasPhysicalOrShippingNeed && (
                          <div className="space-y-3 p-4 border border-white/10 bg-white/5 rounded-2xl">
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
                                className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-500 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-violet-500"
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
                                className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-500 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-violet-500"
                              />
                            </div>

                            <div>
                              <label className="text-[9px] text-slate-400 uppercase tracking-wider block mb-1">Address Line 2 (Optional)</label>
                              <input
                                type="text"
                                placeholder="Near Metro Station"
                                value={addressLine2}
                                onChange={(e) => setAddressLine2(e.target.value)}
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
                                <label className="text-[9px] text-slate-400 uppercase tracking-wider block mb-1">Country *</label>
                                <input
                                  type="text"
                                  required
                                  placeholder="India"
                                  value={country}
                                  onChange={(e) => setCountry(e.target.value)}
                                  className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-500 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-violet-500"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
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
                              <div>
                                <label className="text-[9px] text-slate-400 uppercase tracking-wider block mb-1">Secondary Phone</label>
                                <input
                                  type="tel"
                                  placeholder="+91 88888 77777"
                                  value={shippingPhone2}
                                  onChange={(e) => setShippingPhone2(e.target.value)}
                                  className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-500 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-violet-500"
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
                  </>
                )}
              </div>

              {/* STICKY FOOTER CHECKOUT BLOCK (Strictly fixed at bottom of drawer viewport) */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-white/10 bg-[#0d0d18] sticky bottom-0 z-20 space-y-4">
                  {checkoutError && <p className="text-xs text-destructive font-medium">{checkoutError}</p>}

                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between text-slate-300">
                      <span>Cart Subtotal</span>
                      <span>₹{(subtotalCents / 100).toLocaleString("en-IN")}</span>
                    </div>
                    {couponDiscount > 0 && (
                      <div className="flex justify-between text-emerald-400 font-medium">
                        <span>Discount Applied</span>
                        <span>-₹{(couponDiscount / 100).toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    {hasPhysicalOrShippingNeed && (
                      <div className="flex justify-between text-slate-300">
                        <span>Shipping Charges</span>
                        <span>
                          {shippingChargeCents === 0 ? (
                            <span className="text-emerald-400 font-medium">FREE</span>
                          ) : (
                            `₹${(shippingChargeCents / 100).toLocaleString("en-IN")}`
                          )}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-extrabold text-white pt-2 border-t border-dashed border-white/10">
                      <span>Total Price</span>
                      <span>₹{(totalCents / 100).toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-11 bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm flex items-center justify-center gap-1.5 rounded-xl transition duration-200"
                  >
                    <Lock className="h-4 w-4" />
                    {isSubmitting ? "Generating secure order..." : "Secure Checkout Payment"}
                    <ArrowRight className="h-4 w-4 shrink-0" />
                  </Button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
      {/* Custom Toast Notification System */}
      {toast && (
        <div className={cn(
          "fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-2xl text-xs font-bold shadow-2xl border backdrop-blur-md transition-all duration-300",
          toast.type === "amber" && "bg-amber-500/20 border-amber-500/30 text-amber-300 shadow-amber-500/10",
          toast.type === "green" && "bg-emerald-500/20 border-emerald-500/30 text-emerald-300 shadow-emerald-500/10",
          toast.type === "red" && "bg-rose-500/20 border-rose-500/30 text-rose-300 shadow-rose-500/10",
          toast.type === "neutral" && "bg-slate-900/90 border-white/10 text-white shadow-black/40"
        )}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
