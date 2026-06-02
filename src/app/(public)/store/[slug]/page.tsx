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
  const price = product.priceCents / 100;
  const originalPrice = product.originalPriceCents ? product.originalPriceCents / 100 : null;
  const hasDiscount = originalPrice !== null && originalPrice > price && price > 0;
  const discountPercent = hasDiscount ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  // Extract meta data
  const meta: any = product.metadata || {};
  const benefits: string[] = meta.benefits || [
    "Instant digital deployment",
    "Verified lifetime license code",
    "Comprehensive guides and checklists",
    "Free future architecture updates"
  ];

  return (
    <section className="py-12 md:py-16 bg-[#0a0a0f] min-h-screen text-slate-100">
      <Container>
        {/* Back Link */}
        <Button asChild variant="ghost" size="sm" className="mb-8 p-0 hover:bg-transparent">
          <Link href="/store" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
            Back to Catalog
          </Link>
        </Button>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Cover Media Container */}
          <div className="space-y-6">
            <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden border border-white/10 bg-white/5 shadow-2xl">
              <img
                src={product.coverImageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80"}
                alt={product.title}
                className="object-cover w-full h-full"
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-[#0d1117] text-white border border-white/10 py-1.5 px-3 backdrop-blur-sm tracking-wide">
                  {product.productType.replace("_", " ")}
                </Badge>
              </div>
            </div>

            {/* Product Meta Card Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Card className="bg-white/5 border border-white/10 rounded-xl text-white text-center p-4">
                <CardContent className="p-0 flex flex-col items-center">
                  <Globe className="h-5 w-5 text-violet-400 mb-1.5" />
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest">Delivery</span>
                  <span className="text-xs font-semibold mt-1">Instant Access</span>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border border-white/10 rounded-xl text-white text-center p-4">
                <CardContent className="p-0 flex flex-col items-center">
                  <Calendar className="h-5 w-5 text-violet-400 mb-1.5" />
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest">Validity</span>
                  <span className="text-xs font-semibold mt-1">Lifetime Pass</span>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border border-white/10 rounded-xl text-white text-center p-4">
                <CardContent className="p-0 flex flex-col items-center">
                  <BadgeDollarSign className="h-5 w-5 text-violet-400 mb-1.5" />
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest">Currency</span>
                  <span className="text-xs font-semibold mt-1">INR / ₹</span>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Pricing & Checkout summary container */}
          <div className="space-y-8 lg:sticky lg:top-24">
            <div className="space-y-4">
              <Badge variant="outline" className="border-white/10 text-slate-300 bg-white/5">
                {product.productType.replace("_", " ")}
              </Badge>
              <h1 className="font-display text-3xl font-bold tracking-tight text-white leading-tight">
                {product.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <span className="text-3xl font-extrabold text-white">
                  <span className="text-violet-400">₹</span>
                  {price.toLocaleString("en-IN")}
                </span>
                {hasDiscount && (
                  <>
                    <span className="line-through text-slate-500 text-base font-semibold">
                      ₹{originalPrice.toLocaleString("en-IN")}
                    </span>
                    <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 uppercase tracking-wide">
                      {discountPercent}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <h3 className="font-semibold text-sm text-white uppercase tracking-wider mb-4">Features & Benefits</h3>
              <ul className="space-y-3">
                {benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <CheckCircle className="h-5 w-5 text-violet-400 flex-shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Interactive Buy Buttons */}
            <DetailClient product={product} />

            {/* Trust Badging */}
            <div className="border-t border-white/10 pt-6 flex items-center justify-between text-xs text-slate-400">
              <span>Secure Encrypted Payments</span>
              <span>100% Satisfaction Guarantee</span>
            </div>
          </div>
        </div>

        {/* Detailed Long Description */}
        <div className="mt-16 border-t border-white/10 pt-10 max-w-4xl">
          <h2 className="font-display text-2xl font-bold mb-6 text-white">Detailed Description</h2>
          <div className="max-w-none text-base text-slate-300 leading-relaxed space-y-4">
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
