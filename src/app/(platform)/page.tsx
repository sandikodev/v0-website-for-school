import { redirect } from "next/navigation";
import { getUserFromSession } from "@/lib/auth/get-user-from-session";

/**
 * Dashboard Root Page
 * 
 * Handles redirect based on user session:
 * - No session → /signin
 * - Admin → /admin
 * - Tenant user → /tenant
 */
export default async function DashboardRootPage() {
  const user = await getUserFromSession();

  // No session - redirect to signin
  if (!user) {
    redirect("/signin");
  }

  // Platform admin - redirect to admin dashboard
  if (user.role === "admin") {
    redirect("/admin");
  }

  // Tenant user - redirect to tenant dashboard
  if (user.tenantId) {
    redirect("/tenant");
  }

  // Fallback - redirect to signin
  redirect("/signin");
}
