import type { Metadata } from "next";

export const siteConfig = {
  // ── Core identity ──────────────────────────────────────────────────────────
  name: "E-Learning Platform",
  description: "A modern learning platform for students, teachers, and administrators.",
  url: "http://localhost:3000",

  // ── Hero section ───────────────────────────────────────────────────────────
  hero: {
    badge: "Modern Learning Platform",
    headline: "Master New Skills at Your Own Pace",
    subheadline:
      "Access expert-led courses, interactive lessons, and industry-recognized certificates — all in one place.",
    ctaPrimary: "Browse Courses",
    ctaSecondary: "Start Free",
  },

  // ── Hero stats bar (3 items) ────────────────────────────────────────────────
  stats: [
    { label: "Students Enrolled", value: "10,000+" },
    { label: "Completion Rate",   value: "94%" },
    { label: "Partner Organizations", value: "200+" },
  ],

  // ── Feature pill badges (replaces React/Node.js/etc.) ──────────────────────
  highlights: [
    "Expert Instructors",
    "Lifetime Access",
    "HD Video Lessons",
    "Offline Downloads",
    "Mobile Friendly",
  ],

  // ── Skills You'll Master list (replaces AI Agent / SaaS / System Design) ───
  skills: [
    {
      title: "Professional Certifications",
      description:
        "Industry-recognized credentials accepted by top employers worldwide.",
    },
    {
      title: "Hands-On Projects",
      description: "Build real projects and apply what you learn immediately.",
    },
    {
      title: "Structured Learning Paths",
      description:
        "Guided curricula designed for beginners through advanced learners.",
    },
  ],

  // ── Hero card stat chips (replaces Full Stack / AI Ready / Job Ready) ───────
  heroCard: {
    chips: ["Beginner Friendly", "Career Ready", "Expert Led"],
  },

  // ── Trust banner ────────────────────────────────────────────────────────────
  trustBanner: {
    label: "Our Learners Work at Leading Organizations",
    companies: ["Google", "Microsoft", "Amazon", "Deloitte", "Accenture"],
  },

  // ── Outcome metric cards (replaces ₹45 LPA, ₹12.4 LPA, etc.) ──────────────
  outcomes: [
    { value: "94%",     label: "Completion Rate",          sub: "Industry-leading engagement" },
    { value: "4.8★",    label: "Average Rating",           sub: "Across all courses" },
    { value: "3x",      label: "Career Growth",            sub: "Reported by our graduates" },
    { value: "30 Days", label: "Avg. Time to Certificate", sub: "At your own pace" },
  ],

  // ── Testimonials (replaces India-specific names/companies) ─────────────────
  testimonials: [
    {
      initials: "SM",
      name: "Sarah Mitchell",
      role: "Product Manager",
      company: "TechCorp",
      text: "The structured learning paths helped me transition into a new career within months. The certificate assessments validated my skills for employers.",
    },
    {
      initials: "JO",
      name: "James Okafor",
      role: "Software Developer",
      company: "BuildLabs",
      text: "Best investment I made. The instructors are world-class and the content is always up to date. The interactive assignments are exactly what I needed.",
    },
    {
      initials: "PN",
      name: "Priya Nair",
      role: "Data Analyst",
      company: "Insight Co",
      text: "Earned two certificates that directly helped me land my current role. Highly recommend the structured modules — crucial insights not found elsewhere.",
    },
  ],

  // ── AI tutor / demo chat mockup ─────────────────────────────────────────────
  demo: {
    personaName: "Alex Johnson",
    studentLabel: "Alex (Student)",
    consoleOutput: ">> Skills verified. Certificate ready.",
    tutorDescription:
      "Stuck on a concept or need guidance on your learning path? Our AI tutor analyzes your progress and delivers context-aware, step-by-step explanations.",
  },

  // ── Certificate mockup ──────────────────────────────────────────────────────
  certificate: {
    learnerName: "Alex Johnson",
    courseName: "Professional Development Masterclass",
  },

  // ── Final CTA section ───────────────────────────────────────────────────────
  cta: {
    headline: "Start Learning Today",
    subtext:
      "Join thousands of learners building real skills and advancing their careers.",
    primaryLabel: "Get Started Free",
    secondaryLabel: "Browse Courses",
  },

  // ── Courses section ─────────────────────────────────────────────────────────
  courses: {
    sectionSubheadline:
      "Explore our growing catalog of expert-led courses across a wide range of topics and skill levels.",
  },

  // ── Products section ────────────────────────────────────────────────────────
  products: {
    sectionSubheadline:
      "Explore our curated collection of learning resources, digital downloads, and exclusive bundles.",
  },
};

export const mainNav = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "Store", href: "/store" },
  { label: "Login", href: "/login" }
];

export const footerNav = [
  { label: "Courses", href: "/courses" },
  { label: "Store", href: "/store" },
  { label: "Register", href: "/register" }
];

export const studentNav = [
  { label: "Overview", href: "/student/dashboard" },
  { label: "My Profile", href: "/student/profile" },
  { label: "My Courses", href: "/student/courses" },
  { label: "My Orders", href: "/student/orders" }
];

export const teacherNav = [
  { label: "Overview", href: "/teacher/dashboard" },
  { label: "Courses", href: "/teacher/courses" },
  { label: "My Students", href: "/teacher/enrollments" },
  { label: "Categories", href: "/teacher/categories" }
];

export const adminNav = [
  { label: "My Profile", href: "/admin/profile" },
  { label: "Overview", href: "/admin/dashboard" },
  { label: "Users", href: "/admin/users" },
  { label: "Enrollments", href: "/admin/enrollments" },
  { label: "Courses", href: "/admin/courses" },
  { label: "Categories", href: "/admin/categories" },
  { label: "Store", href: "/admin/store" },
  { label: "Audit Logs", href: "/admin/audit-logs" },
  { label: "Change Password", href: "/admin/settings/change-password" },
  { label: "Platform Config", href: "/admin/settings/platform" }
];

type MetadataInput = {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
};

export function makeMetadata({ title, description, path, noIndex = false }: MetadataInput): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path
    },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}${path}`,
      siteName: siteConfig.name,
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true }
  };
}