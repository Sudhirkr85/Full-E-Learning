import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Home, BookOpen, ShoppingBag, Phone, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#030611] text-slate-100 flex items-center justify-center py-20 px-4 relative overflow-hidden font-sans">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600/10 blur-[130px] pointer-events-none rounded-full" />

      <Container className="max-w-2xl text-center space-y-8 relative z-10">
        <div className="space-y-3">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
            404 — Page Not Found
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-white">
            पेज नहीं मिला
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto leading-relaxed">
            जिस पेज को आप ढूंढ रहे हैं वह मौजूद नहीं है, स्थानांतरित कर दिया गया है या उसका लिंक बदल गया है।
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button asChild className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl px-6 py-5 shadow-lg">
            <Link href="/" className="flex items-center justify-center gap-2">
              <Home className="h-4 w-4" />
              <span>मुख्य पृष्ठ (Home)</span>
            </Link>
          </Button>

          <Button asChild variant="outline" className="w-full sm:w-auto border-white/15 bg-white/5 hover:bg-white/10 text-slate-200 rounded-xl px-6 py-5">
            <Link href="/blog" className="flex items-center justify-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>प्रश्न पत्र (PYQ)</span>
            </Link>
          </Button>

          <Button asChild variant="outline" className="w-full sm:w-auto border-white/15 bg-white/5 hover:bg-white/10 text-slate-200 rounded-xl px-6 py-5">
            <Link href="/store" className="flex items-center justify-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              <span>स्टोर (Books)</span>
            </Link>
          </Button>

          <Button asChild variant="outline" className="w-full sm:w-auto border-white/15 bg-white/5 hover:bg-white/10 text-slate-200 rounded-xl px-6 py-5">
            <Link href="/contact" className="flex items-center justify-center gap-2">
              <Phone className="h-4 w-4" />
              <span>सहायता (Contact)</span>
            </Link>
          </Button>
        </div>

        <p className="text-xs text-slate-500 pt-4">
          Sagar Coaching Centre Bhagwanpur (Supaul, Bihar) • Support: +91 91101 13671
        </p>
      </Container>
    </div>
  );
}
