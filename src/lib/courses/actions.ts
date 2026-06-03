"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AssetProvider, CourseStatus, EnrollmentStatus, UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { reserveUniqueSlug, slugify } from "./slug";
import { z } from "zod";
import { isActiveEnrollmentStatus } from "./access";
import {
  categoryAttachSchema,
  categoryDeleteSchema,
  categoryFormSchema,
  courseCoreSchema,
  courseDeleteSchema,
  courseStatusFormSchema,
  courseTeacherFormSchema,
  lessonFormSchema,
  resourceFormSchema,
  sectionFormSchema
} from "./schemas";

type TeacherUser = Awaited<ReturnType<typeof requireRole>>;

function parseDelimitedList(value?: string) {
  return (value ?? "")
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function redirectWithError(path: string, error: string) {
  redirect(`${path}?error=${error}`);
}

function revalidateCoursePaths(courseSlug?: string, courseId?: string) {
  revalidatePath("/courses");
  revalidatePath("/teacher/courses");

  if (courseSlug) {
    revalidatePath(`/courses/${courseSlug}`);
  }

  if (courseId) {
    revalidatePath(`/teacher/courses/${courseId}`);
  }
}

async function requireTeacher() {
  return requireRole([UserRole.TEACHER, UserRole.ADMIN]);
}

async function assertCourseAccess(courseId: string, teacherId: string) {
  const user = await prisma.user.findUnique({
    where: { id: teacherId },
    select: { role: true }
  });

  const course = await prisma.course.findFirst({
    where: {
      id: courseId,
      ...(user?.role === "ADMIN"
        ? {}
        : {
            teachers: {
              some: {
                teacherId
              }
            }
          })
    },
    include: {
      teachers: true,
      categories: true
    }
  });

  if (!course) {
    redirectWithError("/teacher/courses", "not_found");
  }

  return course!;
}

async function resolveCategoryIds(categoryNames?: string[]) {
  const names = categoryNames ?? [];
  const categoryIds: string[] = [];

  for (const name of names) {
    const slug = slugify(name);
    const category =
      (await prisma.category.findUnique({ where: { slug } })) ??
      (await prisma.category.create({ data: { name, slug } }));

    categoryIds.push(category.id);
  }

  return categoryIds;
}

async function reserveCourseSlug(title: string, courseId?: string) {
  return reserveUniqueSlug(
    title,
    async (candidate) => {
      const course = await prisma.course.findUnique({
        where: { slug: candidate },
        select: { id: true }
      });

      return Boolean(course && course.id !== courseId);
    },
    undefined
  );
}

async function reserveScopedSlug(
  baseValue: string,
  exists: (slug: string) => Promise<boolean>,
  currentSlug?: string
) {
  return reserveUniqueSlug(baseValue, exists, currentSlug);
}

async function nextSectionOrder(courseId: string) {
  const aggregate = await prisma.courseSection.aggregate({
    where: { courseId },
    _max: { orderIndex: true }
  });

  return (aggregate._max.orderIndex ?? -1) + 1;
}

async function nextLessonOrder(sectionId: string) {
  const aggregate = await prisma.lesson.aggregate({
    where: { sectionId },
    _max: { orderIndex: true }
  });

  return (aggregate._max.orderIndex ?? -1) + 1;
}

async function nextResourceOrder(lessonId: string) {
  const aggregate = await prisma.lessonResource.aggregate({
    where: { lessonId },
    _max: { orderIndex: true }
  });

  return (aggregate._max.orderIndex ?? -1) + 1;
}

async function assertSectionAccess(sectionId: string, teacherId: string) {
  const section = await prisma.courseSection.findFirst({
    where: {
      id: sectionId,
      course: {
        teachers: {
          some: {
            teacherId
          }
        }
      }
    },
    include: {
      course: true
    }
  });

  if (!section) {
    redirectWithError("/teacher/courses", "section_not_found");
  }

  return section!;
}

async function assertLessonAccess(lessonId: string, teacherId: string) {
  const lesson = await prisma.lesson.findFirst({
    where: {
      id: lessonId,
      section: {
        course: {
          teachers: {
            some: {
              teacherId
            }
          }
        }
      }
    },
    include: {
      section: {
        include: {
          course: true
        }
      }
    }
  });

  if (!lesson) {
    redirectWithError("/teacher/courses", "lesson_not_found");
  }

  return lesson!;
}

async function invalidateCourse(courseSlug: string, courseId?: string) {
  revalidateCoursePaths(courseSlug, courseId);
}

function getFirstPublishedLesson(course: {
  sections: Array<{
    lessons: Array<{
      slug: string;
    }>;
  }>;
}) {
  for (const section of course.sections) {
    if (section.lessons.length) {
      return section.lessons[0] ?? null;
    }
  }

  return null;
}

async function syncCourseProgress(enrollmentId: string, courseId: string, lessonId?: string | null) {
  const totalLessonsCount = await prisma.lesson.count({
    where: {
      section: {
        courseId
      },
      isPublished: true
    }
  });

  const completedLessonsCount = await prisma.lessonProgress.count({
    where: {
      enrollmentId,
      isCompleted: true,
      lesson: {
        section: {
          courseId
        }
      }
    }
  });

  const progressPercent = totalLessonsCount > 0 ? Math.round((completedLessonsCount / totalLessonsCount) * 100) : 0;
  const now = new Date();

  await prisma.courseProgress.upsert({
    where: { enrollmentId },
    create: {
      enrollmentId,
      lastLessonId: lessonId ?? null,
      completedLessonsCount,
      totalLessonsCount,
      progressPercent,
      lastAccessedAt: now,
      completedAt: progressPercent === 100 && totalLessonsCount > 0 ? now : null
    },
    update: {
      lastLessonId: lessonId ?? null,
      completedLessonsCount,
      totalLessonsCount,
      progressPercent,
      lastAccessedAt: now,
      completedAt: progressPercent === 100 && totalLessonsCount > 0 ? now : null
    }
  });

  await prisma.enrollment.update({
    where: { id: enrollmentId },
    data: {
      lastAccessedAt: now,
      status: progressPercent === 100 && totalLessonsCount > 0 ? EnrollmentStatus.COMPLETED : EnrollmentStatus.ACTIVE,
      completedAt: progressPercent === 100 && totalLessonsCount > 0 ? now : null
    }
  });

  // Auto-issue Certificate on completion
  if (progressPercent === 100 && totalLessonsCount > 0) {
    try {
      const { issueCertificateAction } = await import("@/lib/certificates/actions");
      await issueCertificateAction(enrollmentId);
    } catch (certErr) {
      console.error("[AUTO_CERTIFICATE_ISSUANCE_FAILED]", certErr);
    }
  }
}

async function getEnrollmentCourse(courseId: string) {
  return prisma.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
      slug: true,
      status: true,
      sections: {
        where: { isPublished: true },
        orderBy: { orderIndex: "asc" },
        select: {
          id: true,
          lessons: {
            where: { isPublished: true },
            orderBy: { orderIndex: "asc" },
            select: {
              id: true,
              slug: true
            }
          }
        }
      }
    }
  });
}

