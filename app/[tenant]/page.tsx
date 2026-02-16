import { HeroSection } from "@/components/hero-section";
import { ProgramsSection } from "@/components/programs-section";
import { getTenantContext } from "@/lib/tenant/get-tenant-context";
import { StatsSection } from "@/components/tenant/stats-section";
import { FeaturesSection } from "@/components/tenant/features-section";
import { CTASection } from "@/components/tenant/cta-section";

/**
 * Tenant Home Page
 * 
 * Halaman utama untuk tenant (sekolah) dengan branding dinamis.
 * Setiap tenant akan memiliki tampilan yang disesuaikan dengan:
 * - Logo dan warna brand
 * - Konten sekolah
 * - Informasi SPMB
 * 
 * Navigation dan Footer sudah ada di layout.tsx
 */
export default async function TenantHomePage() {
  const tenant = await getTenantContext();

  return (
    <>
      <HeroSection tenant={tenant} />
      
      <div id="programs-section">
        <ProgramsSection tenant={tenant} />
      </div>

      <StatsSection tenant={tenant} />
      
      <FeaturesSection tenant={tenant} />
      
      <CTASection tenant={tenant} />
    </>
  );
}
