import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTenantContext } from "@/lib/tenant/get-tenant-context";

// POST /api/tenant/check-domain - Check domain status
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { domain } = body;

    if (!domain) {
      return NextResponse.json(
        {
          success: false,
          message: "Domain harus diisi",
        },
        { status: 400 },
      );
    }

    // Get tenant context from session or request headers (from proxy)
    let tenant = await getTenantContext();
    
    // If no tenant from context, try to find by domain
    if (!tenant) {
      tenant = await prisma.tenant.findFirst({ where: { domain } });
    }

    if (!tenant) {
      return NextResponse.json(
        {
          success: false,
          message: "Tenant tidak ditemukan",
        },
        { status: 404 },
      );
    }

    if (tenant.domain !== domain) {
      return NextResponse.json(
        {
          success: false,
          message: "Domain tidak ditemukan untuk tenant ini",
        },
        { status: 404 },
      );
    }

    // TODO: Implement actual DNS checking
    // For now, we'll check if domain is verified and update status accordingly
    // In production, this should:
    // 1. Check DNS records (CNAME, A, TXT)
    // 2. Verify SSL certificate
    // 3. Check if domain is reachable

    let newStatus: "pending" | "configuring" | "active" | "error" | "suspended" =
      tenant.domainStatus as "pending" | "configuring" | "active" | "error" | "suspended";

    // Simulate DNS check
    // In production, use DNS lookup library like `dns` package
    const isDNSConfigured = tenant.domainVerified; // Placeholder

    if (isDNSConfigured && tenant.domainVerified) {
      newStatus = "active";
    } else if (!tenant.domainVerified) {
      newStatus = "pending";
    }

    // Update tenant status
    const updatedTenant = await prisma.tenant.update({
      where: { id: tenant.id },
      data: {
        domainStatus: newStatus,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Status domain diperbarui",
      data: {
        domain: updatedTenant.domain,
        status: updatedTenant.domainStatus,
        verified: updatedTenant.domainVerified,
        verifiedAt: updatedTenant.domainVerifiedAt?.toISOString() || null,
      },
    });
  } catch (error) {
    console.error("Error checking domain:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal memeriksa status domain",
        error:
          error instanceof Error ? error.message : "Terjadi kesalahan",
      },
      { status: 500 },
    );
  }
}

