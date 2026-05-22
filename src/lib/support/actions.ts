"use server";

import { prisma } from "@/lib/prisma";
import { requireUser, requireRole } from "@/lib/auth";
import { TicketStatus, TicketPriority, AuditAction, NotificationType } from "@prisma/client";
import { writeAuditLog } from "@/lib/audit/actions";
import { createSystemNotification } from "@/lib/notifications/actions";
import { revalidatePath } from "next/cache";

export interface TicketMessage {
  authorId: string;
  authorName: string;
  authorRole: string;
  message: string;
  timestamp: string;
}

/**
 * Creates a new support ticket for the logged-in student.
 */
export async function createTicketAction(formData: {
  subject: string;
  message: string;
  priority?: TicketPriority;
  category?: string;
}) {
  try {
    const user = await requireUser();

    if (!formData.subject.trim() || !formData.message.trim()) {
      throw new Error("Subject and message are required.");
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        reporterId: user.id,
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        priority: formData.priority || TicketPriority.MEDIUM,
        category: formData.category || "General",
        status: TicketStatus.OPEN,
        metadata: JSON.stringify([]), // Initialize message thread
      },
    });

    // Write audit log
    await writeAuditLog({
      userId: user.id,
      action: AuditAction.CREATE,
      entityType: "SupportTicket",
      entityId: ticket.id,
      afterState: ticket,
    });

    // Send in-app notification to all admins/staff (or a system log)
    // For now, notify the user that their ticket was opened
    await createSystemNotification({
      userId: user.id,
      type: NotificationType.SUPPORT,
      title: "Support Ticket Opened",
      message: `Your ticket "${ticket.subject}" has been successfully created. We will review it shortly.`,
      linkUrl: `/student/support/${ticket.id}`,
    });

    revalidatePath("/student/support");
    return { success: true, ticket };
  } catch (err: any) {
    console.error("[CREATE_TICKET_ERROR]", err);
    return { success: false, error: err.message || "Failed to create support ticket." };
  }
}

/**
 * Appends a reply to a support ticket thread.
 */
export async function replyToTicketAction(ticketId: string, replyMessage: string) {
  try {
    const user = await requireUser();

    if (!replyMessage.trim()) {
      throw new Error("Reply message cannot be empty.");
    }

    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId },
      include: { reporter: true, assignedTo: true },
    });

    if (!ticket) {
      throw new Error("Ticket not found.");
    }

    // Security check: Only the reporter or an Admin/Teacher can reply
    const isAdminOrTeacher = ["ADMIN", "TEACHER"].includes(user.role);
    if (ticket.reporterId !== user.id && !isAdminOrTeacher) {
      throw new Error("Unauthorized to access or reply to this ticket.");
    }

    // Load existing messages
    let thread: TicketMessage[] = [];
    if (ticket.metadata) {
      try {
        const parsed = typeof ticket.metadata === "string" 
          ? JSON.parse(ticket.metadata) 
          : ticket.metadata;
        if (Array.isArray(parsed)) {
          thread = parsed as any[];
        }
      } catch (e) {
        console.warn("Failed to parse ticket thread metadata, starting fresh.");
      }
    }

    const newReply: TicketMessage = {
      authorId: user.id,
      authorName: user.name || user.email,
      authorRole: user.role,
      message: replyMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    thread.push(newReply);

    // Update status based on who replied
    let nextStatus = ticket.status;
    if (isAdminOrTeacher) {
      nextStatus = TicketStatus.WAITING_ON_USER;
    } else {
      nextStatus = TicketStatus.IN_PROGRESS;
    }

    const beforeState = { status: ticket.status, metadata: ticket.metadata };

    const updatedTicket = await prisma.supportTicket.update({
      where: { id: ticketId },
      data: {
        status: nextStatus,
        metadata: JSON.stringify(thread),
      },
    });

    // Write audit log
    await writeAuditLog({
      userId: user.id,
      action: AuditAction.UPDATE,
      entityType: "SupportTicket",
      entityId: ticketId,
      beforeState,
      afterState: updatedTicket,
    });

    // Notify the other party
    if (isAdminOrTeacher) {
      // Notify student
      await createSystemNotification({
        userId: ticket.reporterId,
        type: NotificationType.SUPPORT,
        title: "New Support Ticket Reply",
        message: `A staff member replied to your ticket: "${ticket.subject}"`,
        linkUrl: `/student/support/${ticket.id}`,
      });
    } else if (ticket.assignedToId) {
      // Notify assigned staff
      await createSystemNotification({
        userId: ticket.assignedToId,
        type: NotificationType.SUPPORT,
        title: "Student Replied to Ticket",
        message: `Student ${user.name || user.email} replied to assigned ticket: "${ticket.subject}"`,
        linkUrl: `/admin/support`, // Admin can view it here
      });
    }

    revalidatePath(`/student/support/${ticketId}`);
    revalidatePath("/admin/support");
    return { success: true, ticket: updatedTicket };
  } catch (err: any) {
    console.error("[REPLY_TICKET_ERROR]", err);
    return { success: false, error: err.message || "Failed to submit reply." };
  }
}

