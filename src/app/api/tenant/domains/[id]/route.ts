import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTenantContext } from "@/lib/tenant/get-tenant-context";

// DELETE /api/tenant/domains/[id] - Remove domain
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Get tenant context from session or request headers (from proxy)
    const tenant = await getTenantContext();

    if (!tenant) {
      return NextResponse.json(
        {
          success: false,
          message: "Tenant tidak ditemukan",
        },
        { status: 401 },
      );
    }

    // For now, we only support one domain per tenant
    // Extract domain ID from tenant ID
    if (id === tenant.id + "-domain" || tenant.domain) {
      // Remove domain from tenant
      await prisma.tenant.update({
        where: { id: tenant.id },
        data: {
          domain: null,
          domainStatus: "pending",
          domainVerified: false,
          domainVerifiedAt: null,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Domain berhasil dihapus",
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Domain tidak ditemukan",
        },
        { status: 404 },
      );
    }
  } catch (error) {
    console.error("Error removing domain:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal menghapus domain",
        error:
          error instanceof Error ? error.message : "Terjadi kesalahan",
      },
      { status: 500 },
    );
  }
}

