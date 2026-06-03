import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ certificateId: string }> }
) {
  try {
    const { certificateId } = await params;

    if (!certificateId) {
      return NextResponse.json({ error: "Certificate ID is required" }, { status: 400 });
    }

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
                        name: true
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
      return NextResponse.json({ verified: false, error: "Certificate not found" }, { status: 404 });
    }

    const metadata = (certificate.metadata as Record<string, any>) || {};

    const studentName = metadata.studentName || 
      certificate.enrollment.user.name || 
      `${certificate.enrollment.user.firstName || ""} ${certificate.enrollment.user.lastName || ""}`.trim() ||
      certificate.enrollment.user.email.split("@")[0];

    const courseName = metadata.courseName || certificate.enrollment.course.title;

    const primaryTeacher = certificate.enrollment.course.teachers.find(t => t.isPrimary) || certificate.enrollment.course.teachers[0];
    const instructorName = metadata.instructorName || 
      primaryTeacher?.teacher.name || 
      "Course Instructor";

    return NextResponse.json({
      verified: true,
      certificate: {
        id: certificate.id,
        verificationCode: certificate.verificationCode,
        studentName,
        courseName,
        instructorName,
        scorePercent: certificate.scorePercent,
        issuedAt: certificate.issuedAt,
        expiresAt: certificate.expiresAt
      }
    });

  } catch (error: any) {
    console.error("[CERTIFICATE_VERIFY_API_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
