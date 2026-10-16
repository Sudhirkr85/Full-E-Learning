import type { Metadata } from "next";
import { makeMetadata } from "@/lib/site";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { withRetry } from "@/lib/db";
import {
  ReportsClient,
  type StudentReportItem,
  type EnrollmentReportItem,
  type OrderReportItem
} from "./reports-client";

export const metadata: Metadata = makeMetadata({
  title: "Reports & Data Export - Admin Desk",
  description: "Export student lists, course enrollments, validity status, and financial transaction records to Excel/CSV.",
  path: "/admin/reports",
  noIndex: true
});

export default async function AdminReportsPage() {
  await requireRole(["ADMIN"]);

  const [users, enrollments, orders, courses] = await Promise.all([
    withRetry(() =>
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          enrollments: true
        }
      })
    ),
    withRetry(() =>
      prisma.enrollment.findMany({
        orderBy: { enrolledAt: "desc" },
        include: {
          user: true,
          course: true,
          progress: true
        }
      })
    ),
    withRetry(() =>
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          user: true,
          items: {
            include: {
              product: true
            }
          },
          payments: true
        }
      })
    ),
    withRetry(() =>
      prisma.course.findMany({
        select: {
          id: true,
          title: true,
          slug: true
        },
        orderBy: { title: "asc" }
      })
    )
  ]);

  // Transform Students
  const studentItems: StudentReportItem[] = users.map((u) => ({
    id: u.id,
    name: u.name || `${u.firstName || ""} ${u.lastName || ""}`.trim() || "Student",
    email: u.email,
    phone: u.phone || (u.metadata as any)?.phone || null,
    role: u.role,
    createdAt: u.createdAt.toISOString(),
    coursesCount: u.enrollments?.length ?? 0,
    enrolledCourseIds: u.enrollments?.map((e) => e.courseId) || []
  }));

  // Transform Enrollments
  const enrollmentItems: EnrollmentReportItem[] = enrollments.map((e) => {
    const isExpired = Boolean(e.expiresAt && new Date(e.expiresAt).getTime() < Date.now());
    let validityText = "Lifetime Access";
    if (e.expiresAt) {
      validityText = isExpired
        ? `Expired (${new Date(e.expiresAt).toLocaleDateString("en-IN")})`
        : `Valid till ${new Date(e.expiresAt).toLocaleDateString("en-IN")}`;
    }

    return {
      id: e.id,
      studentName: e.user.name || `${e.user.firstName || ""} ${e.user.lastName || ""}`.trim() || "Student",
      studentEmail: e.user.email,
      studentPhone: e.user.phone || (e.user.metadata as any)?.phone || null,
      courseId: e.courseId,
      courseTitle: e.course.title,
      paymentStatus: e.paymentStatus || "FREE",
      amountPaid: e.amountPaid ?? 0,
      validity: validityText,
      progressPercent: e.progress?.progressPercent ?? 0,
      enrolledAt: (e.enrolledAt || e.createdAt).toISOString(),
      expiresAt: e.expiresAt ? e.expiresAt.toISOString() : null
    };
  });

  // Transform Orders
  const orderItems: OrderReportItem[] = orders.map((o) => {
    const primaryItem = o.items[0];
    const itemTitle = primaryItem?.product?.title ?? primaryItem?.productName ?? "Store Item";
    const productType = primaryItem?.productType ?? "PHYSICAL_BOOK";
    const succeededPayment = o.payments.find((p) => p.status === "SUCCEEDED");
    const amountInRupees = succeededPayment
      ? succeededPayment.amountCents / 100
      : o.totalCents / 100;

    return {
      id: o.id,
      orderNumber: o.orderNumber,
      customerName: o.user?.name || o.billingEmail?.split("@")[0] || "Customer",
      customerEmail: o.user?.email || o.billingEmail || "N/A",
      customerPhone: o.user?.phone || o.billingPhone || null,
      itemTitle: o.items.length > 1 ? `${itemTitle} (+${o.items.length - 1} more)` : itemTitle,
      productType,
      amount: amountInRupees,
      status: o.status,
      placedAt: (o.placedAt || o.createdAt).toISOString()
    };
  });

  // Calculate Total Recorded Revenue
  const storeRevenue = orders
    .flatMap((o) => o.payments)
    .filter((p) => p.status === "SUCCEEDED")
    .reduce((sum, p) => sum + p.amountCents / 100, 0);

  const courseRevenue = enrollments
    .filter((e) => e.paymentStatus === "COMPLETED" || e.paymentStatus === "PAID" || e.paymentStatus === "MANUAL_PAID")
    .reduce((sum, e) => sum + (e.amountPaid || 0), 0);

  const totalRevenueRupees = Math.round(storeRevenue + courseRevenue);

  return (
    <ReportsClient
      students={studentItems}
      enrollments={enrollmentItems}
      orders={orderItems}
      courses={courses}
      totalRevenueRupees={totalRevenueRupees}
    />
  );
}