/**
 * Updates a support ticket's status (e.g., resolve or close).
 */
export async function updateTicketStatusAction(ticketId: string, status: TicketStatus) {
  try {
    const user = await requireUser();

    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      throw new Error("Ticket not found.");
    }

    // Security check: Only reporter can resolve/close, or staff members
    const isAdminOrTeacher = ["ADMIN", "TEACHER"].includes(user.role);
    if (ticket.reporterId !== user.id && !isAdminOrTeacher) {
      throw new Error("Unauthorized.");
    }

    const beforeState = { status: ticket.status, resolvedAt: ticket.resolvedAt, closedAt: ticket.closedAt };
    const now = new Date();

    const data: any = { status };
    if (status === TicketStatus.RESOLVED) {
      data.resolvedAt = now;
    } else if (status === TicketStatus.CLOSED) {
      data.closedAt = now;
    }

    const updatedTicket = await prisma.supportTicket.update({
      where: { id: ticketId },
      data,
    });

    // Write audit log
    await writeAuditLog({
      userId: user.id,
      action: status === TicketStatus.CLOSED ? AuditAction.ARCHIVE : AuditAction.UPDATE,
      entityType: "SupportTicket",
      entityId: ticketId,
      beforeState,
      afterState: updatedTicket,
    });

    // Notify student if state changed by staff
    if (isAdminOrTeacher && ticket.reporterId !== user.id) {
      await createSystemNotification({
        userId: ticket.reporterId,
        type: NotificationType.SUPPORT,
        title: `Ticket Status Updated`,
        message: `Your ticket "${ticket.subject}" status is now ${status}.`,
        linkUrl: `/student/support/${ticket.id}`,
      });
    }

    revalidatePath(`/student/support/${ticketId}`);
    revalidatePath("/student/support");
    revalidatePath("/admin/support");
    return { success: true, ticket: updatedTicket };
  } catch (err: any) {
    console.error("[UPDATE_TICKET_STATUS_ERROR]", err);
    return { success: false, error: err.message || "Failed to update ticket status." };
  }
}

/**
 * Assigns a support ticket to a staff member.
 */
export async function assignTicketAction(ticketId: string, staffId: string | null) {
  try {
    const user = await requireRole(["ADMIN", "TEACHER"]);

    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      throw new Error("Ticket not found.");
    }

    const beforeState = { assignedToId: ticket.assignedToId };

    const updatedTicket = await prisma.supportTicket.update({
      where: { id: ticketId },
      data: {
        assignedToId: staffId,
      },
    });

    // Write audit log
    await writeAuditLog({
      userId: user.id,
      action: AuditAction.UPDATE,
      entityType: "SupportTicket",
      entityId: ticketId,
      beforeState,
      afterState: updatedTicket,
    });

    // Notify assigned staff member
    if (staffId && staffId !== user.id) {
      await createSystemNotification({
        userId: staffId,
        type: NotificationType.SUPPORT,
        title: "Assigned a Support Ticket",
        message: `You have been assigned ticket: "${ticket.subject}"`,
        linkUrl: `/admin/support`,
      });
    }

    revalidatePath("/admin/support");
    return { success: true, ticket: updatedTicket };
  } catch (err: any) {
    console.error("[ASSIGN_TICKET_ERROR]", err);
    return { success: false, error: err.message || "Failed to assign ticket." };
  }
}

/**
 * Fetch all tickets opened by the logged-in student.
 */
export async function getStudentTicketsAction() {
  try {
    const user = await requireUser();

    const tickets = await prisma.supportTicket.findMany({
      where: { reporterId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, tickets };
  } catch (err: any) {
    console.error("[GET_STUDENT_TICKETS_ERROR]", err);
    return { success: false, error: err.message || "Failed to load tickets." };
  }
}

/**
 * Fetch all tickets for the admin portal.
 */
export async function getAdminTicketsAction() {
  try {
    await requireRole(["ADMIN", "TEACHER"]);

    const tickets = await prisma.supportTicket.findMany({
      include: {
        reporter: {
          select: { id: true, name: true, email: true },
        },
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: [
        { status: "asc" },
        { priority: "desc" },
        { createdAt: "desc" },
      ],
    });

    return { success: true, tickets };
  } catch (err: any) {
    console.error("[GET_ADMIN_TICKETS_ERROR]", err);
    return { success: false, error: err.message || "Failed to load tickets." };
  }
}
