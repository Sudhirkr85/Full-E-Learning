import { z } from "zod";

const httpsUrl = z
  .string()
  .trim()
  .refine((val) => val.startsWith("https://"), {
    message: "URL must begin with https://",
  });

export const updateLinkSchema = z.object({
  label: z.string().trim().min(1, "Link label is required").max(100),
  url: httpsUrl,
  kind: z.enum(["official", "apply", "download", "notification", "other"]),
});

export const importantDateSchema = z.object({
  label: z.string().trim().min(1, "Date label is required").max(100),
  value: z.string().trim().min(1, "Date value is required").max(100),
});

export const faqItemSchema = z.object({
  question: z.string().trim().min(1, "Question is required").max(300),
  answer: z.string().trim().min(1, "Answer is required").max(2000),
});

export const sourceItemSchema = z.object({
  label: z.string().trim().min(1, "Source label is required").max(100),
  url: httpsUrl,
});

export const updatePostSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(3, "Slug must be at least 3 characters")
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
  title: z.string().trim().min(5, "Title must be at least 5 characters").max(200),
  summary: z.string().trim().min(10, "Summary must be at least 10 characters").max(500),
  body: z.string().trim().min(20, "Body must be at least 20 characters").max(50000),
  type: z.enum([
    "ADMIT_CARD",
    "APPLY",
    "RESULT",
    "ANSWER_KEY",
    "SYLLABUS",
    "GUIDE",
    "NEWS",
  ]),
  exam: z.string().trim().min(2).max(50).default("NMMS"),
  state: z.string().trim().max(50).optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "EXPIRED"]).default("DRAFT"),
  links: z.array(updateLinkSchema).max(20).default([]),
  importantDates: z.array(importantDateSchema).max(20).default([]),
  faqs: z.array(faqItemSchema).max(20).default([]),
  sources: z.array(sourceItemSchema).max(20).default([]),
  seoTitle: z.string().trim().max(200).optional().nullable(),
  seoDescription: z.string().trim().max(500).optional().nullable(),
  showAds: z.boolean().default(true),
  publishedAt: z.union([z.string().datetime(), z.date()]).optional().nullable(),
});

export type UpdatePostInput = z.infer<typeof updatePostSchema>;
