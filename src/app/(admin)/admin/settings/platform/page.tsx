import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { makeMetadata } from "@/lib/site";
import { prisma } from "@/lib/prisma";
import { PlatformForm } from "./platform-form";

export const metadata: Metadata = makeMetadata({
  title: "Platform Config - Settings",
  description: "Manage system-wide configuration, brand metadata, and maintenance states.",
  path: "/admin/settings/platform",
  noIndex: true
});

export default async function PlatformConfigPage() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  // Fetch current platform configuration record from Prisma
  const config = await prisma.platformConfig.findUnique({
    where: { id: "singleton" }
  });

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div>
        <Badge variant="secondary">Admin Settings</Badge>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white">Platform Config</h1>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
          Manage system metadata, brand identities, and site-wide configuration variables stored in the database.
        </p>
      </div>

      <PlatformForm initialConfig={config} />
    </div>
  );
}
