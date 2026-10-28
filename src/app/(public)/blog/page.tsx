import type { Metadata } from "next";
import Link from "next/link";
import { makeMetadata, siteConfig } from "@/lib/site";
import { BLOG_POSTS } from "@/lib/blog-data";
import { getPublishedUpdates } from "@/lib/updates/queries";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Download,
  Calendar,
  Clock,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Award,
  Layers,
  ChevronRight,
} from "lucide-react";
import { AdSlot } from "@/components/ads/AdSlot";

export const metadata: Metadata = {
  ...makeMetadata({
    title: "NMMS Previous Year Question Papers & Answer Keys PDF Download | Sagar Coaching Centre",
    description:
      "Download official NMMS Question Papers (2024, 2023, 2019) with verified Answer Keys in PDF. Free MAT and SAT study material, solutions and exam guides by Shrvan Kumar Sagar.",
    path: "/blog",
  }),
  keywords: [
    "NMMS Previous Year Question Papers",
    "Bihar NMMS Question Paper PDF",
    "NMMS 2024 Question Paper with Answer Key",
    "NMMS 2023 Question Paper PDF Download",
    "NMMS 2019 Question Paper Solved",
    "NMMS MAT SAT Question Paper",
    "Sagar Coaching Centre Bhagwanpur",
    "Shrvan Kumar Sagar",
    "NMMS Study Material PDF",
    "SCERT Bihar Scholarship Papers",
  ],
};

export const revalidate = 60; // ISR 1 minute

