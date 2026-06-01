"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  ShoppingCart, Search, X, Plus, Minus, Trash2, 
  Ticket, ArrowRight, Lock, Package, GraduationCap, Archive,
  Loader2
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
  const searchParams = useSearchParams();
  
  // Search and filter states
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [isMobile, setIsMobile] = useState(false);

  // Sync state from query params on mount/change
  useEffect(() => {
    const q = searchParams.get("q") || "";
    setInputValue(q);
    setSearchQuery(q);
  }, [searchParams]);

  // Debounced URL updates & filtering
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(inputValue);
      
      const params = new URLSearchParams(window.location.search);
      if (inputValue) {
        params.set("q", inputValue);
      } else {
        params.delete("q");
      }
      router.push(`/store?${params.toString()}`, { scroll: false });
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, router]);

  // Zustand Store Integration
  const isCartOpen = useCartStore((state) => state.isDrawerOpen);
  const cart = useCartStore((state) => state.cartItems);
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const initializeCart = useCartStore((state) => state.initializeCart);
  const closeDrawer = useCartStore((state) => state.closeDrawer);
  const openDrawer = useCartStore((state) => state.openDrawer);

  const handleGoToCart = () => {
    if (window.innerWidth < 768) {
      router.push('/cart');
    } else {
      openDrawer();
    }
  };

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

  // Helper to format phone to: 91021 30956
  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, "");
    let clean = digits;
    if (clean.startsWith("91") && clean.length > 10) {
      clean = clean.substring(2);
    }
    clean = clean.slice(0, 10);
    if (clean.length > 5) {
      return `${clean.slice(0, 5)} ${clean.slice(5)}`;
    }
    return clean;
  };

  // Helper to validate phone number (must be 10 digits and start with 6-9)
  const validatePhone = (phone: string) => {
    const digits = phone.replace(/\D/g, "");
    return digits.length === 10 && /^[6-9]\d{9}$/.test(digits);
  };

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponSuccessMsg, setCouponSuccessMsg] = useState("");
  const [showCouponInput, setShowCouponInput] = useState(false);

  // Address Modal States
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    mobileNumber: "",
    emailAddress: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: ""
  });

  // Billing and shipping details from profile
  const [billingEmail, setBillingEmail] = useState(profileUser?.email || "");
  const [billingPhone, setBillingPhone] = useState(profileUser?.phone ? formatPhoneNumber(profileUser.phone) : "");
  const [fullName, setFullName] = useState(profileUser?.name || "");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [shippingState, setShippingState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("India");
  const [shippingPhone1, setShippingPhone1] = useState(profileUser?.phone ? formatPhoneNumber(profileUser.phone) : "");
  const [shippingPhone2, setShippingPhone2] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const [checkoutError, setCheckoutError] = useState("");

  // Subtotal in cents
  const subtotalCents = cart.reduce((acc, item) => acc + (item.product.priceCents * item.quantity), 0);

  // Fetch / Sync profile address details on load
  const syncProfileAddress = async () => {
    try {
      const res = await fetch("/api/profile", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      if (data?.user) {
        const u = data.user;
        if (u.email && !billingEmail) setBillingEmail(u.email);
        if (u.phone) {
          const formatted = formatPhoneNumber(u.phone);
          if (!billingPhone) setBillingPhone(formatted);
          if (!shippingPhone1) setShippingPhone1(formatted);
        }
        if (u.name && !fullName) setFullName(u.name);
        
        if (u.addressLine1) setAddressLine1(u.addressLine1);
        if (u.addressLine2) setAddressLine2(u.addressLine2);
        if (u.city) setCity(u.city);
        if (u.state) setShippingState(u.state);
        if (u.postalCode) setPostalCode(u.postalCode);
        if (u.country) setCountry(u.country);

        setAddressForm({
          fullName: u.name || fullName || "",
          mobileNumber: u.phone ? formatPhoneNumber(u.phone) : (billingPhone || ""),
          emailAddress: u.email || billingEmail || "",
          addressLine1: u.addressLine1 || "",
          addressLine2: u.addressLine2 || "",
          city: u.city || "",
          state: u.state || "",
          pincode: u.postalCode || ""
        });
      }
    } catch (e) {
      // Non-blocking
    }
  };

  useEffect(() => {
    syncProfileAddress();
  }, []);

  const openEditAddressModal = () => {
    setAddressForm({
      fullName: fullName || profileUser?.name || "",
      mobileNumber: shippingPhone1 || billingPhone || profileUser?.phone ? formatPhoneNumber(profileUser?.phone || "") : "",
      emailAddress: billingEmail || profileUser?.email || "",
      addressLine1: addressLine1 || "",
      addressLine2: addressLine2 || "",
      city: city || "",
      state: shippingState || "",
      pincode: postalCode || ""
    });
    setShowAddressModal(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressForm.fullName || !addressForm.mobileNumber || !addressForm.emailAddress) {
      toast.error("Name, Mobile, and Email are required.");
      return;
    }

    if (hasPhysicalOrShippingNeed && (!addressForm.addressLine1 || !addressForm.city || !addressForm.state || !addressForm.pincode)) {
      toast.error("Please fill in all address fields for physical delivery.");
      return;
    }

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: addressForm.fullName,
          email: addressForm.emailAddress,
          phone: addressForm.mobileNumber,
          addressLine1: addressForm.addressLine1,
          addressLine2: addressForm.addressLine2,
          city: addressForm.city,
          state: addressForm.state,
          postalCode: addressForm.pincode,
          country: "India"
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        toast.error(errData.error || "Failed to save address info.");
        return;
      }

      // Update both profile and checkout state instantly
      setFullName(addressForm.fullName);
      setBillingEmail(addressForm.emailAddress);
      setBillingPhone(formatPhoneNumber(addressForm.mobileNumber));
      setShippingPhone1(formatPhoneNumber(addressForm.mobileNumber));
      setAddressLine1(addressForm.addressLine1);
      setAddressLine2(addressForm.addressLine2);
      setCity(addressForm.city);
      setShippingState(addressForm.state);
      setPostalCode(addressForm.pincode);
      setCountry("India");

      setShowAddressModal(false);
      toast.success("Delivery / Contact Information updated successfully!");
    } catch {
      toast.error("Failed to connect. Please try again.");
    }
  };

  // Apply Coupon
  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccessMsg("");
    if (!couponCode) return;

    try {
      const res = await validateCouponAction(couponCode, subtotalCents);
      if (res.success && res.coupon && res.discountCents !== undefined) {
        setAppliedCoupon(res.coupon);
        setCouponDiscount(res.discountCents);
        setCouponSuccessMsg(`✓ ${res.coupon.code} applied! You saved ₹${(res.discountCents / 100).toFixed(0)}.`);
        toast.success(`Coupon applied successfully!`);
      } else {
        let friendlyCouponError = "✕ This coupon is invalid or expired.";
        if (res.error?.includes("already used") || res.error?.includes("once")) {
          friendlyCouponError = "✕ You have already used this coupon.";
        }
        setCouponError(friendlyCouponError);
        toast.error(friendlyCouponError.replace("✕ ", ""));
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
    setCouponSuccessMsg("");
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
      setCouponSuccessMsg(`✓ ${appliedCoupon.code} applied! You saved ₹${(Math.min(discount, subtotalCents) / 100).toFixed(0)}.`);
    }
  }, [subtotalCents, appliedCoupon]);

  const hasPhysicalOrShippingNeed = cart.some(
    item => item.product.shippingRequired === true || item.product.productType === ProductType.PHYSICAL
  );

  const physicalSubtotalCents = cart
    .filter(item => item.product.productType === ProductType.PHYSICAL || item.product.shippingRequired)
    .reduce((acc, item) => acc + (item.product.priceCents * item.quantity), 0);

  const shippingChargeCents = hasPhysicalOrShippingNeed 
    ? (physicalSubtotalCents >= 49900 ? 0 : 4000) 
    : 0;

  const totalCents = Math.max(0, subtotalCents - couponDiscount + shippingChargeCents);

  // Submit checkout
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || submittingRef.current) return;
    setCheckoutError("");
    
    await validateCartItems();
    if (cart.length === 0) {
      const emptyError = ERROR_MESSAGES.ALL_ITEMS_INVALID;
      setCheckoutError(emptyError);
      toast.error(emptyError);
      return;
    }

    if (!billingEmail || !billingEmail.includes('@')) {
      const emailError = "Please enter a valid billing email address.";
      setCheckoutError(emailError);
      toast.error(emailError);
      return;
    }

    if (!billingPhone || !validatePhone(billingPhone)) {
      const phoneError = "Please enter a valid 10-digit billing phone number.";
      setCheckoutError(phoneError);
      toast.error(phoneError);
      return;
    }

    if (hasPhysicalOrShippingNeed) {
      if (!fullName || !addressLine1 || !city || !postalCode || !shippingState || !shippingPhone1) {
        const shippingError = "Please fill out and save your delivery details before proceeding.";
        setCheckoutError(shippingError);
        toast.error(shippingError);
        return;
      }
      if (!validatePhone(shippingPhone1)) {
        const phoneError = "Please enter a valid 10-digit primary shipping phone number.";
        setCheckoutError(phoneError);
        toast.error(phoneError);
        return;
      }
    }

    setIsSubmitting(true);
    submittingRef.current = true;

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
      const res = await fetch('/api/store/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          billingEmail,
          billingPhone,
          couponCode: appliedCoupon?.code || null,
          orderNotes: notes || null,
          shippingAddress: shippingDetails,
        })
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Something went wrong. Please try again.");
        setIsSubmitting(false);
        submittingRef.current = false;
        return;
      }

      const { razorpayOrderId, internalOrderId, amount } = data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_51I2V3X4Y5Z6A7B",
        amount: amount,
        currency: "INR",
        name: "E-Learning Platform",
        description: `${cart.length} item(s)`,
        order_id: razorpayOrderId,
        prefill: {
          name: fullName || profileUser?.name || "",
          email: billingEmail,
          contact: billingPhone,
        },
        theme: { color: "#7c3aed" },
        modal: {
          ondismiss: async () => {
            await fetch('/api/razorpay/fail', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderId: internalOrderId })
            });
            toast.warning("Payment cancelled.");
            setIsSubmitting(false);
            submittingRef.current = false;
          }
        },
        handler: async (response: any) => {
          const verifyRes = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: internalOrderId,
            })
          });

          if (verifyRes.ok) {
            clearCart();
            handleRemoveCoupon();
            closeDrawer();
            toast.success("Order placed successfully!");
            router.push(`/order-confirmation/${internalOrderId}`);
          } else {
            toast.error("Payment verification failed. If amount was deducted, contact support.");
            setIsSubmitting(false);
            submittingRef.current = false;
          }
        }
      };

      const razorpay = new (window as any).Razorpay(options);

      razorpay.on('payment.failed', async (response: any) => {
        await fetch('/api/razorpay/fail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: internalOrderId,
            errorCode: response.error.code,
            errorDescription: response.error.description,
          })
        });
        toast.error("Payment failed. Please try again or use a different payment method.");
        setIsSubmitting(false);
        submittingRef.current = false;
      });

      razorpay.open();

    } catch (err) {
      toast.error("Something went wrong. Please refresh and try again.");
      setIsSubmitting(false);
      submittingRef.current = false;
    }
  };

  const filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      product.title.toLowerCase().includes(query) ||
      (product.description && product.description.toLowerCase().includes(query)) ||
      (product.productType === "DIGITAL_RESOURCE" && "pdf book digital resource ebook".includes(query)) ||
      (product.productType === "PHYSICAL" && "physical product merchandise".includes(query));
    
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

          {/* Interactive Search Bar & Filters Bar */}
          <div className="mt-10 flex flex-col items-center gap-6 w-full max-w-xl mx-auto">
            {/* Search Input Container */}
            <div className="relative w-full">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Search className="h-5 w-5" />
              </span>
              <input
                type="search"
                inputMode="search"
                placeholder="Search products..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full h-12 pl-12 pr-10 text-base bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white placeholder-slate-400 backdrop-blur-md transition-all duration-200"
              />
              {inputValue && (
                <button
                  type="button"
                  onClick={() => {
                    setInputValue("");
                    setSearchQuery("");
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex overflow-x-auto w-full md:w-auto scrollbar-none whitespace-nowrap gap-2 justify-start md:justify-center md:flex-wrap px-4 py-1 shrink-0">
              {[
                { label: "All Products", val: "ALL" },
                { label: "PDF Books", val: ProductType.DIGITAL_RESOURCE },
                { label: "Physical Products", val: ProductType.PHYSICAL },
              ].map((item) => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => setSelectedType(item.val)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide border transition-all duration-200 shrink-0 ${
                    selectedType === item.val
                      ? "bg-indigo-600 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.25)]"
                      : "bg-white/5 text-slate-300 border-white/10 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Showing X of Y products */}
            <p className="text-xs text-slate-400 font-medium">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>
        </Container>
      </div>

      {/* Catalog Grid */}
      <Container className="mt-12">
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl max-w-lg mx-auto px-6 bg-white/[0.02] backdrop-blur-md">
            <Package className="h-12 w-12 text-slate-500 mx-auto opacity-40 mb-4" />
            <h3 className="text-lg font-bold text-white">No products found</h3>
            <p className="text-sm text-slate-400 mt-2">
              We couldn't find any products matching "{inputValue || selectedType}".
            </p>
            <Button
              onClick={() => {
                setInputValue("");
                setSearchQuery("");
                setSelectedType("ALL");
              }}
              className="mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl"
            >
              Clear Search & Reset Filters
            </Button>
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
                        {cart.some(item => item.productId === product.id) ? (
                          <Button 
                            onClick={handleGoToCart}
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 animate-none"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            Go to Cart
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => addToCart(product)}
                            size="sm"
                            className="bg-violet-600 hover:bg-violet-500 text-white flex items-center gap-1.5 animate-none"
                          >
                            Add to Cart
                          </Button>
                        )}
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

                    {/* Contact & Delivery Details (Card Style) */}
                    <div className="space-y-4 pt-4 border-t border-white/10">
                      <h3 className="text-slate-400 text-xs tracking-widest uppercase font-semibold">
                        {hasPhysicalOrShippingNeed ? "Delivery Information" : "Contact Information"}
                      </h3>
                      
                      {(!hasPhysicalOrShippingNeed && billingEmail && billingPhone) || 
                       (hasPhysicalOrShippingNeed && fullName && billingPhone && billingEmail && addressLine1 && postalCode) ? (
                        <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2 relative">
                          <div className="text-sm font-bold text-white flex justify-between items-center">
                            <span>{fullName || "Recipient Name"}</span>
                            <button
                              type="button"
                              onClick={openEditAddressModal}
                              className="text-xs text-violet-400 hover:text-violet-300 font-semibold transition"
                            >
                              [Edit]
                            </button>
                          </div>
                          <div className="text-xs text-slate-300 space-y-1">
                            <p>{billingPhone}</p>
                            <p>{billingEmail}</p>
                            {hasPhysicalOrShippingNeed && (
                              <p className="mt-1 text-slate-400">
                                {addressLine1}
                                {addressLine2 ? `, ${addressLine2}` : ""}<br />
                                {city}, {shippingState} - {postalCode}
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-white/5 border border-dashed border-white/20 rounded-xl text-center space-y-3">
                          <p className="text-xs text-slate-400">
                            {hasPhysicalOrShippingNeed ? "No address added yet" : "No contact info added yet"}
                          </p>
                          <button
                            type="button"
                            onClick={openEditAddressModal}
                            className="inline-flex items-center justify-center px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-lg transition"
                          >
                            {hasPhysicalOrShippingNeed ? "[+ Add Address]" : "[+ Add Contact]"}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Coupon Code section */}
                    <div className="space-y-3 pt-4 border-t border-white/10">
                      {!showCouponInput && !appliedCoupon ? (
                        <button
                          type="button"
                          onClick={() => setShowCouponInput(true)}
                          className="text-xs font-semibold text-violet-400 hover:text-violet-300 transition"
                        >
                          Have a Coupon? [Apply Coupon]
                        </button>
                      ) : (
                        <div className="space-y-3">
                          <h3 className="text-slate-400 text-xs tracking-widest uppercase font-semibold">Discount Coupon</h3>
                          {appliedCoupon ? (
                            <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl p-3 text-sm">
                              <div className="flex items-center gap-1.5 font-medium">
                                <Ticket className="h-4 w-4 text-emerald-400" />
                                <span>Code: {appliedCoupon.code}</span>
                              </div>
                              <button 
                                type="button" 
                                onClick={handleRemoveCoupon} 
                                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors px-2 py-1 hover:bg-emerald-500/10 rounded-lg"
                              >
                                [Remove]
                              </button>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Coupon Code"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value.replace(/[^A-Za-z0-9]/g, "").toUpperCase())}
                                className="flex-1 bg-white/5 border border-white/10 text-white placeholder:text-slate-500 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              />
                              <Button type="button" onClick={handleApplyCoupon} size="sm" className="px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold">
                                Apply
                              </Button>
                            </div>
                          )}
                          {couponSuccessMsg && <p className="text-xs text-emerald-400 font-medium">{couponSuccessMsg}</p>}
                          {couponError && <p className="text-xs text-rose-500 font-medium">{couponError}</p>}
                        </div>
                      )}
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
                    {hasPhysicalOrShippingNeed && (
                      <div className="flex justify-between text-slate-400">
                        <span>Shipping Fee</span>
                        <span>{shippingChargeCents === 0 ? "FREE" : `₹${shippingChargeCents / 100}`}</span>
                      </div>
                    )}
                    {couponDiscount > 0 && (
                      <div className="flex justify-between text-emerald-400">
                        <span>Discount</span>
                        <span>-₹{(couponDiscount / 100).toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-bold text-white pt-1.5 border-t border-white/10">
                      <span>Total</span>
                      <span>₹{(totalCents / 100).toLocaleString("en-IN")}</span>
                    </div>
                    <div className="text-[10px] text-emerald-400 font-semibold mt-1">
                      ✓ Tax included
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        Proceed to Payment
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Address Reusable Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0d1117] border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-lg font-bold text-white">
              {hasPhysicalOrShippingNeed ? "Edit Delivery Address" : "Edit Contact Information"}
            </h3>
            <form onSubmit={handleSaveAddress} className="space-y-3">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Full Name *</label>
                <input
                  type="text"
                  required
                  value={addressForm.fullName}
                  onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={addressForm.mobileNumber}
                  onChange={(e) => setAddressForm({ ...addressForm, mobileNumber: formatPhoneNumber(e.target.value) })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                  placeholder="98765 43210"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Email Address *</label>
                <input
                  type="email"
                  required
                  value={addressForm.emailAddress}
                  onChange={(e) => setAddressForm({ ...addressForm, emailAddress: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                  placeholder="john@email.com"
                />
              </div>

              {hasPhysicalOrShippingNeed && (
                <>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-semibold">Address Line 1 *</label>
                    <input
                      type="text"
                      required
                      value={addressForm.addressLine1}
                      onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                      placeholder="House no, street address"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-semibold">Address Line 2 (Optional)</label>
                    <input
                      type="text"
                      value={addressForm.addressLine2}
                      onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                      placeholder="Apartment, suite, unit etc."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-semibold">City *</label>
                      <input
                        type="text"
                        required
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                        placeholder="Delhi"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-semibold">State *</label>
                      <input
                        type="text"
                        required
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                        placeholder="Delhi"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-semibold">Pincode *</label>
                    <input
                      type="text"
                      required
                      value={addressForm.pincode}
                      onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                      placeholder="110001"
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="px-4 py-2 border border-white/10 text-slate-300 rounded-lg text-sm hover:bg-white/5 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm font-semibold transition"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
