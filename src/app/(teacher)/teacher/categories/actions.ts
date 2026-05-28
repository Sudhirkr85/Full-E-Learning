"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCategoryAction(name: string) {
  const session = await auth();
  if (!session || !["ADMIN", "TEACHER"].includes(session.user.role)) {
    return { error: "Unauthorized" };
  }

  if (!name.trim()) {
    return { error: "Category name is required." };
  }

  try {
    let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    if (!slug) slug = "category";

    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      slug = `${slug}-${Date.now()}`;
    }

    await prisma.category.create({
      data: { name, slug },
    });

    revalidatePath("/teacher/categories");
    revalidatePath("/admin/categories");
    return { success: "Category created successfully!" };
  } catch (error) {
    console.error("Create category error:", error);
    return { error: "Failed to create category." };
  }
}

export async function updateCategoryAction(categoryId: string, name: string) {
  const session = await auth();
  if (!session || !["ADMIN", "TEACHER"].includes(session.user.role)) {
    return { error: "Unauthorized" };
  }

  if (!name.trim()) {
    return { error: "Category name is required." };
  }

  try {
    let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    if (!slug) slug = "category";

    const existingCategory = await prisma.category.findFirst({
      where: { slug, NOT: { id: categoryId } },
    });

    if (existingCategory) {
      slug = `${slug}-${Date.now()}`;
    }

    await prisma.category.update({
      where: { id: categoryId },
      data: { name, slug },
    });

    revalidatePath("/teacher/categories");
    revalidatePath("/admin/categories");
    return { success: "Category updated successfully!" };
  } catch (error) {
    console.error("Update category error:", error);
    return { error: "Failed to update category." };
  }
}

export async function deleteCategoryAction(categoryId: string) {
  const session = await auth();
  if (!session || !["ADMIN", "TEACHER"].includes(session.user.role)) {
    return { error: "Unauthorized" };
  }

  try {
    const coursesCount = await prisma.courseCategory.count({
      where: { categoryId },
    });

    if (coursesCount > 0) {
      return { error: "Cannot delete category with existing courses" };
    }

    await prisma.category.delete({
      where: { id: categoryId },
    });

    revalidatePath("/teacher/categories");
    revalidatePath("/admin/categories");
    return { success: "Category deleted successfully!" };
  } catch (error) {
    console.error("Delete category error:", error);
    return { error: "Failed to delete category." };
  }
}
