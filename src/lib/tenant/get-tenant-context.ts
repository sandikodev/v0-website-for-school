import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

/**
 * Get tenant context from request headers or session
 * 
 * Priority:
 * 1. Headers from proxy.ts (x-tenant-id, x-tenant-slug)
 * 2. User session tenant
 * 3. First tenant (fallback for development)
 */
export async function getTenantContext() {
  try {
    // 1. Try to get from proxy headers
    const headersList = await headers();
    const tenantId = headersList.get("x-tenant-id");
    const tenantSlug = headersList.get("x-tenant-slug");

    if (tenantId) {
      const tenant = await prisma.tenant.findUnique({
        where: { id: tenantId },
        include: {
          schools: {
            take: 1,
          },
        },
      });
      return tenant;
    }

    if (tenantSlug) {
      const tenant = await prisma.tenant.findUnique({
        where: { slug: tenantSlug },
        include: {
          schools: {
            take: 1,
          },
        },
      });
      return tenant;
    }

    // 2. Fallback: get first tenant (for development)
    const tenant = await prisma.tenant.findFirst({
      include: {
        schools: {
          take: 1,
        },
      },
    });

    return tenant;
  } catch (error) {
    console.error("[getTenantContext] Error:", error);
    return null;
  }
}

/**
 * Get tenant theme/branding
 */
export async function getTenantTheme() {
  const tenant = await getTenantContext();
  
  if (!tenant) {
    return {
      primaryColor: "#10b981",
      secondaryColor: "#059669",
      logo: null,
      favicon: null,
    };
  }

  return {
    primaryColor: tenant.primaryColor || "#10b981",
    secondaryColor: tenant.secondaryColor || "#059669",
    logo: tenant.logo,
    favicon: tenant.favicon,
  };
}
