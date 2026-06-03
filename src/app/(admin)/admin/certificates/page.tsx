import type { Metadata } from "next";
import { makeMetadata } from "@/lib/site";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { withRetry } from "@/lib/db";
import { CertificatesAdminClient } from "./certificates-admin-client";

export const metadata: Metadata = makeMetadata({
  title: "Certificates Desk - Admin Panel",
  description: "Monitor, verify, and revoke certificates of completion issued across the entire platform.",
  path: "/admin/certificates",
  noIndex: true
});

export default async function AdminCertificatesPage() {
  // Ensure ADMIN role
  await requireRole(["ADMIN"]);

  // Fetch all certificates
  const certificates = await withRetry(() =>
    prisma.certificate.findMany({
      orderBy: { issuedAt: "desc" },
      include: {
        enrollment: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                firstName: true,
                lastName: true
              }
            },
            course: {
              select: {
                id: true,
                title: true
              }
            }
          }
        }
      }
    })
  );

  // Compute KPIs
  const totalIssued = certificates.length;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const issuedThisMonth = certificates.filter(
    (c) => new Date(c.issuedAt) >= startOfMonth
  ).length;

  const uniqueCourses = new Set(
    certificates.map((c) => c.enrollment.courseId)
  ).size;

  const kpiMetrics = {
    totalIssued,
    issuedThisMonth,
    uniqueCourses
  };

  // Simplify certificates format for client table
  const formattedCertificates = certificates.map((cert) => {
    const metadata = (cert.metadata as Record<string, any>) || {};

    const studentName = metadata.studentName || 
      cert.enrollment.user.name || 
      `${cert.enrollment.user.firstName || ""} ${cert.enrollment.user.lastName || ""}`.trim() ||
      cert.enrollment.user.email;

    const studentEmail = cert.enrollment.user.email;
    const courseTitle = metadata.courseName || cert.enrollment.course.title;

    return {
      id: cert.id,
      verificationCode: cert.verificationCode,
      studentName,
      studentEmail,
      courseTitle,
      scorePercent: cert.scorePercent,
      issuedAt: cert.issuedAt.toISOString()
    };
  });

  return (
    <div className="space-y-6">
      <CertificatesAdminClient 
        certificates={formattedCertificates} 
        metrics={kpiMetrics} 
      />
    </div>
  );
}
