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

            const anyArgs = args as Record<string, unknown>;

            // Filter queries by tenantId
            if (FILTER_ACTIONS.includes(operation)) {
              anyArgs.where = {
                ...(anyArgs.where as Record<string, unknown>),
                tenantId,
              };
              // console.log(`[RLS] ${model}.${operation} filtered by tenant:`, tenantId);
            }

            // Inject tenantId on create
            if (CREATE_ACTIONS.includes(operation)) {
              if (operation === "create") {
                anyArgs.data = {
                  ...(anyArgs.data as Record<string, unknown>),
                  tenantId,
                };
              } else if (operation === "createMany") {
                if (Array.isArray(anyArgs.data)) {
                  anyArgs.data = (anyArgs.data as unknown[]).map((item: unknown) => ({
                    ...(item as Record<string, unknown>),
                    tenantId,
                  }));
                }
              } else if (operation === "upsert") {
                anyArgs.create = {
                  ...(anyArgs.create as Record<string, unknown>),
                  tenantId,
                };
                anyArgs.update = {
                  ...(anyArgs.update as Record<string, unknown>),
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
export function createTenantPrismaClient<T extends { $extends: (...args: never[]) => unknown }>(
  prisma: T,
  tenantId: string
): ReturnType<T["$extends"]> {
  return prisma.$extends(getTenantExtension(tenantId)) as ReturnType<T["$extends"]>;
}

/**
 * Bypass tenant filtering for admin queries
 * Use with caution! Only for platform admin operations
 */
export function bypassTenantFilter<T>(prisma: T): T {
  // In extension-based approach, the base prisma client doesn't have the filter
  return prisma;
}

/**
 * Validate that a record belongs to the current tenant
 * Use this for extra security on sensitive operations
 */
export async function validateTenantOwnership(
  prisma: unknown,
  model: string,
  recordId: string,
  tenantId: string
): Promise<boolean> {
  try {
    const modelName = model.charAt(0).toLowerCase() + model.slice(1);
    const client = prisma as Record<string, { findUnique: (args: unknown) => Promise<Record<string, unknown> | null> }>;
    const record = await client[modelName].findUnique({
      where: { id: recordId },
      // Note: we can't easily type the select here due to dynamic model access
    });

    return record?.tenantId === tenantId;
  } catch (error) {
    console.error("[RLS] Error validating tenant ownership:", error);
    return false;
  }
}
