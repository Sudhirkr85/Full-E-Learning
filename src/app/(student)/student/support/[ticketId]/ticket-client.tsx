"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { replyToTicketAction, updateTicketStatusAction } from "@/lib/support/actions";
import { TicketStatus, TicketPriority } from "@prisma/client";
import { 
  ArrowLeft, 
  MessageSquare, 
  Clock, 
  User, 
  ShieldCheck, 
  CheckCircle, 
  Send,
  Loader2,
  AlertTriangle
} from "lucide-react";

interface TicketClientProps {
  ticket: any;
  user: any;
}

export function TicketClient({ ticket, user }: TicketClientProps) {
  const router = useRouter();
  const [reply, setReply] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isStatusPending, startStatusTransition] = useTransition();

  // Load existing messages
  let thread: any[] = [];
  if (ticket.metadata) {
    try {
      const parsed = typeof ticket.metadata === "string" 
        ? JSON.parse(ticket.metadata) 
        : ticket.metadata;
      if (Array.isArray(parsed)) {
        thread = parsed;
      }
    } catch (e) {
      console.warn("Failed to parse ticket thread metadata.");
    }
  }

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) return;

    startTransition(async () => {
      const res = await replyToTicketAction(ticket.id, reply);
      if (res.success) {
        setReply("");
        router.refresh();
      }
    });
  };

  const handleMarkResolved = () => {
    startStatusTransition(async () => {
      const res = await updateTicketStatusAction(ticket.id, TicketStatus.RESOLVED);
      if (res.success) {
        router.refresh();
      }
    });
  };

  const getStatusStyle = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.OPEN:
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case TicketStatus.IN_PROGRESS:
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case TicketStatus.WAITING_ON_USER:
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case TicketStatus.RESOLVED:
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case TicketStatus.CLOSED:
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
    }
  };

  const getPriorityStyle = (priority: TicketPriority) => {
    switch (priority) {
      case TicketPriority.LOW:
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/10";
      case TicketPriority.MEDIUM:
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/10";
      case TicketPriority.HIGH:
        return "bg-amber-500/10 text-amber-400 border-amber-500/10";
      case TicketPriority.URGENT:
        return "bg-rose-500/10 text-rose-400 border-rose-500/10";
    }
  };

  const isResolvedOrClosed = ticket.status === TicketStatus.RESOLVED || ticket.status === TicketStatus.CLOSED;

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link 
          href="/student/support" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Support tickets
        </Link>

        {(!isResolvedOrClosed) && (
          <Button 
            onClick={handleMarkResolved} 
            disabled={isStatusPending}
            variant="outline" 
            className="border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 gap-2 shadow-sm font-medium"
          >
            {isStatusPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            Mark as Resolved
          </Button>
        )}
      </div>

      {/* Ticket Details Panel */}
      <Card className="bg-background/40 backdrop-blur-md border-muted/20 shadow-lg">
        <CardHeader className="p-6 border-b border-muted/10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={`border ${getStatusStyle(ticket.status)}`} variant="outline">
                  {ticket.status.replace("_", " ")}
                </Badge>
                <Badge className={`border ${getPriorityStyle(ticket.priority)}`} variant="outline">
                  {ticket.priority} Priority
                </Badge>
                <Badge variant="secondary" className="bg-muted/10 border border-muted/20">
                  {ticket.category || "General"}
                </Badge>
              </div>
              <CardTitle className="font-display text-2xl font-bold tracking-tight mt-1 text-foreground">
                {ticket.subject}
              </CardTitle>
            </div>
            
            <div className="flex flex-col text-xs text-muted-foreground sm:text-right space-y-1">
              <div className="flex items-center gap-1.5 justify-start sm:justify-end">
                <Clock className="h-3.5 w-3.5" />
                <span>Opened on {new Date(ticket.createdAt).toLocaleString()}</span>
              </div>
              {ticket.assignedTo && (
                <div className="flex items-center gap-1.5 justify-start sm:justify-end text-primary/80">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Assigned to: {ticket.assignedTo.name || ticket.assignedTo.email}</span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Thread Timeline */}
          <div className="space-y-6">
            {/* The Initial inquiry */}
            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 shadow-sm border border-primary/20">
                <User className="h-5 w-5" />
              </div>
              <div className="flex-1 space-y-1.5 bg-background/20 rounded-xl p-4 border border-muted/10">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">
                    {ticket.reporter.name || ticket.reporter.email}
                  </span>
                  <span className="text-xs text-muted-foreground">Original Ticket Creator</span>
                </div>
                <p className="text-sm text-foreground/95 leading-relaxed whitespace-pre-wrap">
                  {ticket.message}
                </p>
              </div>
            </div>

            {/* Iterated Replies */}
            {thread.map((msg, index) => {
              const isStaff = ["ADMIN", "TEACHER"].includes(msg.authorRole);
              return (
                <div key={index} className={`flex gap-4 ${isStaff ? "pl-0 md:pl-8" : ""}`}>
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 shadow-sm border ${
                    isStaff 
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/20" 
                      : "bg-primary/10 text-primary border-primary/20"
                  }`}>
                    {isStaff ? (
                      <ShieldCheck className="h-5 w-5" />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </div>
                  
                  <div className={`flex-1 space-y-1.5 rounded-xl p-4 border ${
                    isStaff 
                      ? "bg-amber-500/5 border-amber-500/20 shadow-inner" 
                      : "bg-background/20 border-muted/10"
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">
                          {msg.authorName}
                        </span>
                        {isStaff && (
                          <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px] py-0 px-1.5 font-bold uppercase tracking-wider">
                            Support Agent
                          </Badge>
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(msg.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/95 leading-relaxed whitespace-pre-wrap">
                      {msg.message}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Locked Notice if closed */}
          {isResolvedOrClosed ? (
            <div className="mt-8 p-4 rounded-lg bg-zinc-500/5 border border-zinc-500/20 text-muted-foreground text-sm flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
              <div>
                <p className="font-semibold text-foreground">This support ticket is closed</p>
                <p className="text-xs mt-0.5">The query is marked as resolved. If you require further assistance, please open a new support ticket.</p>
              </div>
            </div>
          ) : (
            /* Reply Form Box */
            <form onSubmit={handleReplySubmit} className="space-y-4 pt-4 border-t border-muted/10">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-primary" /> Write Quick Reply
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Enter message details here to reply back to our support team..."
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  className="flex w-full rounded-md border border-input border-muted/30 bg-background/50 px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[80px]"
                />
              </div>

              <div className="flex items-center justify-end">
                <Button 
                  type="submit" 
                  disabled={isPending || !reply.trim()}
                  className="gap-2 shadow-md min-w-[120px]"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" /> Send Reply
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
