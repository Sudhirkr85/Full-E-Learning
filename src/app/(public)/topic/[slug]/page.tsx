import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { getTopicBySlug, getRelatedSlugs } from "@/lib/seo/generator";
import { makeMetadata } from "@/lib/site";
import { 
  BookOpen, 
  GraduationCap, 
  HelpCircle, 
  Award, 
  FileText, 
  ArrowRight, 
  Compass, 
  BookOpenCheck,
  ChevronRight
} from "lucide-react";

interface TopicPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const seoData = getTopicBySlug(slug);

  if (!seoData) {
    return makeMetadata({
      title: "Explore Study Topics",
      description: "Search and study for various competitive exams and school scholarship tests.",
      path: `/topic/${slug}`
    });
  }

  const { state, exam, topic, material } = seoData;

  const pageTitle = `${state.nameHi} ${exam.name} - ${topic.name} ${material.name} | Study Material`;
  const pageDesc = `Get high quality ${material.name} for ${topic.name} (${topic.nameHi}) for ${exam.nameHi} in ${state.name}. Access notes, mock tests, solved papers, and preparation tips at Sagar Coaching Centre.`;

  return makeMetadata({
    title: pageTitle,
    description: pageDesc,
    path: `/topic/${slug}`
  });
}

// Generate dynamic questions to keep the page interactive and boost dwell-time
function getQuestionsForTopic(topicName: string, topicNameHi: string, examName: string) {
  return [
    {
      q: `Which of the following is the most recommended way to master the topic "${topicName}" (${topicNameHi}) for the ${examName}?`,
      a: "Studying NCERT textbook chapters thoroughly, preparing short revision notes, and attempting topic-wise daily mock tests.",
      options: [
        "Memorizing definitions without understanding the basic concept.",
        "Studying NCERT textbook chapters thoroughly, preparing short revision notes, and attempting topic-wise daily mock tests.",
        "Skipping the entire chapter since it has low weightage.",
        "Relying only on reference guides on the exam day."
      ],
      explanation: `To score high marks in the ${examName}, conceptual clarity of "${topicName}" from basic NCERT textbooks (Class 6-8) is critical, followed by practicing mock test questions.`
    },
    {
      q: `What is the core fundamental principle behind "${topicName}"?`,
      a: "Understanding the underlying definitions, formulas, and logical steps, and applying them methodically to solve problems.",
      options: [
        "Assuming that all questions will follow the exact same pattern.",
        "Understanding the underlying definitions, formulas, and logical steps, and applying them methodically to solve problems.",
        "Applying random shortcuts without checking basic formulas.",
        "Skipping step-by-step verification during practice."
      ],
      explanation: `Mastery of "${topicName}" requires a solid foundation in the core definitions and formulas rather than rote memorization.`
    },
    {
      q: `How does preparing "${topicName}" benefit a student in the final ${examName} merit list?`,
      a: "It allows the student to answer direct and application-based questions quickly, saving time for complex sections.",
      options: [
        "It guarantees selection in the merit list without studying other chapters.",
        "It has no impact since questions from this topic are rarely asked.",
        "It allows the student to answer direct and application-based questions quickly, saving time for complex sections.",
        "It is only useful for oral interviews and not written papers."
      ],
      explanation: `Questions on "${topicName}" are highly scoring. Solving them quickly and accurately improves the overall score, increasing the chances of ranking in the scholarship merit list.`
    }
  ];
}

