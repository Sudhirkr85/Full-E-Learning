import type { Metadata } from "next";
import { requireRole } from "@/lib/auth";
import { getAdminTicketsAction } from "@/lib/support/actions";
import { prisma } from "@/lib/prisma";
import { makeMetadata } from "@/lib/site";
import { AdminSupportClient } from "./support-client";

export const metadata: Metadata = makeMetadata({
  title: "Support Desk Moderation",
  description: "Platform-wide customer queries, ticket escalations, and issue resolution.",
  path: "/admin/support",
  noIndex: true,
});

export default async function AdminSupportPage() {
  // Enforce ADMIN access control
  const currentUser = await requireRole(["ADMIN"]);
  
  // Fetch tickets
  const ticketsRes = await getAdminTicketsAction();
  const tickets = ticketsRes.success && ticketsRes.tickets ? ticketsRes.tickets : [];

  // Fetch all staff users (ADMIN/TEACHER) to allow assignment
  const staff = await prisma.user.findMany({
    where: {
      role: { in: ["ADMIN", "TEACHER"] },
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
          Support Ticketing Desk
        </h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-3xl">
          Resolve student queries in real-time. View all open threads, assign responsibilities, respond to student escalations, and track resolution timelines.
        </p>
      </div>

      <AdminSupportClient 
        initialTickets={tickets} 
        staff={staff} 
        currentUser={currentUser} 
      />
    </div>
  );
}
