import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withOptionalTenantContext } from "@/lib/api/with-tenant-context";

// GET single contact setting by type
export const GET = withOptionalTenantContext<{ type: string }>(
  async (_request, { tenant, params }) => {
    try {
      const type = params?.type;
      if (!type) {
        return NextResponse.json(
          { success: false, message: "Type is required" },
          { status: 400 },
        );
      }

      // TODO: Add schoolId filter when ContactSetting model is updated with tenant support
      const setting = await prisma.contactSetting.findUnique({
        where: { type },
      });

      if (!setting) {
        return NextResponse.json(
          { success: false, message: "Contact setting not found" },
          { status: 404 },
        );
      }

      console.log(
        tenant
          ? `[Tenant: ${tenant.name}] Fetched contact setting: ${type}`
          : `[Platform Admin] Fetched contact setting: ${type}`,
      );

      return NextResponse.json({ success: true, data: setting });
    } catch (error) {
      console.error("Error fetching contact setting:", error);
      return NextResponse.json(
        { success: false, message: "Failed to fetch contact setting" },
        { status: 500 },
      );
    }
  },
);

// PUT - Update contact setting
export const PUT = withOptionalTenantContext<{ type: string }>(
  async (request, { tenant, params }) => {
    try {
      const type = params?.type;
      if (!type) {
        return NextResponse.json(
          { success: false, message: "Type is required" },
          { status: 400 },
        );
      }

      const body = await request.json();
      const { phoneNumber, label, description, waTemplate, isActive } = body;

      // TODO: Add tenant ownership validation when ContactSetting model is updated
      const setting = await prisma.contactSetting.update({
        where: { type },
        data: {
          phoneNumber,
          label,
          description,
          waTemplate,
          isActive,
        },
      });

      console.log(
        tenant
          ? `[Tenant: ${tenant.name}] Updated contact setting: ${type}`
          : `[Platform Admin] Updated contact setting: ${type}`,
      );

      return NextResponse.json({ success: true, data: setting });
    } catch (error) {
      console.error("Error updating contact setting:", error);
      return NextResponse.json(
        { success: false, message: "Failed to update contact setting" },
        { status: 500 },
      );
    }
  },
);
