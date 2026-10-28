import type { Metadata } from "next";
import { makeMetadata } from "@/lib/site";
import { requireRole } from "@/lib/auth";
import { getAllUpdatesAdmin } from "@/lib/updates/queries";
import { UpdatesTableClient } from "@/components/admin/updates/updates-table-client";

export const metadata: Metadata = makeMetadata({
  title: "Updates Management - Admin Desk",
  description: "Create, publish, and manage updates, exam alerts, admit cards, and guides.",
  path: "/admin/updates",
  noIndex: true,
});

export const dynamic = "force-dynamic";

export default async function AdminUpdatesPage() {
  await requireRole(["ADMIN"]);

  const updates = await getAllUpdatesAdmin();

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <UpdatesTableClient initialUpdates={updates} />
    </div>
  );
}
