"use server";

import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email/service";

export type ForgotPasswordResult = {
  success: boolean;
  message?: string;
};

export async function forgotPasswordAction(formData: FormData): Promise<ForgotPasswordResult> {
  const email = formData.get("email")?.toString().trim().toLowerCase();

  if (!email) {
    return { success: false, message: "Please provide a valid email address." };
  }

  try {
    // Look up the user by email in the database
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        firstName: true,
        metadata: true,
      },
    });

    // If the user doesn't exist, return a generic success message to prevent email enumerations
    if (!user) {
      return {
        success: true,
        message: "If an account is associated with this email, a secure reset link has been dispatched.",
      };
    }

    // Generate a secure random hex token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // Token valid for 1 hour

    // Securely store token and expiration inside the user's metadata JSON field
    const existingMetadata = (user.metadata as Record<string, any>) || {};
    const updatedMetadata = {
      ...existingMetadata,
      resetPasswordToken: token,
      resetPasswordExpires: expires.toISOString(),
    };

    await prisma.user.update({
      where: { id: user.id },
      data: { metadata: updatedMetadata },
    });

    // Construct the reset URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetUrl = `${appUrl}/reset-password?token=${token}`;
    const displayName = user.name || user.firstName || "Tech Learner";

    // Send the password reset email
    await sendPasswordResetEmail(user.email, displayName, { name: displayName, resetUrl });

    return {
      success: true,
      message: "If an account is associated with this email, a secure reset link has been dispatched.",
    };
  } catch (error) {
    console.error("Forgot password server error:", error);
    return {
      success: false,
      message: "A server-side error occurred. Please try again later.",
    };
  }
}
