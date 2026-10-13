"use client";

import React, { useState } from "react";
import { Download, ShieldCheck, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { loadRazorpayScript } from "@/lib/razorpay-client";

interface PyqDownloadButtonProps {
  slug: string;
  pdfTitle: string;
  isAdmin?: boolean;
  className?: string;
  size?: "default" | "sm";
}

export function PyqDownloadButton({
  slug,
  pdfTitle,
  isAdmin = false,
  className = "",
  size = "default",
}: PyqDownloadButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDownloadClick = async () => {
    // 1. If Admin, download immediately for free!
    if (isAdmin) {
      toast.success("Admin Access: डाउनलोड शुरू हो रहा है...");
      window.location.href = `/api/pyq/${slug}/download`;
      return;
    }

    // 2. For Students: Razorpay ₹49 checkout flow
    setLoading(true);
    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error("पेमेंट गेटवे लोड नहीं हो सका। कृपया इंटरनेट कनेक्शन जांचें।");
        setLoading(false);
        return;
      }

      // Create Order
      const res = await fetch("/api/pyq/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });

      const orderData = await res.json();
      if (!res.ok || !orderData.orderId) {
        toast.error(orderData.error || "ऑर्डर बनाने में समस्या हुई।");
        setLoading(false);
        return;
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "Sagar Coaching Centre",
        description: `NMMS PDF Download: ₹49`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            toast.loading("भुगतान सत्यापित किया जा रहा है...", { id: "verify-pyq" });
            const verifyRes = await fetch("/api/pyq/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                slug,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.downloadUrl) {
              toast.success("भुगतान सफल! आपकी PDF डाउनलोड हो रही है...", { id: "verify-pyq" });
              window.location.href = verifyData.downloadUrl;
            } else {
              toast.error(verifyData.error || "सत्यापन विफल रहा।", { id: "verify-pyq" });
            }
          } catch (err) {
            toast.error("सत्यापन में त्रुटि हुई। कृपया सपोर्ट से संपर्क करें।", { id: "verify-pyq" });
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
        theme: {
          color: "#4f46e5",
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (err: any) {
      console.error("PYQ Payment Checkout Error:", err);
      toast.error("भुगतान प्रक्रिया में त्रुटि हुई।");
      setLoading(false);
    }
  };

  if (isAdmin) {
    return (
      <button
        onClick={handleDownloadClick}
        className={
          className ||
          "inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 transition hover:bg-emerald-500"
        }
      >
        <ShieldCheck className="h-4 w-4" />
        <span>डाउनलोड PDF (Admin Free)</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleDownloadClick}
      disabled={loading}
      className={
        className ||
        "inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition hover:from-amber-400 hover:to-orange-400 disabled:opacity-70"
      }
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>प्रतीक्षा करें...</span>
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          <span>डाउनलोड PDF (₹49)</span>
        </>
      )}
    </button>
  );
}
