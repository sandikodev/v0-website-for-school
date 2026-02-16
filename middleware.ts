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
    // Get platform domain from environment, with smart local fallback
    const hostHeader = request.headers.get("host") || hostname;
    const hostWithoutPort = hostHeader.split(":")[0];

    let platformDomain =
      process.env.NEXT_PUBLIC_PLATFORM_DOMAIN ||
      process.env.DOMAIN ||
      "aksesekolah.id";

    // Smart detection for local development
    if (hostWithoutPort.endsWith(".local") && platformDomain === "aksesekolah.id") {
      platformDomain = "aksesekolah.local";
    }

    // IMPORTANT: Always set x-pathname header for layouts to use
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-pathname", pathname);

    // Check if this is dashboard subdomain
    // Use Host header as source of truth
    const isDashboard =
      hostWithoutPort === `dashboard.${platformDomain}` ||
      hostWithoutPort === "dashboard.aksesekolah.local" ||
      hostWithoutPort === "dashboard.localhost";

    // IMPORTANT: Block dashboard routes (/admin, /tenant) from non-dashboard domains
    // Dashboard MUST be accessed via dashboard.aksesekolah.id subdomain only
    const isDashboardRoute = pathname.startsWith("/admin") || pathname.startsWith("/dashboard");

    if (isDashboardRoute && !isDashboard) {
      console.log(`[Proxy] Blocking dashboard route ${pathname} from ${hostHeader}, redirecting to dashboard subdomain`);

      const dashboardUrl = new URL(request.url);
      dashboardUrl.hostname = hostWithoutPort.includes(".local")
        ? "dashboard.aksesekolah.local"
        : `dashboard.${platformDomain}`;
      dashboardUrl.pathname = pathname;

      return NextResponse.redirect(dashboardUrl);
    }

    // Dashboard subdomain - rewrite to /dashboard route
    if (isDashboard) {
      console.log("[Proxy] Dashboard subdomain detected:", pathname);

      // Rewrite dashboard routes to /dashboard prefix
      if (pathname.startsWith("/admin") || pathname.startsWith("/tenant") || pathname === "/") {
        const url = request.nextUrl.clone();
        const targetPath = pathname === "/" ? "/admin" : pathname;
        url.pathname = `/dashboard${targetPath}`;

        console.log("[Proxy] Rewriting", pathname, "to", url.pathname);

        return NextResponse.rewrite(url, {
          request: {
            headers: requestHeaders,
          },
        });
      }

      // Auth routes (signin, signup) or other dashboard paths
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    // Auth routes - allow through but with headers
    if (pathname.startsWith("/signin") || pathname.startsWith("/signup")) {
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    // Check if this is www or root platform domain
    const isWWW =
      hostWithoutPort === platformDomain ||
      hostWithoutPort === `www.${platformDomain}` ||
      hostWithoutPort === "localhost" ||
      hostWithoutPort === "aksesekolah.local" ||
      hostWithoutPort === "www.aksesekolah.local";

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
          return NextResponse.next({
            request: { headers: requestHeaders },
          });
        }

        // Rewrite / to /www
        url.pathname = `/www${pathname}`;
        return NextResponse.rewrite(url, {
          request: { headers: requestHeaders },
        });
      }

      // For other paths on platform domain, allow through
      return NextResponse.next({
        request: { headers: requestHeaders },
      });
    }

    const isSubdomain = hostWithoutPort.endsWith(`.${platformDomain}`);

    if (isSubdomain) {
      const subdomain = hostWithoutPort.replace(`.${platformDomain}`, "");
      console.log("[Proxy] Subdomain detected:", subdomain);

      // Add tenant context to headers (middleware can't query SQLite reliably)
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-tenant-slug", subdomain);
      requestHeaders.set("x-pathname", pathname);

      // Rewrite to [tenant] route
      const url = request.nextUrl.clone();
      url.pathname = `/${subdomain}${pathname}`;

      console.log("[Proxy] Rewriting to:", url.pathname);

      return NextResponse.rewrite(url, {
        request: {
          headers: requestHeaders,
        },
      });
    }

    // Check for custom domains (non-platform domains)
    if (!isWWW && !isDashboard) {
      console.log("[Proxy] Custom domain detected:", hostWithoutPort);

      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-tenant-domain", hostWithoutPort);
      requestHeaders.set("x-pathname", pathname);

      // We don't know the slug yet, but we can't query DB here.
      // We pass the domain to the layout which will resolve the tenant.
      // For custom domains, we might need a special route or handle it in root layout.
      return NextResponse.next({
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
