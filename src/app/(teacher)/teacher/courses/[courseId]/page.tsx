import type { Metadata } from "next";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { makeMetadata } from "@/lib/site";
import { requireRole } from "@/lib/auth";
import { ArrowLeft } from "lucide-react";
import { CourseDashboardClient } from "./course-dashboard-client";
import {
  updateCourseAction,
  toggleCourseStatusAction,
  attachCategoryToCourseAction,
  detachCategoryFromCourseAction,
  assignTeacherAction,
  removeTeacherAction,
  deleteCourseAction
} from "@/lib/courses/actions";

type CourseEditorPageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

export async function generateMetadata({ params }: CourseEditorPageProps): Promise<Metadata> {
  const { courseId } = await params;
  return makeMetadata({
    title: "Course Curriculum Details - Teacher Workspace",
    description: "Curriculum outline details, sections compilation, and interactive lessons setup.",
    path: `/teacher/courses/${courseId}`,
    noIndex: true
  });
}

export const dynamic = "force-dynamic";

export default async function CourseEditorPage({ params }: CourseEditorPageProps) {
  const teacher = await requireRole(["TEACHER"]);
  const { courseId } = await params;

  // Query course by ID, including sections, lessons, teachers, categories, and enrolled student details
  const [course, allCategories, allTeachers, tests, certificateCount] = await Promise.all([
    prisma.course.findUnique({
      where: { id: courseId },
      include: {
        sections: {
          include: {
            lessons: {
              orderBy: { orderIndex: "asc" }
            }
          },
          orderBy: { orderIndex: "asc" }
        },
        enrollments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true
              }
            },
            attempts: {
              include: {
                test: {
                  select: {
                    title: true,
                    attemptLimit: true
                  }
                }
              },
              orderBy: {
                attemptNumber: "asc"
              }
            }
          },
          orderBy: { enrolledAt: "desc" }
        },
        categories: {
          orderBy: { sortOrder: "asc" },
          include: {
            category: true
          }
        },
        teachers: {
          orderBy: { sortOrder: "asc" },
          include: {
            teacher: {
              select: {
                id: true,
                name: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true
              }
            }
          }
        },
        _count: {
          select: { enrollments: true }
        }
      }
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.user.findMany({
      where: { role: { in: ["TEACHER", "ADMIN"] } },
      orderBy: { name: "asc" }
    }),
    prisma.test.findMany({
      where: { courseId },
      include: {
        questions: {
          include: {
            options: true
          },
          orderBy: { orderIndex: "asc" }
        }
      }
    }),
    prisma.certificate.count({
      where: {
        enrollment: {
          courseId
        }
      }
    })
  ]);

  if (!course) {
    notFound();
  }

  // Auth/ownership guard: Verify teacher is assigned to this course
  const isAssigned = course.teachers.some((t) => t.teacher.id === teacher.id);
  if (!isAssigned) {
    redirect("/teacher/dashboard");
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6 min-h-screen bg-[#0a0a0f]">
      {/* Header back-link */}
      <div>
        <Link href="/teacher/courses" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition duration-200 mb-4">
          <ArrowLeft className="h-3 w-3" /> Back to Course Manager
        </Link>
      </div>

      <CourseDashboardClient
        course={course}
        allCategories={allCategories}
        allTeachers={allTeachers}
        tests={tests}
        certificateCount={certificateCount}
        updateAction={updateCourseAction}
        toggleStatusAction={toggleCourseStatusAction}
        attachCategoryAction={attachCategoryToCourseAction}
        detachCategoryAction={detachCategoryFromCourseAction}
        assignTeacherAction={assignTeacherAction}
        removeTeacherAction={removeTeacherAction}
        deleteCourseAction={deleteCourseAction}
      />
    </div>
  );
}