import { NextRequest, NextResponse } from "next/server";
import { getUserFromSession } from "@/lib/auth/get-user-from-session";
import { getQueryStats, getQueryLogs } from "@/lib/prisma-logger";

/**
 * Get query performance statistics
 * GET /api/admin/monitoring/queries
 * 
 * Admin only - for monitoring database performance
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromSession();

    // Check if user is admin
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");
    const model = searchParams.get("model");
    const minDuration = searchParams.get("minDuration");

    // Get stats
    const stats = getQueryStats(tenantId || undefined);

    // Get logs with filters
    const logs = getQueryLogs({
      tenantId: tenantId || undefined,
      model: model || undefined,
      minDuration: minDuration ? parseInt(minDuration) : undefined,
    });

    return NextResponse.json({
      success: true,
      stats,
      logs: logs.slice(-100), // Last 100 queries
    });
  } catch (error) {
    console.error("[API] Error fetching query stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch query stats" },
      { status: 500 }
    );
  }
}
