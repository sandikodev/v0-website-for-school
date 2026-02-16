import { NextRequest, NextResponse } from "next/server";
import { getTenantContext } from "@/lib/tenant/get-tenant-context";

/**
 * Tenant type from getTenantContext
 */
export type TenantContext = Awaited<ReturnType<typeof getTenantContext>>;

/**
 * API Handler with tenant context
 */
export type TenantAPIHandler<TParams = unknown> = (
  request: NextRequest,
  context: {
    tenant: NonNullable<TenantContext>;
    params?: TParams;
  }
) => Promise<NextResponse>;

/**
 * Options for withTenantContext middleware
 */
export interface WithTenantContextOptions {
  /**
   * Whether tenant context is required
   * @default true
   */
  required?: boolean;

  /**
   * Custom error message when tenant not found
   */
  errorMessage?: string;
}

/**
 * Middleware to inject tenant context into API handlers
 * 
 * Usage:
 * ```typescript
 * export const GET = withTenantContext(async (request, { tenant }) => {
 *   // tenant is guaranteed to exist here
 *   const data = await prisma.model.findMany({
 *     where: { tenantId: tenant.id }
 *   });
 *   return NextResponse.json({ data });
 * });
 * ```
 * 
 * @param handler - API handler function
 * @param options - Configuration options
 * @returns Wrapped API handler with tenant context
 */
export function withTenantContext<TParams = unknown>(
  handler: TenantAPIHandler<TParams>,
  options: WithTenantContextOptions = {}
) {
  const { required = true, errorMessage } = options;

  return async (
    request: NextRequest,
    routeContext?: { params: TParams }
  ): Promise<NextResponse> => {
    try {
      // Get tenant context from session or headers (set by proxy)
      const tenant = await getTenantContext();

      // If tenant is required but not found, return error
      if (!tenant && required) {
        return NextResponse.json(
          {
            success: false,
            message: errorMessage || "Tenant context required",
            error: "NO_TENANT_CONTEXT",
          },
          { status: 403 }
        );
      }

      // Call handler with tenant context
      return handler(request, {
        tenant: tenant!,
        params: routeContext?.params,
      });
    } catch (error) {
      console.error("[withTenantContext] Error:", error);
      return NextResponse.json(
        {
          success: false,
          message: "Internal server error",
          error: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  };
}

/**
 * Middleware for optional tenant context
 * Handler will receive tenant as null if not found
 * 
 * Usage:
 * ```typescript
 * export const GET = withOptionalTenantContext(async (request, { tenant }) => {
 *   if (tenant) {
 *     // Tenant-specific logic
 *   } else {
 *     // Public/platform logic
 *   }
 * });
 * ```
 */
export function withOptionalTenantContext<TParams = unknown>(
  handler: (
    request: NextRequest,
    context: {
      tenant: TenantContext;
      params?: TParams;
    }
  ) => Promise<NextResponse>
) {
  return async (
    request: NextRequest,
    routeContext?: { params: TParams }
  ): Promise<NextResponse> => {
    try {
      const tenant = await getTenantContext();

      return handler(request, {
        tenant,
        params: routeContext?.params,
      });
    } catch (error) {
      console.error("[withOptionalTenantContext] Error:", error);
      return NextResponse.json(
        {
          success: false,
          message: "Internal server error",
          error: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  };
}
