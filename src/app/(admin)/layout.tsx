import type { ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { adminNav } from "@/lib/site";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardShell title="Admin Dashboard" description="A dedicated shell for platform administration pages." nav={adminNav}>
      {children}
    </DashboardShell>
  );
}