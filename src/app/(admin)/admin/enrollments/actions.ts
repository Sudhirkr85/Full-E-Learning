"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { hashPassword } from "@/lib/password";
import { EnrollmentStatus } from "@prisma/client";

export type GrantCourseAccessInput = {
  mode: "EXISTING" | "NEW";
  // If EXISTING
  userId?: string;
  // If NEW
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  // Course details
  courseId: string;
  // Payment info
  paymentType: "FREE" | "OFFLINE_CASH" | "DIRECT_UPI" | "SCHOLARSHIP";
  amountPaid: number; // in Rupees
  notes?: string;
  // Plan duration
  durationPlan: "LIFETIME" | "30_DAYS" | "90_DAYS" | "180_DAYS" | "365_DAYS" | "EXAM_DATE" | "CUSTOM";
  customExpiresAt?: string; // YYYY-MM-DD string
};

function splitName(name: string) {
  const parts = name.trim().split(/\s+/);
  const firstName = parts[0] ?? null;
  const lastName = parts.length > 1 ? parts.slice(1).join(" ") : null;
  return { firstName, lastName };
}

function calculateExpiryDate(
  plan: GrantCourseAccessInput["durationPlan"],
  customDateStr?: string
): Date | null {
  const now = new Date();
  switch (plan) {
    case "LIFETIME":
      return null;
    case "30_DAYS":
      return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    case "90_DAYS":
      return new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
    case "180_DAYS":
      return new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000);
    case "365_DAYS":
      return new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
    case "EXAM_DATE":
    case "CUSTOM":
      if (!customDateStr) return null;
      const parsed = new Date(customDateStr);
      if (isNaN(parsed.getTime())) return null;
      // Set to end of day in local time
      parsed.setHours(23, 59, 59, 999);
      return parsed;
    default:
      return null;
  }
}

export async function searchStudentsAction(query: string) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized", users: [] };
    }

    const term = query.trim();
    if (!term || term.length < 2) {
      return { success: true, users: [] };
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: term, mode: "insensitive" } },
          { email: { contains: term, mode: "insensitive" } },
          { phone: { contains: term, mode: "insensitive" } }
        ]
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true
      },
      take: 10
    });

    return { success: true, users };
  } catch (error: any) {
    console.error("searchStudentsAction error:", error);
    return { success: false, error: error.message || "Failed to search students", users: [] };
  }
}

