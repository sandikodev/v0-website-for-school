import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AuthService } from "@/lib/auth";
import { signToken, setAuthCookie } from "@/lib/jwt";



export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      // School Info
      schoolName,
      schoolType,
      npsn,
      address,
      city,
      province,
      phone,
      // Admin Info
      adminName,
      adminEmail,
      adminPhone,
      adminPosition: _adminPosition,
      // Account
      password,
      subdomain,
    } = body;

    // Validation
    if (!schoolName || !npsn || !adminName || !adminEmail || !password || !subdomain) {
      return NextResponse.json(
        { message: "Mohon lengkapi semua field yang wajib diisi" },
        { status: 400 }
      );
    }

    // Validate subdomain format
    if (!/^[a-z0-9-]+$/.test(subdomain)) {
      return NextResponse.json(
        { message: "Subdomain hanya boleh huruf kecil, angka, dan tanda hubung" },
        { status: 400 }
      );
    }

    // Check if subdomain already exists
    const existingTenant = await prisma.tenant.findUnique({
      where: { slug: subdomain },
    });

    if (existingTenant) {
      return NextResponse.json(
        { message: "Subdomain sudah digunakan" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email sudah terdaftar" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await AuthService.hashPassword(password);

    // Create tenant and admin user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create tenant
      const tenant = await tx.tenant.create({
        data: {
          name: schoolName,
          slug: subdomain,
          email: adminEmail,
          phone: phone || adminPhone,
          address: address ? `${address}, ${city || ""}, ${province || ""}`.trim() : undefined,
          domainStatus: "pending",
          domainVerified: false,
          isActive: true,
        },
      });

      // Create school under tenant
      const school = await tx.school.create({
        data: {
          name: schoolName,
          description: `${schoolType?.toUpperCase() || "Sekolah"} - NPSN: ${npsn}`,
          address: address ? `${address}, ${city || ""}, ${province || ""}`.trim() : undefined,
          phone: phone || adminPhone,
          email: adminEmail,
          tenantId: tenant.id,
        },
      });

      // Create admin user
      const user = await tx.user.create({
        data: {
          username: adminEmail.split("@")[0], // Use email prefix as username
          email: adminEmail,
          password: hashedPassword,
          role: "tenant_admin",
          isActive: true,
          tenantId: tenant.id,
        },
      });

      return { tenant, school, user };
    });

    // Create JWT token
    const token = await signToken({
      userId: result.user.id,
      email: result.user.email || "",
      role: result.user.role,
      tenantId: result.tenant.id,
    });

    // Set cookie
    await setAuthCookie(token);

    // Return success response
    return NextResponse.json({
      message: "Registrasi berhasil",
      tenant: {
        id: result.tenant.id,
        name: result.tenant.name,
        slug: result.tenant.slug,
        domain: `${subdomain}.aksesekolah.id`,
      },
      user: {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Terjadi kesalahan saat registrasi" },
      { status: 500 }
    );
  }
}
