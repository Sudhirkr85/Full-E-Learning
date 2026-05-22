"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createTicketAction } from "@/lib/support/actions";
import { TicketPriority, TicketStatus } from "@prisma/client";
import { 
  Plus, 
  Search, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Inbox, 
  ChevronRight, 
  Loader2, 
  HelpCircle,
  X
} from "lucide-react";

interface SupportClientProps {
  initialTickets: any[];
  user: any;
}

export function SupportClient({ initialTickets, user }: SupportClientProps) {
  const [tickets, setTickets] = useState(initialTickets);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  
  // New ticket modal state
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState<TicketPriority>(TicketPriority.MEDIUM);
  const [category, setCategory] = useState("General");
  const [error, setError] = useState<string | null>(null);
  
  const [isPending, startTransition] = useTransition();

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!subject.trim() || !message.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    startTransition(async () => {
      const res = await createTicketAction({
        subject,
        message,
        priority,
        category
      });

      if (res.success && res.ticket) {
        setTickets([res.ticket, ...tickets]);
        setIsOpen(false);
        setSubject("");
        setMessage("");
        setPriority(TicketPriority.MEDIUM);
        setCategory("General");
      } else {
        setError(res.error || "Failed to submit ticket.");
      }
    });
  };

  const getStatusStyle = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.OPEN:
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20";
      case TicketStatus.IN_PROGRESS:
        return "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20";
      case TicketStatus.WAITING_ON_USER:
        return "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 border-purple-500/20";
      case TicketStatus.RESOLVED:
        return "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20";
      case TicketStatus.CLOSED:
        return "bg-zinc-500/10 text-zinc-400 hover:bg-zinc-500/20 border-zinc-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-400 hover:bg-zinc-500/20 border-zinc-500/20";
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
        return "bg-rose-500/10 text-rose-400 border-rose-500/10 animate-pulse";
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(search.toLowerCase()) ||
      (ticket.category && ticket.category.toLowerCase().includes(search.toLowerCase()));
    
    const matchesStatus = statusFilter === "ALL" || ticket.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Search & Actions Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by subject or category..."
            className="pl-9 bg-background/50 backdrop-blur-sm focus-visible:ring-primary border-muted/30"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Status filter buttons */}
          <div className="flex border border-muted/30 rounded-lg p-0.5 bg-background/30 backdrop-blur-sm text-xs">
            {["ALL", "OPEN", "IN_PROGRESS", "RESOLVED"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                  statusFilter === status 
                    ? "bg-primary text-primary-foreground shadow" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {status === "ALL" ? "All" : status.replace("_", " ")}
              </button>
            ))}
          </div>

          <Button onClick={() => setIsOpen(true)} className="gap-2 shadow-md">
            <Plus className="h-4 w-4" /> Open Ticket
          </Button>
        </div>
      </div>

      {/* Tickets List */}
      <div className="grid gap-4">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => (
            <Link key={ticket.id} href={`/student/support/${ticket.id}`} className="block group">
              <Card className="bg-background/40 hover:bg-background/60 backdrop-blur-md transition-all duration-300 border-muted/20 hover:border-primary/20 shadow-sm hover:shadow-md">
                <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={`border ${getStatusStyle(ticket.status)}`} variant="outline">
                        {ticket.status.replace("_", " ")}
                      </Badge>
                      <Badge className={`border ${getPriorityStyle(ticket.priority)}`} variant="outline">
                        {ticket.priority}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {ticket.category || "General"}
                      </span>
                    </div>

                    <h3 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                      {ticket.subject}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground line-clamp-1 max-w-4xl">
                      {ticket.message}
                    </p>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 text-xs text-muted-foreground border-t border-muted/10 md:border-none pt-3 md:pt-0">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                      </div>
                      
                      {ticket.metadata && (
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span>
                            {(() => {
                              try {
                                const parsed = typeof ticket.metadata === "string" 
                                  ? JSON.parse(ticket.metadata) 
                                  : ticket.metadata;
                                return Array.isArray(parsed) ? parsed.length : 0;
                              } catch {
                                return 0;
                              }
                            })()}{" "}
                            replies
                          </span>
                        </div>
                      )}
                    </div>

                    <ChevronRight className="h-5 w-5 text-muted-foreground/50 group-hover:text-primary transition-transform group-hover:translate-x-1 hidden md:block" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <Card className="border-dashed border-muted/40 bg-background/20 backdrop-blur-sm p-12 text-center">
            <CardContent className="flex flex-col items-center justify-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-muted/10 flex items-center justify-center text-muted-foreground">
                <Inbox className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-lg">No support tickets found</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  {search || statusFilter !== "ALL" 
                    ? "Adjust your filters or query to find matching tickets." 
                    : "If you have any questions or issues with our services, courses, or billing, open a new ticket."}
                </p>
              </div>
              {(!search && statusFilter === "ALL") && (
                <Button onClick={() => setIsOpen(true)} className="mt-2 gap-2">
                  <Plus className="h-4 w-4" /> Open Your First Ticket
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Ticket Creation Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md transition-opacity">
          <div className="relative w-full max-w-xl bg-background/95 border border-muted/30 shadow-2xl rounded-xl backdrop-blur-xl overflow-hidden p-6 animate-in fade-in-50 zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-muted/20 pb-4 mb-4">
              <div>
                <h2 className="font-display text-xl font-bold flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" /> Open Support Ticket
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Describe your problem, select category, and set a priority level.
                </p>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="rounded-full p-1.5 text-muted-foreground hover:bg-muted/10 hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Subject <span className="text-rose-500">*</span>
                </label>
                <Input
                  required
                  placeholder="Summarize your issue (e.g., Cannot access course lectures)"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="bg-background/50 border-muted/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input border-muted/30 bg-background/50 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="General">General Questions</option>
                    <option value="Course Access">Course Access</option>
                    <option value="Technical Issue">Technical Issue</option>
                    <option value="Billing">Billing & Refunds</option>
                    <option value="Other">Other Query</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Priority Level
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TicketPriority)}
                    className="flex h-9 w-full rounded-md border border-input border-muted/30 bg-background/50 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value={TicketPriority.LOW}>Low</option>
                    <option value={TicketPriority.MEDIUM}>Medium</option>
                    <option value={TicketPriority.HIGH}>High</option>
                    <option value={TicketPriority.URGENT}>Urgent</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Message Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Provide detailed information regarding your problem..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex w-full rounded-md border border-input border-muted/30 bg-background/50 px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[100px]"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-muted/20 mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsOpen(false)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isPending}
                  className="gap-2 shadow-md min-w-[120px]"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                    </>
                  ) : (
                    "Submit Ticket"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
