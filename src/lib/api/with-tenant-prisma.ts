import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "@/lib/auth/get-user-from-session";
import { applyTenantMiddleware } from "@/lib/prisma-middleware";

/**
 * Get tenant-scoped Prisma client for API routes
 * 
 * This ensures all database queries are automatically filtered by tenantId
 * to prevent data leaks between tenants.
 * 
 * Usage:
 * ```typescript
 * export async function GET(request: NextRequest) {
 *   const { prisma: tenantPrisma, tenant, user } = await withTenantPrisma(request);
 *   
 *   // All queries are automatically scoped to tenant
 *   const students = await tenantPrisma.student.findMany();
 *   
 *   return NextResponse.json({ students });
 * }
 * ```
 */
export async function withTenantPrisma(request: NextRequest) {
  // Get user from session
  const user = await getUserFromSession();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Get tenant from user or headers
  let tenantId = user.tenantId;

  // If no tenantId in user, try headers (for subdomain routing)
  if (!tenantId) {
    tenantId = request.headers.get("x-tenant-id");
  }

  if (!tenantId) {
    throw new Error("No tenant context");
  }

  // Get tenant info
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
  });

  if (!tenant) {
    throw new Error("Tenant not found");
  }

  // Check tenant status
  if (tenant.status !== "active") {
    throw new Error(`Tenant is ${tenant.status}`);
  }

  // Create tenant-scoped Prisma client
  const tenantPrisma = Object.create(prisma);
  applyTenantMiddleware(tenantPrisma, tenantId);

  return {
    prisma: tenantPrisma,
    tenant,
    user,
    tenantId,
  };
}

/**
 * Get admin Prisma client (no tenant filtering)
 * Only for platform admin operations
 */
export async function withAdminPrisma(_request: NextRequest) {
  const user = await getUserFromSession();

  if (!user || user.role !== "admin") {
    throw new Error("Unauthorized: Admin access required");
  }

  return {
    prisma, // No middleware, full access
    user,
  };
}
