"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { canServeAds, loadAdSenseScript, AdContext } from "@/lib/ads/ad-eligibility";

interface AdSlotProps {
  /** AdSense Slot ID from Google AdSense Console */
  slotId?: string;
  /** Responsive ad format: auto, rectangle, horizontal, vertical */
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  /** Optional custom class name for layout spacing */
  className?: string;
  /** Data context for course/test access and pricing validation */
  context?: AdContext;
  /** Minimum container height to prevent Cumulative Layout Shift (CLS) */
  minHeight?: number;
}

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

/**
 * Reusable Google AdSense Slot with strict policy safeguards:
 * 1. Checks route eligibility (blocks admin, auth, checkout, legal, paid pages, active tests).
 * 2. Checks data eligibility (blocks paid courses & tests, requires verified public access).
 * 3. Enforces CLS protection with reserved minimum height.
 * 4. Displays policy-compliant "ADVERTISEMENT" label.
 * 5. Loads adsbygoogle.js on-demand (singleton deduplicated) ONLY on eligible routes.
 * 6. Prevents duplicate script initialization and collision with core controls.
 */
export function AdSlot({
  slotId,
  format = "auto",
  className = "",
  context,
  minHeight = 250,
}: AdSlotProps) {
  const pathname = usePathname();
  const adRef = useRef<HTMLModElement | null>(null);
  const isPushed = useRef(false);

  const { eligible } = canServeAds(pathname || "", context);
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-8160370419154141";

  useEffect(() => {
    // Only attempt push if eligible, publisherId configured, and slot not already pushed
    if (eligible && publisherId && adRef.current && !isPushed.current) {
      try {
        if (typeof window !== "undefined") {
          // Ensure adsbygoogle.js script is loaded (singleton deduplicated in document.head)
          loadAdSenseScript(publisherId, pathname || "", context);

          window.adsbygoogle = window.adsbygoogle || [];
          window.adsbygoogle.push({});
          isPushed.current = true;
        }
      } catch (err) {
        console.warn("[AdSlot] AdSense push error:", err);
      }
    }
  }, [eligible, publisherId, slotId, pathname, context]);

  // If ads are disabled or route/content is prohibited, render nothing
  if (!eligible || !publisherId) {
    return null;
  }

  return (
    <div
      className={`my-6 mx-auto w-full max-w-4xl overflow-hidden rounded-lg border border-border/40 bg-muted/20 p-2 text-center ${className}`}
      style={{ minHeight: `${minHeight}px` }}
      aria-label="Advertisement container"
    >
      <div className="mb-1.5 text-center">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
          Advertisement
        </span>
      </div>
      <div className="flex items-center justify-center overflow-hidden">
        <ins
          ref={adRef}
          className="adsbygoogle block w-full"
          style={{ display: "block" }}
          data-ad-client={publisherId}
          data-ad-slot={slotId || "0000000000"}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}

export default AdSlot;
