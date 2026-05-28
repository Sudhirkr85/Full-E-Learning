import type { ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { teacherNav } from "@/lib/site";
import { getCurrentUser } from "@/lib/auth";

export default async function TeacherLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  return (
    <DashboardShell
      title="Teacher Dashboard"
      description="A dedicated shell for instructor-focused pages."
      nav={teacherNav}
      role={user?.role}
    >
      {children}
    </DashboardShell>
  );
}