import Link from "next/link";
import { Container } from "@/components/ui/container";
import { footerNav, siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/80 bg-background/80">
      <Container className="grid gap-8 py-10 md:grid-cols-[1.5fr_1fr] md:items-start">
        <div>
          <p className="font-display text-lg font-semibold text-foreground">{siteConfig.name}</p>
          <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">{siteConfig.description}</p>
        </div>

        <nav className="flex flex-wrap gap-4 md:justify-end">
          {footerNav.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-muted-foreground transition hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>
      <Container className="pb-8 text-xs text-muted-foreground">© {new Date().getFullYear()} {siteConfig.name}</Container>
    </footer>
  );
}