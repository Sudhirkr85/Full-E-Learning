import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, ShieldAlert, Award, Calendar, User, BookOpen, ExternalLink, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { makeMetadata } from "@/lib/site";

export const metadata: Metadata = makeMetadata({
  title: "Verify Certificate",
  description: "Verify the authenticity of student certificates of completion.",
  path: "/verify",
  noIndex: false
});

export default async function VerifyCertificatePage(
  props: { params: Promise<{ certificateId: string }> }
) {
  const params = await props.params;
  const { certificateId } = params;

  // Query certificate by verificationCode
  const certificate = await prisma.certificate.findUnique({
    where: { verificationCode: certificateId },
    include: {
      enrollment: {
        include: {
          user: {
            select: {
              name: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          course: {
            select: {
              title: true,
              slug: true,
              teachers: {
                include: {
                  teacher: {
                    select: {
                      name: true,
                      firstName: true,
                      lastName: true
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });

  const formattedDate = certificate
    ? new Date(certificate.issuedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  // Resolve names
  const metadata = certificate ? ((certificate.metadata as Record<string, any>) || {}) : {};
  const studentName = metadata.studentName || 
    (certificate ? (certificate.enrollment.user.name || 
      `${certificate.enrollment.user.firstName || ""} ${certificate.enrollment.user.lastName || ""}`.trim() ||
      certificate.enrollment.user.email.split("@")[0]) : "");

  const courseName = metadata.courseName || (certificate ? certificate.enrollment.course.title : "");

  const primaryTeacher = certificate?.enrollment.course.teachers.find(t => t.isPrimary) || certificate?.enrollment.course.teachers[0];
  const instructorName = metadata.instructorName || 
    (primaryTeacher ? (primaryTeacher.teacher.name || 
      `${primaryTeacher.teacher.firstName || ""} ${primaryTeacher.teacher.lastName || ""}`.trim()) : "Course Instructor");

  return (
    <div className="min-h-screen bg-[#030612] text-slate-100 flex flex-col justify-between relative overflow-hidden bg-grid-cyber">
      {/* Decorative ambient background overlays */}
      <div className="absolute top-[20%] left-[-10%] -z-10 h-[400px] w-[400px] rounded-full bg-indigo-500/5 blur-[120px]"></div>
      <div className="absolute bottom-[20%] right-[-10%] -z-10 h-[400px] w-[400px] rounded-full bg-cyan-500/5 blur-[120px]"></div>

      {/* Navigation Header */}
      <header className="border-b border-white/5 bg-[#090d20]/30 backdrop-blur-md px-6 py-4 flex items-center justify-between shrink-0">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 p-[1px]">
            <div className="flex h-full w-full items-center justify-center rounded-[7px] bg-[#0b0f1e] text-indigo-400">
              <Zap className="h-4.5 w-4.5 fill-indigo-400/20" />
            </div>
          </div>
          <span className="font-display text-base font-extrabold tracking-tight text-white">
            E-Learning Platform
          </span>
        </Link>
        <Button asChild size="sm" variant="outline" className="border-white/10 hover:bg-white/5 text-xs text-slate-300">
          <Link href="/courses">Browse Courses</Link>
        </Button>
      </header>

      {/* Main Body */}
      <main className="flex-1 flex items-center justify-center p-6 shrink-0">
        {!certificate ? (
          /* Certificate NOT found card */
          <div className="w-full max-w-md rounded-2xl border border-rose-500/10 bg-[#0e0811]/60 p-8 shadow-2xl backdrop-blur-xl text-center space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-rose-500/20 bg-rose-500/10 text-rose-500">
              <ShieldAlert className="h-8 w-8" />
            </div>
            
            <div className="space-y-2">
              <h1 className="font-display text-xl font-extrabold text-white tracking-tight">
                Invalid Certificate
              </h1>
              <p className="text-xs leading-relaxed text-slate-400">
                The certificate verification ID <span className="font-mono text-rose-400 font-semibold select-all">{certificateId}</span> does not exist or has been revoked in our database records.
              </p>
            </div>

            <div className="border-t border-white/5 pt-6 space-y-3">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                Verification Fail
              </p>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto leading-relaxed">
                If you believe this is an error, please check the spelling of the ID or contact the student/support.
              </p>
            </div>

            <Button asChild variant="outline" className="w-full border-white/10 bg-white/5 hover:bg-white/10 text-xs">
              <Link href="/">Back to Home Page</Link>
            </Button>
          </div>
        ) : (
          /* Certificate verified card */
          <div className="w-full max-w-xl rounded-2xl border border-emerald-500/15 bg-[#080f18]/65 p-6 md:p-8 shadow-2xl backdrop-blur-xl text-center space-y-6 md:space-y-8 animate-in fade-in zoom-in duration-300">
            
            {/* Header section inside card */}
            <div className="space-y-3">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h1 className="font-display text-xl md:text-2xl font-extrabold text-white tracking-tight">
                ✓ Certificate Verified
              </h1>
              <p className="text-xs text-slate-400">
                This certificate is authentic and was officially issued by E-Learning Platform.
              </p>
            </div>

            {/* Certificate Details Inner Card */}
            <div className="rounded-xl border border-white/5 bg-slate-950/40 p-5 text-left space-y-4">
              <div className="flex items-start gap-3.5 pb-3.5 border-b border-white/5">
                <User className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Student Name</p>
                  <p className="text-sm font-extrabold text-white mt-0.5">{studentName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pb-3.5 border-b border-white/5">
                <BookOpen className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Course Completed</p>
                  <p className="text-sm font-extrabold text-indigo-300 mt-0.5">{courseName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pb-3.5 border-b border-white/5">
                <Award className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Primary Instructor</p>
                  <p className="text-sm font-extrabold text-white mt-0.5">{instructorName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3.5">
                  <Calendar className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Issue Date</p>
                    <p className="text-xs font-bold text-white mt-0.5">{formattedDate}</p>
                  </div>
                </div>
                <div className="flex flex-col text-right justify-center">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Certificate ID</p>
                  <p className="text-xs font-mono font-bold text-amber-400 mt-0.5 select-all">{certificate.verificationCode}</p>
                </div>
              </div>
            </div>

            {/* Verified Statement Footer */}
            <div className="space-y-4 pt-2">
              <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
                This credential recognizes completion of all relevant curriculum modules, practical lab assessments, and examination requirements.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Button asChild className="bg-indigo-600/90 text-white font-semibold hover:bg-indigo-500 rounded-xl px-5 text-xs">
                  <a href={`/api/certificates/${certificate.verificationCode}/download`}>
                    Download Verified PDF
                  </a>
                </Button>
                {certificate.enrollment.course.slug && (
                  <Button asChild variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-xs text-slate-300">
                    <Link href={`/courses/${certificate.enrollment.course.slug}`} className="flex items-center gap-1.5">
                      View Course Details
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>

          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-slate-950/20 px-6 py-4 text-center shrink-0">
        <p className="text-[10px] text-slate-500">
          © {new Date().getFullYear()} E-Learning Platform. Secured with cryptographic verification codes.
        </p>
      </footer>
    </div>
  );
}
