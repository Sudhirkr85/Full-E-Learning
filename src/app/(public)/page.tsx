import Link from "next/link";
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
  Archive
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { makeMetadata, siteConfig } from "@/lib/site";
import { getPublishedCourses } from "@/lib/courses/queries";
import { StarFireflyCanvas } from "@/components/hero/StarFireflyCanvas";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = makeMetadata({
  title: "Home",
  description: siteConfig.hero.subheadline,
  path: "/"
});

export default async function HomePage() {
  const coursesResult = await getPublishedCourses();
  
  const displayCourses = coursesResult ?? [];

  // Fetch up to 3 active products for the Featured Products section
  let dbProducts: Array<{
    id: string;
    title: string;
    slug: string;
    description: string | null;
    priceCents: number;
    originalPriceCents: number | null;
    productType: string;
    coverImageUrl: string | null;
  }> = [];
  try {
    dbProducts = await prisma.product.findMany({
      where: {
        status: { in: ["ACTIVE", "PUBLISHED"] }
      },
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
    });
  } catch {
    // DB unavailable
  }

  const featuredProducts = dbProducts;

  return (
    <div className="relative min-h-screen bg-[#030611] text-slate-100 overflow-hidden font-sans">
      {/* Cinematic ambient background glow overlays */}
      <div className="absolute top-[-10%] left-[-10%] -z-10 h-[50rem] w-[50rem] rounded-full bg-indigo-500/10 blur-[150px]"></div>
      <div className="absolute top-[20%] right-[-10%] -z-10 h-[45rem] w-[45rem] rounded-full bg-cyan-500/8 blur-[130px]"></div>
      <div className="absolute bottom-[10%] left-[20%] -z-10 h-[60rem] w-[60rem] rounded-full bg-purple-500/5 blur-[160px]"></div>

      {/* Cyber grid backdrop */}
      <div className="absolute inset-0 bg-grid-cyber -z-20"></div>

      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
        {/* Animated particles subtle overlay */}
        <div className="particles-bg"></div>
        {/* Night sky twinkling stars & floating fireflies canvas */}
        <StarFireflyCanvas className="absolute inset-0 w-full h-full z-0 pointer-events-none" />

        {/* Content wrapper sitting cleanly above canvas background */}
        <div className="relative z-10 w-full">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* LEFT: Outcome-focused Copy */}
            <div className="lg:col-span-7 space-y-6 md:space-y-8 relative z-10 text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/40 px-3 py-1.5 text-xs md:text-sm font-semibold text-indigo-300 backdrop-blur-md">
                <Sparkles className="h-4 w-4 text-indigo-400" />
                <span>{siteConfig.hero.badge}</span>
              </div>

              <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl leading-[1.1] md:leading-[1.05]">
                {siteConfig.hero.headline.split(" at ")[0]} <br className="hidden sm:inline" />
                at <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400">{siteConfig.hero.headline.split(" at ")[1]}</span>
              </h1>

              <p className="max-w-2xl text-base md:text-lg text-slate-400 leading-relaxed">
                {siteConfig.hero.subheadline}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Button asChild className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold hover:from-indigo-500 hover:to-cyan-500 rounded-xl px-6 py-6 text-base shadow-[0_0_30px_rgba(99,102,241,0.45)] border border-white/10 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] group">
                  <Link href="/courses" className="flex items-center gap-2">
                    Explore Premium Courses
                    <ArrowRight className="h-5 w-5 transition duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="border-white/10 bg-slate-950/40 hover:bg-slate-900/60 text-slate-300 hover:text-white rounded-xl px-6 py-6 text-base backdrop-blur-md transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]">
                  <Link href="/register">Create Free Account</Link>
                </Button>
              </div>

              {/* Statistics Banner */}
              <div className="pt-8 border-t border-white/5 grid grid-cols-3 gap-4 text-left">
                {siteConfig.stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="font-display text-2xl sm:text-3xl font-extrabold text-white">{stat.value}</p>
                    <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Tech Mastery Preview Card */}
            <div className="lg:col-span-5 relative z-10 flex justify-center">
              <div className="relative w-full max-w-[420px] bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group overflow-hidden flex flex-col justify-between gap-5 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(99,102,241,0.15)] hover:border-white/20">
                {/* Decorative border glows */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"></div>
                <div className="absolute bottom-0 right-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"></div>

                {/* Card Header Content */}
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-rose-500"></div>
                    <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                    <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                  </div>
                  <Badge className="bg-indigo-950/60 border-indigo-500/30 text-indigo-300 text-xs px-2.5 py-0.5 rounded-full">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 pulse-dot mr-1.5 inline-block"></span>
                    Tech Mastery Preview
                  </Badge>
                </div>

                {/* Fake code block with typing cursor */}
                <div className="rounded-xl bg-black/50 p-4 border border-white/5 overflow-hidden text-left relative font-mono text-xs">
                  <div className="flex items-center gap-1.5 mb-2 opacity-50">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
                    <span className="text-[9px] ml-1.5">mastery_sandbox.ts</span>
                  </div>
                  <div className="space-y-1 text-slate-300">
                    <div className="text-indigo-400 font-semibold"><span className="text-purple-400">import</span> &#123; AI_CoPilot, NextJS &#125; <span className="text-purple-400">from</span> <span className="text-emerald-400">&quot;academy&quot;</span>;</div>
                    <div className="text-blue-400"><span className="text-purple-400">const</span> learner = <span className="text-purple-400">new</span> Developer(&quot;{siteConfig.demo.personaName}&quot;);</div>
                    <div className="text-slate-400 font-medium">learner.startLearning(&#123; goal: &quot;certification&quot; &#125;);</div>
                    <div className="flex items-center text-cyan-400">
                      <span>{siteConfig.demo.consoleOutput}</span>
                      <span className="w-1.5 h-4 ml-1 bg-cyan-400 animate-pulse"></span>
                    </div>
                  </div>
                </div>

                {/* Feature pill badges */}
                <div className="flex flex-wrap gap-2 py-1 justify-center">
                  {siteConfig.highlights.map((highlight, i) => {
                    const dotColors = [
                      "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]",
                      "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]",
                      "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]",
                      "bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]",
                      "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]",
                    ];
                    return (
                      <span key={highlight} className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 text-slate-200 text-xs px-3 py-1.5 rounded-full transition-all duration-300 hover:bg-white/10">
                        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[i % dotColors.length]} inline-block`}></span>
                        {highlight}
                      </span>
                    );
                  })}
                </div>

                {/* Skills You'll Master section */}
                <div className="space-y-2.5 text-left">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Skills You&apos;ll Master</h4>
                  <div className="space-y-2">
                    {siteConfig.skills.map((skill) => (
                      <div key={skill.title} className="flex items-center gap-2.5 text-slate-200 text-xs font-medium">
                        <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                        <span>{skill.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stat chips */}
                <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-white/5">
                  {siteConfig.heroCard.chips.map((chip) => {
                    const [label, ...rest] = chip.split(" ");
                    return (
                      <div key={chip} className="rounded-xl bg-white/5 p-2.5 border border-white/5 text-center transition-all duration-300 hover:bg-white/10">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{label}</p>
                        <p className="text-xs font-bold text-white mt-0.5">{rest.join(" ")}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Glass sheen overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 transform -translate-y-full group-hover:translate-y-full transition-transform duration-1000 pointer-events-none"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

      {/* 2. STUDENT TRUST BANNER */}
      <section className="border-y border-white/5 bg-slate-950/40 py-8 relative z-10 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
            {siteConfig.trustBanner.label}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-60 grayscale hover:grayscale-0 transition duration-300">
            {siteConfig.trustBanner.companies.map((company) => (
              <span key={company} className="font-display font-extrabold text-xl md:text-2xl text-slate-400 hover:text-white transition cursor-default">
                {company.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED CYBER COURSES GRID */}
      <section className="py-20 md:py-28 relative z-10">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Section title */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <Badge className="bg-cyan-950/60 border-cyan-500/30 text-cyan-300 text-xs px-3 py-1 rounded-full uppercase tracking-wider">
              Explore Catalog
            </Badge>
            <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
              Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Courses</span>
            </h2>
            <p className="text-sm md:text-base text-slate-400 leading-relaxed">
              {siteConfig.courses.sectionSubheadline}
            </p>
          </div>

          {/* Grid of real courses or empty state message */}
          {displayCourses.length === 0 ? (
            <div className="rounded-3xl border border-white/5 bg-[#0a0f21]/40 p-12 text-center max-w-xl mx-auto backdrop-blur-md">
              <GraduationCap className="h-10 w-10 text-cyan-400/60 mx-auto mb-4" />
              <h3 className="text-white text-base font-semibold">No courses published yet</h3>
              <p className="text-xs text-slate-500 mt-2">
                We are currently crafting premium interactive learning tracks. Sign up or check back shortly to begin your mastery journey.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {displayCourses.map((course) => {
                const price = course.priceCents !== null ? Math.round(course.priceCents / 100) : 0;

                let originalPrice: number | null = null;
                if (course.metadata && typeof course.metadata === "object") {
                  const meta = course.metadata as { originalPrice?: unknown };
                  if (meta.originalPrice !== undefined && meta.originalPrice !== null) {
                    const parsed = Number(meta.originalPrice);
                    if (!Number.isNaN(parsed) && parsed > 0) {
                      originalPrice = Math.round(parsed);
                    }
                  }
                }

                const hasDiscount = originalPrice !== null && originalPrice > price && price > 0;
                const safeOriginalPrice = Number(originalPrice ?? 0);
                const discountPercent = hasDiscount
                  ? Math.round(((safeOriginalPrice - price) / safeOriginalPrice) * 100)
                  : 0;

                const displayLevel = course.level.charAt(0).toUpperCase() + course.level.slice(1).toLowerCase();
                const categoryName = course.categories[0]?.category.name ?? "Core Learning";
                const teacherName = course.teachers[0]?.teacher.name ?? "Instructor";

                return (
                  <div 
                    key={course.id} 
                    className="soft-3d-card relative flex flex-col justify-between rounded-3xl border border-white/5 bg-[#0a0f21]/70 p-6 backdrop-blur-lg transition-all duration-300 group hover:border-cyan-500/20"
                  >
                    {/* Decorative corner glows inside card */}
                    <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-cyan-500/5 blur-2xl group-hover:bg-cyan-500/10 transition-all duration-300"></div>

                    <div className="space-y-4">
                      {/* Cover image or gradient placeholder */}
                      {course.coverImageUrl ? (
                        <img
                          src={course.coverImageUrl}
                          alt={course.title}
                          className="w-full aspect-video object-cover rounded-xl"
                        />
                      ) : (
                        <div className="w-full aspect-video rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-white/5 flex items-center justify-center">
                          <GraduationCap className="h-10 w-10 text-cyan-400 opacity-60" />
                        </div>
                      )}

                      {/* Header tags */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">{categoryName}</span>
                        <Badge className="bg-slate-900 border-white/10 text-slate-300 text-[10px] rounded-md">{displayLevel}</Badge>
                      </div>

                      {/* Course Title */}
                      <Link href={`/courses/${course.slug}`}>
                        <h3 className="font-display text-lg font-bold text-white hover:text-cyan-300 transition duration-300 leading-snug line-clamp-2">
                          {course.title}
                        </h3>
                      </Link>

                      {/* Excerpt */}
                      <p className="text-xs leading-relaxed text-slate-400 line-clamp-3">
                        {course.excerpt || course.subtitle || "Build extensive modules and robust features."}
                      </p>

                      {/* Metadata specs */}
                      <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-2 border-t border-white/5">
                        <span className="flex items-center gap-1 font-medium text-slate-300">
                          <GraduationCap className="h-3.5 w-3.5 text-indigo-400" />
                          {course._count.sections} Sections
                        </span>
                        <span className="flex items-center gap-1 font-medium text-slate-300">
                          <Users className="h-3.5 w-3.5 text-cyan-400" />
                          {course._count.enrollments}+ Students
                        </span>
                      </div>
                    </div>

                    {/* Footer billing & button */}
                    <div className="mt-6 flex items-center justify-between pt-5 border-t border-white/5 relative z-10">
                      <div>
                        <p className="text-[10px] text-slate-500">Total Enrollment Cost</p>
                        {/* Price with discount badge — matches /courses page pattern exactly */}
                        {price === 0 ? (
                          <span className="inline-block mt-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 text-[9px] font-bold text-emerald-300 uppercase tracking-wide">
                            Free
                          </span>
                        ) : hasDiscount ? (
                          <div className="flex flex-wrap items-center gap-2 mt-0.5">
                            <span className="text-lg font-black text-white">₹{price.toLocaleString("en-IN")}</span>
                            <span className="line-through text-slate-500 text-xs font-semibold">₹{safeOriginalPrice.toLocaleString("en-IN")}</span>
                            <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-bold text-emerald-300 uppercase tracking-wide">
                              {discountPercent}% OFF
                            </span>
                          </div>
                        ) : (
                          <p className="text-lg font-black text-white mt-0.5">₹{price.toLocaleString("en-IN")}</p>
                        )}
                      </div>
                      
                      <Button asChild size="sm" className="bg-indigo-600 text-white font-medium hover:bg-indigo-500 rounded-lg group-hover:shadow-[0_0_12px_rgba(99,102,241,0.4)] transition-all duration-300">
                        <Link href={`/courses/${course.slug}`} className="flex items-center gap-1">
                          View Modules
                          <ChevronRight className="h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="text-center pt-4">
            <Button asChild variant="outline" className="border-white/10 bg-slate-950/40 hover:bg-slate-900/60 text-slate-300 hover:text-white rounded-xl px-6 py-5">
              <Link href="/courses" className="flex items-center gap-2">
                Browse Complete Catalog
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 3b. FEATURED PRODUCTS SECTION */}
      <section className="py-20 md:py-28 relative z-10 border-t border-white/5 bg-[#02050f]/40 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">

          {/* Section title */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <Badge className="bg-violet-950/60 border-violet-500/30 text-violet-300 text-xs px-3 py-1 rounded-full uppercase tracking-wider">
              Learning Store
            </Badge>
            <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
              Featured{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
                Products
              </span>
            </h2>
            <p className="text-sm md:text-base text-slate-400 leading-relaxed">
              {siteConfig.products.sectionSubheadline}
            </p>
          </div>

          {/* Products grid — same grid as courses */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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
                  ? "Physical Product"
                  : product.productType === "BUNDLE"
                  ? "Bundle"
                  : "Product";

              const ProductIcon =
                product.productType === "DIGITAL_RESOURCE"
                  ? Package
                  : product.productType === "BUNDLE"
                  ? Archive
                  : ShoppingBag;

              return (
                <div
                  key={product.id}
                  className="soft-3d-card relative flex flex-col justify-between rounded-3xl border border-white/5 bg-[#0a0f21]/70 p-6 backdrop-blur-lg transition-all duration-300 group hover:border-violet-500/20"
                >
                  {/* Decorative corner glow */}
                  <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-violet-500/5 blur-2xl group-hover:bg-violet-500/10 transition-all duration-300" />

                  <div className="space-y-4">
                    {/* Cover image or gradient placeholder */}
                    {product.coverImageUrl ? (
                      <img
                        src={product.coverImageUrl}
                        alt={product.title}
                        className="w-full aspect-video object-cover rounded-xl"
                      />
                    ) : (
                      <div className="w-full aspect-video rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-white/5 flex items-center justify-center">
                        <ProductIcon className="h-10 w-10 text-violet-400 opacity-60" />
                      </div>
                    )}

                    {/* Header: type badge */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400">
                        {productTypeLabel}
                      </span>
                    </div>

                    {/* Product title */}
                    <Link href={`/store/${product.slug}`}>
                      <h3 className="font-display text-lg font-bold text-white hover:text-violet-300 transition duration-300 leading-snug line-clamp-2">
                        {product.title}
                      </h3>
                    </Link>

                    {/* Description */}
                    <p className="text-xs leading-relaxed text-slate-400 line-clamp-3">
                      {product.description ?? "Premium learning resource available exclusively in our store."}
                    </p>
                  </div>

                  {/* Footer: price + CTA */}
                  <div className="mt-6 flex items-center justify-between pt-5 border-t border-white/5 relative z-10">
                    <div>
                      <p className="text-[10px] text-slate-500">Price</p>
                      {hasDiscount ? (
                        <div className="flex flex-wrap items-center gap-2 mt-0.5">
                          <span className="text-lg font-black text-white">₹{price.toLocaleString("en-IN")}</span>
                          <span className="line-through text-slate-500 text-xs font-semibold">₹{originalPrice!.toLocaleString("en-IN")}</span>
                          <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-bold text-emerald-300 uppercase tracking-wide">
                            {discountPercent}% OFF
                          </span>
                        </div>
                      ) : (
                        <p className="text-lg font-black text-white mt-0.5">₹{price.toLocaleString("en-IN")}</p>
                      )}
                    </div>

                    <Button asChild size="sm" className="bg-violet-600 text-white font-medium hover:bg-violet-500 rounded-lg group-hover:shadow-[0_0_12px_rgba(139,92,246,0.4)] transition-all duration-300">
                      <Link href={`/store/${product.slug}`} className="flex items-center gap-1">
                        View Product
                        <ChevronRight className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Browse Store button */}
          <div className="text-center pt-4">
            <Button asChild variant="outline" className="border-white/10 bg-slate-950/40 hover:bg-slate-900/60 text-slate-300 hover:text-white rounded-xl px-6 py-5">
              <Link href="/store" className="flex items-center gap-2">
                Browse Complete Store
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

        </div>
      </section>

      <section className="py-20 md:py-28 relative z-10 border-t border-white/5 bg-[#02050f]/60 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5 space-y-6 text-left">
              <Badge className="bg-indigo-950/60 border-indigo-500/30 text-indigo-300 text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                Ecosystem Architecture
              </Badge>
              <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl leading-tight">
                Designed for <br className="hidden md:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Extreme Technical</span> Mastery.
              </h2>
              <p className="text-sm md:text-base text-slate-400 leading-relaxed">
                Generic LMS setups deliver passive videos that yield poor learning outcomes. We offer an active, sandbox-integrated workspace paired with an AI assistant that behaves like an elite peer instructor.
              </p>
              <ul className="space-y-3 pt-2 text-sm text-slate-300">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-cyan-400" />
                  <span>24/7 AI-powered learning assistance & guidance</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-cyan-400" />
                  <span>Comprehensive real-world project-based assessments</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-cyan-400" />
                  <span>Industry-mapped curriculum crafted by expert instructors</span>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-7 grid gap-6 sm:grid-cols-2">
              {/* Feature Card 1 */}
              <div className="glass-card-premium rounded-2xl p-5 border border-white/5 hover:border-white/10 transition duration-300 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white">24/7 AI Co-Pilot</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Stuck on a concept or need a second opinion? Get instant, context-aware instructions tailored directly to your learning progress.
                </p>
              </div>

              {/* Feature Card 2 */}
              <div className="glass-card-premium rounded-2xl p-5 border border-white/5 hover:border-white/10 transition duration-300 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                  <Code className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white">Immersive Sandbox Labs</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Write, run, and evaluate actual code directly in the browser. Zero local installation friction—code runs inside isolated secure containers.
                </p>
              </div>

              {/* Feature Card 3 */}
              <div className="glass-card-premium rounded-2xl p-5 border border-white/5 hover:border-white/10 transition duration-300 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white">AI Interview Prep</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Practice simulated technical rounds with real-time feedback on your confidence, knowledge depth, and problem-solving pace.
                </p>
              </div>

              {/* Feature Card 4 */}
              <div className="glass-card-premium rounded-2xl p-5 border border-white/5 hover:border-white/10 transition duration-300 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white">Blockchain Credentials</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Receive secure, cryptographic certificates. Securely showcase your verified assessment scores instantly on LinkedIn and hiring platforms.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. VERIFIED OUTCOMES & LIVE METRICS */}
      <section className="py-20 md:py-28 relative z-10 overflow-hidden">
        {/* Background ambient lighting */}
        <div className="absolute top-[40%] right-[-10%] -z-10 h-96 w-96 rounded-full bg-cyan-500/5 blur-[120px]"></div>

        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <Badge className="bg-emerald-950/60 border-emerald-500/30 text-emerald-300 text-xs px-3 py-1 rounded-full uppercase tracking-wider">
              Platform Metrics
            </Badge>
            <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
              Concrete outcomes, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">not just empty claims</span>
            </h2>
            <p className="text-sm md:text-base text-slate-400 leading-relaxed">
              We focus heavily on learner success. These outcomes demonstrate the real impact of our platform.
            </p>
          </div>

          {/* Outcome Gauges */}
          <div className="grid gap-6 md:grid-cols-4">
            {siteConfig.outcomes.map((outcome, i) => {
              const glowColors = [
                "bg-cyan-500/5 group-hover:bg-cyan-500/15",
                "bg-indigo-500/5 group-hover:bg-indigo-500/15",
                "bg-purple-500/5 group-hover:bg-purple-500/15",
                "bg-emerald-500/5 group-hover:bg-emerald-500/15",
              ];
              const subTextColors = ["text-cyan-400", "text-indigo-400", "text-purple-400", "text-emerald-400"];
              return (
                <div key={outcome.label} className="glass-card-premium rounded-2xl p-6 border border-white/5 text-left relative overflow-hidden group">
                  <div className={`absolute top-0 right-0 h-16 w-16 rounded-full blur-xl transition-all ${glowColors[i % glowColors.length]}`}></div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{outcome.label}</p>
                  <p className="text-3xl font-extrabold text-white mt-4 font-display">{outcome.value}</p>
                  <p className={`text-[10px] font-medium mt-2 ${subTextColors[i % subTextColors.length]}`}>{outcome.sub}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. AI PLAYGROUND SNEAK-PEEK (MOCKED INTERACTIVE PLAYGROUND) */}
      <section className="py-20 md:py-28 relative z-10 border-t border-white/5 bg-[#02050f]/60 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            
            {/* Left side text */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <Badge className="bg-purple-950/60 border-purple-500/30 text-purple-300 text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                Intelligent Assistant
              </Badge>
              <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl leading-tight">
                An Elite <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">AI Learning Tutor</span> <br />
                Always in Your Corner.
              </h2>
              <p className="text-sm md:text-base text-slate-400 leading-relaxed">
                {siteConfig.demo.tutorDescription}
              </p>
              <div className="space-y-4 pt-2">
                <div className="flex gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400">
                    <Check className="h-4 w-4" />
                  </div>
                  <p className="text-xs text-slate-300">Contextual answers matching your learning progress</p>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400">
                    <Check className="h-4 w-4" />
                  </div>
                  <p className="text-xs text-slate-300">Translates complex concepts into clear visual explanations</p>
                </div>
              </div>
            </div>

            {/* Right side interactive mockup */}
            <div className="lg:col-span-7">
              <div className="w-full rounded-2xl border border-white/5 bg-[#060a18] p-5 shadow-[0_15px_40px_rgba(0,0,0,0.5)] space-y-4 text-left relative overflow-hidden">
                {/* Glowing subtle mesh background */}
                <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-indigo-500/5 blur-2xl"></div>

                {/* Simulated Chat Interface Header */}
                <div className="flex items-center justify-between border-b border-white/5 pb-3.5">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-indigo-500 pulse-dot"></div>
                    <span className="text-xs font-semibold text-slate-300">AI Tutor Helper</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">active_repo: el_learning</span>
                </div>

                {/* Chat History Mock */}
                <div className="space-y-4 text-xs font-mono">
                  {/* User Bubble */}
                  <div className="space-y-1.5 max-w-[85%] self-start">
                    <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">{siteConfig.demo.studentLabel}</span>
                    <div className="rounded-2xl rounded-tl-none bg-slate-900 p-3.5 border border-white/[0.03] text-slate-300 text-xs">
                      How do I securely calculate the average test grade inside `getStudentCourseProgress` without causing a N+1 query vulnerability?
                    </div>
                  </div>

                  {/* AI Bubble */}
                  <div className="space-y-1.5 max-w-[90%] ml-auto text-right">
                    <span className="text-[10px] text-cyan-400 font-semibold uppercase tracking-wider">AI TUTOR (Copilot)</span>
                    <div className="rounded-2xl rounded-tr-none bg-indigo-950/40 p-4 border border-indigo-500/20 text-slate-300 text-xs text-left space-y-3">
                      <p>Use the ORM&apos;s relational aggregation `_avg` within a single select query. Here is a secure, transaction-safe approach:</p>
                      
                      {/* Code Block Mock */}
                      <div className="rounded-xl bg-slate-950 p-3.5 border border-white/5 overflow-x-auto text-[11px] text-cyan-300 space-y-1">
                        <div><span className="text-purple-400">const</span> stats = <span className="text-purple-400">await</span> db.testResult.aggregate(&#123;</div>
                        <div>&nbsp;&nbsp;_avg: &#123; scorePercent: <span className="text-amber-400">true</span> &#125;,</div>
                        <div>&nbsp;&nbsp;where: &#123;</div>
                        <div>&nbsp;&nbsp;&nbsp;&nbsp;enrollment: &#123; studentId, courseId &#125;,</div>
                        <div>&nbsp;&nbsp;&nbsp;&nbsp;test: &#123; isPublished: <span className="text-amber-400">true</span> &#125;</div>
                        <div>&nbsp;&nbsp;&#125;</div>
                        <div>&#125;);</div>
                      </div>

                      <p className="text-[10px] text-emerald-400 flex items-center gap-1.5 mt-2">
                        <CheckCircle className="h-3.5 w-3.5" /> Checked: 100% compliant with your current schema models.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. PREMIUM BLOCKCHAIN CERTIFICATE SHOWCASE */}
      <section className="py-20 md:py-28 relative z-10 overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <Badge className="bg-amber-950/60 border-amber-500/30 text-amber-300 text-xs px-3 py-1 rounded-full uppercase tracking-wider">
              Earn Credentials
            </Badge>
            <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
              Blockchain-Verified <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Completion Certificate</span>
            </h2>
            <p className="text-sm md:text-base text-slate-400 leading-relaxed">
              Earn credentials that command respect. Upon course completion, receive a cryptographically sealed, printable certificate instantly shareable on LinkedIn and hiring registries.
            </p>
          </div>

          <div className="flex justify-center">
            {/* The Certificate Mockup */}
            <div className="relative w-full max-w-[620px] aspect-[1.6/1] bg-slate-950 rounded-3xl p-6 md:p-8 border-2 border-indigo-500/10 shadow-[0_25px_60px_rgba(0,0,0,0.6)] group overflow-hidden text-left flex flex-col justify-between">
              
              {/* Radial gradient corners */}
              <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all duration-300"></div>
              <div className="absolute bottom-0 left-0 h-40 w-40 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all duration-300"></div>

              {/* Certificate Border Framing */}
              <div className="absolute inset-2.5 rounded-[22px] border border-white/5 pointer-events-none"></div>

              <div className="flex justify-between items-start">
                <div className="space-y-1 relative z-10">
                  <div className="flex items-center gap-1.5">
                    <Zap className="h-4 w-4 text-indigo-400 fill-indigo-400/20 animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{siteConfig.name}</span>
                  </div>
                  <p className="text-[9px] text-slate-500 font-mono">CREDENTIAL VERIFICATION SEALS</p>
                </div>
                
                <div className="h-10 w-10 rounded-xl border border-white/10 bg-slate-900/60 flex items-center justify-center relative z-10">
                  {/* Mock QR code */}
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
                <p className="text-[11px] md:text-xs text-slate-400 leading-relaxed max-w-lg">
                  has successfully cleared all comprehensive assessments, interactive lessons, and hands-on projects to master the course:
                </p>
                <p className="text-sm md:text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mt-1">
                  {siteConfig.certificate.courseName}
                </p>
              </div>

              <div className="flex justify-between items-end pt-4 border-t border-white/5 relative z-10 text-[9px] text-slate-500 font-mono">
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

      {/* 8. STUDENT SUCCESS TESTIMONIALS */}
      <section className="py-20 md:py-28 relative z-10 border-t border-white/5 bg-[#02050f]/60 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <Badge className="bg-cyan-950/60 border-cyan-500/30 text-cyan-300 text-xs px-3 py-1 rounded-full uppercase tracking-wider">
              Success Stories
            </Badge>
            <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
              Learners achieving <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Real-World Impact</span>
            </h2>
            <p className="text-sm md:text-base text-slate-400 leading-relaxed">
              Read how learners from all backgrounds build new skills and advance their careers.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {siteConfig.testimonials.map((testimonial) => (
              <div key={testimonial.name} className="glass-card-premium rounded-2xl p-6 border border-white/5 text-left relative space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" />
                </div>
                <p className="text-xs leading-relaxed text-slate-300">
                  &quot;{testimonial.text}&quot;
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white text-xs">{testimonial.initials}</div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">{testimonial.name}</h4>
                    <p className="text-[10px] text-slate-500">{testimonial.role} @ {testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. CYBER ACCORDION FAQS */}
      <section className="py-20 md:py-28 relative z-10">
        <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-4">
            <Badge className="bg-indigo-950/60 border-indigo-500/30 text-indigo-300 text-xs px-3 py-1 rounded-full uppercase tracking-wider">
              Answers Hub
            </Badge>
            <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-400">
              Everything you need to know about our premium platform features, career services, and labs.
            </p>
          </div>

          <div className="space-y-4 text-left">
            <details className="group rounded-2xl border border-white/5 bg-[#0a0f21]/40 p-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between cursor-pointer focus:outline-none">
                <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition duration-200">
                  How does the integrated AI Tutor helper work?
                </h3>
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-900 border border-white/5 text-slate-400 group-open:rotate-180 transition-all">
                  <ChevronRight className="h-3.5 w-3.5 rotate-90" />
                </span>
              </summary>
              <p className="mt-4 text-xs leading-relaxed text-slate-400">
                The AI Tutor helper is context-aware. It processes your specific learning progress, detecting knowledge gaps, logical errors, and areas for improvement. It functions like an elite senior instructor providing guidance, rather than just giving you the answer outright.
              </p>
            </details>

            <details className="group rounded-2xl border border-white/5 bg-[#0a0f21]/40 p-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between cursor-pointer focus:outline-none">
                <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition duration-200">
                  Is career support available after course completion?
                </h3>
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-900 border border-white/5 text-slate-400 group-open:rotate-180 transition-all">
                  <ChevronRight className="h-3.5 w-3.5 rotate-90" />
                </span>
              </summary>
              <p className="mt-4 text-xs leading-relaxed text-slate-400">
                Yes, absolutely. Once you complete 100% of a course and average a score above 85% in assessments, your profile is showcased to our network of partner organizations. This provides access to top employers seeking skilled, certified professionals.
              </p>
            </details>

            <details className="group rounded-2xl border border-white/5 bg-[#0a0f21]/40 p-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between cursor-pointer focus:outline-none">
                <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition duration-200">
                  Are the certificates recognized by companies?
                </h3>
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-900 border border-white/5 text-slate-400 group-open:rotate-180 transition-all">
                  <ChevronRight className="h-3.5 w-3.5 rotate-90" />
                </span>
              </summary>
              <p className="mt-4 text-xs leading-relaxed text-slate-400">
                Yes. Our certificates are cryptographically verifiable. Every certificate carries a unique, shareable link displaying your actual assessment scores, lesson completion metrics, and project solutions. Employers verify your capabilities directly.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* 10. FINAL CINEMATIC CTA */}
      <section className="py-20 md:py-28 relative z-10 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 -z-10 h-[30rem] w-[30rem] rounded-full bg-indigo-500/10 blur-[130px]"></div>

        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[32px] border border-white/10 bg-[#060a1c] p-8 md:p-14 text-center overflow-hidden space-y-6">
            
            {/* Ambient sliding laser border lines */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"></div>

            <div className="max-w-2xl mx-auto space-y-4">
              <Badge className="bg-cyan-950/60 border-cyan-500/30 text-cyan-300 text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                Start Today
              </Badge>
              <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl md:text-5xl leading-tight">
                Step into the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Future of Learning</span>.
              </h2>
              <p className="text-sm md:text-base text-slate-400 leading-relaxed">
                {siteConfig.cta.subtext}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Button asChild className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold hover:from-indigo-500 hover:to-cyan-500 rounded-xl px-8 py-6 text-base shadow-[0_0_30px_rgba(99,102,241,0.45)] border border-white/10 transition duration-300 hover:scale-[1.03]">
                <Link href="/register">{siteConfig.cta.primaryLabel}</Link>
              </Button>
              <Button asChild variant="outline" className="border-white/10 bg-slate-950/40 hover:bg-slate-900/60 text-slate-300 hover:text-white rounded-xl px-8 py-6 text-base">
                <Link href="/courses">{siteConfig.cta.secondaryLabel}</Link>
              </Button>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}