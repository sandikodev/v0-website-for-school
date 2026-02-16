import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { withTenantContext } from "@/lib/api/with-tenant-context";
import { getSchoolIdForTenant } from "@/lib/tenant/tenant-isolation";

// Get dashboard statistics
export const GET = withTenantContext(async (_request, { tenant }) => {
  try {
    console.log("📊 Fetching dashboard stats for tenant:", tenant.name);

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

    // Get counts from database (filtered by tenant's school)
    const [totalStudents, totalApplications, totalMessages] = await Promise.all(
      [
        prisma.student.count({
          where: { schoolId }, // CRITICAL: Filter by tenant's school
        }),
        prisma.application.count({
          where: {
            schoolId, // CRITICAL: Filter by tenant's school
            status: "pending",
          },
        }),
        prisma.message.count({
          where: {
            schoolId, // CRITICAL: Filter by tenant's school
            read: false,
          },
        }),
      ],
    );

    // For now, we'll use mock data for teachers
    const totalTeachers = 45; // TODO: Add Teacher model later

    const stats = {
      totalStudents,
      totalTeachers,
      totalApplications,
      totalMessages,
    };

    console.log("✅ Dashboard stats:", stats);

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("❌ Error fetching dashboard stats:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch dashboard statistics",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
});
