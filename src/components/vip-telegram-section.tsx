"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Bell, 
  FileText, 
  AlertTriangle, 
  Target, 
  MessageSquare, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Loader2, 
  Send, 
  X,
  Phone,
  User,
  ExternalLink
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const TELEGRAM_INVITE_URL = "https://t.me/+HygnvMiBpgVkMmE9";
const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_TISkDZFFSf8SF1";
const WHATSAPP_SUPPORT_URL = "https://wa.me/919110113671?text=Namaste%20Sir%2C%20I%20need%20help%20with%20NMMS%20VIP%20Telegram%20Channel%20Subscription";

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if ((window as any).Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

interface VipTelegramSectionProps {
  isStandalone?: boolean;
}

export function VipTelegramSection({ isStandalone = false }: VipTelegramSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);

  // Auto redirect on success
  useEffect(() => {
    if (paymentSuccess) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            window.location.href = TELEGRAM_INVITE_URL;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [paymentSuccess]);

  const handleOpenModal = () => {
    setFormError("");
    setPaymentSuccess(false);
    setIsModalOpen(true);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const cleanPhone = studentPhone.replace(/\D/g, "");
    if (!studentName.trim()) {
      setFormError("कृपया अपना नाम दर्ज करें (Please enter your name)");
      return;
    }
    if (cleanPhone.length !== 10) {
      setFormError("कृपया 10 अंकों का सही मोबाइल नंबर दर्ज करें");
      return;
    }

    setIsLoading(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setFormError("Razorpay लोड नहीं हो सका। कृपया इंटरनेट कनेक्शन जांचें।");
        setIsLoading(false);
        return;
      }

      // 1. Create order on backend
      let razorpayOrderId = null;
      try {
        const orderRes = await fetch("/api/vip-telegram/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: studentName.trim(),
            phone: cleanPhone,
          }),
        });
        const orderData = await orderRes.json();
        if (orderData.success && orderData.orderId) {
          razorpayOrderId = orderData.orderId;
        }
      } catch (err) {
        console.warn("Using direct client checkout", err);
      }

      // 2. Launch Razorpay Modal
      const options: any = {
        key: RAZORPAY_KEY_ID,
        amount: 4900, // 4900 paise = ₹49
        currency: "INR",
        name: "Sagar Coaching Centre Bhagwanpur",
        description: "NMMS VIP Telegram Alert Channel Access",
        image: "/logo-circle-transparent.png",
        order_id: razorpayOrderId || undefined,
        prefill: {
          name: studentName.trim(),
          contact: cleanPhone,
        },
        theme: {
          color: "#6c47ff",
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
          },
        },
        handler: async (response: any) => {
          try {
            // Verify payment
            await fetch("/api/vip-telegram/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                studentName: studentName.trim(),
                studentPhone: cleanPhone,
              }),
            });
          } catch (vErr) {
            console.warn("Verification request failed", vErr);
          }

          setIsLoading(false);
          setPaymentSuccess(true);
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", (response: any) => {
        setIsLoading(false);
        setFormError(response.error?.description || "Payment failed. Please try again.");
      });
      rzp.open();
    } catch (err: any) {
      console.error("[VIP_PAYMENT_ERROR]", err);
      setIsLoading(false);
      setFormError("भुगतान शुरू करने में समस्या हुई। कृपया दोबारा प्रयास करें।");
    }
  };

  return (
    <section className={`relative overflow-hidden ${isStandalone ? "py-12 md:py-20" : "py-16 md:py-24"}`}>
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-[#0d0a21] to-slate-950 -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Main Banner Card */}
        <div className="relative rounded-3xl border border-purple-500/30 bg-gradient-to-br from-slate-900/90 via-[#151033]/90 to-slate-950/95 p-6 sm:p-10 lg:p-12 shadow-[0_20px_60px_-15px_rgba(108,71,255,0.3)] backdrop-blur-xl overflow-hidden">
          
          {/* Top Decorative Laser Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

          {/* Floating Telegram Emblem Glow */}
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            
            {/* LEFT COLUMN: Main Offer & Value Prop */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Badges Bar */}
              <div className="flex flex-wrap items-center gap-2.5">
                <Badge className="bg-purple-600/20 border-purple-500/40 text-purple-300 text-xs px-3 py-1 rounded-full uppercase tracking-wider font-bold flex items-center gap-1.5 shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                  </span>
                  VIP Telegram Alert Channel
                </Badge>
                <span className="text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 px-3 py-0.5 rounded-full uppercase tracking-wide">
                  NMMS 2026-27 Special
                </span>
                <span className="text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                  All 36 States Covered
                </span>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-3">
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
                  NMMS 2026-27 <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-300">VIP Telegram Alert Channel</span>
                </h2>
                <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
                  सभी 36 राज्यों के Official Notifications, Admit Cards, Results, Answer Keys और Model Papers सबसे पहले पाएं।
                </p>
              </div>

              {/* 5 Key Features Grid */}
              <div className="grid gap-3 sm:grid-cols-2 pt-2">
                
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-purple-500/20 transition-all">
                  <div className="h-8 w-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0 mt-0.5">
                    <Bell className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Real-Time SCERT & NSP Alerts</h4>
                    <p className="text-[11px] text-slate-400">सभी राज्यों के आधिकारिक नोटिफिकेशन तुरंत।</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-purple-500/20 transition-all">
                  <div className="h-8 w-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shrink-0 mt-0.5">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">1-Click PDF Downloads</h4>
                    <p className="text-[11px] text-slate-400">नोटिस, सिलेबस और मॉडल पेपर्स डायरेक्ट डाउनलोड।</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-purple-500/20 transition-all">
                  <div className="h-8 w-8 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-300 shrink-0 mt-0.5">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Urgent Last Date Reminders</h4>
                    <p className="text-[11px] text-slate-400">फॉर्म भरने और ₹48,000 स्कॉलरशिप छूटने से बचें।</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-purple-500/20 transition-all">
                  <div className="h-8 w-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shrink-0 mt-0.5">
                    <Target className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Sagar Coaching Guidance</h4>
                    <p className="text-[11px] text-slate-400">श्रवण सर और विषय विशेषज्ञों का मार्गदर्शन।</p>
                  </div>
                </div>

              </div>

              {/* Verified Ad-Free Note */}
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-3.5 py-2 rounded-xl w-fit">
                <MessageSquare className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>💬 100% Verified, Spam-Free & Ad-Free Direct Updates</span>
              </div>

            </div>

            {/* RIGHT COLUMN: Price Card & Immediate Action */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl border border-purple-500/40 bg-gradient-to-b from-purple-950/60 via-slate-900/90 to-slate-950 p-6 sm:p-8 text-center space-y-6 shadow-2xl">
                
                {/* Sagar Coaching Branding Header */}
                <div className="flex items-center justify-center gap-2.5 pb-2 border-b border-white/10">
                  <div className="relative h-8 w-8 rounded-full overflow-hidden border border-purple-400/40">
                    <Image
                      src="/logo-circle-transparent.png"
                      alt="Sagar Coaching Centre"
                      width={32}
                      height={32}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="font-display font-bold text-sm text-slate-200">
                    Sagar Coaching Centre Bhagwanpur
                  </span>
                </div>

                {/* Price Display */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-purple-300 uppercase tracking-widest">
                    Lifetime VIP Access Pass
                  </span>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-4xl sm:text-5xl font-black text-white font-display">
                      ₹49
                    </span>
                    <div className="text-left">
                      <span className="line-through text-slate-500 text-sm font-semibold block">₹199</span>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                        75% OFF
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    एक बार ₹49 भुगतान करें और परीक्षा तक सभी अपडेट्स पाएं
                  </p>
                </div>

                {/* Main CTA Button */}
                <div className="space-y-3 pt-1">
                  <Button
                    onClick={handleOpenModal}
                    className="w-full h-14 rounded-2xl text-sm sm:text-base font-extrabold uppercase tracking-wide text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:via-indigo-500 hover:to-purple-500 shadow-[0_10px_30px_rgba(108,71,255,0.5)] hover:shadow-[0_15px_40px_rgba(108,71,255,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <Send className="h-5 w-5 text-cyan-300 group-hover:translate-x-0.5 transition-transform" />
                    <span>🚀 Pay ₹49 & Join VIP Channel</span>
                  </Button>

                  <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5 font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Instant Telegram Invite Link immediately after payment</span>
                  </p>
                </div>

                {/* Trust Badges & WhatsApp Support */}
                <div className="pt-4 border-t border-white/10 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] text-slate-400">
                    <ShieldCheck className="h-3.5 w-3.5 text-purple-400" />
                    <span>Secured by <strong>Razorpay</strong></span>
                    <span>•</span>
                    <span>UPI, PhonePe, Paytm, Cards</span>
                  </div>

                  <a
                    href={WHATSAPP_SUPPORT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <span>💬 Payment Help / WhatsApp: <strong>+91 91101 13671</strong></span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>

      {/* POPUP MODAL: Student Details & Razorpay Launch */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-purple-500/30 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6 text-left">
            
            {/* Close Button */}
            {!paymentSuccess && (
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {/* Modal Body */}
            {paymentSuccess ? (
              /* SUCCESS STATE */
              <div className="text-center space-y-5 py-4 animate-in zoom-in-95 duration-300">
                <div className="h-16 w-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">🎉 Payment Successful!</h3>
                  <p className="text-sm text-slate-300">
                    आपका VIP Telegram Channel एक्सेस एक्टिवेट हो गया है।
                  </p>
                  <p className="text-xs text-purple-300 font-semibold animate-pulse">
                    Redirecting in {countdown} seconds...
                  </p>
                </div>

                <Button
                  asChild
                  className="w-full h-12 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-500/30"
                >
                  <a href={TELEGRAM_INVITE_URL} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                    <Send className="h-4 w-4" />
                    <span>👉 Click to Join VIP Telegram Now</span>
                  </a>
                </Button>
              </div>
            ) : (
              /* FORM STATE */
              <form onSubmit={handleCheckout} className="space-y-5">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                      <Send className="h-3.5 w-3.5" />
                    </div>
                    <h3 className="font-display font-extrabold text-lg text-white">
                      NMMS VIP Telegram Access
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400">
                    कृपया अपना विवरण भरें और ₹49 का भुगतान पूरा करें।
                  </p>
                </div>

                {formError && (
                  <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-300 font-medium">
                    {formError}
                  </div>
                )}

                {/* Name Input */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-purple-400" />
                    <span>विद्यार्थी का नाम (Student Name)</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. राहुल कुमार"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    disabled={isLoading}
                    className="w-full h-11 px-3.5 rounded-xl border border-white/10 bg-slate-950/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>

                {/* Mobile Input */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-purple-400" />
                    <span>मोबाइल नंबर (WhatsApp Mobile No.)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="91021 30956"
                      value={studentPhone}
                      onChange={(e) => setStudentPhone(e.target.value.replace(/\D/g, ""))}
                      disabled={isLoading}
                      className="w-full h-11 pl-12 pr-3.5 rounded-xl border border-white/10 bg-slate-950/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                  </div>
                </div>

                {/* Price summary */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/20 text-xs">
                  <span className="text-slate-300 font-medium">कुल शुल्क (One-Time)</span>
                  <span className="text-lg font-black text-white font-display">₹49</span>
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 rounded-xl text-sm font-bold uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:via-indigo-500 hover:to-purple-500 shadow-lg shadow-purple-500/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Razorpay ओपन हो रहा है...</span>
                    </>
                  ) : (
                    <>
                      <span>Pay ₹49 & Join Telegram</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>

                <p className="text-[10px] text-center text-slate-400">
                  🔒 Secured 256-bit Encryption via Razorpay Payments
                </p>
              </form>
            )}

          </div>
        </div>
      )}
    </section>
  );
}