export async function enrollInCourseAction(formData: FormData) {
  const student = await requireRole([UserRole.STUDENT]);
  const parsed = z.object({ courseId: z.string().uuid() }).safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    redirectWithError("/student/courses", "invalid_enrollment");
  }

  const data = parsed.data!;
  const course = await getEnrollmentCourse(data.courseId);

  if (!course || course.status !== CourseStatus.PUBLISHED) {
    redirectWithError("/courses", "course_unavailable");
  }

  const selectedCourse = course!;

  const existingEnrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: student.id,
        courseId: selectedCourse.id
      }
    },
    select: {
      id: true,
      status: true
    }
  });

  let enrollmentId = existingEnrollment?.id;

  if (!existingEnrollment) {
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: student.id,
        courseId: selectedCourse.id,
        status: EnrollmentStatus.ACTIVE,
        lastAccessedAt: new Date()
      },
      select: {
        id: true
      }
    });

    enrollmentId = enrollment.id;

    await prisma.courseProgress.create({
      data: {
        enrollmentId: enrollment.id,
        totalLessonsCount: selectedCourse.sections.reduce((count, section) => count + section.lessons.length, 0)
      }
    });
  } else if (!isActiveEnrollmentStatus(existingEnrollment.status)) {
    await prisma.enrollment.update({
      where: { id: existingEnrollment.id },
      data: {
        status: EnrollmentStatus.ACTIVE,
        completedAt: null,
        lastAccessedAt: new Date()
      }
    });
  }

  const firstLesson = getFirstPublishedLesson(selectedCourse);

  revalidatePath(`/courses/${selectedCourse.slug}`);
  revalidatePath("/student/dashboard");
  revalidatePath("/student/courses");

  if (enrollmentId && firstLesson) {
    redirect(`/courses/${selectedCourse.slug}/lessons/${firstLesson.slug}`);
  }

  redirect("/student/courses?enrolled=1");
}

