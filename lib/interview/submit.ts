"use server";

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { buildInterviewSchema } from "./schema";
import type { InterviewConfig, InterviewValues } from "./config";
import { getInterviewSessionById } from "./getSession";

interface SubmitInterviewParams {
  sessionId: string;
  config: InterviewConfig;
  values: InterviewValues;
}

export async function submitInterviewForm({
  sessionId,
  config,
  values,
}: SubmitInterviewParams) {
  const schema = buildInterviewSchema(config);
  const parsed = schema.safeParse(values);

  if (!parsed.success) {
    console.error(parsed.error.flatten());
    throw new Error("Data interview tidak valid. Mohon periksa kembali.");
  }

  const session = await getInterviewSessionById(sessionId);
  if (!session) {
    throw new Error("Sesi interview tidak ditemukan.");
  }

  const mapping = config.resultMapping ?? {};
  const data = parsed.data as InterviewValues;

  const grade =
    (mapping.gradeField && typeof data[mapping.gradeField] === "string"
      ? (data[mapping.gradeField] as string)
      : null) ?? null;

  const recommendation =
    (mapping.recommendationField &&
    typeof data[mapping.recommendationField] === "string"
      ? (data[mapping.recommendationField] as string)
      : null) ?? null;

  const notes =
    (mapping.notesField && typeof data[mapping.notesField] === "string"
      ? (data[mapping.notesField] as string)
      : null) ?? null;

  const reviewerId =
    (mapping.reviewerField && typeof data[mapping.reviewerField] === "string"
      ? (data[mapping.reviewerField] as string)
      : null) ?? null;

  const formNumber =
    (mapping.formNumberField &&
      typeof data[mapping.formNumberField] === "string"
        ? (data[mapping.formNumberField] as string)
        : null) ?? null;

  const now = new Date();

  const responseData: Prisma.JsonObject = {};
  for (const key of Object.keys(data)) {
    const value = data[key];
    if (Array.isArray(value)) {
      responseData[key] = value;
    } else {
      responseData[key] = value;
    }
  }

  const result = await prisma.$transaction(async (tx) => {
    const upserted = await tx.interviewResult.upsert({
      where: { sessionId },
      create: {
        sessionId,
        grade,
        recommendation,
        feedback: notes,
        reviewerId,
        reviewedAt: now,
        responseData,
      },
      update: {
        grade,
        recommendation,
        feedback: notes,
        reviewerId,
        reviewedAt: now,
        responseData,
      },
    });

    await tx.interviewSession.update({
      where: { id: sessionId },
      data: {
        status: "REVIEWED",
        completedDate: now,
        notes,
        googleFormId: formNumber ?? undefined,
      },
    });

    return upserted;
  });

  return {
    success: true,
    session: {
      id: session.id,
      status: "REVIEWED",
    },
    resultId: result.id,
  };
}


