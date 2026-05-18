import { prisma } from "@/lib/prisma";

const placeholderDatabaseUrls = new Set([
  "postgresql://postgres:postgres@localhost:5432/e_learning?schema=public",
  "postgresql://postgres:postgres@localhost/e_learning?schema=public"
]);

function shouldSkipDatabaseReads() {
  const databaseUrl = process.env.DATABASE_URL ?? "";
  return placeholderDatabaseUrls.has(databaseUrl);
}

const coursePreviewSelect = {
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
  categories: {
    orderBy: { sortOrder: "asc" as const },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true
        }
      }
    }
  },
  teachers: {
    orderBy: { sortOrder: "asc" as const },
    include: {
      teacher: {
        select: {
          id: true,
          name: true,
          firstName: true,
          lastName: true,
          image: true
        }
      }
    }
  },
  _count: {
    select: {
      sections: true,
      enrollments: true
    }
  }
} as const;

const courseDetailSelect = {
  ...coursePreviewSelect,
  description: true,
  trailerUrl: true,
  durationMinutes: true,
  sections: {
    orderBy: { orderIndex: "asc" as const },
    include: {
      lessons: {
        orderBy: { orderIndex: "asc" as const },
        include: {
          resources: {
            orderBy: { orderIndex: "asc" as const }
          }
        }
      }
    }
  }
} as const;

export async function getPublishedCourseSlugs() {
  if (shouldSkipDatabaseReads()) {
    return [];
  }

  try {
    return await prisma.course.findMany({
      where: { status: "PUBLISHED" },
      select: {
        slug: true,
        updatedAt: true
      },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }]
    });
  } catch {
    return [];
  }
}

export async function getPublishedCourses(categorySlug?: string) {
  if (shouldSkipDatabaseReads()) {
    return [];
  }

  try {
    return await prisma.course.findMany({
      where: {
        status: "PUBLISHED",
        ...(categorySlug
          ? {
              categories: {
                some: {
                  category: {
                    slug: categorySlug
                  }
                }
              }
            }
          : {})
      },
      select: coursePreviewSelect,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }]
    });
  } catch {
    return [];
  }
}

export async function getPublishedCourseBySlug(slug: string) {
  if (shouldSkipDatabaseReads()) {
    return null;
  }

  try {
    return await prisma.course.findFirst({
      where: { slug, status: "PUBLISHED" },
      select: courseDetailSelect
    });
  } catch {
    return null;
  }
}

export async function getCourseCategories() {
  if (shouldSkipDatabaseReads()) {
    return [];
  }

  try {
    return await prisma.category.findMany({
      orderBy: [{ name: "asc" }],
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        _count: {
          select: {
            courses: true
          }
        }
      }
    });
  } catch {
    return [];
  }
}

export async function getTeacherCourses(teacherId: string) {
  if (shouldSkipDatabaseReads()) {
    return [];
  }

  try {
    return await prisma.course.findMany({
      where: {
        teachers: {
          some: {
            teacherId
          }
        }
      },
      select: coursePreviewSelect,
      orderBy: [{ updatedAt: "desc" }]
    });
  } catch {
    return [];
  }
}

export async function getTeacherCourseById(courseId: string, teacherId: string) {
  if (shouldSkipDatabaseReads()) {
    return null;
  }

  try {
    return await prisma.course.findFirst({
      where: {
        id: courseId,
        teachers: {
          some: {
            teacherId
          }
        }
      },
      select: courseDetailSelect
    });
  } catch {
    return null;
  }
}

export async function getTeacherCourseEditor(courseId: string, teacherId: string) {
  if (shouldSkipDatabaseReads()) {
    return null;
  }

  try {
    return await prisma.course.findFirst({
      where: {
        id: courseId,
        teachers: {
          some: {
            teacherId
          }
        }
      },
      include: {
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
        sections: {
          orderBy: { orderIndex: "asc" },
          include: {
            lessons: {
              orderBy: { orderIndex: "asc" },
              include: {
                resources: {
                  orderBy: { orderIndex: "asc" }
                }
              }
            }
          }
        }
      }
    });
  } catch {
    return null;
  }
}