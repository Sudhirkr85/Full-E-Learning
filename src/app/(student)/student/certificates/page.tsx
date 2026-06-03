import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { makeMetadata } from "@/lib/site";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CertificatesClient } from "./certificates-client";

export const metadata: Metadata = makeMetadata({
  title: "My Certificates",
  description: "View, download, and share your earned course completion certificates.",
  path: "/student/certificates",
  noIndex: true
});

export default async function StudentCertificatesPage() {
  // Guard route for student role
  const user = await requireRole(["STUDENT"]);

  // Query all certificates for this user
  const certificates = await prisma.certificate.findMany({
    where: {
      enrollment: {
        userId: user.id
      }
    },
    orderBy: {
      issuedAt: "desc"
    },
    include: {
      enrollment: {
        include: {
          course: {
            select: {
              title: true,
              slug: true,
              coverImageUrl: true
            }
          }
        }
      }
    }
  });

  // Map database response to simplified props for our client component
  const certificatesData = certificates.map((cert) => {
    const metadata = (cert.metadata as Record<string, any>) || {};
    return {
      id: cert.id,
      verificationCode: cert.verificationCode,
      courseTitle: metadata.courseName || cert.enrollment.course.title,
      courseSlug: cert.enrollment.course.slug,
      coverImageUrl: cert.enrollment.course.coverImageUrl,
      issuedAt: cert.issuedAt.toISOString(),
      scorePercent: cert.scorePercent
    };
  });

  return (
    <CertificatesClient 
      initialCertificates={certificatesData} 
    />
  );
}
