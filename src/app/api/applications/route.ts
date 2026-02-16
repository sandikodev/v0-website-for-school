import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { withTenantContext } from "@/lib/api/with-tenant-context";
import { getSchoolIdForTenant } from "@/lib/tenant/tenant-isolation";

// GET all applications
export const GET = withTenantContext(async (_request, { tenant }) => {
  try {
    console.log("📋 Fetching applications for tenant:", tenant.name);

    // Get school for this tenant (tenant isolation)
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

    const applications = await prisma.application.findMany({
      where: { schoolId }, // CRITICAL: Filter by tenant's school
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            grade: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(`✅ Found ${applications.length} applications for tenant ${tenant.name}`);

    return NextResponse.json({
      success: true,
      data: applications,
    });
  } catch (error) {
    console.error("❌ Error fetching applications:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch applications",
      },
      { status: 500 }
    );
  }
});
