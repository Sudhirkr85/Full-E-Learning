"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function publishCourseAction(courseId: string) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.course.update({
      where: { id: courseId },
      data: { status: "PUBLISHED", publishedAt: new Date() }
    });

    revalidatePath("/admin/courses");
    revalidatePath(`/admin/courses/${courseId}`);
    return { success: "Course published successfully!" };
  } catch (error) {
    console.error("Publish course error:", error);
    return { error: "Failed to publish course." };
  }
}

export async function archiveCourseAction(courseId: string) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.course.update({
      where: { id: courseId },
      data: { status: "ARCHIVED", archivedAt: new Date() }
    });

    revalidatePath("/admin/courses");
    revalidatePath(`/admin/courses/${courseId}`);
    return { success: "Course archived successfully!" };
  } catch (error) {
    console.error("Archive course error:", error);
    return { error: "Failed to archive course." };
  }
}

export async function deleteCourseAction(courseId: string) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { status: true }
    });

    if (!course) {
      return { error: "Course not found." };
    }

    if (course.status !== "DRAFT") {
      return { error: "Only courses in DRAFT status can be deleted." };
    }

    await prisma.course.delete({
      where: { id: courseId }
    });

    revalidatePath("/admin/courses");
    return { success: "Course deleted successfully!" };
  } catch (error) {
    console.error("Delete course error:", error);
    return { error: "Failed to delete course. Ensure database relations are clean." };
  }
}
