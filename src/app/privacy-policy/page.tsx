import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { makeMetadata } from "@/lib/site";
import { Shield, ArrowLeft, Mail, Phone, MapPin } from "lucide-react";

export const metadata: Metadata = makeMetadata({
  title: "Privacy Policy | Sagar Coaching Centre",
  description: "Privacy policy and personal data handling terms for students, parents, and users of Sagar Coaching Centre Bhagwanpur, Supaul, Bihar.",
  path: "/privacy-policy"
});

export const revalidate = 86400; // Cache for 24 hours

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#060813] text-slate-100 py-16 px-4 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-600/10 blur-[130px] pointer-events-none rounded-full" />

      <Container className="max-w-4xl mx-auto relative z-10 space-y-10">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-xl mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Shield className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 font-mono">
              Legal & Compliance
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">Privacy Policy</h1>
          <p className="text-xs text-slate-400 mt-2 font-mono">Effective Date: September 2026 | Sagar Coaching Centre</p>
        </div>

        <div className="bg-[#0b0e22]/80 border border-white/10 rounded-3xl p-6 sm:p-10 space-y-8 text-slate-300 leading-relaxed text-sm backdrop-blur-md">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">1. Introduction</h2>
            <p>
              Sagar Coaching Centre Bhagwanpur ("we", "our", or "us"), founded by Shrvan Kumar Sagar, is committed to safeguarding the privacy and personal data of our students, parents, and online learners. This Privacy Policy outlines our practices regarding the collection, storage, use, and protection of information obtained through our official website (<span className="text-indigo-400 font-mono">sagarcoaching.tech</span>) and educational portals.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">2. Information We Collect</h2>
            <p>To provide entrance exam coaching, test assessments, study material shipping, and course certifications, we may collect the following details:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
              <li><strong className="text-slate-200">Account Credentials:</strong> Name, mobile phone number, email address, and login credentials.</li>
              <li><strong className="text-slate-200">Academic & Enrollment Records:</strong> Enrolled courses, quiz attempt answers, assessment scores, and completion certificates.</li>
              <li><strong className="text-slate-200">Order & Delivery Information:</strong> Physical shipping address for dispatching study guides and printed mock test books.</li>
              <li><strong className="text-slate-200">Payment References:</strong> Transaction identifiers processed securely through authorized payment gateway partners (Razorpay). We do not store credit card or UPI security pins.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">3. How We Use Your Information</h2>
            <p>We utilize the collected information strictly for authentic educational services, including:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
              <li>Facilitating access to scholarship test batches, video lectures, and live classroom portals.</li>
              <li>Delivering automated test score evaluations, rank predictions, and verified certificates.</li>
              <li>Processing online book purchases and physical textbook deliveries.</li>
              <li>Communicating important exam schedules, admit card updates, and scholarship notifications.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">4. Data Protection & Security</h2>
            <p>
              We implement industry-standard encryption protocols (SSL/TLS) and secure database authentication to prevent unauthorized access, alteration, or disclosure of user data. We never sell, rent, or trade your personal information to third-party advertisers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">5. Official Contact Information</h2>
            <p>For any queries, privacy concerns, or data correction requests, please contact our administrative center:</p>
            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-2 mt-2 font-mono text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>NH 106, Bhagwanpur, Supaul, Bihar — 852131</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>+91 91101 13671</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>support@sagarcoaching.tech</span>
              </div>
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
}
