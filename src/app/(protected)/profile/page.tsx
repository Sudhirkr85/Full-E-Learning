import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { makeMetadata } from "@/lib/site";
import { requireUser } from "@/lib/auth";

export const metadata: Metadata = makeMetadata({
  title: "Profile",
  description: "Authenticated profile page for the LMS platform.",
  path: "/profile",
  noIndex: true
});

export default async function ProfilePage() {
  const user = await requireUser();

  return (
    <section className="py-16 md:py-24">
      <Container className="max-w-3xl">
        <Badge variant="secondary">Profile</Badge>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">Your account</h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">Profile data is read directly from the Prisma user record and session.</p>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>{user.name ?? "Unnamed user"}</CardTitle>
            <CardDescription>{user.role.toLowerCase()}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm text-muted-foreground">
            <p>Email: {user.email}</p>
            <p>First name: {user.firstName ?? "Not set"}</p>
            <p>Last name: {user.lastName ?? "Not set"}</p>
            <p>Bio: {user.bio ?? "Not set"}</p>
            <p>Locale: {user.locale ?? "Not set"}</p>
            <p>Timezone: {user.timezone ?? "Not set"}</p>
          </CardContent>
        </Card>
      </Container>
    </section>
  );
}