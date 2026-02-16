import { z } from "zod";
import { InterviewFormStatus, InterviewQuestionType } from "@prisma/client";

export const interviewOptionSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1, "Label opsi wajib diisi"),
  value: z
    .string()
    .optional()
    .transform((val, ctx) => {
      if (val && val.trim().length > 0) {
        return val.trim();
      }
      const generated = ctx.parent?.label
        ? ctx.parent.label.toLowerCase().replace(/\s+/g, "-")
        : undefined;
      return generated ?? null;
    }),
  description: z
    .string()
    .nullish()
    .transform((val) => (val && val.trim().length ? val.trim() : null)),
  position: z.number().int().nonnegative().optional(),
});

export const interviewQuestionSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Pertanyaan wajib diisi"),
  description: z
    .string()
    .nullish()
    .transform((val) => (val && val.trim().length ? val.trim() : null)),
  helperText: z
    .string()
    .nullish()
    .transform((val) => (val && val.trim().length ? val.trim() : null)),
  type: z.nativeEnum(InterviewQuestionType),
  required: z.boolean().default(false),
  position: z.number().int().nonnegative().optional(),
  settings: z
    .record(z.any())
    .nullish()
    .transform((value) => value ?? null),
  options: z.array(interviewOptionSchema).optional(),
});

export const interviewSectionSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Judul section wajib diisi"),
  description: z
    .string()
    .nullish()
    .transform((val) => (val && val.trim().length ? val.trim() : null)),
  position: z.number().int().nonnegative().optional(),
  questions: z.array(interviewQuestionSchema).optional(),
});

export const interviewFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Judul form wajib diisi"),
  description: z
    .string()
    .nullish()
    .transform((val) => (val && val.trim().length ? val.trim() : null)),
  slug: z
    .string()
    .nullish()
    .transform((val) => (val && val.trim().length ? val.trim() : undefined)),
  status: z.nativeEnum(InterviewFormStatus).default(InterviewFormStatus.DRAFT),
  version: z.number().int().positive().optional(),
  interviewTypeId: z
    .string()
    .nullish()
    .transform((val) => (val && val.trim().length ? val.trim() : null)),
  metadata: z
    .record(z.any())
    .nullish()
    .transform((value) => value ?? null),
  sections: z.array(interviewSectionSchema).default([]),
  setAsDefault: z.boolean().optional(),
});

export type InterviewOptionSchema = z.infer<typeof interviewOptionSchema>;
export type InterviewQuestionSchema = z.infer<typeof interviewQuestionSchema>;
export type InterviewSectionSchema = z.infer<typeof interviewSectionSchema>;
export type InterviewFormSchema = z.infer<typeof interviewFormSchema>;


