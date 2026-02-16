import type React from "react";
import { getUserFromSession } from "@/lib/auth/get-user-from-session";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

// Force dynamic rendering - platform routes require authentication check
export const dynamic = 'force-dynamic';

/**
 * Platform Layout - Dashboard
 * 
 * Layout untuk semua halaman dashboard (admin & tenant) dan auth pages.
 * 
 * Auth Flow:
 * 1. Check if route is public (signin/signup) → Allow
 * 2. Check if user has session → If not, redirect to signin
 * 3. Nested layouts handle role-based access:
 *    - dashboard/admin/layout.tsx → Checks role="admin"
 *    - dashboard/tenant/layout.tsx → Checks tenantId
 * 
 * Route groups (platform) tidak mempengaruhi URL:
 * - (platform)/dashboard/admin/overview/page.tsx → URL: /admin/overview
 * - (platform)/dashboard/tenant/overview/page.tsx → URL: /tenant/overview
 * - (platform)/(auth)/signin/page.tsx → URL: /signin
 */
export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get current pathname from headers
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  
  console.log("[Platform Layout] Pathname:", pathname);

  // Public routes - no auth required
  const publicRoutes = ['/signin', '/signup'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  if (isPublicRoute) {
    console.log("[Platform Layout] Public route, allowing access");
    return (
      <div className="min-h-screen bg-background">
        {children}
      </div>
    );
  }

  // Protected routes - require authentication
  console.log("[Platform Layout] Protected route, checking auth...");
  const user = await getUserFromSession();

  if (!user) {
    console.log("[Platform Layout] No user session, redirecting to signin");
    redirect("/signin");
  }

  console.log("[Platform Layout] User authenticated:", { 
    id: user.id, 
    role: user.role, 
    tenantId: user.tenantId 
  });

  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
