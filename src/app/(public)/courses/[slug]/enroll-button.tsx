"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { toast } from "sonner";
import { Loader2, PlayCircle, Lock } from "lucide-react";

interface EnrollButtonProps {
  courseId: string;
  coursePrice: number;
  courseName: string;
  courseSlug: string;
  isEnrolled: boolean;
  isFree: boolean;
  userPhone?: string;
  userEmail?: string;
  userName?: string;
  isLoggedIn: boolean;
  originalPrice?: number | null;
  variant?: "card" | "detail";
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function EnrollButton({
  courseId,
  coursePrice,
  courseName,
  courseSlug,
  isEnrolled: initialIsEnrolled,
  isFree,
  userPhone = "",
  userEmail = "",
  userName = "",
  isLoggedIn,
  originalPrice = null,
  variant = "detail"
}: EnrollButtonProps) {
  const [enrollLoading, setEnrollLoading] = useState(false);
  const router = useRouter();

  // Use SWR exclusively for enrollment status fetching
  const { data: enrollmentStatus, mutate } = useSWR(
    isLoggedIn ? `/api/courses/${courseId}/enrollment-status` : null,
    fetcher
  );

  const status = enrollmentStatus?.status || null;
  const isCurrentlyEnrolled = enrollmentStatus ? (enrollmentStatus.status === "ACTIVE" || enrollmentStatus.status === "COMPLETED") : initialIsEnrolled;

  // Free Enrollment Handler
  const handleFreeEnroll = async () => {
    setEnrollLoading(true);
    try {
      const res = await fetch('/api/courses/enroll/free', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId })
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Something went wrong. Please refresh and try again.");
        return;
      }

      toast.success("Enrolled successfully! Welcome to the course.");
      await mutate();
      // Redirect to confirmation screen for free order details as well
      // But if there's no orderId returned, we can search if enrollment record has it, or just use the courseSlug redirect.
      // Let's check what /api/courses/enroll/free returns. In route.ts: it returns { success: true }.
      // Since it's free checkout, redirecting directly to learn is fine or redirecting to confirmation if we have an enrollmentId.
      // Wait, the prompt says: "For free enrollments: After POST /api/courses/enroll/free or POST /api/checkout/free: Create an order record first if not exists, then redirect to confirmation page"
      // Wait! Let's check if free checkout returns an order/enrollment record or what. Let's redirect to confirmation page if we can.
      // Let's modify the route /api/courses/enroll/free to return the enrollmentId or orderId, and then redirect to `/order/${id}/confirmation`
      // Let's see first if we can handle the redirect in both.
      if (data.enrollmentId) {
        router.push(`/order/${data.enrollmentId}/confirmation`);
      } else {
        router.push(`/courses/${courseSlug}/learn`);
      }
    } catch {
      toast.error("Something went wrong. Please refresh and try again.");
    } finally {
      setEnrollLoading(false);
    }
  };

  // Paid Enrollment Handler (with direct Razorpay modal)
  const handlePaidEnroll = async () => {
    setEnrollLoading(true);
    try {
      const res = await fetch('/api/courses/enroll/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          courseId,
          couponCode: appliedCoupon ? appliedCoupon.code : null
        })
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Something went wrong. Please refresh and try again.");
        setEnrollLoading(false);
        return;
      }

      const { razorpayOrderId, enrollmentId, amount } = data;

      if (typeof window === 'undefined' || !(window as any).Razorpay) {
        toast.error("Payment system failed to load. Please refresh and try again.");
        setEnrollLoading(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount: amount,
        currency: "INR",
        name: "E-Learning Platform",
        description: courseName,
        order_id: razorpayOrderId,
        prefill: {
          name: userName || "",
          email: userEmail || "",
          contact: userPhone || "",
        },
        theme: { color: "#7c3aed" },
        modal: {
          ondismiss: async () => {
            try {
              await fetch('/api/courses/enroll/fail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                  enrollmentId,
                  reason: 'Payment dismissed'
                })
              });
            } catch (err) {
              console.error("Failed to call fail route:", err);
            }
            await mutate();
            toast.warning("Payment cancelled.");
            router.push(`/order/${enrollmentId}/confirmation`);
          }
        },
        handler: async (response: any) => {
          setEnrollLoading(true);
          try {
            const verifyRes = await fetch('/api/courses/enroll/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                enrollmentId,
              })
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok) {
              toast.success("Payment successful! Welcome to the course.");
              await mutate();
              router.push(`/order/${enrollmentId}/confirmation`);
            } else {
              toast.error(verifyData.message || "Payment verification failed. If amount was deducted, contact support.");
              router.push(`/order/${enrollmentId}/confirmation`);
            }
          } catch {
            toast.error("Payment verification failed. If amount was deducted, contact support.");
            router.push(`/order/${enrollmentId}/confirmation`);
          } finally {
            setEnrollLoading(false);
          }
        }
      };

      const razorpay = new (window as any).Razorpay(options);

      razorpay.on('payment.failed', async (response: any) => {
        try {
          await fetch('/api/courses/enroll/fail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              enrollmentId,
              reason: response.error.description || response.error.code,
            })
          });
        } catch (err) {
          console.error("Failed to report payment failure:", err);
        }
        await mutate();
        toast.error("Payment failed. Please try again or use a different method.");
        router.push(`/order/${enrollmentId}/confirmation`);
      });

      razorpay.open();

    } catch {
      toast.error("Something went wrong. Please refresh and try again.");
      setEnrollLoading(false);
    }
  };


  // Coupon states
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponSuccessMsg, setCouponSuccessMsg] = useState("");
  const [showCouponInput, setShowCouponInput] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccessMsg("");
    if (!couponCode) return;

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCode,
          amountCents: coursePrice * 100,
          scope: "COURSES",
          items: [courseId]
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAppliedCoupon(data.coupon);
        setCouponDiscount(data.discountCents);
        setCouponSuccessMsg(`✓ ${data.coupon.code} applied! You saved ₹${(data.discountCents / 100).toFixed(0)}.`);
        toast.success("Coupon applied successfully!");
      } else {
        setCouponError(data.error || "✕ This coupon is invalid or expired.");
        toast.error(data.error || "This coupon is invalid or expired.");
      }
    } catch {
      toast.error("Failed to validate coupon.");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponCode("");
    setCouponError("");
    setCouponSuccessMsg("");
  };

  const finalPayablePrice = Math.max(coursePrice - (couponDiscount / 100), 0);

  const renderPricingBlock = () => {
    if (variant === "card") return null;

    if (isCurrentlyEnrolled) {
      return (
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-emerald-500/15 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-500/25">
            ✓ Enrolled
          </span>
        </div>
      );
    }

    if (isFree || coursePrice === 0) {
      return (
        <div className="mb-2">
          <span className="text-3xl font-bold text-emerald-500">Free</span>
        </div>
      );
    }

    const safeOriginal = Number(originalPrice ?? 0);
    const hasDiscount = originalPrice !== null && originalPrice > coursePrice && coursePrice > 0;
    const discountPercent = hasDiscount ? Math.round(((safeOriginal - coursePrice) / safeOriginal) * 100) : 0;

    return (
      <div className="space-y-2 mb-3">
        <div className="flex justify-between items-center text-slate-400 text-xs">
          <span>Subtotal</span>
          <span className={hasDiscount ? "line-through text-slate-500" : "text-white font-semibold"}>₹{(hasDiscount ? safeOriginal : coursePrice).toLocaleString("en-IN")}</span>
        </div>
        {hasDiscount && (
          <div className="flex justify-between items-center text-xs">
            <span>Special Course Discount</span>
            <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
              ₹{(safeOriginal - coursePrice).toLocaleString("en-IN")} Off ({discountPercent}%)
            </span>
          </div>
        )}
        {couponDiscount > 0 && (
          <div className="flex justify-between items-center text-xs text-emerald-400">
            <span>Discount Coupon</span>
            <span>-₹{(couponDiscount / 100).toLocaleString("en-IN")}</span>
          </div>
        )}
        <div className="flex justify-between items-center text-sm font-bold text-white pt-2 border-t border-white/5">
          <span>Payable Total</span>
          <span className="text-xl text-violet-400 font-mono">₹{finalPayablePrice.toLocaleString("en-IN")}</span>
        </div>
        <div className="text-[10px] text-emerald-400 font-semibold">
          ✓ Tax included
        </div>
      </div>
    );
  };

  const renderEnrollmentButton = () => {
    const btnClass = variant === "card"
      ? "w-full h-11 rounded-xl font-extrabold text-xs uppercase tracking-normal flex items-center justify-center gap-1 transition shadow-md bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/10 border border-transparent"
      : "w-full h-12 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-all animate-none";

    // 1. Not logged in
    if (!isLoggedIn) {
      return (
        <button
          onClick={() => {
            const currentPath = typeof window !== 'undefined' ? window.location.pathname + window.location.search : `/courses/${courseSlug}`;
            router.push(`/login?callbackUrl=${encodeURIComponent(currentPath)}`);
          }}
          className={btnClass}
        >
          Enroll
        </button>
      );
    }

    // 2. Already Enrolled (ACTIVE)
    if (isCurrentlyEnrolled) {
      return (
        <button
          onClick={() => router.push(`/courses/${courseSlug}/learn`)}
          className={btnClass}
        >
          <PlayCircle className="w-3.5 h-3.5" /> {variant === "card" ? "Resume" : "Start Learning"}
        </button>
      );
    }

    // 3. Enrollment pending payment (PENDING status)
    if (status === "PENDING") {
      return (
        <button
          onClick={handlePaidEnroll}
          disabled={enrollLoading}
          className={`${btnClass} bg-amber-600 hover:bg-amber-500 text-white`}
        >
          {enrollLoading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Processing...
            </>
          ) : (
            "Pay Pending"
          )}
        </button>
      );
    }

    // 4. Free Course
    if (isFree) {
      return (
        <button
          onClick={handleFreeEnroll}
          disabled={enrollLoading}
          className={btnClass}
        >
          {enrollLoading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Enrolling...
            </>
          ) : (
            "Enroll"
          )}
        </button>
      );
    }

    // 5. Paid Course
    return (
      <button
        onClick={handlePaidEnroll}
        disabled={enrollLoading}
        className={btnClass}
      >
        {enrollLoading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Processing...
          </>
        ) : (
          <>
            <Lock className="w-3.5 h-3.5" /> {variant === "card" ? "Enroll" : `Buy Now — ₹${finalPayablePrice.toLocaleString("en-IN")}`}
          </>
        )}
      </button>
    );
  };

  const containerClass = variant === "card"
    ? "w-full"
    : "flex flex-col gap-2 w-full text-slate-100 bg-[#090d20]/30 border border-white/5 p-4 rounded-2xl backdrop-blur-md";

  return (
    <div className={containerClass}>
      {renderPricingBlock()}
      
      {/* Coupon input expander */}
      {variant === "detail" && !isCurrentlyEnrolled && !isFree && (
        <div className="py-2.5 border-t border-white/5">
          {!showCouponInput && !appliedCoupon ? (
            <button
              onClick={() => setShowCouponInput(true)}
              className="text-[11px] font-semibold text-violet-400 hover:text-violet-300 transition"
            >
              Have a Coupon? [Apply Coupon]
            </button>
          ) : (
            <div className="space-y-2">
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl p-2.5 text-xs">
                  <span>Code: {appliedCoupon.code}</span>
                  <button onClick={handleRemoveCoupon} className="text-emerald-400 hover:text-emerald-300 font-semibold">
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
                    className="flex-1 bg-white/5 border border-white/10 text-white placeholder:text-slate-500 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                  <button onClick={handleApplyCoupon} className="px-3 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs h-7">
                    Apply
                  </button>
                </div>
              )}
              {couponSuccessMsg && <p className="text-[10px] text-emerald-400 font-medium">{couponSuccessMsg}</p>}
              {couponError && <p className="text-[10px] text-rose-500 font-medium">{couponError}</p>}
            </div>
          )}
        </div>
      )}

      {renderEnrollmentButton()}
    </div>
  );
}
