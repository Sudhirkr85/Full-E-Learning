import type { ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { adminNav } from "@/lib/site";
import { getCurrentUser } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  return (
    <DashboardShell title="Admin Dashboard" description="A dedicated shell for platform administration pages." nav={adminNav} role={user?.role}>
      {children}
    </DashboardShell>
  );
}