export async function toggleLessonCompletionAction(formData: FormData) {
  const student = await requireRole([UserRole.STUDENT]);
  const parsed = z
    .object({
      courseId: z.string().uuid(),
      lessonId: z.string().uuid(),
      completed: z.coerce.boolean()
    })
    .safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    redirectWithError("/student/courses", "invalid_progress");
  }

  const data = parsed.data!;
  const course = await prisma.course.findUnique({
    where: { id: data.courseId },
    select: {
      id: true,
      slug: true
    }
  });

  if (!course) {
    redirectWithError("/student/courses", "course_not_found");
  }

  const selectedCourse = course!;

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: student.id,
        courseId: selectedCourse.id
      }
    },
    select: {
      id: true,
      status: true
    }
  });

  if (!enrollment || !isActiveEnrollmentStatus(enrollment.status)) {
    redirectWithError(`/courses/${selectedCourse.slug}`, "enrollment_required");
  }

  const selectedEnrollment = enrollment!;

  const lesson = await prisma.lesson.findFirst({
    where: {
      id: data.lessonId,
      section: {
        courseId: selectedCourse.id
      }
    },
    select: {
      id: true,
      slug: true,
      isPublished: true
    }
  });

  if (!lesson || !lesson.isPublished) {
    redirectWithError(`/courses/${selectedCourse.slug}`, "lesson_not_found");
  }

  const selectedLesson = lesson!;

  const now = new Date();

  await prisma.lessonProgress.upsert({
    where: {
      enrollmentId_lessonId: {
        enrollmentId: selectedEnrollment.id,
        lessonId: selectedLesson.id
      }
    },
    create: {
      enrollmentId: selectedEnrollment.id,
      lessonId: selectedLesson.id,
      isCompleted: data.completed,
      completedAt: data.completed ? now : null,
      lastViewedAt: now
    },
    update: {
      isCompleted: data.completed,
      completedAt: data.completed ? now : null,
      lastViewedAt: now
    }
  });

  await syncCourseProgress(selectedEnrollment.id, selectedCourse.id, selectedLesson.id);

  if (!data.completed) {
    await prisma.enrollment.update({
      where: { id: selectedEnrollment.id },
      data: {
        status: EnrollmentStatus.ACTIVE,
        completedAt: null,
        lastAccessedAt: now
      }
    });
  }

  revalidatePath(`/courses/${selectedCourse.slug}`);
  revalidatePath(`/courses/${selectedCourse.slug}/lessons/${selectedLesson.slug}`);
  revalidatePath("/student/dashboard");
  revalidatePath("/student/courses");
  redirect(`/courses/${selectedCourse.slug}/lessons/${selectedLesson.slug}?progress=${data.completed ? "completed" : "updated"}`);
}

