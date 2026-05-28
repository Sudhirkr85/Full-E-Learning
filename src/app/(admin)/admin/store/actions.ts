"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { ProductStatus, ProductType } from "@prisma/client";
import { reserveUniqueSlug } from "@/lib/courses/slug";

export async function createProductAction(data: {
  title: string;
  productType: ProductType;
  shortDescription?: string;
  fullDescription?: string;
  coverImageUrl?: string;
  priceInRupees: number;
  status: ProductStatus;
  assetUrl?: string;
  stockQuantity?: number;
  shippingRequired?: boolean;
  dispatchNotes?: string;
  courseId?: string;
  bundleItems?: string[];
}) {
  await requireRole(["ADMIN"]);
  
  if (!data.title) {
    return { error: "Product name is required" };
  }

  const priceCents = Math.round(data.priceInRupees * 100);
  
  const slug = await reserveUniqueSlug(data.title, async (candidate) => {
    const existing = await prisma.product.findUnique({
      where: { slug: candidate }
    });
    return !!existing;
  });

  const product = await prisma.product.create({
    data: {
      title: data.title,
      slug,
      productType: data.productType,
      shortDescription: data.shortDescription || null,
      fullDescription: data.fullDescription || null,
      coverImageUrl: data.coverImageUrl || null,
      priceCents,
      status: data.status,
      assetUrl: data.productType === "DIGITAL_RESOURCE" ? (data.assetUrl || null) : null,
      stockQuantity: data.productType === "PHYSICAL" ? (data.stockQuantity ?? 0) : null,
      shippingRequired: data.productType === "PHYSICAL" ? (data.shippingRequired ?? false) : false,
      dispatchNotes: data.productType === "PHYSICAL" ? (data.dispatchNotes || null) : null,
      courseId: data.productType === "COURSE_ACCESS" ? (data.courseId || null) : null,
      bundleItems: (data.productType === "BUNDLE" ? (data.bundleItems || []) : null) as any,
    }
  });

  revalidatePath("/admin/store");
  return { success: true, productId: product.id };
}

export async function updateProductAction(productId: string, data: {
  title: string;
  productType: ProductType;
  shortDescription?: string;
  fullDescription?: string;
  coverImageUrl?: string;
  priceInRupees: number;
  status: ProductStatus;
  assetUrl?: string;
  stockQuantity?: number;
  shippingRequired?: boolean;
  dispatchNotes?: string;
  courseId?: string;
  bundleItems?: string[];
}) {
  await requireRole(["ADMIN"]);

  const existingProduct = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!existingProduct) {
    return { error: "Product not found" };
  }

  if (!data.title) {
    return { error: "Product name is required" };
  }

  const priceCents = Math.round(data.priceInRupees * 100);
  
  const slug = await reserveUniqueSlug(data.title, async (candidate) => {
    const existing = await prisma.product.findUnique({
      where: { slug: candidate }
    });
    return !!existing && existing.id !== productId;
  }, existingProduct.slug);

  await prisma.product.update({
    where: { id: productId },
    data: {
      title: data.title,
      slug,
      productType: data.productType,
      shortDescription: data.shortDescription || null,
      fullDescription: data.fullDescription || null,
      coverImageUrl: data.coverImageUrl || null,
      priceCents,
      status: data.status,
      assetUrl: data.productType === "DIGITAL_RESOURCE" ? (data.assetUrl || null) : null,
      stockQuantity: data.productType === "PHYSICAL" ? (data.stockQuantity ?? 0) : null,
      shippingRequired: data.productType === "PHYSICAL" ? (data.shippingRequired ?? false) : false,
      dispatchNotes: data.productType === "PHYSICAL" ? (data.dispatchNotes || null) : null,
      courseId: data.productType === "COURSE_ACCESS" ? (data.courseId || null) : null,
      bundleItems: (data.productType === "BUNDLE" ? (data.bundleItems || []) : null) as any,
    }
  });

  revalidatePath("/admin/store");
  return { success: true };
}

export async function deleteProductAction(productId: string) {
  await requireRole(["ADMIN"]);
  
  await prisma.product.delete({
    where: { id: productId }
  });

  revalidatePath("/admin/store");
  return { success: true };
}

export async function toggleProductStatusAction(productId: string, currentStatus: ProductStatus) {
  await requireRole(["ADMIN"]);
  
  const newStatus = currentStatus === "PUBLISHED" ? ProductStatus.DRAFT : ProductStatus.PUBLISHED;

  await prisma.product.update({
    where: { id: productId },
    data: { status: newStatus }
  });

  revalidatePath("/admin/store");
  return { success: true };
}
