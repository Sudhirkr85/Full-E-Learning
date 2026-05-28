"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function promoteToTeacherAction(userId: string) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (!targetUser) {
      return { error: "User not found." };
    }

    if (targetUser.role === "ADMIN") {
      return { error: "Cannot demote or modify Admin account roles." };
    }

    await prisma.user.update({
      where: { id: userId },
      data: { role: "TEACHER" }
    });

    revalidatePath("/admin/users");
    return { success: "User promoted to Teacher successfully!" };
  } catch (error) {
    console.error("Promote to teacher error:", error);
    return { error: "Failed to promote user. Please try again." };
  }
}
