"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AttemptStatus, QuestionType, TestType, UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { testSettingsSchema } from "./schemas";
import { slugify } from "@/lib/courses/slug";
import { syncCourseProgress } from "@/lib/courses/actions";

function redirectWithError(path: string, error: string) {
  redirect(`${path}?error=${error}`);
}

async function requireTeacher() {
  return requireRole([UserRole.TEACHER, UserRole.ADMIN]);
}

async function assertTeacherCourseAccess(courseId: string, teacherId: string) {
  const teacher = await prisma.courseTeacher.findFirst({
    where: { courseId, teacherId },
  });
  if (!teacher) {
    const admin = await prisma.user.findFirst({
      where: { id: teacherId, role: UserRole.ADMIN },
    });
    if (!admin) {
      throw new Error("Unauthorized access to this course.");
    }
  }
}

// ----------------------------------------------------
// TEACHER ACTIONS
// ----------------------------------------------------

export async function createTestAction(formData: FormData) {
  const teacher = await requireTeacher();
  const courseId = formData.get("courseId") as string;
  const sectionId = formData.get("sectionId") as string || null;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string || null;
  const typeStr = formData.get("type") as string || "QUIZ";

  if (!courseId || !title) {
    redirectWithError(`/teacher/courses`, "missing_fields");
  }

  await assertTeacherCourseAccess(courseId, teacher.id);

  // Generate unique slug
  let slugBase = slugify(title);
  let slug = slugBase;
  let counter = 1;
  while (true) {
    const existing = await prisma.test.findUnique({
      where: {
        courseId_slug: {
          courseId,
          slug,
        },
      },
    });
    if (!existing) break;
    slug = `${slugBase}-${counter}`;
    counter++;
  }

  const test = await prisma.test.create({
    data: {
      courseId,
      sectionId,
      title,
      slug,
      description,
      type: typeStr as TestType,
      passingScore: 70,
      isPublished: false,
    },
  });



  revalidatePath(`/teacher/courses/${courseId}/sections`);
  revalidatePath(`/teacher/courses/${courseId}/tests`);
  redirect(`/teacher/courses/${courseId}/tests/${test.id}?created=1`);
}

export async function updateTestSettingsAction(testId: string, data: any) {
  const teacher = await requireTeacher();
  const test = await prisma.test.findUnique({ where: { id: testId } });
  if (!test) throw new Error("Test not found");

  await assertTeacherCourseAccess(test.courseId, teacher.id);

  const parsed = testSettingsSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message ?? "Invalid settings");
  }

  const payload = parsed.data;

  // Re-generate slug if title changed
  let slug = test.slug;
  if (payload.title !== test.title) {
    let slugBase = slugify(payload.title);
    slug = slugBase;
    let counter = 1;
    while (true) {
      const existing = await prisma.test.findFirst({
        where: {
          courseId: test.courseId,
          slug,
          NOT: { id: test.id },
        },
      });
      if (!existing) break;
      slug = `${slugBase}-${counter}`;
      counter++;
    }
  }

  const updatedTest = await prisma.test.update({
    where: { id: test.id },
    data: {
      title: payload.title,
      slug,
      description: payload.description,
      type: payload.type,
      passingScore: payload.passingScore,
      timeLimitMinutes: payload.timeLimitMinutes,
      attemptLimit: payload.attemptLimit,
      shuffleQuestions: payload.shuffleQuestions,
      isPublished: payload.isPublished,
      sectionId: payload.sectionId || null,
    },
  });



  revalidatePath(`/teacher/courses/${test.courseId}/tests/${test.id}`);
  revalidatePath(`/teacher/courses/${test.courseId}/sections`);
  return { success: true };
}

export async function deleteTestAction(formData: FormData) {
  const teacher = await requireTeacher();
  const testId = formData.get("testId") as string;

  const test = await prisma.test.findUnique({ where: { id: testId } });
  if (!test) redirectWithError("/teacher/courses", "test_not_found");

  await assertTeacherCourseAccess(test!.courseId, teacher.id);



  await prisma.test.delete({ where: { id: testId } });

  revalidatePath(`/teacher/courses/${test!.courseId}/sections`);
  revalidatePath(`/teacher/courses/${test!.courseId}/tests`);
  redirect(`/teacher/courses/${test!.courseId}/sections?deleted=1`);
}

