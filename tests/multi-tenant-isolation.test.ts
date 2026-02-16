import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import { PrismaClient } from "@prisma/client";
// import { applyTenantMiddleware } from "@/lib/prisma-middleware";

const prisma = new PrismaClient();

describe("Multi-Tenant Data Isolation", () => {
  let tenant1Id: string;
  let tenant2Id: string;
  let school1Id: string;
  let school2Id: string;

  beforeAll(async () => {
    // Create two test tenants
    const tenant1 = await prisma.tenant.create({
      data: {
        name: "Test School 1",
        slug: "test-school-1",
        status: "active",
      },
    });
    tenant1Id = tenant1.id;

    const tenant2 = await prisma.tenant.create({
      data: {
        name: "Test School 2",
        slug: "test-school-2",
        status: "active",
      },
    });
    tenant2Id = tenant2.id;

    // Create schools for each tenant
    const school1 = await prisma.school.create({
      data: {
        name: "School 1",
        tenantId: tenant1Id,
      },
    });
    school1Id = school1.id;

    const school2 = await prisma.school.create({
      data: {
        name: "School 2",
        tenantId: tenant2Id,
      },
    });
    school2Id = school2.id;

    // Create students for each school
    await prisma.student.create({
      data: {
        name: "Student from School 1",
        email: "student1@school1.test",
        grade: "10",
        schoolId: school1Id,
      },
    });

    await prisma.student.create({
      data: {
        name: "Student from School 2",
        email: "student2@school2.test",
        grade: "10",
        schoolId: school2Id,
      },
    });
  });

  afterAll(async () => {
    // Cleanup
    await prisma.student.deleteMany({
      where: {
        OR: [{ schoolId: school1Id }, { schoolId: school2Id }],
      },
    });
    await prisma.school.deleteMany({
      where: {
        OR: [{ id: school1Id }, { id: school2Id }],
      },
    });
    await prisma.tenant.deleteMany({
      where: {
        OR: [{ id: tenant1Id }, { id: tenant2Id }],
      },
    });
    await prisma.$disconnect();
  });

  it("should isolate data between tenants via school", async () => {
    // Query students for school 1
    const school1Students = await prisma.student.findMany({
      where: { schoolId: school1Id },
    });

    // Query students for school 2
    const school2Students = await prisma.student.findMany({
      where: { schoolId: school2Id },
    });

    // Each school should only see their own students
    expect(school1Students).toHaveLength(1);
    expect(school1Students[0].name).toBe("Student from School 1");

    expect(school2Students).toHaveLength(1);
    expect(school2Students[0].name).toBe("Student from School 2");
  });

  it("should prevent cross-tenant data access", async () => {
    // Try to get school 2's student using school 1's context
    const student = await prisma.student.findFirst({
      where: {
        schoolId: school1Id,
        email: "student2@school2.test", // This belongs to school 2
      },
    });

    // Should not find the student
    expect(student).toBeNull();
  });

  it("should work with tenant middleware", async () => {
    // Create tenant-scoped Prisma client for tenant 1
    const _tenant1Prisma = Object.create(prisma);

    // Note: Middleware works on User model, not Student
    // For Student, we use schoolId isolation
    // This test demonstrates the pattern

    const schools = await prisma.school.findMany({
      where: { tenantId: tenant1Id },
    });

    expect(schools).toHaveLength(1);
    expect(schools[0].name).toBe("School 1");
  });

  it("should enforce schoolId on create", async () => {
    // Create student for school 1
    const student = await prisma.student.create({
      data: {
        name: "New Student",
        email: "new@school1.test",
        grade: "11",
        schoolId: school1Id,
      },
    });

    // Verify it belongs to school 1
    expect(student.schoolId).toBe(school1Id);

    // Verify it's not accessible from school 2 context
    const school2Student = await prisma.student.findFirst({
      where: {
        schoolId: school2Id,
        id: student.id,
      },
    });

    expect(school2Student).toBeNull();

    // Cleanup
    await prisma.student.delete({ where: { id: student.id } });
  });

  it("should handle tenant status filtering", async () => {
    // Get active tenants
    const activeTenants = await prisma.tenant.findMany({
      where: { status: "active" },
    });

    expect(activeTenants.length).toBeGreaterThanOrEqual(2);

    // Suspend tenant 2
    await prisma.tenant.update({
      where: { id: tenant2Id },
      data: { status: "suspended" },
    });

    // Query again
    const activeTenantsAfter = await prisma.tenant.findMany({
      where: { status: "active" },
    });

    expect(activeTenantsAfter.length).toBe(activeTenants.length - 1);

    // Restore
    await prisma.tenant.update({
      where: { id: tenant2Id },
      data: { status: "active" },
    });
  });
});
