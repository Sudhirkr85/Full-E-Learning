"use server";

import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CourseStatus, CourseLevel } from "@prisma/client";
import { courseCoreSchema } from "@/lib/courses/schemas";

export async function adminUpdateCourseAction(formData: FormData) {
  const admin = await requireRole(["ADMIN"]);
  const courseId = formData.get("courseId")?.toString() || "";

  if (!courseId) {
    throw new Error("Course ID is required.");
  }

  const currentCourse = await prisma.course.findUnique({
    where: { id: courseId }
  });

  if (!currentCourse) {
    throw new Error("Course not found.");
  }

  // Parse inputs manually
  const title = formData.get("title")?.toString().trim() || "";
  const subtitle = formData.get("subtitle")?.toString().trim() || null;
  const description = formData.get("description")?.toString().trim() || "";
  const excerpt = formData.get("excerpt")?.toString().trim() || null;
  const level = (formData.get("level")?.toString() || "BEGINNER") as CourseLevel;
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
    redirect(`/admin/courses/${courseId}/edit?error=invalid_title`);
  }

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
    where: { id: courseId },
    data: {
      title,
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

  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath(`/admin/courses/${courseId}/edit`);
  revalidatePath(`/courses/${courseId}`);
  redirect(`/admin/courses/${courseId}/edit?updated=1`);
}

export async function adminToggleCourseStatusAction(formData: FormData) {
  const admin = await requireRole(["ADMIN"]);
  const courseId = formData.get("courseId")?.toString() || "";
  const status = (formData.get("status")?.toString() || "DRAFT") as CourseStatus;

  if (!courseId) {
    throw new Error("Course ID is required.");
  }

  const currentCourse = await prisma.course.findUnique({
    where: { id: courseId }
  });

  if (!currentCourse) {
    throw new Error("Course not found.");
  }

  await prisma.course.update({
    where: { id: courseId },
    data: {
      status,
      publishedAt: status === CourseStatus.PUBLISHED ? new Date() : null,
      archivedAt: status === CourseStatus.ARCHIVED ? new Date() : null
    }
  });



  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath(`/admin/courses/${courseId}/edit`);
  redirect(`/admin/courses/${courseId}/edit?status=updated`);
}

export async function adminAttachCategoryToCourseAction(formData: FormData) {
  const admin = await requireRole(["ADMIN"]);
  const courseId = formData.get("courseId")?.toString() || "";
  const categoryName = formData.get("categoryName")?.toString().trim() || "";

  if (!courseId || !categoryName) {
    throw new Error("Invalid parameters.");
  }

  // Find or create category
  let category = await prisma.category.findFirst({
    where: { name: { equals: categoryName, mode: "insensitive" } }
  });

  if (!category) {
    const slug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    category = await prisma.category.create({
      data: {
        name: categoryName,
        slug: slug || `category-${Date.now()}`
      }
    });
  }

  // Attach if not already
  const existing = await prisma.courseCategory.findFirst({
    where: { courseId, categoryId: category.id }
  });

  if (!existing) {
    const count = await prisma.courseCategory.count({ where: { courseId } });
    await prisma.courseCategory.create({
      data: {
        courseId,
        categoryId: category.id,
        sortOrder: count
      }
    });
  }

  revalidatePath(`/admin/courses/${courseId}/edit`);
  redirect(`/admin/courses/${courseId}/edit?category=updated`);
}

export async function adminDetachCategoryFromCourseAction(formData: FormData) {
  await requireRole(["ADMIN"]);
  const courseId = formData.get("courseId")?.toString() || "";
  const categoryId = formData.get("categoryId")?.toString() || "";

  if (!courseId || !categoryId) {
    throw new Error("Invalid parameters.");
  }

  await prisma.courseCategory.delete({
    where: {
      courseId_categoryId: {
        courseId,
        categoryId
      }
    }
  });

  revalidatePath(`/admin/courses/${courseId}/edit`);
  redirect(`/admin/courses/${courseId}/edit?category=removed`);
}

export async function adminAssignTeacherAction(formData: FormData) {
  await requireRole(["ADMIN"]);
  const courseId = formData.get("courseId")?.toString() || "";
  const teacherEmail = formData.get("teacherEmail")?.toString().trim() || "";

  if (!courseId || !teacherEmail) {
    if (courseId) {
      redirect(`/admin/courses/${courseId}/edit?error=invalid_teacher_params`);
    }
    redirect("/admin/courses?error=invalid_teacher_params");
  }

  const user = await prisma.user.findUnique({
    where: { email: teacherEmail }
  });

  if (!user) {
    redirect(`/admin/courses/${courseId}/edit?error=user_not_found`);
  }

  const existing = await prisma.courseTeacher.findFirst({
    where: { courseId, teacherId: user.id }
  });

  if (!existing) {
    const count = await prisma.courseTeacher.count({ where: { courseId } });
    await prisma.courseTeacher.create({
      data: {
        courseId,
        teacherId: user.id,
        sortOrder: count
      }
    });
  }

  revalidatePath(`/admin/courses/${courseId}/edit`);
  redirect(`/admin/courses/${courseId}/edit?teacher=updated`);
}

export async function adminRemoveTeacherAction(formData: FormData) {
  await requireRole(["ADMIN"]);
  const courseId = formData.get("courseId")?.toString() || "";
  const teacherId = formData.get("teacherId")?.toString() || "";

  if (!courseId || !teacherId) {
    throw new Error("Invalid parameters.");
  }

  await prisma.courseTeacher.delete({
    where: {
      courseId_teacherId: {
        courseId,
        teacherId
      }
    }
  });

  revalidatePath(`/admin/courses/${courseId}/edit`);
  redirect(`/admin/courses/${courseId}/edit?teacher=removed`);
}

export async function adminDeleteCourseAction(formData: FormData) {
  const admin = await requireRole(["ADMIN"]);
  const courseId = formData.get("courseId")?.toString() || "";

  if (!courseId) {
    throw new Error("Invalid parameters.");
  }

  const currentCourse = await prisma.course.findUnique({
    where: { id: courseId }
  });

  if (!currentCourse) {
    throw new Error("Course not found.");
  }



  await prisma.course.delete({ where: { id: courseId } });
  revalidatePath("/admin/courses");
  redirect("/admin/courses?deleted=1");
}
