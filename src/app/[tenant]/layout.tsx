import type React from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { MobileBottomNav } from "@/components/site/mobile-nav";
import { SchoolProvider } from "@/app/providers/SchoolProvider";
import { getTenantContext, getTenantTheme } from "@/lib/tenant/get-tenant-context";
import { getSchoolConfig } from "@/lib/school/getSchoolConfig";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

/**
 * Tenant Layout - School Sites
 * 
 * Layout untuk semua halaman tenant (sekolah).
 * Menyediakan semua tenant-specific features:
 * - Navigation & Footer
 * - Mobile Bottom Nav
 * - School Provider (tenant context)
 * - Dynamic theming (colors, branding)
 * - Tenant metadata
 * 
 * Route: [tenant] dynamic segment
 * URL: tenant.aksesekolah.id/*
 */

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenantContext();

  return {
    title: tenant?.name || "Sekolah",
    description: `Website resmi ${tenant?.name || "sekolah"} - Informasi pendaftaran, program, dan fasilitas`,
    icons: {
      icon: tenant?.favicon || "/favicon.ico",
    },
  };
}

export default async function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get tenant context from headers (set by middleware)
  const tenant = await getTenantContext();
  const theme = await getTenantTheme();
  const schoolConfig = await getSchoolConfig();

  // Redirect if no tenant in production
  if (!tenant && process.env.NODE_ENV === "production") {
    redirect("/");
  }

  return (
    <div
      style={{
        ["--primary" as string]: theme.primaryColor,
        ["--secondary" as string]: theme.secondaryColor,
      }}
    >
      <SchoolProvider initialConfig={schoolConfig}>
        <Navigation />
        <main className="min-h-dvh pb-16 md:pb-0">
          {children}
        </main>
        <Footer />
        <MobileBottomNav />
      </SchoolProvider>
    </div>
  );
}
