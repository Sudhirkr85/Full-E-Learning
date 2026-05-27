"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { NotificationType, NotificationChannel } from "@prisma/client";

/**
 * Fetch all in-app notifications for the logged-in user.
 */
export async function getNotificationsAction() {
  try {
    const session = await getSession();
    if (!session?.user) {
      return {
        success: true,
        notifications: [],
        unreadCount: 0,
      };
    }

    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id,
        channel: NotificationChannel.IN_APP,
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    const unreadCount = await prisma.notification.count({
      where: {
        userId: session.user.id,
        channel: NotificationChannel.IN_APP,
        isRead: false,
      },
    });

    return {
      success: true,
      notifications,
      unreadCount,
    };
  } catch (err: any) {
    console.error("[GET_NOTIFICATIONS_ERROR]", err);
    return {
      success: false,
      error: err.message ?? "Failed to fetch notifications.",
      notifications: [],
      unreadCount: 0,
    };
  }
}

/**
 * Marks a single notification as read.
 */
export async function markAsReadAction(notificationId: string) {
  try {
    const session = await getSession();
    if (!session?.user) {
      throw new Error("Unauthorized.");
    }

    await prisma.notification.update({
      where: {
        id: notificationId,
        userId: session.user.id, // Security: Enforce ownership
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return { success: true };
  } catch (err: any) {
    console.error("[MARK_AS_READ_ERROR]", err);
    return {
      success: false,
      error: err.message ?? "Failed to update notification.",
    };
  }
}

/**
 * Marks all notifications as read for the logged-in user.
 */
export async function markAllAsReadAction() {
  try {
    const session = await getSession();
    if (!session?.user) {
      throw new Error("Unauthorized.");
    }

    await prisma.notification.updateMany({
      where: {
        userId: session.user.id,
        isRead: false,
        channel: NotificationChannel.IN_APP,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return { success: true };
  } catch (err: any) {
    console.error("[MARK_ALL_AS_READ_ERROR]", err);
    return {
      success: false,
      error: err.message ?? "Failed to update notifications.",
    };
  }
}

/**
 * Helper utility to insert standard system notifications.
 */
export async function createSystemNotification(params: {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  linkUrl?: string;
}) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: params.userId,
        type: params.type,
        channel: NotificationChannel.IN_APP,
        title: params.title,
        message: params.message,
        linkUrl: params.linkUrl || null,
        isRead: false,
      },
    });
    return { success: true, notification };
  } catch (err: any) {
    console.error("[CREATE_NOTIFICATION_ERROR]", err);
    return { success: false, error: err.message };
  }
}
