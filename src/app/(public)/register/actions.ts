"use server";

import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { registerSchema } from "@/lib/auth-schemas";
const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || "admin@sagarcoachingcentre.com";

function splitName(name: string) {
  const parts = name.trim().split(/\s+/);
  const firstName = parts[0] ?? null;
  const lastName = parts.length > 1 ? parts.slice(1).join(" ") : null;

  return { firstName, lastName };
}

export async function registerAction(formData: FormData) {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword")
  });

  if (!parsed.success) {
    redirect("/register?error=invalid_input");
  }

  const email = parsed.data.email.toLowerCase();
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    redirect("/register?error=email_exists");
  }

  // Block reserved admin email from public registration
  if (email === SUPER_ADMIN_EMAIL.toLowerCase()) {
    redirect("/register?error=email_reserved");
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const { firstName, lastName } = splitName(parsed.data.name);

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email,
      passwordHash,
      firstName,
      lastName,
      role: "STUDENT"
    }
  });

  // Non-blocking welcome email dispatch
  const { sendWelcomeEmail, dispatchEmailBackground } = await import("@/lib/email");
  dispatchEmailBackground(() =>
    sendWelcomeEmail(email, parsed.data.name, {
      name: parsed.data.name,
      appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    })
  );

  await signIn("credentials", {
    email,
    password: parsed.data.password,
    redirectTo: "/dashboard"
  });
}