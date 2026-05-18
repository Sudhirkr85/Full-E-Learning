import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { makeMetadata } from "@/lib/site";
import { requireRole } from "@/lib/auth";
import { getTeacherCourseEditor } from "@/lib/courses/queries";
import {
  createLessonAction,
  createLessonResourceAction,
  createSectionAction,
  deleteLessonAction,
  deleteLessonResourceAction,
  deleteSectionAction,
  updateLessonAction,
  updateLessonResourceAction,
  updateSectionAction
} from "@/lib/courses/actions";

type SectionsPageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

export async function generateMetadata({ params }: SectionsPageProps): Promise<Metadata> {
  const { courseId } = await params;
  return makeMetadata({
    title: `Manage Sections ${courseId}`,
    description: "Course sections and lesson management.",
    path: `/teacher/courses/${courseId}/sections`,
    noIndex: true
  });
}

export const dynamic = "force-dynamic";

export default async function CourseSectionsPage({ params }: SectionsPageProps) {
  const teacher = await requireRole(["TEACHER"]);
  const { courseId } = await params;
  const course = await getTeacherCourseEditor(courseId, teacher.id);

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

  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <Badge variant="secondary">Sections</Badge>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-5xl">{course.title} structure</h1>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">Manage modules, lessons, and lesson resources in ordered groups.</p>
          </div>
          <Button asChild variant="outline">
            <Link href={`/teacher/courses/${course.id}`}>Back to course settings</Link>
          </Button>
        </div>

        <Card className="mt-10 max-w-2xl">
          <CardHeader>
            <CardTitle>Create section</CardTitle>
            <CardDescription>Sections are ordered within the course and act as containers for lessons.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createSectionAction} className="grid gap-4">
              <input type="hidden" name="courseId" value={course.id} />
              <Input name="title" placeholder="Section title" required />
              <Input name="description" placeholder="Section description" />
              <Input name="orderIndex" type="number" min="0" step="1" placeholder="Order index" />
              <Button type="submit">Create section</Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-10 space-y-8">
          {course.sections.map((section) => (
            <Card key={section.id}>
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <CardTitle>
                    {section.orderIndex + 1}. {section.title}
                  </CardTitle>
                  <Badge variant="outline">{section.lessons.length} lessons</Badge>
                </div>
                <CardDescription>{section.description ?? "Section description not set."}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <form action={updateSectionAction} className="grid gap-4 rounded-2xl border border-border p-4">
                  <input type="hidden" name="courseId" value={course.id} />
                  <input type="hidden" name="sectionId" value={section.id} />
                  <Input name="title" defaultValue={section.title} required />
                  <Input name="description" defaultValue={section.description ?? ""} placeholder="Description" />
                  <Input name="orderIndex" type="number" min="0" step="1" defaultValue={section.orderIndex} />
                  <Button type="submit" variant="outline">
                    Save section
                  </Button>
                </form>

                <form action={deleteSectionAction}>
                  <input type="hidden" name="sectionId" value={section.id} />
                  <Button type="submit" variant="destructive" size="sm">
                    Delete section
                  </Button>
                </form>

                <div className="rounded-2xl border border-border p-4">
                  <h3 className="font-medium">Add lesson</h3>
                  <form action={createLessonAction} className="mt-4 grid gap-4">
                    <input type="hidden" name="courseId" value={course.id} />
                    <input type="hidden" name="sectionId" value={section.id} />
                    <div className="grid gap-2 md:grid-cols-2">
                      <Input name="title" placeholder="Lesson title" required />
                      <select name="contentType" defaultValue="VIDEO" className="h-11 rounded-xl border border-input bg-background px-4 text-sm">
                        <option value="VIDEO">Video</option>
                        <option value="ARTICLE">Article</option>
                        <option value="RESOURCE">Resource</option>
                        <option value="QUIZ">Quiz</option>
                      </select>
                    </div>
                    <Input name="description" placeholder="Lesson description" />
                    <div className="grid gap-2 md:grid-cols-2">
                      <Input name="youtubeUrl" placeholder="YouTube URL" />
                      <Input name="r2AssetUrl" placeholder="Cloudflare R2 URL" />
                    </div>
                    <div className="grid gap-2 md:grid-cols-4">
                      <Input name="thumbnailUrl" placeholder="Thumbnail URL" />
                      <Input name="transcriptUrl" placeholder="Transcript URL" />
                      <Input name="durationSeconds" type="number" min="0" step="1" placeholder="Duration seconds" />
                      <Input name="orderIndex" type="number" min="0" step="1" placeholder="Order index" />
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <label className="flex items-center gap-2"><input type="checkbox" name="isPreview" value="true" /> Preview lesson</label>
                      <label className="flex items-center gap-2"><input type="checkbox" name="isPublished" value="true" defaultChecked /> Published</label>
                    </div>
                    <Button type="submit">Create lesson</Button>
                  </form>
                </div>

                <div className="space-y-6">
                  {section.lessons.map((lesson) => (
                    <Card key={lesson.id} className="border-border/70">
                      <CardHeader>
                        <div className="flex items-center justify-between gap-4">
                          <CardTitle>
                            {lesson.orderIndex + 1}. {lesson.title}
                          </CardTitle>
                          <Badge variant="secondary">{lesson.contentType.toLowerCase()}</Badge>
                        </div>
                        <CardDescription>{lesson.description ?? "Lesson description not set."}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <form action={updateLessonAction} className="grid gap-4 rounded-2xl border border-border p-4">
                          <input type="hidden" name="courseId" value={course.id} />
                          <input type="hidden" name="sectionId" value={section.id} />
                          <input type="hidden" name="lessonId" value={lesson.id} />
                          <div className="grid gap-2 md:grid-cols-2">
                            <Input name="title" defaultValue={lesson.title} required />
                            <select name="contentType" defaultValue={lesson.contentType} className="h-11 rounded-xl border border-input bg-background px-4 text-sm">
                              <option value="VIDEO">Video</option>
                              <option value="ARTICLE">Article</option>
                              <option value="RESOURCE">Resource</option>
                              <option value="QUIZ">Quiz</option>
                            </select>
                          </div>
                          <Input name="description" defaultValue={lesson.description ?? ""} placeholder="Description" />
                          <div className="grid gap-2 md:grid-cols-2">
                            <Input name="youtubeUrl" defaultValue={lesson.youtubeUrl ?? ""} placeholder="YouTube URL" />
                            <Input name="r2AssetUrl" defaultValue={lesson.r2AssetUrl ?? ""} placeholder="Cloudflare R2 URL" />
                          </div>
                          <div className="grid gap-2 md:grid-cols-4">
                            <Input name="thumbnailUrl" defaultValue={lesson.thumbnailUrl ?? ""} placeholder="Thumbnail URL" />
                            <Input name="transcriptUrl" defaultValue={lesson.transcriptUrl ?? ""} placeholder="Transcript URL" />
                            <Input name="durationSeconds" type="number" min="0" step="1" defaultValue={lesson.durationSeconds ?? 0} />
                            <Input name="orderIndex" type="number" min="0" step="1" defaultValue={lesson.orderIndex} />
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm">
                            <label className="flex items-center gap-2"><input type="checkbox" name="isPreview" value="true" defaultChecked={lesson.isPreview} /> Preview lesson</label>
                            <label className="flex items-center gap-2"><input type="checkbox" name="isPublished" value="true" defaultChecked={lesson.isPublished} /> Published</label>
                          </div>
                          <Button type="submit" variant="outline">
                            Save lesson
                          </Button>
                        </form>

                        <form action={deleteLessonAction}>
                          <input type="hidden" name="lessonId" value={lesson.id} />
                          <Button type="submit" variant="destructive" size="sm">
                            Delete lesson
                          </Button>
                        </form>

                        <div className="rounded-2xl border border-border p-4">
                          <h4 className="font-medium">Add resource</h4>
                          <form action={createLessonResourceAction} className="mt-4 grid gap-4">
                            <input type="hidden" name="lessonId" value={lesson.id} />
                            <Input name="title" placeholder="Resource title" required />
                            <div className="grid gap-2 md:grid-cols-3">
                              <select name="resourceType" defaultValue="PDF" className="h-11 rounded-xl border border-input bg-background px-4 text-sm">
                                <option value="VIDEO">Video</option>
                                <option value="PDF">PDF</option>
                                <option value="IMAGE">Image</option>
                                <option value="FILE">File</option>
                                <option value="LINK">Link</option>
                              </select>
                              <select name="provider" defaultValue="CLOUDFLARE_R2" className="h-11 rounded-xl border border-input bg-background px-4 text-sm">
                                <option value="YOUTUBE">YouTube</option>
                                <option value="CLOUDFLARE_R2">Cloudflare R2</option>
                                <option value="EXTERNAL">External</option>
                              </select>
                              <Input name="orderIndex" type="number" min="0" step="1" placeholder="Order index" />
                            </div>
                            <Input name="url" placeholder="Resource URL" required />
                            <div className="grid gap-2 md:grid-cols-3">
                              <Input name="mimeType" placeholder="Mime type" />
                              <Input name="fileSizeBytes" type="number" min="0" step="1" placeholder="File size bytes" />
                              <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isDownloadable" value="true" defaultChecked /> Downloadable</label>
                            </div>
                            <Button type="submit">Create resource</Button>
                          </form>
                        </div>

                        <div className="space-y-4">
                          {lesson.resources.map((resource) => (
                            <Card key={resource.id} className="border-border/60">
                              <CardHeader>
                                <div className="flex items-center justify-between gap-4">
                                  <CardTitle className="text-base">
                                    {resource.orderIndex + 1}. {resource.title}
                                  </CardTitle>
                                  <Badge variant="outline">{resource.resourceType.toLowerCase()}</Badge>
                                </div>
                                <CardDescription>{resource.provider.toLowerCase()}</CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <form action={updateLessonResourceAction} className="grid gap-4 rounded-2xl border border-border p-4">
                                  <input type="hidden" name="lessonId" value={lesson.id} />
                                  <input type="hidden" name="resourceId" value={resource.id} />
                                  <Input name="title" defaultValue={resource.title} required />
                                  <div className="grid gap-2 md:grid-cols-3">
                                    <select name="resourceType" defaultValue={resource.resourceType} className="h-11 rounded-xl border border-input bg-background px-4 text-sm">
                                      <option value="VIDEO">Video</option>
                                      <option value="PDF">PDF</option>
                                      <option value="IMAGE">Image</option>
                                      <option value="FILE">File</option>
                                      <option value="LINK">Link</option>
                                    </select>
                                    <select name="provider" defaultValue={resource.provider} className="h-11 rounded-xl border border-input bg-background px-4 text-sm">
                                      <option value="YOUTUBE">YouTube</option>
                                      <option value="CLOUDFLARE_R2">Cloudflare R2</option>
                                      <option value="EXTERNAL">External</option>
                                    </select>
                                    <Input name="orderIndex" type="number" min="0" step="1" defaultValue={resource.orderIndex} />
                                  </div>
                                  <Input name="url" defaultValue={resource.url} required />
                                  <div className="grid gap-2 md:grid-cols-3">
                                    <Input name="mimeType" defaultValue={resource.mimeType ?? ""} placeholder="Mime type" />
                                    <Input name="fileSizeBytes" type="number" min="0" step="1" defaultValue={resource.fileSizeBytes ?? 0} />
                                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isDownloadable" value="true" defaultChecked={resource.isDownloadable} /> Downloadable</label>
                                  </div>
                                  <Button type="submit" variant="outline" size="sm">
                                    Save resource
                                  </Button>
                                </form>

                                <form action={deleteLessonResourceAction}>
                                  <input type="hidden" name="lessonId" value={lesson.id} />
                                  <input type="hidden" name="resourceId" value={resource.id} />
                                  <Button type="submit" variant="destructive" size="sm">
                                    Delete resource
                                  </Button>
                                </form>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}