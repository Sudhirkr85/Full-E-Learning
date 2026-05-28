import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { makeMetadata } from "@/lib/site";
import { getCourseCategories } from "@/lib/courses/queries";
import { CourseCreateForm } from "@/components/courses/course-create-form";

export const metadata: Metadata = makeMetadata({
  title: "Create Course - Instructor Workspace",
  description: "Initialize a new course shell with custom slug, category, and metadata settings.",
  path: "/teacher/courses/new",
  noIndex: true
});

export default async function TeacherNewCoursePage() {
  const session = await auth();
  if (!session || (session.user.role !== "TEACHER" && session.user.role !== "ADMIN")) {
    redirect("/login");
  }

  // Load all categories from database
  const categories = await getCourseCategories();

  return (
    <CourseCreateForm 
      categories={categories} 
      backUrl="/teacher/courses" 
    />
  );
}