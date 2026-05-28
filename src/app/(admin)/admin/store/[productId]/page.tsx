import type { Metadata } from "next";
import { makeMetadata } from "@/lib/site";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductForm } from "../product-form";
import Link from "next/link";

type EditProductPageProps = {
  params: Promise<{
    productId: string;
  }>;
};

export async function generateMetadata({ params }: EditProductPageProps): Promise<Metadata> {
  const { productId } = await params;
  return makeMetadata({
    title: `Edit Product ${productId} - Admin Desk`,
    description: "Modify digital downloads, stock merchandise levels, course bindings, or custom combo bundles.",
    path: `/admin/store/${productId}`,
    noIndex: true
  });
}

export const dynamic = "force-dynamic";

export default async function AdminEditProductPage({ params }: EditProductPageProps) {
  await requireRole(["ADMIN"]);
  const { productId } = await params;

  // Fetch product, published courses, and digital products concurrently
  const [product, publishedCourses, digitalProducts] = await Promise.all([
    prisma.product.findUnique({
      where: { id: productId }
    }),
    prisma.course.findMany({
      where: { status: "PUBLISHED" },
      select: { id: true, title: true },
      orderBy: { title: "asc" }
    }),
    prisma.product.findMany({
      where: { productType: "DIGITAL_RESOURCE", NOT: { id: productId } },
      select: { id: true, title: true },
      orderBy: { title: "asc" }
    })
  ]);

  if (!product) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto px-4 py-16 text-center">
        <Badge variant="secondary" className="bg-red-500/20 text-red-300 border-red-500/30">Product not found</Badge>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-white">Product unavailable</h1>
        <p className="mt-4 text-slate-400 max-w-md mx-auto">This product ID does not match any current catalog offering.</p>
        <Button className="mt-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl" asChild>
          <Link href="/admin/store">Back to Store Catalog</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <ProductForm initialProduct={product} courses={publishedCourses} digitalProducts={digitalProducts} />
    </div>
  );
}
