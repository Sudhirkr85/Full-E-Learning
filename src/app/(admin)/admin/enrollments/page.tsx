import type { Metadata } from "next";
import { makeMetadata } from "@/lib/site";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { withRetry } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { EnrollmentsClient } from "./enrollments-client";

export const metadata: Metadata = makeMetadata({
  title: "Enrollment & Store Orders - Admin Desk",
  description: "Monitor platform registrations, completion ratios, billing logs, and store purchases.",
  path: "/admin/enrollments",
  noIndex: true
});

export default async function AdminEnrollmentsPage() {
  // Enforce ADMIN role check on the server
  await requireRole(["ADMIN"]);

  // Fetch enrollments and store orders using withRetry wrapper for connection safety
  // Filter out COURSE_ACCESS from Store Orders to avoid double counting course purchases
  const [enrollments, orders] = await Promise.all([
    withRetry(() =>
      prisma.enrollment.findMany({
        include: {
          user: true,
          course: true,
          progress: true
        },
        orderBy: { createdAt: "desc" }
      })
    ),
    withRetry(() =>
      prisma.order.findMany({
        where: {
          items: {
            some: {
              productType: {
                not: "COURSE_ACCESS"
              }
            }
          }
        },
        include: {
          user: true,
          items: {
            where: {
              productType: {
                not: "COURSE_ACCESS"
              }
            },
            include: { 
              product: {
                include: { course: true }
              }
            }
          },
          payments: true
        },
        orderBy: { createdAt: "desc" }
      })
    )
  ]);

  // Aggregate Metrics Server-side
  const totalEnrollments = enrollments.length;

  // Active Learners: Unique users who have at least one enrollment record
  const uniqueUserIds = new Set(enrollments.map((e) => e.userId));
  const activeLearners = uniqueUserIds.size;

  // Store Revenue: Sum of SUCCEEDED payment amounts in ₹ (amountCents is in paise)
  // Scaled cleanly to exclude course revenues (since orders is pre-filtered!)
  const succeededPayments = orders.flatMap((o) => o.payments).filter((p) => p.status === "SUCCEEDED");
  const storeRevenue = succeededPayments.reduce((sum, p) => sum + p.amountCents, 0); // Keep in paise for metrics object

  // Course Revenue: Sum of `amountPaid` (stored in Rupees, convert to paise) for completed/paid enrollments
  const paidEnrollments = enrollments.filter(
    (e) => e.paymentStatus === "COMPLETED" || e.paymentStatus === "PAID"
  );
  const courseRevenue = paidEnrollments.reduce((sum, e) => sum + (e.amountPaid || 0) * 100, 0);

  // Total Platform Revenue: Combine store and course revenue volumes
  const totalRevenue = storeRevenue + courseRevenue;

  // Pending Dispatch: Paid physical product orders that do not have tracking details or a status of SHIPPED/DELIVERED
  const pendingDispatch = orders.filter((o) => {
    if (o.status !== "PAID") return false;
    const isPhysical = o.items.some((item) => item.product?.shippingRequired === true || item.productType === "PHYSICAL" || item.product?.productType === "PHYSICAL");
    const metadata = (o.metadata as Record<string, any>) || {};
    const hasTracking = !!o.trackingNumber || !!metadata.trackingId || !!metadata.trackingUrl;
    const shipStatus = o.shippingStatus || metadata.shippingStatus;
    const isFulfilled = shipStatus === "SHIPPED" || shipStatus === "OUT_FOR_DELIVERY" || shipStatus === "DELIVERED" || hasTracking;
    return isPhysical && !isFulfilled;
  }).length;

  const metrics = {
    totalEnrollments,
    activeLearners,
    storeRevenue, // Pass raw paise sum to client
    courseRevenue,
    totalRevenue,
    pendingDispatch
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <Badge variant="secondary" className="w-fit">Admin area</Badge>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-white">
          Enrollment & Order Manager
        </h1>
        <p className="text-xs text-slate-400">
          Track student curriculum progress, monitor catalog checkouts, check billing states, and moderate shipping dispatches.
        </p>
      </div>

      {/* Interactive Table Interface */}
      <EnrollmentsClient 
        enrollments={enrollments} 
        orders={orders} 
        metrics={metrics} 
      />
    </div>
  );
}
