"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Loader2, 
  ArrowRight, 
  Calendar, 
  ShieldAlert, 
  ExternalLink,
  MessageSquare,
  Package,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface OrderConfirmationClientProps {
  orderId: string;
}

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error("Failed to load order status");
  return res.json();
});

export function OrderConfirmationClient({ orderId }: OrderConfirmationClientProps) {
  const router = useRouter();
  const [timedOut, setTimedOut] = useState(false);

  // Poll status endpoint every 2 seconds if PENDING
  const { data, error } = useSWR(
    `/api/orders/${orderId}/status`,
    fetcher,
    {
      refreshInterval: (data) => {
        if (data && data.status === "PENDING") {
          return 2000;
        }
        return 0; // stop polling when resolved or error
      },
      revalidateOnFocus: false,
      shouldRetryOnError: true,
      errorRetryInterval: 4000
    }
  );

  const status = data?.status || "PENDING";
  const orderType = data?.orderType || "COURSE";
  const courseSlug = data?.courseSlug || null;
  const courseName = data?.courseName || null;
  const items = data?.items || [];
  const totalAmount = data?.totalAmount || 0;
  const createdAt = data?.createdAt ? new Date(data.createdAt) : new Date();
  const paidAt = data?.paidAt ? new Date(data.paidAt) : null;

  // After 60 seconds still PENDING -> show processing message
  useEffect(() => {
    if (status === "PENDING") {
      const timer = setTimeout(() => {
        setTimedOut(true);
      }, 60000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  // Format Date to Indian Standard Time format or standard readable date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  // State 1 — PENDING (0-60s)
  if (status === "PENDING" && !timedOut) {
    return (
      <Card className="border-white/5 bg-slate-900/40 backdrop-blur-xl shadow-2xl rounded-3xl p-8 text-center space-y-6">
        <CardContent className="pt-6 space-y-6">
          <div className="flex justify-center relative">
            <div className="absolute inset-0 bg-violet-500/10 rounded-full filter blur-xl animate-pulse" />
            <div className="relative">
              <Loader2 className="h-16 w-16 text-violet-500 animate-spin" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-2xl font-extrabold text-white tracking-tight">
              Confirming Your Payment
            </h1>
            <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
              Please wait while we verify your transaction status with the payment gateway...
            </p>
          </div>
          <div className="flex justify-center items-center gap-1 text-[10px] uppercase font-mono tracking-widest text-violet-400 font-semibold animate-pulse">
            <span>Do not close this page or press back</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // State 2 — PENDING timeout (60s+)
  if (status === "PENDING" && timedOut) {
    return (
      <Card className="border-amber-500/20 bg-slate-900/40 backdrop-blur-xl shadow-2xl rounded-3xl p-8 text-center space-y-6">
        <CardContent className="pt-6 space-y-6">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-amber-500/10 border border-amber-500/20">
              <Clock className="h-12 w-12 text-amber-400 animate-pulse" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-2xl font-extrabold text-white tracking-tight">
              Payment Is Being Processed
            </h1>
            <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
              Your payment is taking longer than usual to confirm. This is normal — your bank or payment gateway may need extra time.
            </p>
            <p className="text-slate-500 text-xs max-w-sm mx-auto">
              We will send a confirmation email once verified. You can safely browse other pages.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl h-11 px-6 transition duration-200">
              <Link href="/student/orders">
                View My Orders
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-white/10 text-slate-300 hover:bg-white/5 rounded-xl h-11 px-6">
              <Link href="/support" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Contact Support
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // State 3 — PAID/SUCCESS
  if (status === "PAID") {
    return (
      <Card className="border-emerald-500/20 bg-slate-900/40 backdrop-blur-xl shadow-2xl rounded-3xl p-6 sm:p-8 space-y-6">
        <CardContent className="pt-4 space-y-6">
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 relative">
                <CheckCircle className="h-12 w-12 text-emerald-400" />
              </div>
            </div>
            <h1 className="font-display text-2xl font-extrabold text-white tracking-tight">
              Payment Successful!
            </h1>
            <p className="text-slate-400 text-sm">
              Your transaction has been confirmed and catalog items unlocked.
            </p>
          </div>

          {/* Receipt Info Card */}
          <div className="border border-white/5 bg-white/[0.02] p-5 rounded-2xl space-y-4">
            <div className="space-y-2">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Purchased Items</span>
              <div className="space-y-2">
                {items.map((item: { name: string; quantity: number }, idx: number) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="text-slate-200 font-medium truncate max-w-[280px]">
                      {item.name}
                    </span>
                    <span className="text-slate-400 text-right shrink-0">
                      Qty: {item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-white/5 pt-3 space-y-2 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Amount Paid</span>
                <span className="font-mono text-emerald-400 font-bold">
                  ₹{totalAmount.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Order Reference</span>
                <span className="font-mono text-slate-300">
                  {orderId.slice(0, 8)}...
                </span>
              </div>
              <div className="flex justify-between">
                <span>Payment Date</span>
                <span>
                  {formatDate(paidAt || createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {orderType === "COURSE" && courseSlug ? (
              <Button asChild className="flex-1 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl h-11 px-6 transition duration-200">
                <Link href={`/courses/${courseSlug}/learn`}>
                  Start Learning
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button asChild className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl h-11 px-6 transition duration-200">
                <Link href="/student/orders">
                  View My Orders
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}

            <Button
              asChild
              variant="outline"
              className="border-white/10 text-slate-300 hover:bg-white/5 rounded-xl h-11 px-6"
            >
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `I just enrolled in ${courseName || "our learning store products"}! Check it out here: ${
                    typeof window !== "undefined" ? window.location.origin : ""
                  }`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5"
              >
                Share on WhatsApp
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // State 4 — FAILED
  return (
    <Card className="border-rose-500/20 bg-slate-900/40 backdrop-blur-xl shadow-2xl rounded-3xl p-8 text-center space-y-6">
      <CardContent className="pt-6 space-y-6">
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-rose-500/10 border border-rose-500/20">
            <XCircle className="h-12 w-12 text-rose-500" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="font-display text-2xl font-extrabold text-white tracking-tight">
            Payment Failed
          </h1>
          <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
            Your payment could not be processed successfully. You have not been charged.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl h-11 px-6 transition duration-200">
            <Link href={orderType === "COURSE" && courseSlug ? `/courses/${courseSlug}` : "/store"}>
              Try Again
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-white/10 text-slate-300 hover:bg-white/5 rounded-xl h-11 px-6">
            <Link href="/support" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Contact Support
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
