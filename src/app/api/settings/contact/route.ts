import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withOptionalTenantContext } from "@/lib/api/with-tenant-context";

// GET all contact settings
// Contact settings are global but can be accessed by tenants
export const GET = withOptionalTenantContext(async (request, { tenant }) => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type"); // 'call_center' or 'admissions'

    const where = type ? { type } : {};

    // TODO: Add schoolId filter when ContactSetting model is updated with tenant support
    const settings = await prisma.contactSetting.findMany({
      where,
      orderBy: { type: "asc" },
    });

    console.log(
      tenant
        ? `[Tenant: ${tenant.name}] Fetched ${settings.length} contact settings`
        : `[Platform Admin] Fetched ${settings.length} contact settings`,
    );

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("Error fetching contact settings:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch contact settings" },
      { status: 500 },
    );
  }
});

// POST - Create new contact setting (optional, biasanya sudah dari seed)
export const POST = withOptionalTenantContext(async (request, { tenant }) => {
  try {
    const body = await request.json();
    const { type, phoneNumber, label, description, waTemplate, isActive } =
      body;

    // TODO: Add schoolId when ContactSetting model is updated with tenant support
    const setting = await prisma.contactSetting.create({
      data: {
        type,
        phoneNumber,
        label,
        description,
        waTemplate: waTemplate || "",
        isActive: isActive ?? true,
      },
    });

    console.log(
      tenant
        ? `[Tenant: ${tenant.name}] Created contact setting: ${type}`
        : `[Platform Admin] Created contact setting: ${type}`,
    );

    return NextResponse.json({ success: true, data: setting });
  } catch (error) {
    console.error("Error creating contact setting:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create contact setting" },
      { status: 500 },
    );
  }
});