export async function upsertQuestionAction(
  testId: string,
  questionId: string | null,
  data: {
    prompt: string;
    explanation?: string | null;
    kind: QuestionType;
    points: number;
    orderIndex: number;
    options: Array<{
      id?: string;
      label: string;
      value?: string | null;
      isCorrect: boolean;
      orderIndex: number;
      explanation?: string | null;
    }>;
  }
) {
  const teacher = await requireTeacher();
  const test = await prisma.test.findUnique({ where: { id: testId } });
  if (!test) throw new Error("Test not found");

  await assertTeacherCourseAccess(test.courseId, teacher.id);

  if (questionId) {
    // Update existing question
    await prisma.$transaction(async (tx) => {
      // Update question core details
      await tx.question.update({
        where: { id: questionId },
        data: {
          prompt: data.prompt,
          explanation: data.explanation || null,
          kind: data.kind,
          points: data.points,
          orderIndex: data.orderIndex,
        },
      });

      // Fetch current options
      const currentOptions = await tx.option.findMany({
        where: { questionId },
        select: { id: true },
      });

      const inputOptionIds = data.options.map((opt) => opt.id).filter(Boolean) as string[];
      const deletedOptionIds = currentOptions
        .map((opt) => opt.id)
        .filter((id) => !inputOptionIds.includes(id));

      // Delete removed options
      if (deletedOptionIds.length > 0) {
        await tx.option.deleteMany({
          where: { id: { in: deletedOptionIds } },
        });
      }

      // Upsert options
      for (const opt of data.options) {
        if (opt.id) {
          await tx.option.update({
            where: { id: opt.id },
            data: {
              label: opt.label,
              value: opt.value || null,
              isCorrect: opt.isCorrect,
              orderIndex: opt.orderIndex,
              explanation: opt.explanation || null,
            },
          });
        } else {
          await tx.option.create({
            data: {
              questionId,
              label: opt.label,
              value: opt.value || null,
              isCorrect: opt.isCorrect,
              orderIndex: opt.orderIndex,
              explanation: opt.explanation || null,
            },
          });
        }
      }
    });
  } else {
    // Create new question
    await prisma.$transaction(async (tx) => {
      const question = await tx.question.create({
        data: {
          testId,
          prompt: data.prompt,
          explanation: data.explanation || null,
          kind: data.kind,
          points: data.points,
          orderIndex: data.orderIndex,
        },
      });

      for (const opt of data.options) {
        await tx.option.create({
          data: {
            questionId: question.id,
            label: opt.label,
            value: opt.value || null,
            isCorrect: opt.isCorrect,
            orderIndex: opt.orderIndex,
            explanation: opt.explanation || null,
          },
        });
      }
    });
  }

  revalidatePath(`/teacher/courses/${test.courseId}/tests/${test.id}`);
  return { success: true };
}

export async function deleteQuestionAction(testId: string, questionId: string) {
  const teacher = await requireTeacher();
  const test = await prisma.test.findUnique({ where: { id: testId } });
  if (!test) throw new Error("Test not found");

  await assertTeacherCourseAccess(test.courseId, teacher.id);

  await prisma.question.delete({ where: { id: questionId } });

  revalidatePath(`/teacher/courses/${test.courseId}/tests/${test.id}`);
  return { success: true };
}

// ----------------------------------------------------
// STUDENT ACTIONS (TAKING & GRADING)
// ----------------------------------------------------

