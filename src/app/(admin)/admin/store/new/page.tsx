import type { Metadata } from "next";
import { makeMetadata } from "@/lib/site";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "../product-form";

export const metadata: Metadata = makeMetadata({
  title: "Add Store Product - Admin Desk",
  description: "Create digital downloads, physical goodies, bundles, or direct LMS course accesses.",
  path: "/admin/store/new",
  noIndex: true
});

export const dynamic = "force-dynamic";

export default async function AdminNewProductPage() {
  await requireRole(["ADMIN"]);

  // Fetch published courses and existing digital products concurrently for conditional bindings
  const [publishedCourses, digitalProducts] = await Promise.all([
    prisma.course.findMany({
      where: { status: "PUBLISHED" },
      select: { id: true, title: true },
      orderBy: { title: "asc" }
    }),
    prisma.product.findMany({
      where: { productType: "DIGITAL_RESOURCE" },
      select: { id: true, title: true },
      orderBy: { title: "asc" }
    })
  ]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <ProductForm courses={publishedCourses} digitalProducts={digitalProducts} />
    </div>
  );
}
