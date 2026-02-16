import { redirect } from "next/navigation";

/**
 * Tenant Dashboard Root
 * 
 * Redirects to the default tenant entrypoint: /tenant/overview
 */
export default function TenantDashboardRoot() {
  redirect("/tenant/overview");
}
