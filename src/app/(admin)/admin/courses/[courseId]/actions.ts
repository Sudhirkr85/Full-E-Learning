"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createSectionAction(courseId: string, title: string) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  if (!title.trim()) {
    return { error: "Section title is required." };
  }

  try {
    const sectionsCount = await prisma.courseSection.count({
      where: { courseId }
    });

    let slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (!slug) slug = "section";

    const existingSection = await prisma.courseSection.findFirst({
      where: { courseId, slug }
    });

    if (existingSection) {
      slug = `${slug}-${Date.now()}`;
    }

    await prisma.courseSection.create({
      data: {
        courseId,
        title,
        slug,
        orderIndex: sectionsCount
      }
    });

    revalidatePath(`/admin/courses/${courseId}`);
    return { success: "Section created successfully!" };
  } catch (error) {
    console.error("Create section error:", error);
    return { error: "Failed to create section." };
  }
}

export async function createLessonAction(courseId: string, sectionId: string, title: string, contentType: "VIDEO" | "ARTICLE" | "RESOURCE") {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  if (!title.trim()) {
    return { error: "Lesson title is required." };
  }

  try {
    const lessonsCount = await prisma.lesson.count({
      where: { sectionId }
    });

    let slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (!slug) slug = "lesson";

    const existingLesson = await prisma.lesson.findFirst({
      where: { sectionId, slug }
    });

    if (existingLesson) {
      slug = `${slug}-${Date.now()}`;
    }

    await prisma.lesson.create({
      data: {
        sectionId,
        title,
        slug,
        contentType,
        orderIndex: lessonsCount
      }
    });

    revalidatePath(`/admin/courses/${courseId}`);
    return { success: "Lesson created successfully!" };
  } catch (error) {
    console.error("Create lesson error:", error);
    return { error: "Failed to create lesson." };
  }
}
