import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { makeMetadata } from "@/lib/site";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  MessageCircle, 
  HelpCircle, 
  Sparkles,
  ExternalLink,
  ShieldCheck
} from "lucide-react";

export const metadata: Metadata = makeMetadata({
  title: "Contact Us | Sagar Coaching Centre Bhagwanpur",
  description: "Official contact page for Sagar Coaching Centre, Bhagwanpur, Supaul, Bihar. Direct WhatsApp support, phone assistance, email inquiries, and office timings.",
  path: "/contact"
});

export const revalidate = 86400; // Cache for 24 hours

export default function ContactUsPage() {
  return (
    <div className="min-h-screen bg-[#030611] text-slate-100 py-16 px-4 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-600/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-[10%] left-[-5%] w-[450px] h-[450px] bg-emerald-600/10 blur-[140px] pointer-events-none rounded-full" />

      <Container className="max-w-5xl mx-auto relative z-10 space-y-12">
        
        {/* Header Hero */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge className="bg-emerald-500/15 border-emerald-500/30 text-emerald-300 px-4 py-1.5 text-xs rounded-full uppercase tracking-wider font-bold">
            <Sparkles className="h-3.5 w-3.5 mr-1.5 text-emerald-400" />
            Support & Help Desk
          </Badge>
          <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-white">
            हमसे संपर्क करें (Contact Us)
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            प्रवेश, ऑनलाइन कोर्सेज, पुस्तक डिलीवरी या छात्रवृत्ति परीक्षा से संबंधित किसी भी मार्गदर्शन के लिए सीधे हमारे केंद्र से जुड़ें।
          </p>
        </div>

        {/* WhatsApp Channel Banner */}
        <div className="rounded-3xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/60 via-emerald-900/30 to-slate-900/80 p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Official WhatsApp Channel</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">Sagar Coaching Centre WhatsApp Channel</h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                छात्रवृत्ति परीक्षाओं (NMMS, Navodaya, Sainik School) के तुरंत एडमिट कार्ड, रिजल्ट और स्टडी अपडेट सीधे पाने के लिए आधिकारिक चैनल फॉलो करें।
              </p>
            </div>
          </div>
          <Button asChild className="shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl py-5 px-6 shadow-lg">
            <a href="https://whatsapp.com/channel/0029Va5PJaVGE56lMwsSzs0g" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              <span>चैनल फॉलो करें</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>

        {/* 3 Core Contact Cards */}
        <div className="grid gap-6 sm:grid-cols-3">
          
          {/* Card 1: WhatsApp */}
          <div className="rounded-3xl border border-emerald-500/30 bg-[#08151a]/80 p-6 sm:p-8 space-y-5 text-center flex flex-col justify-between hover:border-emerald-500/50 transition">
            <div className="space-y-3">
              <div className="h-14 w-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
                <MessageCircle className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-white">WhatsApp चैट</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                सबसे तेज जवाब पाने के लिए सीधे हमारे आधिकारिक WhatsApp पर संदेश भेजें।
              </p>
              <p className="text-sm font-mono font-bold text-emerald-300">+91 91101 13671</p>
            </div>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl py-6 shadow-lg">
              <a href="https://wa.me/919110113671" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                <span>WhatsApp पर जुड़ें</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>

          {/* Card 2: Phone Call */}
          <div className="rounded-3xl border border-indigo-500/30 bg-[#0c0e25]/80 p-6 sm:p-8 space-y-5 text-center flex flex-col justify-between hover:border-indigo-500/50 transition">
            <div className="space-y-3">
              <div className="h-14 w-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 mx-auto">
                <Phone className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-white">कॉल सहायता</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                कोचिंग समय में फोन पर सीधे हमारे काउंसलर या श्रवण सर से बात करें।
              </p>
              <p className="text-sm font-mono font-bold text-indigo-300">+91 91101 13671</p>
            </div>
            <Button asChild className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl py-6 shadow-lg">
              <a href="tel:+919110113671" className="flex items-center justify-center gap-2">
                <span>अभी कॉल करें</span>
                <Phone className="h-4 w-4" />
              </a>
            </Button>
          </div>

          {/* Card 3: Email */}
          <div className="rounded-3xl border border-cyan-500/30 bg-[#071322]/80 p-6 sm:p-8 space-y-5 text-center flex flex-col justify-between hover:border-cyan-500/50 transition">
            <div className="space-y-3">
              <div className="h-14 w-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mx-auto">
                <Mail className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-white">ईमेल संपर्क</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                आधिकारिक पूछताछ, सहयोग या ऑर्डर से जुड़े प्रश्नों के लिए ईमेल करें।
              </p>
              <p className="text-xs font-mono font-bold text-cyan-300 break-all">codingwithsudhir@gmail.com</p>
            </div>
            <Button asChild className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl py-6 shadow-lg">
              <a href="mailto:codingwithsudhir@gmail.com" className="flex items-center justify-center gap-2">
                <span>ईमेल भेजें</span>
                <Mail className="h-4 w-4" />
              </a>
            </Button>
          </div>

        </div>

        {/* Detailed Office Info & Timings */}
        <div className="grid gap-8 sm:grid-cols-2 rounded-3xl bg-white/[0.02] border border-white/10 p-5 sm:p-8 md:p-10">
          
          {/* Address Block */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-indigo-400">
              <MapPin className="h-5 w-5" />
              <h3 className="text-base font-bold text-white uppercase tracking-wider">कोचिंग केंद्र का पता (Office Address)</h3>
            </div>
            <div className="text-xs sm:text-sm text-slate-300 space-y-1 leading-relaxed">
              <p className="font-bold text-white text-base">Sagar Coaching Centre</p>
              <p>NH 106, Bhagwanpur, P.O. Bhagwanpur</p>
              <p>जिला: सुपौल (Supaul), बिहार (Bihar) — 854338</p>
              <p className="text-slate-400 pt-1 text-xs">लैंडमार्क: NH 106 मुख्य मार्ग, भगवानपुर चौक के समीप</p>
            </div>
            <div className="pt-2">
              <a 
                href="https://maps.google.com/?cid=10120212661193213675" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 hover:underline"
              >
                <span>Google Maps पर लोकेशन देखें</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Timings Block */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-emerald-400">
              <Clock className="h-5 w-5" />
              <h3 className="text-base font-bold text-white uppercase tracking-wider">संपर्क समय (Working Hours)</h3>
            </div>
            <div className="text-xs sm:text-sm text-slate-300 space-y-2.5">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-slate-400">सोमवार से शनिवार (Mon - Sat)</span>
                <span className="font-bold text-white">प्रातः 07:00 AM – 07:00 PM</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-slate-400">रविवार (Sunday)</span>
                <span className="text-slate-400">ऑफलाइन केंद्र बंद (WhatsApp सहायता उपलब्ध)</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-400">ऑनलाइन सपोर्ट</span>
                <span className="font-bold text-emerald-400">24×7 WhatsApp संदेश सक्रिय</span>
              </div>
            </div>
          </div>

        </div>

        {/* Trust Note */}
        <div className="text-center pt-4">
          <div className="inline-flex items-center gap-2 text-xs text-slate-400 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>हजारों विद्यार्थियों का भरोसेमंद संस्थान — श्रवण कुमार सागर सर, सुपौल, बिहार</span>
          </div>
        </div>

      </Container>
    </div>
  );
}
