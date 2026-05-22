import { prisma } from "@/lib/prisma";
import { EnrollmentStatus } from "@prisma/client";

/**
 * Calculates the average test score for a student's course enrollment.
 * For each published test in the course, we take the highest graded attempt score
 * and compute the average of those high scores across all tests.
 */
async function calculateCourseScore(userId: string, courseId: string): Promise<number | null> {
  const tests = await prisma.test.findMany({
    where: {
      courseId,
      isPublished: true,
    },
    select: {
      id: true,
    },
  });

  if (tests.length === 0) return null;

  const testIds = tests.map((t) => t.id);
  const highestScores: number[] = [];

  for (const testId of testIds) {
    const highestAttempt = await prisma.attempt.findFirst({
      where: {
        testId,
        userId,
        status: "GRADED",
        scorePercent: { not: null },
      },
      orderBy: {
        scorePercent: "desc",
      },
      select: {
        scorePercent: true,
      },
    });

    if (highestAttempt && highestAttempt.scorePercent !== null) {
      highestScores.push(highestAttempt.scorePercent);
    }
  }

  if (highestScores.length === 0) return null;

  const total = highestScores.reduce((acc, score) => acc + score, 0);
  return Math.round(total / highestScores.length);
}

/**
 * Issues a certificate for a completed enrollment.
 * Safe and idempotent.
 */
export async function issueCertificateAction(enrollmentId: string) {
  try {
    // 1. Fetch enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        course: true,
        progress: true,
        certificate: true,
      },
    });

    if (!enrollment) {
      throw new Error("Enrollment not found.");
    }

    // 2. Prevent duplicate issuance
    if (enrollment.certificate) {
      return {
        success: true,
        certificate: enrollment.certificate,
        message: "Certificate already issued.",
      };
    }

    // 3. Verify completion rule
    const progressPercent = enrollment.progress?.progressPercent ?? 0;
    if (progressPercent < 100) {
      throw new Error("Course must be 100% completed to issue a certificate.");
    }

    // 4. Calculate average score
    const avgScore = await calculateCourseScore(enrollment.userId, enrollment.courseId);

    // 5. Generate unique verification code
    const year = new Date().getFullYear();
    const randomHex = Math.random().toString(16).substring(2, 10).toUpperCase().padEnd(8, "F");
    const verificationCode = `CERT-${year}-${randomHex}`;

    // 6. Create certificate
    const certificate = await prisma.certificate.create({
      data: {
        enrollmentId: enrollment.id,
        verificationCode,
        scorePercent: avgScore,
        metadata: {
          courseTitle: enrollment.course.title,
          courseSlug: enrollment.course.slug,
          issuedToId: enrollment.userId,
        },
      },
    });

    // Write audit log
    await prisma.auditLog.create({
      data: {
        userId: enrollment.userId,
        action: "CREATE",
        entityType: "Certificate",
        entityId: certificate.id,
        afterState: JSON.parse(JSON.stringify(certificate)),
        metadata: {
          reason: "Automated course completion certificate issuance",
        },
      },
    });

    return {
      success: true,
      certificate,
      message: "Certificate issued successfully.",
    };
  } catch (err: any) {
    console.error("[ISSUE_CERTIFICATE_ERROR]", err);
    return {
      success: false,
      error: err.message ?? "Failed to issue certificate.",
    };
  }
}

/**
 * Fetches a certificate by enrollment ID.
 */
export async function getCertificateAction(enrollmentId: string) {
  try {
    const certificate = await prisma.certificate.findUnique({
      where: { enrollmentId },
      include: {
        enrollment: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            course: {
              select: {
                id: true,
                title: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    return {
      success: true,
      certificate,
    };
  } catch (err: any) {
    console.error("[GET_CERTIFICATE_ERROR]", err);
    return {
      success: false,
      error: err.message ?? "Failed to retrieve certificate.",
    };
  }
}

/**
 * Verifies a certificate publicly using its verification code.
 */
export async function verifyCertificateAction(verificationCode: string) {
  try {
    const certificate = await prisma.certificate.findUnique({
      where: { verificationCode },
      include: {
        enrollment: {
          include: {
            user: {
              select: {
                name: true,
                firstName: true,
                lastName: true,
              },
            },
            course: {
              select: {
                title: true,
                slug: true,
                durationMinutes: true,
              },
            },
          },
        },
      },
    });

    if (!certificate) {
      return {
        success: false,
        error: "Certificate code is invalid or not registered in our records.",
      };
    }

    return {
      success: true,
      certificate,
    };
  } catch (err: any) {
    console.error("[VERIFY_CERTIFICATE_ERROR]", err);
    return {
      success: false,
      error: err.message ?? "Failed to verify certificate.",
    };
  }
}
