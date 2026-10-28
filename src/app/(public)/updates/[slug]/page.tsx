import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { makeMetadata, siteConfig } from "@/lib/site";
import { Container } from "@/components/ui/container";
import { getUpdateBySlug, getPublicSlugs } from "@/lib/updates/queries";
import { SafeBodyRenderer } from "@/lib/updates/safe-body-renderer";
import { AdSlot } from "@/components/ads/AdSlot";
import {
  Calendar,
  Clock,
  ExternalLink,
  Download,
  FileText,
  AlertTriangle,
  HelpCircle,
  Link as LinkIcon,
  ChevronRight,
  Send,
  ShoppingBag,
  Bell,
  ShieldAlert,
} from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getPublicSlugs();
  return slugs.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getUpdateBySlug(slug);

  if (!post || post.status === "DRAFT") {
    return {
      title: "अपडेट नहीं मिला | Sagar Coaching Centre",
      description: "अनुरोधित सूचना या परीक्षा अपडेट उपलब्ध नहीं है।",
    };
  }

  const metaTitle = post.seoTitle || `${post.title} | Sagar Coaching Centre`;
  const metaDescription = post.seoDescription || post.summary;

  return makeMetadata({
    title: metaTitle,
    description: metaDescription,
    path: `/updates/${post.slug}`,
  });
}

export const revalidate = 60; // ISR 1 minute

