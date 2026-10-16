import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { makeMetadata } from "@/lib/site";
import { Shield, ArrowLeft, Mail, Phone, MapPin, ExternalLink, Cookie } from "lucide-react";

export const metadata: Metadata = makeMetadata({
  title: "Privacy Policy | Sagar Coaching Centre",
  description: "Official Privacy Policy for Sagar Coaching Centre Bhagwanpur. Explains personal data handling, Google AdSense, cookies, and user privacy rights.",
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
          <p className="text-xs text-slate-400 mt-2 font-mono">Last Updated: October 2026 | Sagar Coaching Centre</p>
        </div>

        <div className="bg-[#0b0e22]/80 border border-white/10 rounded-3xl p-5 sm:p-8 md:p-10 space-y-8 text-slate-300 leading-relaxed text-sm backdrop-blur-md">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">1. Introduction</h2>
            <p>
              Sagar Coaching Centre Bhagwanpur (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;), founded by Shrvan Kumar Sagar, is dedicated to offering trusted online and offline scholarship exam coaching for students across India. This Privacy Policy informs you of our policies regarding the collection, use, and disclosure of personal data when you use our official website (<span className="text-indigo-400 font-mono">sagarcoaching.tech</span>) and associated educational services.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">2. Information We Collect</h2>
            <p>To provide entrance exam coaching, test assessments, study material shipping, and course certifications, we may collect:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
              <li><strong className="text-slate-200">Account Credentials:</strong> Full name, mobile phone number, email address, and encrypted passwords.</li>
              <li><strong className="text-slate-200">Academic & Test Records:</strong> Enrolled courses, quiz attempt answers, assessment scores, and completion certificates.</li>
              <li><strong className="text-slate-200">Order & Delivery Details:</strong> Physical delivery address for dispatching printed guide books and mock test sets.</li>
              <li><strong className="text-slate-200">Payment Information:</strong> Transaction IDs and payment status processed securely through PCI-DSS compliant payment gateways (Razorpay). We do not store credit card numbers, debit card details, or UPI PINs.</li>
              <li><strong className="text-slate-200">Log & Technical Data:</strong> Browser type, IP address, device type, referring/exit pages, and access timestamps.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">3. How We Use Your Information</h2>
            <p>Collected data is used solely for genuine educational purposes:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
              <li>Providing access to scholarship test batches, video lectures, and live study materials.</li>
              <li>Evaluating online mock tests and generating report cards.</li>
              <li>Processing and delivering physical book orders through postal or courier services.</li>
              <li>Sending important exam schedule updates, admit card notifications, and result alerts.</li>
              <li>Monitoring platform stability and preventing fraudulent activities.</li>
            </ul>
          </section>

          {/* Section 4: Mandatory Google AdSense & Cookies Clause */}
          <section className="space-y-3 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 p-5">
            <div className="flex items-center gap-2 text-indigo-400">
              <Cookie className="h-5 w-5" />
              <h2 className="text-lg font-bold text-white">4. Google AdSense & Third-Party Advertising Cookies</h2>
            </div>
            <p className="text-slate-300">
              We may partner with third-party vendors, including <strong>Google AdSense</strong>, to serve advertisements on select free public educational pages of our website:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-400">
              <li>
                <strong className="text-slate-200">Third-Party Cookies:</strong> Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to this website or other websites on the Internet.
              </li>
              <li>
                <strong className="text-slate-200">Advertising Cookies (DoubleClick/DART):</strong> Google&apos;s use of advertising cookies enables it and its partners to serve ads to users based on their visit to our site and/or other sites on the Internet.
              </li>
              <li>
                <strong className="text-slate-200">Personalized vs. Non-Personalized Ads:</strong> Depending on your consent and location, ads may be personalized based on your general interests or non-personalized based on page context.
              </li>
              <li>
                <strong className="text-slate-200">Opt-Out of Personalized Advertising:</strong> Users may opt out of personalized advertising by visiting{" "}
                <a
                  href="https://www.google.com/settings/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 underline inline-flex items-center gap-1 hover:text-cyan-300"
                >
                  Google Ads Settings <ExternalLink className="h-3 w-3" />
                </a>. Alternatively, you can opt out of a third-party vendor&apos;s use of cookies for personalized advertising by visiting{" "}
                <a
                  href="https://www.aboutads.info/choices/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 underline inline-flex items-center gap-1 hover:text-cyan-300"
                >
                  www.aboutads.info <ExternalLink className="h-3 w-3" />
                </a>.
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">5. Data Protection & Security</h2>
            <p>
              We implement industry-standard encryption protocols (SSL/TLS) and secure database access controls to protect your personal data. We never sell, rent, or trade your personal information to third parties for marketing purposes.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">6. Children&apos;s Privacy</h2>
            <p>
              Our website provides educational preparation for Class 5 to 8 students (ages 10–14). We do not knowingly collect personal information directly from children without parental or guardian consent. All book purchases and account registrations must be supervised by a parent or teacher.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">7. Official Contact Information</h2>
            <p>If you have any questions, concerns, or requests regarding this Privacy Policy or your data, please contact us:</p>
            <div className="bg-white/5 border border-white/5 rounded-2xl p-5 space-y-2.5 font-mono text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>NH 106, Bhagwanpur, Supaul, Bihar — 854338</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>+91 91101 13671</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>codingwithsudhir@gmail.com</span>
              </div>
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
}
