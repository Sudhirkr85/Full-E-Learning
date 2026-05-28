"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2, GraduationCap, ArrowRight } from "lucide-react";

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
}

export function EnrollButton({
  courseId,
  coursePrice,
  courseName,
  courseSlug,
  isEnrolled,
  isFree,
  userPhone = "",
  userEmail = "",
  userName = ""
}: EnrollButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [savingPhone, setSavingPhone] = useState(false);
  const [localPhone, setLocalPhone] = useState(userPhone);
  const router = useRouter();

  const handleEnroll = async (overridePhone?: string) => {
    const activePhone = overridePhone !== undefined ? overridePhone : localPhone;
    
    // Check if phone number is present; if not, request it first
    if (!activePhone) {
      setShowPhoneModal(true);
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. FREE COURSE — Direct Enrollment Flow
      if (isFree) {
        const res = await fetch("/api/checkout/free", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId })
        });
        const data = await res.json();
        if (data.success && data.redirectUrl) {
          router.push(data.redirectUrl);
          router.refresh();
        } else {
          setError(data.error || "Free enrollment failed. Please try again.");
          setLoading(false);
        }
        return;
      }

      // 2. PAID COURSE — Razorpay Payment Flow
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId })
      });
      const order = await res.json();

      if (!res.ok) {
        setError(order.error || "Failed to initialize order.");
        setLoading(false);
        return;
      }

      // Check if Razorpay script is already loaded
      const isScriptLoaded = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      
      const initializeRzp = () => {
        const rzp = new (window as any).Razorpay({
          key: order.keyId,
          amount: order.amount,
          currency: order.currency,
          name: "E-Learning Academy",
          description: order.courseName,
          order_id: order.orderId,
          prefill: {
            email: order.userEmail || "",
            name: order.userName || "",
            contact: activePhone
          },
          theme: { color: "#6366f1" },
          handler: async (response: any) => {
            setLoading(true);
            try {
              // Verify payment
              const verifyRes = await fetch("/api/checkout/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  courseId
                })
              });
              const result = await verifyRes.json();
              if (result.success && result.redirectUrl) {
                router.push(result.redirectUrl);
                router.refresh();
              } else {
                setError("Payment verification failed. Please contact support.");
              }
            } catch (err) {
              setError("Signature verification failed. Please contact support.");
            } finally {
              setLoading(false);
            }
          },
          modal: {
            ondismiss: () => {
              setLoading(false);
              setError("Payment cancelled. You can try again.");
            }
          }
        });
        rzp.open();
      };

      if (isScriptLoaded) {
        initializeRzp();
      } else {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = initializeRzp;
        script.onerror = () => {
          setError("Failed to load Razorpay payment SDK.");
          setLoading(false);
        };
        document.body.appendChild(script);
      }
    } catch (err: any) {
      setError("An unexpected connection error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleSavePhone = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError("");

    // Standard INR 10 digit validation
    const cleaned = phoneInput.replace(/\D/g, "");
    if (cleaned.length !== 10) {
      setPhoneError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setSavingPhone(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userName || "Student",
          email: userEmail,
          phone: cleaned
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setPhoneError(data.error || "Failed to update phone number.");
        setSavingPhone(false);
        return;
      }

      setLocalPhone(cleaned);
      setShowPhoneModal(false);
      // Immediately resume the enrollment process!
      handleEnroll(cleaned);
    } catch (err) {
      setPhoneError("An error occurred while saving. Please try again.");
    } finally {
      setSavingPhone(false);
    }
  };

  if (isEnrolled) {
    return (
      <Button size="lg" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl" asChild>
        <Link href="/student/dashboard" className="flex items-center justify-center gap-1.5">
          <GraduationCap className="h-5 w-5" />
          Continue Learning
        </Link>
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <Button
        size="lg"
        onClick={() => handleEnroll()}
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl border border-white/10 shadow-[0_0_15px_rgba(99,102,241,0.25)] h-12"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : isFree ? (
          "Start Learning for Free"
        ) : (
          `Enroll Now — ₹${coursePrice.toLocaleString("en-IN")}`
        )}
      </Button>

      {/* Phone Number Request Modal Overlay */}
      {showPhoneModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#090d20] border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-200 text-left">
            <h3 className="text-xl font-bold tracking-tight text-white mb-2">
              Mobile Number Required
            </h3>
            <p className="text-sm text-slate-300 mb-6">
              Please enter your 10-digit mobile number to proceed with the checkout and payment verification.
            </p>
            
            <form onSubmit={handleSavePhone} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Phone Number
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-slate-400 text-sm font-semibold border-r border-slate-800 pr-3 mr-3">+91</span>
                  <input
                    type="tel"
                    required
                    placeholder="98765 43210"
                    maxLength={10}
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, ""))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-16 pr-4 py-3 text-white placeholder-slate-600 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
                {phoneError && (
                  <p className="text-xs text-red-400 mt-2 font-semibold">{phoneError}</p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={savingPhone}
                  onClick={() => setShowPhoneModal(false)}
                  className="flex-1 rounded-xl h-11 border-slate-800 hover:bg-slate-900 bg-transparent text-sm font-semibold text-slate-300 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={savingPhone}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl h-11 text-sm shadow-[0_0_15px_rgba(99,102,241,0.25)] border-0"
                >
                  {savingPhone ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Continue"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick try-again widget for cancelled or failed attempts */}
      {error && (
        <div className="flex flex-col gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl mt-1 text-center">
          <p className="text-xs font-semibold text-red-400">{error}</p>
          {error.includes("cancelled") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEnroll()}
              className="w-full border-indigo-500/20 bg-indigo-500/5 text-indigo-300 hover:bg-indigo-500/10 hover:text-white rounded-lg h-9 text-xs"
            >
              Try Again
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
