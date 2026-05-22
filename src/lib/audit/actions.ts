import { prisma } from "@/lib/prisma";
import type { AuditAction } from "@prisma/client";

interface WriteAuditLogParams {
  userId?: string | null;
  action: AuditAction;
  entityType: string;
  entityId: string;
  beforeState?: any;
  afterState?: any;
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata?: any;
}

/**
 * Write a centralized audit log entry into the database.
 * Strictly checks for input formats and safe-serializes states into JSON fields.
 */
export async function writeAuditLog({
  userId,
  action,
  entityType,
  entityId,
  beforeState,
  afterState,
  ipAddress,
  userAgent,
  metadata,
}: WriteAuditLogParams) {
  try {
    const log = await prisma.auditLog.create({
      data: {
        userId: userId || null,
        action,
        entityType,
        entityId,
        beforeState: beforeState ? JSON.parse(JSON.stringify(beforeState)) : undefined,
        afterState: afterState ? JSON.parse(JSON.stringify(afterState)) : undefined,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined,
      },
    });
    return { success: true, log };
  } catch (err: any) {
    console.error("[WRITE_AUDIT_LOG_ERROR]", err);
    return { success: false, error: err.message || "Failed to write audit log." };
  }
}
