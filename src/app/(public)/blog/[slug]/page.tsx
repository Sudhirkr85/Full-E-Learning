import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { makeMetadata, siteConfig } from "@/lib/site";
import { BLOG_POSTS, getBlogPostBySlug, getAllBlogSlugs } from "@/lib/blog-data";
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
  Share2,
  Send,
  HelpCircle,
  Award,
  ExternalLink,
  ChevronRight,
  Smartphone,
  PhoneCall,
  ShoppingBag,
  Eye,
} from "lucide-react";
import { PdfViewerClient } from "@/components/blog/pdf-viewer-client";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "लेख नहीं मिला | Sagar Coaching Centre",
      description: "अनुरोधित प्रश्न पत्र या लेख उपलब्ध नहीं है।",
    };
  }

  return {
    ...makeMetadata({
      title: `${post.title} | Sagar Coaching Centre`,
      description: post.excerpt,
      path: `/blog/${post.slug}`,
    }),
    keywords: post.metaKeywords,
  };
}

export default async function BlogPostDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const pageUrl = `${baseUrl}/blog/${post.slug}`;

  // JSON-LD Structured Data
  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    author: {
      "@type": "Person",
      name: post.author,
      jobTitle: post.authorRole,
      url: `${baseUrl}/#about`,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo-circle-transparent.png`,
      },
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: pageUrl,
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog & PYQ",
        item: `${baseUrl}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: pageUrl,
      },
    ],
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const relatedPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug);

  const shareText = encodeURIComponent(`${post.title}\n\nडाउनलोड करें: ${pageUrl}`);
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${shareText}`;
  const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(post.title)}`;
  const downloadApiUrl = `/api/pyq/${post.slug}/download`;

  return (
    <>
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />

      <div className="min-h-screen bg-slate-950 text-slate-100">
        {/* ── Breadcrumb Navigation ── */}
        <div className="border-b border-white/10 bg-slate-900/60 py-3 text-xs text-slate-400">
          <Container>
            <nav className="flex items-center space-x-2">
              <Link href="/" className="hover:text-indigo-400">
                Home
              </Link>
              <ChevronRight className="h-3 w-3 text-slate-600" />
              <Link href="/blog" className="hover:text-indigo-400">
                Blog & PYQ
              </Link>
              <ChevronRight className="h-3 w-3 text-slate-600" />
              <span className="truncate text-slate-200">{post.year} Paper</span>
            </nav>
          </Container>
        </div>

        {/* ── Main Layout (Content + Sidebar) ── */}
        <Container className="py-10 md:py-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            
            {/* ── LEFT: Main Article Column ── */}
            <main className="lg:col-span-8">
              
              {/* Header Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="border-amber-500/40 bg-amber-500/15 text-amber-300">
                  {post.year} Question Paper
                </Badge>
                <Badge className="border-indigo-500/40 bg-indigo-500/15 text-indigo-300">
                  {post.state} SCERT
                </Badge>
                <span className="text-xs text-slate-400">
                  {post.readTime}
                </span>
              </div>

              {/* H1 Heading */}
              <h1 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-4xl text-white">
                {post.title}
              </h1>

              <p className="mt-2 text-sm sm:text-base font-semibold text-amber-300/90">
                {post.hindiTitle}
              </p>

              {/* Author & Share Bar */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-white/10 py-4 text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 font-bold text-white">
                    SS
                  </div>
                  <div>
                    <div className="font-semibold text-slate-200">{post.author}</div>
                    <div className="text-[11px] text-slate-400">{post.authorRole}</div>
                  </div>
                </div>

                {/* Social Share Buttons */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">शेयर करें:</span>
                  <a
                    href={whatsappShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-1.5 font-medium text-white transition hover:bg-emerald-500"
                  >
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={telegramShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-md bg-sky-600 px-3 py-1.5 font-medium text-white transition hover:bg-sky-500"
                  >
                    <Send className="h-3 w-3" />
                    <span>Telegram</span>
                  </a>
                </div>
              </div>

              {/* ── TOP HERO DOWNLOAD CARD ── */}
              <div className="my-8 rounded-2xl border-2 border-indigo-500/40 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900 p-6 shadow-2xl">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400">
                      <FileText className="h-4 w-4" />
                      <span>ओरिजिनल प्रश्न पत्र + उत्तर कुंजी</span>
                    </div>
                    <h2 className="mt-1 text-xl font-bold text-white">
                      {post.pdfFileName}
                    </h2>
                    <p className="mt-1 text-xs text-slate-300">
                      साफ-सुथरी डिजिटल कॉपी • कुल {post.pdfPages} पृष्ठ • {post.pdfSize}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={downloadApiUrl}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition hover:from-amber-400 hover:to-orange-400"
                    >
                      <Download className="h-4 w-4" />
                      <span>डाउनलोड PDF</span>
                    </a>
                    <a
                      href={post.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                    >
                      <span>ऑनलाइन देखें</span>
                      <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                    </a>
                  </div>
                </div>
              </div>

              {/* ── LIVE INTERACTIVE PDF VIEWER ── */}
              <PdfViewerClient
                pdfUrl={post.pdfUrl}
                pdfFileName={post.pdfFileName}
                downloadUrl={downloadApiUrl}
                pdfPages={post.pdfPages}
                pdfSize={post.pdfSize}
              />

              {/* ── Quick Overview Table ── */}
              <section className="mt-10">
                <h3 className="text-xl font-bold text-white">
                  1. परीक्षा का संक्षिप्त विवरण (Quick Overview)
                </h3>
                <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-slate-900/50">
                  <table className="w-full text-left text-sm">
                    <tbody className="divide-y divide-white/5">
                      {post.overview.map((item, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? "bg-white/[0.02]" : ""}>
                          <th className="w-1/3 p-3.5 font-medium text-slate-400">
                            {item.label}
                          </th>
                          <td className="p-3.5 font-semibold text-slate-200">
                            {item.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* ── Exam Pattern Table ── */}
              <section className="mt-10">
                <h3 className="text-xl font-bold text-white">
                  2. परीक्षा पैटर्न एवं अंक विभाजन (Exam Pattern)
                </h3>
                <div className="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-slate-900/50">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-white/10 bg-indigo-950/40 text-xs font-semibold text-indigo-300">
                      <tr>
                        <th className="p-3.5">प्रश्न पत्र</th>
                        <th className="p-3.5">विषय / टॉपिक्स</th>
                        <th className="p-3.5 text-center">प्रश्न</th>
                        <th className="p-3.5 text-center">अंक</th>
                        <th className="p-3.5">समय</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {post.pattern.map((p, idx) => (
                        <tr key={idx}>
                          <td className="p-3.5 font-bold text-white">{p.paper}</td>
                          <td className="p-3.5 text-slate-300">{p.subjects}</td>
                          <td className="p-3.5 text-center font-bold text-amber-400">{p.questions}</td>
                          <td className="p-3.5 text-center font-bold text-amber-400">{p.marks}</td>
                          <td className="p-3.5 text-slate-300">{p.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* ── Structured Content Sections ── */}
              <div className="mt-10 space-y-8">
                {post.contentSections.map((sec, idx) => (
                  <section key={idx} className="rounded-xl border border-white/5 bg-slate-900/40 p-6">
                    <h3 className="text-xl font-bold text-white">
                      {sec.heading}
                    </h3>
                    {sec.subheading && (
                      <p className="mt-1 text-xs font-medium text-indigo-400">
                        {sec.subheading}
                      </p>
                    )}

                    <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-300">
                      {sec.paragraphs.map((p, pIdx) => (
                        <p key={pIdx}>{p}</p>
                      ))}
                    </div>

                    {sec.bulletPoints && sec.bulletPoints.length > 0 && (
                      <ul className="mt-4 space-y-2 text-sm text-slate-300">
                        {sec.bulletPoints.map((bp, bpIdx) => (
                          <li key={bpIdx} className="flex items-start gap-2">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                            <span>{bp}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                ))}
              </div>

              {/* ── BOTTOM DOWNLOAD BOX ── */}
              <div className="my-10 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-slate-900 to-indigo-950/40 p-6 text-center sm:p-8">
                <h3 className="text-2xl font-bold text-white">
                  {post.year} का संपूर्ण प्रश्न पत्र PDF अभी डाउनलोड करें
                </h3>
                <p className="mt-2 text-sm text-slate-300">
                  यह PDF पूरी तरह निशुल्क है। अपने दोस्तों और सहपाठियों के साथ भी शेयर करें।
                </p>

                <div className="mt-6 flex flex-wrap justify-center gap-4">
                  <a
                    href={downloadApiUrl}
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-xl shadow-amber-500/20 transition hover:bg-amber-400"
                  >
                    <Download className="h-5 w-5" />
                    <span>डाउनलोड करें ({post.pdfSize})</span>
                  </a>
                  <a
                    href={whatsappShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-5 py-3.5 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/20"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>WhatsApp ग्रुप में भेजें</span>
                  </a>
                </div>
              </div>

              {/* ── Frequently Asked Questions (FAQ) ── */}
              <section className="mt-12">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-indigo-400" />
                  <h3 className="text-xl font-bold text-white">
                    अक्सर पूछे जाने वाले प्रश्न (FAQs)
                  </h3>
                </div>

                <div className="mt-6 space-y-4">
                  {post.faqs.map((faq, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-white/10 bg-slate-900/60 p-5"
                    >
                      <h4 className="font-semibold text-amber-300">
                        {faq.question}
                      </h4>
                      <p className="mt-2 text-sm leading-relaxed text-slate-300">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── Related Question Papers ── */}
              <section className="mt-14 border-t border-white/10 pt-8">
                <h3 className="text-xl font-bold text-white">अन्य वर्षों के प्रश्न पत्र भी हल करें</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {relatedPosts.map((rel) => (
                    <Link
                      key={rel.slug}
                      href={`/blog/${rel.slug}`}
                      className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/40 p-4 transition hover:border-indigo-500/50 hover:bg-slate-900"
                    >
                      <div>
                        <div className="text-xs font-semibold text-amber-400">
                          {rel.year} Paper
                        </div>
                        <div className="mt-1 text-sm font-bold text-white line-clamp-1">
                          {rel.title}
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
                    </Link>
                  ))}
                </div>
              </section>
            </main>

            {/* ── RIGHT: Sticky Sidebar ── */}
            <aside className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">
                
                {/* 1. Quick Download Box */}
                <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 shadow-lg">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
                    <Download className="h-4 w-4" />
                    <span>Quick Download</span>
                  </div>
                  <h4 className="mt-2 font-bold text-white">{post.year} Solved Paper</h4>
                  <p className="mt-1 text-xs text-slate-400">
                    49 पृष्ठ • {post.pdfSize} • Answer Key Included
                  </p>
                  <div className="mt-4 flex flex-col gap-2">
                    <a
                      href={downloadApiUrl}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white transition hover:bg-indigo-500"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download PDF Now</span>
                    </a>
                    <a
                      href={post.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Fullscreen</span>
                    </a>
                  </div>
                </div>

                {/* 2. Raghav Prakashan Book Store Promo */}
                <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-500/10 to-slate-900 p-5 shadow-lg">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                    <ShoppingBag className="h-4 w-4" />
                    <span>Recommended Book</span>
                  </div>
                  <h4 className="mt-2 text-base font-bold text-white">
                    NMMS Complete Guide Book
                  </h4>
                  <p className="mt-1 text-xs text-slate-300">
                    श्रवण कुमार सागर सर द्वारा लिखित राघव प्रकाशन की पुस्तक। 2021-2026 तक के हल प्रश्न पत्र और टॉपिक-वाइज थ्योरी।
                  </p>
                  <Link
                    href="/store"
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-amber-400"
                  >
                    <span>Store में पुस्तक देखें</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                {/* 3. VIP Telegram Alert Banner */}
                <div className="rounded-2xl border border-sky-500/30 bg-gradient-to-b from-sky-950/40 to-slate-900 p-5 shadow-lg">
                  <div className="flex items-center gap-2 text-xs font-bold text-sky-400">
                    <Send className="h-4 w-4" />
                    <span>VIP Telegram Channel</span>
                  </div>
                  <h4 className="mt-2 text-base font-bold text-white">
                    NMMS 2026-27 Alerts
                  </h4>
                  <p className="mt-1 text-xs text-slate-300">
                    SCERT के सभी नोटिफिकेशन, एडमिट कार्ड, और कट-ऑफ लिस्ट की तुरंत सूचना के लिए जुड़ें।
                  </p>
                  <Link
                    href="/vip-telegram"
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 py-2.5 text-xs font-bold text-white transition hover:bg-sky-500"
                  >
                    <span>Join VIP Channel (₹49)</span>
                  </Link>
                </div>

                {/* 4. Coaching Support Card */}
                <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 text-xs text-slate-300">
                  <div className="font-bold text-white">सहायता व मार्गदर्शन:</div>
                  <div className="mt-2 text-slate-400">
                    Sagar Coaching Centre, Bhagwanpur (Supaul, Bihar)
                  </div>
                  <a
                    href="https://wa.me/919110113671"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex items-center gap-2 font-semibold text-emerald-400 hover:underline"
                  >
                    <PhoneCall className="h-3.5 w-3.5" />
                    <span>WhatsApp: +91 91101 13671</span>
                  </a>
                </div>

              </div>
            </aside>

          </div>
        </Container>
      </div>
    </>
  );
}
