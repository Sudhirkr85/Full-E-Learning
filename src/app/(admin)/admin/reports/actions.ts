"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Server action to reset old test/dummy revenue transactions from June 2026.
 * Sets amountPaid to 0 and paymentStatus to 'FREE' for test enrollments,
 * and sets test store payments to CANCELLED so dashboard reflects ₹0.
 */
export async function adminResetTestRevenueAction() {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return { success: false, error: "Unauthorized access" };
  }

  try {
    // 1. Reset test enrollments with amountPaid > 0 from test users
    await prisma.enrollment.updateMany({
      where: {
        OR: [
          { user: { email: "sudhiraptron@gmail.com" } },
          { user: { email: "admin@sagarcoachingcentre.com" } }
        ],
        amountPaid: { gt: 0 }
      },
      data: {
        amountPaid: 0,
        paymentStatus: "FREE"
      }
    });

    // 2. Mark test store payments from test users as CANCELLED
    await prisma.payment.updateMany({
      where: {
        order: {
          user: {
            email: {
              in: ["sudhiraptron@gmail.com", "admin@sagarcoachingcentre.com", "sudhir@gmail.com"]
            }
          }
        },
        status: "SUCCEEDED"
      },
      data: {
        status: "FAILED"
      }
    });

    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/enrollments");
    revalidatePath("/admin/reports");

    return { success: true };
  } catch (error: any) {
    console.error("Failed to reset test revenue:", error);
    return { success: false, error: error.message || "Failed to reset test revenue" };
  }
}
