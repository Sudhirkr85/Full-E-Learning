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
  Info,
  CheckCircle2,
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
        return "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-sm";
      case "apply":
        return "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold shadow-sm";
      case "official":
        return "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-sm";
      default:
        return "bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-xs";
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

      {/* ── Page Wrapper (Clean Light/White Theme) ── */}
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 py-8 sm:py-12">
        <Container>
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-slate-500"
          >
            <Link href="/" className="hover:text-indigo-600 font-medium transition">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <Link href="/updates" className="hover:text-indigo-600 font-medium transition">
              Updates
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-slate-800 font-semibold truncate max-w-[200px] sm:max-w-md">
              {post.title}
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content Column */}
            <main className="lg:col-span-8 space-y-6">
              {/* Expired Status Notice */}
              {post.status === "EXPIRED" && (
                <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 sm:p-5 flex items-start gap-3 text-amber-900 shadow-xs">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-amber-950">
                      यह अपडेट पुराना हो सकता है (Expired Notice)
                    </h4>
                    <p className="mt-1 text-xs text-amber-900/90 leading-relaxed">
                      यह सूचना पूर्व परीक्षा सत्र या समाप्त हो चुकी समय-सीमा से संबंधित है। कृपया नवीनतम जानकारी हेतु ताज़ा अपडेट्स देखें या आधिकारिक पोर्टल पर सत्यापन करें।
                    </p>
                  </div>
                </div>
              )}

              {/* Title & Metadata */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-lg bg-indigo-50 border border-indigo-200 px-2.5 py-1 text-xs font-bold text-indigo-700 shadow-xs">
                    {post.type}
                  </span>
                  {post.state && (
                    <span className="inline-flex items-center rounded-lg bg-white border border-slate-200 px-2.5 py-1 text-xs text-slate-700 font-medium shadow-xs">
                      {post.state}
                    </span>
                  )}
                  <span className="inline-flex items-center rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs text-slate-600 font-medium">
                    {post.exam}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 font-display leading-tight">
                  {post.title}
                </h1>

                <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
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
              <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 via-white to-sky-50/40 p-5 sm:p-6 shadow-xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-2">
                  संक्षिप्त विवरण (Summary)
                </h3>
                <p className="text-sm sm:text-base leading-relaxed text-slate-800 font-medium">
                  {post.summary}
                </p>
              </div>

              {/* In-Article Policy-Compliant Ad Slot (Active only when approved) */}
              {post.showAds && (
                <AdSlot format="horizontal" minHeight={120} className="my-6" />
              )}

              {/* Important Dates Table */}
              {post.importantDates && post.importantDates.length > 0 && (
                <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
                  <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-3">
                    <Calendar className="h-5 w-5 text-amber-600" />
                    <h3 className="text-lg font-bold text-slate-900 font-display">
                      महत्वपूर्ण तिथियां (Important Dates Schedule)
                    </h3>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <tbody className="divide-y divide-slate-100">
                        {post.importantDates.map((d, idx) => (
                          <tr
                            key={idx}
                            className={idx % 2 === 0 ? "bg-slate-50/60" : "bg-white"}
                          >
                            <th className="py-3 px-4 font-semibold text-slate-600 w-1/2">
                              {d.label}
                            </th>
                            <td className="py-3 px-4 font-bold text-amber-900">
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
                <section className="rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50/50 via-white to-sky-50/40 p-6 shadow-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <LinkIcon className="h-5 w-5 text-indigo-600" />
                    <h3 className="text-lg font-bold text-slate-900 font-display">
                      आधिकारिक लिंक एवं डाउनलोड (Official Direct Links)
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 mb-5">
                    विद्यार्थी नीचे दिए गए आधिकारिक बटनों के माध्यम से सीधे संबंधित पोर्टल पर जा सकते हैं:
                  </p>

                  <div className="flex flex-wrap gap-3">
                    {post.links.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs sm:text-sm font-bold transition-all shadow-xs hover:scale-[1.02] active:scale-[0.98] ${getLinkButtonStyle(
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
              <article className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
                <SafeBodyRenderer body={post.body} />
              </article>

              {/* Pre-FAQ Ad Slot (Active only when approved) */}
              {post.showAds && (
                <AdSlot format="horizontal" minHeight={120} className="my-6" />
              )}

              {/* FAQs Section */}
              {post.faqs && post.faqs.length > 0 && (
                <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                    <HelpCircle className="h-5 w-5 text-indigo-600" />
                    <h3 className="text-xl font-bold text-slate-900 font-display">
                      अक्सर पूछे जाने वाले सवाल (FAQs)
                    </h3>
                  </div>

                  <div className="space-y-3.5 pt-2">
                    {post.faqs.map((faq, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5 hover:border-indigo-200 transition"
                      >
                        <h4 className="font-bold text-sm sm:text-base text-slate-900 flex items-start gap-2">
                          <span className="text-indigo-600 font-mono font-bold">Q.</span>
                          <span>{faq.question}</span>
                        </h4>
                        <p className="mt-2 text-xs sm:text-sm text-slate-700 leading-relaxed pl-5 border-l-2 border-indigo-400">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Sources List */}
              {post.sources && post.sources.length > 0 && (
                <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs text-slate-600 space-y-2 shadow-xs">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    संदर्भ एवं आधिकारिक स्रोत (Official Sources & References):
                  </h4>
                  <ul className="space-y-1 list-disc list-inside">
                    {post.sources.map((s, idx) => (
                      <li key={idx}>
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className="text-indigo-600 hover:text-indigo-800 underline font-medium"
                        >
                          {s.label} ({s.url})
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Mandatory Disclaimer */}
              <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 sm:p-5 flex items-start gap-3 text-xs text-amber-900 shadow-xs">
                <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>महत्वपूर्ण अस्वीकरण (Disclaimer):</strong> यह सरकारी वेबसाइट नहीं है। आधिकारिक जानकारी और लिंक के लिए ऊपर दिए गए आधिकारिक पोर्टल देखें।
                </p>
              </div>

              {/* End-of-page CTA Box */}
              <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50/70 via-white to-indigo-50/40 p-6 sm:p-8 text-center space-y-4 shadow-xs">
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
                  छात्रवृत्ति परीक्षा की पक्की तैयारी करें
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
                  परीक्षा से जुड़े हर नए नोटिस, पीडीएफ नोट्स और लाइव क्लास अपडेट के लिए हमारे आधिकारिक चैनलों से जुड़ें:
                </p>

                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <a
                    href="https://t.me/ShrvanKumarSagar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs transition"
                  >
                    <Send className="h-4 w-4" />
                    <span>फ्री टेलीग्राम चैनल जॉइन करें</span>
                  </a>

                  <Link
                    href="/vip-telegram"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-950 shadow-xs transition"
                  >
                    <Bell className="h-4 w-4" />
                    <span>VIP टेलीग्राम अलर्ट्स</span>
                  </Link>

                  <Link
                    href="/store"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 shadow-xs transition"
                  >
                    <ShoppingBag className="h-4 w-4 text-amber-600" />
                    <span>बुक्स एवं स्टडी मटेरियल</span>
                  </Link>
                </div>
              </div>
            </main>

            {/* Sidebar Column */}
            <aside className="lg:col-span-4 space-y-6">
              {/* Exam Help Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs">
                <h4 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-3 font-display">
                  परीक्षा सहायता एवं अध्ययन सामग्री
                </h4>
                <ul className="space-y-3 text-xs">
                  <li>
                    <Link
                      href="/blog"
                      className="block p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-400 hover:bg-white transition text-slate-600 hover:text-slate-900 shadow-xs"
                    >
                      <span className="font-bold text-indigo-700 block mb-1">
                        📄 पिछले वर्षों के प्रश्न पत्र (PYQ)
                      </span>
                      बिहार, यूपी और सभी राज्यों के NMMS ओरिजिनल पेपर्स फ्री में पढ़ें।
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/store"
                      className="block p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-400 hover:bg-white transition text-slate-600 hover:text-slate-900 shadow-xs"
                    >
                      <span className="font-bold text-amber-800 block mb-1">
                        📚 NMMS गाइड्स एवं बुक्स
                      </span>
                      राघव प्रकाशन की संपूर्ण तैयारी गाइड घर बैठे मंगाएं।
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/vip-telegram"
                      className="block p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-400 hover:bg-white transition text-slate-600 hover:text-slate-900 shadow-xs"
                    >
                      <span className="font-bold text-emerald-700 block mb-1">
                        ⚡ VIP टेस्ट एवं आंसर-की अलर्ट
                      </span>
                      परीक्षा के तुरंत बाद आंसर की और स्कोर एनालिसिस प्राप्त करें।
                    </Link>
                  </li>
                </ul>
              </div>

              {/* All Updates Link Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-xs">
                <p className="text-xs text-slate-600 mb-3 font-medium">
                  अन्य राज्यों के परीक्षा शेड्यूल और रिजल्ट देखें:
                </p>
                <Link
                  href="/updates"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
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
