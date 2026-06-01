import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendShippingDispatchedEmail, sendOrderDeliveredEmail } from "@/lib/email";
import { NotificationType } from "@prisma/client";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "TEACHER") {
      return NextResponse.json({ error: "Forbidden: Admins or Teachers only" }, { status: 403 });
    }

    const { courierName, trackingId, dispatchDate, shippingStatus, internalNote } = await request.json();

    if (!shippingStatus) {
      return NextResponse.json({ error: "shippingStatus is required" }, { status: 400 });
    }

    // 1. Fetch current order with items and user
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        user: true
      }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const currentMetadata: any = order.metadata || {};
    const oldStatus = currentMetadata.shippingStatus || "PROCESSING";

    // Merge order metadata
    const updatedMetadata = {
      ...currentMetadata,
      shippingStatus,
      courierName: courierName || currentMetadata.courierName || "",
      trackingId: trackingId || currentMetadata.trackingId || "",
      dispatchDate: dispatchDate || currentMetadata.dispatchDate || new Date().toISOString().split('T')[0],
      internalNote: internalNote || currentMetadata.internalNote || "",
      trackingUrl: currentMetadata.trackingUrl || ""
    };

    // 2. Update order and all physical order items in a transaction
    await prisma.$transaction(async (tx) => {
      // Update order metadata
      await tx.order.update({
        where: { id: order.id },
        data: {
          metadata: updatedMetadata
        }
      });

      // Update OrderItem metadata for physical items
      const physicalItems = order.items.filter(item => item.productType === "PHYSICAL");
      for (const item of physicalItems) {
        const itemMeta: any = item.metadata || {};
        await tx.orderItem.update({
          where: { id: item.id },
          data: {
            metadata: {
              ...itemMeta,
              type: "PHYSICAL",
              shippingStatus,
              courierName: courierName || itemMeta.courierName || "",
              trackingId: trackingId || itemMeta.trackingId || "",
              dispatchDate: dispatchDate || itemMeta.dispatchDate || new Date().toISOString().split('T')[0],
              internalNote: internalNote || itemMeta.internalNote || ""
            }
          }
        });
      }
    });

    // 3. Create in-app notification
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
          linkUrl: `/student/orders`
        }
      });
    }

    // 4. Send Brevo dispatched email if shippingStatus transitioned to SHIPPED
    if (shippingStatus === "SHIPPED" && oldStatus !== "SHIPPED" && order.userId && order.user) {
      try {
        const dateStr = dispatchDate || new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric"
        });
        await sendShippingDispatchedEmail({
          order,
          user: order.user,
          courierName: courierName || "Courier Service",
          trackingId: trackingId || "Available soon",
          dispatchDate: dateStr
        });
      } catch (emailErr) {
        console.error("[EMAIL_DISPATCH_ERROR]", emailErr);
      }
    }

    // 5. Send Brevo delivered email if shippingStatus transitioned to DELIVERED
    if (shippingStatus === "DELIVERED" && oldStatus !== "DELIVERED" && order.userId && order.user) {
      try {
        const productNames = order.items.map(item => item.productName).join(", ");
        await sendOrderDeliveredEmail(
          order.billingEmail,
          order.user.name || "Student",
          order.id,
          productNames
        );
      } catch (emailErr) {
        console.error("[EMAIL_DELIVERED_ERROR]", emailErr);
      }
    }

    return NextResponse.json({ success: true, message: "Shipping tracking information updated successfully" });
  } catch (err: any) {
    console.error("[PATCH_SHIPPING_API_ERROR]", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
