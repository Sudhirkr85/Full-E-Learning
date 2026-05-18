import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { makeMetadata } from "@/lib/site";
import { getCurrentUser, getDashboardPath } from "@/lib/auth";

export const metadata: Metadata = makeMetadata({
  title: "Dashboard",
  description: "Role-aware dashboard entry point for authenticated users.",
  path: "/dashboard",
  noIndex: true
});

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  redirect(getDashboardPath(user.role));
}