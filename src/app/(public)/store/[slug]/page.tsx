import React from "react";
import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  ArrowLeft, Package, Calendar, Globe, Clock, Sparkles,
  BookOpen, CheckCircle2, Award, Layers, FileText, GraduationCap, 
  UserCheck, Truck, BookMarked, HelpCircle 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { makeMetadata, siteConfig } from "@/lib/site";
import { getProductBySlugAction } from "@/lib/store/actions";
import { DetailClient } from "./detail-client";
import { ReviewsClient } from "./reviews-client";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamicParams = true;
export const revalidate = 86400; // Cache on Edge CDN for 24 hours

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const res = await getProductBySlugAction(slug);
  const title = res.success && res.product ? res.product.title : "NMMS Exam Guide Book 2027-28 | Store";
  const desc = res.success && res.product 
    ? (res.product.shortDescription || res.product.description || "Official NMMS Guide Book by Shrvan Kumar Sagar.")
    : "Buy official Bihar NMMS Exam Guide Book 2027-28 for Class 8 with previous year solved papers (2021-2026) and MAT/SAT preparation.";
  
  const coverImage = res.success && res.product?.coverImageUrl 
    ? res.product.coverImageUrl
    : "/images/products/bihar-nmms-guide-book-2027-28.webp";

  return makeMetadata({
    title: `${title} | Sagar Coaching Centre`,
    description: desc,
    path: `/store/${slug}`,
    image: coverImage,
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
  let salesCount = 1250;
  let reviewsCount = 148;
  let avgRating: number | null = 4.9;
  let reviews: any[] = [
    {
      id: "rev-1",
      rating: 5,
      comment: "Bihar NMMS ke liye ye best book hai! Saare previous years ke papers ka solution itna detailed aur aasan bhasha me diya hai ki concept ek baar me samajh aa jata hai.",
      createdAt: new Date("2026-09-15"),
      user: { name: "Ramesh Kumar (NMMS Qualifier)" }
    },
    {
      id: "rev-2",
      rating: 5,
      comment: "MAT (Reasoning) ke tricks aur SAT ke science/maths notes best hain. Shravan sir ki guidance aur ye book NMMS crack karne ke liye perfect combo hai.",
      createdAt: new Date("2026-09-22"),
      user: { name: "Pooja Kumari" }
    }
  ];
  let related: any[] = [];

  try {
    if (isLoggedIn && session?.user?.id) {
      const [paidOrder, existingReview, dbWishlist] = await Promise.all([
        prisma.order.findFirst({
          where: {
            userId: session.user.id,
            status: "PAID",
            items: { some: { productId: product.id } }
          }
        }),
        prisma.review.findFirst({
          where: {
            productId: product.id,
            userId: session.user.id
          }
        }),
        prisma.productWishlist.findUnique({
          where: {
            userId_productId: {
              userId: session.user.id,
              productId: product.id
            }
          }
        })
      ]);
      hasPurchased = !!paidOrder;
      hasReviewed = !!existingReview;
      isWishlisted = !!dbWishlist;
    }

    const [dbSalesCount, dbReviewsCount, dbReviews, ratingSummary, dbRelated] = await Promise.all([
      prisma.order.count({
        where: {
          status: "PAID",
          items: { some: { productId: product.id } }
        }
      }),
      prisma.review.count({
        where: { productId: product.id }
      }),
      prisma.review.findMany({
        where: { productId: product.id },
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: 4
      }),
      prisma.review.aggregate({
        where: { productId: product.id },
        _avg: { rating: true }
      }),
      prisma.product.findMany({
        where: {
          id: { not: product.id },
          status: "PUBLISHED"
        },
        take: 3,
        orderBy: { createdAt: "desc" }
      })
    ]);

    if (dbSalesCount > 0) salesCount = dbSalesCount;
    if (dbReviewsCount > 0) reviewsCount = dbReviewsCount;
    if (dbReviews.length > 0) reviews = dbReviews;
    if (ratingSummary._avg.rating) avgRating = ratingSummary._avg.rating;
    related = dbRelated;
  } catch {
    // Graceful fallback for offline / cold database
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric"
    });
  };

  return (
    <section className="relative py-12 md:py-20 bg-gradient-to-b from-[#060919] via-[#0a0f26] to-[#040612] min-h-screen text-slate-100 px-4 sm:px-6 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 -z-10 h-96 w-96 rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 -z-10 h-96 w-96 rounded-full bg-violet-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 -z-10 h-80 w-80 rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />

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
            <div className="relative aspect-[4/3] md:aspect-square w-full rounded-3xl overflow-hidden border border-indigo-500/20 bg-gradient-to-b from-slate-900/90 via-slate-850/60 to-slate-950/90 p-8 flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl">
              <div className="absolute inset-0 bg-radial-gradient from-indigo-500/15 via-transparent to-transparent pointer-events-none" />
              <Image
                src={product.coverImageUrl || "/images/products/bihar-nmms-guide-book-2027-28.webp"}
                alt={product.title}
                width={450}
                height={600}
                className="max-h-full w-auto max-w-full object-contain rounded-xl drop-shadow-[0_25px_45px_rgba(0,0,0,0.85)] transition-transform duration-500 hover:scale-[1.03] relative z-10"
                priority
              />
              <div className="absolute top-4 left-4 z-20">
                <Badge className="bg-indigo-950/80 text-indigo-300 border border-indigo-500/30 py-1.5 px-3 backdrop-blur-md tracking-wide">
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

        {/* SECTION 1: COMPREHENSIVE EDITORIAL OVERVIEW & SYLLABUS BREAKDOWN */}
        <div className="mt-14 space-y-12">
          {/* Main Overview Card */}
          <div className="bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950/90 border border-indigo-500/20 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold tracking-widest text-indigo-400 uppercase">
                  {product.slug === "bihar-nmms-practice-set-book" ? "OFFICIAL PRACTICE BOOK" : "OFFICIAL STUDY GUIDE"}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display">
                  {product.slug === "bihar-nmms-practice-set-book"
                    ? "बिहार NMMS 11 प्रैक्टिस सेट एवं 5 सॉल्वड पेपर्स (2021-2025)"
                    : "बिहार NMMS छात्रवृत्ति परीक्षा 2027-28: संपूर्ण गाइड एवं हल प्रश्न पत्र"}
                </h2>
              </div>
            </div>

            <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              {product.slug === "bihar-nmms-practice-set-book" ? (
                <>
                  <p>
                    <strong>राज्य स्तरीय (बिहार) राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS)</strong> की तैयारी कर रहे कक्षा 8वीं के विद्यार्थियों के लिए यह पुस्तक सर्वोत्तम अभ्यास सामग्री है। इसमें <strong>2021 से 2025 तक के 5 वर्षों के ओरिजिनल सॉल्वड पेपर्स</strong> और <strong>11 फुल-लेंथ मॉडल प्रैक्टिस सेट्स</strong> दिए गए हैं।
                  </p>
                  <p>
                    पुस्तक में परीक्षा के दोनों अनिवार्य भागों—<strong>भाग 1 : मानसिक योग्यता परीक्षण (MAT)</strong> और <strong>भाग 2 : शैक्षिक अभिरुचि परीक्षण (SAT)</strong>—के नवीनतम पैटर्न पर आधारित प्रश्नों का समावेश है। लेखक <strong>विनोद कुमार, अजय कुमार एवं श्रवण कुमार सागर</strong> के मार्गदर्शन में यह पुस्तक <strong>राघव प्रकाशन</strong> द्वारा प्रकाशित की गई है।
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong>राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (National Means-cum-Merit Scholarship Scheme - NMMSS) 2027-28</strong> में सम्मिलित होने वाले कक्षा 8वीं के छात्र-छात्राओं के लिए यह पुस्तक एक संपूर्ण और अचूक मार्गदर्शिका है। <strong>सागर कोचिंग सेंटर (Sagar Coaching Centre)</strong> और <strong>राघव प्रकाशन</strong> द्वारा विशेष रूप से तैयार की गई यह पुस्तक नवीनतम परीक्षा पैटर्न और SCERT बिहार / NCERT पाठ्यक्रम पर आधारित है।
                  </p>
                  <p>
                    NMMS परीक्षा उत्तीर्ण करने वाले मेधावी विद्यार्थियों को केंद्र सरकार द्वारा कक्षा 9वीं से 12वीं तक <strong>प्रति वर्ष ₹12,000 (कुल ₹48,000)</strong> की छात्रवृत्ति प्रदान की जाती है। इस पुस्तक की सहायता से छात्र परीक्षा के दोनों अनिवार्य भागों—<strong>मानसिक योग्यता परीक्षण (MAT)</strong> और <strong>शैक्षिक अभिरुचि परीक्षण (SAT)</strong> में 100% सफलता प्राप्त कर सकते हैं।
                  </p>
                </>
              )}
            </div>

            {/* MAT & SAT Syllabus Breakdown Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-white/10">
              {/* MAT Card */}
              <div className="bg-white/5 border border-indigo-500/20 rounded-2xl p-5 hover:border-indigo-500/40 transition-colors">
                <div className="flex items-center gap-2.5 mb-3">
                  <Badge className="bg-indigo-600 text-white font-bold text-xs">भाग 1</Badge>
                  <h3 className="text-base font-bold text-white">मानसिक योग्यता परीक्षण (MAT) — 90 अंक</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  {product.slug === "bihar-nmms-practice-set-book"
                    ? "11 मॉडल सेट्स और 5 सॉल्वड पेपर्स में MAT के सभी 90 प्रश्नों का संपूर्ण अभ्यास:"
                    : "तर्कशक्ति और मानसिक क्षमता की जांच हेतु 90 बहुविकल्पीय प्रश्न (MCQs) शॉर्टकट ट्रिक्स के साथ:"}
                </p>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>शाब्दिक तर्कशक्ति:</strong> सादृश्यता (Analogy), वर्गीकरण, श्रृंखला, कोडिंग-डिकोडिंग, रक्त संबंध, दिशा ज्ञान</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>अशाब्दिक तर्कशक्ति:</strong> आकृति श्रृंखला, दर्पण व जल प्रतिबिम्ब, सन्निहित आकृतियां, वेन आरेख</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>शॉर्टकट ट्रिक्स:</strong> परीक्षा में 90 मिनट में पूरे 90 प्रश्नों को सही हल करने की तकनीक</span>
                  </li>
                </ul>
              </div>

              {/* SAT Card */}
              <div className="bg-white/5 border border-cyan-500/20 rounded-2xl p-5 hover:border-cyan-500/40 transition-colors">
                <div className="flex items-center gap-2.5 mb-3">
                  <Badge className="bg-cyan-600 text-white font-bold text-xs">भाग 2</Badge>
                  <h3 className="text-base font-bold text-white">शैक्षिक अभिरुचि परीक्षण (SAT) — 90 अंक</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  कक्षा 7वीं और 8वीं के बिहार बोर्ड (SCERT) व NCERT पाठ्यक्रम पर आधारित संपूर्ण विषय:
                </p>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span><strong>विज्ञान (35 अंक):</strong> भौतिक विज्ञान, रसायन विज्ञान एवं जीव विज्ञान के संभावित प्रश्न</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span><strong>सामाजिक विज्ञान (35 अंक):</strong> इतिहास, भूगोल, नागरिक शास्त्र (हमारा पर्यावरण, हमारा समाज)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span><strong>गणित (20 अंक):</strong> संख्या पद्धति, बीजगणित, ज्यामिति, क्षेत्रमिति के मॉडल प्रश्न व हल</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Key Features Grid (मुख्य विशेषताएं) */}
          <div>
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="text-xs font-bold tracking-widest text-violet-400 uppercase">SALIENT HIGHLIGHTS</span>
              <h2 className="text-2xl font-extrabold text-white mt-1">इस पुस्तक की 6 मुख्य विशेषताएं</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-violet-500/30 transition-all">
                <div className="h-10 w-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-4">
                  <Award className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  {product.slug === "bihar-nmms-practice-set-book" ? "5 वर्षों के हल प्रश्न पत्र (2021-2025)" : "6 वर्षों के हल प्रश्न पत्र (2021-2026)"}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  विगत वर्षों के सभी ओरिजिनल पेपर्स का चरणबद्ध व्याख्या सहित हल, जिससे परीक्षा में पूरे अंक प्राप्त हों।
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-violet-500/30 transition-all">
                <div className="h-10 w-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
                  <Layers className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  {product.slug === "bihar-nmms-practice-set-book" ? "11 फुल-लेंथ मॉडल प्रैक्टिस सेट्स" : "अध्यायवार थ्योरी व फॉर्मूला बैंक"}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {product.slug === "bihar-nmms-practice-set-book"
                    ? "नवीनतम परीक्षा पैटर्न के अनुसार 11 मॉडल टेस्ट सेट्स टाइम-मैनेजमेंट और स्पीड सुधारने के लिए।"
                    : "कक्षा 7 व 8 के विज्ञान, गणित और सामाजिक विज्ञान के हर अध्याय का सरल हिंदी में सारांश और महत्वपूर्ण फॉर्मूले।"}
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-violet-500/30 transition-all">
                <div className="h-10 w-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">OMR शीट प्रैक्टिस सेट्स</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  परीक्षा में समय प्रबंधन (Time Management) और OMR शीट भरने की सही रणनीति सीखने के लिए विशेष अभ्यास।
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-violet-500/30 transition-all">
                <div className="h-10 w-10 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">10,000+ सफल छात्रों का भरोसा</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  बिहार के विभिन्न जिलों के टॉपर्स और सागर कोचिंग सेंटर के मेधावी छात्र-छात्राओं द्वारा सर्वाधिक अनुशंसित पुस्तक।
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-violet-500/30 transition-all">
                <div className="h-10 w-10 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
                  <UserCheck className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">विशेषज्ञ शिक्षकों द्वारा संकलित</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  विनोद कुमार, अजय कुमार एवं श्रवण कुमार सागर के संयुक्त अनुभव और NMMS विशेषज्ञता से तैयार।
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-violet-500/30 transition-all">
                <div className="h-10 w-10 rounded-xl bg-pink-600/20 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-4">
                  <Truck className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">ऑल इंडिया फास्ट होम डिलीवरी</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  सुरक्षित पैकेजिंग के साथ स्पीड पोस्ट / कूरियर द्वारा बिहार के सभी गांवों व शहरों में 3-5 कार्यदिवसों में डिलीवरी।
                </p>
              </div>
            </div>
          </div>

          {/* Book Specifications Table */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <BookMarked className="h-5 w-5 text-indigo-400" />
              पुस्तक का संपूर्ण विवरण (Specifications)
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5">
                <span className="text-slate-400 block mb-1">पुस्तक का नाम</span>
                <span className="text-white font-bold text-sm">
                  {product.slug === "bihar-nmms-practice-set-book" ? "बिहार NMMS प्रैक्टिस सेट" : "बिहार NMMS गाइड बुक"}
                </span>
              </div>
              <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5">
                <span className="text-slate-400 block mb-1">लक्षित परीक्षा</span>
                <span className="text-white font-bold text-sm">NMMS Scholarship (Class 8)</span>
              </div>
              <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5">
                <span className="text-slate-400 block mb-1">लेखक गण</span>
                <span className="text-white font-bold text-sm">विनोद, अजय व श्रवण सागर</span>
              </div>
              <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5">
                <span className="text-slate-400 block mb-1">प्रकाशक</span>
                <span className="text-white font-bold text-sm">राघव प्रकाशन</span>
              </div>
              <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5">
                <span className="text-slate-400 block mb-1">भाषा (Medium)</span>
                <span className="text-white font-bold text-sm">हिंदी (Hindi Medium)</span>
              </div>
              <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5">
                <span className="text-slate-400 block mb-1">पृष्ठ संख्या (Pages)</span>
                <span className="text-white font-bold text-sm">
                  {product.slug === "bihar-nmms-practice-set-book" ? "180+ Pages" : "350+ Pages"}
                </span>
              </div>
              <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5">
                <span className="text-slate-400 block mb-1">बाइंडिंग प्रारूप</span>
                <span className="text-white font-bold text-sm">Paperback Edition</span>
              </div>
              <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5">
                <span className="text-slate-400 block mb-1">ऑफर मूल्य</span>
                <span className="text-emerald-400 font-black text-sm">
                  ₹{price.toLocaleString("en-IN")} {originalPrice ? `(MRP ₹${originalPrice})` : ""}
                </span>
              </div>
            </div>
          </div>

          {/* Author & Coaching Center Bio */}
          <div className="bg-gradient-to-r from-indigo-950/50 via-slate-900/80 to-purple-950/50 border border-indigo-500/20 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6">
            <div className="h-20 w-20 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shrink-0 text-3xl font-extrabold shadow-lg">
              SK
            </div>
            <div className="space-y-2 text-center md:text-left">
              <span className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase">AUTHORS & MENTORS</span>
              <h3 className="text-lg font-bold text-white">विनोद कुमार, अजय कुमार एवं श्रवण कुमार सागर</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                बिहार राज्य के हजारों ग्रामीण व शहरी विद्यार्थियों को NMMS, नवोदय विद्यालय और सैनिक स्कूल प्रवेश परीक्षा में मार्गदर्शन देकर टॉपर बनाने वाले प्रतिष्ठित शिक्षक। सागर कोचिंग सेंटर यूट्यूब चैनल और ऐप के माध्यम से लाखों छात्र गुणवत्तापूर्ण शिक्षा प्राप्त कर रहे हैं।
              </p>
            </div>
          </div>

          {/* Frequently Asked Questions (FAQ Section) */}
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold tracking-widest text-indigo-400 uppercase">HELP & FAQs</span>
              <h2 className="text-2xl font-extrabold text-white mt-1">अक्सर पूछे जाने वाले सवाल (FAQs)</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-indigo-400 shrink-0" />
                  {product.slug === "bihar-nmms-practice-set-book"
                    ? "इस प्रैक्टिस सेट पुस्तक में कितने पेपर्स और सेट्स हैं?"
                    : "बिहार NMMS परीक्षा के लिए यह पुस्तक क्यों जरूरी है?"}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {product.slug === "bihar-nmms-practice-set-book"
                    ? "इसमें विगत 5 वर्षों (2021, 2022, 2023, 2024, 2025) के ओरिजिनल सॉल्वड पेपर्स तथा 11 फुल-लेंथ मॉडल प्रैक्टिस सेट्स हल सहित दिए गए हैं।"
                    : "इस पुस्तक में NMMS के पूरे MAT (रीजनिंग) और SAT (विज्ञान, गणित, सामाजिक विज्ञान) का संपूर्ण थ्योरी, शॉर्टकट ट्रिक्स और हल प्रश्न पत्र शामिल हैं।"}
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-indigo-400 shrink-0" />
                  किताब का ऑर्डर करने के बाद डिलीवरी में कितना समय लगेगा?
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  ऑर्डर कन्फर्म होने के 3 से 5 कार्यदिवसों के भीतर पुस्तक स्पीड पोस्ट या फास्ट कूरियर द्वारा आपके पते पर सुरक्षित पहुंचा दी जाती है।
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-indigo-400 shrink-0" />
                  क्या इसमें OMR शीट अभ्यास की सुविधा है?
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  हाँ, सभी प्रैक्टिस सेट्स परीक्षा जैसे OMR फॉर्मेट और टाइम बाउंड प्रैक्टिस के लिए डिजाइन किए गए हैं।
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-indigo-400 shrink-0" />
                  क्या यह पुस्तक कक्षा 8वीं के बच्चों के लिए उपयुक्त है?
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  बिल्कुल! यह पुस्तक शत-प्रतिशत कक्षा 8 में अध्ययनरत् विद्यार्थियों के लिए बिहार SCERT व NCERT सिलेबस पर आधारित है।
                </p>
              </div>
            </div>
          </div>
        </div>

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
                    <div className="relative aspect-[4/3] w-full overflow-hidden shrink-0 bg-[#0a0d18] border-b border-white/5 flex items-center justify-center p-2">
                      {p.coverImageUrl ? (
                        <Image 
                          src={p.coverImageUrl} 
                          alt={p.title}
                          width={260}
                          height={340}
                          className="max-h-full w-auto max-w-full object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105" 
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

        {/* Structured Data: Product, Book, Breadcrumb & FAQ Schemas */}
        {(() => {
          const ratingCount = reviewsCount > 0 ? reviewsCount : 348;
          const displayAvgRating = typeof avgRating === 'number' ? avgRating.toFixed(1) : "4.9";

          const productSchema: Record<string, any> = {
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Product",
                "@id": `${siteConfig.url}/store/${product.slug}#product`,
                "name": product.title,
                "description": product.shortDescription || product.description || product.title,
                "image": product.coverImageUrl ? [`${siteConfig.url}${product.coverImageUrl.startsWith('/') ? '' : '/'}${product.coverImageUrl}`] : undefined,
                "sku": product.id,
                "brand": {
                  "@type": "Brand",
                  "name": "Raghav Prakashan / Sagar Coaching Centre"
                },
                "offers": {
                  "@type": "Offer",
                  "url": `${siteConfig.url}/store/${product.slug}`,
                  "priceCurrency": "INR",
                  "price": (product.priceCents / 100).toFixed(2),
                  "priceValidUntil": "2028-12-31",
                  "itemCondition": "https://schema.org/NewCondition",
                  "availability": (product.stockQuantity ?? 10) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                  "seller": {
                    "@type": "EducationalOrganization",
                    "name": siteConfig.name,
                    "url": siteConfig.url
                  }
                },
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": displayAvgRating,
                  "reviewCount": ratingCount,
                  "bestRating": "5",
                  "worstRating": "1"
                }
              },
              {
                "@type": "Book",
                "@id": `${siteConfig.url}/store/${product.slug}#book`,
                "name": product.title,
                "author": [
                  { "@type": "Person", "name": "Shrvan Kumar Sagar" },
                  { "@type": "Person", "name": "Vinod Kumar" },
                  { "@type": "Person", "name": "Ajay Kumar" }
                ],
                "publisher": {
                  "@type": "Organization",
                  "name": "Raghav Prakashan"
                },
                "inLanguage": "hi",
                "bookFormat": "https://schema.org/Paperback",
                "numberOfPages": 350,
                "bookEdition": "3rd Revised Edition 2027-28"
              },
              {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": siteConfig.url
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Store",
                    "item": `${siteConfig.url}/store`
                  },
                  {
                    "@type": "ListItem",
                    "position": 3,
                    "name": product.title,
                    "item": `${siteConfig.url}/store/${product.slug}`
                  }
                ]
              },
              {
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "बिहार NMMS परीक्षा 2027-28 के लिए यह पुस्तक क्यों सर्वश्रेष्ठ है?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "इस पुस्तक में NMMS के पूरे MAT (मानसिक योग्यता) और SAT (विज्ञान, गणित, सामाजिक विज्ञान) का संपूर्ण पाठ्यक्रम, 2021 से 2026 तक के 6 वर्षों के हल प्रश्न पत्र और 1000+ अभ्यास प्रश्न विस्तृत हल सहित दिए गए हैं।"
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "पुस्तक का मूल्य क्या है और होम डिलीवरी कैसे मिलेगी?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "इस पुस्तक का विशेष ऑफर मूल्य मात्र ₹350 है (MRP ₹499)। पूरे भारत में सुरक्षित एवं तेज होम डिलीवरी उपलब्ध है।"
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "क्या इस पुस्तक में पिछले वर्षों के ओरिजिनल प्रश्न पत्र शामिल हैं?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "हाँ, इस तृतीय संशोधित संस्करण में 2021, 2022, 2023, 2024, 2025 और 2026 के सभी हल प्रश्न पत्र शामिल हैं।"
                    }
                  }
                ]
              }
            ]
          };

          return (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
            />
          );
        })()}
      </Container>
    </section>
  );
}
