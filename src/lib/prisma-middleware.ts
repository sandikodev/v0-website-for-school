import { Prisma } from "@prisma/client";

/**
 * Prisma Middleware for Multi-Tenant Row-Level Security (RLS)
 * 
 * Automatically filters queries by tenantId to prevent data leaks
 * between tenants in shared database architecture.
 * 
 * Usage:
 * ```typescript
 * import { applyTenantMiddleware } from "@/lib/prisma-middleware";
 * applyTenantMiddleware(prisma, tenantId);
 * ```
 */

// Models that have tenantId field
const TENANT_MODELS = [
  "User",
  "School",
  "Student",
  "Application",
  "Message",
  "SchoolConfig",
  "InterviewSession",
  "InterviewResult",
  // Add more models as needed
];

// Actions that need tenantId filtering
const FILTER_ACTIONS = [
  "findUnique",
  "findFirst",
  "findMany",
  "count",
  "aggregate",
  "groupBy",
  "update",
  "updateMany",
  "delete",
  "deleteMany",
];

// Actions that need tenantId injection
const CREATE_ACTIONS = ["create", "createMany", "upsert"];

/**
 * Get tenant extension for Prisma client
 * This ensures all queries are scoped to the current tenant
 */
export function getTenantExtension(tenantId: string | null) {
  return Prisma.defineExtension((client) => {
    if (!tenantId) return client;

    return client.$extends({
      query: {
        $allModels: {
          async $allOperations({ model, operation, args, query }) {
            // Only apply to tenant-specific models
            if (!model || !TENANT_MODELS.includes(model)) {
              return query(args);
            }

            const anyArgs = args as any;

            // Filter queries by tenantId
            if (FILTER_ACTIONS.includes(operation)) {
              anyArgs.where = {
                ...anyArgs.where,
                tenantId,
              };
              // console.log(`[RLS] ${model}.${operation} filtered by tenant:`, tenantId);
            }

            // Inject tenantId on create
            if (CREATE_ACTIONS.includes(operation)) {
              if (operation === "create") {
                anyArgs.data = {
                  ...anyArgs.data,
                  tenantId,
                };
              } else if (operation === "createMany") {
                if (Array.isArray(anyArgs.data)) {
                  anyArgs.data = anyArgs.data.map((item: any) => ({
                    ...item,
                    tenantId,
                  }));
                }
              } else if (operation === "upsert") {
                anyArgs.create = {
                  ...anyArgs.create,
                  tenantId,
                };
                anyArgs.update = {
                  ...anyArgs.update,
                  tenantId,
                };
              }
              // console.log(`[RLS] ${model}.${operation} injected tenant:`, tenantId);
            }

            return query(args);
          },
        },
      },
    });
  });
}

/**
 * Create a tenant-scoped Prisma client
 * This is useful for API routes where you know the tenant context
 */
export function createTenantPrismaClient(
  prisma: any,
  tenantId: string
): any {
  return prisma.$extends(getTenantExtension(tenantId));
}

/**
 * Bypass tenant filtering for admin queries
 * Use with caution! Only for platform admin operations
 */
export function bypassTenantFilter(prisma: any): any {
  // In extension-based approach, the base prisma client doesn't have the filter
  return prisma;
}

/**
 * Validate that a record belongs to the current tenant
 * Use this for extra security on sensitive operations
 */
export async function validateTenantOwnership(
  prisma: any,
  model: string,
  recordId: string,
  tenantId: string
): Promise<boolean> {
  try {
    const record = await (prisma as any)[model.toLowerCase()].findUnique({
      where: { id: recordId },
      select: { tenantId: true },
    });

    return record?.tenantId === tenantId;
  } catch (error) {
    console.error("[RLS] Error validating tenant ownership:", error);
    return false;
  }
}
