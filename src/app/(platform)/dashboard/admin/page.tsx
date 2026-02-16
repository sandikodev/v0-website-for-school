import { redirect } from "next/navigation";

/**
 * Admin Dashboard Root
 * 
 * Redirects to the default admin entrypoint: /admin/overview
 */
export default function AdminDashboardRoot() {
  redirect("/admin/overview");
}
