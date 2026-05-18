import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { makeMetadata } from "@/lib/site";

export const metadata: Metadata = makeMetadata({
  title: "Login",
  description: "Login placeholder page for the LMS platform.",
  path: "/login",
  noIndex: true
});

export default function LoginPage() {
  return (
    <section className="flex min-h-[70vh] items-center py-16 md:py-24">
      <Container className="max-w-xl">
        <Badge variant="secondary">Private access</Badge>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Placeholder form shell only. Authentication logic comes later.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Input type="email" placeholder="Email address" />
            <Input type="password" placeholder="Password" />
            <Button type="button">Sign in</Button>
          </CardContent>
        </Card>
      </Container>
    </section>
  );
}