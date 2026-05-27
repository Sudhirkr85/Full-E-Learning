import type { Metadata } from "next";
import { makeMetadata } from "@/lib/site";
import { requireRole } from "@/lib/auth";
import { ProfileForm } from "@/components/profile/profile-form";

export const metadata: Metadata = makeMetadata({
  title: "My Profile",
  description: "View and edit your student profile information including name, email, and phone.",
  path: "/student/profile",
  noIndex: true
});

export default async function StudentProfilePage() {
  const user = await requireRole(["STUDENT"]);

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

  return <ProfileForm user={profileData} />;
}
