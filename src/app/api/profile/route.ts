import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  firstName: z.string().max(50).optional().nullable(),
  lastName: z.string().max(50).optional().nullable(),
  email: z.string().email("Invalid email address"),
  phone: z.string().max(20).optional().nullable(),
  addressLine1: z.string().max(200).optional().nullable(),
  addressLine2: z.string().max(200).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  state: z.string().max(100).optional().nullable(),
  postalCode: z.string().max(20).optional().nullable(),
  country: z.string().max(100).optional().nullable(),
});

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        email: true,
        phone: true,
        image: true,
        metadata: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const meta = (user.metadata as Record<string, unknown> | null) ?? {};
    const metaPhone = typeof meta.phone === "string" ? meta.phone : "";
    const addressLine1 = typeof meta.addressLine1 === "string" ? meta.addressLine1 : "";
    const addressLine2 = typeof meta.addressLine2 === "string" ? meta.addressLine2 : "";
    const city = typeof meta.city === "string" ? meta.city : "";
    const state = typeof meta.state === "string" ? meta.state : "";
    const postalCode = typeof meta.postalCode === "string" ? meta.postalCode : "";
    const country = typeof meta.country === "string" ? meta.country : "India";

    return NextResponse.json({
      user: {
        name: user.name ?? "",
        email: user.email ?? "",
        phone: user.phone ?? metaPhone ?? "",
        image: user.image ?? "",
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country,
      }
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = profileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, firstName, lastName, email, phone, addressLine1, addressLine2, city, state, postalCode, country } = parsed.data;

    // Check if email is already taken by another user
    if (email !== session.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
        select: { id: true }
      });

      if (existingUser && existingUser.id !== session.user.id) {
        return NextResponse.json(
          { error: "Email is already in use by another account." },
          { status: 409 }
        );
      }
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { metadata: true }
    });

    const currentMeta = (existingUser?.metadata as Record<string, unknown> | null) ?? {};
    const updatedMeta = {
      ...currentMeta,
      phone: phone || currentMeta.phone || null,
      addressLine1: addressLine1 || null,
      addressLine2: addressLine2 || null,
      city: city || null,
      state: state || null,
      postalCode: postalCode || null,
      country: country || "India",
    };

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        firstName: firstName || null,
        lastName: lastName || null,
        email,
        phone: phone || null,
        metadata: updatedMeta
      },
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        image: true,
        role: true,
        metadata: true,
        createdAt: true
      }
    });

    return NextResponse.json({ user: updatedUser });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
