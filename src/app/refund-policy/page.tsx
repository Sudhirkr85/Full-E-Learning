import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { makeMetadata } from "@/lib/site";
import { RefreshCw, ArrowLeft, Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = makeMetadata({
  title: "Refund and Cancellation Policy | Sagar Coaching Centre",
  description: "Official refund, return, and cancellation policies for online courses, study materials, and book orders at Sagar Coaching Centre Bhagwanpur.",
  path: "/refund-policy"
});

export const revalidate = 86400; // Cache for 24 hours

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#060813] text-slate-100 py-16 px-4 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-600/10 blur-[130px] pointer-events-none rounded-full" />

      <Container className="max-w-4xl mx-auto relative z-10 space-y-10">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-xl mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <RefreshCw className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 font-mono">
              Transparency & Satisfaction
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">Refund & Cancellation Policy</h1>
          <p className="text-xs text-slate-400 mt-2 font-mono">Effective Date: September 2026 | Sagar Coaching Centre</p>
        </div>

        <div className="bg-[#0b0e22]/80 border border-white/10 rounded-3xl p-6 sm:p-10 space-y-8 text-slate-300 leading-relaxed text-sm backdrop-blur-md">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">1. Overview</h2>
            <p>
              At Sagar Coaching Centre Bhagwanpur, we strive to deliver the highest quality education and scholarship exam resources. We maintain a transparent policy regarding digital enrollments, printed books, and physical study materials.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">2. Online Digital Courses & Test Series</h2>
            <p>
              Due to the immediate digital delivery and full curriculum access provided upon enrollment, course fees are generally non-refundable once classes have commenced or digital materials have been accessed. However, in cases of accidental duplicate payment or technical access issues that cannot be resolved within 48 hours by our support team, a full refund will be promptly issued.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">3. Physical Books & Printed Study Material</h2>
            <div className="space-y-2 text-slate-400">
              <p>For printed textbook and workbook orders dispatched through postal/courier delivery:</p>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-1 shrink-0" />
                <span><strong className="text-slate-200">Damaged or Defective Copies:</strong> If your book arrives damaged or with missing pages, report it within 7 days of delivery with a photo. A replacement copy or full refund will be processed immediately.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-1 shrink-0" />
                <span><strong className="text-slate-200">Cancellation Before Dispatch:</strong> Book orders can be cancelled for a 100% refund at any time before the package is handed over to the courier partner.</span>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">4. Refund Processing Timelines</h2>
            <p>
              Approved refunds are credited back to the original payment source (Bank Account / UPI / Debit Card) within 5 to 7 working days, as per banking and payment gateway processing cycles.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">5. How to Request Assistance</h2>
            <p>To request a refund or report a delivery issue, please reach out with your Order ID / Enrollment ID:</p>
            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-2 mt-2 font-mono text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>NH 106, Bhagwanpur, Supaul, Bihar — 852131</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>+91 91101 13671</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>support@sagarcoaching.tech</span>
              </div>
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
}
