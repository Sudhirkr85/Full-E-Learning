import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { SEO_LOCATIONS } from "@/data/seo-locations";
import { SEO_TOPICS } from "@/data/seo-topics";
import { SEO_MODIFIERS } from "@/data/seo-modifiers";
import { makeMetadata, siteConfig } from "@/lib/site";
import { 
  GraduationCap, 
  BookOpen, 
  Award, 
  FileText, 
  Brain, 
  Binary, 
  ShieldCheck, 
  Compass, 
  Atom, 
  Globe,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  ChevronRight,
  BookOpenCheck,
  HelpCircle,
  ArrowRight,
  Landmark
} from "lucide-react";

// Page level configurations for Vercel Free Tier caching and ISR
export const dynamicParams = true;
export const revalidate = 604800; // Cache on Edge CDN for 7 days (0 Serverless cost)

interface LandingPageProps {
  params: Promise<{
    slug: string; // matches the city slug
    segments: string[]; // matches [topic] or [modifier, topic]
  }>;
}

// Maps icon name to Lucide Component safely
function TopicIcon({ name, className }: { name: string; className?: string }) {
  switch (name) {
    case "GraduationCap": return <GraduationCap className={className} />;
    case "BookOpen": return <BookOpen className={className} />;
    case "Award": return <Award className={className} />;
    case "FileText": return <FileText className={className} />;
    case "Brain": return <Brain className={className} />;
    case "Binary": return <Binary className={className} />;
    case "ShieldCheck": return <ShieldCheck className={className} />;
    case "Compass": return <Compass className={className} />;
    case "Atom": return <Atom className={className} />;
    case "Globe": return <Globe className={className} />;
    default: return <GraduationCap className={className} />;
  }
}

// Pre-render a tiny, highly targeted subset of top pages at build time to keep build under 20s
export async function generateStaticParams() {
  const topCities = ["delhi", "mumbai", "patna", "supaul", "lucknow", "jaipur", "bhopal", "ranchi", "indore", "pune"];
  const topTopics = ["nmms-scholarship", "jnvst-navodaya", "sainik-school", "simultala-entrance", "mental-ability-mat"];

  const params: Array<{ slug: string; segments: string[] }> = [];

  for (const city of topCities) {
    for (const topic of topTopics) {
      params.push({
        slug: city,
        segments: [topic]
      });
    }
  }

  return params;
}

// Resolve route parameters into typed SEO configuration objects
async function getSEOContext(slug: string, segments: string[]) {
  const citySlug = slug;
  let modifierSlug: string | undefined;
  let topicSlug: string;

  if (segments.length === 1) {
    topicSlug = segments[0]!;
  } else if (segments.length === 2) {
    modifierSlug = segments[0]!;
    topicSlug = segments[1]!;
  } else {
    return null;
  }

  const cityObj = SEO_LOCATIONS.find((l) => l.city === citySlug);
  const topicObj = SEO_TOPICS.find((t) => t.topic === topicSlug);
  const modifierObj = modifierSlug ? SEO_MODIFIERS.find((m) => m.modifier === modifierSlug) : undefined;

  if (!cityObj || !topicObj || (modifierSlug && !modifierObj)) {
    return null;
  }

  return {
    city: cityObj,
    topic: topicObj,
    modifier: modifierObj
  };
}

export async function generateMetadata({ params }: LandingPageProps): Promise<Metadata> {
  const { slug, segments } = await params;
  const context = await getSEOContext(slug, segments);

  if (!context) {
    return makeMetadata({
      title: "Course Programs & Admission Classes",
      description: "Search local scholarship courses and e-learning entrance exam preparation coaching.",
      path: `/courses/${slug}/${segments.join("/")}`
    });
  }

  const { city, topic, modifier } = context;

  // Optimizing metadata dynamically
  const prefix = modifier ? `${modifier.label} ` : "";
  const titleText = `${prefix}${topic.label} in ${city.label}`;
  const descText = `Looking for ${prefix.toLowerCase()}${topic.label} classes in ${city.label}, ${city.state}? Enroll at Sagar Coaching Centre for targeted study materials, custom mock tests, and top exam coaching.`;

  return makeMetadata({
    title: titleText,
    description: descText,
    path: `/courses/${city.city}/${modifier ? modifier.modifier + "/" : ""}${topic.topic}`
  });
}

