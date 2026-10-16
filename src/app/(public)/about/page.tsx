import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { makeMetadata, siteConfig } from "@/lib/site";
import { 
  GraduationCap, 
  Award, 
  BookOpen, 
  Youtube, 
  Users, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Sparkles,
  HeartHandshake
} from "lucide-react";

export const metadata: Metadata = makeMetadata({
  title: "About Us | Sagar Coaching Centre Bhagwanpur",
  description: "Learn about Sagar Coaching Centre, Bhagwanpur, Supaul, Bihar. Founded by Shrvan Kumar Sagar (Sagar Sir) to empower rural and government school students for NMMS, Navodaya, and Sainik School scholarship exams.",
  path: "/about"
});

export const revalidate = 86400; // Cache for 24 hours

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-[#030611] text-slate-100 py-16 px-4 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[750px] h-[380px] bg-indigo-600/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-[35%] right-[-5%] w-[450px] h-[450px] bg-cyan-600/10 blur-[140px] pointer-events-none rounded-full" />

      <Container className="max-w-5xl mx-auto relative z-10 space-y-16">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge className="bg-indigo-500/15 border-indigo-500/30 text-indigo-300 px-4 py-1.5 text-xs rounded-full uppercase tracking-wider font-bold">
            <Sparkles className="h-3.5 w-3.5 mr-1.5 text-amber-400" />
            Our Mission & Identity
          </Badge>
          <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            शिक्षा क्रांति: <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">हर बच्चे का स्कॉलरशिप सपना</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            सागर कोचिंग सेंटर, भगवानपुर (जिला सुपौल, बिहार) — ग्रामीण एवं सरकारी विद्यालयों के विद्यार्थियों को राष्ट्रीय स्तर की छात्रवृत्ति परीक्षाओं में सफलता दिलाने वाला एक समर्पित शिक्षण संस्थान।
          </p>
        </div>

        {/* Founder Story Block */}
        <div className="grid gap-8 lg:grid-cols-12 items-center rounded-3xl bg-[#0b0e22]/80 border border-white/10 p-5 sm:p-8 md:p-10 backdrop-blur-md">
          <div className="lg:col-span-5 flex flex-col items-center text-center space-y-4">
            <div className="relative h-36 w-36 sm:h-44 sm:w-44 rounded-full overflow-hidden border-4 border-indigo-500/30 shadow-2xl bg-gradient-to-tr from-indigo-950 to-slate-900 p-2 flex items-center justify-center">
              <Image 
                src="/logo-circle-transparent.png" 
                alt="Shrvan Kumar Sagar - Founder Sagar Coaching Centre" 
                width={160} 
                height={160} 
                className="object-contain"
              />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">श्रवण कुमार &lsquo;सागर&rsquo;</h2>
              <p className="text-xs font-semibold text-indigo-400 mt-0.5">संस्थापक एवं मुख्य शिक्षक (Founder & Head Teacher)</p>
              <p className="text-[11px] text-slate-400 mt-1">लेखक: राघव प्रकाशन (NMMS गाइड बुक) | 4 YouTube चैनल्स</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-xl">
              <MapPin className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
              <span>भगवानपुर, जिला सुपौल, बिहार</span>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4 text-slate-300 text-sm leading-relaxed border-t lg:border-t-0 lg:border-l border-white/10 pt-6 lg:pt-0 lg:pl-8">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-lg">
              <HeartHandshake className="h-4 w-4 text-amber-400" />
              <span>संस्थापक का संदेश</span>
            </div>
            <blockquote className="italic text-slate-200 border-l-2 border-indigo-500 pl-4 py-1 text-sm sm:text-base">
              &ldquo;माना कि अंधेरा घना है, पर दीया जलाना कहां मना है।&rdquo;
            </blockquote>
            <p>
              हमारा मानना है कि प्रतिभा किसी बड़े शहर या महंगे कॉन्वेंट स्कूल की मोहताज नहीं होती। बिहार, उत्तर प्रदेश, राजस्थान, मध्य प्रदेश और देश के कोने-कोने के सरकारी विद्यालयों में पढ़ने वाले छात्रों में असीम क्षमता है।
            </p>
            <p>
              वर्षों के शिक्षण अनुभव के साथ, श्रवण सर ने हजारों छात्रों को **NMMS (National Means-cum-Merit Scholarship Scheme)**, **नवोदय विद्यालय (JNVST)**, **सैनिक स्कूल (AISSEE)**, और **श्रेष्ठ (Shrestha NETS)** परीक्षा की सटीक तैयारी कराई है, जिससे छात्र ₹48,000 की सरकारी छात्रवृत्ति और आवासीय विद्यालयों में नि:शुल्क गुणवत्तापूर्ण शिक्षा प्राप्त कर रहे हैं।
            </p>
          </div>
        </div>

        {/* Pillars of Excellence */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">हम क्या और कैसे पढ़ाते हैं</h2>
            <p className="text-xs sm:text-sm text-slate-400">हमारी शिक्षण पद्धति पूरी तरह वैज्ञानिक और परीक्षा-पैटर्न आधारित है</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-3 hover:border-indigo-500/40 transition">
              <div className="h-10 w-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">ओरिजिनल स्टडी मैटेरियल & पुस्तकें</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                राघव प्रकाशन के सहयोग से श्रवण सागर सर द्वारा स्वयं तैयार की गई NMMS गाइड बुक्स, जिसमें विगत वर्षों के हल प्रश्न पत्र और विस्तृत थ्योरी शामिल है।
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-3 hover:border-cyan-500/40 transition">
              <div className="h-10 w-10 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <GraduationCap className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">MAT (मानसिक योग्यता) में महारत</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                रीजनिंग (तर्कशक्ति) के जटिल प्रश्नों को सरल शॉर्टकट ट्रिक्स और चित्रों के माध्यम से हल कराने की विशेष तकनीक।
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-3 hover:border-emerald-500/40 transition">
              <div className="h-10 w-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">100% नि:शुल्क ऑनलाइन रीडिंग</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                हमारी वेबसाइट और YouTube चैनल्स पर सभी छात्रों के लिए पिछले वर्षों के प्रश्न पत्र (PYQ) और आंसर की नि:शुल्क उपलब्ध कराई जाती हैं।
              </p>
            </div>
          </div>
        </div>

        {/* YouTube Community */}
        <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-red-950/20 via-slate-900 to-indigo-950/30 p-8 sm:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider">
                <Youtube className="h-4 w-4" /> YouTube Learning Network
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">हमारे 4 मुख्य यूट्यूब चैनल्स</h3>
            </div>
            <span className="text-xs font-semibold text-slate-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
              लाखों छात्रों का विश्वास
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {siteConfig.socials.youtubeChannels.map((ch, idx) => (
              <a
                key={idx}
                href={ch.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 space-y-2 hover:border-red-500/40 hover:bg-slate-900 transition group"
              >
                <div className="flex items-center gap-2 text-red-500 font-bold text-sm group-hover:text-red-400">
                  <Youtube className="h-4 w-4" />
                  <span className="truncate">{ch.name}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">{ch.focus}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Contact Strip */}
        <div className="text-center space-y-4 pt-4">
          <p className="text-xs text-slate-400">
            क्या आपके मन में प्रवेश, पाठ्यक्रम या पुस्तकों को लेकर कोई प्रश्न है?
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl px-6 py-5 shadow-lg">
              <Link href="/contact" className="flex items-center gap-2">
                <span>हमसे संपर्क करें (Contact Us)</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-white/15 bg-white/5 hover:bg-white/10 text-slate-200 rounded-xl px-6 py-5">
              <Link href="/store">स्टोर में पुस्तकें देखें</Link>
            </Button>
          </div>
        </div>

      </Container>
    </div>
  );
}