export async function createCourseAction(formData: FormData) {
  const teacher = await requireTeacher();
  
  // Extract inputs
  const title = formData.get("title")?.toString().trim() || "";
  const subtitle = formData.get("subtitle")?.toString().trim() || "";
  const description = formData.get("description")?.toString().trim() || "";
  const excerpt = formData.get("excerpt")?.toString().trim() || "";
  const level = (formData.get("level")?.toString() || "BEGINNER") as any;
  const language = formData.get("language")?.toString().trim() || "en";
  
  // Pricing: Price in Rupees
  const priceInRupeesRaw = formData.get("priceInRupees")?.toString().trim();
  let priceCents = 0;
  let currency = "INR";
  if (priceInRupeesRaw) {
    const parsedRupees = parseFloat(priceInRupeesRaw);
    if (!isNaN(parsedRupees)) {
      priceCents = Math.round(parsedRupees * 100);
    }
  } else {
    // Fallback if priceCents was passed directly
    const priceCentsRaw = formData.get("priceCents")?.toString().trim();
    if (priceCentsRaw) {
      priceCents = parseInt(priceCentsRaw, 10) || 0;
    }
    const rawCurrency = formData.get("currency")?.toString().trim();
    if (rawCurrency) {
      currency = rawCurrency;
    }
  }

  // Cover Image / Banner Upload URL
  const coverImageUrl = formData.get("coverImageUrl")?.toString().trim() || null;

  const originalPriceInRupeesRaw = formData.get("originalPriceInRupees")?.toString().trim();
  let originalPrice = null;
  if (originalPriceInRupeesRaw) {
    const parsedOriginal = parseFloat(originalPriceInRupeesRaw);
    if (!isNaN(parsedOriginal)) {
      originalPrice = parsedOriginal;
    }
  }

  // YouTube integration
  const youtubeVideoId = formData.get("youtubeVideoId")?.toString().trim();
  let trailerUrl = null;
  if (youtubeVideoId) {
    const videoId = youtubeVideoId.includes("v=") 
      ? youtubeVideoId.split("v=")[1]?.split("&")[0] 
      : youtubeVideoId;
    trailerUrl = `https://www.youtube.com/watch?v=${videoId}`;
  } else {
    const rawTrailerUrl = formData.get("trailerUrl")?.toString().trim();
    if (rawTrailerUrl) {
      trailerUrl = rawTrailerUrl;
    }
  }

  // Category
  let categoryIds: string[] = [];
  const categoryId = formData.get("categoryId")?.toString().trim();
  if (categoryId) {
    categoryIds.push(categoryId);
  } else {
    const categoryNamesRaw = formData.get("categoryNames")?.toString().trim();
    if (categoryNamesRaw) {
      const categoryNames = parseDelimitedList(categoryNamesRaw);
      categoryIds = await resolveCategoryIds(categoryNames);
    }
  }

  // Basic Validation
  if (title.length < 3) {
    redirectWithError(teacher.role === "ADMIN" ? "/admin/courses/new" : "/teacher/courses/new", "invalid_input");
  }

  const courseSlug = await reserveCourseSlug(title);

  const course = await prisma.course.create({
    data: {
      title,
      slug: courseSlug,
      subtitle: subtitle || null,
      description: description || null,
      excerpt: excerpt || null,
      level: level,
      language: language,
      priceCents: priceCents,
      currency: currency,
      coverImageUrl: coverImageUrl,
      trailerUrl: trailerUrl,
      status: "DRAFT",
      metadata: originalPrice ? { originalPrice } : undefined,
      teachers: {
        create: [
          {
            teacherId: teacher.id,
            isPrimary: true,
            sortOrder: 0
          }
        ]
      },
      categories: categoryIds.length
        ? {
            create: categoryIds.map((cId, index) => ({
              categoryId: cId,
              sortOrder: index
            }))
          }
        : undefined
    }
  });

  await invalidateCourse(course.slug, course.id);
  if (teacher.role === "TEACHER") {
    redirect(`/teacher/courses/${course.id}?created=1`);
  } else {
    redirect(`/admin/courses/${course.id}?created=1`);
  }
}


export async function updateCourseAction(formData: FormData) {
  const teacher = await requireTeacher();
  const courseId = formData.get("courseId")?.toString() || "";

  if (!courseId) {
    redirectWithError(`/teacher/courses`, "invalid_input");
  }

  const currentCourse = await assertCourseAccess(courseId, teacher.id);

  const title = formData.get("title")?.toString().trim() || "";
  const subtitle = formData.get("subtitle")?.toString().trim() || null;
  const description = formData.get("description")?.toString().trim() || "";
  const excerpt = formData.get("excerpt")?.toString().trim() || null;
  const level = (formData.get("level")?.toString() || "BEGINNER") as any;
  const language = formData.get("language")?.toString().trim() || "en";
  const coverImageUrl = formData.get("coverImageUrl")?.toString().trim() || null;

  // Convert Rupees to Cents
  const priceInRupeesRaw = formData.get("priceInRupees")?.toString().trim();
  let priceCents = 0;
  if (priceInRupeesRaw) {
    const parsedRupees = parseFloat(priceInRupeesRaw);
    if (!isNaN(parsedRupees)) {
      priceCents = Math.round(parsedRupees * 100);
    }
  }

  // Parse originalPrice in Rupees
  const originalPriceInRupeesRaw = formData.get("originalPriceInRupees")?.toString().trim();
  let originalPrice = null;
  if (originalPriceInRupeesRaw) {
    const parsedOriginal = parseFloat(originalPriceInRupeesRaw);
    if (!isNaN(parsedOriginal)) {
      originalPrice = parsedOriginal;
    }
  }

  if (title.length < 3) {
    redirectWithError(`/teacher/courses/${currentCourse.id}`, "invalid_input");
  }

  const nextSlug = await reserveCourseSlug(title, currentCourse.id);

  // Preserve existing metadata and merge new originalPrice
  const existingMeta = typeof currentCourse.metadata === "object" && currentCourse.metadata !== null 
    ? (currentCourse.metadata as Record<string, any>) 
    : {};
  const metadata = {
    ...existingMeta,
    originalPrice: originalPrice !== null ? originalPrice : undefined
  };
  if (originalPrice === null) {
    delete metadata.originalPrice;
  }

  await prisma.course.update({
    where: { id: currentCourse.id },
    data: {
      title,
      slug: nextSlug,
      subtitle,
      description,
      excerpt,
      level,
      language,
      priceCents,
      currency: "INR",
      coverImageUrl,
      metadata: Object.keys(metadata).length > 0 ? metadata : undefined
    }
  });

  await invalidateCourse(currentCourse.slug, currentCourse.id);
  if (nextSlug !== currentCourse.slug) {
    revalidatePath(`/courses/${nextSlug}`);
  }

  redirect(`/teacher/courses/${currentCourse.id}?updated=1`);
}

