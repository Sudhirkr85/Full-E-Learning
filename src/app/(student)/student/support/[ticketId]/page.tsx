import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { makeMetadata } from "@/lib/site";
import { TicketClient } from "./ticket-client";

interface TicketPageProps {
  params: Promise<{
    ticketId: string;
  }>;
}

export const metadata: Metadata = makeMetadata({
  title: "Ticket Conversation",
  description: "Threaded support conversation between learner and help desk.",
  path: "/student/support",
  noIndex: true,
});

export default async function StudentTicketDetailsPage({ params }: TicketPageProps) {
  const user = await requireUser();
  const { ticketId } = await params;

  const ticket = await prisma.supportTicket.findUnique({
    where: { id: ticketId },
    include: {
      reporter: {
        select: { id: true, name: true, email: true, image: true },
      },
      assignedTo: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  if (!ticket) {
    notFound();
  }

  // Security check: Only the student who raised the ticket can view it inside the student namespace
  if (ticket.reporterId !== user.id) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <TicketClient ticket={ticket} user={user} />
    </div>
  );
}
