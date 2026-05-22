import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { makeMetadata } from "@/lib/site";
import { verifyCertificateAction } from "@/lib/certificates/actions";
import { Award, Calendar, CheckCircle2, ShieldCheck, User, BookOpen, Clock, AlertTriangle, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

type VerifyPageProps = {
  params: Promise<{
    code: string;
  }>;
};

export async function generateMetadata({ params }: VerifyPageProps): Promise<Metadata> {
  const { code } = await params;
  return makeMetadata({
    title: `Verify Certificate ${code}`,
    description: `Verify the authenticity of digital certificate ${code} issued by our E-Learning platform.`,
    path: `/certificates/verify/${code}`,
  });
}

export default async function VerifyCertificatePage({ params }: VerifyPageProps) {
  const { code } = await params;
  const result = await verifyCertificateAction(code);

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      {/* Background ambient glow bubbles */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <Container className="relative z-10 max-w-3xl">
        <div className="mb-8">
          <Button asChild variant="ghost" size="sm" className="hover:bg-muted/50">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        {!result.success || !result.certificate ? (
          <Card className="border-destructive/30 shadow-2xl bg-background/60 backdrop-blur-md">
            <CardHeader className="text-center p-8 border-b border-border/40">
              <div className="mx-auto h-16 w-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-4 border border-destructive/20">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight text-destructive">Verification Failed</CardTitle>
              <CardDescription className="text-base mt-2">
                The verification code you provided does not match any registered certificate.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-4 text-center text-muted-foreground text-sm">
              <p className="max-w-md mx-auto leading-relaxed">
                Please make sure the URL or code entered is correct. If you believe this is an error, please reach out to our support team.
              </p>
              <div className="p-4 rounded-xl bg-muted/40 border border-border/60 max-w-sm mx-auto font-mono text-xs select-all">
                Code Provided: {code}
              </div>
            </CardContent>
            <CardFooter className="p-8 border-t border-border/40 bg-muted/5 flex justify-center">
              <Button asChild>
                <Link href="/">Browse courses</Link>
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="border-amber-500/20 shadow-2xl bg-background/60 backdrop-blur-md overflow-hidden relative">
            {/* Authenticity diagonal bar */}
            <div className="absolute top-0 right-0 w-36 h-36 overflow-hidden pointer-events-none select-none">
              <div className="absolute top-6 -right-10 bg-amber-500 text-background font-bold text-[10px] py-1 w-48 text-center rotate-45 uppercase tracking-widest border-y border-amber-600/20 shadow-md">
                Verified Seal
              </div>
            </div>

            <CardHeader className="p-8 border-b border-border/40 text-center md:text-left bg-gradient-to-br from-amber-500/[0.03] to-emerald-500/[0.03]">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="h-14 w-14 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center border border-amber-500/20 mx-auto md:mx-0 shrink-0">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                    <Badge variant="outline" className="border-amber-500/30 text-amber-500 bg-amber-500/[0.05] font-semibold text-xs tracking-wider uppercase py-0.5">
                      Valid Certificate
                    </Badge>
                    <span className="text-xs text-muted-foreground font-mono">{result.certificate.verificationCode}</span>
                  </div>
                  <CardTitle className="text-2xl font-bold tracking-tight pt-1">Credentials Verification</CardTitle>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-8 space-y-8">
              {/* Recipient details */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest border-b border-border/50 pb-2">Issued To</h3>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0 border border-border">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-foreground">
                      {result.certificate.enrollment.user.firstName && result.certificate.enrollment.user.lastName
                        ? `${result.certificate.enrollment.user.firstName} ${result.certificate.enrollment.user.lastName}`
                        : result.certificate.enrollment.user.name ?? "Verified Student"}
                    </h4>
                    <p className="text-xs text-muted-foreground">Successfully fulfilled the academic requirements and completed the track.</p>
                  </div>
                </div>
              </div>

              {/* Course details */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest border-b border-border/50 pb-2">Course Completed</h3>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0 border border-border mt-0.5">
                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-semibold text-foreground leading-snug">
                      {result.certificate.enrollment.course.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {result.certificate.enrollment.course.durationMinutes 
                          ? `${Math.round(result.certificate.enrollment.course.durationMinutes / 60)} hours` 
                          : "Self-paced study"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        Issued: {new Date(result.certificate.issuedAt).toLocaleDateString("en-US", {
                          month: "long", day: "numeric", year: "numeric"
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Score and Verification badge */}
              <div className="grid gap-4 sm:grid-cols-2 pt-2">
                <div className="p-5 rounded-2xl bg-muted/40 border border-border/60 text-center sm:text-left">
                  <div className="text-xs text-muted-foreground uppercase font-semibold tracking-wider flex items-center justify-center sm:justify-start gap-1">
                    <Award className="h-4 w-4 text-amber-500" /> Academic Standing
                  </div>
                  <div className="mt-3 text-3xl font-bold text-foreground">
                    {result.certificate.scorePercent !== null 
                      ? `${result.certificate.scorePercent}% Average` 
                      : "Satisfactory Pass"}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Based on graded comprehensive assessments taken during learning.</p>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-500/[0.03] border border-emerald-500/20 text-center sm:text-left flex flex-col justify-between">
                  <div>
                    <div className="text-xs text-emerald-500 uppercase font-semibold tracking-wider flex items-center justify-center sm:justify-start gap-1">
                      <CheckCircle2 className="h-4 w-4" /> Certificate Status
                    </div>
                    <div className="mt-3 text-2xl font-bold text-emerald-500">Fully Authenticated</div>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">Issued in accordance with platform policies, signed and locked cryptographically.</p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="p-8 border-t border-border/40 bg-muted/5 flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-muted-foreground font-mono">
                Verify URL: /certificates/verify/{code}
              </div>
              <Button asChild size="sm" variant="outline">
                <Link href={`/courses/${result.certificate.enrollment.course.slug}`} className="flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4" />
                  View Course Details
                </Link>
              </Button>
            </CardFooter>
          </Card>
        )}
      </Container>
    </section>
  );
}
