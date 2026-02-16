"use server";

import { InterviewFormStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ensureSlug } from "./utils";
import type {
  InterviewFormInput,
  InterviewFormFilter,
  InterviewOptionInput,
  InterviewQuestionInput,
  InterviewSectionInput,
} from "./types";

const defaultInclude = {
  sections: {
    orderBy: { position: "asc" as const },
    include: {
      questions: {
        orderBy: { position: "asc" as const },
        include: {
          options: {
            orderBy: { position: "asc" as const },
          },
        },
      },
    },
  },
  interviewType: {
    select: { id: true, name: true },
  },
  defaultForType: {
    select: { id: true, name: true },
  },
};

function withPositions<T extends { position?: number }>(
  items: T[] | undefined,
): (T & { position: number })[] {
  if (!items || !items.length) return [];
  return items.map((item, index) => ({
    ...item,
    position: item.position ?? index,
  }));
}

function mapOptions(options?: InterviewOptionInput[]) {
  return withPositions(options).map((option) => ({
    label: option.label,
    value: option.value ?? option.label.toLowerCase().replace(/\s+/g, "-"),
    description: option.description ?? null,
    position: option.position,
  }));
}

function mapQuestions(questions?: InterviewQuestionInput[]) {
  return withPositions(questions).map((question) => ({
    title: question.title,
    description: question.description ?? null,
    helperText: question.helperText ?? null,
    type: question.type,
    required: question.required ?? false,
    position: question.position,
    settings: question.settings ?? null,
    options: {
      create: mapOptions(question.options),
    },
  }));
}

function mapSections(sections?: InterviewSectionInput[]) {
  return withPositions(sections).map((section) => ({
    title: section.title,
    description: section.description ?? null,
    position: section.position,
    questions: {
      create: mapQuestions(section.questions),
    },
  }));
}

export async function listInterviewForms(
  filter: InterviewFormFilter = {},
) {
  const where: Record<string, unknown> = {};

  if (filter.status) {
    where.status = filter.status;
  } else if (!filter.includeDrafts) {
    where.status = InterviewFormStatus.PUBLISHED;
  }

  if (filter.interviewTypeId) {
    where.interviewTypeId = filter.interviewTypeId;
  }

  const forms = await prisma.interviewForm.findMany({
    where,
    orderBy: [
      { status: "asc" },
      { updatedAt: "desc" },
    ],
    include: defaultInclude,
  });

  return forms;
}

export async function getInterviewFormById(id: string) {
  return prisma.interviewForm.findUnique({
    where: { id },
    include: defaultInclude,
  });
}

export async function getInterviewFormBySlug(slug: string) {
  return prisma.interviewForm.findFirst({
    where: { slug },
    include: defaultInclude,
  });
}

export async function createInterviewForm(input: InterviewFormInput) {
  const slug = ensureSlug(input.title, input.slug);

  const form = await prisma.$transaction(async (tx) => {
    let interviewTypeId: string | null = input.interviewTypeId ?? null;

    if (interviewTypeId) {
      const typeExists = await tx.interviewType.findUnique({
        where: { id: interviewTypeId },
        select: { id: true },
      });
      if (!typeExists) {
        interviewTypeId = null;
      }
    }

    const created = await tx.interviewForm.create({
      data: {
        title: input.title,
        description: input.description ?? null,
        slug,
        status: input.status ?? InterviewFormStatus.DRAFT,
        version: input.version ?? 1,
        interviewTypeId,
        metadata: input.metadata ?? null,
        sections: {
          create: mapSections(input.sections),
        },
      },
      include: defaultInclude,
    });

    if (created.interviewTypeId) {
      if (input.setAsDefault) {
        await tx.interviewType.update({
          where: { id: created.interviewTypeId },
          data: {
            defaultFormId: created.id,
          },
        });
      } else {
        await tx.interviewType.updateMany({
          where: {
            id: created.interviewTypeId,
            defaultFormId: created.id,
          },
          data: {
            defaultFormId: null,
          },
        });
      }
    }

    return created;
  });

  return form;
}

export async function updateInterviewForm(id: string, input: InterviewFormInput) {
  return prisma.$transaction(async (tx) => {
    let interviewTypeId: string | null = input.interviewTypeId ?? null;

    if (interviewTypeId) {
      const typeExists = await tx.interviewType.findUnique({
        where: { id: interviewTypeId },
        select: { id: true },
      });
      if (!typeExists) {
        interviewTypeId = null;
      }
    }

    const slug = input.slug ? ensureSlug(input.title, input.slug) : undefined;

    const updated = await tx.interviewForm.update({
      where: { id },
      data: {
        title: input.title,
        description: input.description ?? null,
        slug,
        status: input.status ?? InterviewFormStatus.DRAFT,
        version: input.version ?? 1,
        interviewTypeId,
        metadata: input.metadata ?? null,
      },
      include: defaultInclude,
    });

    if (input.sections) {
      for (const section of input.sections) {
        if (!section.id) continue;
        await tx.interviewSection.delete({
          where: { id: section.id },
        });
      }
    }

    await tx.interviewOption.deleteMany({
      where: {
        question: {
          section: {
            formId: id,
          },
        },
      },
    });

    await tx.interviewQuestion.deleteMany({
      where: {
        section: {
          formId: id,
        },
      },
    });

    await tx.interviewSection.deleteMany({
      where: {
        formId: id,
      },
    });

    const sourceSections = input.sections ?? [];
    const mappedSections = mapSections(sourceSections);
    for (const section of mappedSections) {
      const sourceSection =
        sourceSections.find((s) => s.position === section.position) ??
        sourceSections[section.position] ??
        null;

      const sourceQuestions = sourceSection?.questions ?? [];
      const mappedQuestions = mapQuestions(sourceQuestions);

      const createdSection = await tx.interviewSection.create({
        data: {
          formId: id,
          title: section.title,
          description: section.description ?? null,
          position: section.position,
        },
      });

      for (const question of mappedQuestions) {
        const sourceQuestion =
          sourceQuestions.find((q) => q.position === question.position) ??
          sourceQuestions[question.position] ??
          null;

        const options =
          sourceQuestion?.options?.map((option, optionIndex) => ({
            label: option.label,
            value: option.value ?? option.label.toLowerCase().replace(/\s+/g, "-"),
            description: option.description ?? null,
            position: option.position ?? optionIndex,
          })) ?? [];

        const createdQuestion = await tx.interviewQuestion.create({
          data: {
            sectionId: createdSection.id,
            title: question.title,
            description: question.description ?? null,
            helperText: question.helperText ?? null,
            type: question.type,
            required: question.required ?? false,
            position: question.position,
            settings: question.settings ?? null,
          },
        });

        if (options.length) {
          await tx.interviewOption.createMany({
            data: options.map((option) => ({
              questionId: createdQuestion.id,
              label: option.label,
              value: option.value,
              description: option.description ?? null,
              position: option.position,
            })),
          });
        }
      }
    }

    if (updated.interviewTypeId) {
      if (input.setAsDefault) {
        await tx.interviewType.update({
          where: { id: updated.interviewTypeId },
          data: {
            defaultFormId: updated.id,
          },
        });
      } else {
        await tx.interviewType.updateMany({
          where: {
            id: updated.interviewTypeId,
            defaultFormId: updated.id,
          },
          data: {
            defaultFormId: null,
          },
        });
      }
    }

    return updated;
  });
}

export async function deleteInterviewForm(id: string) {
  return prisma.interviewForm.delete({
    where: { id },
  });
}


