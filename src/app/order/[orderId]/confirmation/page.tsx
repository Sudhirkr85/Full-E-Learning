import React from "react";
import { OrderConfirmationClient } from "./confirmation-client";

interface PageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export default async function OrderConfirmationPage({ params }: PageProps) {
  const { orderId } = await params;

  return (
    <div className="min-h-screen w-full bg-[#0a0a0f] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative grids and blur background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(124,58,237,0.08),rgba(255,255,255,0))]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/5 rounded-full filter blur-[100px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/5 rounded-full filter blur-[100px] animate-pulse pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg">
        <OrderConfirmationClient orderId={orderId} />
      </div>
    </div>
  );
}