export default async function BlogListingPage() {
  const recentUpdates = await getPublishedUpdates(5);

  // Group posts dynamically into distinct paper types
  const officialPapers = BLOG_POSTS.filter(
    (p) => !p.slug.includes("set-") && (p.title.includes("2024") || p.title.includes("2023") || p.title.includes("2025") || p.title.includes("2022") || p.title.includes("2020") || p.title.includes("2019"))
  );

  const modelSets = BLOG_POSTS.filter((p) => p.slug.includes("set-") || p.title.includes("मॉडल") || p.title.includes("Model"));

  const otherPapers = BLOG_POSTS.filter(
    (p) => !officialPapers.some((o) => o.slug === p.slug) && !modelSets.some((m) => m.slug === p.slug)
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      {/* ── Light Modern Hero Banner ── */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-indigo-50/70 via-white to-[#f8fafc] py-14 md:py-20">
        <div className="absolute top-0 right-0 -z-10 h-72 w-72 rounded-full bg-indigo-500/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 -z-10 h-72 w-72 rounded-full bg-amber-500/5 blur-3xl" />

        <Container className="relative">
          <div className="mx-auto max-w-3xl text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-xs font-bold text-indigo-700 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>100% निःशुल्क ऑफिशियल प्रश्न पत्र & आंसर की लाइब्रेरी</span>
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-5xl text-slate-900 font-display">
              NMMS Previous Year Papers & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-700 to-cyan-600">
                Official Study Material
              </span>
            </h1>

            <p className="text-sm md:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS) के मूल प्रश्न पत्र, आधिकारिक उत्तर तालिकाएं और सागर सर द्वारा तैयार किए गए उच्च-स्तरीय मॉडल प्रैक्टिस सेट्स।
            </p>

            {/* Quick Metrics Cards */}
            <div className="pt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 max-w-2xl mx-auto">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm hover:shadow transition">
                <div className="text-2xl font-black text-indigo-600">{BLOG_POSTS.length}</div>
                <div className="text-xs font-semibold text-slate-500 mt-0.5">उपलब्ध प्रश्न पत्र</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm hover:shadow transition">
                <div className="text-2xl font-black text-emerald-600">100% Free</div>
                <div className="text-xs font-semibold text-slate-500 mt-0.5">ऑनलाइन रीडिंग</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm hover:shadow transition">
                <div className="text-2xl font-black text-amber-600">MAT + SAT</div>
                <div className="text-xs font-semibold text-slate-500 mt-0.5">दोनों खंड शामिल</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm hover:shadow transition">
                <div className="text-2xl font-black text-sky-600">HD PDF</div>
                <div className="text-xs font-semibold text-slate-500 mt-0.5">प्रिंट-रेडी फाइल्स</div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Main Content Area ── */}
      <section className="py-12 md:py-16">
        <Container>
          {/* ── ताज़ा अपडेट Strip (Clean Light Card) ── */}
          {recentUpdates && recentUpdates.length > 0 && (
            <div className="mb-12 rounded-2xl border border-indigo-100 bg-white p-5 md:p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-4 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
                    ताज़ा परीक्षा सूचनाएं व गाइड्स (Latest Notifications)
                  </span>
                </div>
                <Link
                  href="/updates"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition"
                >
                  <span>सभी 12 अपडेट्स देखें</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {recentUpdates.map((up) => (
                  <Link
                    key={up.id}
                    href={`/updates/${up.slug}`}
                    className="flex flex-col justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/80 hover:border-indigo-200 transition group text-left"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-700 mb-1">
                        <span className="rounded bg-indigo-100 px-1.5 py-0.5">
                          {up.type}
                        </span>
                        {up.state && <span className="text-slate-500 font-medium">{up.state}</span>}
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 line-clamp-2 leading-snug">
                        {up.title}
                      </h4>
                    </div>
                    <span className="mt-2 text-[10px] font-medium text-slate-500">
                      {new Date(up.publishedAt || up.createdAt).toLocaleDateString("hi-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              SECTION 1: आधिकारिक ओरिजिनल प्रश्न पत्र (Official SCERT Papers)
              ══════════════════════════════════════════════════════════════ */}
          {officialPapers.length > 0 && (
            <div className="mb-14 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-amber-100 p-1.5 text-amber-800">
                      <ShieldCheck className="h-4 w-4" />
                    </span>
                    <h2 className="text-2xl font-black text-slate-900 font-display">
                      आधिकारिक ओरिजिनल प्रश्न पत्र (Official SCERT Papers)
                    </h2>
                  </div>
                  <p className="mt-1 text-xs sm:text-sm text-slate-600">
                    राज्य शिक्षा शोध एवं प्रशिक्षण परिषद् द्वारा आयोजित वास्तविक परीक्षा के मूल पेपर्स व ऑफिशियल आंसर की।
                  </p>
                </div>
                <Badge className="bg-amber-50 border-amber-200 text-amber-800 font-bold self-start sm:self-auto">
                  {officialPapers.length} ओरिजिनल पेपर्स
                </Badge>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {officialPapers.map((post) => (
                  <article
                    key={post.slug}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border-2 border-amber-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-400 hover:shadow-xl text-left"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="inline-flex items-center gap-1 font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                          <Award className="h-3 w-3 text-amber-600" />
                          <span>{post.state} Original</span>
                        </span>
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-bold text-slate-700 border border-slate-200 text-[11px]">
                          {post.year} Paper
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="mt-3 text-base sm:text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-indigo-600">
                        <Link href={`/blog/${post.slug}`}>
                          <span className="absolute inset-0" />
                          {post.title}
                        </Link>
                      </h3>

                      {/* Hindi Subtitle */}
                      <p className="mt-1.5 text-xs font-semibold text-indigo-700 line-clamp-1">
                        {post.hindiTitle}
                      </p>

                      {/* Excerpt */}
                      <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="mt-5 border-t border-slate-100 pt-4 flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1.5 text-[11px] font-medium">
                        <FileText className="h-3.5 w-3.5 text-amber-600" />
                        <span>{post.pdfPages} पृष्ठ • {post.pdfSize}</span>
                      </span>
                      <span className="flex items-center gap-1 font-bold text-indigo-600 group-hover:translate-x-1 transition-transform">
                        <span>हल सहित पढ़ें</span>
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              SECTION 2: सागर सर मॉडल प्रैक्टिस सेट्स (Model Practice Sets)
              ══════════════════════════════════════════════════════════════ */}
          {modelSets.length > 0 && (
            <div className="mb-14 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-emerald-100 p-1.5 text-emerald-800">
                      <Layers className="h-4 w-4" />
                    </span>
                    <h2 className="text-2xl font-black text-slate-900 font-display">
                      सागर सर मॉडल प्रैक्टिस सेट्स (Model Practice Sets)
                    </h2>
                  </div>
                  <p className="mt-1 text-xs sm:text-sm text-slate-600">
                    परीक्षा हॉल जैसा समयबद्ध अभ्यास, ओएमआर स्पीड और हाई-स्कोर के लिए विशेष रूप से संकलित अभ्यास प्रश्न पत्र।
                  </p>
                </div>
                <Badge className="bg-emerald-50 border-emerald-200 text-emerald-800 font-bold self-start sm:self-auto">
                  {modelSets.length} मॉडल सेट्स
                </Badge>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {modelSets.map((post) => (
                  <article
                    key={post.slug}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl text-left"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100">
                          <Sparkles className="h-3 w-3 text-emerald-600" />
                          <span>Model Practice Set</span>
                        </span>
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-bold text-slate-700 border border-slate-200 text-[11px]">
                          {post.year}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="mt-3 text-base sm:text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-emerald-700">
                        <Link href={`/blog/${post.slug}`}>
                          <span className="absolute inset-0" />
                          {post.title}
                        </Link>
                      </h3>

                      {/* Excerpt */}
                      <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="mt-5 border-t border-slate-100 pt-4 flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1.5 text-[11px] font-medium">
                        <BookOpen className="h-3.5 w-3.5 text-emerald-600" />
                        <span>{post.pdfPages} पृष्ठ • {post.pdfSize}</span>
                      </span>
                      <span className="flex items-center gap-1 font-bold text-emerald-700 group-hover:translate-x-1 transition-transform">
                        <span>प्रैक्टिस करें</span>
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              SECTION 3: विषय-वार व अन्य पेपर्स (Subject-Wise & Other Papers)
              ══════════════════════════════════════════════════════════════ */}
          {otherPapers.length > 0 && (
            <div className="mb-14 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    विषय-वार अभ्यास पत्र (Subject-Wise Study Papers)
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-slate-600">
                    MAT तर्कशक्ति और SAT विज्ञान/सामाजिक विज्ञान के विशेष अभ्यास खंड।
                  </p>
                </div>
                <Badge className="bg-slate-100 border-slate-200 text-slate-700 font-bold self-start sm:self-auto">
                  {otherPapers.length} पेपर्स
                </Badge>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {otherPapers.map((post) => (
                  <article
                    key={post.slug}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-300 hover:shadow-md text-left"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                        {post.category}
                      </span>
                      <h3 className="mt-2 text-sm font-bold text-slate-900 group-hover:text-indigo-600 line-clamp-2">
                        <Link href={`/blog/${post.slug}`}>
                          <span className="absolute inset-0" />
                          {post.title}
                        </Link>
                      </h3>
                      <p className="mt-1.5 text-xs text-slate-500 line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span>{post.pdfPages} पृष्ठ</span>
                      <span className="font-bold text-indigo-600">देखें →</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* Ad Slot */}
          <AdSlot format="horizontal" minHeight={120} className="mt-8" />
        </Container>
      </section>
    </div>
  );
}
