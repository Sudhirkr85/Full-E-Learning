import type { Metadata } from "next";
import { makeMetadata } from "@/lib/site";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { withRetry } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { TeacherEnrollmentsClient } from "./teacher-enrollments-client";

export const metadata: Metadata = makeMetadata({
  title: "My Enrolled Students - Teacher Panel",
  description: "Monitor students enrolled in your active course curriculum, track progress, and completions.",
  path: "/teacher/enrollments",
  noIndex: true
});

export default async function TeacherEnrollmentsPage() {
  // Enforce TEACHER role check on the server
  const user = await requireRole(["TEACHER"]);

  // Fetch only enrollments where the course is taught by this teacher
  const enrollments = await withRetry(() =>
    prisma.enrollment.findMany({
      where: {
        course: {
          teachers: {
            some: {
              teacherId: user.id
            }
          }
        }
      },
      include: {
        user: true,
        course: true,
        progress: true
      },
      orderBy: { createdAt: "desc" }
    })
  );

  // Compute Metrics Server-side
  const myTotalStudents = enrollments.length;

  const activeLearners = enrollments.filter(
    (e) => (e.progress?.progressPercent ?? 0) < 100
  ).length;

  const completions = enrollments.filter(
    (e) => (e.progress?.progressPercent ?? 0) === 100
  ).length;

  const metrics = {
    myTotalStudents,
    activeLearners,
    completions
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <Badge variant="secondary" className="w-fit">Teacher area</Badge>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-white">
          My Students
        </h1>
        <p className="text-xs text-slate-400">
          Track student curriculum milestones, review completion metrics, and check active participant progress.
        </p>
      </div>

      {/* Interactive Table Interface */}
      <TeacherEnrollmentsClient 
        enrollments={enrollments} 
        metrics={metrics} 
      />
    </div>
  );
}
