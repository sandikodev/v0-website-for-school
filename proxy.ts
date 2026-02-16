import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getTenantByHost } from "@/lib/tenant-resolver";

/**
 * Proxy for multi-tenant domain routing (Next.js 16)
 * 
 * Based on best practices:
 * - Cache-first tenant resolution (sub-millisecond lookups)
 * - Lightweight auth check (cookie presence only)
 * - No heavy DB queries or business logic
 * 
 * Flow:
 * 1. Check if request needs tenant resolution
 * 2. Lightweight auth check (cookie exists?)
 * 3. Resolve tenant from cache/DB
 * 4. Add tenant context to headers
 */
export default async function proxy(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;

  console.log("[Proxy] Request:", {
    pathname,
    hostname,
    host: request.headers.get("host"),
    url: request.url,
  });

  // Skip proxy for API routes, static files, and Next.js internals
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  try {
    // Get platform domain from environment
    const platformDomain =
      process.env.NEXT_PUBLIC_PLATFORM_DOMAIN ||
      process.env.DOMAIN ||
      "aksesekolah.id";

    // Check if this is dashboard subdomain
    // Use Host header as source of truth
    const hostHeader = request.headers.get("host") || hostname;
    const hostWithoutPort = hostHeader.split(':')[0];
    
    const isDashboard = 
      hostWithoutPort === `dashboard.${platformDomain}` ||
      hostWithoutPort === "dashboard.aksesekolah.local";

    // IMPORTANT: Block dashboard routes (/admin, /tenant) from non-dashboard domains
    // Dashboard MUST be accessed via dashboard.aksesekolah.id subdomain only
    const isDashboardRoute = pathname.startsWith("/admin") || 
                            pathname.startsWith("/tenant");
    
    if (isDashboardRoute && !isDashboard) {
      console.log(`[Proxy] Blocking dashboard route ${pathname} from ${hostHeader}, redirecting to dashboard subdomain`);
      
      const dashboardUrl = new URL(request.url);
      dashboardUrl.hostname = `dashboard.${platformDomain}`;
      dashboardUrl.pathname = pathname;
      
      return NextResponse.redirect(dashboardUrl);
    }

    // Dashboard subdomain - rewrite to /dashboard route
    if (isDashboard) {
      console.log("[Proxy] Dashboard subdomain detected:", pathname);
      
      // Add pathname to headers for layout to check
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-pathname", pathname);

      // Rewrite dashboard routes to /dashboard prefix
      // Similar to how /www works for platform domain
      if (pathname.startsWith("/admin") || pathname.startsWith("/tenant")) {
        const url = request.nextUrl.clone();
        url.pathname = `/dashboard${pathname}`;
        
        console.log("[Proxy] Rewriting", pathname, "to", url.pathname);
        
        return NextResponse.rewrite(url, {
          request: {
            headers: requestHeaders,
          },
        });
      }

      // Auth routes (signin, signup) - no rewrite needed
      // They are in (platform)/(auth)/ which maps to /signin, /signup directly
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    // Skip proxy for auth routes on main domain
    if (pathname.startsWith("/signin") || pathname.startsWith("/signup")) {
      return NextResponse.next();
    }

    // Check if this is www or root platform domain
    const isWWW = hostWithoutPort === platformDomain || 
                  hostWithoutPort === `www.${platformDomain}` ||
                  hostWithoutPort === "localhost" ||
                  hostWithoutPort === "aksesekolah.local";

    console.log("[Proxy] Debug:", {
      hostHeader,
      hostWithoutPort,
      platformDomain,
      isWWW,
      pathname,
    });

    // If request is to platform domain (www), rewrite to /www route
    if (isWWW) {
      console.log("[Proxy] WWW detected, rewriting to /www route");
      
      // Rewrite root path to /www
      if (pathname === "/" || pathname.startsWith("/www")) {
        const url = request.nextUrl.clone();
        
        // If already /www, keep it
        if (pathname.startsWith("/www")) {
          return NextResponse.next();
        }
        
        // Rewrite / to /www
        url.pathname = `/www${pathname}`;
        return NextResponse.rewrite(url);
      }
      
      // For other paths on platform domain (like /login, /register), allow through
      return NextResponse.next();
    }

    // Check if it's a subdomain of platform (e.g., tenant1.aksesekolah.id)
    const isSubdomain = hostWithoutPort.endsWith(`.${platformDomain}`);
    
    if (isSubdomain) {
      // Extract subdomain slug
      const subdomain = hostWithoutPort.replace(`.${platformDomain}`, "");
      
      console.log("[Middleware] Tenant subdomain detected:", subdomain);
      
      // Resolve tenant by subdomain
      const tenant = await getTenantByHost(subdomain);
      
      if (tenant) {
        console.log("[Middleware] Tenant found:", tenant.slug, "status:", tenant.status);
        
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set("x-tenant-id", tenant.id);
        requestHeaders.set("x-tenant-slug", tenant.slug);
        requestHeaders.set("x-tenant-domain", tenant.domain || "");
        requestHeaders.set("x-tenant-name", tenant.name);
        requestHeaders.set("x-tenant-status", tenant.status || "active");
        if (tenant.statusReason) {
          requestHeaders.set("x-tenant-status-reason", tenant.statusReason);
        }

        // Check tenant status and redirect to appropriate error page
        const tenantStatus = tenant.status || "active";
        
        // Allow access to status pages themselves
        if (!pathname.startsWith("/suspended") && 
            !pathname.startsWith("/banned") && 
            !pathname.startsWith("/inactive")) {
          
          if (tenantStatus === "suspended") {
            const url = request.nextUrl.clone();
            url.pathname = `/${tenant.slug}/suspended`;
            return NextResponse.rewrite(url, {
              request: { headers: requestHeaders },
            });
          }
          
          if (tenantStatus === "banned") {
            const url = request.nextUrl.clone();
            url.pathname = `/${tenant.slug}/banned`;
            return NextResponse.rewrite(url, {
              request: { headers: requestHeaders },
            });
          }
          
          if (tenantStatus === "inactive") {
            const url = request.nextUrl.clone();
            url.pathname = `/${tenant.slug}/inactive`;
            return NextResponse.rewrite(url, {
              request: { headers: requestHeaders },
            });
          }
        }

        // Rewrite to [tenant] route
        const url = request.nextUrl.clone();
        url.pathname = `/${tenant.slug}${pathname}`;
        
        console.log("[Middleware] Rewriting to:", url.pathname);
        
        return NextResponse.rewrite(url, {
          request: {
            headers: requestHeaders,
          },
        });
      }
      
      console.log("[Middleware] Tenant not found for subdomain:", subdomain);
    }

    // Resolve tenant with caching (cache first, DB fallback)
    const tenant = await getTenantByHost(hostWithoutPort);

    // If tenant found, add tenant context to headers and rewrite
    if (tenant) {
      console.log("[Middleware] Tenant found by custom domain:", tenant.slug, "status:", tenant.status);
      
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-tenant-id", tenant.id);
      requestHeaders.set("x-tenant-slug", tenant.slug);
      requestHeaders.set("x-tenant-domain", tenant.domain || "");
      requestHeaders.set("x-tenant-name", tenant.name);
      requestHeaders.set("x-tenant-status", tenant.status || "active");
      if (tenant.statusReason) {
        requestHeaders.set("x-tenant-status-reason", tenant.statusReason);
      }

      // Check tenant status and redirect to appropriate error page
      const tenantStatus = tenant.status || "active";
      
      // Allow access to status pages themselves
      if (!pathname.startsWith("/suspended") && 
          !pathname.startsWith("/banned") && 
          !pathname.startsWith("/inactive")) {
        
        if (tenantStatus === "suspended") {
          const url = request.nextUrl.clone();
          url.pathname = `/${tenant.slug}/suspended`;
          return NextResponse.rewrite(url, {
            request: { headers: requestHeaders },
          });
        }
        
        if (tenantStatus === "banned") {
          const url = request.nextUrl.clone();
          url.pathname = `/${tenant.slug}/banned`;
          return NextResponse.rewrite(url, {
            request: { headers: requestHeaders },
          });
        }
        
        if (tenantStatus === "inactive") {
          const url = request.nextUrl.clone();
          url.pathname = `/${tenant.slug}/inactive`;
          return NextResponse.rewrite(url, {
            request: { headers: requestHeaders },
          });
        }
      }

      // Rewrite to [tenant] route
      const url = request.nextUrl.clone();
      url.pathname = `/${tenant.slug}${pathname}`;
      
      console.log("[Middleware] Rewriting to:", url.pathname);

      return NextResponse.rewrite(url, {
        request: {
          headers: requestHeaders,
        },
      });
    }

    // Legacy redirect for /staff path
    if (pathname === "/staff" && !request.nextUrl.searchParams.has("tab")) {
      const url = request.nextUrl.clone();
      url.searchParams.set("tab", "pimpinan");
      return NextResponse.redirect(url);
    }

    // No tenant found, proceed normally (could be platform admin access)
    return NextResponse.next();
  } catch (error) {
    console.error("[Proxy] Error in domain routing:", error);
    // On error, proceed normally
    return NextResponse.next();
  }
}

// Configure which paths should trigger proxy
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
