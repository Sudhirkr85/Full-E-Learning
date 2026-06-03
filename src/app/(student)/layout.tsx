import type { ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { studentNav } from "@/lib/site";
import { getCurrentUser } from "@/lib/auth";
import { WishlistInitializer } from "@/components/wishlist-initializer";

export default async function StudentLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  return (
    <DashboardShell title="Student Dashboard" description="A dedicated shell for learner-focused pages." nav={studentNav} role={user?.role}>
      <WishlistInitializer isLoggedIn={Boolean(user)} />
      {children}
    </DashboardShell>
  );
}