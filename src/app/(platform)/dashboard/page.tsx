import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/jwt";

export default async function DashboardRedirectPage() {
  const user = await getCurrentUser();

  // if (!user) {
  //   redirect("/signin");
  // }

  // // Redirect based on role
  // if (user.role === "admin") {
  //   redirect("/admin/dashboard");
  // } else if (user.role === "tenant_admin") {
  //   redirect("/tenant/overview");
  // } else {
  //   redirect("/tenant/overview");
  // }
  return "test halaman dashboard"
}
