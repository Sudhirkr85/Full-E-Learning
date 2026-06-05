"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { ArrowLeft, ShoppingCart, Minus, Plus, Trash2, Ticket, Lock, X, Loader2, Package } from "lucide-react";
import { toast } from "sonner";
import { createOrderAction, validateCouponAction } from "@/lib/store/actions";
const ProductType = {
  COURSE_ACCESS: "COURSE_ACCESS" as const,
  DIGITAL_RESOURCE: "DIGITAL_RESOURCE" as const,
  BUNDLE: "BUNDLE" as const,
  MEMBERSHIP: "MEMBERSHIP" as const,
  PHYSICAL: "PHYSICAL" as const,
};
import { Button } from "@/components/ui/button";

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
  }, [initializeCart]);

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

  // Billing states
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
  
  // Coupon
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponSuccessMsg, setCouponSuccessMsg] = useState("");
  const [showCouponInput, setShowCouponInput] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean | null>(null);

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

  const subtotalCents = cart.reduce((acc, item) => acc + (item.product.priceCents * item.quantity), 0);

  // Sync profile details
  const syncProfileAddress = async () => {
    try {
      const res = await fetch("/api/profile", { cache: "no-store" });
      if (!res.ok) {
        setIsUserLoggedIn(false);
        return;
      }
      setIsUserLoggedIn(true);
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
    if (isUserLoggedIn === false) {
      toast.error("Please login to save your contact information.");
      router.push(`/login?callbackUrl=/cart`);
      return;
    }
    setAddressForm({
      fullName: fullName,
      mobileNumber: shippingPhone1 || billingPhone,
      emailAddress: billingEmail,
      addressLine1: addressLine1,
      addressLine2: addressLine2,
      city: city,
      state: shippingState,
      pincode: postalCode
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

      if (res.status === 401) {
        toast.error("Your session has expired. Please login again.");
        router.push("/login?callbackUrl=/cart");
        return;
      }

      if (!res.ok) {
        const errData = await res.json();
        toast.error(errData.error || "Failed to save address info.");
        return;
      }

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
      toast.error("We couldn't verify your coupon. Please try again.");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponCode("");
    setCouponError("");
    setCouponSuccessMsg("");
  };

  // Recalculate discount on subtotal changes
  useEffect(() => {
    if (appliedCoupon) {
      let discount = 0;
      if (appliedCoupon.couponType === "PERCENTAGE") {
        const calculated = Math.round((subtotalCents * appliedCoupon.discountValue) / 100);
        discount = appliedCoupon.maxDiscountCents !== null && appliedCoupon.maxDiscountCents !== undefined
          ? Math.min(calculated, appliedCoupon.maxDiscountCents)
          : calculated;
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

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || submittingRef.current) return;
    if (cart.length === 0) return;

    if (isUserLoggedIn === false) {
      toast.error("Please login to proceed with your order.");
      router.push(`/login?callbackUrl=/cart`);
      return;
    }

    if (!billingEmail || !billingEmail.includes('@')) {
      toast.error("Please enter a valid billing email address.");
      return;
    }

    if (!billingPhone || !validatePhone(billingPhone)) {
      toast.error("Please enter a valid 10-digit billing phone number.");
      return;
    }

    if (hasPhysicalOrShippingNeed) {
      if (!fullName || !addressLine1 || !city || !postalCode || !shippingState || !shippingPhone1) {
        toast.error("Please fill out and save your delivery details before proceeding.");
        return;
      }
      if (!validatePhone(shippingPhone1)) {
        toast.error("Please enter a valid 10-digit primary shipping phone number.");
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
          orderNotes: null,
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
        name: "Sagar Coaching Centre Bhagwanpur",
        description: `${cart.length} item(s)`,
        order_id: razorpayOrderId,
        prefill: {
          name: fullName || "",
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

  if (!mounted) return null;

  return (
    <div className="h-[100dvh] bg-[#0a0a0f] flex justify-center text-slate-100 select-none overflow-hidden">
      <div className="w-full max-w-4xl h-full flex flex-col bg-[#070709] border-x border-white/10 shadow-2xl relative">
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
            type="button"
            onClick={() => router.push("/store")} 
            className="w-full h-11 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-colors mt-2"
          >
            Browse Store
          </button>
        </div>
      ) : (
        /* Cart Form */
        <form onSubmit={handleCheckout} className="flex-1 overflow-y-auto overscroll-contain flex flex-col justify-start pb-6">
          {/* Scrollable Items area */}
          <div className="px-4 py-3 space-y-4">
            {/* Beautiful Cart Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-950/30 via-slate-900/40 to-indigo-950/30 border border-white/5 p-5 backdrop-blur-md">
              <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-violet-500/10 rounded-full filter blur-[40px] pointer-events-none" />
              <div className="relative z-10 space-y-1">
                <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-300 border border-violet-500/20 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider">
                  <ShoppingCart className="h-3 w-3 text-violet-400" />
                  Secure Checkout
                </span>
                <h2 className="text-xl font-extrabold text-white mt-1">Review Your Cart</h2>
                <p className="text-[10px] text-slate-400">Review your learning seats, digital materials, and complete enrollment.</p>
              </div>
            </div>

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
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, -1)}
                    className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center hover:bg-white/10 text-white transition-colors active:scale-90"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-semibold w-5 text-center">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, 1)}
                    className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center hover:bg-white/10 text-white transition-colors active:scale-90"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.productId)}
                    className="w-10 h-10 p-2 rounded-xl flex items-center justify-center text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors ml-0.5 active:scale-90"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>
            ))}

            {/* Contact & Delivery Details (Card Style) */}
            <div className="space-y-2.5 pt-3 border-t border-white/10">
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

            {/* Coupon section */}
            <div className="space-y-2 pt-3 border-t border-white/10">
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
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleApplyCoupon(e as any);
                          }
                        }}
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
          </div>

          {/* Pricing & Checkout Summary Card */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mt-2 mx-4 space-y-2.5">
            <div className="flex justify-between text-slate-400 text-sm">
              <span>Subtotal</span>
              <span>₹{(subtotalCents / 100).toLocaleString("en-IN")}</span>
            </div>
            {hasPhysicalOrShippingNeed && (
              <div className="flex justify-between text-slate-400 text-sm">
                <span>Shipping Fee</span>
                <span>{shippingChargeCents === 0 ? "FREE" : `₹${shippingChargeCents / 100}`}</span>
              </div>
            )}
            {couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-400 text-sm">
                <span>Discount</span>
                <span>-₹{(couponDiscount / 100).toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between text-white font-bold text-base pt-1 border-t border-white/5">
              <span>Total Price</span>
              <span>₹{(totalCents / 100).toLocaleString("en-IN")}</span>
            </div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-1">
              ✓ Tax included
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full h-12 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold mt-2 flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : isUserLoggedIn === false ? (
                <>
                  <Lock className="w-4 h-4" />
                  Login to Proceed
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Proceed to Payment
                </>
              )}
            </button>
          </div>
        </form>
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
    </div>
  );
}

