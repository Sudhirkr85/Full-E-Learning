"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

type OrderStatusPollerProps = {
  orderId: string;
  initialStatus: string;
};

export function OrderStatusPoller({ orderId, initialStatus }: OrderStatusPollerProps) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);

  useEffect(() => {
    // Only poll if the order is currently PENDING
    if (status !== "PENDING") return;

    let intervalId: NodeJS.Timeout;

    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}/status`, {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          if (data.status && data.status !== "PENDING") {
            setStatus(data.status);
            // Refresh the server page to load the new data
            router.refresh();
          }
        }
      } catch (err) {
        console.error("Failed to poll order status:", err);
      }
    };

    // Poll every 3.5 seconds
    intervalId = setInterval(checkStatus, 3500);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [orderId, status, router]);

  if (status === "PENDING") {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-amber-500/10 text-amber-400 border border-amber-500/20">
        <Loader2 className="h-3 w-3 animate-spin text-amber-400" />
        <span>Verifying Payment...</span>
      </div>
    );
  }

  return null;
}
