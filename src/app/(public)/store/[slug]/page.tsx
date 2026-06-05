import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Package, Calendar, Globe, Clock, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { makeMetadata } from "@/lib/site";
import { getProductBySlugAction } from "@/lib/store/actions";
import { DetailClient } from "./detail-client";
import { ReviewsClient } from "./reviews-client";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

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

  // Determine delivery & validity info box values dynamically
  const isPhysical = product.productType === "PHYSICAL";
  const deliveryText = isPhysical ? "Ships in 3-5 days" : "Instant Access";
  const validityText = isPhysical ? "Physical Product" : "Lifetime Pass";

  // Check user session
  const session = await auth();
  const isLoggedIn = !!session?.user?.id;

  let hasPurchased = false;
  let hasReviewed = false;
  let isWishlisted = false;

  if (isLoggedIn && session?.user?.id) {
    const paidOrder = await prisma.order.findFirst({
      where: {
        userId: session.user.id,
        status: "PAID",
        items: {
          some: {
            productId: product.id
          }
        }
      }
    });
    hasPurchased = !!paidOrder;

    const existingReview = await prisma.review.findFirst({
      where: {
        productId: product.id,
        userId: session.user.id
      }
    });
    hasReviewed = !!existingReview;

    const dbWishlist = await prisma.productWishlist.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: product.id
        }
      }
    });
    isWishlisted = !!dbWishlist;
  }

  // --- SECTION 2: TRUST SIGNALS DATA ---
  const salesCount = await prisma.order.count({
    where: {
      status: "PAID",
      items: { some: { productId: product.id } }
    }
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric"
    });
  };

  // --- SECTION 3: CUSTOMER REVIEWS DATA ---
  const reviewsCount = await prisma.review.count({
    where: { productId: product.id }
  });

  const reviews = await prisma.review.findMany({
    where: { productId: product.id },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 4
  });

  const ratingSummary = await prisma.review.aggregate({
    where: { productId: product.id },
    _avg: {
      rating: true
    }
  });

  const avgRating = ratingSummary._avg.rating || null;

  // --- SECTION 4: RELATED PRODUCTS DATA ---
  const related = await prisma.product.findMany({
    where: {
      id: { not: product.id },
      status: "PUBLISHED"
    },
    take: 3,
    orderBy: { createdAt: "desc" }
  });

  return (
    <section className="py-12 md:py-16 bg-[#0a0a0f] min-h-screen text-slate-100 px-4 sm:px-6">
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
                <Badge className="bg-[#0d1117]/90 text-white border border-white/10 py-1.5 px-3 backdrop-blur-sm tracking-wide">
                  {product.productType.replace("_", " ")}
                </Badge>
              </div>
            </div>

            {/* Product Meta Card Details - MODIFIED to 2-box equal width */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="bg-white/5 border border-white/10 rounded-xl text-white text-center p-4">
                <CardContent className="p-0 flex flex-col items-center">
                  <Globe className="h-5 w-5 text-violet-400 mb-1.5" />
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest">Delivery</span>
                  <span className="text-xs font-semibold mt-1">{deliveryText}</span>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border border-white/10 rounded-xl text-white text-center p-4">
                <CardContent className="p-0 flex flex-col items-center">
                  <Calendar className="h-5 w-5 text-violet-400 mb-1.5" />
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest">Validity</span>
                  <span className="text-xs font-semibold mt-1">{validityText}</span>
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

            {/* SECTION 2: TRUST SIGNALS ROW */}
            <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-white/5">
              {salesCount > 0 && (
                <div className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                  <span>👥</span>
                  <span>{salesCount}+ students enrolled</span>
                </div>
              )}
              <div className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                <Clock className="h-3.5 w-3.5 text-slate-500" />
                <span>Updated {formatDate(product.updatedAt)}</span>
              </div>
            </div>

            {/* Interactive Buy Buttons */}
            <DetailClient product={product} isWishlisted={isWishlisted} isLoggedIn={isLoggedIn} />

            {/* Trust Badging */}
            <div className="border-t border-white/10 pt-6 flex items-center justify-between text-xs text-slate-400">
              <span>Secure Encrypted Payments</span>
              <span>100% Satisfaction Guarantee</span>
            </div>
          </div>
        </div>

        {/* SECTION 1: OVERVIEW */}
        {(product.fullDescription || product.description) && (
          <div className="mt-12 bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Package className="h-4.5 w-4.5 text-violet-400" />
              Overview
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {product.fullDescription || product.description}
            </p>
          </div>
        )}

        {/* SECTION 3: CUSTOMER REVIEWS */}
        <ReviewsClient
          productId={product.id}
          initialReviews={reviews.map(r => ({
            id: r.id,
            rating: r.rating,
            comment: r.comment,
            createdAt: r.createdAt,
            user: { name: r.user?.name || "Verified Buyer" }
          }))}
          avgRating={avgRating}
          isLoggedIn={isLoggedIn}
          hasPurchased={hasPurchased}
          hasReviewed={hasReviewed}
          totalReviewsCount={reviewsCount}
        />

        {/* SECTION 4: RELATED PRODUCTS */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-violet-400" />
              You might also like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map(p => (
                <Link key={p.id} href={"/store/" + p.slug}>
                  <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-500/10 hover:border-violet-500/40 transition-all duration-300 flex flex-col h-full group">
                    <div className="relative aspect-video w-full overflow-hidden shrink-0 bg-[#0d1117]/60 border-b border-white/5">
                      {p.coverImageUrl ? (
                        <img 
                          src={p.coverImageUrl} 
                          alt={p.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-violet-600/30 via-indigo-600/20 to-slate-900 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                          <Package className="h-8 w-8 text-violet-400 opacity-60" />
                        </div>
                      )}
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-slate-900/90 text-white border border-white/5 py-0.5 px-2 text-[8px] tracking-wide backdrop-blur-sm uppercase">
                          {p.productType.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col justify-between flex-1 gap-2 bg-transparent">
                      <p className="text-sm font-semibold text-white line-clamp-2 leading-tight group-hover:text-violet-400 transition">
                        {p.title}
                      </p>
                      <p className="text-violet-400 font-bold text-sm mt-1">
                        ₹{(p.priceCents / 100).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
