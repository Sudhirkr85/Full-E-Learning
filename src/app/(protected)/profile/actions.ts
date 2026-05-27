"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export type UpdateProfileResult = {
  success: boolean;
  message: string;
};

export async function updateProfileAction(formData: FormData): Promise<UpdateProfileResult> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return { success: false, message: "Unauthorized. Please log in." };
    }

    const name = formData.get("name")?.toString().trim();
    const phone = formData.get("phone")?.toString().trim();

    if (!name) {
      return { success: false, message: "Full Name is required." };
    }

    // Query database directly to get the user's metadata
    const dbUser = await prisma.user.findUnique({
      where: { id: currentUser.id },
      select: { metadata: true },
    });

    // Capture existing metadata from the user
    const existingMetadata = (dbUser?.metadata as Record<string, any>) || {};
    const updatedMetadata = {
      ...existingMetadata,
      phone: phone || "",
    };

    // Update Prisma User record
    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        name,
        metadata: updatedMetadata,
      },
    });

    // Revalidate profile page cache
    revalidatePath("/profile");

    return {
      success: true,
      message: "Profile updated successfully!",
    };
  } catch (error) {
    console.error("Update profile error:", error);
    return {
      success: false,
      message: "A database error occurred. Please try again.",
    };
  }
}
