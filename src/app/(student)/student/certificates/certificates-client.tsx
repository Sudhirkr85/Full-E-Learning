"use client";

import { useState } from "react";
import Link from "next/link";
import { Award, Download, Eye, Share2, ExternalLink, X, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CertificateItem {
  id: string;
  verificationCode: string;
  courseTitle: string;
  courseSlug: string;
  coverImageUrl: string | null;
  issuedAt: string;
  scorePercent: number | null;
}

interface CertificatesClientProps {
  initialCertificates: CertificateItem[];
}

export function CertificatesClient({ initialCertificates }: CertificatesClientProps) {
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);

  const handleShare = (verificationCode: string) => {
    const origin = window.location.origin;
    const verifyUrl = `${origin}/verify/${verificationCode}`;
    navigator.clipboard.writeText(verifyUrl);
    toast.success("Verification link copied to clipboard!");
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <Award className="h-5.5 w-5.5" />
            </div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-white">
              My Certificates
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            {initialCertificates.length} {initialCertificates.length === 1 ? "Certificate" : "Certificates"} Earned
          </p>
        </div>
        {initialCertificates.length > 0 && (
          <Button asChild variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-xs">
            <Link href="/courses">Browse More Courses</Link>
          </Button>
        )}
      </div>

      {initialCertificates.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-amber-500/20 blur-xl animate-pulse"></div>
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-amber-500/30 bg-amber-950/20 text-amber-400">
              <Award className="h-10 w-10" />
            </div>
          </div>
          <div className="space-y-2 max-w-md">
            <h3 className="font-display text-lg font-bold text-white">No certificates yet</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Complete a course to 100% to automatically earn a verification ID and unlock your downloadable, shareable PDF certificate.
            </p>
          </div>
          <Button asChild className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold hover:from-indigo-500 hover:to-cyan-500 rounded-xl px-6 py-2.5">
            <Link href="/courses">Browse Courses</Link>
          </Button>
        </div>
      ) : (
        /* Cards Grid */
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {initialCertificates.map((cert) => (
            <div
              key={cert.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-[#090d20]/50 shadow-lg backdrop-blur-xl transition duration-300 hover:border-indigo-500/30 hover:shadow-indigo-500/5"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                {cert.coverImageUrl ? (
                  <img
                    src={cert.coverImageUrl}
                    alt={cert.courseTitle}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-indigo-950/80 to-slate-900" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#060919] to-transparent opacity-80" />

                {/* Badge Overlay */}
                <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-amber-500/90 px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-black shadow-md">
                  <Award className="h-3 w-3 fill-black/10" />
                  Certified
                </div>
              </div>

              {/* Info Area */}
              <div className="flex-1 p-4 space-y-3">
                <div className="space-y-1">
                  <h3 className="font-display text-sm font-bold text-white line-clamp-2 leading-snug">
                    {cert.courseTitle}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Completed on {formatDate(cert.issuedAt)}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-mono text-slate-500 select-all">
                    ID: {cert.verificationCode}
                  </span>
                  {cert.scorePercent !== null && (
                    <span className="text-emerald-400 font-semibold">
                      Score: {cert.scorePercent}%
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-white/5 p-4 flex flex-col gap-2 bg-[#060919]/40">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedCert(cert)}
                    className="border-white/5 bg-white/[0.02] text-xs hover:bg-white/5 text-slate-200"
                  >
                    <Eye className="h-3.5 w-3.5 mr-1.5" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    asChild
                    className="bg-indigo-600/90 text-white font-semibold hover:bg-indigo-500 text-xs"
                  >
                    <a href={`/api/certificates/${cert.verificationCode}/download`}>
                      <Download className="h-3.5 w-3.5 mr-1.5" />
                      Download
                    </a>
                  </Button>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleShare(cert.verificationCode)}
                  className="w-full text-xs text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 border border-indigo-500/10"
                >
                  <Share2 className="h-3.5 w-3.5 mr-1.5" />
                  Share Certificate URL
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative flex flex-col w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-white/10 bg-[#090d20] shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/5 p-4">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-400" />
                <span className="text-sm font-bold text-white">Certificate Preview</span>
              </div>
              <button
                onClick={() => setSelectedCert(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Certificate Premium HTML Design (matches PDF structure) */}
            <div className="flex-1 overflow-y-auto p-6 md:p-12 flex items-center justify-center bg-slate-950/40">
              <div className="w-full max-w-3xl aspect-[1.414/1] border-2 border-amber-600/40 rounded-xl bg-[#060919] p-8 md:p-12 flex flex-col justify-between relative shadow-inner text-center overflow-hidden">
                {/* Gold ornament lines */}
                <div className="absolute top-0 inset-x-12 h-1.5 bg-amber-500/80 rounded-b-md" />
                <div className="absolute bottom-0 inset-x-12 h-1.5 bg-amber-500/80 rounded-t-md" />

                {/* Top header */}
                <div className="space-y-3">
                  <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400">
                    E-Learning Platform
                  </p>
                  <div className="w-24 h-[1px] bg-amber-500/20 mx-auto" />
                  <h2 className="font-serif text-2xl md:text-3xl font-extrabold uppercase tracking-wider text-amber-400">
                    Certificate of Completion
                  </h2>
                  <p className="text-[11px] md:text-xs text-slate-400 italic font-light">
                    This certifies that
                  </p>
                </div>

                {/* Student Name */}
                <div className="my-4">
                  <h3 className="font-serif text-2xl md:text-4xl font-extrabold text-white tracking-wide border-b-2 border-amber-500/40 inline-block px-4 pb-1">
                    Student Account
                  </h3>
                  <p className="text-[11px] md:text-xs text-slate-400 italic mt-3 font-light">
                    has successfully completed the course
                  </p>
                  <h4 className="text-lg md:text-xl font-bold text-indigo-300 mt-2">
                    {selectedCert.courseTitle}
                  </h4>
                  <p className="text-[9px] md:text-[10px] text-slate-500 font-medium mt-3">
                    on {formatDate(selectedCert.issuedAt)}
                  </p>
                </div>

                {/* Bottom signatures & verification details */}
                <div className="flex items-end justify-between border-t border-white/5 pt-6 mt-2">
                  <div className="w-1/3 text-left">
                    <div className="w-28 h-[1px] bg-slate-700 mb-2" />
                    <p className="text-[9px] md:text-[10px] font-bold text-slate-200">Course Instructor</p>
                    <p className="text-[8px] text-slate-500">Instructor Signature</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-amber-500/40 bg-amber-950/20 text-amber-500 text-[10px] font-extrabold tracking-wider">
                    SEAL
                  </div>
                  <div className="w-1/3 text-right">
                    <p className="text-[8px] text-slate-500">Certificate ID</p>
                    <p className="text-[9px] md:text-[10px] font-mono font-bold text-amber-400 mt-1">
                      {selectedCert.verificationCode}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="border-t border-white/5 p-4 flex justify-between gap-3 bg-[#060919]/60">
              <Button
                variant="outline"
                asChild
                className="border-white/10 text-slate-300 bg-white/5 hover:bg-white/10 text-xs"
              >
                <Link href={`/verify/${selectedCert.verificationCode}`} target="_blank">
                  <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                  Open Public Verify Route
                </Link>
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleShare(selectedCert.verificationCode)}
                  className="border-indigo-500/20 text-indigo-400 bg-indigo-500/5 hover:bg-indigo-500/10 text-xs"
                >
                  <Share2 className="h-3.5 w-3.5 mr-1.5" />
                  Copy Link
                </Button>
                <Button
                  asChild
                  className="bg-indigo-600 text-white font-semibold hover:bg-indigo-500 text-xs"
                >
                  <a href={`/api/certificates/${selectedCert.verificationCode}/download`}>
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    Download PDF
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
