import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withOptionalTenantContext } from "@/lib/api/with-tenant-context";

// GET - Fetch single message
export const GET = withOptionalTenantContext<{ id: string }>(
  async (_request, { tenant, params }) => {
    try {
      const id = params?.id;
      if (!id) {
        return NextResponse.json(
          { success: false, error: "Message ID is required" },
          { status: 400 },
        );
      }

      const message = await prisma.contactMessage.findUnique({
        where: { id },
      });

      if (!message) {
        return NextResponse.json(
          { success: false, error: "Message not found" },
          { status: 404 },
        );
      }

      // TODO: Add tenant filtering when ContactMessage model has tenantId
      console.log(
        tenant
          ? `[Tenant: ${tenant.name}] Fetched contact message ${id}`
          : `[Platform Admin] Fetched contact message ${id}`,
      );

      return NextResponse.json({
        success: true,
        data: message,
      });
    } catch (error) {
      console.error("Error fetching message:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch message" },
        { status: 500 },
      );
    }
  },
);

// PUT - Update message (status, notes, etc.)
export const PUT = withOptionalTenantContext<{ id: string }>(
  async (request, { tenant, params }) => {
    try {
      const id = params?.id;
      if (!id) {
        return NextResponse.json(
          { success: false, error: "Message ID is required" },
          { status: 400 },
        );
      }

      const body = await request.json();
      const { status, notes, priority, category } = body;

      const updateData: Record<string, unknown> = {};

      if (status) updateData.status = status;
      if (notes !== undefined) updateData.notes = notes;
      if (priority) updateData.priority = priority;
      if (category) updateData.category = category;

      // TODO: Add tenant ownership validation when ContactMessage model has tenantId

      const message = await prisma.contactMessage.update({
        where: { id },
        data: updateData,
      });

      console.log(
        tenant
          ? `[Tenant: ${tenant.name}] Updated contact message ${id}`
          : `[Platform Admin] Updated contact message ${id}`,
      );

      return NextResponse.json({
        success: true,
        data: message,
        message: "Message updated successfully",
      });
    } catch (error) {
      console.error("Error updating message:", error);
      return NextResponse.json(
        { success: false, error: "Failed to update message" },
        { status: 500 },
      );
    }
  },
);

// DELETE - Delete message
export const DELETE = withOptionalTenantContext<{ id: string }>(
  async (_request, { tenant, params }) => {
    try {
      const id = params?.id;
      if (!id) {
        return NextResponse.json(
          { success: false, error: "Message ID is required" },
          { status: 400 },
        );
      }

      // TODO: Add tenant ownership validation when ContactMessage model has tenantId

      await prisma.contactMessage.delete({
        where: { id },
      });

      console.log(
        tenant
          ? `[Tenant: ${tenant.name}] Deleted contact message ${id}`
          : `[Platform Admin] Deleted contact message ${id}`,
      );

      return NextResponse.json({
        success: true,
        message: "Message deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting message:", error);
      return NextResponse.json(
        { success: false, error: "Failed to delete message" },
        { status: 500 },
      );
    }
  },
);
