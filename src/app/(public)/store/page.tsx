import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { makeMetadata } from "@/lib/site";

export const metadata: Metadata = makeMetadata({
  title: "Store",
  description: "Explore the future store area for learning resources, bundles, and add-ons.",
  path: "/store"
});

export default function StorePage() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <Badge variant="secondary">Store</Badge>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-5xl">Learning store</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
          Reserved for future browsing, merchandising, and digital resources. No commerce logic has been added yet.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[
            "Study guides",
            "Course bundles",
            "Teacher resources"
          ].map((item) => (
            <Card key={item}>
              <CardHeader>
                <CardTitle>{item}</CardTitle>
                <CardDescription>Placeholder store category for later product modeling.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" disabled>
                  Coming soon
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}