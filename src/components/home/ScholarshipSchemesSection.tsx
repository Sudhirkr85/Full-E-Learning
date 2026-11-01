import React from "react";
import Link from "next/link";
import {
  Award,
  Sparkles,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SchemeCard {
  title: string;
  hindiTitle: string;
  ministry: string;
  amount: string;
  amountSub: string;
  eligibility: string;
  incomeLimit: string;
  slug: string;
  theme: {
    border: string;
    bgHover: string;
    badgeBg: string;
    badgeText: string;
    iconBg: string;
    iconText: string;
    amountText: string;
    accentBtn: string;
  };
  keyPoints: string[];
}

const SCHEME_CARDS: SchemeCard[] = [
  {
    title: "NMMSS Central Sector Scholarship",
    hindiTitle: "राष्ट्रीय आय-सह-मेधा छात्रवृत्ति (NMMS)",
    ministry: "शिक्षा मंत्रालय (MoE), भारत सरकार",
    amount: "₹12,000 / वर्ष",
    amountSub: "कक्षा 9वीं से 12वीं (कुल ₹48,000)",
    eligibility: "कक्षा 8वीं के सरकारी / एडेड / स्थानीय निकाय स्कूल छात्र",
    incomeLimit: "पारिवारिक आय ₹3,50,000 तक",
    slug: "what-is-nmms-eligibility-criteria",
    theme: {
      border: "border-indigo-200 hover:border-indigo-400",
      bgHover: "hover:shadow-indigo-500/10",
      badgeBg: "bg-indigo-50 border-indigo-200",
      badgeText: "text-indigo-700",
      iconBg: "bg-indigo-100 text-indigo-700",
      iconText: "text-indigo-600",
      amountText: "text-indigo-900",
      accentBtn: "text-indigo-600 group-hover:text-indigo-700",
    },
    keyPoints: [
      "कक्षा 7वीं में कम से कम 55% अंक (SC/ST 50%)",
      "प्रतिवर्ष 1,00,000 नई छात्रवृत्तियां स्वीकृत",
      "PFMS / DBT द्वारा सीधे बैंक खाते में भुगतान",
    ],
  },
  {
    title: "PM-YASASVI Top Class School Scholarship",
    hindiTitle: "प्रधानमंत्री यशस्वी योजना (Top Class Schools)",
    ministry: "सामाजिक न्याय और अधिकारिता मंत्रालय (MoSJE)",
    amount: "₹75,000 से ₹1,25,000 / वर्ष",
    amountSub: "9वीं-10वीं में ₹75,000 व 11वीं-12वीं में ₹1.25 लाख",
    eligibility: "Top Class Schools में पढ़ने वाले OBC, EBC और DNT छात्र",
    incomeLimit: "पारिवारिक आय ₹2,50,000 से कम",
    slug: "pm-yasasvi-top-class-school-scholarship-scheme-guidelines",
    theme: {
      border: "border-amber-200 hover:border-amber-400",
      bgHover: "hover:shadow-amber-500/10",
      badgeBg: "bg-amber-50 border-amber-200",
      badgeText: "text-amber-800",
      iconBg: "bg-amber-100 text-amber-800",
      iconText: "text-amber-600",
      amountText: "text-amber-950",
      accentBtn: "text-amber-700 group-hover:text-amber-800",
    },
    keyPoints: [
      "ट्यूशन फीस, हॉस्टल फीस व अन्य स्कूल शुल्क शामिल",
      "छात्राओं (Girls) के लिए न्यूनतम 30% सीटें आरक्षित",
      "आधिकारिक गाइडलाइन PDF (3061_G.pdf) के अनुसार",
    ],
  },
  {
    title: "NSP Verification & NPCI Bank Seeding",
    hindiTitle: "NSP पोर्टल सत्यापन एवं आधार-बैंक सीडिंग",
    ministry: "National Scholarship Portal & PFMS",
    amount: "Direct Benefit Transfer",
    amountSub: "सीधे लाभार्थी के बैंक खाते में 100% सुरक्षित भुगतान",
    eligibility: "सभी चयनित व छात्रवृत्ति आवेदन करने वाले विद्यार्थी",
    incomeLimit: "योजना के नियमानुसार लागू",
    slug: "bank-aadhaar-seeding-npci-mapping-for-nmms-scholarship",
    theme: {
      border: "border-emerald-200 hover:border-emerald-400",
      bgHover: "hover:shadow-emerald-500/10",
      badgeBg: "bg-emerald-50 border-emerald-200",
      badgeText: "text-emerald-800",
      iconBg: "bg-emerald-100 text-emerald-800",
      iconText: "text-emerald-600",
      amountText: "text-emerald-950",
      accentBtn: "text-emerald-700 group-hover:text-emerald-800",
    },
    keyPoints: [
      "छात्र के नाम का आधार-सीडेड सक्रिय बैंक खाता अनिवार्य",
      "स्कूल (INO), जिला (DNO) व राज्य (SNO) स्तर सत्यापन",
      "पेमेंट फेलियर से बचने के लिए NPCI मैपिंग गाइड",
    ],
  },
  {
    title: "NMMS Selection Exam Pattern & Syllabus",
    hindiTitle: "NMMS परीक्षा पैटर्न, उत्तीर्णांक व सिलेबस",
    ministry: "राज्य SCERT एवं परीक्षा नियामक प्राधिकारी",
    amount: "180 बहुविकल्पीय प्रश्न",
    amountSub: "90 प्रश्न MAT (रीजनिंग) + 90 प्रश्न SAT (शैक्षिक)",
    eligibility: "कक्षा 8वीं में नामांकित नियमित छात्र",
    incomeLimit: "कक्षा 7वीं-8वीं की पाठ्यपुस्तकों पर आधारित",
    slug: "nmms-exam-pattern-mat-sat",
    theme: {
      border: "border-sky-200 hover:border-sky-400",
      bgHover: "hover:shadow-sky-500/10",
      badgeBg: "bg-sky-50 border-sky-200",
      badgeText: "text-sky-800",
      iconBg: "bg-sky-100 text-sky-800",
      iconText: "text-sky-600",
      amountText: "text-sky-950",
      accentBtn: "text-sky-700 group-hover:text-sky-800",
    },
    keyPoints: [
      "MAT: सादृश्यता, श्रृंखला, कोडिंग-डिकोडिंग, वर्गीकरण",
      "SAT: विज्ञान, सामाजिक विज्ञान एवं गणित के प्रश्न",
      "केंद्रीय न्यूनतम उत्तीर्णांक: 40% (SC/ST 32%)",
    ],
  },
];

export function ScholarshipSchemesSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white via-slate-50/70 to-slate-100/50 border-b border-slate-200">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-left">
          <div className="space-y-3 max-w-3xl">
            <Badge className="bg-indigo-50 border-indigo-200 text-indigo-700 text-xs px-3.5 py-1 rounded-full uppercase tracking-wider font-bold inline-flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-indigo-600" />
              Government Scholarship Directory
            </Badge>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              प्रमुख सरकारी छात्रवृत्ति योजनाएं{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-amber-600">
                (Official Guidelines & Apply)
              </span>
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed">
              शिक्षा मंत्रालय एवं सामाजिक न्याय मंत्रालय की प्रमुख राष्ट्रीय छात्रवृत्तियां। 
              पात्रता मानदंड, छात्रवृत्ति राशि, आधिकारिक दिशानिर्देश और आवेदन प्रक्रिया की प्रामाणिक जानकारी।
            </p>
          </div>

          <Button
            asChild
            variant="outline"
            className="border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-xl px-5 py-2.5 shadow-sm text-xs sm:text-sm shrink-0 self-start md:self-auto"
          >
            <Link href="/updates" className="flex items-center gap-2">
              सभी योजनाएं व गाइड्स देखें
              <ArrowRight className="h-4 w-4 text-indigo-600" />
            </Link>
          </Button>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SCHEME_CARDS.map((card, idx) => {
            return (
              <div
                key={card.slug}
                className={`group flex flex-col justify-between rounded-2xl border-2 ${card.theme.border} bg-white p-6 shadow-sm hover:shadow-xl ${card.theme.bgHover} transition-all duration-300 relative overflow-hidden text-left`}
              >
                {/* Top Badge & Number */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${card.theme.badgeBg} ${card.theme.badgeText}`}
                    >
                      {card.ministry}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-300">
                      0{idx + 1}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-lg font-extrabold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">
                      {card.hindiTitle}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                      {card.title}
                    </p>
                  </div>

                  {/* Scholarship Amount Highlight Box */}
                  <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3.5 space-y-1">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      छात्रवृत्ति सहायता:
                    </div>
                    <div className={`text-base sm:text-lg font-black ${card.theme.amountText}`}>
                      {card.amount}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {card.amountSub}
                    </div>
                  </div>

                  {/* Key Points */}
                  <ul className="space-y-2 text-xs text-slate-600 pt-1">
                    {card.keyPoints.map((pt, i) => (
                      <li key={i} className="flex items-start gap-1.5 leading-snug">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer Link */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">
                    {card.incomeLimit}
                  </span>
                  <Link
                    href={`/updates/${card.slug}`}
                    className={`font-bold text-xs inline-flex items-center gap-1.5 ${card.theme.accentBtn} group-hover:translate-x-1 transition-all`}
                  >
                    <span>विस्तार से देखें</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
