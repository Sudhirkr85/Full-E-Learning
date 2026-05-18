import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { makeMetadata } from "@/lib/site";
import { loginAction } from "./actions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = makeMetadata({
  title: "Login",
  description: "Secure login page for the LMS platform.",
  path: "/login",
  noIndex: true
});

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
    registered?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await auth();

  if (session?.user?.id) {
    redirect("/dashboard");
  }

  const params = searchParams ? await searchParams : undefined;
  const errorMessage = params?.error === "invalid_credentials" ? "Invalid email or password." : params?.error === "invalid_input" ? "Check the form fields and try again." : null;
  const successMessage = params?.registered === "1" ? "Account created. You can sign in now." : null;

  return (
    <section className="flex min-h-[70vh] items-center py-16 md:py-24">
      <Container className="max-w-xl">
        <Badge variant="secondary">Private access</Badge>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Sign in with your LMS account to reach the correct role dashboard.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {errorMessage ? <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{errorMessage}</p> : null}
            {successMessage ? <p className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-foreground">{successMessage}</p> : null}
            <form action={loginAction} className="grid gap-4">
              <Input type="email" name="email" placeholder="Email address" autoComplete="email" required />
              <Input type="password" name="password" placeholder="Password" autoComplete="current-password" required />
              <Button type="submit">Sign in</Button>
            </form>
            <p className="text-sm text-muted-foreground">
              New here? <Link href="/register" className="font-medium text-foreground underline underline-offset-4">Create an account</Link>
            </p>
          </CardContent>
        </Card>
      </Container>
    </section>
  );
}