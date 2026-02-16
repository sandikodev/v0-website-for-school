import { getUserFromSession } from "@/lib/auth/get-user-from-session";
import { redirect } from "next/navigation";
import { ProfileDropdown } from "@/components/dashboard/profile-dropdown";
import Link from "next/link";

// Force dynamic rendering - admin routes require authentication check on every request
export const dynamic = 'force-dynamic';

/**
 * Admin Dashboard Layout
 * 
 * Only accessible by platform admin (role="admin")
 * Provides navigation and layout for admin dashboard
 * 
 * Note: Auth check is done in parent (platform)/layout.tsx
 * This layout only checks role authorization
 */
export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("[Admin Layout] Checking role authorization...");
  const user = await getUserFromSession();

  // User should already be authenticated by parent layout
  // This is a safety check
  if (!user) {
    console.log("[Admin Layout] No user (should not happen), redirecting to signin");
    redirect("/signin");
  }

  console.log("[Admin Layout] User role:", user.role);

  // Only platform admin can access admin dashboard
  if (user.role !== "admin") {
    console.log("[Admin Layout] Not platform admin, redirecting to tenant dashboard");
    redirect("/tenant/overview");
  }

  console.log("[Admin Layout] Platform admin access granted");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Admin Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Platform Admin</h1>
            <p className="text-sm text-muted-foreground">
              Manage schools, users, and platform settings
            </p>
          </div>
          <ProfileDropdown user={user} />
        </div>

        {/* Admin Navigation */}
        <nav className="mb-6 border-b border-border">
          <ul className="flex space-x-6">
            <li>
              <Link
                href="/admin/overview"
                className="inline-block py-2 px-1 border-b-2 border-transparent hover:border-primary text-sm font-medium"
              >
                Overview
              </Link>
            </li>
            <li>
              <Link
                href="/admin/tenants"
                className="inline-block py-2 px-1 border-b-2 border-transparent hover:border-primary text-sm font-medium"
              >
                Schools
              </Link>
            </li>
            <li>
              <Link
                href="/admin/users"
                className="inline-block py-2 px-1 border-b-2 border-transparent hover:border-primary text-sm font-medium"
              >
                Users
              </Link>
            </li>
            <li>
              <Link
                href="/admin/settings"
                className="inline-block py-2 px-1 border-b-2 border-transparent hover:border-primary text-sm font-medium"
              >
                Settings
              </Link>
            </li>
          </ul>
        </nav>

        {/* Content */}
        {children}
      </div>
    </div>
  );
}
