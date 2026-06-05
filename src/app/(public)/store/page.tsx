import type { Metadata } from "next";
import { makeMetadata } from "@/lib/site";
import { getProductsAction } from "@/lib/store/actions";
import { StoreClient } from "./store-client";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = makeMetadata({
  title: "Learning Store",
  description: "Explore advanced Next.js playbooks, premium glassmorphism Tailwind CSS kits, course bundles, and learning resources.",
  path: "/store"
});

export default async function StorePage() {
  const result = await getProductsAction();
  const products = result.success ? result.products : [];

  const currentUser = await getCurrentUser();
  let profileUser = null;
  let userWishlistedProductIds: string[] = [];

  if (currentUser) {
    const dbUser = await prisma.user.findUnique({
      where: { id: currentUser.id },
      select: {
        email: true,
        name: true,
        phone: true,
        metadata: true,
      }
    });

    if (dbUser) {
      const meta = (dbUser.metadata as Record<string, any>) || {};
      profileUser = {
        email: dbUser.email || "",
        name: dbUser.name || "",
        phone: dbUser.phone || meta.phone || "",
      };
    }

    const dbWishlists = await prisma.productWishlist.findMany({
      where: { userId: currentUser.id },
      select: { productId: true }
    });
    userWishlistedProductIds = dbWishlists.map(w => w.productId);
  }

  return (
    <StoreClient 
      products={products} 
      profileUser={profileUser} 
      userWishlistedProductIds={userWishlistedProductIds} 
    />
  );
}