import type { ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { teacherNav } from "@/lib/site";

export default function TeacherLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardShell title="Teacher Dashboard" description="A dedicated shell for instructor-focused pages." nav={teacherNav}>
      {children}
    </DashboardShell>
  );
}