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
  ShieldCheck,
  Sparkles,
  Target,
  GraduationCap,
  AlertCircle,
  CheckSquare,
  MessageCircle,
} from "lucide-react";
import { PdfViewerClient } from "@/components/blog/pdf-viewer-client";
import { PyqDownloadButton } from "@/components/blog/pyq-download-button";
import { AdSlot } from "@/components/ads/AdSlot";
import { auth } from "@/auth";

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
      path: post.canonicalSlug ? `/blog/${post.canonicalSlug}` : `/blog/${post.slug}`,
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

  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";

  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const pageUrl = `${baseUrl}/blog/${post.slug}`;

  // Content type detection for differentiated, unique layouts
  const isModelSet =
    post.slug.includes("set-") ||
    post.title.includes("मॉडल") ||
    post.title.includes("Model") ||
    post.title.includes("अभ्यास");
  const isSubjectSpecific = post.slug.includes("-mat-") || post.slug.includes("-sat-");
  const isOfficialScert = !isModelSet && !isSubjectSpecific;

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

  const relatedPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 6);

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

      {/* ── Outer Page Wrapper (Clean Light/White Theme) ── */}
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-amber-100 selection:text-amber-900">
        
        {/* ── Breadcrumb Navigation ── */}
        <div className="border-b border-slate-200/80 bg-white py-3 text-xs text-slate-500 shadow-sm">
          <Container>
            <nav className="flex items-center space-x-2">
              <Link href="/" className="hover:text-indigo-600 transition font-medium">
                Home
              </Link>
              <ChevronRight className="h-3 w-3 text-slate-400" />
              <Link href="/blog" className="hover:text-indigo-600 transition font-medium">
                Study Archive & PYQs
              </Link>
              <ChevronRight className="h-3 w-3 text-slate-400" />
              <span className="truncate font-semibold text-slate-800">
                {isOfficialScert ? `SCERT ${post.year} Paper` : post.title}
              </span>
            </nav>
          </Container>
        </div>

        {/* ── Main Layout (Content + Sidebar) ── */}
        <Container className="py-8 md:py-14">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            
            {/* ── LEFT: Main Article Column ── */}
            <main className="lg:col-span-8">
              
              {/* ── Header Badges & Dynamic Category Indicator ── */}
              <div className="flex flex-wrap items-center gap-2">
                {isOfficialScert && (
                  <Badge className="border-amber-300 bg-amber-50 text-amber-900 font-bold px-3 py-1 flex items-center gap-1.5 shadow-xs">
                    <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
                    <span>SCERT Verified Archive</span>
                  </Badge>
                )}
                {isModelSet && (
                  <Badge className="border-emerald-300 bg-emerald-50 text-emerald-900 font-bold px-3 py-1 flex items-center gap-1.5 shadow-xs">
                    <Target className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Sagar Sir Model Mock Set</span>
                  </Badge>
                )}
                {isSubjectSpecific && (
                  <Badge className="border-indigo-300 bg-indigo-50 text-indigo-900 font-bold px-3 py-1 flex items-center gap-1.5 shadow-xs">
                    <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                    <span>Subject Specialist Paper</span>
                  </Badge>
                )}
                <Badge variant="outline" className="border-slate-200 bg-white text-slate-700 font-medium">
                  {post.year} सत्र
                </Badge>
                <Badge variant="outline" className="border-slate-200 bg-white text-slate-700 font-medium">
                  {post.state}
                </Badge>
                <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  {post.readTime}
                </span>
              </div>

              {/* H1 Heading */}
              <h1 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-4xl text-slate-900 font-display leading-tight">
                {post.title}
              </h1>

              <p className="mt-2 text-sm sm:text-base font-semibold text-indigo-900">
                {post.hindiTitle}
              </p>

              {/* Author & Share Bar */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-slate-200 bg-white/60 rounded-xl p-4 text-xs text-slate-600 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-indigo-800 font-bold text-white shadow-sm text-sm">
                    SS
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{post.author}</div>
                    <div className="text-[11px] text-slate-500">{post.authorRole} • Sagar Coaching Centre</div>
                  </div>
                </div>

                {/* Social Share Buttons */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-medium hidden sm:inline">शेयर करें:</span>
                  <a
                    href={whatsappShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 font-bold text-white transition shadow-sm text-xs"
                  >
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={telegramShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 px-3 py-1.5 font-bold text-white transition shadow-sm text-xs"
                  >
                    <Send className="h-3 w-3" />
                    <span>Telegram</span>
                  </a>
                </div>
              </div>

              {post.canonicalSlug && (
                <div className="my-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-xs sm:text-sm text-amber-900 shadow-xs">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold uppercase tracking-wider text-amber-800 mr-1.5">सूचना:</span>
                      <span>यह इस प्रश्न पत्र का अतिरिक्त/वैकल्पिक प्रारूप है। मुख्य प्रश्न पत्र, आंसर की और संपूर्ण विश्लेषण देखने के लिए मुख्य पेज पर जाएं।</span>
                    </div>
                  </div>
                  <Link
                    href={`/blog/${post.canonicalSlug}`}
                    className="shrink-0 rounded-lg bg-amber-600 px-3.5 py-2 font-bold text-white text-xs hover:bg-amber-700 transition text-center shadow-xs"
                  >
                    मुख्य पेज देखें →
                  </Link>
                </div>
              )}

              {/* ── TOP HERO DOWNLOAD CARD (Tailored dynamically by paper category) ── */}
              {isOfficialScert && (
                <div className="my-8 rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50/60 via-white to-sky-50/40 p-4 sm:p-6 md:p-7 shadow-sm overflow-hidden">
                  <div className="flex flex-col items-start justify-between gap-4 sm:gap-5 sm:flex-row sm:items-center min-w-0 w-full">
                    <div className="min-w-0 w-full flex-1">
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wider">
                        <ShieldCheck className="h-4 w-4 text-amber-600 shrink-0" />
                        <span className="truncate">SCERT Bihar / UP आधिकारिक संग्रह</span>
                      </div>
                      <h2 className="mt-1 text-base sm:text-xl md:text-2xl font-extrabold text-slate-900 font-display break-all sm:break-words [overflow-wrap:anywhere]">
                        {post.pdfFileName}
                      </h2>
                      <p className="mt-1.5 text-xs text-slate-600 flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span className="inline-flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          सत्यापित OMR उत्तर कुंजी सहित
                        </span>
                        <span>•</span>
                        <span>{post.pdfPages} पृष्ठ</span>
                        <span>•</span>
                        <span>{post.pdfSize}</span>
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
                      <PyqDownloadButton
                        slug={post.slug}
                        pdfTitle={post.pdfFileName}
                        isAdmin={isAdmin}
                      />
                      <a
                        href="#pdf-viewer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:text-indigo-600 hover:border-indigo-300 transition shadow-xs"
                      >
                        <BookOpen className="h-4 w-4 text-indigo-600" />
                        <span>ऑनलाइन पढ़ें</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {isModelSet && (
                <div className="my-8 rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50/60 via-white to-teal-50/40 p-4 sm:p-6 md:p-7 shadow-sm overflow-hidden">
                  <div className="flex flex-col items-start justify-between gap-4 sm:gap-5 sm:flex-row sm:items-center min-w-0 w-full">
                    <div className="min-w-0 w-full flex-1">
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                        <Target className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span className="truncate">Sagar Sir High-Yield Mock Practice Set</span>
                      </div>
                      <h2 className="mt-1 text-base sm:text-xl md:text-2xl font-extrabold text-slate-900 font-display break-all sm:break-words [overflow-wrap:anywhere]">
                        {post.pdfFileName}
                      </h2>
                      <p className="mt-1.5 text-xs text-slate-600 flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span className="inline-flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          180 मिनट मॉक अभ्यास फ्रेमवर्क
                        </span>
                        <span>•</span>
                        <span>{post.pdfPages} पृष्ठ</span>
                        <span>•</span>
                        <span>{post.pdfSize}</span>
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
                      <PyqDownloadButton
                        slug={post.slug}
                        pdfTitle={post.pdfFileName}
                        isAdmin={isAdmin}
                      />
                      <a
                        href="#pdf-viewer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:text-emerald-700 hover:border-emerald-300 transition shadow-xs"
                      >
                        <BookOpen className="h-4 w-4 text-emerald-600" />
                        <span>ऑनलाइन हल करें</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {isSubjectSpecific && (
                <div className="my-8 rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50/60 via-white to-blue-50/40 p-4 sm:p-6 md:p-7 shadow-sm overflow-hidden">
                  <div className="flex flex-col items-start justify-between gap-4 sm:gap-5 sm:flex-row sm:items-center min-w-0 w-full">
                    <div className="min-w-0 w-full flex-1">
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-800 uppercase tracking-wider">
                        <Sparkles className="h-4 w-4 text-indigo-600 shrink-0" />
                        <span className="truncate">Subject Specialist Revision Series</span>
                      </div>
                      <h2 className="mt-1 text-base sm:text-xl md:text-2xl font-extrabold text-slate-900 font-display break-all sm:break-words [overflow-wrap:anywhere]">
                        {post.pdfFileName}
                      </h2>
                      <p className="mt-1.5 text-xs text-slate-600 flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span>{post.pdfPages} पृष्ठ</span>
                        <span>•</span>
                        <span>{post.pdfSize}</span>
                        <span>•</span>
                        <span className="text-indigo-700 font-medium">विषयवार मजबूत पकड़</span>
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
                      <PyqDownloadButton
                        slug={post.slug}
                        pdfTitle={post.pdfFileName}
                        isAdmin={isAdmin}
                      />
                      <a
                        href="#pdf-viewer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:text-indigo-600 hover:border-indigo-300 transition shadow-xs"
                      >
                        <BookOpen className="h-4 w-4 text-indigo-600" />
                        <span>ऑनलाइन पढ़ें</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* ── LIVE INTERACTIVE PDF VIEWER ── */}
              <div id="pdf-viewer" className="scroll-mt-24">
                <PdfViewerClient
                  slug={post.slug}
                  pdfUrl={post.pdfUrl}
                  pdfFileName={post.pdfFileName}
                  downloadUrl={downloadApiUrl}
                  pdfPages={post.pdfPages}
                  pdfSize={post.pdfSize}
                  isAdmin={isAdmin}
                />
              </div>

              {/* ── UNIQUE FEATURE BOX 1: Differentiated content based on paper type ── */}
              {isOfficialScert && (
                <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50/50 p-6 shadow-xs">
                  <div className="flex items-center gap-2 font-bold text-amber-900 text-lg">
                    <GraduationCap className="h-5 w-5 text-amber-700" />
                    <span>SCERT आधिकारिक परीक्षा नियम व कट-ऑफ दिशानिर्देश</span>
                  </div>
                  <p className="mt-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
                    यह प्रश्न पत्र SCERT द्वारा आयोजित राज्य स्तरीय राष्ट्रीय आय सह मेधा छात्रवृत्ति परीक्षा का ओरिजिनल दस्तावेज़ है। इस परीक्षा में 90 अंक MAT (मानसिक योग्यता) एवं 90 अंक SAT (शैक्षिक योग्यता) के होते हैं।
                  </p>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="rounded-xl border border-amber-200/80 bg-white p-3 shadow-xs">
                      <div className="text-slate-500 font-semibold">नकारात्मक अंकन (Negative Marking)</div>
                      <div className="mt-1 font-bold text-emerald-700 text-sm">कोई अंक कटौती नहीं (0 अंक)</div>
                    </div>
                    <div className="rounded-xl border border-amber-200/80 bg-white p-3 shadow-xs">
                      <div className="text-slate-500 font-semibold">पासिंग कट-ऑफ न्यूनतम अंक</div>
                      <div className="mt-1 font-bold text-slate-900 text-sm">सामान्य/OBC: 40% (72/180)</div>
                      <div className="text-[11px] text-slate-500">SC/ST: 32% (58/180)</div>
                    </div>
                    <div className="rounded-xl border border-amber-200/80 bg-white p-3 shadow-xs">
                      <div className="text-slate-500 font-semibold">छात्रवृत्ति प्रोत्साहन राशि</div>
                      <div className="mt-1 font-bold text-indigo-700 text-sm">₹12,000 / वर्ष (कुल ₹48,000)</div>
                      <div className="text-[11px] text-slate-500">कक्षा 9 से 12 तक सीधे DBT बैंक खाते में</div>
                    </div>
                  </div>
                </div>
              )}

              {isModelSet && (
                <div className="mt-10 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 shadow-xs">
                  <div className="flex items-center gap-2 font-bold text-emerald-900 text-lg">
                    <Target className="h-5 w-5 text-emerald-700" />
                    <span>सागर सर की 180-मिनट मॉक टेस्ट स्ट्रेटेजी (Target: 145+ Marks)</span>
                  </div>
                  <p className="mt-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
                    इस मॉडल अभ्यास सेट को वास्तविक परीक्षा हॉल जैसी घड़ी लगाकर हल करें। 90 मिनट MAT और 90 मिनट SAT के लिए निर्धारित करें।
                  </p>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="rounded-xl border border-emerald-200/80 bg-white p-3 shadow-xs">
                      <div className="text-slate-500 font-semibold">राउंड 1 (0 से 50 मिनट)</div>
                      <div className="mt-1 font-bold text-slate-900 text-sm">आसान और सीधे प्रश्न</div>
                      <div className="text-[11px] text-slate-600">सीरीज, कोडिंग-डिकोडिंग और विज्ञान के 70+ प्रश्न पक्के करें।</div>
                    </div>
                    <div className="rounded-xl border border-emerald-200/80 bg-white p-3 shadow-xs">
                      <div className="text-slate-500 font-semibold">राउंड 2 (50 से 130 मिनट)</div>
                      <div className="mt-1 font-bold text-slate-900 text-sm">सामाजिक अध्ययन व गणित</div>
                      <div className="text-[11px] text-slate-600">इतिहास, भूगोल और कक्षा 8 गणितीय समीकरणों को हल करें।</div>
                    </div>
                    <div className="rounded-xl border border-emerald-200/80 bg-white p-3 shadow-xs">
                      <div className="text-slate-500 font-semibold">राउंड 3 (अंतिम 50 मिनट)</div>
                      <div className="mt-1 font-bold text-emerald-700 text-sm">पूर्ण OMR बबलिंग</div>
                      <div className="text-[11px] text-slate-600">कोई भी गोला खाली न छोड़ें, सभी 180 प्रश्नों को चिन्हित करें।</div>
                    </div>
                  </div>
                </div>
              )}

              {isSubjectSpecific && (
                <div className="mt-10 rounded-2xl border border-indigo-200 bg-indigo-50/50 p-6 shadow-xs">
                  <div className="flex items-center gap-2 font-bold text-indigo-900 text-lg">
                    <Sparkles className="h-5 w-5 text-indigo-700" />
                    <span>विषयवार स्कोर बूस्टर चेकलिस्ट</span>
                  </div>
                  <p className="mt-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
                    इस विशेष सेट में शामिल विषय के कोर कॉन्सेप्ट्स को NCERT कक्षा 7 और 8 की पाठ्यपुस्तकों के आधार पर तैयार किया गया है।
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                    <span className="rounded-lg bg-white border border-indigo-200 px-3 py-1.5 text-indigo-800">
                      ✓ सटीक फॉर्मूला रिवीजन
                    </span>
                    <span className="rounded-lg bg-white border border-indigo-200 px-3 py-1.5 text-indigo-800">
                      ✓ तार्किक योग्यता शॉर्टकट ट्रिक्स
                    </span>
                    <span className="rounded-lg bg-white border border-indigo-200 px-3 py-1.5 text-indigo-800">
                      ✓ विगत 5 वर्षों के रिपीटेड पैटर्न
                    </span>
                  </div>
                </div>
              )}

              {/* ── Quick Overview Table (Clean White Card) ── */}
              <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                <h3 className="text-xl font-bold text-slate-900 font-display flex items-center gap-2">
                  <CheckSquare className="h-5 w-5 text-indigo-600" />
                  <span>1. परीक्षा का संक्षिप्त विवरण (Quick Overview)</span>
                </h3>
                <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full min-w-[320px] text-left text-sm">
                    <tbody className="divide-y divide-slate-100">
                      {post.overview.map((item, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? "bg-slate-50/50" : "bg-white"}>
                          <th className="w-1/3 p-3.5 font-semibold text-slate-600 text-xs sm:text-sm">
                            {item.label}
                          </th>
                          <td className="p-3.5 font-bold text-slate-800 text-xs sm:text-sm">
                            {item.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* ── Exam Pattern Table (Clean White Card) ── */}
              <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                <h3 className="text-xl font-bold text-slate-900 font-display flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-600" />
                  <span>2. परीक्षा पैटर्न एवं अंक विभाजन (Exam Pattern)</span>
                </h3>
                <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full min-w-[540px] text-left text-sm">
                    <thead className={`border-b text-xs font-bold ${
                      isOfficialScert
                        ? "bg-amber-100/60 text-amber-950 border-amber-200"
                        : isModelSet
                        ? "bg-emerald-100/60 text-emerald-950 border-emerald-200"
                        : "bg-indigo-100/60 text-indigo-950 border-indigo-200"
                    }`}>
                      <tr>
                        <th className="p-3.5">प्रश्न पत्र</th>
                        <th className="p-3.5">विषय / टॉपिक्स</th>
                        <th className="p-3.5 text-center">प्रश्न</th>
                        <th className="p-3.5 text-center">अंक</th>
                        <th className="p-3.5">समय</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {post.pattern.map((p, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? "bg-slate-50/40" : "bg-white"}>
                          <td className="p-3.5 font-bold text-slate-900">{p.paper}</td>
                          <td className="p-3.5 text-slate-700 text-xs sm:text-sm">{p.subjects}</td>
                          <td className="p-3.5 text-center font-bold text-indigo-700">
                            <span className="rounded-md bg-indigo-50 border border-indigo-100 px-2 py-0.5">
                              {p.questions}
                            </span>
                          </td>
                          <td className="p-3.5 text-center font-bold text-amber-800">
                            <span className="rounded-md bg-amber-50 border border-amber-100 px-2 py-0.5">
                              {p.marks}
                            </span>
                          </td>
                          <td className="p-3.5 text-slate-600 text-xs sm:text-sm font-medium">{p.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* ── Structured Content Sections (Clean White Cards) ── */}
              <div className="mt-8 space-y-6">
                {post.contentSections.map((sec, idx) => (
                  <section key={idx} className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                      {sec.heading}
                    </h3>
                    {sec.subheading && (
                      <p className="mt-1 text-xs font-bold uppercase tracking-wider text-indigo-600">
                        {sec.subheading}
                      </p>
                    )}

                    <div className="mt-4 space-y-3.5 text-sm sm:text-base leading-relaxed text-slate-700">
                      {sec.paragraphs.map((p, pIdx) => (
                        <p key={pIdx}>{p}</p>
                      ))}
                    </div>

                    {sec.bulletPoints && sec.bulletPoints.length > 0 && (
                      <ul className="mt-5 space-y-2.5 text-sm sm:text-base text-slate-800">
                        {sec.bulletPoints.map((bp, bpIdx) => (
                          <li key={bpIdx} className="flex items-start gap-2.5">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                            <span className="font-medium">{bp}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                ))}
              </div>

              {/* Policy-Compliant In-Article Ad Slot (Active only when approved) */}
              <AdSlot format="horizontal" minHeight={120} className="my-8" />

              {/* ── BOTTOM DOWNLOAD CALLOUT BOX ── */}
              <div className={`my-10 rounded-2xl border p-6 text-center sm:p-8 shadow-sm ${
                isOfficialScert
                  ? "border-amber-300 bg-gradient-to-br from-amber-50/70 via-white to-orange-50/40"
                  : isModelSet
                  ? "border-emerald-300 bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/40"
                  : "border-indigo-300 bg-gradient-to-br from-indigo-50/70 via-white to-sky-50/40"
              }`}>
                <h3 className="text-2xl font-extrabold text-slate-900 font-display">
                  {post.year} का संपूर्ण प्रश्न पत्र PDF अभी डाउनलोड करें
                </h3>
                <p className="mt-2 text-sm text-slate-600 max-w-xl mx-auto">
                  यह डिजिटल कॉपी छात्रों की तैयारी के लिए उपलब्ध है। अपने दोस्तों, सहपाठियों और शिक्षकों के साथ भी साझा करें।
                </p>

                <div className="mt-6 flex flex-wrap justify-center gap-4">
                  <PyqDownloadButton
                    slug={post.slug}
                    pdfTitle={post.pdfFileName}
                    isAdmin={isAdmin}
                  />
                  <a
                    href={whatsappShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-600 hover:bg-emerald-700 px-5 py-3 text-sm font-bold text-white transition shadow-sm"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>WhatsApp ग्रुप में भेजें</span>
                  </a>
                </div>
              </div>

              {/* ── Frequently Asked Questions (FAQ) ── */}
              <section className="mt-12">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-indigo-600" />
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                    अक्सर पूछे जाने वाले प्रश्न (FAQs)
                  </h3>
                </div>

                <div className="mt-5 space-y-3.5">
                  {post.faqs.map((faq, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-indigo-200"
                    >
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                        {faq.question}
                      </h4>
                      <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600 border-l-2 border-indigo-500 pl-3.5">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── Related Question Papers ── */}
              <section className="mt-14 border-t border-slate-200 pt-8">
                <h3 className="text-xl font-bold text-slate-900 font-display">अन्य वर्षों के प्रश्न पत्र व मॉडल सेट भी हल करें</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {relatedPosts.map((rel) => (
                    <Link
                      key={rel.slug}
                      href={`/blog/${rel.slug}`}
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-indigo-400 hover:shadow-sm"
                    >
                      <div>
                        <div className="text-xs font-bold text-amber-700">
                          {rel.year} {rel.slug.includes("set-") ? "Model Set" : "Original Paper"}
                        </div>
                        <div className="mt-1 text-sm font-bold text-slate-900 line-clamp-1">
                          {rel.title}
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
                    </Link>
                  ))}
                </div>
              </section>
            </main>

            {/* ── RIGHT: Sticky Sidebar (Clean White Theme) ── */}
            <aside className="lg:col-span-4">
              <div className="sticky top-20 space-y-6">
                
                {/* 1. Quick Download Box */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-700">
                    <Download className="h-4 w-4" />
                    <span>Quick PDF Download</span>
                  </div>
                  <h4 className="mt-2 font-bold text-slate-900 text-base">{post.year} Solved Paper</h4>
                  <p className="mt-1 text-xs text-slate-500">
                    {post.pdfPages} पृष्ठ • {post.pdfSize} • Answer Key Included
                  </p>
                  <div className="mt-4 flex flex-col gap-2">
                    <PyqDownloadButton
                      slug={post.slug}
                      pdfTitle={post.pdfFileName}
                      isAdmin={isAdmin}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-3 text-xs font-bold text-slate-950 shadow-sm transition hover:from-amber-400 hover:to-orange-400"
                    />
                    <a
                      href="#pdf-viewer"
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                      <Eye className="h-4 w-4 text-slate-600" />
                      <span>ऑनलाइन पढ़ें (निःशुल्क)</span>
                    </a>
                  </div>
                </div>

                {/* 2. Raghav Prakashan Book Store Promo */}
                <div className="rounded-2xl border border-amber-200 bg-gradient-to-b from-amber-50/60 to-white p-5 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                    <ShoppingBag className="h-4 w-4 text-amber-600" />
                    <span>Recommended Book</span>
                  </div>
                  <h4 className="mt-2 text-base font-bold text-slate-900">
                    NMMS Complete Guide Book
                  </h4>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                    श्रवण कुमार सागर सर द्वारा लिखित राघव प्रकाशन की पुस्तक। 2021-2026 तक के हल प्रश्न पत्र और टॉपिक-वाइज थ्योरी।
                  </p>
                  <Link
                    href="/store"
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 py-2.5 text-xs font-bold text-slate-950 transition shadow-xs"
                  >
                    <span>Store में पुस्तक देखें</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                {/* 3. VIP Telegram Alert Banner */}
                <div className="rounded-2xl border border-sky-200 bg-gradient-to-b from-sky-50/60 to-white p-5 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-sky-800">
                    <Send className="h-4 w-4 text-sky-600" />
                    <span>VIP Telegram Channel</span>
                  </div>
                  <h4 className="mt-2 text-base font-bold text-slate-900">
                    NMMS 2026-27 Alerts
                  </h4>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                    SCERT के सभी आधिकारिक नोटिफिकेशन, एडमिट कार्ड, और कट-ऑफ लिस्ट की तुरंत सूचना के लिए जुड़ें।
                  </p>
                  <Link
                    href="/vip-telegram"
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-700 py-2.5 text-xs font-bold text-white transition shadow-xs"
                  >
                    <span>Join VIP Channel (₹49)</span>
                  </Link>
                </div>

                {/* 4. Official WhatsApp Channel Card */}
                <div className="rounded-2xl border border-emerald-200 bg-gradient-to-b from-emerald-50/70 to-white p-5 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                    <MessageCircle className="h-4 w-4 text-emerald-600" />
                    <span>Official WhatsApp Channel</span>
                  </div>
                  <h4 className="mt-2 text-base font-bold text-slate-900">
                    NMMS Daily Study Alerts
                  </h4>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                    नए मॉडल पेपर, PYQ और डेली क्विज के सीधे लिंक पाने के लिए हमारा आधिकारिक WhatsApp चैनल फॉलो करें।
                  </p>
                  <a
                    href="https://whatsapp.com/channel/0029Va5PJaVGE56lMwsSzs0g"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2.5 text-xs font-bold text-white transition shadow-xs"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>WhatsApp चैनल जॉइन करें</span>
                  </a>
                </div>

                {/* 5. Coaching Support Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs text-slate-600 shadow-xs">
                  <div className="font-bold text-slate-900 text-sm">सहायता व मार्गदर्शन:</div>
                  <div className="mt-1.5 text-slate-500">
                    Sagar Coaching Centre, Bhagwanpur (Supaul, Bihar)
                  </div>
                  <a
                    href="https://wa.me/919110113671"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex items-center gap-2 font-bold text-emerald-700 hover:underline"
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
