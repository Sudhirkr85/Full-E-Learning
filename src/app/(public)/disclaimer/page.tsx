import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { makeMetadata } from "@/lib/site";
import { AlertCircle, ArrowLeft, Mail, Phone, MapPin, ShieldAlert } from "lucide-react";

export const metadata: Metadata = makeMetadata({
  title: "Educational Disclaimer | Sagar Coaching Centre",
  description: "Official educational disclaimer and non-affiliation notice for Sagar Coaching Centre Bhagwanpur, Supaul, Bihar.",
  path: "/disclaimer"
});

export const revalidate = 86400; // Cache for 24 hours

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-[#060813] text-slate-100 py-16 px-4 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-amber-600/10 blur-[130px] pointer-events-none rounded-full" />

      <Container className="max-w-4xl mx-auto relative z-10 space-y-10">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-xl mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 font-mono">
              Transparency & Legal Notice
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">Educational Disclaimer</h1>
          <p className="text-xs text-slate-400 mt-2 font-mono">Last Updated: October 2026 | Sagar Coaching Centre</p>
        </div>

        <div className="bg-[#0b0e22]/80 border border-white/10 rounded-3xl p-5 sm:p-8 md:p-10 space-y-8 text-slate-300 leading-relaxed text-sm backdrop-blur-md">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">1. Independent Educational Institution</h2>
            <p>
              <strong>Sagar Coaching Centre Bhagwanpur</strong> (जिला सुपौल, बिहार), founded by Shrvan Kumar Sagar, is an independent private educational and coaching institute. We provide academic guidance, classroom coaching, mock test series, books, and study materials to assist students in preparing for competitive scholarship exams.
            </p>
          </section>

          <section className="space-y-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 p-5">
            <div className="flex items-center gap-2 text-amber-400">
              <AlertCircle className="h-5 w-5" />
              <h2 className="text-lg font-bold text-white">2. Non-Affiliation with Government Bodies</h2>
            </div>
            <p className="text-slate-300">
              Sagar Coaching Centre is <strong>NOT affiliated, associated, authorized, endorsed by, or in any way officially connected</strong> with any government department, ministry, or examination-conducting authority, including but not limited to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
              <li>State Councils of Educational Research and Training (SCERT Bihar, UP, MP, Rajasthan, or any state).</li>
              <li>National Council of Educational Research and Training (NCERT).</li>
              <li>Ministry of Education, Government of India.</li>
              <li>Navodaya Vidyalaya Samiti (NVS).</li>
              <li>Sainik Schools Society / National Testing Agency (NTA).</li>
              <li>National Scholarship Portal (NSP).</li>
            </ul>
            <p className="text-xs text-slate-400 pt-1">
              All official trademarks, exam names (NMMS, JNVST, AISSEE, Shrestha NETS, CMMSS), and logos belong to their respective government authorities and copyright owners. Their mention on this website is solely for nominative identification and informational reference purposes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">3. Informational Nature of Study Materials</h2>
            <p>
              The study guides, previous years&apos; question papers (PYQs), sample test papers, and answers provided on this website and in our published books (Raghav Prakashan) are compiled for practice, education, and research purposes. While we strive to ensure the highest accuracy in solutions and answer keys, students and parents are advised to always cross-verify dates, eligibility criteria, and results with official state SCERT or government notifications.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">4. No Guarantee of Selection or Scholarship Award</h2>
            <p>
              Enrollment in our courses, purchase of study materials, or practicing our mock test papers does not guarantee selection in any examination or receipt of scholarship funds. Selection and scholarship disbursement depend entirely on the student&apos;s individual performance, examination score, state merit lists, and verification by government authorities.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">5. Official Contact Details</h2>
            <p>For any queries or official clarification regarding this disclaimer:</p>
            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-2 mt-2 font-mono text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-amber-400 shrink-0" />
                <span>NH 106, Bhagwanpur, Supaul, Bihar — 854338</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-amber-400 shrink-0" />
                <span>+91 91101 13671</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-amber-400 shrink-0" />
                <span>codingwithsudhir@gmail.com</span>
              </div>
            </div>
          </section>

        </div>
      </Container>
    </div>
  );
}
