import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { NotificationType } from "@prisma/client";

/**
 * Updates the shipping tracking details for an order.
 * Restricted strictly to staff roles (ADMIN / TEACHER).
 */
export async function updateShippingAction(params: {
  orderId: string;
  shippingStatus: "PROCESSING" | "SHIPPED" | "DELIVERED";
  courierName?: string;
  trackingId?: string;
  trackingUrl?: string;
}) {
  try {
    const actor = await requireRole(["ADMIN", "TEACHER"]);
    const { orderId, shippingStatus, courierName, trackingId, trackingUrl } = params;

    if (!orderId) {
      throw new Error("Order ID is required.");
    }

    // 1. Fetch current order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error("Order not found.");
    }

    const currentMetadata: any = order.metadata || {};

    // 2. Prepare merged metadata
    const updatedMetadata = {
      ...currentMetadata,
      shippingStatus,
      courierName: courierName || currentMetadata.courierName || "",
      trackingId: trackingId || currentMetadata.trackingId || "",
      trackingUrl: trackingUrl || currentMetadata.trackingUrl || "",
    };

    // 3. Update order in database
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        metadata: updatedMetadata,
      },
    });

    // 4. Automatically notify the student of updates
    if (order.userId) {
      let title = "Order Status Update 📦";
      let message = `Your order status has been updated to: ${shippingStatus.toLowerCase()}.`;

      if (shippingStatus === "SHIPPED") {
        title = "Order Shipped! 🚚";
        message = `Your order has been dispatched via ${courierName || "Courier"}. Tracking ID: ${trackingId || "Available"}.`;
      } else if (shippingStatus === "DELIVERED") {
        title = "Order Delivered! 🎉";
        message = `Your package has been successfully delivered. Thank you for shopping with us!`;
      }

      await prisma.notification.create({
        data: {
          userId: order.userId,
          type: NotificationType.ORDER,
          title,
          message,
          linkUrl: `/student/orders/${order.id}`,
        },
      });
    }



    return {
      success: true,
      message: "Shipping tracking information updated successfully.",
    };
  } catch (err: any) {
    console.error("[UPDATE_SHIPPING_ERROR]", err);
    return {
      success: false,
      error: err.message ?? "Failed to update shipping details.",
    };
  }
}
