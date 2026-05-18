import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
};

type DashboardShellProps = {
  title: string;
  description: string;
  nav: NavItem[];
  children: ReactNode;
};

export function DashboardShell({ title, description, nav, children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <Container className="py-6 md:py-8">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="rounded-2xl border border-border bg-card p-4 shadow-soft lg:sticky lg:top-24 lg:h-fit">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Dashboard</p>
              <h1 className="mt-2 font-display text-2xl font-semibold text-foreground">{title}</h1>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
            </div>

            <nav className="mt-6 flex flex-col gap-2">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-xl border border-transparent px-3 py-2 text-sm font-medium text-muted-foreground transition hover:border-border hover:bg-muted hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>

          <main className="rounded-2xl border border-border bg-card p-5 shadow-soft md:p-8">{children}</main>
        </div>
      </Container>
    </div>
  );
}