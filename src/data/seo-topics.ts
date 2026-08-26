export interface SeoTopic {
  topic: string; // URL slug
  label: string; // User-facing title
  keywords: string[];
  description: string;
  price: number; // in INR
  duration: string;
  level: string;
  icon: string; // Lucide icon name
}

export const SEO_TOPICS: SeoTopic[] = [
  {
    topic: "nmms-scholarship",
    label: "NMMS Scholarship Exam Preparation",
    keywords: ["NMMS Exam Coaching", "National Means Cum Merit Scholarship", "Class 8 Scholarship Test", "NMMS MAT SAT Preparation"],
    description: "Complete preparation course for the National Means Cum Merit Scholarship (NMMS) Exam. Master MAT reasoning and SAT subjects to secure a Family scholarship of ₹12,000 per year.",
    price: 499,
    duration: "6 Months",
    level: "Beginner",
    icon: "GraduationCap"
  },
  {
    topic: "jnvst-navodaya",
    label: "Navodaya Vidyalaya Class 6 Entrance",
    keywords: ["JNVST Class 6 Entrance", "Jawahar Navodaya Coaching", "Navodaya Mental Ability Test", "JNVST Class 6 Practice Papers"],
    description: "Comprehensive coaching for Jawahar Navodaya Vidyalaya Selection Test (JNVST) Class 6 Entrance. Achieve free CBSE residential education from Class 6 to 12.",
    price: 499,
    duration: "1 Year",
    level: "Beginner",
    icon: "BookOpen"
  },
  {
    topic: "sainik-school",
    label: "Sainik School Entrance Exam Prep",
    keywords: ["AISSEE Entrance Preparation", "Sainik School Class 6 Coaching", "Military School Entrance Exam", "AISSEE Solved Papers"],
    description: "Rigorous training for All India Sainik Schools Entrance Exam (AISSEE) and Rashtriya Military Schools. Prepare Mathematics, General Knowledge, English, and Intelligence tests.",
    price: 499,
    duration: "1 Year",
    level: "Beginner",
    icon: "Award"
  },
  {
    topic: "simultala-entrance",
    label: "Simultala Awasiya Entrance Coaching",
    keywords: ["Simultala Entrance Exam", "Simultala Class 6 Admission Test", "Simultala Model Papers", "Bihar Simultala Coaching"],
    description: "Specialized training program for Simultala Awasiya Vidyalaya Class 6 Bihar Board Entrance Examination. Complete coverage of preliminary and main exam pattern.",
    price: 499,
    duration: "6 Months",
    level: "Beginner",
    icon: "FileText"
  },
  {
    topic: "mental-ability-mat",
    label: "Mental Ability Test (MAT) Reasoning",
    keywords: ["MAT Reasoning Classes", "Non-Verbal Series Reasoning", "Logical Reasoning Tricks", "Scholarship MAT Solved Questions"],
    description: "Master logical and analytical reasoning patterns including series completion, analogy, classification, coding-decoding, and figure matrices for scholarship exams.",
    price: 299,
    duration: "3 Months",
    level: "All Levels",
    icon: "Brain"
  },
  {
    topic: "ncert-math-class-8",
    label: "NCERT Mathematics Class 8 Complete",
    keywords: ["Class 8 Mathematics NCERT", "Rational Numbers Practice", "Linear Equations Class 8", "Mensuration Algebra Class 8"],
    description: "Step-by-step chapter-wise solutions, theory explanations, and practice questions for Class 8 Mathematics based on the NCERT CBSE syllabus.",
    price: 399,
    duration: "6 Months",
    level: "All Levels",
    icon: "Binary"
  },
  {
    topic: "shrestha-nets",
    label: "Shrestha NETS CBSE Scholarship Prep",
    keywords: ["Shrestha NETS Exam Coaching", "SC Community CBSE Scholarship", "Shrestha Class 9 Admission", "NETS Exam Solved Papers"],
    description: "Targeted coaching for SC Category students to crack the Shrestha NETS Exam, securing full scholarship admissions in top private CBSE residential schools.",
    price: 499,
    duration: "6 Months",
    level: "Beginner",
    icon: "ShieldCheck"
  },
  {
    topic: "cmmss-scholarship",
    label: "CMMSS Scholarship Exam Coaching",
    keywords: ["CMMSS Class 8 Scholarship", "Chief Minister Merit Scholarship", "CMMSS MAT SAT Preparation", "CMMSS Model Papers"],
    description: "Expert preparation class for the Chief Minister Merit Scholarship Scheme (CMMSS) exam in Class 8. Achieve a scholarship of ₹12,000 per year.",
    price: 499,
    duration: "6 Months",
    level: "Beginner",
    icon: "Compass"
  },
  {
    topic: "general-science-sat",
    label: "General Science for Scholarship SAT",
    keywords: ["Scholarship SAT Science", "Force and Pressure Notes", "Cell Structure Science Class 8", "Metals and Non-metals MCQ"],
    description: "Detailed study notes and daily practice worksheets for SAT Science portion covering physics, chemistry, and biology based on NCERT guidelines.",
    price: 299,
    duration: "4 Months",
    level: "All Levels",
    icon: "Atom"
  },
  {
    topic: "social-science-sat",
    label: "Social Science for Scholarship SAT",
    keywords: ["Scholarship SAT Social Studies", "Indian Constitution Notes Class 8", "1857 Revolt Class 8 History", "Resources Geography Notes"],
    description: "Complete syllabus coverage of History, Civics, and Geography for the SAT portion of scholarship exams including NMMS and NTSE.",
    price: 299,
    duration: "4 Months",
    level: "All Levels",
    icon: "Globe"
  }
];
