import type { Metadata } from "next";
import { makeMetadata, siteConfig } from "@/lib/site";
import { VipTelegramSection } from "@/components/vip-telegram-section";
import { 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  Bell, 
  FileText, 
  Award, 
  MapPin, 
  Users, 
  Star,
  Zap,
  BookOpen
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  ...makeMetadata({
    title: "NMMS 2026-27 VIP Telegram Alert Channel | All States SCERT Notifications & Papers",
    description: "Join official NMMS 2026-27 VIP Telegram Alert Channel by Sagar Coaching Centre Bhagwanpur. Instant SCERT Notifications, Admit Cards, Results, Answer Keys & Model Papers for all states for ₹49.",
    path: "/vip-telegram",
  }),
  keywords: [
    "NMMS 2026-27",
    "NMMS Telegram Channel",
    "NMMS VIP Alert Group",
    "NMMS Notification 2026",
    "Bihar NMMS Telegram",
    "UP NMMS Telegram",
    "MP NMMS Telegram",
    "Rajasthan NMMS Telegram",
    "NMMS Admit Card 2026",
    "NMMS Result 2026",
    "NMMS Answer Key 2026",
    "Sagar Coaching Centre Bhagwanpur",
    "Shrvan Kumar Sagar",
    "NMMS Scholarship ₹48000",
    "SCERT NMMS Notice PDF",
    "National Means-cum-Merit Scholarship Scheme",
    "NMMS Model Papers PDF"
  ]
};

const COVERED_STATES = [
  "बिहार (Bihar)",
  "उत्तर प्रदेश (UP)",
  "मध्य प्रदेश (MP)",
  "राजस्थान (Rajasthan)",
  "झारखंड (Jharkhand)",
  "हरियाणा (Haryana)",
  "दिल्ली (Delhi)",
  "छत्तीसगढ़ (Chhattisgarh)",
  "महाराष्ट्र (Maharashtra)",
  "गुजरात (Gujarat)",
  "पश्चिम बंगाल (West Bengal)",
  "ओडिशा (Odisha)",
  "पंजाब (Punjab)",
  "उत्तराखंड (Uttarakhand)",
  "हिमाचल प्रदेश (HP)",
  "असम (Assam)",
  "अन्य सभी राज्य (All India)"
];

const FAQS = [
  {
    q: "NMMS 2026-27 VIP Telegram Alert Channel क्या है?",
    a: "यह सागर कोचिंग सेंटर भगवानपुर (श्रवण कुमार सागर) द्वारा संचालित एक प्रीमियम ऑफिशियल टेलीग्राम चैनल है, जहाँ भारत के सभी राज्यों के NMMS परीक्षा नोटिफिकेशन, आवेदन तिथि, एडमिट कार्ड, मॉडल प्रश्न पत्र, आंसर की और मेरिट लिस्ट सबसे पहले 1-क्लिक PDF के रूप में उपलब्ध कराई जाती है।"
  },
  {
    q: "भुगतान करने के बाद चैनल का लिंक कैसे मिलेगा?",
    a: "₹49 का सुरक्षित भुगतान (UPI/PhonePe/Paytm/Cards) पूरा होते ही स्क्रीन पर टेलीग्राम चैनल का ऑटोमैटिक इनवाइट लिंक ओपन हो जाएगा। इसके अलावा आपको स्क्रीन पर दिए गए डायरेक्ट 'Click to Join' बटन से भी तुरंत चैनल से जुड़ने की सुविधा मिलेगी।"
  },
  {
    q: "क्या यह ₹49 शुल्क केवल एक बार (One-Time) देना है?",
    a: "हाँ, यह केवल ₹49 का एकमुश्त (One-Time Lifetime Access) शुल्क है। पूरी NMMS 2026-27 परीक्षा प्रक्रिया, रिजल्ट और मेरिट लिस्ट जारी होने तक आपसे कोई अतिरिक्त शुल्क नहीं लिया जाएगा।"
  },
  {
    q: "क्या इसमें सभी राज्यों के ओरिजिनल नोटिफिकेशन और मॉडल पेपर्स मिलेंगे?",
    a: "हाँ! बिहार, उत्तर प्रदेश, मध्य प्रदेश, राजस्थान, झारखंड, हरियाणा, दिल्ली सहित भारत के सभी राज्यों के आधिकारिक SCERT व राज्य शिक्षा बोर्ड के ओरिजिनल ऑथेंटिक नोटिफिकेशन्स और 100% वेरिफाइड पीडीएफ पेपर्स मिलेंगे।"
  },
  {
    q: "यदि भुगतान में कोई समस्या आए तो सहायता कहाँ से मिलेगी?",
    a: "भुगतान या चैनल जॉइनिंग से संबंधित किसी भी सहायता के लिए आप हमारे आधिकारिक WhatsApp सपोर्ट नंबर +91 91101 13671 पर सीधे संपर्क कर सकते हैं।"
  }
];

