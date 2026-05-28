"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import bcrypt from "bcryptjs";

export async function changePasswordAction(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const currentPassword = formData.get("currentPassword")?.toString().trim();
  const newPassword = formData.get("newPassword")?.toString().trim();
  const confirmPassword = formData.get("confirmPassword")?.toString().trim();

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "All password fields are required." };
  }

  if (newPassword !== confirmPassword) {
    return { error: "New password and confirmation do not match." };
  }

  const userEmail = session.user.email;
  if (!userEmail) {
    return { error: "User email not found in session." };
  }

  const user = await prisma.user.findUnique({
    where: { email: userEmail }
  });

  if (!user) {
    return { error: "User not found." };
  }

  // Verify currentPassword matches stored hash using bcrypt.compare()
  const currentHashMatches = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!currentHashMatches) {
    return { error: "Current password is incorrect." };
  }

  // Hash newPassword using existing hashPassword() from src/lib/password.ts
  const hashedNew = await hashPassword(newPassword);

  // Update user record: prisma.user.update({ where: { id }, data: { passwordHash: hashedNew } })
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: hashedNew }
  });

  return { success: "Password updated successfully!" };
}
