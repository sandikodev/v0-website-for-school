import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyDomain, provisionSSL } from "@/lib/dns/verify-domain";
import { getTenantContext } from "@/lib/tenant/get-tenant-context";

// POST /api/tenant/verify-domain - Verify domain configuration
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

    // Verify domain belongs to tenant
    if (tenant.domain !== domain) {
      return NextResponse.json(
        {
          success: false,
          message: "Domain tidak sesuai dengan tenant",
        },
        { status: 403 },
      );
    }

    // Validate domain format
    const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i;
    if (!domainRegex.test(domain)) {
      return NextResponse.json(
        {
          success: false,
          message: "Format domain tidak valid",
        },
        { status: 400 },
      );
    }

    console.log(`🔍 Starting domain verification for: ${domain}`);

    // Verify domain (TXT + DNS records)
    const verification = await verifyDomain(domain, tenant.id);

    if (!verification.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Gagal memverifikasi domain",
          errors: verification.errors,
        },
        { status: 400 }
      );
    }

    if (!verification.verified) {
      return NextResponse.json(
        {
          success: false,
          message: "Domain belum dikonfigurasi dengan benar",
          verification: {
            txtRecord: verification.txtRecord,
            dnsRecord: verification.dnsRecord,
          },
          errors: verification.errors,
        },
        { status: 400 }
      );
    }

    // Domain verified! Now provision SSL
    console.log(`✅ Domain ${domain} verified! Provisioning SSL...`);
    
    const sslResult = await provisionSSL(domain);
    
    // Get updated tenant
    const updatedTenant = await prisma.tenant.findUnique({
      where: { id: tenant.id },
    });

    if (!updatedTenant) {
      return NextResponse.json(
        {
          success: false,
          message: "Tenant tidak ditemukan setelah verifikasi",
        },
        { status: 404 }
      );
    }

    const verificationRecord = `vercel-domain-verify=${domain},${tenant.id}`;
    const cnameTarget =
      process.env.NEXT_PUBLIC_CNAME_TARGET ||
      `cname.${process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || "your-platform.com"}`;
    const aRecordTarget =
      process.env.NEXT_PUBLIC_A_RECORD_TARGET || "76.76.21.21";

    return NextResponse.json({
      success: true,
      message: "Domain berhasil diverifikasi dan SSL certificate telah disediakan",
      data: {
        id: updatedTenant.id + "-domain",
        domain: updatedTenant.domain,
        status: updatedTenant.domainStatus,
        verified: updatedTenant.domainVerified,
        verifiedAt: updatedTenant.domainVerifiedAt?.toISOString(),
        verificationRecord,
        cnameTarget,
        aRecordTarget,
        sslProvisioned: sslResult.success,
        sslMessage: sslResult.message,
      },
    });
  } catch (error) {
    console.error("Error verifying domain:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal memverifikasi domain",
        error:
          error instanceof Error ? error.message : "Terjadi kesalahan",
      },
      { status: 500 },
    );
  }
}