export async function toggleCourseStatusAction(formData: FormData) {
  const teacher = await requireTeacher();
  const parsed = courseStatusFormSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    redirectWithError("/teacher/courses", "invalid_status");
  }

  const data = parsed.data!;
  const currentCourse = await assertCourseAccess(data.courseId, teacher.id);

  const beforeState = { status: currentCourse.status };
  await prisma.course.update({
    where: { id: currentCourse.id },
    data: {
      status: data.status,
      publishedAt: data.status === CourseStatus.PUBLISHED ? new Date() : null,
      archivedAt: data.status === CourseStatus.ARCHIVED ? new Date() : null
    }
  });



  await invalidateCourse(currentCourse.slug, currentCourse.id);
  redirect(`/teacher/courses/${currentCourse.id}?status=updated`);
}

export async function deleteCourseAction(formData: FormData) {
  const teacher = await requireTeacher();
  const parsed = courseDeleteSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    redirectWithError("/teacher/courses", "invalid_delete");
  }

  const data = parsed.data!;
  const currentCourse = await assertCourseAccess(data.courseId, teacher.id);


  await prisma.course.delete({ where: { id: currentCourse.id } });
  revalidateCoursePaths(currentCourse.slug, currentCourse.id);
  redirect("/teacher/courses?deleted=1");
}

export async function createCategoryAction(formData: FormData) {
  await requireTeacher();
  const parsed = categoryFormSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    redirectWithError("/teacher/categories", "invalid_input");
  }

  const data = parsed.data!;
  const slug = await reserveUniqueSlug(data.name, async (candidate) => Boolean(await prisma.category.findUnique({ where: { slug: candidate } })));

  await prisma.category.create({
    data: {
      name: data.name,
      slug,
      description: data.description ?? null
    }
  });

  revalidatePath("/courses");
  revalidatePath("/teacher/categories");
  redirect("/teacher/categories?created=1");
}

export async function updateCategoryAction(formData: FormData) {
  await requireTeacher();
  const schema = categoryFormSchema.extend({ categoryId: categoryDeleteSchema.shape.categoryId });
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    redirectWithError("/teacher/categories", "invalid_input");
  }

  const data = parsed.data!;
  const currentCategory = await prisma.category.findUnique({ where: { id: data.categoryId } });

  if (!currentCategory) {
    redirectWithError("/teacher/categories", "category_not_found");
  }

  const existingCategory = currentCategory!;

  const slug = await reserveUniqueSlug(
    data.name,
    async (candidate) => Boolean(await prisma.category.findFirst({ where: { slug: candidate, NOT: { id: existingCategory.id } }, select: { id: true } })),
    existingCategory.slug
  );

  await prisma.category.update({
    where: { id: existingCategory.id },
    data: {
      name: data.name,
      slug,
      description: data.description ?? null
    }
  });

  revalidatePath("/courses");
  revalidatePath("/teacher/categories");
  redirect("/teacher/categories?updated=1");
}

export async function deleteCategoryAction(formData: FormData) {
  await requireTeacher();
  const parsed = categoryDeleteSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    redirectWithError("/teacher/categories", "invalid_delete");
  }

  const data = parsed.data!;
  await prisma.category.delete({ where: { id: data.categoryId } });
  revalidatePath("/courses");
  revalidatePath("/teacher/categories");
  redirect("/teacher/categories?deleted=1");
}

