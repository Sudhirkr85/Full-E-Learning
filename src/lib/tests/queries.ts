import { prisma } from "@/lib/prisma";
import { AttemptStatus, UserRole } from "@prisma/client";

// Central helper to assert teacher course ownership
async function assertTeacherCourseAccess(courseId: string, teacherId: string) {
  const assignment = await prisma.courseTeacher.findFirst({
    where: {
      courseId,
      teacherId,
    },
  });
  return Boolean(assignment);
}

// Fetch all tests in a course for a teacher
export async function getTeacherTests(courseId: string, teacherId: string) {
  const hasAccess = await assertTeacherCourseAccess(courseId, teacherId);
  if (!hasAccess) return null;

  return prisma.test.findMany({
    where: { courseId },
    orderBy: { createdAt: "desc" },
    include: {
      section: {
        select: {
          id: true,
          title: true,
        },
      },
      _count: {
        select: {
          questions: true,
          attempts: true,
        },
      },
    },
  });
}

// Fetch test with full details (for teacher editing)
export async function getTeacherTestEditor(testId: string, teacherId: string) {
  const test = await prisma.test.findUnique({
    where: { id: testId },
    include: {
      questions: {
        orderBy: { orderIndex: "asc" },
        include: {
          options: {
            orderBy: { orderIndex: "asc" },
          },
        },
      },
    },
  });

  if (!test) return null;

  const hasAccess = await assertTeacherCourseAccess(test.courseId, teacherId);
  if (!hasAccess) return null;

  return test;
}

// Fetch test details for student overview (without questions/answers)
export async function getStudentTestOverview(courseSlug: string, testSlug: string, userId?: string | null) {
  const test = await prisma.test.findFirst({
    where: {
      slug: testSlug,
      course: {
        slug: courseSlug,
      },
    },
    include: {
      course: {
        select: {
          id: true,
          slug: true,
          title: true,
        },
      },
      section: {
        select: {
          id: true,
          slug: true,
          title: true,
        },
      },
      _count: {
        select: {
          questions: true,
        },
      },
    },
  });

  if (!test) return null;

  // If student userId is provided, find enrollment and attempts
  let enrollment = null;
  let attempts: any[] = [];

  if (userId) {
    enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: test.courseId,
        },
      },
    });

    attempts = await prisma.attempt.findMany({
      where: {
        testId: test.id,
        userId,
      },
      orderBy: { attemptNumber: "desc" },
    });
  }

  return {
    test,
    enrollment,
    attempts,
    isEnrolled: enrollment ? enrollment.status === "ACTIVE" || enrollment.status === "COMPLETED" : false,
  };
}

// SECURE BUNDLE: Fetch active test taking session.
// NEVER leak isCorrect field or explanation fields in this query!
export async function getStudentTestTakingBundle(courseSlug: string, testSlug: string, attemptId: string, userId: string) {
  const attempt = await prisma.attempt.findFirst({
    where: {
      id: attemptId,
      userId,
      status: AttemptStatus.IN_PROGRESS,
      test: {
        slug: testSlug,
        course: {
          slug: courseSlug,
        },
      },
    },
    include: {
      test: {
        select: {
          id: true,
          title: true,
          slug: true,
          timeLimitMinutes: true,
          shuffleQuestions: true,
          course: {
            select: {
              slug: true,
              title: true,
            },
          },
        },
      },
    },
  });

  if (!attempt) return null;

  // Fetch questions securely without showing correctness criteria!
  const questions = await prisma.question.findMany({
    where: { testId: attempt.testId },
    orderBy: { orderIndex: "asc" },
    select: {
      id: true,
      prompt: true,
      kind: true,
      points: true,
      options: {
        orderBy: { orderIndex: "asc" },
        select: {
          id: true,
          label: true,
          orderIndex: true,
        },
      },
    },
  });

  // If shuffleQuestions is true, shuffle the questions in-memory
  let quizQuestions = [...questions];
  if (attempt.test.shuffleQuestions) {
    quizQuestions.sort(() => Math.random() - 0.5);
  }

  return {
    attempt,
    questions: quizQuestions,
  };
}

// Fetch detailed graded attempt review for students
export async function getStudentAttemptReview(attemptId: string, userId: string) {
  const attempt = await prisma.attempt.findUnique({
    where: { id: attemptId },
    include: {
      test: {
        select: {
          id: true,
          title: true,
          slug: true,
          passingScore: true,
          course: {
            select: {
              id: true,
              slug: true,
              title: true,
            },
          },
        },
      },
      answers: {
        include: {
          question: {
            include: {
              options: {
                orderBy: { orderIndex: "asc" },
              },
            },
          },
        },
      },
    },
  });

  if (!attempt) return null;

  // Security check: must belong to the user, OR user is staff
  if (attempt.userId !== userId) {
    const isStaff = await prisma.courseTeacher.findFirst({
      where: {
        courseId: attempt.test.course.id,
        teacherId: userId,
      },
    });
    const isAdmin = await prisma.user.findFirst({
      where: { id: userId, role: UserRole.ADMIN },
    });

    if (!isStaff && !isAdmin) {
      return null;
    }
  }

  // Map the attempt answers for easy rendering
  const gradedQuestions = await prisma.question.findMany({
    where: { testId: attempt.testId },
    orderBy: { orderIndex: "asc" },
    include: {
      options: {
        orderBy: { orderIndex: "asc" },
      },
      answers: {
        where: { attemptId: attempt.id },
      },
    },
  });

  return {
    attempt,
    questions: gradedQuestions,
  };
}
