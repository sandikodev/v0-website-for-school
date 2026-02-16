import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { withTenantContext } from "@/lib/api/with-tenant-context";
import { validateSchoolBelongsToTenant } from "@/lib/tenant/tenant-isolation";

// PUT update school
export const PUT = withTenantContext<{ id: string }>(
  async (request, { tenant, params }) => {
    try {
      const id = params?.id;
      if (!id) {
        return NextResponse.json(
          { success: false, message: "School ID required" },
          { status: 400 }
        );
      }

      // Validate school belongs to tenant
      const belongsToTenant = await validateSchoolBelongsToTenant(
        id,
        tenant.id
      );

      if (!belongsToTenant) {
        return NextResponse.json(
          {
            success: false,
            message: "School not found or access denied",
          },
          { status: 404 }
        );
      }

      const body = await request.json();

      const school = await prisma.school.update({
        where: { id },
        data: {
          name: body.name,
          description: body.description,
          address: body.address,
          phone: body.phone,
          email: body.email,
          website: body.website,
          logo: body.logo,
        },
      });

      console.log("✅ School updated:", school.id);

      return NextResponse.json({
        success: true,
        data: school,
        message: "School updated successfully",
      });
    } catch (error) {
      console.error("❌ Error updating school:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Failed to update school",
        },
        { status: 500 }
      );
    }
  }
);
