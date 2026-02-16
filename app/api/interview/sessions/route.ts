import { NextRequest, NextResponse } from "next/server";
import { InterviewStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import {
  ensureDefaultInterviewTypes,
  syncDefaultInterviewForms,
} from "@/lib/interview/typeDefaults";
import { withTenantContext } from "@/lib/api/with-tenant-context";
import { getSchoolIdForTenant } from "@/lib/tenant/tenant-isolation";

const DEFAULT_INCLUDE = {
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

async function ensureSessionsForSubmission(submissionId: string) {
  await prisma.$transaction(async (tx) => {
    await ensureDefaultInterviewTypes(tx);
    await syncDefaultInterviewForms(tx);

    const submission = await tx.formSubmission.findUnique({
      where: { id: submissionId },
      select: { id: true },
    });

    if (!submission) {
      return;
    }

    const existingSessions = await tx.interviewSession.findMany({
      where: { submissionId },
      select: { interviewTypeId: true },
    });
    const existingTypeIds = new Set(
      existingSessions.map((session) => session.interviewTypeId),
    );

    const defaultedTypes = await tx.interviewType.findMany({
      where: {
        defaultFormId: { not: null },
      },
      select: { id: true },
    });

    for (const type of defaultedTypes) {
      if (existingTypeIds.has(type.id)) continue;
      await tx.interviewSession.create({
        data: {
          submissionId,
          interviewTypeId: type.id,
          status: InterviewStatus.PENDING,
        },
      });
    }
  });
}

function mapStatusStats(
  sessions: Array<{ status: InterviewStatus }>,
): Record<string, number> {
  const base = {
    total: sessions.length,
    pending: 0,
    inProgress: 0,
    completed: 0,
    reviewed: 0,
    failed: 0,
    rescheduled: 0,
  };

  sessions.forEach((session) => {
    switch (session.status) {
      case InterviewStatus.PENDING:
        base.pending += 1;
        break;
      case InterviewStatus.IN_PROGRESS:
        base.inProgress += 1;
        break;
      case InterviewStatus.COMPLETED:
        base.completed += 1;
        break;
      case InterviewStatus.REVIEWED:
        base.reviewed += 1;
        break;
      case InterviewStatus.FAILED:
        base.failed += 1;
        break;
      case InterviewStatus.RESCHEDULED:
        base.rescheduled += 1;
        break;
      default:
        break;
    }
  });

  return base;
}

export const GET = withTenantContext(async (request, { tenant }) => {
  try {
    const { searchParams } = request.nextUrl;
    const submissionId = searchParams.get("submissionId");
    const statusParam = searchParams.get("status");
    const interviewTypeId = searchParams.get("interviewTypeId");
    const search = searchParams.get("search");

    // Get tenant's school ID for filtering
    const schoolId = await getSchoolIdForTenant(tenant.id);
    if (!schoolId) {
      return NextResponse.json(
        { success: false, message: "School not found for tenant" },
        { status: 404 },
      );
    }

    if (submissionId) {
      await ensureSessionsForSubmission(submissionId);
    }

    const where: Record<string, unknown> = {
      submission: {
        schoolId, // CRITICAL: Tenant isolation
      },
    };

    if (submissionId) {
      where.submissionId = submissionId;
    }

    if (statusParam && statusParam !== "all") {
      const normalizedStatus = statusParam.toUpperCase() as keyof typeof InterviewStatus;
      if (InterviewStatus[normalizedStatus]) {
        where.status = InterviewStatus[normalizedStatus];
      }
    }

    if (interviewTypeId && interviewTypeId !== "all") {
      where.interviewTypeId = interviewTypeId;
    }

    if (search) {
      where.OR = [
        {
          submission: {
            namaLengkap: {
              contains: search,
            },
          },
        },
        {
          submission: {
            registrationNumber: {
              contains: search.toUpperCase(),
            },
          },
        },
      ];
    }

    const sessions = await prisma.interviewSession.findMany({
      where,
      orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
      include: DEFAULT_INCLUDE,
    });

    const serialized = sessions.map((session) => ({
      id: session.id,
      submissionId: session.submissionId,
      interviewTypeId: session.interviewTypeId,
      status: session.status,
      scheduledDate: session.scheduledDate?.toISOString() ?? null,
      completedDate: session.completedDate?.toISOString() ?? null,
      notes: session.notes,
      createdAt: session.createdAt.toISOString(),
      updatedAt: session.updatedAt.toISOString(),
      submission: session.submission,
      interviewType: {
        id: session.interviewType?.id ?? null,
        name: session.interviewType?.name ?? "Interview",
        googleFormUrl: session.interviewType?.googleFormUrl ?? null,
        defaultForm: session.interviewType?.defaultForm
          ? {
              id: session.interviewType.defaultForm.id,
              slug: session.interviewType.defaultForm.slug,
              title: session.interviewType.defaultForm.title,
            }
          : null,
      },
      result: session.result ?? null,
    }));

    const stats = mapStatusStats(sessions);

    console.log(
      `[Tenant: ${tenant.name}] Fetched ${sessions.length} interview sessions`,
    );

    return NextResponse.json({
      success: true,
      data: {
        sessions: serialized,
        stats,
      },
    });
  } catch (error) {
    console.error("Error fetching interview sessions:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch interview sessions" },
      { status: 500 },
    );
  }
});

export const POST = withTenantContext(async (request, { tenant }) => {
  try {
    const body = await request.json();
    const {
      submissionId,
      interviewTypeId,
      scheduledDate,
      status = InterviewStatus.PENDING,
      notes,
    } = body ?? {};

    if (!submissionId || !interviewTypeId) {
      return NextResponse.json(
        {
          success: false,
          message: "submissionId and interviewTypeId are required",
        },
        { status: 400 },
      );
    }

    // Get tenant's school ID for validation
    const schoolId = await getSchoolIdForTenant(tenant.id);
    if (!schoolId) {
      return NextResponse.json(
        { success: false, message: "School not found for tenant" },
        { status: 404 },
      );
    }

    const [submission, interviewType] = await Promise.all([
      prisma.formSubmission.findFirst({
        where: {
          id: submissionId,
          schoolId, // CRITICAL: Validate submission belongs to tenant
        },
        select: { id: true, registrationNumber: true, namaLengkap: true },
      }),
      prisma.interviewType.findUnique({
        where: { id: interviewTypeId },
        select: {
          id: true,
          name: true,
          googleFormUrl: true,
          defaultForm: {
            select: { id: true, slug: true, title: true },
          },
        },
      }),
    ]);

    if (!submission) {
      return NextResponse.json(
        { success: false, message: "Submission not found or access denied" },
        { status: 404 },
      );
    }

    if (!interviewType) {
      return NextResponse.json(
        { success: false, message: "Interview type not found" },
        { status: 404 },
      );
    }

    const session = await prisma.interviewSession.create({
      data: {
        submissionId,
        interviewTypeId,
        status,
        scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
        notes: notes ?? null,
      },
      include: DEFAULT_INCLUDE,
    });

    console.log(
      `[Tenant: ${tenant.name}] Created interview session for submission ${submissionId}`,
    );

    return NextResponse.json({
      success: true,
      data: {
        id: session.id,
        submissionId: session.submissionId,
        interviewTypeId: session.interviewTypeId,
        status: session.status,
        scheduledDate: session.scheduledDate?.toISOString() ?? null,
        completedDate: session.completedDate?.toISOString() ?? null,
        notes: session.notes,
        createdAt: session.createdAt.toISOString(),
        updatedAt: session.updatedAt.toISOString(),
        submission,
        interviewType,
        result: session.result ?? null,
      },
    });
  } catch (error) {
    console.error("Error creating interview session:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create interview session" },
      { status: 500 },
    );
  }
});