export async function attachCategoryToCourseAction(formData: FormData) {
  const teacher = await requireTeacher();
  const parsed = categoryAttachSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    redirectWithError("/teacher/courses", "invalid_category");
  }

  const data = parsed.data!;
  const course = await assertCourseAccess(data.courseId, teacher.id);
  const categorySlug = slugify(data.categoryName);
  const category =
    (await prisma.category.findUnique({ where: { slug: categorySlug } })) ??
    (await prisma.category.create({ data: { name: data.categoryName, slug: categorySlug } }));

  const exists = await prisma.courseCategory.findFirst({
    where: {
      courseId: course.id,
      categoryId: category.id
    },
    select: { id: true }
  });

  if (!exists) {
    const nextOrder = course.categories.length;
    await prisma.courseCategory.create({
      data: {
        courseId: course.id,
        categoryId: category.id,
        sortOrder: nextOrder
      }
    });
  }

  await invalidateCourse(course.slug, course.id);
  redirect(`/teacher/courses/${course.id}?category=updated`);
}

export async function detachCategoryFromCourseAction(formData: FormData) {
  const teacher = await requireTeacher();
  const schema = z.object({ courseId: z.string().uuid(), categoryId: z.string().uuid() });
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    redirectWithError("/teacher/courses", "invalid_category");
  }

  const data = parsed.data!;
  const course = await assertCourseAccess(data.courseId, teacher.id);
  await prisma.courseCategory.deleteMany({ where: { courseId: course.id, categoryId: data.categoryId } });
  await invalidateCourse(course.slug, course.id);
  redirect(`/teacher/courses/${course.id}?category=removed`);
}

export async function assignTeacherAction(formData: FormData) {
  const teacher = await requireTeacher();
  const parsed = courseTeacherFormSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    redirectWithError("/teacher/courses", "invalid_teacher");
  }

  const data = parsed.data!;
  const course = await assertCourseAccess(data.courseId, teacher.id);
  const targetTeacher = await prisma.user.findUnique({
    where: { email: data.teacherEmail.toLowerCase() },
    select: {
      id: true,
      role: true,
      isActive: true
    }
  });

  if (!targetTeacher || targetTeacher.role !== UserRole.TEACHER || !targetTeacher.isActive) {
    redirectWithError(`/teacher/courses/${course.id}`, "teacher_not_found");
  }

  const existingTeacher = targetTeacher!;

  const exists = await prisma.courseTeacher.findFirst({
    where: {
      courseId: course.id,
      teacherId: existingTeacher.id
    },
    select: { id: true }
  });

  if (!exists) {
    await prisma.courseTeacher.create({
      data: {
        courseId: course.id,
        teacherId: existingTeacher.id,
        isPrimary: course.teachers.length === 0,
        sortOrder: course.teachers.length
      }
    });
  }

  await invalidateCourse(course.slug, course.id);
  redirect(`/teacher/courses/${course.id}?teacher=updated`);
}

export async function removeTeacherAction(formData: FormData) {
  const teacher = await requireTeacher();
  const schema = z.object({ courseId: z.string().uuid(), teacherId: z.string().uuid() });
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    redirectWithError("/teacher/courses", "invalid_teacher_remove");
  }

  const data = parsed.data!;
  const course = await assertCourseAccess(data.courseId, teacher.id);

  if (course.teachers.length <= 1) {
    redirectWithError(`/teacher/courses/${course.id}`, "last_teacher");
  }

  await prisma.courseTeacher.deleteMany({ where: { courseId: course.id, teacherId: data.teacherId } });
  await invalidateCourse(course.slug, course.id);
  redirect(`/teacher/courses/${course.id}?teacher=removed`);
}

export async function createSectionAction(formData: FormData) {
  const teacher = await requireTeacher();
  const parsed = sectionFormSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    redirectWithError(`/teacher/courses`, "invalid_section");
  }

  const data = parsed.data!;
  const course = await assertCourseAccess(data.courseId, teacher.id);
  const slug = await reserveScopedSlug(
    data.title,
    async (candidate) => Boolean(await prisma.courseSection.findFirst({ where: { courseId: course.id, slug: candidate }, select: { id: true } })),
  );

  await prisma.courseSection.create({
    data: {
      courseId: course.id,
      title: data.title,
      slug,
      description: data.description ?? null,
      orderIndex: data.orderIndex ?? (await nextSectionOrder(course.id)),
      isPublished: true
    }
  });

  await invalidateCourse(course.slug, course.id);
  redirect(`/teacher/courses/${course.id}?section=created`);
}