export async function startAttemptAction(courseId: string, testId: string) {
  const student = await requireRole([UserRole.STUDENT]);

  // Check enrollment
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: student.id,
        courseId,
      },
    },
  });

  if (!enrollment || (enrollment.status !== "ACTIVE" && enrollment.status !== "COMPLETED")) {
    throw new Error("You must be actively enrolled in the course to take this test.");
  }

  const test = await prisma.test.findUnique({
    where: { id: testId },
    include: {
      course: {
        select: { slug: true },
      },
    },
  });

  if (!test || !test.isPublished) {
    throw new Error("This test is currently unavailable.");
  }

  // Check attempt limits
  const attemptsCount = await prisma.attempt.count({
    where: {
      testId,
      userId: student.id,
    },
  });

  if (test.attemptLimit && attemptsCount >= test.attemptLimit) {
    throw new Error(`You have reached the maximum attempt limit of ${test.attemptLimit} for this test.`);
  }

  // Check if there is an active in-progress attempt, reuse if exists
  const activeAttempt = await prisma.attempt.findFirst({
    where: {
      testId,
      userId: student.id,
      status: AttemptStatus.IN_PROGRESS,
    },
  });

  if (activeAttempt) {
    redirect(`/courses/${test.course.slug}/tests/${test.slug}?attemptId=${activeAttempt.id}`);
  }

  // Create new attempt
  const attempt = await prisma.attempt.create({
    data: {
      testId,
      userId: student.id,
      enrollmentId: enrollment.id,
      status: AttemptStatus.IN_PROGRESS,
      attemptNumber: attemptsCount + 1,
      startedAt: new Date(),
    },
  });

  redirect(`/courses/${test.course.slug}/tests/${test.slug}?attemptId=${attempt.id}`);
}

export async function submitAttemptAction(
  attemptId: string,
  submission: Array<{
    questionId: string;
    selectedOptionId?: string | null;
    selectedOptionIds?: string[] | null; // For MULTIPLE_CHOICE
    answerText?: string | null;
  }>
) {
  const student = await requireRole([UserRole.STUDENT]);

  const attempt = await prisma.attempt.findUnique({
    where: { id: attemptId },
    include: {
      test: {
        include: {
          questions: {
            include: {
              options: true,
            },
          },
          course: {
            select: { slug: true },
          },
        },
      },
    },
  });

  if (!attempt || attempt.userId !== student.id || attempt.status !== AttemptStatus.IN_PROGRESS) {
    throw new Error("Active test attempt session not found.");
  }

  const now = new Date();
  let correctAnswersCount = 0;
  const totalQuestionsCount = attempt.test.questions.length;

  await prisma.$transaction(async (tx) => {
    // Delete any draft answers just in case
    await tx.attemptAnswer.deleteMany({
      where: { attemptId },
    });

    for (const question of attempt.test.questions) {
      const ans = submission.find((item) => item.questionId === question.id);
      let isCorrect = false;

      if (question.kind === QuestionType.SINGLE_CHOICE || question.kind === QuestionType.TRUE_FALSE) {
        const correctOption = question.options.find((opt) => opt.isCorrect);
        isCorrect = Boolean(ans && ans.selectedOptionId === correctOption?.id);

        await tx.attemptAnswer.create({
          data: {
            attemptId,
            questionId: question.id,
            selectedOptionId: ans?.selectedOptionId || null,
            isCorrect,
            gradedAt: now,
          },
        });
      } else if (question.kind === QuestionType.MULTIPLE_CHOICE) {
        // Collect all correct option IDs
        const correctOptionIds = question.options
          .filter((opt) => opt.isCorrect)
          .map((opt) => opt.id)
          .sort();

        const studentOptionIds = (ans?.selectedOptionIds || []).sort();

        // Compare array contents
        isCorrect =
          correctOptionIds.length === studentOptionIds.length &&
          correctOptionIds.every((val, idx) => val === studentOptionIds[idx]);

        await tx.attemptAnswer.create({
          data: {
            attemptId,
            questionId: question.id,
            isCorrect,
            gradedAt: now,
            metadata: {
              selectedOptionIds: studentOptionIds,
            },
          },
        });
      } else if (question.kind === QuestionType.SHORT_ANSWER) {
        const isCaseSensitive = (question.metadata as any)?.caseSensitive === true;
        const studentAns = (ans?.answerText || "").trim();
        const correctOptions = question.options.filter((opt) => opt.isCorrect);

        isCorrect = correctOptions.some((opt) => {
          const acceptedVal = (opt.value || opt.label || "").trim();
          return isCaseSensitive 
            ? acceptedVal === studentAns 
            : acceptedVal.toLowerCase() === studentAns.toLowerCase();
        });

        await tx.attemptAnswer.create({
          data: {
            attemptId,
            questionId: question.id,
            answerText: ans?.answerText || null,
            isCorrect,
            gradedAt: now,
          },
        });
      }

      if (isCorrect) {
        correctAnswersCount++;
      }
    }

    const scorePercent = totalQuestionsCount > 0
      ? Math.round((correctAnswersCount / totalQuestionsCount) * 100)
      : 0;

    const timeSpentSeconds = Math.round(
      (now.getTime() - attempt.startedAt.getTime()) / 1000
    );

    // Update Attempt results
    await tx.attempt.update({
      where: { id: attemptId },
      data: {
        status: AttemptStatus.GRADED,
        submittedAt: now,
        gradedAt: now,
        scorePercent,
        correctAnswersCount,
        totalQuestionsCount,
        timeSpentSeconds,
      },
    });
  });

  revalidatePath(`/courses/${attempt.test.course.slug}/tests/${attempt.test.slug}`);
  return { success: true };
}

