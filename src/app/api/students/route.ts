import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { withTenantContext } from "@/lib/api/with-tenant-context";
import { getSchoolIdForTenant } from "@/lib/tenant/tenant-isolation";

// GET all students
export const GET = withTenantContext(async (_request, { tenant }) => {
  try {
    console.log("📚 Fetching students for tenant:", tenant.name);

    // Get school for this tenant (tenant isolation)
    const schoolId = await getSchoolIdForTenant(tenant.id);

    if (!schoolId) {
      return NextResponse.json(
        {
          success: false,
          message: "School not found for this tenant",
        },
        { status: 404 }
      );
    }

    const students = await prisma.student.findMany({
      where: { schoolId }, // CRITICAL: Filter by tenant's school
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(`✅ Found ${students.length} students for tenant ${tenant.name}`);

    return NextResponse.json({
      success: true,
      data: students,
    });
  } catch (_error) {
    console.error("❌ Error fetching students:", _error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch students",
        error: _error instanceof Error ? _error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
});

// POST create new student
export const POST = withTenantContext(async (request, { tenant }) => {
  try {
    console.log("📝 Creating new student for tenant:", tenant.name);

    // Get school for this tenant (tenant isolation)
    const schoolId = await getSchoolIdForTenant(tenant.id);

    if (!schoolId) {
      return NextResponse.json(
        {
          success: false,
          message: "School not found for this tenant",
        },
        { status: 404 }
      );
    }

    const body = await request.json();

    const student = await prisma.student.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        grade: body.grade,
        birthDate: body.birthDate ? new Date(body.birthDate) : null,
        parentName: body.parentName,
        parentPhone: body.parentPhone,
        address: body.address,
        status: body.status || "active",
        schoolId, // CRITICAL: Use tenant's school ID
      },
    });

    console.log("✅ Student created:", student.id);

    return NextResponse.json(
      {
        success: true,
        data: student,
        message: "Student created successfully",
      },
      { status: 201 }
    );
  } catch (_error) {
    console.error("❌ Error creating student:", _error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create student",
        error: _error instanceof Error ? _error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
});
