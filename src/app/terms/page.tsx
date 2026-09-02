import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { makeMetadata } from "@/lib/site";
import { FileText, ArrowLeft, Mail, Phone, MapPin } from "lucide-react";

export const metadata: Metadata = makeMetadata({
  title: "Terms and Conditions | Sagar Coaching Centre",
  description: "Terms and conditions of service, student enrollment rules, and usage policies for Sagar Coaching Centre Bhagwanpur, Supaul, Bihar.",
  path: "/terms"
});

export const revalidate = 86400; // Cache for 24 hours

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#060813] text-slate-100 py-16 px-4 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-purple-600/10 blur-[130px] pointer-events-none rounded-full" />

      <Container className="max-w-4xl mx-auto relative z-10 space-y-10">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-xl mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <FileText className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-purple-400 font-mono">
              User Agreement
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">Terms and Conditions</h1>
          <p className="text-xs text-slate-400 mt-2 font-mono">Effective Date: September 2026 | Sagar Coaching Centre</p>
        </div>

        <div className="bg-[#0b0e22]/80 border border-white/10 rounded-3xl p-6 sm:p-10 space-y-8 text-slate-300 leading-relaxed text-sm backdrop-blur-md">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">1. Agreement to Terms</h2>
            <p>
              By accessing or enrolling in courses, purchasing study materials, or using mock test portals provided by Sagar Coaching Centre Bhagwanpur (Supaul, Bihar) through <span className="text-purple-400 font-mono">sagarcoaching.tech</span>, you agree to be bound by these Terms and Conditions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">2. Educational Services & Access</h2>
            <p>
              Sagar Coaching Centre provides scholarship exam coaching (including NMMS, JNVST Navodaya, Sainik School AISSEE, and Shrestha NETS), PDF study materials, online assessments, and classroom learning tools. Enrolled students receive non-transferable access to course materials for the specified duration of the batch.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">3. Intellectual Property Rights</h2>
            <p>
              All video lectures, PDF notes, mock test questions, books authored by Shrvan Kumar Sagar, and digital certifications are the intellectual property of Sagar Coaching Centre. Reproduction, unauthorized sharing, resale, or commercial redistribution of these educational resources is strictly prohibited.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">4. User Conduct & Academic Integrity</h2>
            <p>
              Students and parents agree to maintain academic honesty during online test series and practice mock examinations. Any fraudulent activity or misuse of the learning platform may lead to suspension of access without prior notice.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">5. Governing Law & Jurisdiction</h2>
            <p>
              These Terms shall be governed by and interpreted in accordance with the laws of India. Any disputes arising out of these terms shall be subject to the exclusive jurisdiction of the competent courts in Supaul, Bihar.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">6. Contact Information</h2>
            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-2 mt-2 font-mono text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-purple-400 shrink-0" />
                <span>NH 106, Bhagwanpur, Supaul, Bihar — 852131</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-purple-400 shrink-0" />
                <span>+91 91101 13671</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-purple-400 shrink-0" />
                <span>support@sagarcoaching.tech</span>
              </div>
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
}
