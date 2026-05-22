"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  replyToTicketAction, 
  updateTicketStatusAction, 
  assignTicketAction 
} from "@/lib/support/actions";
import { TicketPriority, TicketStatus } from "@prisma/client";
import { 
  Search, 
  MessageSquare, 
  Clock, 
  User, 
  ShieldCheck, 
  CheckCircle, 
  Send,
  Loader2,
  Inbox,
  AlertTriangle,
  ArrowRight,
  UserCheck,
  Check,
  Power,
  RotateCcw
} from "lucide-react";

interface AdminSupportClientProps {
  initialTickets: any[];
  staff: any[];
  currentUser: any;
}

export function AdminSupportClient({ initialTickets, staff, currentUser }: AdminSupportClientProps) {
  const router = useRouter();
  const [tickets, setTickets] = useState(initialTickets);
  const [activeTicketId, setActiveTicketId] = useState<string | null>(
    initialTickets.length > 0 ? initialTickets[0].id : null
  );
  
  // Filters
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("UNRESOLVED"); // Default to open/in-progress issues
  
  // Thread reply text
  const [replyText, setReplyText] = useState("");

  const [isPending, startTransition] = useTransition();
  const [isAssignPending, startAssignTransition] = useTransition();
  const [isStatusPending, startStatusTransition] = useTransition();

  // Find active ticket details
  const activeTicket = tickets.find(t => t.id === activeTicketId) || null;

  // Filtered tickets
  const filteredTickets = tickets.filter(t => {
    const query = search.toLowerCase();
    const matchesSearch = 
      t.subject.toLowerCase().includes(query) ||
      t.message.toLowerCase().includes(query) ||
      (t.category && t.category.toLowerCase().includes(query)) ||
      (t.reporter.name && t.reporter.name.toLowerCase().includes(query)) ||
      t.reporter.email.toLowerCase().includes(query);

    const matchesPriority = priorityFilter === "ALL" || t.priority === priorityFilter;

    let matchesStatus = true;
    if (statusFilter === "UNRESOLVED") {
      matchesStatus = t.status === TicketStatus.OPEN || t.status === TicketStatus.IN_PROGRESS || t.status === TicketStatus.WAITING_ON_USER;
    } else if (statusFilter !== "ALL") {
      matchesStatus = t.status === statusFilter;
    }

    return matchesSearch && matchesPriority && matchesStatus;
  });

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket || !replyText.trim()) return;

    startTransition(async () => {
      const res = await replyToTicketAction(activeTicket.id, replyText);
      if (res.success && res.ticket) {
        // Update local state ticket data
        const updated = tickets.map(t => t.id === activeTicket.id ? { ...t, status: res.ticket!.status, metadata: res.ticket!.metadata } : t);
        setTickets(updated);
        setReplyText("");
        router.refresh();
      }
    });
  };

  const handleStatusChange = async (status: TicketStatus) => {
    if (!activeTicket) return;

    startStatusTransition(async () => {
      const res = await updateTicketStatusAction(activeTicket.id, status);
      if (res.success && res.ticket) {
        const updated = tickets.map(t => t.id === activeTicket.id ? { ...t, status: res.ticket!.status, resolvedAt: res.ticket!.resolvedAt, closedAt: res.ticket!.closedAt } : t);
        setTickets(updated);
        router.refresh();
      }
    });
  };

  const handleAssignChange = async (staffId: string) => {
    if (!activeTicket) return;

    startAssignTransition(async () => {
      const actualStaffId = staffId === "NONE" ? null : staffId;
      const res = await assignTicketAction(activeTicket.id, actualStaffId);
      if (res.success && res.ticket) {
        // Find assigned staff object
        const assignedStaffObj = staff.find(s => s.id === actualStaffId) || null;
        const updated = tickets.map(t => t.id === activeTicket.id ? { ...t, assignedToId: actualStaffId, assignedTo: assignedStaffObj } : t);
        setTickets(updated);
        router.refresh();
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

  // Get active thread messages
  let activeThread: any[] = [];
  if (activeTicket && activeTicket.metadata) {
    try {
      const parsed = typeof activeTicket.metadata === "string" 
        ? JSON.parse(activeTicket.metadata) 
        : activeTicket.metadata;
      if (Array.isArray(parsed)) {
        activeThread = parsed;
      }
    } catch (e) {
      console.warn("Failed to parse ticket thread metadata.");
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[650px] items-stretch">
      {/* LEFT COLUMN: LISTING & FILTER SURFACES */}
      <div className="lg:col-span-5 flex flex-col space-y-4">
        {/* Filters Panel */}
        <Card className="bg-background/40 backdrop-blur-md border-muted/20 shadow-sm p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search student, subject, categories..."
              className="pl-9 bg-background/50 border-muted/30 focus-visible:ring-primary text-sm h-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            {/* Status Select */}
            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground">Status Filter</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex h-8 w-full rounded-md border border-muted/30 bg-background/40 px-2 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="UNRESOLVED">Unresolved Issues</option>
                <option value="ALL">All Statuses</option>
                <option value={TicketStatus.OPEN}>Open</option>
                <option value={TicketStatus.IN_PROGRESS}>In Progress</option>
                <option value={TicketStatus.WAITING_ON_USER}>Waiting on Student</option>
                <option value={TicketStatus.RESOLVED}>Resolved</option>
                <option value={TicketStatus.CLOSED}>Closed</option>
              </select>
            </div>

            {/* Priority Select */}
            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground">Priority Filter</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="flex h-8 w-full rounded-md border border-muted/30 bg-background/40 px-2 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="ALL">All Priorities</option>
                <option value={TicketPriority.LOW}>Low</option>
                <option value={TicketPriority.MEDIUM}>Medium</option>
                <option value={TicketPriority.HIGH}>High</option>
                <option value={TicketPriority.URGENT}>Urgent</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Master Ticket list */}
        <div className="flex-1 overflow-y-auto max-h-[550px] border border-muted/20 rounded-xl space-y-2 p-1 bg-background/20 backdrop-blur-sm">
          {filteredTickets.length > 0 ? (
            filteredTickets.map((ticket) => (
              <button
                key={ticket.id}
                onClick={() => setActiveTicketId(ticket.id)}
                className={`w-full text-left p-3.5 rounded-lg border transition-all duration-200 block relative ${
                  activeTicketId === ticket.id
                    ? "bg-primary/10 border-primary/30 shadow-sm"
                    : "bg-background/40 hover:bg-background/60 border-muted/10"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground font-semibold truncate max-w-[150px]">
                      {ticket.reporter.name || ticket.reporter.email.split("@")[0]}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className={`font-semibold text-sm truncate leading-tight ${
                    activeTicketId === ticket.id ? "text-primary" : "text-foreground"
                  }`}>
                    {ticket.subject}
                  </h4>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <Badge className={`text-[9px] py-0 px-1 border ${getStatusStyle(ticket.status)}`} variant="outline">
                      {ticket.status.replace("_", " ")}
                    </Badge>
                    <Badge className={`text-[9px] py-0 px-1 border ${getPriorityStyle(ticket.priority)}`} variant="outline">
                      {ticket.priority}
                    </Badge>
                    {ticket.category && (
                      <span className="text-[9px] text-muted-foreground bg-muted/10 border border-muted/20 px-1 rounded">
                        {ticket.category}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground space-y-3 h-40">
              <Inbox className="h-6 w-6 opacity-40" />
              <p className="text-xs">No support tickets match these criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: ACTIVE TICKET DETAIL AND CRM CONTROLS */}
      <div className="lg:col-span-7 flex flex-col">
        {activeTicket ? (
          <Card className="flex-1 flex flex-col bg-background/40 backdrop-blur-md border-muted/20 shadow-md h-full overflow-hidden">
            {/* Ticket CRM Controls Header */}
            <div className="p-4 border-b border-muted/10 flex flex-wrap items-center justify-between gap-4 bg-background/25">
              <div className="space-y-1 max-w-[320px] sm:max-w-[450px]">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge className={`border ${getStatusStyle(activeTicket.status)}`} variant="outline">
                    {activeTicket.status.replace("_", " ")}
                  </Badge>
                  <Badge className={`border ${getPriorityStyle(activeTicket.priority)}`} variant="outline">
                    {activeTicket.priority} Priority
                  </Badge>
                </div>
                <h3 className="font-semibold text-base text-foreground truncate mt-1">
                  {activeTicket.subject}
                </h3>
              </div>

              {/* CRM Dropdowns */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Agent Assignment */}
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Assignee</span>
                  <select
                    value={activeTicket.assignedToId || "NONE"}
                    disabled={isAssignPending}
                    onChange={(e) => handleAssignChange(e.target.value)}
                    className="flex h-7 rounded border border-muted/30 bg-background/50 px-1.5 py-0.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-w-[120px]"
                  >
                    <option value="NONE">Unassigned</option>
                    {staff.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name || s.email} ({s.role.replace("TEACHER", "Staff").replace("ADMIN", "Admin")})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Direct Status Control */}
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Action Status</span>
                  <select
                    value={activeTicket.status}
                    disabled={isStatusPending}
                    onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
                    className="flex h-7 rounded border border-muted/30 bg-background/50 px-1.5 py-0.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-w-[120px]"
                  >
                    <option value={TicketStatus.OPEN}>Mark Open</option>
                    <option value={TicketStatus.IN_PROGRESS}>In Progress</option>
                    <option value={TicketStatus.WAITING_ON_USER}>Awaiting Student</option>
                    <option value={TicketStatus.RESOLVED}>Resolve Issue</option>
                    <option value={TicketStatus.CLOSED}>Close Ticket</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Reporter Information bar */}
            <div className="px-4 py-2 border-b border-muted/10 bg-primary/5 text-xs flex justify-between gap-4 items-center">
              <div className="flex items-center gap-1.5 text-foreground">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Raised by: <strong>{activeTicket.reporter.name ?? "Learner"}</strong> ({activeTicket.reporter.email})</span>
              </div>
              <div className="text-muted-foreground flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{new Date(activeTicket.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* CRM Chat Timeline */}
            <div className="flex-1 p-4 overflow-y-auto max-h-[350px] space-y-4">
              {/* Initial message */}
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0 shadow-sm">
                  <User className="h-4 w-4" />
                </div>
                <div className="flex-1 bg-background/25 rounded-lg p-3 border border-muted/10 space-y-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">{activeTicket.reporter.name || activeTicket.reporter.email}</span>
                    <span>Student Inquiry</span>
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/95">
                    {activeTicket.message}
                  </p>
                </div>
              </div>

              {/* Replies */}
              {activeThread.map((msg, index) => {
                const isStaff = ["ADMIN", "TEACHER"].includes(msg.authorRole);
                return (
                  <div key={index} className={`flex gap-3 ${isStaff ? "pl-6 md:pl-10" : ""}`}>
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 border shadow-sm ${
                      isStaff 
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20" 
                        : "bg-primary/10 text-primary border-primary/20"
                    }`}>
                      {isStaff ? (
                        <ShieldCheck className="h-4 w-4" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </div>
                    
                    <div className={`flex-1 rounded-lg p-3 border ${
                      isStaff 
                        ? "bg-amber-500/5 border-amber-500/20 shadow-inner" 
                        : "bg-background/25 border-muted/10"
                    }`}>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-foreground">{msg.authorName}</span>
                          {isStaff && (
                            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] px-1 font-bold uppercase rounded">
                              Moderator
                            </span>
                          )}
                        </div>
                        <span className="text-[10px]">
                          {new Date(msg.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/95">
                        {msg.message}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Moderation Reply Box */}
            <div className="p-4 border-t border-muted/10 bg-background/20 mt-auto">
              {activeTicket.status === TicketStatus.CLOSED ? (
                <div className="text-center text-xs text-muted-foreground p-2 border border-dashed border-muted/40 rounded flex items-center justify-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-zinc-400" />
                  <span>Closed ticket. Update the Action Status to reopen.</span>
                </div>
              ) : (
                <form onSubmit={handleReplySubmit} className="space-y-3">
                  <div className="relative">
                    <textarea
                      required
                      rows={3}
                      placeholder={`Draft reply to ${activeTicket.reporter.name || "student"}...`}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="flex w-full rounded-md border border-input border-muted/30 bg-background/50 px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[70px] pr-12"
                    />
                    
                    <button
                      type="submit"
                      disabled={isPending || !replyText.trim()}
                      className="absolute right-3 bottom-3 p-1.5 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-40 transition-all flex items-center justify-center shadow"
                    >
                      {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {/* Easy quick actions */}
                  <div className="flex items-center justify-end gap-2 text-xs">
                    {activeTicket.status !== TicketStatus.RESOLVED && (
                      <Button
                        type="button"
                        onClick={() => handleStatusChange(TicketStatus.RESOLVED)}
                        disabled={isStatusPending}
                        variant="outline"
                        className="h-7 text-[10px] px-2 py-0.5 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10 gap-1.5"
                      >
                        <Check className="h-3 w-3" /> Resolve & Notify Student
                      </Button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </Card>
        ) : (
          <Card className="flex-1 flex flex-col items-center justify-center border-dashed border-muted/30 bg-background/20 p-12 text-center h-full">
            <CardContent className="space-y-3 flex flex-col items-center">
              <Inbox className="h-8 w-8 text-muted-foreground opacity-30 animate-pulse" />
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">No active support ticket</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Select a support query from the left master list to begin moderating, assigning roles, and replying.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
