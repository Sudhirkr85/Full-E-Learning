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
  Send,
  Smartphone,
  Award,
  Bell,
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-indigo-950/40 via-slate-950 to-slate-950 py-16 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.25),rgba(255,255,255,0))]" />
        
        <Container className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>100% निःशुल्क ऑफिशियल प्रश्न पत्र & आंसर की</span>
            </div>

            <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-5xl">
              NMMS Previous Year Papers & <br />
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 bg-clip-text text-transparent">
                Study Material Repository
              </span>
            </h1>

            <p className="mt-4 text-base text-slate-300 sm:text-lg">
              राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS) के ओरिजिनल प्रश्न पत्र, आधिकारिक उत्तर कुंजी और संपूर्ण तैयारी गाइड। सागर सर द्वारा सत्यापित एवं साफ-सुथरी HD PDF फॉर्मेट में उपलब्ध।
            </p>

            {/* Quick Metrics */}
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center backdrop-blur">
                <div className="text-xl font-bold text-indigo-400 sm:text-2xl">{BLOG_POSTS.length}+</div>
                <div className="text-xs text-slate-400">ओरिजिनल पेपर्स</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center backdrop-blur">
                <div className="text-xl font-bold text-amber-400 sm:text-2xl">100% Free</div>
                <div className="text-xs text-slate-400">ऑनलाइन रीडिंग</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center backdrop-blur">
                <div className="text-xl font-bold text-emerald-400 sm:text-2xl">MAT + SAT</div>
                <div className="text-xs text-slate-400">दोनों भाग शामिल</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center backdrop-blur">
                <div className="text-xl font-bold text-sky-400 sm:text-2xl">Answer Key</div>
                <div className="text-xs text-slate-400">सत्यापित उत्तर तालिका</div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Main Articles List ── */}
      <section className="py-12 md:py-16">
        <Container>
          {/* ── ताज़ा अपडेट Strip ── */}
          {recentUpdates && recentUpdates.length > 0 && (
            <div className="mb-10 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 p-4 sm:p-5 shadow-xl">
              <div className="flex items-center justify-between gap-3 mb-3 border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    ताज़ा अपडेट (Latest Updates & Alerts)
                  </span>
                </div>
                <Link
                  href="/updates"
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  <span>सभी अपडेट्स देखें</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {recentUpdates.map((up) => (
                  <Link
                    key={up.id}
                    href={`/updates/${up.slug}`}
                    className="flex flex-col justify-between p-3 rounded-xl bg-slate-950/60 border border-white/5 hover:border-indigo-500/40 hover:bg-slate-950 transition group"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-300 mb-1">
                        <span className="rounded bg-indigo-500/20 px-1.5 py-0.5">
                          {up.type}
                        </span>
                        {up.state && <span className="text-slate-400">{up.state}</span>}
                      </div>
                      <h4 className="text-xs font-semibold text-white group-hover:text-indigo-300 line-clamp-2 leading-snug">
                        {up.title}
                      </h4>
                    </div>
                    <span className="mt-2 text-[10px] text-slate-400">
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

          <div className="mb-8 flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">उपलब्ध प्रश्न पत्र व गाइड्स</h2>
              <p className="mt-1 text-sm text-slate-400">
                प्रत्येक पेपर के पेज पर संपूर्ण विश्लेषण, सिलेबस और डायरेक्ट PDF डाउनलोड बटन दिया गया है।
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-indigo-500/40 bg-indigo-500/10 text-indigo-300">
                Total {BLOG_POSTS.length} PYQ Papers
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {BLOG_POSTS.map((post) => (
              <article
                key={post.slug}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:bg-slate-900 hover:shadow-2xl hover:shadow-indigo-950/40"
              >
                <div>
                  {/* Category & Year */}
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold text-indigo-400">{post.category}</span>
                    <span className="rounded-full bg-white/5 px-2.5 py-0.5 font-medium text-slate-300 border border-white/10">
                      {post.year} Paper
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="mt-3 text-lg font-bold leading-snug text-white transition-colors group-hover:text-indigo-300">
                    <Link href={`/blog/${post.slug}`}>
                      <span className="absolute inset-0" />
                      {post.title}
                    </Link>
                  </h3>

                  {/* Excerpt */}
                  <p className="mt-2.5 text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="mt-6 border-t border-white/5 pt-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 text-[11px]">
                      <FileText className="h-3.5 w-3.5 text-indigo-400" />
                      <span>{post.pdfPages} Pages • {post.pdfSize}</span>
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-indigo-400 group-hover:text-indigo-300">
                      <span>पढ़ें</span>
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Policy-Compliant Blog Feed Bottom Ad Slot */}
          <AdSlot format="horizontal" minHeight={120} className="mt-12" />
        </Container>
      </section>
    </div>
  );
}