export async function updateSectionAction(formData: FormData) {
  const teacher = await requireTeacher();
  const parsed = sectionFormSchema.safeParse(Object.fromEntries(formData.entries()));

  const data = parsed.data;

  if (!parsed.success || !data?.sectionId) {
    redirectWithError(`/teacher/courses`, "invalid_section");
  }

  const sectionData = data!;
  const section = await assertSectionAccess(sectionData.sectionId!, teacher.id);
  const slug = await reserveScopedSlug(
    sectionData.title,
    async (candidate) => Boolean(await prisma.courseSection.findFirst({ where: { courseId: section.courseId, slug: candidate, NOT: { id: section.id } }, select: { id: true } })),
    section.slug
  );

  await prisma.courseSection.update({
    where: { id: section.id },
    data: {
      title: sectionData.title,
      slug,
      description: sectionData.description ?? null,
      orderIndex: sectionData.orderIndex ?? section.orderIndex
    }
  });

  await invalidateCourse(section.course.slug, section.courseId);
  redirect(`/teacher/courses/${section.courseId}?section=updated`);
}

export async function deleteSectionAction(formData: FormData) {
  const teacher = await requireTeacher();
  const parsed = z.object({ sectionId: z.string().uuid() }).safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    redirectWithError(`/teacher/courses`, "invalid_section_delete");
  }

  const data = parsed.data!;
  const section = await assertSectionAccess(data.sectionId!, teacher.id);
  await prisma.courseSection.delete({ where: { id: section.id } });
  await invalidateCourse(section.course.slug, section.courseId);
  redirect(`/teacher/courses/${section.courseId}?section=deleted`);
}

export async function createLessonAction(formData: FormData) {
  const teacher = await requireTeacher();
  const parsed = lessonFormSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    redirectWithError(`/teacher/courses`, "invalid_lesson");
  }

  const data = parsed.data!;
  const section = await assertSectionAccess(data.sectionId, teacher.id);
  const slug = await reserveScopedSlug(
    data.title,
    async (candidate) => Boolean(await prisma.lesson.findFirst({ where: { sectionId: section.id, slug: candidate }, select: { id: true } }))
  );

  let metadata: any = undefined;
  if (data.contentType === "QUIZ") {
    const test = await prisma.test.create({
      data: {
        courseId: section.courseId,
        sectionId: section.id,
        title: data.title,
        slug: `${slug}-quiz-${Date.now()}`,
        type: "QUIZ",
        passingScore: 70,
        isPublished: true
      }
    });
    metadata = { testId: test.id };
  }

  await prisma.lesson.create({
    data: {
      sectionId: section.id,
      title: data.title,
      slug,
      description: data.description ?? null,
      orderIndex: data.orderIndex ?? (await nextLessonOrder(section.id)),
      contentType: data.contentType,
      youtubeUrl: data.youtubeUrl ?? null,
      r2AssetUrl: data.r2AssetUrl ?? null,
      thumbnailUrl: data.thumbnailUrl ?? null,
      transcriptUrl: data.transcriptUrl ?? null,
      durationSeconds: data.durationSeconds ?? null,
      isPreview: data.isPreview ?? false,
      isPublished: data.isPublished ?? true,
      metadata: metadata ? metadata : undefined,
      scheduledAt: data.contentType === "LIVE" && data.scheduledAt ? new Date(data.scheduledAt) : null
    }
  });

  await invalidateCourse(section.course.slug, section.courseId);
  redirect(`/teacher/courses/${section.courseId}?lesson=created`);
}

