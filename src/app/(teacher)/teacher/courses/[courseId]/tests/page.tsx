import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { makeMetadata } from "@/lib/site";
import { requireRole } from "@/lib/auth";
import { getTeacherTests } from "@/lib/tests/queries";
import { createTestAction } from "@/lib/tests/actions";
import { prisma } from "@/lib/prisma";
import { ClipboardList, Plus, FileText, CheckCircle2, ChevronRight } from "lucide-react";

type TestsPageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

export async function generateMetadata({ params }: TestsPageProps): Promise<Metadata> {
  const { courseId } = await params;
  return makeMetadata({
    title: `Manage Assessments`,
    description: "Create and manage course quizzes, exams, and practices.",
    path: `/teacher/courses/${courseId}/tests`,
    noIndex: true
  });
}

export const dynamic = "force-dynamic";

export default async function CourseTestsPage({ params }: TestsPageProps) {
  const teacher = await requireRole(["TEACHER"]);
  const { courseId } = await params;

  // Verify course ownership
  const course = await prisma.course.findFirst({
    where: {
      id: courseId,
      teachers: {
        some: { teacherId: teacher.id }
      }
    },
    include: {
      sections: {
        orderBy: { orderIndex: "asc" }
      }
    }
  });

  if (!course) {
    return (
      <section className="py-16 md:py-24">
        <Container>
          <Badge variant="secondary">Course not found</Badge>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-5xl">Course unavailable</h1>
          <Button className="mt-6" asChild>
            <Link href="/teacher/courses">Back to courses</Link>
          </Button>
        </Container>
      </section>
    );
  }

  const tests = await getTeacherTests(courseId, teacher.id) || [];

  return (
    <section className="py-10">
      <Container>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Assessments</Badge>
              <Badge variant="outline">{tests.length} Total</Badge>
            </div>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">{course.title} tests</h1>
            <p className="mt-2 text-muted-foreground">Build quizzes, practice tests, and final exams to validate student learning progress.</p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href={`/teacher/courses/${course.id}/sections`}>Go to course structure</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href={`/teacher/courses/${course.id}`}>Settings</Link>
            </Button>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              Existing Assessments
            </h2>

            {tests.length === 0 ? (
              <Card className="border-dashed bg-muted/20">
                <CardHeader className="text-center py-12">
                  <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <CardTitle className="mt-4">No assessments created</CardTitle>
                  <CardDescription className="max-w-xs mx-auto mt-2">
                    Create your first quiz or exam using the builder on the right to start testing your students.
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : (
              <div className="grid gap-4">
                {tests.map((test) => (
                  <Card key={test.id} className="hover:border-primary/50 transition-all duration-200 group">
                    <CardHeader className="p-5 pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="capitalize">{test.type.toLowerCase()}</Badge>
                            {test.isPublished ? (
                              <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/25">Published</Badge>
                            ) : (
                              <Badge variant="secondary">Draft</Badge>
                            )}
                            {test.section ? (
                              <span className="text-xs text-muted-foreground">
                                in {test.section.title}
                              </span>
                            ) : null}
                          </div>
                          <CardTitle className="text-lg pt-1 group-hover:text-primary transition-colors">
                            {test.title}
                          </CardTitle>
                        </div>
                        <Button asChild size="sm" variant="outline" className="shrink-0">
                          <Link href={`/teacher/courses/${course.id}/tests/${test.id}`} className="flex items-center gap-1">
                            Edit Builder
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-5 pt-0 pb-4 text-sm border-t border-border/40 mt-2 bg-muted/10 flex items-center justify-between gap-4 text-muted-foreground">
                      <div className="flex items-center gap-6">
                        <span className="flex items-center gap-1">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <strong>{test._count.questions}</strong> questions
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                          <strong>{test.passingScore}%</strong> passing
                        </span>
                      </div>
                      <span className="text-xs">
                        {test._count.attempts} student attempts
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" />
                  Create Assessment
                </CardTitle>
                <CardDescription>
                  Setup a new test. After creation, you'll be able to build out your question bank.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form action={createTestAction} className="grid gap-4">
                  <input type="hidden" name="courseId" value={course.id} />
                  
                  <div className="grid gap-1">
                    <label className="text-sm font-medium">Title</label>
                    <Input name="title" placeholder="e.g. Chapter 1 Quiz" required />
                  </div>

                  <div className="grid gap-1">
                    <label className="text-sm font-medium">Description</label>
                    <textarea 
                      name="description" 
                      placeholder="Brief instructions or outline..." 
                      className="min-h-24 rounded-xl border border-input bg-background px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                  </div>

                  <div className="grid gap-2 md:grid-cols-2">
                    <div className="grid gap-1">
                      <label className="text-sm font-medium">Type</label>
                      <select name="type" className="h-11 rounded-xl border border-input bg-background px-4 text-sm">
                        <option value="QUIZ">Quiz</option>
                        <option value="PRACTICE">Practice Test</option>
                        <option value="EXAM">Exam</option>
                      </select>
                    </div>

                    <div className="grid gap-1">
                      <label className="text-sm font-medium">Link to Section (Optional)</label>
                      <select name="sectionId" className="h-11 rounded-xl border border-input bg-background px-4 text-sm">
                        <option value="">Standalone / No Section</option>
                        {course.sections.map((sec) => (
                          <option key={sec.id} value={sec.id}>
                            {sec.orderIndex + 1}. {sec.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <Button type="submit" className="mt-2 w-full">
                    Create & Continue
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  );
}
