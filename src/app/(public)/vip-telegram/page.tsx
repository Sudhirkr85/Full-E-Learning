import type { Metadata } from "next";
import { makeMetadata } from "@/lib/site";
import { VipTelegramSection } from "@/components/vip-telegram-section";
import { ShieldCheck, Sparkles, CheckCircle2, HelpCircle } from "lucide-react";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = makeMetadata({
  title: "NMMS 2026-27 VIP Telegram Alert Channel | Sagar Coaching Centre",
  description: "Join NMMS 2026-27 VIP Telegram Alert Channel by Sagar Coaching Centre Bhagwanpur. Get instant official notifications, admit cards, results, model papers for all 36 states for just ₹49.",
  path: "/vip-telegram",
});

export default function VipTelegramPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Main Banner Component */}
      <VipTelegramSection isStandalone={true} />

      {/* Additional Educational & Trust Details */}
      <div className="border-t border-white/10 bg-[#070514] py-16">
        <Container className="max-w-5xl space-y-12">
          
          {/* Why VIP Channel? */}
          <div className="space-y-6 text-center">
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
              यह VIP Telegram Channel विद्यार्थियों के लिए क्यों जरूरी है?
            </h3>
            <p className="text-sm text-slate-300 max-w-3xl mx-auto leading-relaxed">
              NMMS छात्रवृत्ति परीक्षा में हर साल हजारों छात्र केवल इसलिए फॉर्म नहीं भर पाते या परीक्षा छूट जाती है क्योंकि उन्हें अपने राज्य के SCERT नोटिफिकेशन, एडमिट कार्ड जारी होने या आंसर की की सही समय पर जानकारी नहीं मिल पाती।
            </p>
          </div>

          {/* 3 Pillars Grid */}
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold">
                1
              </div>
              <h4 className="text-base font-bold text-white">सभी 36 राज्यों की कवरेज</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                बिहार, उत्तर प्रदेश, राजस्थान, मध्य प्रदेश, हरियाणा सहित भारत के सभी राज्यों और केंद्रशासित प्रदेशों की पूरी कवरेज।
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
                2
              </div>
              <h4 className="text-base font-bold text-white">समय पर सूचना = ₹48,000 छात्रवृत्ति</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                लास्ट डेट अलर्ट्स और आवश्यक डॉक्युमेंट्स की लिस्ट ताकि आपकी छात्रवृत्ति का एक भी अवसर हाथ से न निकले।
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                3
              </div>
              <h4 className="text-base font-bold text-white">100% विश्वसनीय व ऑफिशियल</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                सागर कोचिंग सेंटर भगवानपुर के वेरिफाइड शिक्षक टीम द्वारा सीधे आधिकारिक SCERT पोर्टल से सत्यापित सूचनाएं।
              </p>
            </div>
          </div>

          {/* Quick FAQs */}
          <div className="space-y-6 pt-6 border-t border-white/10">
            <h3 className="text-xl font-bold text-white text-center">
              अक्सर पूछे जाने वाले सवाल (FAQs)
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <h5 className="text-sm font-bold text-white flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-purple-400" />
                  भुगतान के बाद चैनल कैसे ज्वाइन करेंगे?
                </h5>
                <p className="text-xs text-slate-300 leading-relaxed">
                  ₹49 का भुगतान पूरा होते ही स्क्रीन पर टेलीग्राम चैनल का डायरेक्ट इनवाइट लिंक खुल जाएगा और आप तुरंत चैनल से जुड़ जाएंगे।
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <h5 className="text-sm font-bold text-white flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-purple-400" />
                  क्या यह ₹49 का शुल्क मासिक (Monthly) है?
                </h5>
                <p className="text-xs text-slate-300 leading-relaxed">
                  नहीं! यह एकमुश्त (One-Time) केवल ₹49 का शुल्क है जो पूरी NMMS 2026-27 परीक्षा प्रक्रिया और रिजल्ट तक मान्य रहेगा।
                </p>
              </div>
            </div>
          </div>

        </Container>
      </div>
    </div>
  );
}