export async function startClassroomAttemptAction(courseId: string, testId: string, lessonSlug: string, originPath?: string) {
  const student = await requireRole([UserRole.STUDENT, UserRole.ADMIN, UserRole.TEACHER]);

  // Check enrollment (bypassed for ADMIN/TEACHER or FREE preview lessons)
  const isStaff = student.role === "ADMIN" || student.role === "TEACHER";
  
  const lesson = await prisma.lesson.findFirst({
    where: { slug: lessonSlug }
  });
  const isPreview = lesson?.isPreview === true;

  let enrollment = null;
  if (!isStaff && !isPreview) {
    enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: student.id,
          courseId,
        },
      },
    });

    if (!enrollment || (enrollment.status !== "ACTIVE" && enrollment.status !== "COMPLETED")) {
      throw new Error("You must be actively enrolled in the course to take this test.");
    }
  } else {
    // Fetch enrollment if they have one (e.g. staff or preview users who happen to be enrolled)
    enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: student.id,
          courseId,
        },
      },
    });
  }

  const test = await prisma.test.findUnique({
    where: { id: testId },
    include: {
      course: {
        select: { slug: true },
      },
    },
  });

  if (!test || !test.isPublished) {
    throw new Error("This quiz is currently unavailable.");
  }

  // Check attempt limits
  const attemptsCount = await prisma.attempt.count({
    where: {
      testId,
      userId: student.id,
    },
  });

  if (test.attemptLimit && attemptsCount >= test.attemptLimit) {
    throw new Error(`You have reached the maximum attempt limit of ${test.attemptLimit} for this test.`);
  }

  // Check if there is an active in-progress attempt, reuse if exists
  const activeAttempt = await prisma.attempt.findFirst({
    where: {
      testId,
      userId: student.id,
      status: AttemptStatus.IN_PROGRESS,
    },
  });

  if (activeAttempt) {
    if (originPath) {
      redirect(`${originPath}?attemptId=${activeAttempt.id}`);
    }
    redirect(`/courses/${test.course.slug}/learn?lesson=${lessonSlug}&attemptId=${activeAttempt.id}`);
  }

  // Create new attempt
  const attempt = await prisma.attempt.create({
    data: {
      testId,
      userId: student.id,
      enrollmentId: enrollment?.id || null,
      status: AttemptStatus.IN_PROGRESS,
      attemptNumber: attemptsCount + 1,
      startedAt: new Date(),
    },
  });

  if (originPath) {
    redirect(`${originPath}?attemptId=${attempt.id}`);
  }
  redirect(`/courses/${test.course.slug}/learn?lesson=${lessonSlug}&attemptId=${attempt.id}`);
}

export async function resetStudentAttemptsAction(courseId: string, testId: string, userId: string) {
  const staff = await requireRole([UserRole.TEACHER, UserRole.ADMIN]);

  // Assert access
  if (staff.role !== UserRole.ADMIN) {
    await assertTeacherCourseAccess(courseId, staff.id);
  }

  // Delete all attempts for this user and test
  await prisma.attempt.deleteMany({
    where: {
      testId,
      userId,
    },
  });

  // Also remove related lesson completion progress if it exists to allow proper completion flow tracking
  const lesson = await prisma.lesson.findFirst({
    where: {
      metadata: {
        path: ["testId"],
        equals: testId,
      },
    },
  });

  if (lesson) {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (enrollment) {
      await prisma.lessonProgress.deleteMany({
        where: {
          enrollmentId: enrollment.id,
          lessonId: lesson.id,
        },
      });

      // Recalculate progress
      await syncCourseProgress(enrollment.id, courseId, null);
    }
  }

  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath(`/teacher/courses/${courseId}`);
  return { success: true };
}

