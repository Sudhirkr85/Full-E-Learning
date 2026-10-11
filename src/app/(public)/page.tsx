import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { 
  ArrowRight, 
  GraduationCap, 
  Star, 
  Zap, 
  Award, 
  CheckCircle, 
  TrendingUp, 
  Terminal, 
  Users, 
  Check, 
  HelpCircle, 
  ShieldCheck, 
  Sparkles,
  ChevronRight,
  Code,
  ShoppingBag,
  Package,
  Archive,
  BookOpen
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { makeMetadata, siteConfig } from "@/lib/site";
import { getPublishedCourses } from "@/lib/courses/queries";
import { prisma } from "@/lib/prisma";
import { HeroSection } from "@/components/home/HeroSection";
import { VipTelegramSection } from "@/components/vip-telegram-section";

export const metadata: Metadata = makeMetadata({
  title: "NMMS, Navodaya & Sainik School Coaching | Sagar Coaching Centre",
  description: "India's trusted online coaching for NMMS Scholarship, Jawahar Navodaya Vidyalaya (JNVST), Sainik School (AISSEE), and Shrestha NETS exams. Online preparation and books by Shrvan Kumar Sagar.",
  path: "/"
});

export const revalidate = 86400; // Cache on Edge CDN for 24 hours

export default async function HomePage() {
  const [coursesResult, dbProductsResult, dbReviewsResult] = await Promise.all([
    getPublishedCourses().catch((err) => {
      console.error("[HOMEPAGE] Failed to fetch courses:", err);
      return [];
    }),
    prisma.product.findMany({
      where: { status: { in: ["ACTIVE", "PUBLISHED"] } },
      take: 3,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        priceCents: true,
        originalPriceCents: true,
        productType: true,
        coverImageUrl: true,
      },
    }).catch(() => []),
    prisma.courseReview.findMany({
      where: { status: "PUBLISHED", rating: { gte: 4 } },
      take: 3,
      orderBy: { reviewedAt: "desc" },
      include: {
        enrollment: {
          include: {
            user: { select: { name: true } },
            course: { select: { title: true } }
          }
        }
      }
    }).catch(() => [])
  ]);
  
  const displayCourses = Array.isArray(coursesResult) ? coursesResult : [];
  const dbProducts = Array.isArray(dbProductsResult) ? dbProductsResult : [];
  const dbReviews = Array.isArray(dbReviewsResult) ? dbReviewsResult : [];

  const featuredProducts = dbProducts.length > 0 ? dbProducts : [
    {
      id: "bihar-nmms-exam-book-2027-28-id",
      title: "Bihar NMMS Exam 2027-28 Complete Guide Book (MAT + SAT)",
      slug: "bihar-nmms-exam-book-2027-28",
      description: "Official Guide Book for National Means-cum-Merit Scholarship (NMMS) Examination 2027-28. 2021-2026 Solved Papers included.",
      priceCents: 35000,
      originalPriceCents: 49900,
      productType: "PHYSICAL",
      coverImageUrl: "/images/products/bihar-nmms-guide-book-2027-28.webp",
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#030611] text-slate-100 overflow-hidden font-sans">
      {/* Cinematic ambient background glow overlays */}
      <div className="absolute top-[-10%] left-[-10%] -z-10 h-[50rem] w-[50rem] rounded-full bg-indigo-500/10 blur-[150px]"></div>
      <div className="absolute top-[20%] right-[-10%] -z-10 h-[45rem] w-[45rem] rounded-full bg-cyan-500/8 blur-[130px]"></div>
      <div className="absolute bottom-[10%] left-[20%] -z-10 h-[60rem] w-[60rem] rounded-full bg-purple-500/5 blur-[160px]"></div>

      {/* Cyber grid backdrop */}
      <div className="absolute inset-0 bg-grid-cyber -z-20"></div>

      {/* 1. HERO SECTION (High-Impact Dark Hero) */}
      <HeroSection />

      {/* POST-HERO LIGHT/WHITE MODERN SECTIONS */}
      <div className="bg-[#f8fafc] text-slate-900 relative z-10">

        {/* 2. STUDENT TRUST BANNER */}
        <section className="border-y border-slate-200 bg-white py-8">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
              {siteConfig.trustBanner.label}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2.5">
              {siteConfig.trustBanner.items.map((item) => (
                <span key={item} className="font-display font-bold text-xs sm:text-sm text-slate-700 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200/80 px-4 py-1.5 rounded-full transition-all cursor-default shadow-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 3. FEATURED PRODUCTS & STUDY MATERIALS (NMMS BOOK SHOWCASE) */}
        <section className="py-16 md:py-24 bg-white border-b border-slate-200">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">

            {/* Section title */}
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <Badge className="bg-indigo-50 border-indigo-200 text-indigo-700 text-xs px-3.5 py-1 rounded-full uppercase tracking-wider font-bold">
                Official Books & Study Material
              </Badge>
              <h2 className="font-display text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight">
                बिहार NMMS 2027-28 <span className="text-indigo-600">बेस्ट सेलर गाइड बुक्स</span>
              </h2>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                कक्षा 8वीं छात्रवृत्ति परीक्षा में 100% सफलता के लिए संपूर्ण MAT (तर्कशक्ति) व SAT (विज्ञान, गणित, सामाजिक विज्ञान) गाइड व 6 वर्षों के हल प्रश्न पत्र।
              </p>
            </div>

            {/* Products grid */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {featuredProducts.map((product) => {
                const price = Math.round(product.priceCents / 100);
                const origCents = product.originalPriceCents ?? null;
                const originalPrice = origCents !== null ? Math.round(origCents / 100) : null;
                const hasDiscount = originalPrice !== null && originalPrice > price && price > 0;
                const discountPercent = hasDiscount
                  ? Math.round(((originalPrice - price) / originalPrice) * 100)
                  : 0;

                const productTypeLabel =
                  product.productType === "DIGITAL_RESOURCE"
                    ? "Digital Download"
                    : product.productType === "PHYSICAL"
                    ? "Physical Book / Home Delivery"
                    : "Official Study Material";

                return (
                  <div
                    key={product.id}
                    className="group relative flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-md hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="space-y-4">
                      {/* Cover image box */}
                      {product.coverImageUrl ? (
                        <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-200/80 flex items-center justify-center p-3 shadow-inner group-hover:bg-indigo-50/30 transition-colors">
                          <Image
                            src={product.coverImageUrl}
                            alt={product.title}
                            width={400}
                            height={500}
                            className="max-h-full w-auto max-w-full object-contain rounded-md drop-shadow-[0_12px_24px_rgba(0,0,0,0.15)] group-hover:scale-[1.03] transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="w-full aspect-[4/3] rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                          <ShoppingBag className="h-10 w-10 text-indigo-400 opacity-60" />
                        </div>
                      )}

                      {/* Type Badge */}
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
                          {productTypeLabel}
                        </span>
                      </div>

                      {/* Product title */}
                      <Link href={`/store/${product.slug}`}>
                        <h3 className="font-display text-lg font-bold text-slate-900 hover:text-indigo-600 transition duration-200 leading-snug line-clamp-2">
                          {product.title}
                        </h3>
                      </Link>

                      {/* Description */}
                      <p className="text-xs leading-relaxed text-slate-600 line-clamp-3">
                        {product.description ?? "NMMS छात्रवृत्ति परीक्षा के लिए संपूर्ण थ्योरी और 2021 से 2026 तक के हल प्रश्न पत्र।"}
                      </p>
                    </div>

                    {/* Footer: price + CTA */}
                    <div className="mt-6 flex items-center justify-between pt-5 border-t border-slate-100">
                      <div>
                        <p className="text-[10px] text-slate-500 font-medium">विशेष ऑफर मूल्य</p>
                        {hasDiscount ? (
                          <div className="flex flex-wrap items-center gap-2 mt-0.5">
                            <span className="text-xl font-black text-slate-900">₹{price.toLocaleString("en-IN")}</span>
                            <span className="line-through text-slate-400 text-xs font-semibold">₹{originalPrice!.toLocaleString("en-IN")}</span>
                            <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700 uppercase tracking-wide">
                              {discountPercent}% छूट
                            </span>
                          </div>
                        ) : (
                          <p className="text-xl font-black text-slate-900 mt-0.5">₹{price.toLocaleString("en-IN")}</p>
                        )}
                      </div>

                      <Button asChild size="sm" className="bg-indigo-600 text-white font-bold hover:bg-indigo-700 rounded-xl shadow-md hover:shadow-indigo-500/25 transition-all duration-300">
                        <Link href={`/store/${product.slug}`} className="flex items-center gap-1">
                          ऑर्डर करें
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Browse Store button */}
            <div className="text-center pt-2">
              <Button asChild variant="outline" className="border-slate-300 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold rounded-xl px-7 py-5 shadow-sm">
                <Link href="/store" className="flex items-center gap-2">
                  पूरा स्टोर देखें (Browse Store)
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

          </div>
        </section>

        {/* 3.1. FEATURED COURSES & ONLINE TEST SERIES */}
        {displayCourses.length > 0 && (
          <section className="py-16 md:py-24 bg-slate-50/70 border-b border-slate-200">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
              {/* Section Header */}
              <div className="text-center max-w-3xl mx-auto space-y-3">
                <Badge className="bg-indigo-50 border-indigo-200 text-indigo-700 text-xs px-3.5 py-1 rounded-full uppercase tracking-wider font-bold">
                  Online Test Series & Courses
                </Badge>
                <h2 className="font-display text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight">
                  ऑनलाइन छात्रवृत्ति <span className="text-indigo-600">मॉक टेस्ट सीरीज</span>
                </h2>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                  असली परीक्षा पैटर्न, टाइमर, और रियल-टाइम ऑल-स्टेट रैंक के साथ अभ्यास करें। तुरंत विस्तृत व्याख्या और स्कोर कार्ड प्राप्त करें।
                </p>
              </div>

              {/* Courses Grid */}
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                {displayCourses.map((course) => {
                  const price = course.priceCents !== null ? Math.round(course.priceCents / 100) : 0;
                  const categoryName = course.categories?.[0]?.category?.name ?? "Scholarship Exams";
                  const sectionsCount = course._count?.sections ?? 0;

                  return (
                    <div
                      key={course.id}
                      className="group relative flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-md hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="space-y-4">
                        {/* Course Thumbnail */}
                        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-inner group-hover:scale-[1.01] transition-transform duration-300">
                          {course.coverImageUrl ? (
                            <Image
                              src={course.coverImageUrl}
                              alt={course.title}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 flex items-center justify-center">
                              <GraduationCap className="h-12 w-12 text-indigo-400 opacity-70" />
                            </div>
                          )}
                          <span className="absolute top-3 left-3 rounded-full bg-black/70 border border-white/20 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                            {categoryName}
                          </span>
                        </div>

                        {/* Title */}
                        <Link href={`/courses/${course.slug}`}>
                          <h3 className="font-display text-lg font-bold text-slate-900 hover:text-indigo-600 transition duration-200 leading-snug line-clamp-2">
                            {course.title}
                          </h3>
                        </Link>

                        {/* Excerpt */}
                        <p className="text-xs leading-relaxed text-slate-600 line-clamp-2">
                          {course.subtitle || course.excerpt || "परीक्षा पैटर्न पर आधारित संपूर्ण टेस्ट सीरीज और हल।"}
                        </p>

                        {/* Info tags */}
                        <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                          <span className="flex items-center gap-1 font-medium text-slate-700">
                            <BookOpen className="h-3.5 w-3.5 text-indigo-500" />
                            {sectionsCount} टेस्ट सेट्स
                          </span>
                          <span className="flex items-center gap-1 font-medium text-emerald-600 font-bold">
                            <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                            कंप्यूटर/मोबाइल फ्रेंडली
                          </span>
                        </div>
                      </div>

                      {/* Footer CTA */}
                      <div className="mt-6 flex items-center justify-between pt-5 border-t border-slate-100">
                        <div>
                          <p className="text-[10px] text-slate-500 font-medium">फीस / रजिस्ट्रेशन</p>
                          {price === 0 ? (
                            <span className="inline-block mt-0.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-black text-emerald-700 uppercase tracking-wide">
                              FREE / निःशुल्क
                            </span>
                          ) : (
                            <p className="text-xl font-black text-slate-900 mt-0.5">₹{price.toLocaleString("en-IN")}</p>
                          )}
                        </div>

                        <Button asChild size="sm" className="bg-indigo-600 text-white font-bold hover:bg-indigo-700 rounded-xl shadow-md hover:shadow-indigo-500/25 transition-all duration-300">
                          <Link href={`/courses/${course.slug}`} className="flex items-center gap-1">
                            टेस्ट दें
                            <ChevronRight className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Browse Catalog CTA */}
              <div className="text-center pt-2">
                <Button asChild variant="outline" className="border-slate-300 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold rounded-xl px-7 py-5 shadow-sm">
                  <Link href="/courses" className="flex items-center gap-2">
                    सभी कोर्सेज व टेस्ट देखें (All Courses)
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* 3.5. NMMS VIP TELEGRAM ALERT CHANNEL BANNER */}
        <VipTelegramSection />

        {/* 4. ACTIVE LEARNING / शिक्षा क्रांति */}
        <section className="py-20 md:py-24 bg-slate-50 border-b border-slate-200">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
            
            <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-5 space-y-6 text-left">
                <Badge className="bg-indigo-100 border-indigo-200 text-indigo-800 text-xs px-3 py-1 rounded-full uppercase tracking-wider font-bold">
                  शिक्षा क्रांति (Active Learning)
                </Badge>
                <h2 className="font-display text-3xl font-extrabold text-slate-900 sm:text-4xl leading-tight">
                  सफलता का मार्ग <br className="hidden md:inline" />
                  <span className="text-indigo-600">सागर कोचिंग सेंटर</span> के साथ।
                </h2>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                  हम केवल वीडियो लेक्चर्स ही नहीं देते, बल्कि छात्रों को परीक्षा पैटर्न के अनुसार निरंतर अभ्यास, स्तरीय अध्ययन पुस्तकें और 24/7 एक्सपर्ट गाइडेंस प्रदान करते हैं।
                </p>
                <ul className="space-y-3.5 pt-2 text-sm text-slate-700">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-indigo-600 shrink-0" />
                    <span>सप्ताह में ऑफलाइन ओएमआर (OMR) आधारित मॉक टेस्ट</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-indigo-600 shrink-0" />
                    <span>अनुभवी शिक्षकों और श्रवण सर द्वारा संचालित लाइव कक्षाएं</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-indigo-600 shrink-0" />
                    <span>राघव प्रकाशन द्वारा सह-लिखित विशेष पुस्तकें और नोट्स</span>
                  </li>
                </ul>
              </div>

              <div className="lg:col-span-7 grid gap-6 sm:grid-cols-2">
                {/* Feature Card 1 */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition duration-300 space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">YouTube Lectures & App</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    श्रवण कुमार सागर सर द्वारा संचालित ऑनलाइन वीडियो लेक्चर्स। घर बैठे परीक्षा की सबसे सटीक तैयारी।
                  </p>
                </div>

                {/* Feature Card 2 */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition duration-300 space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Printed Guide Books</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    राघव प्रकाशन द्वारा सह-लिखित NMMS व नवोदय प्रवेश परीक्षा की सर्वोत्कृष्ट पुस्तकें सीधे आपके घर तक।
                  </p>
                </div>

                {/* Feature Card 3 */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition duration-300 space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">OMR Practice Tests</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    परीक्षा हॉल जैसा अभ्यास करने के लिए वास्तविक OMR शीट आधारित साप्ताहिक टेस्ट और रिजल्ट एनालिसिस।
                  </p>
                </div>

                {/* Feature Card 4 */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition duration-300 space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Verified Selection Track</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    NMMS, नवोदय, सैनिक स्कूल और सिमुलतला में 500+ से अधिक विद्यार्थियों का चयन और छात्रवृत्ति प्राप्ति।
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 5. PLATFORM METRICS */}
        <section className="py-16 md:py-20 bg-white border-b border-slate-200">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <Badge className="bg-emerald-50 border-emerald-200 text-emerald-700 text-xs px-3.5 py-1 rounded-full uppercase tracking-wider font-bold">
                Platform Statistics
              </Badge>
              <h2 className="font-display text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight">
                विश्वास और सफलता के <span className="text-indigo-600">प्रमाणिक आंकड़े</span>
              </h2>
            </div>

            {/* Outcome Gauges */}
            <div className="grid gap-6 grid-cols-2 md:grid-cols-4">
              {siteConfig.outcomes.map((outcome, i) => {
                const metricValue = (outcome as any).metric || (outcome as any).value || "";
                const subText = (outcome as any).sub;

                return (
                  <div key={outcome.label} className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 text-left shadow-sm hover:shadow-md transition">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{outcome.label}</p>
                    <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-3 font-display">{metricValue}</p>
                    {subText && (
                      <p className="text-xs font-semibold mt-1 text-indigo-600">{subText}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 6. MERIT CERTIFICATE SHOWCASE */}
        <section className="py-20 md:py-24 bg-slate-50 border-b border-slate-200">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-14">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <Badge className="bg-amber-50 border-amber-200 text-amber-700 text-xs px-3.5 py-1 rounded-full uppercase tracking-wider font-bold">
                Earn Credentials
              </Badge>
              <h2 className="font-display text-3xl font-extrabold text-slate-900 sm:text-4xl">
                मेधावी छात्र <span className="text-amber-600">प्रमाण पत्र (Certificate of Merit)</span>
              </h2>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                कोर्स पूरा होने और मॉक टेस्ट में उत्कृष्ट प्रदर्शन करने पर सागर कोचिंग सेंटर द्वारा मेधावी छात्र का डिजिटल प्रमाण पत्र प्राप्त करें।
              </p>
            </div>

            <div className="flex justify-center">
              {/* The Certificate Mockup */}
              <div className="relative w-full max-w-[620px] aspect-[1.6/1] bg-slate-950 rounded-3xl p-6 md:p-8 border-2 border-indigo-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.25)] group overflow-hidden text-left flex flex-col justify-between text-white">
                
                {/* Radial gradient corners */}
                <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all duration-300"></div>
                <div className="absolute bottom-0 left-0 h-40 w-40 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all duration-300"></div>

                {/* Certificate Border Framing */}
                <div className="absolute inset-2.5 rounded-[22px] border border-white/10 pointer-events-none"></div>

                <div className="flex justify-between items-start">
                  <div className="space-y-1 relative z-10">
                    <div className="flex items-center gap-1.5">
                      <Zap className="h-4 w-4 text-indigo-400 fill-indigo-400/20 animate-pulse" />
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{siteConfig.name}</span>
                    </div>
                    <p className="text-[9px] text-slate-400 font-mono">CREDENTIAL VERIFICATION SEALS</p>
                  </div>
                  
                  <div className="h-10 w-10 rounded-xl border border-white/10 bg-slate-900/60 flex items-center justify-center relative z-10">
                    <div className="grid grid-cols-3 gap-0.5 w-6 h-6 opacity-80">
                      <div className="bg-white rounded-[1px]"></div>
                      <div className="bg-white rounded-[1px]"></div>
                      <div className="bg-slate-950"></div>
                      <div className="bg-slate-950"></div>
                      <div className="bg-white rounded-[1px]"></div>
                      <div className="bg-white rounded-[1px]"></div>
                      <div className="bg-white rounded-[1px]"></div>
                      <div className="bg-slate-950"></div>
                      <div className="bg-white rounded-[1px]"></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 relative z-10 py-4">
                  <p className="text-[10px] font-semibold tracking-[0.2em] text-indigo-400 uppercase">CERTIFICATE OF COMPLETION</p>
                  <h3 className="text-xl md:text-3xl font-extrabold text-white font-display">{siteConfig.certificate.learnerName}</h3>
                  <p className="text-[11px] md:text-xs text-slate-300 leading-relaxed max-w-lg">
                    has successfully cleared all comprehensive mock tests, interactive lessons, and home assignments to master the course:
                  </p>
                  <p className="text-sm md:text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mt-1">
                    {siteConfig.certificate.courseName}
                  </p>
                </div>

                <div className="flex justify-between items-end pt-4 border-t border-white/10 relative z-10 text-[9px] text-slate-400 font-mono">
                  <div>
                    <p>AVERAGE ASSESSMENT SCORE</p>
                    <p className="text-xs font-bold text-emerald-400 mt-0.5">92.4% AVERAGE PASS</p>
                  </div>
                  <div className="text-right">
                    <p>VERIFICATION ID</p>
                    <p className="text-xs font-bold text-white mt-0.5">CERT-2026-F3C289A1</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* 7. STUDENT REVIEWS / TESTIMONIALS */}
        <section className="py-20 md:py-24 bg-white border-b border-slate-200">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-14">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <Badge className="bg-cyan-50 border-cyan-200 text-cyan-800 text-xs px-3.5 py-1 rounded-full uppercase tracking-wider font-bold">
                Student Success Stories
              </Badge>
              <h2 className="font-display text-3xl font-extrabold text-slate-900 sm:text-4xl">
                सफल विद्यार्थियों के <span className="text-indigo-600">प्रेरक अनुभव</span>
              </h2>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                जानिए कैसे बिहार के विभिन्न जिलों के छात्रों ने सागर कोचिंग सेंटर की गाइड बुक्स व ऑनलाइन मार्गदर्शन से सफलता पाई।
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-left space-y-4 shadow-sm">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                </div>
                <p className="text-xs leading-relaxed text-slate-700">
                  &quot;बिहार NMMS परीक्षा के लिए यह गाइड बुक रामबाण है। 2021 से 2026 के सभी सॉल्व्ड पेपर्स ने मुझे परीक्षा का पूरा पैटर्न समझने में मदद की और मेरा चयन हो गया!&quot;
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-slate-200">
                  <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">RK</div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">रमेश कुमार</h4>
                    <p className="text-[10px] text-slate-500">NMMS स्कॉलरशिप विजेता (सुपौल)</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-left space-y-4 shadow-sm">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                </div>
                <p className="text-xs leading-relaxed text-slate-700">
                  &quot;श्रवण सर के यूट्यूब लेक्चर्स और इस किताब के रीजनिंग शॉर्टकट ट्रिक्स ने MAT सेक्शन में मेरा स्कोर 85+ कर दिया। हर छात्र को यह किताब जरूर पढ़नी चाहिए।&quot;
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-slate-200">
                  <div className="h-8 w-8 rounded-full bg-cyan-600 flex items-center justify-center font-bold text-white text-xs">PK</div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">पूजा कुमारी</h4>
                    <p className="text-[10px] text-slate-500">NMMS क्वालीफायर (सहरसा)</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-left space-y-4 shadow-sm">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                </div>
                <p className="text-xs leading-relaxed text-slate-700">
                  &quot;ऑर्डर करने के 4 दिन में किताब घर पहुंच गई। पैकेजिंग बहुत अच्छी थी और थ्योरी के साथ मॉडल OMR सेट्स ने मेरी स्पीड काफी बढ़ा दी।&quot;
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-slate-200">
                  <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-xs">AS</div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">अमित शर्मा</h4>
                    <p className="text-[10px] text-slate-500">Class 8th Aspirant (मधुबनी)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. FAQs SECTION */}
        <section className="py-20 md:py-24 bg-slate-50 border-b border-slate-200">
          <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
            
            <div className="text-center space-y-3">
              <Badge className="bg-indigo-100 border-indigo-200 text-indigo-800 text-xs px-3.5 py-1 rounded-full uppercase tracking-wider font-bold">
                Answers Hub
              </Badge>
              <h2 className="font-display text-3xl font-extrabold text-slate-900 sm:text-4xl">
                अक्सर पूछे जाने वाले प्रश्न (FAQ)
              </h2>
              <p className="text-sm text-slate-600">
                सागर कोचिंग सेंटर, NMMS परीक्षा की तैयारी और अध्ययन सामग्री से जुड़े आपके सभी सवालों के जवाब।
              </p>
            </div>

            <div className="space-y-4 text-left">
              <details className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm [&_summary::-webkit-details-marker]:hidden hover:border-indigo-300 transition">
                <summary className="flex items-center justify-between cursor-pointer focus:outline-none">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition duration-200">
                    क्या स्टडी मैटेरियल / पुस्तकें घर पर होम डिलीवरी से मिलेंगी?
                  </h3>
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 border border-slate-200 text-slate-500 group-open:rotate-180 transition-all">
                    <ChevronRight className="h-3.5 w-3.5 rotate-90" />
                  </span>
                </summary>
                <p className="mt-4 text-xs leading-relaxed text-slate-600">
                  हाँ, हमारी सभी पुस्तकें राघव प्रकाशन और सागर कोचिंग सेंटर द्वारा सुरक्षित पैकेजिंग के साथ स्पीड पोस्ट / फास्ट कूरियर द्वारा सीधे आपके पते पर 3 से 5 कार्यदिवसों में पहुंचा दी जाती हैं।
                </p>
              </details>

              <details className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm [&_summary::-webkit-details-marker]:hidden hover:border-indigo-300 transition">
                <summary className="flex items-center justify-between cursor-pointer focus:outline-none">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition duration-200">
                    NMMS परीक्षा में चयनित होने पर कितनी छात्रवृत्ति मिलती है?
                  </h3>
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 border border-slate-200 text-slate-500 group-open:rotate-180 transition-all">
                    <ChevronRight className="h-3.5 w-3.5 rotate-90" />
                  </span>
                </summary>
                <p className="mt-4 text-xs leading-relaxed text-slate-600">
                  राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS) में सफल छात्रों को कक्षा 9 से 12 तक पढ़ाई जारी रखने के लिए भारत सरकार द्वारा ₹12,000 प्रति वर्ष (कुल ₹48,000) की छात्रवृत्ति सीधे बैंक खाते में दी जाती है।
                </p>
              </details>

              <details className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm [&_summary::-webkit-details-marker]:hidden hover:border-indigo-300 transition">
                <summary className="flex items-center justify-between cursor-pointer focus:outline-none">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition duration-200">
                    क्या इस गाइड बुक में 2021 से 2026 तक के हल प्रश्न पत्र शामिल हैं?
                  </h3>
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 border border-slate-200 text-slate-500 group-open:rotate-180 transition-all">
                    <ChevronRight className="h-3.5 w-3.5 rotate-90" />
                  </span>
                </summary>
                <p className="mt-4 text-xs leading-relaxed text-slate-600">
                  हाँ, इस 2027-28 नवीनतम संस्करण में विगत 6 वर्षों (2021, 2022, 2023, 2024, 2025 और 2026) के सभी हल प्रश्न पत्र सरल हिंदी व्याख्या और शॉर्टकट ट्रिक्स के साथ शामिल हैं।
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* 9. FINAL CINEMATIC CALL TO ACTION */}
        <section className="py-20 md:py-24 bg-white">
          <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-[32px] bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 p-8 md:p-14 text-center overflow-hidden space-y-6 text-white shadow-2xl border border-indigo-500/20">
              
              <div className="max-w-2xl mx-auto space-y-4">
                <Badge className="bg-indigo-600/40 border-indigo-400/30 text-indigo-200 text-xs px-3.5 py-1 rounded-full uppercase tracking-wider font-bold">
                  Start Your Preparation Today
                </Badge>
                <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl md:text-5xl leading-tight">
                  आज ही अपने बच्चों के <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">सुनहरे भविष्य की शुरुआत करें</span>।
                </h2>
                <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                  NMMS 2027-28 छात्रवृत्ति परीक्षा की तैयारी के लिए आज ही अपनी ऑफिशियल गाइड बुक ऑर्डर करें।
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <Button asChild className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold hover:from-indigo-500 hover:to-cyan-500 rounded-xl px-8 py-6 text-base shadow-[0_0_30px_rgba(99,102,241,0.45)] border border-white/10 transition duration-300 hover:scale-[1.03]">
                  <Link href="/store/bihar-nmms-exam-book-2027-28">NMMS Book ऑर्डर करें (₹350)</Link>
                </Button>
                <Button asChild variant="outline" className="border-white/20 bg-white/10 hover:bg-white/20 text-white rounded-xl px-8 py-6 text-base">
                  <Link href="/store">स्टोर के अन्य प्रोडक्ट्स देखें</Link>
                </Button>
              </div>

            </div>
          </div>
        </section>

      </div>

      {/* Structured Data: EducationalOrganization & WebSite */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              "@id": `${siteConfig.url}/#organization`,
              "name": "Sagar Coaching Centre Bhagwanpur",
              "alternateName": "Sagar Coaching",
              "url": siteConfig.url,
              "logo": `${siteConfig.url}/logo-circle-transparent.png`,
              "description": "India's trusted online coaching for NMMS, Navodaya, Sainik School, and Shrestha NETS scholarship exams.",
              "founder": {
                "@type": "Person",
                "name": "Shrvan Kumar Sagar",
                "jobTitle": "Founder & Head Teacher"
              },
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "NH 106, Bhagwanpur",
                "addressLocality": "Supaul",
                "addressRegion": "Bihar",
                "postalCode": "852131",
                "addressCountry": "IN"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-9110113671",
                "contactType": "customer service",
                "areaServed": "IN",
                "availableLanguage": ["Hindi", "English"]
              },
              "sameAs": [
                "https://www.youtube.com/@sagarcoachingcentre",
                "https://facebook.com/sagarcoachingcentre",
                "https://instagram.com/sagarcoachingcentre"
              ]
            },
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": `${siteConfig.url}/#website`,
              "url": siteConfig.url,
              "name": "Sagar Coaching Centre",
              "description": "Online Scholarship & Entrance Exam Coaching Portal",
              "publisher": {
                "@id": `${siteConfig.url}/#organization`
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": `${siteConfig.url}/courses?category={search_term_string}`
                },
                "query-input": "required name=search_term_string"
              }
            }
          ])
        }}
      />
    </div>
  );
}