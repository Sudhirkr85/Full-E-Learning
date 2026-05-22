import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { makeMetadata } from "@/lib/site";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { issueCertificateAction } from "@/lib/certificates/actions";
import { Award, ArrowLeft, Printer, ShieldCheck, Download, Calendar, ExternalLink } from "lucide-react";
import React from "react";

type CertificatePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: CertificatePageProps): Promise<Metadata> {
  const { slug } = await params;
  return makeMetadata({
    title: `Course Certificate`,
    description: `View and download your digital course certificate.`,
    path: `/student/courses/${slug}/certificate`,
    noIndex: true,
  });
}

export default async function StudentCertificatePage({ params }: CertificatePageProps) {
  const student = await requireRole(["STUDENT", "TEACHER", "ADMIN"]);
  const { slug } = await params;

  // 1. Fetch enrollment and progress
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId: student.id,
      course: {
        slug,
      },
    },
    include: {
      course: true,
      progress: true,
      certificate: true,
    },
  });

  if (!enrollment) {
    return (
      <section className="py-16 md:py-24">
        <Container className="max-w-md text-center">
          <Badge variant="destructive">Access Locked</Badge>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight">Not Enrolled</h1>
          <p className="mt-4 text-muted-foreground">
            You are not currently enrolled in this course or this learning track is restricted.
          </p>
          <Button className="mt-6" asChild>
            <Link href="/student/courses">Back to courses</Link>
          </Button>
        </Container>
      </section>
    );
  }

  // 2. Automatically generate certificate if progress is 100% but cert not created
  let certificate = enrollment.certificate;
  const progressPercent = enrollment.progress?.progressPercent ?? 0;

  if (!certificate && progressPercent === 100) {
    const res = await issueCertificateAction(enrollment.id);
    if (res.success && res.certificate) {
      certificate = res.certificate;
    }
  }

  // 3. If course not completed and cert doesn't exist
  if (!certificate) {
    return (
      <section className="py-16 md:py-24">
        <Container className="max-w-md text-center">
          <Badge variant="outline" className="border-amber-500/30 text-amber-500 bg-amber-500/[0.05]">
            Learning In Progress
          </Badge>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight">Certificate Locked</h1>
          <p className="mt-4 text-muted-foreground">
            You have finished {progressPercent}% of the course. Please complete all lessons to 100% to generate your graduation certificate.
          </p>
          <div className="mt-6 w-full bg-muted rounded-full h-2.5 overflow-hidden">
            <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
          </div>
          <Button className="mt-8" asChild>
            <Link href={`/courses/${slug}`}>Continue learning</Link>
          </Button>
        </Container>
      </section>
    );
  }

  const formattedDate = new Date(certificate.issuedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const studentName = student.firstName && student.lastName 
    ? `${student.firstName} ${student.lastName}` 
    : student.name ?? "E-Learner Graduate";

  return (
    <section className="py-10 md:py-16 bg-muted/30 min-h-screen print:bg-white print:py-0">
      {/* Control Actions Header (Hidden during native browser print) */}
      <Container className="max-w-5xl mb-6 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Button asChild variant="ghost" size="sm" className="self-start">
            <Link href="/student/courses" className="flex items-center gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>

          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="sm">
              <Link href={`/certificates/verify/${certificate.verificationCode}`} target="_blank" className="flex items-center gap-1.5">
                <ExternalLink className="h-4 w-4" />
                Public Registry
              </Link>
            </Button>
            
            {/* Native browser print trigger */}
            <Button 
              onClick={() => window.print()}
              size="sm"
              className="bg-amber-500 hover:bg-amber-600 text-background flex items-center gap-1.5"
            >
              <Printer className="h-4 w-4" />
              Print Certificate
            </Button>
          </div>
        </div>
      </Container>

      {/* Main Premium Certificate layout */}
      <Container className="max-w-5xl print:max-w-full print:p-0">
        <div 
          className="relative aspect-[1.414/1] w-full bg-white text-slate-900 border-[16px] border-slate-800 shadow-2xl p-12 md:p-20 flex flex-col justify-between items-center text-center overflow-hidden print:shadow-none print:border-[12px] print:border-slate-800"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(251,191,36,0.02) 0%, rgba(255,255,255,1) 70%)"
          }}
        >
          {/* Elegant gold filigree inner frame border */}
          <div className="absolute inset-4 border-[2px] border-amber-500/40 pointer-events-none print:inset-2" />
          <div className="absolute inset-6 border-[1px] border-amber-500/20 pointer-events-none print:inset-3" />

          {/* Certificate Corner Flourishes */}
          <div className="absolute top-8 left-8 border-t-2 border-l-2 border-amber-500/60 w-8 h-8 print:top-5 print:left-5" />
          <div className="absolute top-8 right-8 border-t-2 border-r-2 border-amber-500/60 w-8 h-8 print:top-5 print:right-5" />
          <div className="absolute bottom-8 left-8 border-b-2 border-l-2 border-amber-500/60 w-8 h-8 print:bottom-5 print:left-5" />
          <div className="absolute bottom-8 right-8 border-b-2 border-r-2 border-amber-500/60 w-8 h-8 print:bottom-5 print:right-5" />

          {/* BACKGROUND CREST SEAL (Decorative ambient SVG) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] w-96 h-96 pointer-events-none select-none print:opacity-[0.03]">
            <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full text-amber-500">
              <path d="M50 5 L85 25 L85 65 L50 95 L15 65 L15 25 Z" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M50 12 L78 28 L78 61 L50 86 L22 61 L22 28 Z" stroke="currentColor" strokeWidth="1" fill="none" />
              <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>

          {/* Top Header */}
          <div className="space-y-4">
            <div className="flex justify-center mb-1">
              <Award className="h-16 w-16 text-amber-500 animate-pulse print:h-12 print:w-12" />
            </div>
            <h2 className="font-serif text-xs font-semibold tracking-[0.3em] uppercase text-amber-600">
              Certificate of Completion
            </h2>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
              This credential certifies that
            </p>
          </div>

          {/* Student Name */}
          <div className="space-y-3 my-6">
            <h1 className="font-serif text-4xl font-extrabold tracking-tight text-slate-800 md:text-5xl print:text-4xl">
              {studentName}
            </h1>
            <div className="h-[2px] w-48 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent mx-auto" />
            <p className="text-xs italic text-slate-500 max-w-xl mx-auto leading-relaxed">
              has successfully finished all required lessons, modules, and graded examinations to satisfy graduation policies for the platform training track.
            </p>
          </div>

          {/* Course Subject Title */}
          <div className="space-y-2">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
              For mastering the curriculum of
            </p>
            <h3 className="font-serif text-2xl font-bold tracking-tight text-slate-800 md:text-3xl print:text-2xl">
              {enrollment.course.title}
            </h3>
          </div>

          {/* Date, Scores and Verification seal */}
          <div className="grid grid-cols-3 w-full border-t border-slate-100 pt-8 mt-6 text-slate-700 items-end print:pt-4 print:mt-4">
            {/* Issued Date */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 print:mb-1">Date of Issue</span>
              <span className="font-serif text-sm font-semibold text-slate-800 print:text-xs">{formattedDate}</span>
              <div className="w-16 h-[1px] bg-slate-200 mt-2" />
            </div>

            {/* Verification Seal Badge */}
            <div className="flex flex-col items-center justify-center relative">
              <div className="h-20 w-20 bg-amber-500/5 text-amber-500 border-2 border-dashed border-amber-500/30 rounded-full flex items-center justify-center shadow-inner relative z-10 print:h-14 print:w-14">
                <ShieldCheck className="h-10 w-10 print:h-7 print:w-7" />
              </div>
              <span className="text-[8px] text-muted-foreground font-mono mt-2 tracking-wider uppercase">
                ID: {certificate.verificationCode}
              </span>
            </div>

            {/* Academic Standing Grade */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 print:mb-1">Grade Standing</span>
              <span className="font-serif text-sm font-semibold text-slate-800 print:text-xs">
                {certificate.scorePercent !== null ? `${certificate.scorePercent}% Average` : "Satisfactory"}
              </span>
              <div className="w-16 h-[1px] bg-slate-200 mt-2" />
            </div>
          </div>

          {/* Signature credentials */}
          <div className="flex justify-between w-full mt-10 px-10 text-xs text-slate-600 print:mt-6 print:px-6">
            <div className="flex flex-col items-center">
              <div className="font-serif italic font-semibold text-slate-800 text-sm mb-1">E-Learning Academy</div>
              <div className="h-[1px] w-32 bg-slate-200 mb-1" />
              <div className="text-[9px] text-muted-foreground uppercase">Board of Trustees</div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="font-serif italic font-semibold text-slate-800 text-sm mb-1">Registrar Office</div>
              <div className="h-[1px] w-32 bg-slate-200 mb-1" />
              <div className="text-[9px] text-muted-foreground uppercase">Authorized Registrar</div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
