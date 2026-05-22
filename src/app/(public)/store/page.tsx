import type { Metadata } from "next";
import { makeMetadata } from "@/lib/site";
import { getProductsAction } from "@/lib/store/actions";
import { StoreClient } from "./store-client";

export const metadata: Metadata = makeMetadata({
  title: "Learning Store",
  description: "Explore advanced Next.js playbooks, premium glassmorphism Tailwind CSS kits, course bundles, and learning resources.",
  path: "/store"
});

export default async function StorePage() {
  const result = await getProductsAction();
  const products = result.success ? result.products : [];

  return <StoreClient products={products} />;
}