import { DashboardMobileNav } from "@/components/site/dashboard-mobile-nav";
import { getUserFromSession } from "@/lib/auth/get-user-from-session";
import { redirect } from "next/navigation";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

// Force dynamic rendering - dashboard requires authentication check on every request
export const dynamic = 'force-dynamic';

/**
 * Tenant Dashboard Layout
 * 
 * Only accessible by tenant users (role="user" or "tenant_admin")
 * Provides navigation and layout for tenant dashboard
 * 
 * Note: Auth check is done in parent (platform)/layout.tsx
 * This layout only checks role and tenantId authorization
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("[Tenant Layout] Checking role authorization...");
  const user = await getUserFromSession();

  // User should already be authenticated by parent layout
  // This is a safety check
  if (!user) {
    console.log("[Tenant Layout] No user (should not happen), redirecting to signin");
    redirect("/signin");
  }

  console.log("[Tenant Layout] User:", { 
    role: user.role, 
    tenantId: user.tenantId 
  });

  // Platform admin should use admin dashboard
  if (user.role === "admin") {
    console.log("[Tenant Layout] Platform admin detected, redirecting to admin dashboard");
    redirect("/admin/overview");
  }

  // Tenant users must have tenantId
  if (!user.tenantId) {
    console.log("[Tenant Layout] No tenantId, user cannot access tenant dashboard");
    redirect("/signin");
  }

  console.log("[Tenant Layout] Tenant access granted");

  return (
    <main className="container mx-auto px-4 py-2 lg:py-4 pb-20 md:pb-6">
      <DashboardClient user={user} />
      {children}
      <DashboardMobileNav />
    </main>
  );
}
