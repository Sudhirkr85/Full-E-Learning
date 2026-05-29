import type { Metadata } from "next";
import { makeMetadata } from "@/lib/site";
import { requireRole } from "@/lib/auth";
import { ProfileForm } from "@/components/profile/profile-form";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = makeMetadata({
  title: "Admin Profile",
  description: "View and edit your administrator profile preferences.",
  path: "/admin/profile",
  noIndex: true,
});

export default async function AdminProfilePage() {
  // Enforce ADMIN role check on the server
  const user = await requireRole(["ADMIN"]);

  const profileData = {
    name: user.name,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    image: user.image,
    role: user.role,
    createdAt: user.createdAt.toISOString()
  };

  return (
    <div className="space-y-6">
      <div>
        <Badge variant="secondary">Admin area</Badge>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">Admin Profile Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Configure your personal details, credentials, and avatar preferences below.
        </p>
      </div>

      <div className="mt-8">
        <ProfileForm user={profileData} />
      </div>
    </div>
  );
}
