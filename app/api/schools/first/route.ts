import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { withTenantContext } from "@/lib/api/with-tenant-context";

// GET first school (for tenant)
export const GET = withTenantContext(async (_request, { tenant }) => {
  try {
    // Get school for this tenant
    const school = await prisma.school.findFirst({
      where: { tenantId: tenant.id }, // CRITICAL: Filter by tenant
    });

    if (!school) {
      return NextResponse.json(
        {
          success: false,
          message: "No school found for this tenant",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: school,
    });
  } catch (error) {
    console.error("❌ Error fetching school:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch school",
      },
      { status: 500 }
    );
  }
});
