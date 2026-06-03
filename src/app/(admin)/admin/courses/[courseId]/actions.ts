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
    const maxSection = await prisma.courseSection.findFirst({
      where: { courseId },
      orderBy: { orderIndex: "desc" },
      select: { orderIndex: true }
    });
    const nextOrderIndex = maxSection ? maxSection.orderIndex + 1 : 0;

    let slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
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
        orderIndex: nextOrderIndex
      }
    });

    revalidatePath(`/admin/courses/${courseId}`);
    return { success: "Section created successfully!" };
  } catch (error) {
    console.error("Create section error:", error);
    return { error: "Failed to create section." };
  }
}

type LessonExtras = {
  description?: string;
  youtubeUrl?: string;
  r2AssetUrl?: string;
  sessionType?: "LIVE" | "RECORDED";
  accessType?: "FREE" | "PAID";
  liveDateTime?: string;
  publishDate?: string;
  isPreview?: boolean;
  scheduledAt?: string;
  quizTimeLimit?: number;
  quizAttemptLimit?: number;
};

export async function createLessonAction(
  courseId: string,
  sectionId: string,
  title: string,
  contentType: "VIDEO" | "ARTICLE" | "RESOURCE" | "QUIZ" | "LIVE",
  extras?: LessonExtras
) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  if (!title.trim()) {
    return { error: "Lesson title is required." };
  }

  if (contentType === "QUIZ" && !extras?.quizTimeLimit) {
    return { error: "Quiz time limit is mandatory." };
  }

  try {
    const maxLesson = await prisma.lesson.findFirst({
      where: { sectionId },
      orderBy: { orderIndex: "desc" },
      select: { orderIndex: true }
    });
    const nextOrderIndex = maxLesson ? maxLesson.orderIndex + 1 : 0;

    let slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    if (!slug) slug = "lesson";

    const existingLesson = await prisma.lesson.findFirst({
      where: { sectionId, slug }
    });

    if (existingLesson) {
      slug = `${slug}-${Date.now()}`;
    }

    // Build metadata for session-specific fields
    const metadata: Record<string, unknown> = {};
    if (extras?.sessionType) metadata.sessionType = extras.sessionType;
    if (extras?.accessType) metadata.accessType = extras.accessType;
    if (extras?.liveDateTime) metadata.liveDateTime = extras.liveDateTime;
    if (extras?.publishDate) metadata.publishDate = extras.publishDate;

    if (contentType === "QUIZ") {
      // Auto-generate test shell
      const test = await prisma.test.create({
        data: {
          courseId,
          sectionId,
          title,
          slug: `${slug}-quiz-${Date.now()}`,
          type: "QUIZ",
          passingScore: 70,
          timeLimitMinutes: extras?.quizTimeLimit ?? 60,
          attemptLimit: extras?.quizAttemptLimit ?? null,
          isPublished: true
        }
      });
      metadata.testId = test.id;
    }

    await prisma.lesson.create({
      data: {
        sectionId,
        title,
        slug,
        contentType,
        orderIndex: nextOrderIndex,
        description: extras?.description ?? null,
        youtubeUrl: extras?.youtubeUrl ?? null,
        r2AssetUrl: extras?.r2AssetUrl ?? null,
        isPreview: extras?.isPreview ?? false,
        isPublished: true,
        metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
        scheduledAt: contentType === "LIVE" && extras?.scheduledAt ? new Date(extras.scheduledAt) : null
      }
    });

    revalidatePath(`/admin/courses/${courseId}`);
    return { success: "Session created successfully!" };
  } catch (error) {
    console.error("Create lesson error:", error);
    return { error: "Failed to create session." };
  }
}

export async function deleteSectionAction(courseId: string, sectionId: string) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    // Delete all lessons first (due to DB constraints if any, or Cascade if configured)
    await prisma.lesson.deleteMany({
      where: { sectionId }
    });

    await prisma.courseSection.delete({
      where: { id: sectionId }
    });

    revalidatePath(`/admin/courses/${courseId}`);
    return { success: "Section deleted successfully!" };
  } catch (error) {
    console.error("Delete section error:", error);
    return { error: "Failed to delete section." };
  }
}

export async function deleteLessonAction(courseId: string, lessonId: string) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.lesson.delete({
      where: { id: lessonId }
    });

    revalidatePath(`/admin/courses/${courseId}`);
    return { success: "Lesson deleted successfully!" };
  } catch (error) {
    console.error("Delete lesson error:", error);
    return { error: "Failed to delete lesson." };
  }
}

export async function updateLessonAction(
  courseId: string,
  lessonId: string,
  title: string,
  contentType: "VIDEO" | "ARTICLE" | "RESOURCE" | "QUIZ" | "LIVE",
  extras?: LessonExtras
) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  if (!title.trim()) {
    return { error: "Lesson title is required." };
  }

  try {
    const existing = await prisma.lesson.findUnique({
      where: { id: lessonId }
    });

    if (!existing) {
      return { error: "Lesson not found." };
    }

    let slug = existing.slug;
    if (existing.title !== title) {
      slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      if (!slug) slug = "lesson";

      const existingWithSlug = await prisma.lesson.findFirst({
        where: { sectionId: existing.sectionId, slug, NOT: { id: lessonId } }
      });

      if (existingWithSlug) {
        slug = `${slug}-${Date.now()}`;
      }
    }

    // Build metadata for session-specific fields
    const existingMetadata = (existing.metadata as Record<string, unknown>) || {};
    const metadata: Record<string, unknown> = { ...existingMetadata };
    if (extras?.sessionType) metadata.sessionType = extras.sessionType;
    if (extras?.accessType) metadata.accessType = extras.accessType;
    if (extras?.liveDateTime) metadata.liveDateTime = extras.liveDateTime;
    if (extras?.publishDate) metadata.publishDate = extras.publishDate;

    await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        title,
        slug,
        contentType,
        description: extras?.description ?? null,
        youtubeUrl: extras?.youtubeUrl ?? null,
        r2AssetUrl: extras?.r2AssetUrl ?? null,
        isPreview: extras?.isPreview ?? false,
        metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
        scheduledAt: contentType === "LIVE" && extras?.scheduledAt ? new Date(extras.scheduledAt) : null
      }
    });

    revalidatePath(`/admin/courses/${courseId}`);
    return { success: "Lesson updated successfully!" };
  } catch (error) {
    console.error("Update lesson error:", error);
    return { error: "Failed to update lesson." };
  }
}

