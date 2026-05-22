import { z } from "zod";
import { QuestionType, TestType } from "@prisma/client";

export const testSettingsSchema = z.object({
  courseId: z.string().uuid("Invalid course ID"),
  sectionId: z.string().uuid("Invalid section ID").nullable().optional(),
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().optional().nullable(),
  type: z.nativeEnum(TestType).default(TestType.QUIZ),
  passingScore: z.coerce.number().int().min(0).max(100).default(70),
  timeLimitMinutes: z.coerce.number().int().min(1).nullable().optional(),
  attemptLimit: z.coerce.number().int().min(1).nullable().optional(),
  shuffleQuestions: z.coerce.boolean().default(false),
  isPublished: z.coerce.boolean().default(false),
});

export const optionSchema = z.object({
  id: z.string().uuid().optional(),
  label: z.string().min(1, "Option label is required"),
  value: z.string().optional().nullable(),
  isCorrect: z.coerce.boolean().default(false),
  orderIndex: z.coerce.number().int().min(0),
  explanation: z.string().optional().nullable(),
});

export const questionSchema = z.object({
  testId: z.string().uuid("Invalid test ID"),
  prompt: z.string().min(1, "Question prompt is required"),
  explanation: z.string().optional().nullable(),
  kind: z.nativeEnum(QuestionType).default(QuestionType.SINGLE_CHOICE),
  orderIndex: z.coerce.number().int().min(0).default(0),
  points: z.coerce.number().int().min(1).default(1),
  options: z.array(optionSchema).min(1, "At least one option is required"),
});
