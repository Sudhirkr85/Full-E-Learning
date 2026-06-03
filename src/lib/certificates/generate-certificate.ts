import { prisma } from "@/lib/prisma";

// A clean utility to generate a random 12-character uppercase alphanumeric string matching nanoid(12)
function generateRandomId(length = 12): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function generateCertificate(userId: string, courseId: string) {
  // 1. Fetch enrollment with user, course, teachers and existing certificate
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId
      }
    },
    include: {
      certificate: true,
      user: true,
      course: {
        include: {
          teachers: {
            include: {
              teacher: true
            }
          }
        }
      }
    }
  });

  if (!enrollment) {
    throw new Error(`Enrollment not found for userId: ${userId}, courseId: ${courseId}`);
  }

  // 2. Prevent duplicate generation
  if (enrollment.certificate) {
    return enrollment.certificate;
  }

  // 3. Gather Student, Course, and Instructor details
  const studentName = enrollment.user.name || 
    `${enrollment.user.firstName || ""} ${enrollment.user.lastName || ""}`.trim() || 
    enrollment.user.email.split("@")[0];

  const courseName = enrollment.course.title;

  const primaryTeacher = enrollment.course.teachers.find(t => t.isPrimary) || enrollment.course.teachers[0];
  const instructorName = primaryTeacher?.teacher.name || 
    `${primaryTeacher?.teacher.firstName || ""} ${primaryTeacher?.teacher.lastName || ""}`.trim() ||
    "Course Instructor";

  // 4. Generate unique ID matching user requested format: CERT-XXXXXXXXXXXX
  const uniqueId = `CERT-${generateRandomId(12)}`;

  // 5. Calculate average score (using helper if needed or defaults to null)
  // Let's import calculateCourseScore from actions if we want, or do a quick implementation here
  const tests = await prisma.test.findMany({
    where: {
      courseId,
      isPublished: true
    },
    select: {
      id: true
    }
  });

  let avgScore: number | null = null;
  if (tests.length > 0) {
    const testIds = tests.map((t) => t.id);
    const highestScores: number[] = [];

    for (const testId of testIds) {
      const highestAttempt = await prisma.attempt.findFirst({
        where: {
          testId,
          userId,
          status: "GRADED",
          scorePercent: { not: null }
        },
        orderBy: {
          scorePercent: "desc"
        },
        select: {
          scorePercent: true
        }
      });

      if (highestAttempt && highestAttempt.scorePercent !== null) {
        highestScores.push(highestAttempt.scorePercent);
      }
    }

    if (highestScores.length > 0) {
      const total = highestScores.reduce((acc, score) => acc + score, 0);
      avgScore = Math.round(total / highestScores.length);
    }
  }

  // 6. Create certificate record in DB
  const certificate = await prisma.certificate.create({
    data: {
      enrollmentId: enrollment.id,
      verificationCode: uniqueId,
      scorePercent: avgScore,
      issuedAt: new Date(),
      metadata: {
        studentName,
        courseName,
        instructorName,
        courseSlug: enrollment.course.slug,
        issuedToId: userId
      }
    }
  });

  return certificate;
}
