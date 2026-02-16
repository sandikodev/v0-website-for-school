import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "@/lib/auth/get-user-from-session";
import { invalidateTenantCache } from "@/lib/tenant-resolver";

/**
 * Update tenant status
 * POST /api/admin/tenants/[id]/status
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getUserFromSession();

    // Check if user is admin
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { status, reason } = await request.json();

    // Validate status
    const validStatuses = ["active", "inactive", "suspended", "banned"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    // Update tenant
    const tenant = await prisma.tenant.update({
      where: { id },
      data: {
        status,
        statusReason: reason || null,
        isActive: status === "active",
      },
    });

    // Invalidate cache
    invalidateTenantCache(tenant.id, tenant.slug);
    if (tenant.domain) {
      invalidateTenantCache(tenant.id, tenant.domain);
    }

    return NextResponse.json({ success: true, tenant });
  } catch (error) {
    console.error("[API] Error updating tenant status:", error);
    return NextResponse.json(
      { error: "Failed to update tenant status" },
      { status: 500 }
    );
  }
}