export default async function TopicSEOPage({ params }: TopicPageProps) {
  const { slug } = await params;
  const seoData = getTopicBySlug(slug);

  if (!seoData) {
    notFound();
  }

  const { state, exam, topic, material, index } = seoData;

  // Retrieve actual courses and products from the database to present as high-converting matches
  const dbCourses = await prisma.course.findMany({
    where: { status: "PUBLISHED" },
    include: {
      categories: { include: { category: true } }
    }
  });

  const dbProducts = await prisma.product.findMany({
    where: { status: "ACTIVE" }
  });

  // Relevancy sorting based on the exam slug
  const matchedCourses = [...dbCourses].sort((a, b) => {
    const aTitle = a.title.toLowerCase();
    const bTitle = b.title.toLowerCase();
    const isNMMS = exam.slug.includes("nmms") || exam.slug.includes("cmmss") || exam.slug.includes("scholarship");
    const isNavodaya = exam.slug.includes("jnvst") || exam.slug.includes("navodaya");
    const isSainik = exam.slug.includes("sainik") || exam.slug.includes("aissee") || exam.slug.includes("simultala");

    if (isNMMS) {
      if (aTitle.includes("nmms") && !bTitle.includes("nmms")) return -1;
      if (bTitle.includes("nmms") && !aTitle.includes("nmms")) return 1;
    }
    if (isNavodaya) {
      if (aTitle.includes("navodaya") && !bTitle.includes("navodaya")) return -1;
      if (bTitle.includes("navodaya") && !aTitle.includes("navodaya")) return 1;
    }
    if (isSainik) {
      if (aTitle.includes("sainik") && !bTitle.includes("sainik")) return -1;
      if (bTitle.includes("sainik") && !aTitle.includes("sainik")) return 1;
    }
    return 0;
  });

  const featuredCourse = matchedCourses[0] ?? null;

  // Check if a book product relates to NMMS or Bihar to recommend it
  const bookProduct = dbProducts.find(p => p.slug.includes("book") || p.slug.includes("bihar-nmmse")) || dbProducts[0] || null;

  const mockQuestions = getQuestionsForTopic(topic.name, topic.nameHi, exam.name);
  const relatedSlugs = getRelatedSlugs(index, 15);

  // FAQ Schema JSON-LD for Google Search Rich Snippets
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What is the best way to study "${topic.name}" for the ${exam.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `For the ${exam.nameHi} exam, it is highly recommended to study the "${topic.name}" (${topic.nameHi}) chapter from standard NCERT textbooks, practice past 5 years' question papers, and attempt mock tests online on Sagar Coaching Centre.`
        }
      },
      {
        "@type": "Question",
        "name": `Is "${topic.name}" an important topic for the ${state.name} ${exam.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Yes, "${topic.name}" is a high-scoring section in the ${exam.name} syllabus. Students from ${state.nameHi} can expect several direct questions from this chapter in the upcoming exam.`
        }
      },
      {
        "@type": "Question",
        "name": `Where can I download free PDFs and study material for ${topic.name} ${material.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `You can download free study materials, worksheets, solved mock tests, and preparation guides for ${topic.name} ${material.name} directly from Sagar Coaching Centre's website (sagarcoaching.tech).`
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden bg-grid-cyber">
      {/* FAQ Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Background glowing effects */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-indigo-500/5 rounded-full filter blur-[100px] pointer-events-none" />

      <Container className="py-12 relative z-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 mb-8 border-b border-white/5 pb-4">
          <Link href="/" className="hover:text-indigo-400 transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/courses" className="hover:text-indigo-400 transition-colors">Courses</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-300 font-medium capitalize">{state.name}</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-indigo-400 font-semibold truncate max-w-[200px] sm:max-w-none">{topic.name}</span>
        </nav>

        {/* Hero Header Section */}
        <div className="text-left mb-12 max-w-4xl">
          <div className="flex flex-wrap gap-2.5 mb-4">
            <Badge className="rounded-full px-3.5 py-1 text-xs bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-bold uppercase tracking-wide">
              {state.nameHi} - {state.name}
            </Badge>
            <Badge className="rounded-full px-3.5 py-1 text-xs bg-purple-500/10 border border-purple-500/30 text-purple-300 font-bold uppercase tracking-wide">
              {exam.nameHi}
            </Badge>
            <Badge variant="outline" className="rounded-full px-3.5 py-1 text-xs border-white/15 text-slate-300 font-medium capitalize">
              {topic.category}
            </Badge>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight mb-4 drop-shadow-[0_2px_10px_rgba(99,102,241,0.15)]">
            {topic.name} ({topic.nameHi}) - {material.name}
          </h1>

          <p className="text-lg text-slate-300 leading-relaxed font-medium">
            Complete study resources for <strong className="text-white font-semibold">{topic.name}</strong> of <strong className="text-white font-semibold">{exam.name}</strong>. Access chapter notes, curriculum guides, practice question sets, and solved mock test solutions designed specifically for students in <strong className="text-white font-semibold">{state.name}</strong>.
          </p>
        </div>

        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left / Core SEO Content Column */}
          <div className="lg:col-span-2 flex flex-col gap-10">
            
            {/* Syllabus/Curriculum section */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2 text-indigo-300">
                <BookOpenCheck className="h-6 w-6 text-indigo-400" />
                Syllabus & Course Checklist (पाठ्यक्रम विवरण)
              </h2>
              <p className="text-slate-300 mb-6 text-sm sm:text-base">
                To excel in the {exam.name} section of {topic.category}, you must master the following topics related to <strong>{topic.name}</strong>:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Basic definitions and fundamental concepts",
                  "Chapter exercises and textbook summaries",
                  "Important formulas and equations",
                  "Mental Ability Test (MAT) applications",
                  "Scholastic Aptitude Test (SAT) subject tests",
                  "Previous year exam question patterns"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-white/[0.02] border border-white/5 p-3 rounded-lg">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold">
                      ✓
                    </span>
                    <span className="text-sm font-medium text-slate-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive MCQ Quiz Section */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
              <h2 className="text-xl sm:text-2xl font-bold mb-2 flex items-center gap-2 text-indigo-300">
                <HelpCircle className="h-6 w-6 text-indigo-400" />
                Interactive Practice Quiz (मॉक टेस्ट अभ्यास)
              </h2>
              <p className="text-slate-300 mb-6 text-sm">
                Test your knowledge of <strong>{topic.name}</strong>. Read the questions below and click to reveal the correct answers and detailed explanations.
              </p>

              <div className="flex flex-col gap-4">
                {mockQuestions.map((qObj, qIdx) => (
                  <details 
                    key={qIdx} 
                    className="group bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/[0.04] transition-colors">
                      <div className="flex gap-3">
                        <span className="text-indigo-400 font-bold">Q{qIdx + 1}.</span>
                        <span className="text-sm sm:text-base font-semibold text-slate-100 text-left">{qObj.q}</span>
                      </div>
                      <span className="ml-1.5 flex-shrink-0 rounded-full bg-white/10 p-1 text-slate-400 group-open:rotate-180 transition-transform">
                        <ChevronRight className="h-4 w-4" />
                      </span>
                    </summary>
                    <div className="px-4 pb-4 pt-2 border-t border-white/5 bg-white/[0.01]">
                      {/* MCQ Options list */}
                      <div className="grid grid-cols-1 gap-2.5 mb-4">
                        {qObj.options.map((opt, oIdx) => (
                          <div 
                            key={oIdx} 
                            className={`p-2.5 rounded-lg text-xs sm:text-sm border ${
                              opt === qObj.a 
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-medium" 
                                : "bg-white/[0.02] border-white/5 text-slate-300"
                            }`}
                          >
                            <span className="font-bold mr-2">{String.fromCharCode(65 + oIdx)}.</span> {opt}
                          </div>
                        ))}
                      </div>
                      {/* Explanation */}
                      <div className="mt-3 bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-lg text-xs sm:text-sm">
                        <strong className="text-indigo-300 font-semibold block mb-1">Explanation & Solved Guide:</strong>
                        <span className="text-slate-300 leading-relaxed">{qObj.explanation}</span>
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            </div>

            {/* Preparation Strategies Section */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2 text-indigo-300">
                <GraduationCap className="h-6 w-6 text-indigo-400" />
                Preparation Tips for {exam.name}
              </h2>
              <div className="flex flex-col gap-4 text-sm sm:text-base text-slate-300">
                <p>
                  1. <strong>Master the NCERT Syllabus:</strong> Questions in {exam.name} (SAT section) are heavily derived from Class 7 and Class 8 NCERT topics. Ensure you complete all textbook questions for <em>{topic.name}</em>.
                </p>
                <p>
                  2. <strong>Time Management:</strong> Practice solving mock tests under a timed environment. This improves speed, which is key for scoring well in both MAT and SAT sections.
                </p>
                <p>
                  3. <strong>Solve Past Question Papers:</strong> Review at least 5 years of past exam papers for {state.name} to understand trends, mark distributions, and difficulty levels.
                </p>
                <p>
                  4. <strong>Expert Guidance:</strong> Watch free online video lectures by Shrvan Kumar Sagar Sir on YouTube to understand complex reasoning short-cuts and SAT science topics.
                </p>
              </div>
            </div>

            {/* FAQ Accordion Section */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
              <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-2 text-indigo-300">
                <HelpCircle className="h-6 w-6 text-indigo-400" />
                Frequently Asked Questions (अक्सर पूछे जाने वाले प्रश्न)
              </h2>
              <div className="flex flex-col gap-4">
                <div className="border-b border-white/5 pb-4">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                    Q. What is the best strategy to study "{topic.name}" for {exam.name}?
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    A. To score high marks, study the core textbook chapters, compile formula revision sheets, and practice online mock quizzes and multiple choice questions on Sagar Coaching Centre regularly.
                  </p>
                </div>
                <div className="border-b border-white/5 pb-4">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                    Q. Is "{topic.name}" a high-scoring section in the {state.name} exam?
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    A. Yes, questions based on "{topic.name}" ({topic.nameHi}) are asked in both the MAT reasoning and SAT scholastic aptitude portions. Scoring well here significantly helps secure a place in the scholarship merit list.
                  </p>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                    Q. Can I get free PDF resources for {topic.name} {material.name}?
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    A. Yes! Sagar Coaching Centre provides free study worksheets, previous papers solutions, and syllabus PDFs for students. Click on our recommended courses to enroll and access free notes today.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right / Recommended Courses & Products Column */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            
            {/* Recommended Course Card */}
            {featuredCourse && (
              <div className="border border-white/10 rounded-2xl p-6 flex flex-col gap-5 bg-[#090d20]/50 backdrop-blur-md shadow-2xl relative overflow-hidden">
                {/* Glowing border accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/20 rounded-full filter blur-xl pointer-events-none" />
                
                <div className="flex flex-col gap-2">
                  <Badge className="w-fit rounded-full px-2.5 py-0.5 text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                    RECOMMENDED COURSE
                  </Badge>
                  <h3 className="text-xl font-bold text-white tracking-tight leading-snug mt-1">
                    {featuredCourse.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    Language: {featuredCourse.language} · Level: {featuredCourse.level.toLowerCase().replace("_", " ")}
                  </p>
                </div>

                <div className="text-left py-2 border-y border-white/5">
                  <span className="text-2xl font-black text-white">
                    INR {Math.round(featuredCourse.priceCents / 100)}
                  </span>
                  <span className="text-xs text-slate-400 ml-2">One-time payment</span>
                </div>

                <div className="flex flex-col gap-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-indigo-400" />
                    <span>Complete MAT & SAT video lectures</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-indigo-400" />
                    <span>Free chapter mock tests & study notes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-indigo-400" />
                    <span>Previous Year Solved Papers</span>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold" asChild>
                  <Link href={`/courses/${featuredCourse.slug}`}>
                    Enroll in Course <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}

            {/* Recommended Book Product Card */}
            {bookProduct && (
              <div className="border border-white/10 rounded-2xl p-6 flex flex-col gap-5 bg-[#0e0a16]/40 backdrop-blur-md shadow-2xl relative overflow-hidden">
                <div className="flex flex-col gap-2">
                  <Badge className="w-fit rounded-full px-2.5 py-0.5 text-xs bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-bold">
                    RECOMMENDED BOOK
                  </Badge>
                  <h3 className="text-lg font-bold text-white tracking-tight leading-snug mt-1">
                    {bookProduct.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-3">
                    {bookProduct.description}
                  </p>
                </div>

                <div className="text-left py-2 border-y border-white/5">
                  <span className="text-xl font-bold text-white">
                    INR {Math.round(bookProduct.priceCents / 100)}
                  </span>
                  {bookProduct.originalPriceCents && (
                    <span className="text-xs text-slate-400 line-through ml-2">
                      INR {Math.round(bookProduct.originalPriceCents / 100)}
                    </span>
                  )}
                </div>

                <Button variant="outline" className="w-full border-white/15 hover:bg-white/5 text-slate-200" asChild>
                  <Link href="/store">
                    Buy Study Material <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}

            {/* Trust badge */}
            <div className="border border-white/5 rounded-xl p-4 bg-white/[0.01] text-xs text-slate-400 flex flex-col gap-2">
              <p className="font-semibold text-slate-300">Why Study with Sagar Coaching?</p>
              <p>✓ Founded by expert educator Shrvan Kumar Sagar Sir (Supaul, Bihar)</p>
              <p>✓ Leading online preparation portal for Indian school scholarship exams</p>
              <p>✓ Over 10,000+ successful selections in JNVST & NMMS exams across India</p>
            </div>

          </div>
        </div>

        {/* Dynamic Tag Cloud Section at the bottom for search crawler crawling */}
        <div className="mt-16 pt-8 border-t border-white/5">
          <h2 className="text-lg font-bold mb-4 text-slate-300 flex items-center gap-2">
            <Compass className="h-5 w-5 text-indigo-400" />
            Explore Other Study Topics & Exams
          </h2>
          <div className="flex flex-wrap gap-2">
            {relatedSlugs.map((rSlug, rIdx) => (
              <Link 
                key={rIdx} 
                href={`/topic/${rSlug}`}
                className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-indigo-500/20 hover:border-indigo-500/30 transition-all capitalize"
              >
                {rSlug.replaceAll("-", " ")}
              </Link>
            ))}
          </div>
        </div>

      </Container>
    </div>
  );
}
