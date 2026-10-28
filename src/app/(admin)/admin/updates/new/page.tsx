import type { Metadata } from "next";
import { makeMetadata } from "@/lib/site";
import { requireRole } from "@/lib/auth";
import { UpdateForm } from "@/components/admin/updates/update-form";

export const metadata: Metadata = makeMetadata({
  title: "New Update - Admin Desk",
  description: "Create a new exam update, admit card notice, or guide.",
  path: "/admin/updates/new",
  noIndex: true,
});

export const dynamic = "force-dynamic";

export default async function NewUpdatePage() {
  await requireRole(["ADMIN"]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Create New Update
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Add an exam alert, admit card announcement, result, or evergreen educational guide.
        </p>
      </div>

      <UpdateForm />
    </div>
  );
}
