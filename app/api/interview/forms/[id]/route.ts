import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import {
  deleteInterviewForm,
  getInterviewFormById,
  updateInterviewForm,
} from "@/lib/interview/form-service";
import { interviewFormSchema } from "@/lib/interview/validation";
import { withOptionalTenantContext } from "@/lib/api/with-tenant-context";

interface RouteContext {
  params: {
    id: string;
  };
}

// Interview forms are global/shared - optional tenant context
export const GET = withOptionalTenantContext<{ id: string }>(
  async (_request, { tenant, params }) => {
    try {
      const id = params?.id;
      if (!id) {
        return NextResponse.json(
          { success: false, message: "Form ID is required" },
          { status: 400 },
        );
      }

      const form = await getInterviewFormById(id);
      if (!form) {
        return NextResponse.json(
          { success: false, message: "Form interview tidak ditemukan" },
          { status: 404 },
        );
      }

      console.log(
        tenant
          ? `[Tenant: ${tenant.name}] Fetched interview form: ${form.title}`
          : `[Platform Admin] Fetched interview form: ${form.title}`,
      );

      return NextResponse.json({ success: true, data: form });
    } catch (error) {
      console.error("Failed to fetch interview form:", error);
      return NextResponse.json(
        {
          success: false,
          message: "Gagal memuat form interview",
        },
        { status: 500 },
      );
    }
  },
);

export const PUT = withOptionalTenantContext<{ id: string }>(
  async (request, { tenant, params }) => {
    try {
      const id = params?.id;
      if (!id) {
        return NextResponse.json(
          { success: false, message: "Form ID is required" },
          { status: 400 },
        );
      }

      const body = await request.json();
      const parsed = interviewFormSchema.parse(body);

      const form = await updateInterviewForm(id, parsed);

      console.log(
        tenant
          ? `[Tenant: ${tenant.name}] Updated interview form: ${form.title}`
          : `[Platform Admin] Updated interview form: ${form.title}`,
      );

      return NextResponse.json({ success: true, data: form });
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

      console.error("Failed to update interview form:", error);
      return NextResponse.json(
        {
          success: false,
          message: "Gagal memperbarui form interview",
        },
        { status: 500 },
      );
    }
  },
);

export const DELETE = withOptionalTenantContext<{ id: string }>(
  async (_request, { tenant, params }) => {
    try {
      const id = params?.id;
      if (!id) {
        return NextResponse.json(
          { success: false, message: "Form ID is required" },
          { status: 400 },
        );
      }

      await deleteInterviewForm(id);

      console.log(
        tenant
          ? `[Tenant: ${tenant.name}] Deleted interview form ${id}`
          : `[Platform Admin] Deleted interview form ${id}`,
      );

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Failed to delete interview form:", error);
      return NextResponse.json(
        {
          success: false,
          message: "Gagal menghapus form interview",
        },
        { status: 500 },
      );
    }
  },
);


