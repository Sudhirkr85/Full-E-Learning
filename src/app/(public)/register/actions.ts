"use server";

import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { registerSchema } from "@/lib/auth-schemas";
const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || "admin@sagarcoaching.tech";

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

  const rawCallbackUrl = formData.get("callbackUrl");
  const callbackUrl = typeof rawCallbackUrl === "string" && rawCallbackUrl.startsWith("/") && !rawCallbackUrl.startsWith("//")
    ? rawCallbackUrl
    : "/dashboard";

  if (!parsed.success) {
    const errorRedirect = callbackUrl !== "/dashboard"
      ? `/register?error=invalid_input&callbackUrl=${encodeURIComponent(callbackUrl)}`
      : "/register?error=invalid_input";
    redirect(errorRedirect);
  }

  const email = parsed.data.email.toLowerCase();
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    const errorRedirect = callbackUrl !== "/dashboard"
      ? `/register?error=email_exists&callbackUrl=${encodeURIComponent(callbackUrl)}`
      : "/register?error=email_exists";
    redirect(errorRedirect);
  }

  // Block reserved admin email from public registration
  if (email === SUPER_ADMIN_EMAIL.toLowerCase()) {
    const errorRedirect = callbackUrl !== "/dashboard"
      ? `/register?error=email_reserved&callbackUrl=${encodeURIComponent(callbackUrl)}`
      : "/register?error=email_reserved";
    redirect(errorRedirect);
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
    redirectTo: callbackUrl
  });
}