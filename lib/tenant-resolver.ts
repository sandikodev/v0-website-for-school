/**
 * Tenant Resolver with Caching
 * 
 * Based on best practices from:
 * https://medium.com/@fatih_erdogann/building-a-multi-tenant-saas-on-next-js
 * 
 * Strategy: Cache first, DB fallback
 * - In-memory cache for fast lookups (sub-millisecond)
 * - TTL: 5 minutes (configurable)
 * - Invalidate on tenant updates
 */

import { prisma } from "@/lib/prisma";

interface TenantCache {
  id: string;
  slug: string;
  domain: string | null;
  name: string;
  status: string;
  statusReason: string | null;
  timestamp: number;
}

// In-memory cache (for single-server deployment)
// For multi-server: use Redis
const tenantCache = new Map<string, TenantCache>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Get tenant by hostname with caching
 * @param host - hostname from request (e.g., "tenant1.example.com" or "custom-domain.com")
 */
export async function getTenantByHost(host: string): Promise<TenantCache | null> {
  // 1. Check cache first
  const cached = tenantCache.get(host);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached;
  }

  // 2. Cache miss or expired - query database
  try {
    // In development, skip domain verification check
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    // Build OR conditions, filtering out null values
    const subdomain = extractSubdomain(host);
    const orConditions = [
      { domain: host },           // Custom domain
      { slug: host },             // Direct slug match (for development)
    ];
    
    // Only add subdomain condition if it's not null
    if (subdomain) {
      orConditions.push({ slug: subdomain });
    }
    
    const tenant = await prisma.tenant.findFirst({
      where: {
        OR: orConditions,
        ...(isDevelopment ? {} : {
          domainVerified: true,
          domainStatus: "active",
        }),
        isActive: true,
      },
      select: {
        id: true,
        slug: true,
        domain: true,
        name: true,
        status: true,
        statusReason: true,
      },
    });

    if (!tenant) {
      return null;
    }

    // 3. Update cache
    const cacheEntry: TenantCache = {
      ...tenant,
      timestamp: Date.now(),
    };
    
    tenantCache.set(host, cacheEntry);
    
    // Also cache by slug for subdomain lookups
    if (tenant.slug) {
      tenantCache.set(tenant.slug, cacheEntry);
    }

    return cacheEntry;
  } catch (error) {
    console.error("[TenantResolver] Database error:", error);
    return null;
  }
}

/**
 * Extract subdomain from hostname
 * @example "tenant1.example.com" -> "tenant1"
 * @example "example.com" -> null
 */
function extractSubdomain(host: string): string | null {
  const parts = host.split(".");
  
  // If only 2 parts (example.com), no subdomain
  if (parts.length <= 2) {
    return null;
  }
  
  // Return first part as subdomain
  return parts[0];
}

/**
 * Invalidate tenant cache
 * Call this when tenant data is updated
 */
export function invalidateTenantCache(tenantId: string, host?: string) {
  if (host) {
    tenantCache.delete(host);
  }
  
  // Clear all cache entries for this tenant
  for (const [key, value] of tenantCache.entries()) {
    if (value.id === tenantId) {
      tenantCache.delete(key);
    }
  }
}

/**
 * Clear all tenant cache
 * Use for debugging or forced refresh
 */
export function clearTenantCache() {
  tenantCache.clear();
}
