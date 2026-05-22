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

  if (!parsed.success) {
    redirect("/login?error=invalid_input");
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/dashboard"
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/login?error=invalid_credentials");
    }

    throw error;
  }
}

export async function loginWithGoogleAction() {
  try {
    await signIn("google", {
      redirectTo: "/dashboard"
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/login?error=oauth_error");
    }
    throw error;
  }
}

export async function loginWithGithubAction() {
  try {
    await signIn("github", {
      redirectTo: "/dashboard"
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/login?error=oauth_error");
    }
    throw error;
  }
}