export default async function ProgrammaticLandingPage({ params }: LandingPageProps) {
  const { slug, segments } = await params;
  const context = await getSEOContext(slug, segments);

  if (!context) {
    notFound();
  }

  const { city, topic, modifier } = context;

  // Retrieve actual courses from database to display as recommendations
  const dbCourses = await prisma.course.findMany({
    where: { status: "PUBLISHED" },
    include: {
      categories: { include: { category: true } }
    }
  });

  // Relevancy check: promote the course matching this landing page's topic
  const sortedCourses = [...dbCourses].sort((a, b) => {
    const isTopicMatchA = a.slug.includes(topic.topic) || a.title.toLowerCase().includes(topic.topic.split("-")[0]!);
    const isTopicMatchB = b.slug.includes(topic.topic) || b.title.toLowerCase().includes(topic.topic.split("-")[0]!);
    if (isTopicMatchA && !isTopicMatchB) return -1;
    if (isTopicMatchB && !isTopicMatchA) return 1;
    return 0;
  });

  const recommendedCourse = sortedCourses[0] ?? null;

  // Modifiers details
  const prefix = modifier ? `${modifier.label} ` : "";
  const displayTitle = `${prefix}${topic.label} in ${city.label}`;
  const displayBadge = modifier ? modifier.badge : "Verified Coaching Program";
  const displayCta = modifier ? modifier.ctaText : "Enroll in Course Batch";

  // Dynamic practice questions for engagement
  const practiceQuestions = [
    {
      q: `Which curriculum syllabus is followed for ${topic.label} classes in ${city.label}?`,
      options: ["CBSE / NCERT Standard Patterns", "State Board Only", "ICSE Exclusively", "Non-standard syllabus"],
      a: "CBSE / NCERT Standard Patterns",
      explanation: `All scholarship classes for ${topic.label} follow standard CBSE and NCERT guidelines, which covers all state-level exams.`
    },
    {
      q: `What is the most effective mock preparation strategy to crack the upcoming ${topic.label} exam?`,
      options: ["Regular chapter quizzes, timed full-length mock tests, and revising previous years papers", "Only reading books without practice tests", "Skipping complex syllabus chapters", "Studying on the last day of the exam"],
      a: "Regular chapter quizzes, timed full-length mock tests, and revising previous years papers",
      explanation: "Mock practice under timed conditions builds test stamina, which is essential to score high marks on the final exam."
    }
  ];

  // Dynamic SEO Structured Data Schemas
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": displayTitle,
    "description": topic.description,
    "provider": {
      "@type": "EducationalOrganization",
      "name": siteConfig.name,
      "sameAs": siteConfig.url
    },
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": modifier?.modifier === "online" ? "online" : "blended",
      "courseWorkload": `PT${topic.duration.replace(/\D/g, "")}M`,
      "location": {
        "@type": "Place",
        "name": `${city.label} Center`,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": city.label,
          "addressRegion": city.state,
          "addressCountry": "IN"
        }
      }
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
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
        "name": "Courses",
        "item": `${siteConfig.url}/courses`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": city.label,
        "item": `${siteConfig.url}/courses/${city.city}/${topic.topic}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": displayTitle,
        "item": `${siteConfig.url}/courses/${city.city}/${modifier ? modifier.modifier + "/" : ""}${topic.topic}`
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `Is Sagar Coaching Centre providing ${topic.label} classes in ${city.label}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Yes, Sagar Coaching Centre offers high-quality ${topic.label} coaching for students residing in ${city.label} (${city.state}). Classes include targeted tests and study guides.`
        }
      },
      {
        "@type": "Question",
        "name": `What is the fee structure and duration of the ${topic.label} program?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The ${topic.label} program has an average duration of ${topic.duration} with affordable class fees starting around INR ${topic.price} for online access batches.`
        }
      },
      {
        "@type": "Question",
        "name": `Where can I find study resources for ${topic.label} near me in ${city.label}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Students in ${city.label} can access complete chapter study notes, online mock test series, and reference books online through Sagar Coaching Centre's digital learning platform.`
        }
      }
    ]
  };

  // Generate internal cross-linking directories dynamically for search crawler optimization
  const otherTopics = SEO_TOPICS.filter((t) => t.topic !== topic.topic).slice(0, 6);
  const otherCities = SEO_LOCATIONS.filter((l) => l.city !== city.city).slice(0, 6);
  const otherModifiers = SEO_MODIFIERS.filter((m) => m.modifier !== modifier?.modifier).slice(0, 6);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden bg-grid-cyber">
      {/* Schema Injection */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Decorative Background Glows */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-indigo-500/5 rounded-full filter blur-[100px] pointer-events-none" />

      <Container className="py-12 relative z-10">
        
        {/* Breadcrumbs Navigation */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 mb-8 border-b border-white/5 pb-4">
          <Link href="/" className="hover:text-indigo-400 transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/courses" className="hover:text-indigo-400 transition-colors">Courses</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-300 font-medium capitalize">{city.label}</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-indigo-400 font-semibold truncate max-w-[220px]">{topic.label}</span>
        </nav>

        {/* Hero Section */}
        <div className="text-left mb-12 max-w-4xl">
          <div className="flex flex-wrap gap-2.5 mb-4">
            <Badge className="rounded-full px-3.5 py-1 text-xs bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-bold uppercase tracking-wide">
              {displayBadge}
            </Badge>
            <Badge className="rounded-full px-3.5 py-1 text-xs bg-purple-500/10 border border-purple-500/30 text-purple-300 font-bold uppercase tracking-wide">
              {city.region} India Region
            </Badge>
            <Badge variant="outline" className="rounded-full px-3.5 py-1 text-xs border-white/15 text-slate-300 font-medium capitalize">
              {topic.level} Level
            </Badge>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight mb-4 drop-shadow-[0_2px_10px_rgba(99,102,241,0.15)]">
            {displayTitle}
          </h1>

          <p className="text-lg text-slate-300 leading-relaxed font-medium">
            {topic.description} Designed specifically for students targeting competitive admissions and national scholarship examinations in <strong className="text-white font-semibold">{city.label} ({city.state})</strong>.
          </p>
        </div>

        {/* Main Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Core SEO details & interactive panels) */}
          <div className="lg:col-span-2 flex flex-col gap-10">
            
            {/* Quick Course Details Grid */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
              <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-2 text-indigo-300">
                <Landmark className="h-6 w-6 text-indigo-400" />
                Program overview for {city.label}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">DURATION</span>
                    <span className="text-sm font-bold text-white">{topic.duration}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">CLASSROOM LOCATION</span>
                    <span className="text-sm font-bold text-white">{city.label}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <Calendar className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">START BATCH</span>
                    <span className="text-sm font-bold text-white">Every Monday</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Syllabus Checklist */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2 text-indigo-300">
                <BookOpenCheck className="h-6 w-6 text-indigo-400" />
                Syllabus & Key Topics Included
              </h2>
              <p className="text-slate-300 mb-6 text-sm">
                Get full access to detailed classes, video tutorials, and interactive practice worksheets for the following syllabus modules:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Complete syllabus lecture guides",
                  "Chapter-wise mock test assessments",
                  "Formulas and calculation shortcuts",
                  "Logical & non-verbal reasoning test patterns",
                  "Previous years' solved question banks",
                  "Live doubt clearing sessions"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-white/[0.02] border border-white/5 p-3 rounded-lg">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold">✓</span>
                    <span className="text-sm font-medium text-slate-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive details-based Practice Quiz */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
              <h2 className="text-xl sm:text-2xl font-bold mb-2 flex items-center gap-2 text-indigo-300">
                <Brain className="h-6 w-6 text-indigo-400" />
                Assessment Practice Quiz (स्व-मूल्यांकन टेस्ट)
              </h2>
              <p className="text-slate-300 mb-6 text-sm">
                Crack practice test questions targeting <strong>{topic.label}</strong>. Tap on any question to view the correct answer and solution details instantly.
              </p>
              <div className="flex flex-col gap-4">
                {practiceQuestions.map((q, idx) => (
                  <details key={idx} className="group bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/[0.04] transition-colors">
                      <div className="flex gap-3">
                        <span className="text-indigo-400 font-bold">Q{idx + 1}.</span>
                        <span className="text-sm sm:text-base font-semibold text-slate-100 text-left">{q.q}</span>
                      </div>
                      <span className="ml-1.5 shrink-0 rounded-full bg-white/10 p-1 text-slate-400 group-open:rotate-180 transition-transform">
                        <ChevronRight className="h-4 w-4" />
                      </span>
                    </summary>
                    <div className="px-4 pb-4 pt-2 border-t border-white/5 bg-white/[0.01]">
                      <div className="grid grid-cols-1 gap-2.5 mb-4">
                        {q.options.map((opt, oIdx) => (
                          <div 
                            key={oIdx}
                            className={`p-2.5 rounded-lg text-xs sm:text-sm border ${
                              opt === q.a 
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-medium" 
                                : "bg-white/[0.02] border-white/5 text-slate-300"
                            }`}
                          >
                            <span className="font-bold mr-2">{String.fromCharCode(65 + oIdx)}.</span> {opt}
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-lg text-xs sm:text-sm">
                        <strong className="text-indigo-300 font-semibold block mb-1">Solved Explanation:</strong>
                        <span className="text-slate-300 leading-relaxed">{q.explanation}</span>
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            </div>

            {/* Accordion FAQ Area */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
              <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-2 text-indigo-300">
                <HelpCircle className="h-6 w-6 text-indigo-400" />
                Frequently Asked Questions (FAQ)
              </h2>
              <div className="flex flex-col gap-4">
                <div className="border-b border-white/5 pb-4">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                    Q. Is Sagar Coaching Centre offering {topic.label} classes in {city.label}?
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    A. Yes, Sagar Coaching Centre offers premium class materials and exam lectures for {topic.label} tailored for students residing in {city.label} and nearby sectors.
                  </p>
                </div>
                <div className="border-b border-white/5 pb-4">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                    Q. What is the fee structure for the {topic.label} course?
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    A. Admission charges are highly affordable, with interactive online mock test batches starting from just INR {topic.price} with lifetime access.
                  </p>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                    Q. How do I access study worksheets and solved model question papers?
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    A. Once enrolled, students can access previous papers, revision guides, and practice syllabus sheets through our web dashboard or Android mobile application.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (Dynamic Course CTA cards) */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            
            {recommendedCourse && (
              <div className="border border-white/10 rounded-2xl p-6 flex flex-col gap-5 bg-[#090d20]/50 backdrop-blur-md shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/20 rounded-full filter blur-xl pointer-events-none" />
                
                <div className="flex flex-col gap-2">
                  <Badge className="w-fit rounded-full px-2.5 py-0.5 text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                    RECOMMENDED PROGRAM
                  </Badge>
                  <h3 className="text-xl font-bold text-white tracking-tight leading-snug mt-1">
                    {recommendedCourse.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    Language: {recommendedCourse.language} · Level: {recommendedCourse.level.toLowerCase().replace("_", " ")}
                  </p>
                </div>

                <div className="text-left py-2 border-y border-white/5">
                  <span className="text-2xl font-black text-white">
                    INR {Math.round(recommendedCourse.priceCents / 100)}
                  </span>
                  <span className="text-xs text-slate-400 ml-2">One-time enrollment fee</span>
                </div>

                <div className="flex flex-col gap-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <TopicIcon name={topic.icon} className="h-4.5 w-4.5 text-indigo-400" />
                    <span>Complete {topic.label} lectures</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4.5 w-4.5 text-indigo-400" />
                    <span>Solved sample model papers</span>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold" asChild>
                  <Link href={`/courses/${recommendedCourse.slug}`}>
                    {displayCta} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}

            {/* Learning Center Trust Card */}
            <div className="border border-white/5 rounded-xl p-4 bg-white/[0.01] text-xs text-slate-400 flex flex-col gap-2">
              <p className="font-semibold text-slate-300">Sagar Coaching Centre</p>
              <p>✓ Supervised by founder & head teacher Shrvan Kumar Sagar</p>
              <p>✓ 10,000+ selections in JNVST, Sainik School, and NMMS scholarship tests</p>
              <p>✓ Top rankers and scholarship rewards inside {city.state} and nationwide</p>
            </div>

          </div>
        </div>

        {/* Footer Internal Cross-Linking Directory Grid */}
        <div className="mt-16 pt-8 border-t border-white/5">
          <h2 className="text-lg font-bold mb-6 text-slate-300 flex items-center gap-2">
            <Compass className="h-5 w-5 text-indigo-400" />
            Explore More Learning Programs
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left text-xs sm:text-sm">
            {/* 1. Other topics in this city */}
            <div>
              <h4 className="font-semibold text-slate-200 mb-3 uppercase tracking-wider text-[11px]">Other Courses in {city.label}</h4>
              <ul className="flex flex-col gap-2">
                {otherTopics.map((t) => (
                  <li key={t.topic}>
                    <Link 
                      href={`/courses/${city.city}/${modifier ? modifier.modifier + "/" : ""}${t.topic}`}
                      className="text-slate-400 hover:text-indigo-400 transition-colors"
                    >
                      {t.label} in {city.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 2. Same topic in nearby cities */}
            <div>
              <h4 className="font-semibold text-slate-200 mb-3 uppercase tracking-wider text-[11px]">Nearby Learning Areas</h4>
              <ul className="flex flex-col gap-2">
                {otherCities.map((c) => (
                  <li key={c.city}>
                    <Link 
                      href={`/courses/${c.city}/${modifier ? modifier.modifier + "/" : ""}${topic.topic}`}
                      className="text-slate-400 hover:text-indigo-400 transition-colors"
                    >
                      {topic.label} in {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Browse variations by modifier types */}
            <div>
              <h4 className="font-semibold text-slate-200 mb-3 uppercase tracking-wider text-[11px]">Browse by Intent Type</h4>
              <ul className="flex flex-col gap-2">
                {otherModifiers.map((m) => (
                  <li key={m.modifier}>
                    <Link 
                      href={`/courses/${city.city}/${m.modifier}/${topic.topic}`}
                      className="text-slate-400 hover:text-indigo-400 transition-colors"
                    >
                      {m.label} {topic.label} in {city.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </Container>
    </div>
  );
}