export async function adminGrantCourseAccessAction(input: GrantCourseAccessInput) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized: Admin privileges required." };
    }

    if (!input.courseId) {
      return { success: false, error: "Please select a valid course." };
    }

    // 1. Verify Course exists
    const course = await prisma.course.findUnique({
      where: { id: input.courseId },
      include: {
        sections: {
          include: {
            lessons: {
              where: { isPublished: true }
            }
          }
        }
      }
    });

    if (!course) {
      return { success: false, error: "Selected course does not exist." };
    }

    let targetUserId = input.userId;
    let targetUserName = input.name || "";
    let targetUserEmail = input.email || "";
    let wasUserCreated = false;
    let temporaryPassword = input.password;

    // 2. Resolve Student User
    if (input.mode === "NEW") {
      if (!input.email || !input.name) {
        return { success: false, error: "Name and Email are required for new student." };
      }

      const normalizedEmail = input.email.trim().toLowerCase();
      targetUserEmail = normalizedEmail;
      targetUserName = input.name.trim();

      // Check if user already exists with this email
      let existingUser = await prisma.user.findUnique({
        where: { email: normalizedEmail }
      });

      if (existingUser) {
        targetUserId = existingUser.id;
        targetUserName = existingUser.name || targetUserName;
      } else {
        // Create new student
        const rawPassword = input.password?.trim() || input.phone?.trim() || "student123";
        temporaryPassword = rawPassword;
        const passwordHash = await hashPassword(rawPassword);
        const { firstName, lastName } = splitName(targetUserName);

        const newUser = await prisma.user.create({
          data: {
            name: targetUserName,
            email: normalizedEmail,
            phone: input.phone?.trim() || null,
            passwordHash,
            firstName,
            lastName,
            role: "STUDENT"
          }
        });

        targetUserId = newUser.id;
        wasUserCreated = true;
      }
    } else {
      // Mode is EXISTING
      if (!targetUserId) {
        return { success: false, error: "Please select an existing student." };
      }

      const existing = await prisma.user.findUnique({
        where: { id: targetUserId },
        select: { id: true, name: true, email: true, phone: true }
      });

      if (!existing) {
        return { success: false, error: "Student account not found." };
      }

      targetUserName = existing.name || "Student";
      targetUserEmail = existing.email;
    }

    if (!targetUserId) {
      return { success: false, error: "Could not resolve student account." };
    }

    // 3. Calculate Validity / Expiry
    const expiresAt = calculateExpiryDate(input.durationPlan, input.customExpiresAt);

    // 4. Determine Payment & Amount
    const isFree = input.paymentType === "FREE" || input.paymentType === "SCHOLARSHIP";
    const paymentStatus = isFree ? "FREE" : "MANUAL_PAID";
    const amountPaid = isFree ? 0 : Math.max(0, Math.round(input.amountPaid || 0));

    // 5. Total published lessons count for progress initialization
    const totalLessonsCount = course.sections.reduce(
      (acc, s) => acc + s.lessons.length,
      0
    );

    // 6. Upsert Enrollment
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: targetUserId,
          courseId: course.id
        }
      },
      include: {
        progress: true
      }
    });

    const grantMeta = {
      manualGrant: true,
      paymentType: input.paymentType,
      notes: input.notes?.trim() || null,
      grantedBy: session.user.email,
      durationPlan: input.durationPlan,
      grantedAt: new Date().toISOString()
    };

    let enrollmentId = "";

    if (existingEnrollment) {
      const updated = await prisma.enrollment.update({
        where: { id: existingEnrollment.id },
        data: {
          status: EnrollmentStatus.ACTIVE,
          paymentStatus,
          amountPaid: (existingEnrollment.amountPaid || 0) + amountPaid,
          expiresAt,
          updatedAt: new Date(),
          metadata: {
            ...(existingEnrollment.metadata as Record<string, any> || {}),
            lastManualGrant: grantMeta
          }
        }
      });
      enrollmentId = updated.id;

      // Ensure progress record exists
      if (!existingEnrollment.progress) {
        await prisma.courseProgress.create({
          data: {
            enrollmentId: updated.id,
            completedLessonsCount: 0,
            totalLessonsCount,
            progressPercent: 0
          }
        });
      }
    } else {
      const created = await prisma.enrollment.create({
        data: {
          userId: targetUserId,
          courseId: course.id,
          status: EnrollmentStatus.ACTIVE,
          paymentStatus,
          amountPaid,
          expiresAt,
          enrolledAt: new Date(),
          metadata: grantMeta,
          progress: {
            create: {
              completedLessonsCount: 0,
              totalLessonsCount,
              progressPercent: 0
            }
          }
        }
      });
      enrollmentId = created.id;
    }

    // 7. Revalidate paths
    revalidatePath("/admin/enrollments");
    revalidatePath("/admin/users");
    revalidatePath(`/admin/courses/${course.id}`);
    revalidatePath(`/courses/${course.slug}`);
    revalidatePath(`/courses/${course.slug}/learn`);
    revalidatePath("/student/courses");
    revalidatePath("/student/dashboard");

    return {
      success: true,
      enrollmentId,
      studentName: targetUserName,
      studentEmail: targetUserEmail,
      courseTitle: course.title,
      courseSlug: course.slug,
      durationPlan: input.durationPlan,
      expiresAt: expiresAt ? expiresAt.toISOString() : null,
      paymentType: input.paymentType,
      amountPaid,
      wasUserCreated,
      temporaryPassword
    };
  } catch (error: any) {
    console.error("adminGrantCourseAccessAction error:", error);
    return { success: false, error: error.message || "Failed to grant course access." };
  }
}

export async function adminExtendEnrollmentAction(
  enrollmentId: string,
  plan: "LIFETIME" | "30_DAYS" | "90_DAYS" | "180_DAYS" | "365_DAYS"
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      include: { course: true }
    });

    if (!enrollment) {
      return { success: false, error: "Enrollment not found." };
    }

    let newExpiresAt: Date | null = null;
    if (plan !== "LIFETIME") {
      const days = plan === "30_DAYS" ? 30 : plan === "90_DAYS" ? 90 : plan === "180_DAYS" ? 180 : 365;
      const currentExpiry = enrollment.expiresAt && new Date(enrollment.expiresAt).getTime() > Date.now()
        ? new Date(enrollment.expiresAt)
        : new Date();
      newExpiresAt = new Date(currentExpiry.getTime() + days * 24 * 60 * 60 * 1000);
    }

    await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        status: EnrollmentStatus.ACTIVE,
        expiresAt: newExpiresAt,
        updatedAt: new Date()
      }
    });

    revalidatePath("/admin/enrollments");
    revalidatePath(`/courses/${enrollment.course.slug}`);
    revalidatePath("/student/courses");

    return {
      success: true,
      newExpiresAt: newExpiresAt ? newExpiresAt.toISOString() : null
    };
  } catch (error: any) {
    console.error("adminExtendEnrollmentAction error:", error);
    return { success: false, error: error.message || "Failed to extend validity." };
  }
}

export async function adminRevokeEnrollmentAction(enrollmentId: string, reason?: string) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      include: { course: true }
    });

    if (!enrollment) {
      return { success: false, error: "Enrollment not found." };
    }

    await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        status: EnrollmentStatus.CANCELLED,
        updatedAt: new Date(),
        metadata: {
          ...(enrollment.metadata as Record<string, any> || {}),
          revokedAt: new Date().toISOString(),
          revokedBy: session.user.email,
          revocationReason: reason || "Manual cancellation by administrator"
        }
      }
    });

    revalidatePath("/admin/enrollments");
    revalidatePath(`/courses/${enrollment.course.slug}`);
    revalidatePath("/student/courses");

    return { success: true };
  } catch (error: any) {
    console.error("adminRevokeEnrollmentAction error:", error);
    return { success: false, error: error.message || "Failed to revoke access." };
  }
}
