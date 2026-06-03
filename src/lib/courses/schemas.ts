import { AssetProvider, CourseLevel, CourseStatus, LessonContentType, ResourceType } from "@prisma/client";
import { z } from "zod";

const optionalUrl = z.preprocess(
  (value) => (typeof value === "string" && value.trim() ? value.trim() : undefined),
  z.string().url().optional()
);

const optionalText = z.preprocess(
  (value) => (typeof value === "string" ? value.trim() : undefined),
  z.string().max(5000).optional()
);

const optionalString = z.preprocess(
  (value) => (typeof value === "string" ? value.trim() : undefined),
  z.string().max(500).optional()
);

export const courseCoreSchema = z.object({
  title: z.string().trim().min(3).max(120),
  subtitle: optionalString,
  description: z.string().trim().min(20).max(5000),
  excerpt: z.preprocess((value) => (typeof value === "string" ? value.trim() : undefined), z.string().max(280).optional()),
  level: z.nativeEnum(CourseLevel),
  language: z.string().trim().min(2).max(12),
  priceCents: z.coerce.number().int().min(0).max(1_000_000),
  currency: z.string().trim().min(3).max(3).transform((value) => value.toUpperCase()),
  coverImageUrl: optionalUrl,
  trailerUrl: optionalUrl,
  categoryNames: optionalString,
  teacherEmails: optionalString
});

export const categoryFormSchema = z.object({
  name: z.string().trim().min(2).max(80),
  description: optionalText
});

export const sectionFormSchema = z.object({
  courseId: z.string().uuid(),
  sectionId: z.string().uuid().optional(),
  title: z.string().trim().min(3).max(120),
  description: optionalText,
  orderIndex: z.coerce.number().int().min(0).max(1000).optional()
});

export const lessonFormSchema = z
  .object({
    courseId: z.string().uuid(),
    sectionId: z.string().uuid(),
    lessonId: z.string().uuid().optional(),
    title: z.string().trim().min(3).max(120),
    description: optionalText,
    contentType: z.nativeEnum(LessonContentType),
    orderIndex: z.coerce.number().int().min(0).max(1000).optional(),
    youtubeUrl: optionalUrl,
    r2AssetUrl: optionalUrl,
    thumbnailUrl: optionalUrl,
    transcriptUrl: optionalUrl,
    durationSeconds: z.coerce.number().int().min(0).max(100_000).optional(),
    isPreview: z.coerce.boolean().optional(),
    isPublished: z.coerce.boolean().optional(),
    scheduledAt: z.string().optional()
  })
  .superRefine((value, ctx) => {
    if (value.contentType === "VIDEO" && !value.youtubeUrl) {
      ctx.addIssue({ code: "custom", path: ["youtubeUrl"], message: "YouTube URL is required for video lessons." });
    }

    if (value.contentType === "LIVE") {
      if (!value.youtubeUrl) {
        ctx.addIssue({ code: "custom", path: ["youtubeUrl"], message: "YouTube Live URL is required for live classes." });
      }
      if (!value.scheduledAt || isNaN(Date.parse(value.scheduledAt))) {
        ctx.addIssue({ code: "custom", path: ["scheduledAt"], message: "A valid scheduled date and time is required for live classes." });
      }
    }

    if (value.contentType === "RESOURCE" && !value.r2AssetUrl) {
      ctx.addIssue({ code: "custom", path: ["r2AssetUrl"], message: "Cloudflare R2 URL is required for resource lessons." });
    }
  });

export const resourceFormSchema = z
  .object({
    lessonId: z.string().uuid(),
    resourceId: z.string().uuid().optional(),
    title: z.string().trim().min(3).max(120),
    resourceType: z.nativeEnum(ResourceType),
    provider: z.nativeEnum(AssetProvider),
    url: optionalUrl,
    mimeType: optionalString,
    fileSizeBytes: z.coerce.number().int().min(0).max(100_000_000).optional(),
    orderIndex: z.coerce.number().int().min(0).max(1000).optional(),
    isDownloadable: z.coerce.boolean().optional()
  })
  .superRefine((value, ctx) => {
    if ((value.resourceType === "VIDEO" || value.resourceType === "LINK") && value.provider !== AssetProvider.YOUTUBE) {
      ctx.addIssue({ code: "custom", path: ["provider"], message: "Video and link resources should use YouTube provider only." });
    }

    if ((value.resourceType === "PDF" || value.resourceType === "IMAGE") && value.provider !== AssetProvider.CLOUDFLARE_R2) {
      ctx.addIssue({ code: "custom", path: ["provider"], message: "PDF and image resources should use Cloudflare R2 provider only." });
    }
  });

export const courseTeacherFormSchema = z.object({
  courseId: z.string().uuid(),
  teacherEmail: z.string().trim().email()
});

export const courseStatusFormSchema = z.object({
  courseId: z.string().uuid(),
  status: z.nativeEnum(CourseStatus)
});

export const courseDeleteSchema = z.object({
  courseId: z.string().uuid()
});

export const categoryAttachSchema = z.object({
  courseId: z.string().uuid(),
  categoryName: z.string().trim().min(2).max(80)
});

export const categoryDeleteSchema = z.object({
  categoryId: z.string().uuid()
});