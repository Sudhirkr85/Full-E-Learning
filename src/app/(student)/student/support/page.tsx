import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { getStudentTicketsAction } from "@/lib/support/actions";
import { makeMetadata } from "@/lib/site";
import { SupportClient } from "./support-client";

export const metadata: Metadata = makeMetadata({
  title: "Support Tickets",
  description: "Raise queries, track issues, and communicate with support staff.",
  path: "/student/support",
  noIndex: true,
});

export default async function StudentSupportPage() {
  const user = await requireUser();
  const res = await getStudentTicketsAction();
  const tickets = res.success && res.tickets ? res.tickets : [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-3xl">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
            Support Center
          </h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Need help? Raise a support ticket for technical, billing, or course questions, and track active conversations with our assistance desk.
          </p>
        </div>
      </div>

      <SupportClient initialTickets={tickets} user={user} />
    </div>
  );
}
