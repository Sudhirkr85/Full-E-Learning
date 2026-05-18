import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { makeMetadata } from "@/lib/site";
import { registerAction } from "./actions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = makeMetadata({
  title: "Register",
  description: "Create a new LMS account.",
  path: "/register",
  noIndex: true
});

type RegisterPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const session = await auth();

  if (session?.user?.id) {
    redirect("/dashboard");
  }

  const params = searchParams ? await searchParams : undefined;
  const errorMessage = params?.error === "email_exists" ? "An account with that email already exists." : params?.error === "invalid_input" ? "Check the form fields and try again." : null;

  return (
    <section className="flex min-h-[70vh] items-center py-16 md:py-24">
      <Container className="max-w-xl">
        <Badge variant="secondary">Create account</Badge>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>Create a student account to access the platform.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {errorMessage ? <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{errorMessage}</p> : null}
            <form action={registerAction} className="grid gap-4">
              <Input type="text" name="name" placeholder="Full name" autoComplete="name" required />
              <Input type="email" name="email" placeholder="Email address" autoComplete="email" required />
              <Input type="password" name="password" placeholder="Password" autoComplete="new-password" required />
              <Input type="password" name="confirmPassword" placeholder="Confirm password" autoComplete="new-password" required />
              <Button type="submit">Create account</Button>
            </form>
            <p className="text-sm text-muted-foreground">
              Already have an account? <Link href="/login" className="font-medium text-foreground underline underline-offset-4">Sign in</Link>
            </p>
          </CardContent>
        </Card>
      </Container>
    </section>
  );
}