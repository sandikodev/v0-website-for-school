"use client";

import {
  InterviewFormStatus,
  InterviewQuestionType,
} from "@prisma/client";

import type {
  EditorForm,
  EditorOption,
  EditorQuestion,
  EditorSection,
  FormSummary,
} from "@/components/dashboard/interview/editor/types";
import type { InterviewFormInput } from "@/lib/interview/types";
import { slugify } from "@/lib/interview/utils";

export function generateId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function createEmptyOption(label = "Opsi 1"): EditorOption {
  return {
    tempId: generateId("opt"),
    label,
    value: label.toLowerCase().replace(/\s+/g, "-"),
    description: null,
  };
}

export function createEmptyQuestion(title = "Pertanyaan baru"): EditorQuestion {
  return {
    tempId: generateId("question"),
    title,
    description: null,
    helperText: null,
    type: InterviewQuestionType.SHORT_TEXT,
    required: false,
    position: 0,
    settings: null,
    options: [],
  };
}

export function createEmptySection(
  index: number,
  title = `Bagian ${index + 1}`,
): EditorSection {
  return {
    tempId: generateId("section"),
    title,
    description: null,
    position: index,
    questions: [createEmptyQuestion()],
  };
}

export function createEmptyForm(): EditorForm {
  const defaultTitle = "Form Interview Baru";
  return {
    title: defaultTitle,
    slug: slugify(defaultTitle),
    description: "",
    status: InterviewFormStatus.DRAFT,
    interviewTypeId: undefined,
    metadata: null,
    setAsDefault: false,
    sections: [createEmptySection(0)],
  };
}

export function isOptionBased(type: InterviewQuestionType) {
  switch (type) {
    case InterviewQuestionType.RADIO:
    case InterviewQuestionType.CHECKBOX:
    case InterviewQuestionType.SELECT:
      return true;
    default:
      return false;
  }
}

export function mapFormToEditor(form: FormSummary): EditorForm {
  return {
    id: form.id,
    title: form.title,
    description: form.description ?? undefined,
    slug: form.slug,
    status: form.status,
    interviewTypeId: form.interviewTypeId ?? undefined,
    metadata: null,
    setAsDefault: Boolean(form.defaultForType),
    sections: form.sections
      .sort((a, b) => a.position - b.position)
      .map((section, sectionIndex) => ({
        tempId: generateId("section"),
        id: section.id,
        title: section.title,
        description: section.description ?? undefined,
        position: sectionIndex,
        questions: section.questions
          .sort((a, b) => a.position - b.position)
          .map((question, questionIndex) => ({
            tempId: generateId("question"),
            id: question.id,
            title: question.title,
            description: question.description ?? undefined,
            helperText: question.helperText ?? undefined,
            type: question.type,
            required: question.required,
            position: questionIndex,
            settings: null,
            options: (question.options ?? [])
              .sort((a, b) => a.position - b.position)
              .map((option, optionIndex) => ({
                tempId: generateId("opt"),
                id: option.id,
                label: option.label,
                value: option.value,
                description: option.description ?? undefined,
                position: optionIndex,
              })),
          })),
      })),
  };
}

export function buildEditorFromTemplate(template: InterviewFormInput): EditorForm {
  const title = template.title ?? "Form Interview Baru";
  const resolvedSlug = slugify(template.slug ?? title);
  const sections = (template.sections ?? []).map((section, sectionIndex) => ({
    tempId: generateId("section"),
    title: section.title ?? `Bagian ${sectionIndex + 1}`,
    description: section.description ?? null,
    position: sectionIndex,
    questions: (section.questions ?? []).map((question, questionIndex) => ({
      tempId: generateId("question"),
      title: question.title ?? `Pertanyaan ${questionIndex + 1}`,
      description: question.description ?? null,
      helperText: question.helperText ?? null,
      type: question.type ?? InterviewQuestionType.SHORT_TEXT,
      required: question.required ?? false,
      position: questionIndex,
      settings: question.settings ?? null,
      options: (question.options ?? []).map((option, optionIndex) => ({
        tempId: generateId("opt"),
        label: option.label ?? `Opsi ${optionIndex + 1}`,
        value: option.value,
        description: option.description ?? null,
        position: optionIndex,
      })),
    })),
  }));

  return {
    title,
    slug: resolvedSlug,
    description: template.description ?? "",
    status: template.status ?? InterviewFormStatus.DRAFT,
    interviewTypeId: template.interviewTypeId ?? undefined,
    metadata: template.metadata ?? null,
    setAsDefault: template.setAsDefault ?? false,
    sections: sections.length ? sections : [createEmptySection(0)],
  };
}

