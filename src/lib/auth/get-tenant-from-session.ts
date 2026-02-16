import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

/**
 * Get tenant from user session
 * Returns the tenant associated with the current user session
 */
export async function getTenantFromSession() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("user-session");

    if (!sessionCookie) {
      return null;
    }

    const session = JSON.parse(sessionCookie.value);

    // Get user with tenant information
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        tenantId: true,
        tenant: {
          select: {
            id: true,
            name: true,
            slug: true,
            domain: true,
            domainStatus: true,
            domainVerified: true,
            isActive: true,
          },
        },
      },
    });

    if (!user || !user.isActive) {
      return null;
    }

    // Return tenant if exists and active
    if (user.tenant && user.tenant.isActive) {
      return user.tenant;
    }

    // If user doesn't have tenant, try to find default tenant
    // This is for backward compatibility
    const defaultTenant = await prisma.tenant.findFirst({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        domain: true,
        domainStatus: true,
        domainVerified: true,
        isActive: true,
      },
    });

    return defaultTenant;
  } catch (error) {
    console.error("Error getting tenant from session:", error);
    return null;
  }
}

/**
 * Get tenant ID from user session
 */
export async function getTenantIdFromSession(): Promise<string | null> {
  const tenant = await getTenantFromSession();
  return tenant?.id || null;
}

