import type { Metadata } from "next";

export const siteConfig = {
  // ── Core Identity ──────────────────────────────────────────────
  name: "Sagar Coaching Centre",
  shortName: "Sagar Coaching",
  tagline: "माना कि अंधेरा घना है, पर दीया जलाना कहां मना है",
  taglineEnglish: "Bihar's #1 Scholarship Exam Coaching Centre",
  description:
    "Sagar Coaching Centre Bhagwanpur — Bihar's most trusted coaching centre for NMMS, Navodaya, Sainik School, Shrestha NETS, CMMSS and other scholarship exams. Founded by Shrvan Kumar Sagar, Supaul, Bihar.",
  url: "https://sagarcoachingcentre.com",
  locale: "hi_IN",

  // ── Founder / Contact ───────────────────────────────────────────
  founder: "Shrvan Kumar Sagar",
  founderBio:
    "श्रवण कुमार 'सागर' — जिला सुपौल, बिहार। NMMS, Navodaya, Sainik School जैसी Scholarship Exams की तैयारी कराने वाले Bihar के सबसे भरोसेमंद शिक्षक। Published author, YouTuber, और हजारों बच्चों के सपनों के मार्गदर्शक।",
  phone: "+919110113671",
  phoneDisplay: "+91 91101 13671",
  whatsapp: "https://wa.me/919110113671",
  email: "noreply@sagarcoachingcentre.com",
  address: "NH 106, Bhagwanpur, Supaul, Bihar — 854338",
  city: "Bhagwanpur, Supaul",
  state: "Bihar",
  pincode: "854338",
  googleMapsUrl:
    "https://maps.google.com/?cid=10120212661193213675",

  // ── SEO Meta ────────────────────────────────────────────────────
  metaTitle: "Sagar Coaching Centre Bhagwanpur | NMMS, Navodaya, Sainik School Coaching Bihar",
  metaDescription:
    "Bihar ke sabse trusted scholarship coaching centre mein aapka swagat hai. NMMS, Navodaya, Sainik School, Shrestha NETS, CMMSS exam ki behtareen taiyari. By Shrvan Kumar Sagar, Supaul Bihar.",
  metaKeywords:
    "NMMS coaching Bihar, Navodaya coaching Supaul, Sainik School coaching Bihar, Shrestha NETS, CMMSS exam, Megha Chhatravriti, scholarship exam Bihar, Sagar Coaching Centre Bhagwanpur, Shrvan Kumar Sagar",
  ogImage: "/og-image.jpg",

  // ── Social Media ────────────────────────────────────────────────
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
        focus: "CMMSS, Shrestha NETS, Atul Maheshvari Scholarship",
      },
      {
        name: "Akanksha Junior Classes",
        handle: "@AkankshaJuniorClasses",
        url: "https://www.youtube.com/@AkankshaJuniorClasses",
        focus: "Navodaya, Sainik School, Simultala (Class 5–6)",
      },
    ],
    facebookPage: "https://www.facebook.com/SagarCoachingCentreBhagwanpur59",
    facebookPersonal: "https://www.facebook.com/ShrvanKumarSagar",
    instagram: "https://www.instagram.com/sagarcoachingcentrebhagwanpur/",
    telegram: "https://t.me/ShrvanKumarSagar",
    whatsapp: "https://wa.me/919110113671",
    app: "https://play.google.com/store/apps/details?id=com.lct.pbxwdta",
  },

  // ── Hero Section ────────────────────────────────────────────────
  hero: {
    headline: "Scholarship का सपना अब होगा पूरा",
    subheadline:
      "Bihar के सबसे भरोसेमंद Coaching Centre में NMMS, Navodaya, Sainik School की तैयारी करें — ऑनलाइन और ऑफलाइन दोनों।",
    badgeText: "🏆 Bihar's #1 Scholarship Coaching",
    ctaPrimary: "अभी Enroll करें",
    ctaSecondary: "Free Classes देखें",
    floatingBadge1: "छात्रवृत्ति मिली! 🎉",
    floatingBadge2: "Navodaya में Selection ✅",
  },

  // ── Stats ───────────────────────────────────────────────────────
  stats: [
    { value: "5000+", label: "Students Coached" },
    { value: "4", label: "YouTube Channels" },
    { value: "500+", label: "Selections in Govt Schools" },
    { value: "7+", label: "Years of Teaching" },
  ],

  // ── Trust Banner / Exam Names ───────────────────────────────────
  trustBanner: {
    label: "हम इन Exams की तैयारी कराते हैं",
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

  // ── Features / Why Us ───────────────────────────────────────────
  features: [
    {
      icon: "🎯",
      title: "Expert Faculty",
      description:
        "Shrvan Kumar Sagar Sir — Published Author, 7+ साल का experience, हजारों बच्चों को Scholarship दिलाई।",
    },
    {
      icon: "📱",
      title: "Online + Offline",
      description:
        "YouTube, App, Telegram पर Free Classes। Paid Courses में Live Classes, Notes, और Mock Tests।",
    },
    {
      icon: "📚",
      title: "Complete Study Material",
      description:
        "NMMS के लिए खुद की Published Book (Raghav Prakashan), Notes, Previous Year Papers सब available।",
    },
    {
      icon: "🏆",
      title: "Proven Results",
      description:
        "Supaul और Bihar के सैकड़ों बच्चों ने Navodaya, NMMS, Sainik School में Selection पाया।",
    },
    {
      icon: "💰",
      title: "Scholarship ₹12,000/year",
      description:
        "NMMS में select होने पर Class 9–12 तक ₹12,000 प्रति वर्ष की Government Scholarship मिलती है।",
    },
    {
      icon: "📲",
      title: "Mobile App Available",
      description:
        "Google Play Store पर 'Sagar Coaching Centre' App download करें — NMMS की बेहतर तैयारी के लिए।",
    },
  ],

  // ── Outcomes / Impact Metrics ───────────────────────────────────
  outcomes: [
    { metric: "₹12,000/yr", label: "NMMS Scholarship Amount" },
    { metric: "Free", label: "Navodaya School Education" },
    { metric: "5000+", label: "Students Guided" },
    { metric: "4.7⭐", label: "Average Rating" },
  ],

  // ── Testimonials ────────────────────────────────────────────────
  testimonials: [
    {
      name: "Ashish Kumar",
      role: "NMMS Student, Bihar",
      text: "Sagar Sir की coaching से मेरा NMMS में selection हुआ। बहुत अच्छा coaching centre है।",
      rating: 5,
    },
    {
      name: "Sunil Kumar",
      role: "Parent, Supaul",
      text: "Good coaching. Sagar Sir बहुत अच्छे से पढ़ाते हैं और बच्चों का ध्यान रखते हैं।",
      rating: 5,
    },
    {
      name: "Umesh Kumar",
      role: "Student, Bhagwanpur",
      text: "यहाँ की classes बहुत helpful हैं। NMMS exam की पूरी preparation यहीं से की।",
      rating: 5,
    },
  ],

  // ── Email / Branding ────────────────────────────────────────────
  emailSenderName: "Sagar Coaching Centre",
  emailSenderEmail: "noreply@sagarcoachingcentre.com",
  supportEmail: "support@sagarcoachingcentre.com",

  // ── App / Platform ──────────────────────────────────────────────
  appName: "Sagar Coaching Centre",
  appPlayStoreUrl:
    "https://play.google.com/store/apps/details?id=com.lct.pbxwdta",
  copyright: `© ${new Date().getFullYear()} Sagar Coaching Centre Bhagwanpur. All rights reserved.`,

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