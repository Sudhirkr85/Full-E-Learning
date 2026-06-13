import { NextResponse } from "next/server";
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const parsed = registerSchema.safeParse({
      name: body.name,
      email: body.email,
      password: body.password,
      confirmPassword: body.confirmPassword ?? body.password, // Fallback if mobile doesn't send confirmPassword
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const email = parsed.data.email.toLowerCase();
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email is already registered." },
        { status: 409 }
      );
    }

    if (email === SUPER_ADMIN_EMAIL.toLowerCase()) {
      return NextResponse.json(
        { error: "This email is reserved." },
        { status: 403 }
      );
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
    try {
      const { sendWelcomeEmail, dispatchEmailBackground } = await import("@/lib/email");
      dispatchEmailBackground(() =>
        sendWelcomeEmail(email, parsed.data.name, {
          name: parsed.data.name,
          appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
        })
      );
    } catch (emailErr) {
      console.error("Failed to dispatch welcome email:", emailErr);
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err: any) {
    console.error("[REGISTER_API_ERROR]", err);
    return NextResponse.json(
      { error: err.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
