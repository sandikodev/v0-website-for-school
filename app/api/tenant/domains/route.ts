import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTenantContext } from "@/lib/tenant/get-tenant-context";

// GET /api/tenant/domains - Get all domains for tenant
export async function GET(_request: NextRequest) {
  try {
    // Get tenant context from session or request headers (from proxy)
    const tenant = await getTenantContext();
    
    if (!tenant) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    // For now, we'll return a single domain if exists
    // In the future, we'll have a separate TenantDomain model
    const domains = tenant.domain
      ? [
          {
            id: tenant.id + "-domain",
            domain: tenant.domain,
            status: tenant.domainStatus as
              | "pending"
              | "configuring"
              | "active"
              | "error"
              | "suspended",
            verified: tenant.domainVerified,
            verifiedAt: tenant.domainVerifiedAt?.toISOString() || null,
            verificationRecord: `vercel-domain-verify=${tenant.domain},${tenant.id}`,
            cnameTarget: process.env.NEXT_PUBLIC_CNAME_TARGET || `cname.${process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || "your-platform.com"}`,
            aRecordTarget: process.env.NEXT_PUBLIC_A_RECORD_TARGET || "76.76.21.21",
            createdAt: tenant.createdAt.toISOString(),
          },
        ]
      : [];

    return NextResponse.json({
      success: true,
      data: domains,
    });
  } catch (error) {
    console.error("Error fetching domains:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal memuat domains",
        error:
          error instanceof Error ? error.message : "Terjadi kesalahan",
      },
      { status: 500 },
    );
  }
}

// POST /api/tenant/domains - Add new domain
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { domain } = body;

    if (!domain || !domain.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Domain harus diisi",
        },
        { status: 400 },
      );
    }

    // Validate domain format
    const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i;
    if (!domainRegex.test(domain.trim())) {
      return NextResponse.json(
        {
          success: false,
          message: "Format domain tidak valid",
        },
        { status: 400 },
      );
    }

    // Get tenant context from session or request headers (from proxy)
    const tenant = await getTenantContext();
    
    if (!tenant) {
      return NextResponse.json(
        {
          success: false,
          message: "Tenant tidak ditemukan. Silakan lengkapi informasi tenant terlebih dahulu.",
        },
        { status: 404 },
      );
    }

    // Check if domain already exists
    if (tenant.domain === domain.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Domain sudah ditambahkan sebelumnya",
        },
        { status: 400 },
      );
    }

    // Check if another tenant uses this domain
    const existingTenant = await prisma.tenant.findFirst({
      where: {
        domain: domain.trim(),
        id: { not: tenant.id },
      },
    });

    if (existingTenant) {
      return NextResponse.json(
        {
          success: false,
          message: "Domain sudah digunakan oleh tenant lain",
        },
        { status: 400 },
      );
    }

    // Update tenant with new domain
    const updatedTenant = await prisma.tenant.update({
      where: { id: tenant.id },
      data: {
        domain: domain.trim(),
        domainStatus: "pending",
        domainVerified: false,
        domainVerifiedAt: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Domain berhasil ditambahkan",
      data: {
        id: updatedTenant.id + "-domain",
        domain: updatedTenant.domain,
        status: updatedTenant.domainStatus,
        verified: updatedTenant.domainVerified,
        verifiedAt: updatedTenant.domainVerifiedAt?.toISOString() || null,
        verificationRecord: `vercel-domain-verify=${updatedTenant.domain},${updatedTenant.id}`,
        cnameTarget: process.env.NEXT_PUBLIC_CNAME_TARGET || `cname.${process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || "your-platform.com"}`,
        aRecordTarget: process.env.NEXT_PUBLIC_A_RECORD_TARGET || "76.76.21.21",
        createdAt: updatedTenant.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error adding domain:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal menambahkan domain",
        error:
          error instanceof Error ? error.message : "Terjadi kesalahan",
      },
      { status: 500 },
    );
  }
}

