import type { ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { studentNav } from "@/lib/site";

export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardShell title="Student Dashboard" description="A dedicated shell for learner-focused pages." nav={studentNav}>
      {children}
    </DashboardShell>
  );
}