import type React from "react";

/**
 * Auth Layout
 * 
 * This layout wraps signin/signup pages and bypasses the parent (platform) layout auth check.
 * Auth pages should be publicly accessible.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // No auth check here - these pages are public
  return <>{children}</>;
}
