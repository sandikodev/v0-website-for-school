import { InterviewStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import {
  ensureDefaultInterviewTypes,
  syncDefaultInterviewForms,
} from "@/lib/interview/typeDefaults";

const defaultInclude = {
  submission: {
    select: {
      id: true,
      registrationNumber: true,
      namaLengkap: true,
    },
  },
  interviewType: {
    select: {
      id: true,
      name: true,
      googleFormUrl: true,
      defaultForm: {
        select: {
          id: true,
          slug: true,
          title: true,
        },
      },
    },
  },
  result: {
    select: {
      id: true,
      score: true,
      grade: true,
      feedback: true,
      reviewedAt: true,
    },
  },
} as const;

export type InterviewSessionFilter = {
  submissionId?: string;
  status?: InterviewStatus;
  interviewTypeId?: string;
  search?: string;
};

export async function listInterviewSessions(
  filter: InterviewSessionFilter = {},
) {
  await ensureDefaultInterviewTypes();
  await syncDefaultInterviewForms();

  const where: Record<string, unknown> = {};

  if (filter.submissionId) {
    where.submissionId = filter.submissionId;
  }

  if (filter.status) {
    where.status = filter.status;
  }

  if (filter.interviewTypeId) {
    where.interviewTypeId = filter.interviewTypeId;
  }

  if (filter.search) {
    where.OR = [
      {
        submission: {
          namaLengkap: {
            contains: filter.search,
          },
        },
      },
      {
        submission: {
          registrationNumber: {
            contains: filter.search.toUpperCase(),
          },
        },
      },
    ];
  }

  const sessions = await prisma.interviewSession.findMany({
    where,
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
    include: defaultInclude,
  });

  return sessions.map((session) => ({
    id: session.id,
    submissionId: session.submissionId,
    interviewTypeId: session.interviewTypeId,
    status: session.status,
    scheduledDate: session.scheduledDate?.toISOString() ?? null,
    completedDate: session.completedDate?.toISOString() ?? null,
    notes: session.notes ?? null,
    createdAt: session.createdAt.toISOString(),
    updatedAt: session.updatedAt.toISOString(),
    submission: session.submission,
    interviewType: session.interviewType,
    result: session.result,
  }));
}

