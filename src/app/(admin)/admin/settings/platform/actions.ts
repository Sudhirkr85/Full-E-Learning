"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function savePlatformConfigAction(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const siteName = formData.get("siteName")?.toString().trim();
  const supportEmail = formData.get("supportEmail")?.toString().trim();
  const maintenance = formData.get("maintenance") === "true";

  if (!siteName || !supportEmail) {
    return { error: "Site Name and Support Email are required." };
  }

  try {
    // Upsert the singleton record using id: "singleton"
    await prisma.platformConfig.upsert({
      where: { id: "singleton" },
      update: {
        siteName,
        supportEmail,
        maintenance
      },
      create: {
        id: "singleton",
        siteName,
        supportEmail,
        maintenance
      }
    });

    revalidatePath("/admin/settings/platform");
    return { success: "Platform configuration updated successfully!" };
  } catch (error) {
    console.error("Save platform config error:", error);
    return { error: "Failed to save configuration. Please try again." };
  }
}
