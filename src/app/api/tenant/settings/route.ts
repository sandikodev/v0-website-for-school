import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTenantContext } from "@/lib/tenant/get-tenant-context";
import { invalidateTenantCache } from "@/lib/tenant-resolver";

// GET /api/tenant/settings - Get tenant settings
export async function GET(_request: NextRequest) {
  try {
    // Get tenant context from session or request headers (from proxy)
    let tenant = await getTenantContext();
    
    // Fallback to first tenant if no context found (backward compatibility)
    if (!tenant) {
      tenant = await prisma.tenant.findFirst();
    }

    if (!tenant) {
      // Return default empty tenant
      return NextResponse.json({
        success: true,
        data: {
          id: null,
          name: "",
          slug: "",
          domains: [],
          logo: "",
          favicon: "",
          primaryColor: "#10b981",
          secondaryColor: "#059669",
          email: "",
          phone: "",
          address: "",
          website: "",
        },
      });
    }

    // Build domains array
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
      data: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        domains: domains,
        logo: tenant.logo || "",
        favicon: tenant.favicon || "",
        primaryColor: tenant.primaryColor || "#10b981",
        secondaryColor: tenant.secondaryColor || "#059669",
        email: tenant.email || "",
        phone: tenant.phone || "",
        address: tenant.address || "",
        website: tenant.website || "",
      },
    });
  } catch (error) {
    console.error("Error fetching tenant settings:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal memuat pengaturan tenant",
        error:
          error instanceof Error ? error.message : "Terjadi kesalahan",
      },
      { status: 500 },
    );
  }
}

// PUT /api/tenant/settings - Update tenant settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id: _id,
      name,
      slug,
      domain,
      logo,
      favicon,
      primaryColor,
      secondaryColor,
      email,
      phone,
      address,
      website,
    } = body;

    // Validation
    if (!name || !slug) {
      return NextResponse.json(
        {
          success: false,
          message: "Nama dan slug harus diisi",
        },
        { status: 400 },
      );
    }

    // Get tenant context from session or request headers (from proxy)
    let tenant = await getTenantContext();
    
    // Fallback to first tenant if no context found (backward compatibility)
    if (!tenant) {
      tenant = await prisma.tenant.findFirst();
    }

    if (tenant) {
      // Store old domain for cache invalidation
      const oldDomain = tenant.domain;
      
      // Update existing tenant
      tenant = await prisma.tenant.update({
        where: { id: tenant.id },
        data: {
          name,
          slug,
          domain: domain || null,
          logo: logo || null,
          favicon: favicon || null,
          primaryColor: primaryColor || null,
          secondaryColor: secondaryColor || null,
          email: email || null,
          phone: phone || null,
          address: address || null,
          website: website || null,
          // Don't update domain verification status here
        },
      });
      
      // Invalidate cache for old and new domains
      invalidateTenantCache(tenant.id, oldDomain || undefined);
      if (domain && domain !== oldDomain) {
        invalidateTenantCache(tenant.id, domain);
      }
    } else {
      // Create new tenant
      tenant = await prisma.tenant.create({
        data: {
          name,
          slug,
          domain: domain || null,
          logo: logo || null,
          favicon: favicon || null,
          primaryColor: primaryColor || null,
          secondaryColor: secondaryColor || null,
          email: email || null,
          phone: phone || null,
          address: address || null,
          website: website || null,
          domainStatus: "pending",
          domainVerified: false,
        },
      });
    }

    // Build domains array
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
      message: "Pengaturan tenant berhasil disimpan",
      data: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        domains: domains,
        logo: tenant.logo || "",
        favicon: tenant.favicon || "",
        primaryColor: tenant.primaryColor || "#10b981",
        secondaryColor: tenant.secondaryColor || "#059669",
        email: tenant.email || "",
        phone: tenant.phone || "",
        address: tenant.address || "",
        website: tenant.website || "",
      },
    });
  } catch (error) {
    console.error("Error updating tenant settings:", error);
    
    // Handle unique constraint errors
    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2002") {
        const target = (error as { meta?: { target?: string[] } }).meta?.target?.[0];
        if (target === "domain") {
          return NextResponse.json(
            {
              success: false,
              message: "Domain sudah digunakan oleh tenant lain",
            },
            { status: 400 },
          );
        }
        if (target === "slug") {
          return NextResponse.json(
            {
              success: false,
              message: "Slug sudah digunakan oleh tenant lain",
            },
            { status: 400 },
          );
        }
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: "Gagal menyimpan pengaturan tenant",
        error:
          error instanceof Error ? error.message : "Terjadi kesalahan",
      },
      { status: 500 },
    );
  }
}

