import { EnrollmentStatus, UserRole } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type LearningResource = {
  id: string;
  title: string;
  resourceType: string;
  provider: string;
  url: string;
  mimeType: string | null;
  fileSizeBytes: number | null;
  orderIndex: number;
  isDownloadable: boolean;
};

type LearningLesson = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  orderIndex: number;
  contentType: string;
  isPreview: boolean;
  isPublished: boolean;
  youtubeUrl: string | null;
  r2AssetUrl: string | null;
  thumbnailUrl: string | null;
  transcriptUrl: string | null;
  durationSeconds: number | null;
  resources: LearningResource[];
};

type LearningSection = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  orderIndex: number;
  isPublished: boolean;
  lessons: LearningLesson[];
};

type LearningCourse = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  subtitle: string | null;
  excerpt: string | null;
  coverImageUrl: string | null;
  trailerUrl: string | null;
  level: string;
  language: string;
  priceCents: number;
  currency: string;
  status: string;
  publishedAt: Date | null;
  sections: LearningSection[];
};

function isStaff(role?: UserRole | null) {
  return role === "TEACHER" || role === "ADMIN";
}

function isEnrollmentActive(status?: EnrollmentStatus | null) {
  return status === EnrollmentStatus.ACTIVE || status === EnrollmentStatus.COMPLETED;
}

function flattenLessons(course: LearningCourse) {
  const lessons: Array<{ section: LearningSection; lesson: LearningLesson }> = [];

  for (const section of course.sections) {
    for (const lesson of section.lessons) {
      lessons.push({ section, lesson });
    }
  }

  return lessons;
}

async function getCurrentUser() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  return prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      role: true
    }
  });
}

async function fetchLearningCourseBySlug(slug: string, includeUnpublished = false) {
  if (includeUnpublished) {
    return prisma.course.findFirst({
      where: { slug },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        subtitle: true,
        excerpt: true,
        coverImageUrl: true,
        trailerUrl: true,
        level: true,
        language: true,
        priceCents: true,
        currency: true,
        status: true,
        publishedAt: true,
        sections: {
          orderBy: { orderIndex: "asc" },
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            orderIndex: true,
            isPublished: true,
            lessons: {
              orderBy: { orderIndex: "asc" },
              select: {
                id: true,
                title: true,
                slug: true,
                description: true,
                orderIndex: true,
                contentType: true,
                isPreview: true,
                isPublished: true,
                youtubeUrl: true,
                r2AssetUrl: true,
                thumbnailUrl: true,
                transcriptUrl: true,
                durationSeconds: true,
                resources: {
                  orderBy: { orderIndex: "asc" },
                  select: {
                    id: true,
                    title: true,
                    resourceType: true,
                    provider: true,
                    url: true,
                    mimeType: true,
                    fileSizeBytes: true,
                    orderIndex: true,
                    isDownloadable: true
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  return prisma.course.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      subtitle: true,
      excerpt: true,
      coverImageUrl: true,
      trailerUrl: true,
      level: true,
      language: true,
      priceCents: true,
      currency: true,
      status: true,
      publishedAt: true,
      sections: {
        where: { isPublished: true },
        orderBy: { orderIndex: "asc" },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          orderIndex: true,
          isPublished: true,
          lessons: {
            where: { isPublished: true },
            orderBy: { orderIndex: "asc" },
            select: {
              id: true,
              title: true,
              slug: true,
              description: true,
              orderIndex: true,
              contentType: true,
              isPreview: true,
              isPublished: true,
              youtubeUrl: true,
              r2AssetUrl: true,
              thumbnailUrl: true,
              transcriptUrl: true,
              durationSeconds: true,
              resources: {
                orderBy: { orderIndex: "asc" },
                select: {
                  id: true,
                  title: true,
                  resourceType: true,
                  provider: true,
                  url: true,
                  mimeType: true,
                  fileSizeBytes: true,
                  orderIndex: true,
                  isDownloadable: true
                }
              }
            }
          }
        }
      }
    }
  });
}

export async function getCurrentCourseEnrollment(courseId: string, userId?: string | null) {
  if (!userId) {
    return null;
  }

  return prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId
      }
    },
    include: {
      progress: {
        include: {
          lastLesson: {
            select: {
              id: true,
              title: true,
              slug: true,
              section: {
                select: {
                  id: true,
                  slug: true,
                  course: {
                    select: {
                      slug: true
                    }
                  }
                }
              }
            }
          }
        }
      },
      lessonProgresses: {
        select: {
          lessonId: true,
          isCompleted: true,
          completedAt: true,
          lastViewedAt: true
        }
      }
    }
  });
}