export async function updateLessonAction(formData: FormData) {
  const teacher = await requireTeacher();
  const parsed = lessonFormSchema.safeParse(Object.fromEntries(formData.entries()));

  const data = parsed.data;

  if (!parsed.success || !data?.lessonId) {
    redirectWithError(`/teacher/courses`, "invalid_lesson");
  }

  const lessonData = data!;
  const lesson = await assertLessonAccess(lessonData.lessonId!, teacher.id);
  const slug = await reserveScopedSlug(
    lessonData.title,
    async (candidate) => Boolean(await prisma.lesson.findFirst({ where: { sectionId: lesson.sectionId, slug: candidate, NOT: { id: lesson.id } }, select: { id: true } })),
    lesson.slug
  );

  await prisma.lesson.update({
    where: { id: lesson.id },
    data: {
      title: lessonData.title,
      slug,
      description: lessonData.description ?? null,
      orderIndex: lessonData.orderIndex ?? lesson.orderIndex,
      contentType: lessonData.contentType,
      youtubeUrl: lessonData.youtubeUrl ?? null,
      r2AssetUrl: lessonData.r2AssetUrl ?? null,
      thumbnailUrl: lessonData.thumbnailUrl ?? null,
      transcriptUrl: lessonData.transcriptUrl ?? null,
      durationSeconds: lessonData.durationSeconds ?? null,
      isPreview: lessonData.isPreview ?? false,
      isPublished: lessonData.isPublished ?? true,
      scheduledAt: lessonData.contentType === "LIVE" && lessonData.scheduledAt ? new Date(lessonData.scheduledAt) : null
    }
  });

  await invalidateCourse(lesson.section.course.slug, lesson.section.courseId);
  redirect(`/teacher/courses/${lesson.section.courseId}?lesson=updated`);
}

export async function deleteLessonAction(formData: FormData) {
  const teacher = await requireTeacher();
  const parsed = z.object({ lessonId: z.string().uuid() }).safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    redirectWithError(`/teacher/courses`, "invalid_lesson_delete");
  }

  const data = parsed.data!;
  const lesson = await assertLessonAccess(data.lessonId!, teacher.id);
  await prisma.lesson.delete({ where: { id: lesson.id } });
  await invalidateCourse(lesson.section.course.slug, lesson.section.courseId);
  redirect(`/teacher/courses/${lesson.section.courseId}?lesson=deleted`);
}

export async function createLessonResourceAction(formData: FormData) {
  const teacher = await requireTeacher();
  const parsed = resourceFormSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    redirectWithError(`/teacher/courses`, "invalid_resource");
  }

  const data = parsed.data!;
  const lesson = await assertLessonAccess(data.lessonId, teacher.id);

  await prisma.lessonResource.create({
    data: {
      lessonId: lesson.id,
      title: data.title,
      resourceType: data.resourceType,
      provider: data.provider,
      url: data.url ?? "",
      mimeType: data.mimeType ?? null,
      fileSizeBytes: data.fileSizeBytes ?? null,
      orderIndex: data.orderIndex ?? (await nextResourceOrder(lesson.id)),
      isDownloadable: data.isDownloadable ?? true
    }
  });

  await invalidateCourse(lesson.section.course.slug, lesson.section.courseId);
  redirect(`/teacher/courses/${lesson.section.courseId}?resource=created`);
}

export async function updateLessonResourceAction(formData: FormData) {
  const teacher = await requireTeacher();
  const parsed = resourceFormSchema.safeParse(Object.fromEntries(formData.entries()));

  const data = parsed.data;

  if (!parsed.success || !data?.resourceId) {
    redirectWithError(`/teacher/courses`, "invalid_resource");
  }

  const resourceData = data!;
  const lesson = await assertLessonAccess(resourceData.lessonId!, teacher.id);

  await prisma.lessonResource.update({
    where: { id: resourceData.resourceId },
    data: {
      title: resourceData.title,
      resourceType: resourceData.resourceType,
      provider: resourceData.provider,
      url: resourceData.url ?? "",
      mimeType: resourceData.mimeType ?? null,
      fileSizeBytes: resourceData.fileSizeBytes ?? null,
      orderIndex: resourceData.orderIndex ?? 0,
      isDownloadable: resourceData.isDownloadable ?? true
    }
  });

  await invalidateCourse(lesson.section.course.slug, lesson.section.courseId);
  redirect(`/teacher/courses/${lesson.section.courseId}?resource=updated`);
}

export async function deleteLessonResourceAction(formData: FormData) {
  const teacher = await requireTeacher();
  const parsed = z.object({ resourceId: z.string().uuid(), lessonId: z.string().uuid() }).safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    redirectWithError(`/teacher/courses`, "invalid_resource_delete");
  }

  const data = parsed.data!;
  const lesson = await assertLessonAccess(data.lessonId, teacher.id);
  await prisma.lessonResource.delete({ where: { id: data.resourceId } });
  await invalidateCourse(lesson.section.course.slug, lesson.section.courseId);
  redirect(`/teacher/courses/${lesson.section.courseId}?resource=deleted`);
}