import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { withTenantContext } from "@/lib/api/with-tenant-context";
import { validateStudentBelongsToTenant } from "@/lib/tenant/tenant-isolation";

// GET single student
export const GET = withTenantContext<{ id: string }>(
  async (request, { tenant, params }) => {
    try {
      const id = params?.id;
      if (!id) {
        return NextResponse.json(
          { success: false, message: "Student ID required" },
          { status: 400 }
        );
      }

      // Validate student belongs to tenant
      const belongsToTenant = await validateStudentBelongsToTenant(
        id,
        tenant.id
      );

      if (!belongsToTenant) {
        return NextResponse.json(
          {
            success: false,
            message: "Student not found or access denied",
          },
          { status: 404 }
        );
      }

      const student = await prisma.student.findUnique({
        where: { id },
        include: {
          school: true,
          applications: true,
          messages: true,
        },
      });

      if (!student) {
        return NextResponse.json(
          {
            success: false,
            message: "Student not found",
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: student,
      });
    } catch (error) {
      console.error("❌ Error fetching student:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch student",
        },
        { status: 500 }
      );
    }
  }
);

// PUT update student
export const PUT = withTenantContext<{ id: string }>(
  async (request, { tenant, params }) => {
    try {
      const id = params?.id;
      if (!id) {
        return NextResponse.json(
          { success: false, message: "Student ID required" },
          { status: 400 }
        );
      }

      // Validate student belongs to tenant
      const belongsToTenant = await validateStudentBelongsToTenant(
        id,
        tenant.id
      );

      if (!belongsToTenant) {
        return NextResponse.json(
          {
            success: false,
            message: "Student not found or access denied",
          },
          { status: 404 }
        );
      }

      const body = await request.json();

      const student = await prisma.student.update({
        where: { id },
        data: {
          name: body.name,
          email: body.email,
          phone: body.phone,
          grade: body.grade,
          birthDate: body.birthDate ? new Date(body.birthDate) : null,
          parentName: body.parentName,
          parentPhone: body.parentPhone,
          address: body.address,
          status: body.status,
        },
      });

      console.log("✅ Student updated:", student.id);

      return NextResponse.json({
        success: true,
        data: student,
        message: "Student updated successfully",
      });
    } catch (error) {
      console.error("❌ Error updating student:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Failed to update student",
        },
        { status: 500 }
      );
    }
  }
);

// DELETE student
export const DELETE = withTenantContext<{ id: string }>(
  async (request, { tenant, params }) => {
    try {
      const id = params?.id;
      if (!id) {
        return NextResponse.json(
          { success: false, message: "Student ID required" },
          { status: 400 }
        );
      }

      // Validate student belongs to tenant
      const belongsToTenant = await validateStudentBelongsToTenant(
        id,
        tenant.id
      );

      if (!belongsToTenant) {
        return NextResponse.json(
          {
            success: false,
            message: "Student not found or access denied",
          },
          { status: 404 }
        );
      }

      // Delete related records first
      await prisma.message.deleteMany({
        where: { studentId: id },
      });

      await prisma.application.deleteMany({
        where: { studentId: id },
      });

      // Delete student
      await prisma.student.delete({
        where: { id },
      });

      console.log("✅ Student deleted:", id);

      return NextResponse.json({
        success: true,
        message: "Student deleted successfully",
      });
    } catch (error) {
      console.error("❌ Error deleting student:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Failed to delete student",
        },
        { status: 500 }
      );
    }
  }
);
