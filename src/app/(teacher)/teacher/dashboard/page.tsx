import type { Metadata } from "next";
import { makeMetadata } from "@/lib/site";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { withRetry } from "@/lib/db";
import { TeacherDashboardClient } from "./teacher-dashboard-client";

export const metadata: Metadata = makeMetadata({
  title: "Teacher Dashboard - Analytics Desk",
  description: "Unified overview of curriculum performance, syllabus management, and learner milestones.",
  path: "/teacher/dashboard",
  noIndex: true
});

export default async function TeacherDashboardPage() {
  // Enforce TEACHER role check on the server
  const user = await requireRole(["TEACHER"]);

  // Fetch all teacher-related statistics concurrently with db wrapper
  const [courses, recentEnrollments, recentSubmissions, recentCompletions, recentTickets] = await Promise.all([
    withRetry(() =>
      prisma.course.findMany({
        where: {
          teachers: {
            some: {
              teacherId: user.id
            }
          }
        },
        include: {
          enrollments: {
            include: {
              user: true,
              progress: true,
              course: true
            }
          }
        }
      })
    ),
    withRetry(() =>
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
        orderBy: { enrolledAt: "desc" },
        take: 5
      })
    ),
    withRetry(() =>
      prisma.attempt.findMany({
        where: {
          test: {
            course: {
              teachers: {
                some: {
                  teacherId: user.id
                }
              }
            }
          },
          status: { in: ["SUBMITTED", "GRADED"] }
        },
        include: {
          user: true,
          test: true
        },
        orderBy: { submittedAt: "desc" },
        take: 5
      })
    ),
    withRetry(() =>
      prisma.lessonProgress.findMany({
        where: {
          isCompleted: true,
          enrollment: {
            course: {
              teachers: {
                some: {
                  teacherId: user.id
                }
              }
            }
          }
        },
        include: {
          enrollment: {
            include: {
              user: true
            }
          },
          lesson: true
        },
        orderBy: { completedAt: "desc" },
        take: 5
      })
    ),
    withRetry(() =>
      prisma.supportTicket.findMany({
        where: {
          assignedToId: user.id
        },
        include: {
          reporter: true
        },
        orderBy: { createdAt: "desc" },
        take: 5
      })
    )
  ]);

  // Aggregate Metrics Server-side
  const totalCourses = courses.length;
  const enrollments = courses.flatMap((c) => c.enrollments);

  // Compute unique students
  const uniqueStudentMap = new Map<string, any>();
  enrollments.forEach((e) => {
    if (!uniqueStudentMap.has(e.userId)) {
      uniqueStudentMap.set(e.userId, {
        id: e.userId,
        name: e.user.name,
        email: e.user.email,
        courseTitle: e.course?.title || "Unknown",
        progressPercent: e.progress?.progressPercent ?? 0,
        joinedAt: e.enrolledAt
      });
    }
  });

  const totalStudents = uniqueStudentMap.size;
  const activeEnrollments = enrollments.filter((e) => e.status === "ACTIVE").length;

  // Average Completion rate across all seats
  const progressList = enrollments.map((e) => e.progress?.progressPercent ?? 0);
  const avgCompletionRate = progressList.length > 0 
    ? Math.round(progressList.reduce((sum, val) => sum + val, 0) / progressList.length) 
    : 0;

  // Generate 6-month Enrollment Trend Chart Data dynamically
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const enrollmentTrendMap = new Map<string, number>();

  // Populate the map for last 6 months
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthName = months[d.getMonth()] + " " + d.getFullYear().toString().slice(-2);
    enrollmentTrendMap.set(monthName, 0);
  }

  enrollments.forEach((e) => {
    const date = new Date(e.enrolledAt);
    const monthName = months[date.getMonth()] + " " + date.getFullYear().toString().slice(-2);
    if (enrollmentTrendMap.has(monthName)) {
      enrollmentTrendMap.set(monthName, (enrollmentTrendMap.get(monthName) || 0) + 1);
    }
  });

  const enrollmentTrend = Array.from(enrollmentTrendMap.entries()).map(([month, count]) => ({
    month,
    enrollments: count
  }));

  // Generate progress completion levels
  let completed = 0;
  let active = 0;
  let unstarted = 0;

  enrollments.forEach((e) => {
    const pct = e.progress?.progressPercent ?? 0;
    if (pct === 100) completed++;
    else if (pct > 0) active++;
    else unstarted++;
  });

  const totalEnrolls = enrollments.length || 1;
  const completionRatio = [
    { name: "Completed (100%)", value: Math.round((completed / totalEnrolls) * 100), color: "#a855f7" },
    { name: "Active (1-99%)", value: Math.round((active / totalEnrolls) * 100), color: "#10b981" },
    { name: "Not Started (0%)", value: Math.round((unstarted / totalEnrolls) * 100), color: "#64748b" }
  ];

  return (
    <TeacherDashboardClient
      teacherName={user.name || "Instructor"}
      stats={{
        totalCourses,
        totalStudents,
        activeEnrollments,
        avgCompletionRate
      }}
      courses={courses}
      students={Array.from(uniqueStudentMap.values())}
      recentActivity={{
        recentEnrollments,
        recentSubmissions,
        recentCompletions,
        recentTickets
      }}
      charts={{
        enrollmentTrend,
        completionRatio
      }}
    />
  );
}