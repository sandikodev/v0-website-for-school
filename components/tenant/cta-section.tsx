import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CTASectionProps {
  tenant: Awaited<ReturnType<typeof import("@/lib/tenant/get-tenant-context").getTenantContext>>;
}

/**
 * CTA Section - Call to Action untuk pendaftaran
 * Dengan branding tenant
 */
export function CTASection({ tenant }: CTASectionProps) {
  if (!tenant) return null;

  return (
    <section 
      className="py-20 text-white"
      style={{
        background: `linear-gradient(135deg, ${tenant.primaryColor || "#10b981"}, ${tenant.secondaryColor || "#059669"})`,
      }}
    >
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-6">
          Siap Bergabung dengan {tenant.name}?
        </h2>
        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          Daftarkan putra-putri Anda sekarang dan berikan mereka pendidikan terbaik untuk masa depan yang gemilang
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            asChild 
            size="lg" 
            className="bg-white hover:bg-gray-100"
            style={{ color: tenant.primaryColor || "#10b981" }}
          >
            <Link href="/admissions">
              Daftar Sekarang
            </Link>
          </Button>
          
          <Button 
            asChild 
            size="lg" 
            variant="outline"
            className="border-white text-white hover:bg-white/10"
          >
            <Link href="/contact">
              Hubungi Kami
            </Link>
          </Button>
        </div>

        {/* Contact Info */}
        <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center text-sm opacity-90">
          {tenant.phone && (
            <div className="flex items-center gap-2 justify-center">
              <span>📞</span>
              <span>{tenant.phone}</span>
            </div>
          )}
          {tenant.email && (
            <div className="flex items-center gap-2 justify-center">
              <span>✉️</span>
              <span>{tenant.email}</span>
            </div>
          )}
          {tenant.address && (
            <div className="flex items-center gap-2 justify-center">
              <span>📍</span>
              <span>{tenant.address}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
