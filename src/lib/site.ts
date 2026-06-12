import type { Metadata } from "next";

export const siteConfig = {

  // ── Core Identity ──────────────────────────────────────────────────────────
  name: "Sagar Coaching Centre",
  shortName: "Sagar Coaching",
  tagline: "माना कि अंधेरा घना है, पर दीया जलाना कहां मना है",
  taglineEnglish: "India's Trusted Online Scholarship Exam Coaching",
  description:
    "Sagar Coaching Centre Bhagwanpur — India's most trusted online coaching for NMMS, Navodaya, Sainik School, Shrestha NETS, CMMSS and all scholarship exams. Founded by Shrvan Kumar Sagar, Supaul, Bihar. Online classes for students of all states.",
  url: "https://sagarcoachingcentre.com",
  locale: "hi_IN",

  // ── Founder / Contact ──────────────────────────────────────────────────────
  founder: "Shrvan Kumar Sagar",
  founderTitle: "Founder & Head Teacher",
  founderBio:
    "श्रवण कुमार 'सागर' — जिला सुपौल, बिहार। NMMS, Navodaya, Sainik School जैसी Scholarship Exams की तैयारी कराने वाले India के सबसे भरोसेमंद शिक्षकों में से एक। Published Author, YouTuber (4 Channels), और हजारों बच्चों के सपनों के मार्गदर्शक। आपके अपने भाई — श्रवण सागर।",
  phone: "+919110113671",
  phoneDisplay: "+91 91101 13671",
  whatsapp: "https://wa.me/919110113671",
  email: "noreply@sagarcoachingcentre.com",
  supportEmail: "support@sagarcoachingcentre.com",
  address: "NH 106, Bhagwanpur, Supaul, Bihar — 854338",
  city: "Bhagwanpur, Supaul",
  state: "Bihar",
  pincode: "854338",
  country: "India",
  googleMapsUrl: "https://maps.google.com/?cid=10120212661193213675",

  // ── SEO Meta ───────────────────────────────────────────────────────────────
  metaTitle:
    "Sagar Coaching Centre | NMMS, Navodaya, Sainik School Online Coaching India",
  metaDescription:
    "India ke sabse trusted scholarship exam coaching centre. NMMS, Navodaya, Sainik School, Shrestha NETS, CMMSS ki behtareen online taiyari. Har rajya ke Class 5-8 students ke liye. By Shrvan Kumar Sagar, Supaul Bihar.",
  metaKeywords:
    "NMMS coaching online India, Navodaya coaching India, Sainik School coaching online, Shrestha NETS coaching, CMMSS exam, Megha Chhatravriti, scholarship exam coaching, NMMS UP, NMMS Bihar, NMMS Rajasthan, NMMS MP, JNVST coaching, Sagar Coaching Centre Bhagwanpur, Shrvan Kumar Sagar, scholarship exam class 8",
  ogImage: "/og-image.jpg",

  // ── Social Media ───────────────────────────────────────────────────────────
  socials: {
    youtube: "https://www.youtube.com/@sagarcoachingcentrebhagwanpur",
    youtubeChannels: [
      {
        name: "Sagar Coaching Centre Bhagwanpur",
        handle: "@sagarcoachingcentrebhagwanpur",
        url: "https://www.youtube.com/@sagarcoachingcentrebhagwanpur",
        focus: "NMMS Main Channel",
      },
      {
        name: "NMMS King Sagar Sir",
        handle: "@NmmsKingSagarSir",
        url: "https://www.youtube.com/@NmmsKingSagarSir",
        focus: "NMMS MAT & SAT Deep Preparation",
      },
      {
        name: "Yogita Online Classes",
        handle: "@YogitaOnlineClasses",
        url: "https://www.youtube.com/@YogitaOnlineClasses",
        focus: "CMMSS, Shrestha NETS, Atul Maheshvari",
      },
      {
        name: "Akanksha Junior Classes",
        handle: "@AkankshaJuniorClasses",
        url: "https://www.youtube.com/@AkankshaJuniorClasses",
        focus: "Navodaya, Sainik School, Simultala (Class 5–6)",
      },
    ],
    facebookPage:
      "https://www.facebook.com/SagarCoachingCentreBhagwanpur59",
    facebookPersonal: "https://www.facebook.com/ShrvanKumarSagar",
    instagram:
      "https://www.instagram.com/sagarcoachingcentrebhagwanpur/",
    telegram: "https://t.me/ShrvanKumarSagar",
    whatsapp: "https://wa.me/919110113671",
    app: "https://play.google.com/store/apps/details?id=com.lct.pbxwdta",
  },

  // ── Hero Section ───────────────────────────────────────────────────────────
  hero: {
    badgeText: "🏆 India's Trusted Scholarship Coaching",
    headline: "Scholarship का सपना होगा पूरा",
    headlineAccent: "हर राज्य से",
    subheadline:
      "NMMS, Navodaya, Sainik School, Shrestha NETS की Online तैयारी करें — UP, Bihar, MP, Rajasthan, Jharkhand और सभी राज्यों के Class 5–8 छात्रों के लिए।",
    ctaPrimary: "अभी Enroll करें",
    ctaSecondary: "Free Classes देखें",
    floatingBadge1: "NMMS में Selection! 🎉",
    floatingBadge2: "Navodaya Cleared ✅",
  },

  // ── Stats ──────────────────────────────────────────────────────────────────
  stats: [
    { value: "5000+", label: "Students Coached" },
    { value: "4",     label: "YouTube Channels" },
    { value: "500+",  label: "Govt School Selections" },
    { value: "7+",    label: "Years of Teaching" },
  ],

  // ── Trust Banner ───────────────────────────────────────────────────────────
  trustBanner: {
    label: "हम इन Exams की तैयारी कराते हैं — सभी राज्यों के लिए 🇮🇳",
    items: [
      "NMMS Exam",
      "Navodaya Vidyalaya",
      "Sainik School",
      "Shrestha NETS",
      "CMMSS Exam",
      "Simultala Awasiya",
      "Atul Maheshvari Scholarship",
      "Talent Search Test",
    ],
  },

  // ── Features / Why Us ──────────────────────────────────────────────────────
  features: [
    {
      icon: "🎯",
      title: "Expert Faculty",
      description:
        "Shrvan Kumar Sagar Sir — Published Author, 7+ साल का experience, हज़ारों बच्चों को Scholarship दिलाई।",
    },
    {
      icon: "📱",
      title: "Online — Har Jagah Se",
      description:
        "YouTube, App, Telegram पर Free Classes। Paid Courses में Live Classes, Notes, और Mock Tests। कहीं से भी पढ़ें।",
    },
    {
      icon: "📚",
      title: "Complete Study Material",
      description:
        "NMMS के लिए खुद की Published Book (Raghav Prakashan), Chapter-wise Notes, Previous Year Papers।",
    },
    {
      icon: "🏆",
      title: "Proven Results",
      description:
        "Bihar, UP, Jharkhand और अन्य राज्यों के सैकड़ों बच्चों ने Navodaya, NMMS, Sainik School in Selection पाया।",
    },
    {
      icon: "💰",
      title: "Scholarship ₹12,000/year",
      description:
        "NMMS में select होने पर Class 9–12 तक ₹12,000 प्रति वर्ष की Government Scholarship — बिल्कुल Free।",
    },
    {
      icon: "📲",
      title: "App Available",
      description:
        "Google Play Store पर 'Sagar Coaching Centre' App download करें — सभी courses एक जगह।",
    },
  ],

  // ── Skill Tags / Exam Tags (shown in hero or course sections) ──────────────
  skillTags: [
    "NMMS Exam",
    "Navodaya JNVST",
    "Sainik School AISSEE",
    "Shrestha NETS",
    "CMMSS",
    "Simultala Awasiya",
    "Talent Search Test",
    "Atul Maheshvari Scholarship",
    "MAT Preparation",
    "SAT Preparation",
    "Previous Year Papers",
    "Mock Tests",
  ],

  // ── States We Serve (new all-India section) ────────────────────────────────
  statesServed: {
    heading: "हम सभी राज्यों के छात्रों को पढ़ाते हैं",
    subheading:
      "YouTube, App, और Telegram के ज़रिए — कहीं से भी पढ़ें",
    states: [
      "Bihar", "Uttar Pradesh", "Jharkhand", "Madhya Pradesh",
      "Rajasthan", "Chhattisgarh", "Odisha", "West Bengal",
      "Uttarakhand", "Haryana", "Delhi", "Maharashtra",
      "Assam", "Gujarat", "और सभी राज्य 🇮🇳",
    ],
  },

  // ── Outcomes / Impact ──────────────────────────────────────────────────────
  outcomes: [
    { metric: "₹12,000/yr", label: "NMMS Scholarship Amount" },
    { metric: "Free",        label: "Navodaya Residential Education" },
    { metric: "5000+",       label: "Students Guided Pan-India" },
    { metric: "4.7 ⭐",      label: "Average Rating" },
  ],

  // ── Testimonials ───────────────────────────────────────────────────────────
  testimonials: [
    {
      name: "Ashish Kumar",
      role: "NMMS Qualified Student, Bihar",
      text:
        "Sagar Sir की coaching से मेरा NMMS में selection हुआ। बहुत अच्छा coaching centre है — online होने के बावजूद बहुत अच्छी preparation होती है।",
      rating: 5,
    },
    {
      name: "Sunil Kumar",
      role: "Parent, Supaul Bihar",
      text:
        "Good coaching. Sagar Sir बहुत अच्छे से पढ़ाते हैं। मेरे बच्चे का Navodaya में selection हुआ। पूरे Bihar में इनका नाम है।",
      rating: 5,
    },
    {
      name: "Umesh Kumar",
      role: "Student, Bhagwanpur",
      text:
        "यहाँ की classes बहुत helpful हैं। NMMS exam की पूरी preparation यहीं से की। App और YouTube दोनों पर content मिलता है।",
      rating: 5,
    },
  ],

  // ── Certificate Mockup Text ────────────────────────────────────────────────
  certificateMockup: {
    title: "Certificate of Excellence",
    subtitle: "Scholarship Exam Preparation",
    issuedBy: "Sagar Coaching Centre Bhagwanpur",
    founderSignature: "Shrvan Kumar Sagar",
  },

  // ── Email / Branding ───────────────────────────────────────────────────────
  emailSenderName: "Sagar Coaching Centre",
  emailSenderEmail: "noreply@sagarcoachingcentre.com",

  // ── App ────────────────────────────────────────────────────────────────────
  appName: "Sagar Coaching Centre",
  appPlayStoreUrl:
    "https://play.google.com/store/apps/details?id=com.lct.pbxwdta",

  // ── Footer ─────────────────────────────────────────────────────────────────
  footerTagline:
    "Bihar se shuru, India ke liye — हर बच्चे का Scholarship सपना पूरा करना हमारा मिशन है।",
  copyright: `© ${new Date().getFullYear()} Sagar Coaching Centre Bhagwanpur. All rights reserved. | Founder: Shrvan Kumar Sagar`,

  courses: {
    sectionSubheadline: "Sagar Coaching Centre Bhagwanpur ke behtareen courses mein enroll karein.",
  },
  products: {
    sectionSubheadline: "NMMS Books aur complete study materials ke liye hamara store explore karein.",
  },
  demo: {
    studentLabel: "Sonam Sagar (Student)",
    tutorDescription: "क्या आप किसी सवाल में अटक गए हैं? हमारा AI Tutor आपके प्रदर्शन का विश्लेषण करता है और आपको सही दिशा में मार्गदर्शन देता है।"
  },
  certificate: {
    learnerName: "Sonam Sagar",
    courseName: "NMMS Exam Complete Preparation 2025-26"
  },
  cta: {
    headline: "आज ही अपनी तैयारी शुरू करें",
    subtext: "बिहार के सबसे भरोसेमंद कोचिंग संस्थान के साथ जुड़कर छात्रवृत्ति परीक्षाओं में सफलता की ओर कदम बढ़ाएं।",
    primaryLabel: "Get Started Free",
    secondaryLabel: "Browse Courses"
  }
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