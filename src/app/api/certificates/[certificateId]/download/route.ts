import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { CertificatePDF } from "@/lib/certificates/certificate-pdf";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ certificateId: string }> }
) {
  try {
    const { certificateId } = await params;

    if (!certificateId) {
      return NextResponse.json({ error: "Certificate ID is required" }, { status: 400 });
    }

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

    if (!certificate) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }

    // Resolve details using metadata or relation fallbacks
    const metadata = (certificate.metadata as Record<string, any>) || {};
    
    const studentName = metadata.studentName || 
      certificate.enrollment.user.name || 
      `${certificate.enrollment.user.firstName || ""} ${certificate.enrollment.user.lastName || ""}`.trim() ||
      certificate.enrollment.user.email.split("@")[0];

    const courseName = metadata.courseName || certificate.enrollment.course.title;

    const primaryTeacher = certificate.enrollment.course.teachers.find(t => t.isPrimary) || certificate.enrollment.course.teachers[0];
    const instructorName = metadata.instructorName || 
      primaryTeacher?.teacher.name || 
      `${primaryTeacher?.teacher.firstName || ""} ${primaryTeacher?.teacher.lastName || ""}`.trim() ||
      "Course Instructor";

    const issuedAt = certificate.issuedAt;

    // Generate the PDF Buffer
    const buffer = await renderToBuffer(
      React.createElement(CertificatePDF, {
        studentName,
        courseName,
        instructorName,
        certificateId: certificate.verificationCode,
        issuedAt,
        platformName: "Sagar Coaching Centre Bhagwanpur"
      }) as any
    );

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="certificate-${certificateId}.pdf"`
      }
    });

  } catch (error: any) {
    console.error("[CERTIFICATE_DOWNLOAD_API_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
