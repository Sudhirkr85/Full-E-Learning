"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";

export type ResetPasswordResult = {
  success: boolean;
  message: string;
};

export async function resetPasswordAction(
  token: string,
  formData: FormData
): Promise<ResetPasswordResult> {
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();

  if (!token) {
    return { success: false, message: "Invalid or missing reset token." };
  }

  if (!password || !confirmPassword) {
    return { success: false, message: "Please fill in all password fields." };
  }

  if (password.length < 8) {
    return { success: false, message: "Password must be at least 8 characters long." };
  }

  if (password !== confirmPassword) {
    return { success: false, message: "Passwords do not match." };
  }

  try {
    // Lookup the user by querying the metadata JSON field for the matching resetPasswordToken
    const user = await prisma.user.findFirst({
      where: {
        metadata: {
          path: ["resetPasswordToken"],
          equals: token,
        },
      },
    });

    if (!user) {
      return {
        success: false,
        message: "This password reset link is invalid or has already been used.",
      };
    }

    const metadata = (user.metadata as Record<string, any>) || {};
    const expiresStr = metadata.resetPasswordExpires;

    // Check token expiration
    if (!expiresStr || new Date(expiresStr) < new Date()) {
      return {
        success: false,
        message: "This password reset link has expired. Please request a new one.",
      };
    }

    // Hash the new password
    const passwordHash = await hashPassword(password);

    // Clean up reset details from metadata
    const { resetPasswordToken, resetPasswordExpires, ...updatedMetadata } = metadata;

    // Update user credentials and metadata in a single transaction
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        metadata: updatedMetadata,
      },
    });

    return {
      success: true,
      message: "Your password has been successfully reset! Redirecting to login...",
    };
  } catch (error) {
    console.error("Reset password server action error:", error);
    return {
      success: false,
      message: "A database or server-side error occurred. Please try again.",
    };
  }
}
