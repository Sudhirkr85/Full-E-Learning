"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { loginSchema } from "@/lib/auth-schemas";

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password")
  });

  const rawCallbackUrl = formData.get("callbackUrl");
  const callbackUrl = typeof rawCallbackUrl === "string" && rawCallbackUrl.startsWith("/") && !rawCallbackUrl.startsWith("//")
    ? rawCallbackUrl
    : "/dashboard";

  if (!parsed.success) {
    const errorRedirect = callbackUrl !== "/dashboard"
      ? `/login?error=invalid_input&callbackUrl=${encodeURIComponent(callbackUrl)}`
      : "/login?error=invalid_input";
    redirect(errorRedirect);
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: callbackUrl
    });
  } catch (error) {
    if (error instanceof AuthError) {
      const errorRedirect = callbackUrl !== "/dashboard"
        ? `/login?error=invalid_credentials&callbackUrl=${encodeURIComponent(callbackUrl)}`
        : "/login?error=invalid_credentials";
      redirect(errorRedirect);
    }

    throw error;
  }
}

export async function loginWithGoogleAction(callbackUrl: string = "/dashboard") {
  const safeCallbackUrl = typeof callbackUrl === "string" && callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")
    ? callbackUrl
    : "/dashboard";

  try {
    await signIn("google", {
      redirectTo: safeCallbackUrl
    });
  } catch (error) {
    if (error instanceof AuthError) {
      const errorRedirect = safeCallbackUrl !== "/dashboard"
        ? `/login?error=oauth_error&callbackUrl=${encodeURIComponent(safeCallbackUrl)}`
        : "/login?error=oauth_error";
      redirect(errorRedirect);
    }
    throw error;
  }
}

export async function loginWithGithubAction(callbackUrl: string = "/dashboard") {
  const safeCallbackUrl = typeof callbackUrl === "string" && callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")
    ? callbackUrl
    : "/dashboard";

  try {
    await signIn("github", {
      redirectTo: safeCallbackUrl
    });
  } catch (error) {
    if (error instanceof AuthError) {
      const errorRedirect = safeCallbackUrl !== "/dashboard"
        ? `/login?error=oauth_error&callbackUrl=${encodeURIComponent(safeCallbackUrl)}`
        : "/login?error=oauth_error";
      redirect(errorRedirect);
    }
    throw error;
  }
}