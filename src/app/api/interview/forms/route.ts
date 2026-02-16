import { NextRequest, NextResponse } from "next/server";
import { InterviewFormStatus } from "@prisma/client";
import { ZodError } from "zod";
import {
  createInterviewForm,
  listInterviewForms,
} from "@/lib/interview/form-service";
import { interviewFormSchema } from "@/lib/interview/validation";
import { withOptionalTenantContext } from "@/lib/api/with-tenant-context";

// Interview forms are global/shared across tenants
// They are templates that can be used by any school
// Tenant context is optional - platform admin can manage all forms
export const GET = withOptionalTenantContext(async (request, { tenant }) => {
  try {
    const { searchParams } = request.nextUrl;
    const statusParam = searchParams.get("status");
    const interviewTypeId = searchParams.get("interviewTypeId");
    const includeDrafts = searchParams.get("includeDrafts") === "true";

    const status = statusParam
      ? (statusParam.toUpperCase() as keyof typeof InterviewFormStatus)
      : undefined;

    const forms = await listInterviewForms({
      status: status ? InterviewFormStatus[status] : undefined,
      interviewTypeId: interviewTypeId ?? undefined,
      includeDrafts,
    });

    console.log(
      tenant
        ? `[Tenant: ${tenant.name}] Listed ${forms.length} interview forms`
        : `[Platform Admin] Listed ${forms.length} interview forms`,
    );

    return NextResponse.json({
      success: true,
      data: forms,
    });
  } catch (error) {
    console.error("Failed to list interview forms:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal memuat daftar form interview",
      },
      { status: 500 },
    );
  }
});

export const POST = withOptionalTenantContext(async (request, { tenant }) => {
  try {
    const body = await request.json();
    const parsed = interviewFormSchema.parse(body);

    const form = await createInterviewForm(parsed);

    console.log(
      tenant
        ? `[Tenant: ${tenant.name}] Created interview form: ${form.title}`
        : `[Platform Admin] Created interview form: ${form.title}`,
    );

    return NextResponse.json(
      {
        success: true,
        data: form,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Data form interview tidak valid",
          issues: error.issues,
        },
        { status: 422 },
      );
    }

    console.error("Failed to create interview form:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal membuat form interview",
      },
      { status: 500 },
    );
  }
});


