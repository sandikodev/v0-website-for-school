import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { withTenantContext } from "@/lib/api/with-tenant-context";
import { getSchoolIdForTenant } from "@/lib/tenant/tenant-isolation";

// PUT update application status
export const PUT = withTenantContext<{ id: string }>(
  async (request, { tenant, params }) => {
    try {
      const id = params?.id;
      if (!id) {
        return NextResponse.json(
          { success: false, message: "Application ID required" },
          { status: 400 }
        );
      }

      // Get school for this tenant
      const schoolId = await getSchoolIdForTenant(tenant.id);

      if (!schoolId) {
        return NextResponse.json(
          {
            success: false,
            message: "School not found for this tenant",
          },
          { status: 404 }
        );
      }

      // Validate application belongs to tenant's school
      const existingApplication = await prisma.application.findFirst({
        where: {
          id,
          schoolId,
        },
      });

      if (!existingApplication) {
        return NextResponse.json(
          {
            success: false,
            message: "Application not found or access denied",
          },
          { status: 404 }
        );
      }

      const body = await request.json();

      const application = await prisma.application.update({
        where: { id },
        data: {
          status: body.status,
          notes: body.notes,
        },
      });

      console.log(
        "✅ Application updated:",
        application.id,
        "- Status:",
        application.status
      );

      return NextResponse.json({
        success: true,
        data: application,
        message: "Application status updated successfully",
      });
    } catch (error) {
      console.error("❌ Error updating application:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Failed to update application",
        },
        { status: 500 }
      );
    }
  }
);
