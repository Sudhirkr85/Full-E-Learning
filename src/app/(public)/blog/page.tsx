import type { Metadata } from "next";
import Link from "next/link";
import { makeMetadata, siteConfig } from "@/lib/site";
import { BLOG_POSTS } from "@/lib/blog-data";
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
} from "lucide-react";

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

export default function BlogListingPage() {
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
                <div className="text-xl font-bold text-indigo-400 sm:text-2xl">40+</div>
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
          <div className="mb-8 flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">उपलब्ध प्रश्न पत्र व गाइड्स</h2>
              <p className="mt-1 text-sm text-slate-400">
                प्रत्येक पेपर के पेज पर संपूर्ण विश्लेषण, सिलेबस और डायरेक्ट PDF डाउनलोड बटन दिया गया है।
              </p>
            </div>
            <Badge className="w-fit border-indigo-500/40 bg-indigo-500/10 text-indigo-300">
              {BLOG_POSTS.length} लेख उपलब्ध
            </Badge>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {BLOG_POSTS.map((post) => (
              <article
                key={post.slug}
                className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-xl transition-all hover:border-indigo-500/50 hover:bg-slate-900/90 hover:shadow-2xl hover:shadow-indigo-500/10"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-300">
                      {post.year} Paper
                    </span>
                    <span className="rounded-full bg-indigo-500/15 px-3 py-1 text-xs font-medium text-indigo-300">
                      {post.state} SCERT
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="mt-4 text-lg font-bold text-white transition group-hover:text-indigo-400">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>

                  <p className="mt-2 text-xs font-medium text-amber-300/80">
                    {post.hindiTitle}
                  </p>

                  <p className="mt-3 line-clamp-3 text-sm text-slate-300">
                    {post.excerpt}
                  </p>

                  {/* Meta Specs */}
                  <div className="mt-5 rounded-lg border border-white/5 bg-white/5 p-3 text-xs text-slate-300">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">कुल पृष्ठ:</span>
                      <span className="font-semibold text-white">{post.pdfPages} Pages</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-slate-400">फ़ाइल साइज:</span>
                      <span className="font-semibold text-white">{post.pdfSize}</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-slate-400">आंसर की:</span>
                      <span className="font-semibold text-emerald-400">संलग्न (Included)</span>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{post.readTime}</span>
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-500"
                  >
                    <span>विस्तार से देखें</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* ── Community / Support Banner ── */}
          <div className="mt-16 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-indigo-950/40 to-slate-900 p-8">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400">
                  <Award className="h-4 w-4" />
                  <span>Sagar Coaching Centre Bhagwanpur</span>
                </div>
                <h3 className="mt-2 text-2xl font-bold text-white">
                  NMMS 2026-27 के आगामी पेपर्स और अलर्ट सबसे पहले पाना चाहते हैं?
                </h3>
                <p className="mt-2 max-w-xl text-sm text-slate-300">
                  हमारे VIP Telegram चैनल और मोबाइल ऐप से जुड़ें। एडमिट कार्ड, नोटिफिकेशन, लाइव क्लासेस और रिजल्ट अपडेट तुरंत प्राप्त करें।
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/vip-telegram"
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-400"
                >
                  <Send className="h-4 w-4" />
                  <span>VIP Telegram ज्वाइन करें</span>
                </Link>
                <a
                  href={siteConfig.appPlayStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  <Smartphone className="h-4 w-4 text-emerald-400" />
                  <span>App डाउनलोड करें</span>
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
