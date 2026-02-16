import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { withTenantContext } from "@/lib/api/with-tenant-context";
import { validateMessageBelongsToTenant } from "@/lib/tenant/tenant-isolation";

// PUT update message (mark as read)
export const PUT = withTenantContext<{ id: string }>(
  async (request, { tenant, params }) => {
    try {
      const id = params?.id;
      if (!id) {
        return NextResponse.json(
          { success: false, message: "Message ID required" },
          { status: 400 }
        );
      }

      // Validate message belongs to tenant
      const belongsToTenant = await validateMessageBelongsToTenant(
        id,
        tenant.id
      );

      if (!belongsToTenant) {
        return NextResponse.json(
          { success: false, message: "Message not found or access denied" },
          { status: 404 }
        );
      }

      const body = await request.json();

      const message = await prisma.message.update({
        where: { id },
        data: {
          read: body.read,
        },
      });

      console.log("✅ Message updated:", message.id);

      return NextResponse.json({
        success: true,
        data: message,
        message: "Message updated successfully",
      });
    } catch (error) {
      console.error("❌ Error updating message:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Failed to update message",
        },
        { status: 500 }
      );
    }
  }
);

// DELETE message
export const DELETE = withTenantContext<{ id: string }>(
  async (request, { tenant, params }) => {
    try {
      const id = params?.id;
      if (!id) {
        return NextResponse.json(
          { success: false, message: "Message ID required" },
          { status: 400 }
        );
      }

      // Validate message belongs to tenant
      const belongsToTenant = await validateMessageBelongsToTenant(
        id,
        tenant.id
      );

      if (!belongsToTenant) {
        return NextResponse.json(
          { success: false, message: "Message not found or access denied" },
          { status: 404 }
        );
      }

      await prisma.message.delete({
        where: { id },
      });

      console.log("✅ Message deleted:", id);

      return NextResponse.json({
        success: true,
        message: "Message deleted successfully",
      });
    } catch (error) {
      console.error("❌ Error deleting message:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Failed to delete message",
        },
        { status: 500 }
      );
    }
  }
);
