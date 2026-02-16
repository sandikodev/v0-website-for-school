import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// Simple login API endpoint for testing
export async function POST(request: NextRequest) {
  try {
    console.log("🔐 Login request received");

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body",
        },
        { status: 400 },
      );
    }

    console.log("📋 Request body:", { username: body.username });

    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Username dan password harus diisi",
        },
        { status: 400 },
      );
    }

    console.log("🔍 Finding user:", username);

    // Find user by username OR email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: username.trim() },
          { email: username.trim() },
        ],
      },
    });

    console.log("👤 User found:", user ? "Yes" : "No");

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Username atau password salah",
        },
        { status: 401 },
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        {
          success: false,
          message: "Akun tidak aktif",
        },
        { status: 401 },
      );
    }

    console.log("🔑 Verifying password...");

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    console.log("✅ Password valid:", isValidPassword);

    if (!isValidPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Username atau password salah",
        },
        { status: 401 },
      );
    }

    // Get user with tenant information
    const userWithTenant = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        username: true,
        role: true,
        tenantId: true,
      },
    });

    console.log("✅ Login successful for user:", user.username, "role:", user.role);

    // Get dashboard URL from environment
    const dashboardDomain = process.env.NEXT_PUBLIC_DASHBOARD_URL ||
      (process.env.NODE_ENV === "production"
        ? "https://dashboard.aksesekolah.id"
        : "http://dashboard.aksesekolah.local:3000");

    // Determine redirect URL based on user role
    // Redirect to /admin or /tenant (let their layouts handle the entrypoint)
    let redirectUrl = `${dashboardDomain}/tenant`; // Default for tenant users

    if (user.role === "admin") {
      // Platform admin → admin dashboard
      redirectUrl = `${dashboardDomain}/admin`;
    } else if (userWithTenant?.tenantId) {
      // Tenant user → tenant dashboard
      redirectUrl = `${dashboardDomain}/tenant`;
    }

    console.log("🔀 Redirect URL:", redirectUrl);

    // Remove password from response
    const { password: _password, ...userWithoutPassword } = user;
    void _password;

    // Create response with redirect URL
    const response = NextResponse.json({
      success: true,
      message: "Login berhasil",
      user: userWithoutPassword,
      redirectUrl, // Include redirect URL in response
    });

    // Set session cookie with tenant ID
    // IMPORTANT: Set domain to share cookie across subdomains
    const cookieDomain = process.env.NODE_ENV === "production"
      ? ".aksesekolah.id"  // Share across all subdomains in production
      : ".aksesekolah.local"; // Share across all subdomains in development

    response.cookies.set(
      "user-session",
      JSON.stringify({
        id: user.id,
        username: user.username,
        role: user.role,
        tenantId: userWithTenant?.tenantId || null,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        domain: cookieDomain, // Share cookie across subdomains
        maxAge: 60 * 60 * 24 * 7, // 7 days
      },
    );

    return response;
  } catch (error) {
    console.error("❌ Login error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Terjadi kesalahan server",
      },
      { status: 500 },
    );
  }
}
