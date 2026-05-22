import Link from "next/link";
import { Menu } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { mainNav, siteConfig } from "@/lib/site";

import { NotificationHub } from "@/components/notification-hub";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <Container className="flex min-h-16 items-center justify-between gap-4 py-3">
        <Link href="/" className="font-display text-lg font-semibold tracking-tight text-foreground">
          {siteConfig.name}
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {mainNav.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-muted-foreground transition hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <NotificationHub />
          <div className="md:hidden">
            <details className="relative">
              <summary className="list-none">
                <Button type="button" variant="outline" size="icon" aria-label="Open navigation">
                  <Menu className="h-4 w-4" />
                </Button>
              </summary>
              <div className="absolute right-0 mt-3 w-48 rounded-2xl border border-border bg-card p-2 shadow-soft">
                <nav className="flex flex-col gap-1">
                  {mainNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </details>
          </div>
        </div>
      </Container>
    </header>
  );
}