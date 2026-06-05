"use client";

import { useState } from "react";
import Link from "next/link";
import { Award, Calendar, Search, Trash2, ExternalLink, ShieldCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { revokeCertificateAction } from "@/lib/certificates/actions";

interface CertificateRow {
  id: string;
  verificationCode: string;
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  scorePercent: number | null;
  issuedAt: string;
}

interface CertificatesAdminClientProps {
  certificates: CertificateRow[];
  metrics: {
    totalIssued: number;
    issuedThisMonth: number;
    uniqueCourses: number;
  };
}

export function CertificatesAdminClient({ certificates: initialCertificates, metrics }: CertificatesAdminClientProps) {
  const [certificates, setCertificates] = useState<CertificateRow[]>(initialCertificates);
  const [searchQuery, setSearchQuery] = useState("");
  const [revokingId, setRevokingId] = useState<string | null>(null);

  // Search Filter
  const filteredCertificates = certificates.filter((cert) => {
    const query = searchQuery.toLowerCase();
    return (
      cert.studentName.toLowerCase().includes(query) ||
      cert.studentEmail.toLowerCase().includes(query) ||
      cert.courseTitle.toLowerCase().includes(query) ||
      cert.verificationCode.toLowerCase().includes(query)
    );
  });

  // Handle Revoke Action
  const handleRevoke = async (id: string, verificationCode: string) => {
    const confirmed = window.confirm(`Are you absolutely sure you want to revoke and delete Certificate ${verificationCode}? This action is irreversible.`);
    if (!confirmed) return;

    setRevokingId(id);
    try {
      const result = await revokeCertificateAction(id);
      if (result.success) {
        setCertificates(prev => prev.filter(c => c.id !== id));
        toast.success(`Certificate ${verificationCode} successfully revoked!`);
      } else {
        toast.error(result.error || "Failed to revoke certificate");
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred during certificate revocation");
    } finally {
      setRevokingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <Badge variant="secondary" className="w-fit">Admin desk</Badge>
        <div className="flex items-center gap-2 mt-2">
          <Award className="h-6 w-6 text-indigo-400" />
          <h1 className="font-display text-3xl font-semibold tracking-tight text-white">
            Certificates Desk
          </h1>
        </div>
        <p className="text-xs text-slate-400">
          Moderate course completion metrics, verify issued codes, and securely revoke credentials platform-wide.
        </p>
      </div>

      {/* KPI Cards Row */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Total Issued */}
        <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#090d22]/50 p-5 shadow-sm">
          <div className="absolute top-0 right-0 h-16 w-16 bg-indigo-500/5 rounded-full blur-xl"></div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Issued</p>
          <p className="mt-4 text-3xl font-extrabold text-white font-display">{metrics.totalIssued}</p>
          <p className="text-[10px] text-slate-500 mt-2">Crypto certificates generated</p>
        </div>

        {/* This Month */}
        <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#090d22]/50 p-5 shadow-sm">
          <div className="absolute top-0 right-0 h-16 w-16 bg-emerald-500/5 rounded-full blur-xl"></div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Issued This Month</p>
          <p className="mt-4 text-3xl font-extrabold text-emerald-400 font-display">{metrics.issuedThisMonth}</p>
          <p className="text-[10px] text-slate-500 mt-2">New credential claims</p>
        </div>

        {/* Unique Courses */}
        <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#090d22]/50 p-5 shadow-sm">
          <div className="absolute top-0 right-0 h-16 w-16 bg-cyan-500/5 rounded-full blur-xl"></div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Courses Awarded</p>
          <p className="mt-4 text-3xl font-extrabold text-cyan-400 font-display">{metrics.uniqueCourses}</p>
          <p className="text-[10px] text-slate-500 mt-2">Courses with awarded certificates</p>
        </div>
      </div>

      {/* Controls */}
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-500">
          <Search className="h-4 w-4" />
        </div>
        <input
          type="text"
          placeholder="Search by student name, email, course title, or verification ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-slate-950/40 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition"
        />
      </div>

      {/* Table grid */}
      <div className="rounded-2xl border border-white/5 bg-[#090d20]/50 overflow-hidden shadow-xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-slate-950/20 text-slate-400 font-bold uppercase tracking-wider">
                <th className="p-4">Student</th>
                <th className="p-4">Course</th>
                <th className="p-4">Certificate ID</th>
                <th className="p-4">Issued On</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filteredCertificates.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 italic">
                    No matching certificates found.
                  </td>
                </tr>
              ) : (
                filteredCertificates.map((cert) => (
                  <tr key={cert.id} className="hover:bg-white/[0.02] transition">
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <p className="font-bold text-white">{cert.studentName}</p>
                        <p className="text-[10px] text-slate-500 select-all">{cert.studentEmail}</p>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-slate-200">
                      {cert.courseTitle}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-indigo-400 select-all">
                        {cert.verificationCode}
                        {cert.scorePercent !== null && (
                          <Badge variant="outline" className="text-[9px] px-1 py-0 border-emerald-500/20 text-emerald-400 bg-emerald-500/5">
                            {cert.scorePercent}%
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-slate-400">
                      {formatDate(cert.issuedAt)}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                          className="h-8 border-white/10 hover:bg-white/5 text-[11px] text-slate-300"
                        >
                          <Link href={`/verify/${cert.verificationCode}`} target="_blank">
                            <ExternalLink className="h-3.5 w-3.5 mr-1" />
                            Verify
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={revokingId === cert.id}
                          onClick={() => handleRevoke(cert.id, cert.verificationCode)}
                          className="h-8 hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 text-[11px]"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" />
                          Revoke
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
