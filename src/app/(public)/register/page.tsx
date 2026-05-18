import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { makeMetadata } from "@/lib/site";

export const metadata: Metadata = makeMetadata({
  title: "Register",
  description: "Register placeholder page for the LMS platform.",
  path: "/register",
  noIndex: true
});

export default function RegisterPage() {
  return (
    <section className="flex min-h-[70vh] items-center py-16 md:py-24">
      <Container className="max-w-xl">
        <Badge variant="secondary">Create account</Badge>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>Placeholder registration shell only. No auth logic yet.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Input type="text" placeholder="Full name" />
            <Input type="email" placeholder="Email address" />
            <Input type="password" placeholder="Password" />
            <Button type="button">Create account</Button>
          </CardContent>
        </Card>
      </Container>
    </section>
  );
}