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
  originalPrice = null
}: EnrollButtonProps) {
  const [enrollLoading, setEnrollLoading] = useState(false);
  const router = useRouter();

  // Use SWR exclusively for enrollment status fetching
  const { data: enrollmentStatus, mutate } = useSWR(
    isLoggedIn ? `/api/courses/${courseId}/enrollment-status` : null,
    fetcher
  );

  const status = enrollmentStatus?.status || null;
  const isCurrentlyEnrolled = enrollmentStatus ? (enrollmentStatus.status === "ACTIVE") : initialIsEnrolled;

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
      router.push(`/student/courses/${courseId}`);
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
      // 1. Create a brand new enrollment + new Razorpay order (Retry Policy)
      const res = await fetch('/api/courses/enroll/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId })
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Something went wrong. Please refresh and try again.");
        setEnrollLoading(false);
        return;
      }

      const { razorpayOrderId, enrollmentId, amount } = data;

      // 2. Razorpay Script Safety Check before initialization
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
            setEnrollLoading(false);
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
              router.push(`/student/courses/${courseId}`);
            } else {
              toast.error(verifyData.message || "Payment verification failed. If amount was deducted, contact support.");
            }
          } catch {
            toast.error("Payment verification failed. If amount was deducted, contact support.");
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
        setEnrollLoading(false);
      });

      razorpay.open();

    } catch {
      toast.error("Something went wrong. Please refresh and try again.");
      setEnrollLoading(false);
    }
  };

  // Price and Badge Display Block
  const renderPricingBlock = () => {
    if (isCurrentlyEnrolled) {
      return (
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-emerald-500/15 text-emerald-500 text-sm font-bold px-3 py-1.5 rounded-full border border-emerald-500/25">
            Enrolled
          </span>
        </div>
      );
    }

    if (isFree || coursePrice === 0) {
      return (
        <div className="mb-2">
          <span className="text-3xl font-bold text-emerald-600">Free</span>
        </div>
      );
    }

    const safeOriginal = Number(originalPrice ?? 0);
    const hasDiscount = originalPrice !== null && originalPrice > coursePrice && coursePrice > 0;
    const discountPercent = hasDiscount ? Math.round(((safeOriginal - coursePrice) / safeOriginal) * 100) : 0;

    if (hasDiscount) {
      return (
        <div className="flex items-center gap-3 flex-wrap mb-2">
          <span className="text-3xl font-bold">₹{coursePrice.toLocaleString("en-IN")}</span>
          <span className="text-lg line-through text-muted-foreground">₹{safeOriginal.toLocaleString("en-IN")}</span>
          <span className="bg-emerald-100 text-emerald-700 text-sm font-bold px-2 py-1 rounded-full">{discountPercent}% OFF</span>
        </div>
      );
    }

    return (
      <div className="mb-2">
        <span className="text-3xl font-bold">₹{coursePrice.toLocaleString("en-IN")}</span>
      </div>
    );
  };

  const renderEnrollmentButton = () => {
    // 1. Not logged in
    if (!isLoggedIn) {
      return (
        <button
          onClick={() => router.push('/login')}
          className="w-full h-12 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold flex items-center justify-center gap-1.5 transition-all"
        >
          Login to Enroll
        </button>
      );
    }

    // 2. Already Enrolled (ACTIVE)
    if (isCurrentlyEnrolled) {
      return (
        <button
          onClick={() => router.push(`/student/courses/${courseId}`)}
          className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center justify-center gap-1.5 transition-all"
        >
          <PlayCircle className="w-4 h-4" /> Continue Learning
        </button>
      );
    }

    // 3. Enrollment pending payment (PENDING status)
    if (status === "PENDING") {
      return (
        <button
          onClick={handlePaidEnroll}
          disabled={enrollLoading}
          className="w-full h-12 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold flex items-center justify-center gap-1.5 transition-all"
        >
          {enrollLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Processing...
            </>
          ) : (
            "Complete Payment"
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
          className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center justify-center gap-1.5 transition-all"
        >
          {enrollLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Enrolling...
            </>
          ) : (
            "Enroll Free"
          )}
        </button>
      );
    }

    // 5. Paid Course
    return (
      <button
        onClick={handlePaidEnroll}
        disabled={enrollLoading}
        className="w-full h-12 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold flex items-center justify-center gap-1.5 transition-all"
      >
        {enrollLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Processing...
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" /> Buy Now — ₹{coursePrice}
          </>
        )}
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {renderPricingBlock()}
      {renderEnrollmentButton()}
    </div>
  );
}
