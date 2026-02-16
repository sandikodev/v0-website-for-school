import { prisma } from "@/lib/prisma";

/**
 * Validate if a user has access to a specific tenant
 * 
 * Access rules:
 * - Platform admin (role: "admin") can access all tenants
 * - Tenant admin (role: "tenant_admin") can only access their own tenant
 * - Regular users (role: "user") can only access their own tenant
 * 
 * @param userId - User ID to check
 * @param tenantId - Tenant ID to validate access for
 * @returns true if user has access, false otherwise
 */
export async function validateTenantAccess(
  userId: string,
  tenantId: string
): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
        tenantId: true,
        isActive: true,
      },
    });

    if (!user) {
      console.warn(`[validateTenantAccess] User not found: ${userId}`);
      return false;
    }

    if (!user.isActive) {
      console.warn(`[validateTenantAccess] User is inactive: ${userId}`);
      return false;
    }

    // Platform admin can access all tenants
    if (user.role === "admin") {
      return true;
    }

    // Tenant admin and regular users can only access their own tenant
    if (user.tenantId === tenantId) {
      return true;
    }

    console.warn(
      `[validateTenantAccess] Access denied: User ${userId} (tenant: ${user.tenantId}) tried to access tenant ${tenantId}`
    );
    return false;
  } catch (error) {
    console.error("[validateTenantAccess] Error:", error);
    return false;
  }
}

/**
 * Get user's tenant ID
 * Returns null if user has no tenant or is platform admin
 * 
 * @param userId - User ID
 * @returns Tenant ID or null
 */
export async function getUserTenantId(
  userId: string
): Promise<string | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        tenantId: true,
        role: true,
      },
    });

    if (!user) {
      return null;
    }

    // Platform admin has no specific tenant
    if (user.role === "admin") {
      return null;
    }

    return user.tenantId;
  } catch (error) {
    console.error("[getUserTenantId] Error:", error);
    return null;
  }
}

/**
 * Check if user is platform admin
 * 
 * @param userId - User ID
 * @returns true if user is platform admin
 */
export async function isPlatformAdmin(userId: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        role: true,
        isActive: true,
      },
    });

    return user?.isActive && user?.role === "admin";
  } catch (error) {
    console.error("[isPlatformAdmin] Error:", error);
    return false;
  }
}

/**
 * Check if user is tenant admin
 * 
 * @param userId - User ID
 * @param tenantId - Tenant ID (optional, will check user's own tenant if not provided)
 * @returns true if user is tenant admin
 */
export async function isTenantAdmin(
  userId: string,
  tenantId?: string
): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        role: true,
        tenantId: true,
        isActive: true,
      },
    });

    if (!user?.isActive) {
      return false;
    }

    // Platform admin is also tenant admin
    if (user.role === "admin") {
      return true;
    }

    // Check if user is tenant_admin
    if (user.role === "tenant_admin") {
      // If tenantId provided, check if it matches
      if (tenantId) {
        return user.tenantId === tenantId;
      }
      // Otherwise, user is tenant admin of their own tenant
      return true;
    }

    return false;
  } catch (error) {
    console.error("[isTenantAdmin] Error:", error);
    return false;
  }
}
