"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle, ShieldCheck, AlertCircle, ArrowLeft, ArrowRight, CreditCard, Lock, Printer, Award, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { simulatePaymentSuccessAction } from "@/lib/store/actions";

interface CheckoutClientProps {
  order: any;
}

export function CheckoutClient({ order }: CheckoutClientProps) {
  const router = useRouter();
  const [isPaying, setIsPaying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationSuccess, setSimulationSuccess] = useState("");

  const formattedSubtotal = (order.subtotalCents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: order.currency
  });

  const formattedDiscount = (order.discountCents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: order.currency
  });

  const formattedTotal = (order.totalCents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: order.currency
  });

  const shippingInfo = order.metadata?.shippingAddress;

  // Initialize and Open Razorpay Checkout modal
  const handleRazorpayPayment = async () => {
    setIsPaying(true);
    setErrorMessage("");
    
    try {
      // 1. Fetch Razorpay Order parameters from our API route
      const res = await fetch("/api/payments/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error ?? "Failed to create payment order.");
      }

      // 2. Load the checkout script dynamically if not present
      if (!(window as any).Razorpay) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.async = true;
          script.onload = resolve;
          script.onerror = () => reject(new Error("Failed to load payment gateway checkout SDK."));
          document.body.appendChild(script);
        });
      }

      // 3. Configure Razorpay Sandbox options
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "E-Learning Academy",
        description: `Receipt: ${data.receipt}`,
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80",
        order_id: data.orderId,
        handler: function (response: any) {
          console.log("[RAZORPAY_CLIENT_SUCCESS_CALLBACK]", response);
          alert("Payment processed by sandbox gateway. Waiting for webhook sync...");
          // Redirect to student order log to track activation
          router.push("/student/courses");
        },
        prefill: {
          email: order.billingEmail,
        },
        notes: {
          orderId: order.id,
        },
        theme: {
          color: "#f59e0b", // Gold theme
        },
      };

      const rzp = new (window as any).Razorpay(options);
      
      rzp.on("payment.failed", function (response: any) {
        console.error("[RAZORPAY_CLIENT_PAYMENT_FAILURE]", response.error);
        setErrorMessage(`Payment failed: ${response.error.description}`);
        setIsPaying(false);
      });

      rzp.open();
    } catch (err: any) {
      console.error("[PAYMENT_GATEWAY_ERROR]", err);
      setErrorMessage(err.message ?? "Could not connect to payment gateway.");
      setIsPaying(false);
    }
  };

  // Offline Sandbox simulation helper
  const handleOfflineSimulation = async () => {
    setIsSimulating(true);
    setErrorMessage("");
    setSimulationSuccess("");

    try {
      const res = await simulatePaymentSuccessAction(order.id);
      if (res.success) {
        setSimulationSuccess(res.message ?? "Success!");
        setTimeout(() => {
          router.push("/student/courses");
        }, 1500);
      } else {
        setErrorMessage(res.error ?? "Failed to simulate transaction.");
      }
    } catch (err: any) {
      setErrorMessage("Error running local sandbox simulation.");
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <Container className="max-w-4xl py-12">
      {order.status === "PAID" ? (
        // SUCCESS STATE CARD DISPLAY
        <Card className="border-emerald-500/20 bg-emerald-500/[0.01] shadow-2xl p-8 rounded-3xl text-center space-y-6">
          <CardContent className="pt-6 space-y-6">
            <div className="flex justify-center">
              <CheckCircle className="h-20 w-20 text-emerald-500 animate-bounce" />
            </div>
            <h1 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">
              Order Paid & Activated!
            </h1>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto">
              Your billing email <strong className="text-foreground">{order.billingEmail}</strong> has been credited. 
              The course credentials and download files are fully active in your account.
            </p>
            <div className="border border-border rounded-2xl p-4 bg-muted/40 max-w-md mx-auto flex items-center justify-between text-xs text-muted-foreground">
              <span>Receipt No: <strong>{order.orderNumber}</strong></span>
              <span>Paid on: <strong>{new Date(order.updatedAt).toLocaleDateString()}</strong></span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild variant="outline">
                <Link href="/store">Back to Store</Link>
              </Button>
              <Button asChild className="bg-amber-500 hover:bg-amber-600 text-background">
                <Link href="/student/courses" className="flex items-center gap-1">
                  Start Learning
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        // PENDING PAYMENT FORM
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* Order Bill Summary */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="border-border/60 shadow-soft overflow-hidden rounded-2xl">
              <CardHeader className="bg-muted/40">
                <Badge variant="outline" className="self-start text-[10px] uppercase font-mono tracking-wider mb-2">Pending payment</Badge>
                <CardTitle className="text-xl font-bold flex items-center justify-between">
                  <span>Invoice Breakdown</span>
                  <span className="font-mono text-xs text-muted-foreground">No: {order.orderNumber}</span>
                </CardTitle>
                <CardDescription>Receipt details will be emailed immediately after payment verification.</CardDescription>
              </CardHeader>
              
              <CardContent className="p-6 divide-y divide-border/80">
                {/* Items */}
                <div className="py-4 space-y-3">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest block font-semibold mb-2">Purchased Products</span>
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm items-center">
                      <div>
                        <span className="font-semibold text-foreground">{item.productName}</span>
                        <span className="text-xs text-muted-foreground ml-1.5">x{item.quantity}</span>
                      </div>
                      <span className="font-medium text-foreground">
                        {((item.totalPriceCents) / 100).toLocaleString("en-US", {
                          style: "currency",
                          currency: item.currency
                        })}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Shipping info */}
                {shippingInfo && (
                  <div className="py-4 space-y-1.5">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest block font-semibold mb-2">Shipping Information</span>
                    <p className="text-xs font-semibold text-foreground">{shippingInfo.fullName}</p>
                    <p className="text-xs text-muted-foreground">{shippingInfo.addressLine1}, {shippingInfo.addressLine2 && `${shippingInfo.addressLine2}, `}{shippingInfo.city}, {shippingInfo.state} - {shippingInfo.postalCode}</p>
                    <p className="text-xs text-muted-foreground">{shippingInfo.country}</p>
                  </div>
                )}

                {/* Subtotals & Taxes */}
                <div className="py-4 space-y-2 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formattedSubtotal}</span>
                  </div>
                  {order.discountCents > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Promo Discount</span>
                      <span>-{formattedDiscount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-foreground font-extrabold pt-2 border-t border-dashed">
                    <span>Total Amount due</span>
                    <span className="text-lg text-amber-500">{formattedTotal}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button asChild variant="ghost" size="sm">
              <Link href="/store" className="flex items-center gap-1.5 text-muted-foreground">
                <ArrowLeft className="h-4 w-4" />
                Change items or return to catalog
              </Link>
            </Button>
          </div>

          {/* Secure gateway options container */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border-border/60 shadow-medium rounded-2xl bg-card">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-amber-500" />
                  <span>Secure Sandbox Checkout</span>
                </CardTitle>
                <CardDescription>Choose standard merchant card gateway or execute transaction simulation.</CardDescription>
              </CardHeader>

              <CardContent className="p-6 space-y-4">
                <div className="text-sm border rounded-xl p-3 bg-muted/20 border-border text-muted-foreground flex gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs leading-relaxed">
                    Razorpay is running in <strong>TEST MODE</strong>. You can use standard sandbox visa credentials (e.g. Card: <code className="bg-muted px-1 rounded font-semibold text-foreground">4111 1111 1111 1111</code>) to trigger transactions.
                  </p>
                </div>

                {errorMessage && (
                  <div className="text-xs border border-destructive/20 bg-destructive/5 text-destructive rounded-xl p-3 flex gap-2">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {simulationSuccess && (
                  <div className="text-xs border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 rounded-xl p-3 flex gap-2 font-medium">
                    <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>{simulationSuccess}</span>
                  </div>
                )}

                {/* REAL PAYMENT INITIATION BUTTON */}
                <Button 
                  onClick={handleRazorpayPayment}
                  disabled={isPaying || isSimulating || !!simulationSuccess}
                  className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-background font-bold flex items-center justify-center gap-2 rounded-xl transition"
                >
                  <CreditCard className="h-5 w-5" />
                  {isPaying ? "Connecting Gateway..." : `Pay with Razorpay (${formattedTotal})`}
                </Button>

                <div className="relative flex items-center justify-center my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <span className="relative px-3 bg-card text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Or Offline Sandbox</span>
                </div>

                {/* SIMULATED WEBHOOK BUTTON */}
                <Button 
                  onClick={handleOfflineSimulation}
                  disabled={isPaying || isSimulating || !!simulationSuccess}
                  variant="outline"
                  className="w-full h-12 border-emerald-500/30 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10 font-bold flex items-center justify-center gap-2 rounded-xl transition"
                >
                  <Lock className="h-4 w-4" />
                  {isSimulating ? "Simulating upgrades..." : "Simulate Sandbox Payment"}
                </Button>
                
                <p className="text-[10px] text-center text-muted-foreground leading-normal">
                  "Simulate Sandbox Payment" updates internal order states and unlocks learning access instantly offline. Highly recommended for local dev runs without web tunnels.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </Container>
  );
}
