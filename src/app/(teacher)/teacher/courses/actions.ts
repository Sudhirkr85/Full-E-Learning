"use server";

import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function publishCourseAction(courseId: string) {
  const teacher = await requireRole(["TEACHER", "ADMIN"]);
  try {
    const courseTeacher = await prisma.courseTeacher.findFirst({
      where: { courseId, teacherId: teacher.id }
    });
    if (!courseTeacher && teacher.role !== "ADMIN") {
      return { error: "Unauthorized" };
    }

    await prisma.course.update({
      where: { id: courseId },
      data: { status: "PUBLISHED", publishedAt: new Date() }
    });

    revalidatePath("/teacher/courses");
    revalidatePath(`/teacher/courses/${courseId}`);
    return { success: "Course published successfully!" };
  } catch (error) {
    console.error("Publish course error:", error);
    return { error: "Failed to publish course." };
  }
}

export async function archiveCourseAction(courseId: string) {
  const teacher = await requireRole(["TEACHER", "ADMIN"]);
  try {
    const courseTeacher = await prisma.courseTeacher.findFirst({
      where: { courseId, teacherId: teacher.id }
    });
    if (!courseTeacher && teacher.role !== "ADMIN") {
      return { error: "Unauthorized" };
    }

    await prisma.course.update({
      where: { id: courseId },
      data: { status: "ARCHIVED", archivedAt: new Date() }
    });

    revalidatePath("/teacher/courses");
    revalidatePath(`/teacher/courses/${courseId}`);
    return { success: "Course archived successfully!" };
  } catch (error) {
    console.error("Archive course error:", error);
    return { error: "Failed to archive course." };
  }
}

export async function deleteCourseAction(courseId: string) {
  const teacher = await requireRole(["TEACHER", "ADMIN"]);
  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        teachers: true
      }
    });

    if (!course) {
      return { error: "Course not found." };
    }

    const isAuthorized = course.teachers.some((t) => t.teacherId === teacher.id) || teacher.role === "ADMIN";
    if (!isAuthorized) {
      return { error: "Unauthorized" };
    }

    if (course.status !== "DRAFT") {
      return { error: "Only courses in DRAFT status can be deleted." };
    }

    await prisma.course.delete({
      where: { id: courseId }
    });

    revalidatePath("/teacher/courses");
    return { success: "Course deleted successfully!" };
  } catch (error) {
    console.error("Delete course error:", error);
    return { error: "Failed to delete course." };
  }
}
