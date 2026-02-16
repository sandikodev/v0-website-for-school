import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { withTenantContext } from "@/lib/api/with-tenant-context";
import { getSchoolIdForTenant } from "@/lib/tenant/tenant-isolation";

// GET dashboard chart data
export const GET = withTenantContext(async (_request, { tenant }) => {
  try {
    console.log("📊 Fetching chart data for tenant:", tenant.name);

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

    // Get applications by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const applications = await prisma.application.findMany({
      where: {
        schoolId, // CRITICAL: Filter by tenant's school
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      select: {
        createdAt: true,
        status: true,
      },
    });

    // Group by month
    const monthlyData: {
      [key: string]: { pending: number; approved: number; rejected: number };
    } = {};

    applications.forEach((app) => {
      const monthKey = new Date(app.createdAt).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short",
      });

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { pending: 0, approved: 0, rejected: 0 };
      }

      if (app.status === "pending") monthlyData[monthKey].pending++;
      else if (app.status === "approved") monthlyData[monthKey].approved++;
      else if (app.status === "rejected") monthlyData[monthKey].rejected++;
    });

    const chartData = Object.entries(monthlyData).map(([month, data]) => ({
      month,
      ...data,
    }));

    // Get students by grade (filtered by tenant's school)
    const studentsByGrade = await prisma.student.groupBy({
      by: ["grade"],
      where: { schoolId }, // CRITICAL: Filter by tenant's school
      _count: {
        grade: true,
      },
    });

    const gradeData = studentsByGrade.map((item) => ({
      name: item.grade,
      value: item._count.grade,
    }));

    console.log("✅ Chart data prepared for tenant:", tenant.name);

    return NextResponse.json({
      success: true,
      data: {
        applications: chartData,
        studentsByGrade: gradeData,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching chart data:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch chart data",
      },
      { status: 500 }
    );
  }
});
