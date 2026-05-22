import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle, HelpCircle, Package, GraduationCap, Archive, Calendar, Globe, BadgeDollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { makeMetadata } from "@/lib/site";
import { getProductBySlugAction } from "@/lib/store/actions";
import { DetailClient } from "./detail-client";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const res = await getProductBySlugAction(slug);
  const title = res.success && res.product ? res.product.title : "Product Details";
  const desc = res.success && res.product ? res.product.description ?? "Store product" : "Learning Store product details.";
  
  return makeMetadata({
    title: `${title} | Store`,
    description: desc,
    path: `/store/${slug}`,
  });
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const res = await getProductBySlugAction(slug);

  if (!res.success || !res.product) {
    notFound();
  }

  const product = res.product;
  const formattedPrice = (product.priceCents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: product.currency,
  });

  // Extract meta data
  const meta: any = product.metadata || {};
  const benefits: string[] = meta.benefits || [
    "Instant digital deployment",
    "Verified lifetime license code",
    "Comprehensive guides and checklists",
    "Free future architecture updates"
  ];

  return (
    <section className="py-12 md:py-16 bg-muted/20 min-h-screen">
      <Container>
        {/* Back Link */}
        <Button asChild variant="ghost" size="sm" className="mb-8">
          <Link href="/store" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Catalog
          </Link>
        </Button>

        {/* Product Grid */}
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          {/* Cover Media Container */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden border border-border bg-card shadow-soft">
              <img
                src={product.coverImageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80"}
                alt={product.title}
                className="object-cover w-full h-full"
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-slate-900/90 text-white border-none py-1.5 px-3 backdrop-blur-sm tracking-wide">
                  {product.productType.replace("_", " ")}
                </Badge>
              </div>
            </div>

            {/* Product Meta Card Details */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="border-border/50 text-center p-4">
                <CardContent className="p-0 flex flex-col items-center">
                  <Globe className="h-5 w-5 text-amber-500 mb-1.5" />
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Delivery</span>
                  <span className="text-xs font-semibold mt-1">Instant Access</span>
                </CardContent>
              </Card>
              <Card className="border-border/50 text-center p-4">
                <CardContent className="p-0 flex flex-col items-center">
                  <Calendar className="h-5 w-5 text-amber-500 mb-1.5" />
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Validity</span>
                  <span className="text-xs font-semibold mt-1">Lifetime Pass</span>
                </CardContent>
              </Card>
              <Card className="border-border/50 text-center p-4">
                <CardContent className="p-0 flex flex-col items-center">
                  <BadgeDollarSign className="h-5 w-5 text-amber-500 mb-1.5" />
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Currency</span>
                  <span className="text-xs font-semibold mt-1">{product.currency} Only</span>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Pricing & Checkout summary container */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <Badge variant="outline" className="border-amber-500/30 text-amber-500 bg-amber-500/[0.03]">
                {product.productType.replace("_", " ")}
              </Badge>
              <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl leading-tight">
                {product.title}
              </h1>
              <p className="text-2xl font-extrabold text-foreground tracking-tight pt-1">
                {formattedPrice}
              </p>
            </div>

            <div className="border-t border-border/80 pt-6">
              <h3 className="font-semibold text-sm text-foreground uppercase tracking-wider mb-4">Features & Benefits</h3>
              <ul className="space-y-3">
                {benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <CheckCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Interactive Buy Buttons */}
            <DetailClient product={product} />

            {/* Trust Badging */}
            <div className="border-t border-border pt-6 flex items-center justify-between text-xs text-muted-foreground">
              <span>Secure Encrypted Payments</span>
              <span>100% Satisfaction Guarantee</span>
            </div>
          </div>
        </div>

        {/* Detailed Long Description */}
        <div className="mt-16 border-t border-border/80 pt-10 max-w-4xl">
          <h2 className="font-display text-2xl font-bold mb-6 text-foreground">Detailed Description</h2>
          <div className="prose prose-slate dark:prose-invert max-w-none text-base text-muted-foreground leading-8 space-y-4">
            <p>{product.description}</p>
            <p>
              When purchasing this resource, the license registration token gets deployed to your billing dashboard instantly. 
              If the product is an interactive Course Access Pass, your learning credentials will be upgraded server-side immediately after payment verification, and you can jump straight into the class dashboard to track progress.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
