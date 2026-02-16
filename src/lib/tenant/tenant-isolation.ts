import { prisma } from "@/lib/prisma";

/**
 * Get school ID for a tenant
 * Used for tenant isolation in queries
 * 
 * @param tenantId - Tenant ID
 * @returns School ID or null if not found
 */
export async function getSchoolIdForTenant(
  tenantId: string
): Promise<string | null> {
  try {
    const school = await prisma.school.findFirst({
      where: { tenantId },
      select: { id: true },
    });

    return school?.id || null;
  } catch (error) {
    console.error("[getSchoolIdForTenant] Error:", error);
    return null;
  }
}

/**
 * Get all school IDs for a tenant
 * For multi-school tenants (future feature)
 * 
 * @param tenantId - Tenant ID
 * @returns Array of school IDs
 */
export async function getSchoolIdsForTenant(
  tenantId: string
): Promise<string[]> {
  try {
    const schools = await prisma.school.findMany({
      where: { tenantId },
      select: { id: true },
    });

    return schools.map((s) => s.id);
  } catch (error) {
    console.error("[getSchoolIdsForTenant] Error:", error);
    return [];
  }
}

/**
 * Validate that a school belongs to a tenant
 * 
 * @param schoolId - School ID
 * @param tenantId - Tenant ID
 * @returns true if school belongs to tenant
 */
export async function validateSchoolBelongsToTenant(
  schoolId: string,
  tenantId: string
): Promise<boolean> {
  try {
    const school = await prisma.school.findFirst({
      where: {
        id: schoolId,
        tenantId,
      },
    });

    return !!school;
  } catch (error) {
    console.error("[validateSchoolBelongsToTenant] Error:", error);
    return false;
  }
}

/**
 * Validate that a student belongs to a tenant
 * 
 * @param studentId - Student ID
 * @param tenantId - Tenant ID
 * @returns true if student belongs to tenant
 */
export async function validateStudentBelongsToTenant(
  studentId: string,
  tenantId: string
): Promise<boolean> {
  try {
    const student = await prisma.student.findFirst({
      where: {
        id: studentId,
        school: {
          tenantId,
        },
      },
    });

    return !!student;
  } catch (error) {
    console.error("[validateStudentBelongsToTenant] Error:", error);
    return false;
  }
}

/**
 * Validate that a form submission belongs to a tenant
 * 
 * @param submissionId - Submission ID
 * @param tenantId - Tenant ID
 * @returns true if submission belongs to tenant
 */
export async function validateSubmissionBelongsToTenant(
  submissionId: string,
  tenantId: string
): Promise<boolean> {
  try {
    const submission = await prisma.formSubmission.findFirst({
      where: {
        id: submissionId,
        school: {
          tenantId,
        },
      },
    });

    return !!submission;
  } catch (error) {
    console.error("[validateSubmissionBelongsToTenant] Error:", error);
    return false;
  }
}

/**
 * Validate that a message belongs to a tenant
 * 
 * @param messageId - Message ID
 * @param tenantId - Tenant ID
 * @returns true if message belongs to tenant
 */
export async function validateMessageBelongsToTenant(
  messageId: string,
  tenantId: string
): Promise<boolean> {
  try {
    const message = await prisma.message.findFirst({
      where: {
        id: messageId,
        school: {
          tenantId,
        },
      },
    });

    return !!message;
  } catch (error) {
    console.error("[validateMessageBelongsToTenant] Error:", error);
    return false;
  }
}

/**
 * Get tenant-scoped where clause for school-related queries
 * 
 * Usage:
 * ```typescript
 * const where = getTenantWhereClause(tenantId);
 * const students = await prisma.student.findMany({ where });
 * ```
 * 
 * @param tenantId - Tenant ID
 * @returns Prisma where clause
 */
export function getTenantWhereClause(tenantId: string) {
  return {
    school: {
      tenantId,
    },
  };
}

/**
 * Get tenant-scoped where clause for direct tenant relationship
 * 
 * Usage:
 * ```typescript
 * const where = getDirectTenantWhereClause(tenantId);
 * const schools = await prisma.school.findMany({ where });
 * ```
 * 
 * @param tenantId - Tenant ID
 * @returns Prisma where clause
 */
export function getDirectTenantWhereClause(tenantId: string) {
  return {
    tenantId,
  };
}

/**
 * Validate that an interview form belongs to a tenant
 * 
 * @param formId - Interview Form ID
 * @param tenantId - Tenant ID
 * @returns true if form belongs to tenant
 */
export async function validateInterviewFormBelongsToTenant(
  formId: string,
  tenantId: string
): Promise<boolean> {
  try {
    const form = await prisma.interviewForm.findFirst({
      where: {
        id: formId,
        school: {
          tenantId,
        },
      },
    });

    return !!form;
  } catch (error) {
    console.error("[validateInterviewFormBelongsToTenant] Error:", error);
    return false;
  }
}

/**
 * Validate that an interview session belongs to a tenant
 * 
 * @param sessionId - Interview Session ID
 * @param tenantId - Tenant ID
 * @returns true if session belongs to tenant
 */
export async function validateInterviewSessionBelongsToTenant(
  sessionId: string,
  tenantId: string
): Promise<boolean> {
  try {
    const session = await prisma.interviewSession.findFirst({
      where: {
        id: sessionId,
        submission: {
          school: {
            tenantId,
          },
        },
      },
    });

    return !!session;
  } catch (error) {
    console.error("[validateInterviewSessionBelongsToTenant] Error:", error);
    return false;
  }
}