export default async function UpdateDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getUpdateBySlug(slug);

  if (!post || post.status === "DRAFT") {
    notFound();
  }

  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const pageUrl = `${baseUrl}/updates/${post.slug}`;

  // Structured Data: Article
  const jsonLdArticle: any = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.summary,
    author: {
      "@type": "Organization",
      name: siteConfig.name,
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo-circle-transparent.png`,
      },
    },
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: pageUrl,
  };

  // Structured Data: Breadcrumbs
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
        name: "Updates",
        item: `${baseUrl}/updates`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: pageUrl,
      },
    ],
  };

  // Structured Data: FAQPage (if faqs exist)
  let jsonLdFaq: any = null;
  if (post.faqs && post.faqs.length > 0) {
    jsonLdFaq = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: post.faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.answer,
        },
      })),
    };
  }

  const getLinkIcon = (kind: string) => {
    switch (kind) {
      case "download":
        return <Download className="h-4 w-4" />;
      case "apply":
      case "official":
        return <ExternalLink className="h-4 w-4" />;
      case "notification":
        return <FileText className="h-4 w-4" />;
      default:
        return <LinkIcon className="h-4 w-4" />;
    }
  };

  const getLinkButtonStyle = (kind: string) => {
    switch (kind) {
      case "download":
        return "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-950/40";
      case "apply":
        return "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold shadow-amber-950/40";
      case "official":
        return "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-indigo-950/40";
      default:
        return "bg-slate-800 hover:bg-slate-700 text-white border border-white/10";
    }
  };

  return (
    <>
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      {jsonLdFaq && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
      )}

      <div className="min-h-screen bg-slate-950 text-white py-10 sm:py-14">
        <Container>
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-slate-400"
          >
            <Link href="/" className="hover:text-white transition">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
            <Link href="/updates" className="hover:text-white transition">
              Updates
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
            <span className="text-slate-300 font-medium truncate max-w-[200px] sm:max-w-md">
              {post.title}
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content Column */}
            <main className="lg:col-span-8 space-y-6">
              {/* Expired Status Notice */}
              {post.status === "EXPIRED" && (
                <div className="rounded-2xl border border-amber-500/40 bg-amber-950/30 p-4 sm:p-5 flex items-start gap-3 text-amber-200">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-amber-400 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-amber-300">
                      यह अपडेट पुराना हो सकता है (Expired Notice)
                    </h4>
                    <p className="mt-1 text-xs text-amber-200/90 leading-relaxed">
                      यह सूचना पूर्व परीक्षा सत्र या समाप्त हो चुकी समय-सीमा से संबंधित है। कृपया नवीनतम जानकारी हेतु ताज़ा अपडेट्स देखें या आधिकारिक पोर्टल पर सत्यापन करें।
                    </p>
                  </div>
                </div>
              )}

              {/* Title & Metadata */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-lg bg-indigo-600/20 border border-indigo-500/30 px-2.5 py-1 text-xs font-bold text-indigo-300">
                    {post.type}
                  </span>
                  {post.state && (
                    <span className="inline-flex items-center rounded-lg bg-white/5 border border-white/10 px-2.5 py-1 text-xs text-slate-300 font-medium">
                      {post.state}
                    </span>
                  )}
                  <span className="inline-flex items-center rounded-lg bg-slate-800 border border-white/10 px-2.5 py-1 text-xs text-slate-400">
                    {post.exam}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight">
                  {post.title}
                </h1>

                <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-500" />
                    <span>
                      अंतिम अपडेट:{" "}
                      {new Date(post.updatedAt).toLocaleDateString("hi-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </span>
                </div>
              </div>

              {/* Summary Box */}
              <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-slate-900/40 p-5 sm:p-6 shadow-xl">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">
                  संक्षिप्त विवरण (Summary)
                </h3>
                <p className="text-sm sm:text-base leading-relaxed text-slate-200">
                  {post.summary}
                </p>
              </div>

              {/* In-Article Policy-Compliant Ad Slot (Active only when approved) */}
              {post.showAds && (
                <AdSlot format="horizontal" minHeight={120} className="my-6" />
              )}

              {/* Important Dates Table */}
              {post.importantDates && post.importantDates.length > 0 && (
                <section className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 sm:p-6 shadow-xl">
                  <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
                    <Calendar className="h-5 w-5 text-amber-400" />
                    <h3 className="text-lg font-bold text-white">
                      महत्वपूर्ण तिथियां (Important Dates Schedule)
                    </h3>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-white/5">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <tbody className="divide-y divide-white/5">
                        {post.importantDates.map((d, idx) => (
                          <tr
                            key={idx}
                            className={idx % 2 === 0 ? "bg-white/[0.02]" : "bg-transparent"}
                          >
                            <th className="py-3 px-4 font-medium text-slate-300 w-1/2">
                              {d.label}
                            </th>
                            <td className="py-3 px-4 font-bold text-amber-300">
                              {d.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {/* Prominent Official Links Box */}
              {post.links && post.links.length > 0 && (
                <section className="rounded-2xl border-2 border-indigo-500/40 bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-900 p-6 shadow-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <LinkIcon className="h-5 w-5 text-indigo-400" />
                    <h3 className="text-lg font-bold text-white">
                      आधिकारिक लिंक एवं डाउनलोड (Official Direct Links)
                    </h3>
                  </div>
                  <p className="text-xs text-slate-300 mb-5">
                    विद्यार्थी नीचे दिए गए आधिकारिक बटनों के माध्यम से सीधे संबंधित पोर्टल पर जा सकते हैं:
                  </p>

                  <div className="flex flex-wrap gap-3">
                    {post.links.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs sm:text-sm font-semibold transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] ${getLinkButtonStyle(
                          link.kind
                        )}`}
                      >
                        {getLinkIcon(link.kind)}
                        <span>{link.label}</span>
                      </a>
                    ))}
                  </div>
                </section>
              )}

              {/* Main Body */}
              <article className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 sm:p-8 shadow-xl">
                <SafeBodyRenderer body={post.body} />
              </article>

              {/* Pre-FAQ Ad Slot (Active only when approved) */}
              {post.showAds && (
                <AdSlot format="horizontal" minHeight={120} className="my-6" />
              )}

              {/* FAQs Section */}
              {post.faqs && post.faqs.length > 0 && (
                <section className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 shadow-xl space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                    <HelpCircle className="h-5 w-5 text-indigo-400" />
                    <h3 className="text-xl font-bold text-white">
                      अक्सर पूछे जाने वाले सवाल (FAQs)
                    </h3>
                  </div>

                  <div className="space-y-4 pt-2">
                    {post.faqs.map((faq, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-white/5 bg-slate-950/70 p-4 sm:p-5"
                      >
                        <h4 className="font-bold text-sm sm:text-base text-white flex items-start gap-2">
                          <span className="text-indigo-400 font-mono">Q.</span>
                          <span>{faq.question}</span>
                        </h4>
                        <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed pl-5">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Sources List */}
              {post.sources && post.sources.length > 0 && (
                <section className="rounded-2xl border border-white/5 bg-slate-950/60 p-5 text-xs text-slate-400 space-y-2">
                  <h4 className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
                    संदर्भ एवं आधिकारिक स्रोत (Official Sources & References):
                  </h4>
                  <ul className="space-y-1 list-disc list-inside">
                    {post.sources.map((s, idx) => (
                      <li key={idx}>
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className="text-indigo-400 hover:underline hover:text-indigo-300"
                        >
                          {s.label} ({s.url})
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Mandatory Disclaimer */}
              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 sm:p-5 flex items-start gap-3 text-xs text-slate-400">
                <ShieldAlert className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>महत्वपूर्ण अस्वीकरण (Disclaimer):</strong> यह सरकारी वेबसाइट नहीं है। आधिकारिक जानकारी और लिंक के लिए ऊपर दिए गए आधिकारिक पोर्टल देखें।
                </p>
              </div>

              {/* End-of-page CTA Box */}
              <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-slate-900 to-indigo-950/40 p-6 sm:p-8 text-center space-y-4">
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  छात्रवृत्ति परीक्षा की पक्की तैयारी करें
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
                  परीक्षा से जुड़े हर नए नोटिस, पीडीएफ नोट्स और लाइव क्लास अपडेट के लिए हमारे आधिकारिक चैनलों से जुड़ें:
                </p>

                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <a
                    href="https://t.me/ShrvanKumarSagar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-sky-500 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow hover:bg-sky-400 transition"
                  >
                    <Send className="h-4 w-4" />
                    <span>फ्री टेलीग्राम चैनल जॉइन करें</span>
                  </a>

                  <Link
                    href="/vip-telegram"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-950 shadow hover:from-amber-400 hover:to-orange-400 transition"
                  >
                    <Bell className="h-4 w-4" />
                    <span>VIP टेलीग्राम अलर्ट्स</span>
                  </Link>

                  <Link
                    href="/store"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-white/10 transition"
                  >
                    <ShoppingBag className="h-4 w-4 text-amber-400" />
                    <span>बुक्स एवं स्टडी मटेरियल</span>
                  </Link>
                </div>
              </div>
            </main>

            {/* Sidebar Column */}
            <aside className="lg:col-span-4 space-y-6">
              {/* Exam Help Card */}
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-4">
                <h4 className="text-sm font-bold text-white border-b border-white/10 pb-3">
                  परीक्षा सहायता एवं अध्ययन सामग्री
                </h4>
                <ul className="space-y-3 text-xs">
                  <li>
                    <Link
                      href="/blog"
                      className="block p-3 rounded-xl bg-slate-950/70 border border-white/5 hover:border-indigo-500/30 transition text-slate-300 hover:text-white"
                    >
                      <span className="font-semibold text-indigo-400 block mb-1">
                        📄 पिछले वर्षों के प्रश्न पत्र (PYQ)
                      </span>
                      बिहार, यूपी और सभी राज्यों के NMMS ओरिजिनल पेपर्स फ्री में पढ़ें।
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/store"
                      className="block p-3 rounded-xl bg-slate-950/70 border border-white/5 hover:border-amber-500/30 transition text-slate-300 hover:text-white"
                    >
                      <span className="font-semibold text-amber-400 block mb-1">
                        📚 NMMS गाइड्स एवं बुक्स
                      </span>
                      राघव प्रकाशन की संपूर्ण तैयारी गाइड घर बैठे मंगाएं।
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/vip-telegram"
                      className="block p-3 rounded-xl bg-slate-950/70 border border-white/5 hover:border-emerald-500/30 transition text-slate-300 hover:text-white"
                    >
                      <span className="font-semibold text-emerald-400 block mb-1">
                        ⚡ VIP टेस्ट एवं आंसर-की अलर्ट
                      </span>
                      परीक्षा के तुरंत बाद आंसर की और स्कोर एनालिसिस प्राप्त करें।
                    </Link>
                  </li>
                </ul>
              </div>

              {/* All Updates Link Card */}
              <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-5 text-center">
                <p className="text-xs text-slate-400 mb-3">
                  अन्य राज्यों के परीक्षा शेड्यूल और रिजल्ट देखें:
                </p>
                <Link
                  href="/updates"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition"
                >
                  <span>सभी ताज़ा अपडेट्स देखें</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </aside>
          </div>
        </Container>
      </div>
    </>
  );
}