export default function VipTelegramPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${siteConfig.url}/vip-telegram#product`,
        "name": "NMMS 2026-27 VIP Telegram Alert Channel",
        "description": "All States Official SCERT Notifications, Admit Cards, Results & Model Papers for NMMS Scholarship Examination 2026-27 by Sagar Coaching Centre Bhagwanpur.",
        "image": `${siteConfig.url}/logo-circle-transparent.png`,
        "brand": {
          "@type": "Brand",
          "name": "Sagar Coaching Centre Bhagwanpur"
        },
        "offers": {
          "@type": "Offer",
          "url": `${siteConfig.url}/vip-telegram`,
          "priceCurrency": "INR",
          "price": "49.00",
          "priceValidUntil": "2027-12-31",
          "availability": "https://schema.org/InStock",
          "seller": {
            "@type": "Organization",
            "name": "Sagar Coaching Centre Bhagwanpur"
          }
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "1850",
          "bestRating": "5",
          "worstRating": "1"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${siteConfig.url}/vip-telegram#breadcrumb`,
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
            "name": "NMMS VIP Telegram Channel",
            "item": `${siteConfig.url}/vip-telegram`
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": `${siteConfig.url}/vip-telegram#faq`,
        "mainEntity": FAQS.map((faq) => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a
          }
        }))
      },
      {
        "@type": "EducationalOrganization",
        "@id": `${siteConfig.url}/#organization`,
        "name": "Sagar Coaching Centre Bhagwanpur",
        "url": siteConfig.url,
        "logo": `${siteConfig.url}/logo-circle-transparent.png`,
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+91-9110113671",
          "contactType": "Customer Support",
          "areaServed": "IN",
          "availableLanguage": ["Hindi", "English"]
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* High-Impact SEO JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Main Interactive Banner & Razorpay Checkout Component */}
      <VipTelegramSection isStandalone={true} />

      {/* SECTION 1: ALL 36 STATES COVERAGE MATRIX */}
      <div className="border-t border-white/10 bg-[#09071c] py-16">
        <Container className="max-w-6xl space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <Badge className="bg-purple-900/60 border-purple-500/40 text-purple-300 px-3.5 py-1 text-xs rounded-full uppercase tracking-wider font-bold">
              All-India Coverage
            </Badge>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              भारत के सभी राज्यों के NMMS अलर्ट्स एक ही स्थान पर
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              आपको अलग-अलग वेबसाइट्स या यूट्यूब चैनलों पर भटकने की ज़रूरत नहीं है। सभी राज्यों की आधिकारिक विज्ञप्ति सीधे आपके मोबाइल पर।
            </p>
          </div>

          {/* States Cloud */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-5xl mx-auto">
            {COVERED_STATES.map((state) => (
              <span 
                key={state}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/[0.03] border border-white/10 hover:border-purple-500/40 hover:bg-purple-500/10 text-slate-200 transition-all cursor-default shadow-sm"
              >
                <MapPin className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                <span>{state}</span>
              </span>
            ))}
          </div>

        </Container>
      </div>

      {/* SECTION 2: WHAT STUDENTS GET INSIDE VIP CHANNEL */}
      <div className="border-t border-white/10 bg-slate-950 py-16">
        <Container className="max-w-6xl space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <Badge className="bg-indigo-900/60 border-indigo-500/40 text-indigo-300 px-3.5 py-1 text-xs rounded-full uppercase tracking-wider font-bold">
              VIP Membership Benefits
            </Badge>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              VIP Telegram चैनल में आपको क्या-क्या मिलेगा?
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 hover:border-purple-500/30 transition-all">
              <div className="h-10 w-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold">
                <Bell className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">तत्काल आधिकारिक विज्ञप्ति</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                SCERT और राज्य शिक्षा विभाग द्वारा जारी परीक्षा नोटिफिकेशन, आवेदन शुरू होने व अंतिम तिथि की तुरंत जानकारी।
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 hover:border-indigo-500/30 transition-all">
              <div className="h-10 w-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">1-Click ओरिजिनल PDF पेपर्स</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                विगत वर्षों के हल प्रश्न पत्र, मॉडल टेस्ट पेपर्स और सिलेबस की उच्च-गुणवत्ता वाली पीडीएफ फाइलें।
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 hover:border-emerald-500/30 transition-all">
              <div className="h-10 w-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">एडमिट कार्ड व रिजल्ट डायरेक्ट लिंक</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                एडमिट कार्ड जारी होते ही डाउनलोड करने का डायरेक्ट लिंक तथा रिजल्ट और स्टेट मेरिट लिस्ट की पीडीएफ।
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 hover:border-amber-500/30 transition-all">
              <div className="h-10 w-10 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">आंसर की (Answer Key) एवं ऑब्जेक्शन</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                परीक्षा के बाद सबसे तेज एवं सटीक ऑफिशियल आंसर की और गलत प्रश्नों पर आपत्ति (Challenge) दर्ज करने की गाइड।
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 hover:border-cyan-500/30 transition-all">
              <div className="h-10 w-10 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">NSP नेशनल स्कॉलरशिप पोर्टल गाइड</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                परीक्षा पास करने के बाद ₹48,000 की छात्रवृत्ति प्राप्त करने हेतु NSP पोर्टल पर रजिस्ट्रेशन की चरणबद्ध जानकारी।
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 hover:border-pink-500/30 transition-all">
              <div className="h-10 w-10 rounded-xl bg-pink-600/20 border border-pink-500/30 flex items-center justify-center text-pink-400 font-bold">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">100% स्पैम-मुक्त व विज्ञापन-मुक्त</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                कोई अनावश्यक मैसेज या फालतू विज्ञापन नहीं। केवल और केवल छात्रवृत्ति व परीक्षा से जुड़ी महत्वपूर्ण सामग्री।
              </p>
            </div>

          </div>

        </Container>
      </div>

      {/* SECTION 3: TRUST & STUDENT REVIEWS */}
      <div className="border-t border-white/10 bg-[#070514] py-16">
        <Container className="max-w-5xl space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge className="bg-amber-900/60 border-amber-500/40 text-amber-300 px-3.5 py-1 text-xs rounded-full uppercase tracking-wider font-bold">
              Student Trust
            </Badge>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              1,850+ विद्यार्थियों एवं अभिभावकों का भरोसा
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                "VIP चैनल से जुड़ने के बाद मुझे एडमिट कार्ड और आंसर की के लिए कहीं भटकना नहीं पड़ा। तुरंत नोटिफिकेशन आ गया!"
              </p>
              <p className="text-[11px] font-bold text-purple-300">— अमन कुमार (बिहार NMMS टॉपर)</p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                "मात्र ₹49 में पूरे साल के मॉडल पेपर्स और लास्ट डेट रिमाइंडर मिल रहे हैं। हर NMMS छात्र को यह चैनल जरूर लेना चाहिए।"
              </p>
              <p className="text-[11px] font-bold text-purple-300">— राजेश शर्मा (अभिभावक, UP)</p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                "श्रवण सर का गाइडेंस और NSP पोर्टल स्कॉलरशिप फॉर्म भरने के निर्देश बहुत मददगार रहे। मेरी स्कॉलरशिप अप्रूव हो गई।"
              </p>
              <p className="text-[11px] font-bold text-purple-300">— पूजा कुमारी (राजस्थान)</p>
            </div>
          </div>

        </Container>
      </div>

      {/* SECTION 4: FREQUENTLY ASKED QUESTIONS (FAQS) */}
      <div className="border-t border-white/10 bg-slate-950 py-16">
        <Container className="max-w-4xl space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold tracking-widest text-purple-400 uppercase">
              Frequently Asked Questions
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              अक्सर पूछे जाने वाले सवाल (FAQs)
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <div key={index} className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                <h4 className="text-sm sm:text-base font-bold text-white flex items-start gap-2.5">
                  <HelpCircle className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 pl-7 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

        </Container>
      </div>

    </div>
  );
}