export async function getStudentCourseEnrollments(userId: string) {
  return prisma.enrollment.findMany({
    where: {
      userId,
      status: {
        in: [EnrollmentStatus.ACTIVE, EnrollmentStatus.PAUSED, EnrollmentStatus.COMPLETED]
      }
    },
    orderBy: [{ lastAccessedAt: "desc" }, { enrolledAt: "desc" }],
    include: {
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          subtitle: true,
          excerpt: true,
          coverImageUrl: true,
          level: true,
          language: true,
          priceCents: true,
          currency: true,
          status: true,
          publishedAt: true,
          sections: {
            where: { isPublished: true },
            orderBy: { orderIndex: "asc" },
            select: {
              id: true,
              title: true,
              slug: true,
              orderIndex: true,
              lessons: {
                where: { isPublished: true },
                orderBy: { orderIndex: "asc" },
                select: {
                  id: true,
                  title: true,
                  slug: true,
                  orderIndex: true,
                  isPreview: true
                }
              }
            }
          }
        }
      },
      progress: {
        include: {
          lastLesson: {
            select: {
              id: true,
              title: true,
              slug: true,
              section: {
                select: {
                  id: true,
                  slug: true,
                  course: {
                    select: {
                      slug: true
                    }
                  }
                }
              }
            }
          }
        }
      },
      certificate: true,
      lessonProgresses: true
    }
  });
}

export async function getLearningCourseOverview(courseSlug: string, userId?: string | null) {
  const user = await getCurrentUser();
  const canBypass = isStaff(user?.role);
  const course = await fetchLearningCourseBySlug(courseSlug, canBypass);

  if (!course) {
    return null;
  }

  const enrollment = await getCurrentCourseEnrollment(course.id, userId ?? user?.id ?? null);
  const firstLesson = getFirstLessonFromCourse(course);
  const continueHref = getContinueLessonHref(course, enrollment);

  return {
    course,
    enrollment,
    firstLesson,
    continueHref,
    canBypass,
    isEnrolled: isEnrollmentActive(enrollment?.status)
  };
}

export async function getLessonPlayerBundle(courseSlug: string, lessonSlug: string, userId?: string | null) {
  const user = await getCurrentUser();
  const canBypass = isStaff(user?.role);
  const course = await fetchLearningCourseBySlug(courseSlug, canBypass);

  if (!course) {
    return {
      course: null,
      lesson: null,
      section: null,
      previousLesson: null,
      nextLesson: null,
      canAccess: false,
      canBypass,
      enrollment: null
    };
  }

  const lessonEntries = flattenLessons(course);
  const lessonEntry = lessonEntries.find((entry) => entry.lesson.slug === lessonSlug) ?? null;
  const enrollment = await getCurrentCourseEnrollment(course.id, userId ?? user?.id ?? null);
  const isEnrolled = isEnrollmentActive(enrollment?.status);

  if (!lessonEntry) {
    return {
      course,
      lesson: null,
      section: null,
      previousLesson: null,
      nextLesson: null,
      canAccess: false,
      canBypass,
      enrollment
    };
  }

  const currentIndex = lessonEntries.findIndex((entry) => entry.lesson.id === lessonEntry.lesson.id);
  const previousLesson = currentIndex > 0 ? lessonEntries[currentIndex - 1]?.lesson ?? null : null;
  const nextLesson = currentIndex >= 0 && currentIndex < lessonEntries.length - 1 ? lessonEntries[currentIndex + 1]?.lesson ?? null : null;
  const canAccess = canBypass || lessonEntry.lesson.isPreview || isEnrolled;

  return {
    course,
    lesson: lessonEntry.lesson,
    section: lessonEntry.section,
    previousLesson,
    nextLesson,
    canAccess,
    canBypass,
    enrollment
  };
}

export async function getLessonResourceAccess(courseSlug: string, lessonSlug: string, resourceId: string, userId?: string | null) {
  const bundle = await getLessonPlayerBundle(courseSlug, lessonSlug, userId);

  if (!bundle.course || !bundle.lesson || !bundle.canAccess) {
    return null;
  }

  const resource = bundle.lesson.resources.find((item) => item.id === resourceId) ?? null;

  if (!resource) {
    return null;
  }

  return {
    ...bundle,
    resource
  };
}

export function isPrivilegedLearningRole(role?: UserRole | null) {
  return isStaff(role);
}

export function isActiveEnrollmentStatus(status?: EnrollmentStatus | null) {
  return isEnrollmentActive(status);
}

export function getFirstLessonFromCourse(course: LearningCourse | null) {
  if (!course) {
    return null;
  }

  for (const section of course.sections) {
    if (section.lessons.length) {
      return section.lessons[0] ?? null;
    }
  }

  return null;
}

export function getContinueLessonHref(course: LearningCourse | null, enrollment: Awaited<ReturnType<typeof getCurrentCourseEnrollment>>) {
  if (!course) {
    return null;
  }

  const lastLesson = enrollment?.progress?.lastLesson;
  if (lastLesson?.section?.course?.slug === course.slug) {
    return `/courses/${course.slug}/lessons/${lastLesson.slug}`;
  }

  const firstLesson = getFirstLessonFromCourse(course);
  return firstLesson ? `/courses/${course.slug}/lessons/${firstLesson.slug}` : null;
}
