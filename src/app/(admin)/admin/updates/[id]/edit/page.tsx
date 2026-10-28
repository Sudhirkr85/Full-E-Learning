import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { makeMetadata } from "@/lib/site";
import { requireRole } from "@/lib/auth";
import { getUpdateByIdAdmin } from "@/lib/updates/queries";
import { UpdateForm } from "@/components/admin/updates/update-form";

export const metadata: Metadata = makeMetadata({
  title: "Edit Update - Admin Desk",
  description: "Edit an existing update post.",
  path: "/admin/updates/edit",
  noIndex: true,
});

export const dynamic = "force-dynamic";

interface EditUpdatePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditUpdatePage({ params }: EditUpdatePageProps) {
  await requireRole(["ADMIN"]);

  const { id } = await params;
  const update = await getUpdateByIdAdmin(id);

  if (!update) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Edit Update
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Update article content, dates, official links, or publication status.
        </p>
      </div>

      <UpdateForm initialData={update} isEditing={true} />
    </div>
  );
}
