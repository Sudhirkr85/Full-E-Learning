import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { makeMetadata } from "@/lib/site";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, GraduationCap, LayoutDashboard, Receipt } from "lucide-react";
import { prisma } from "@/lib/prisma";

type SuccessPageProps = {
  searchParams: Promise<{
    courseSlug?: string;
    orderId?: string;
  }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return makeMetadata({
    title: "Payment Successful | Learning Platform",
    description: "Your course enrollment payment has been successfully processed and verified.",
    path: "/payment/success",
    noIndex: true
  });
}

export const dynamic = "force-dynamic";

export default async function PaymentSuccessPage({ searchParams }: SuccessPageProps) {
  const { courseSlug, orderId } = await searchParams;

  // Attempt to fetch course title
  let courseTitle = "your premium course";
  let finalSlug = courseSlug || "";
  let orderNumber = orderId ? orderId.substring(0, 12) : "ORD_SUCCESS";

  if (courseSlug) {
    const course = await prisma.course.findUnique({
      where: { slug: courseSlug },
      select: { title: true, slug: true }
    });
    if (course) {
      courseTitle = course.title;
      finalSlug = course.slug;
    }
  }

  if (orderId) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { orderNumber: true }
    });
    if (order) {
      orderNumber = order.orderNumber;
    }
  }

  return (
    <div className="relative min-h-screen py-20 flex items-center justify-center bg-[#030712]">
      {/* Background neon glows */}
      <div className="absolute left-1/2 top-1/2 -z-10 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[100px]" />
      
      <Container className="max-w-xl mx-auto px-4">
        <Card className="bg-[#090d20]/60 border-emerald-500/20 backdrop-blur-xl relative overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.15)] rounded-3xl">
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
          
          <CardContent className="p-8 text-center space-y-6">
            {/* Green animated checkmark */}
            <div className="flex justify-center">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-bounce">
                <CheckCircle2 className="h-10 w-10 text-emerald-400" />
              </div>
            </div>

            <div className="space-y-2">
              <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-300 border-emerald-500/20 px-3 py-1 font-semibold text-xs tracking-wider uppercase">
                Payment Success
              </Badge>
              <h1 className="font-display text-3xl font-extrabold tracking-tight text-white mt-3">
                Payment Successful!
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed mt-2 max-w-sm mx-auto">
                Congratulations! You are now enrolled and have full access to:
              </p>
              <p className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 block mt-2">
                "{courseTitle}"
              </p>
            </div>

            {/* Receipt Summary */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-xs text-slate-400 space-y-2 text-left max-w-md mx-auto">
              <div className="flex justify-between font-mono">
                <span className="flex items-center gap-1">
                  <Receipt className="h-3.5 w-3.5 text-indigo-400" />
                  Order ID:
                </span>
                <span className="text-white font-semibold">{orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Access Status:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  ● INSTANT ACTIVE
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3 pt-4 max-w-md mx-auto">
              <Button asChild className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl border border-white/10 shadow-[0_0_15px_rgba(99,102,241,0.25)] h-11 w-full">
                <Link href="/student/dashboard" className="flex items-center justify-center gap-2">
                  <GraduationCap className="h-5 w-5" /> Start Learning Now
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-white/10 bg-slate-950/40 hover:bg-slate-900/60 text-slate-300 hover:text-white rounded-xl h-11 w-full">
                <Link href="/student/dashboard" className="flex items-center justify-center gap-2">
                  <LayoutDashboard className="h-4.5 w-4.5" /> View My Courses Dashboard
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
