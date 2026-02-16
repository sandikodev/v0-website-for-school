import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Platform Landing Page
 * URL: https://aksesekolah.id
 * 
 * Halaman utama untuk platform multi-tenant
 */
export default function PlatformHomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Platform Manajemen Sekolah
          <span className="block text-green-600 mt-2">Untuk Semua Institusi Pendidikan</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Kelola penerimaan siswa, administrasi, dan komunikasi sekolah Anda dalam satu platform modern dan mudah digunakan.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
            <Link href="/register">Daftar Sekarang</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/login">Masuk</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Fitur Unggulan</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon="🎓"
            title="Manajemen SPMB"
            description="Sistem penerimaan siswa baru yang terintegrasi dengan formulir dinamis dan interview online"
          />
          <FeatureCard
            icon="🌐"
            title="Multi-Tenant"
            description="Setiap sekolah mendapat subdomain atau custom domain sendiri dengan branding unik"
          />
          <FeatureCard
            icon="📊"
            title="Dashboard Analytics"
            description="Pantau statistik pendaftaran, siswa aktif, dan performa sekolah secara real-time"
          />
          <FeatureCard
            icon="💬"
            title="Komunikasi Terintegrasi"
            description="WhatsApp integration dan sistem pesan untuk komunikasi dengan calon siswa"
          />
          <FeatureCard
            icon="📝"
            title="Form Builder"
            description="Buat formulir pendaftaran custom sesuai kebutuhan sekolah Anda"
          />
          <FeatureCard
            icon="🔒"
            title="Aman & Terpercaya"
            description="Data terenkripsi dengan sistem autentikasi dan otorisasi yang robust"
          />
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-16 bg-gray-50 rounded-lg my-16">
        <h2 className="text-3xl font-bold text-center mb-12">Paket Berlangganan</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <PricingCard
            name="Starter"
            price="Gratis"
            features={[
              "Subdomain gratis",
              "Maksimal 100 siswa",
              "Form builder dasar",
              "Support email",
            ]}
          />
          <PricingCard
            name="Professional"
            price="Rp 500.000/bulan"
            features={[
              "Custom domain",
              "Unlimited siswa",
              "Advanced form builder",
              "WhatsApp integration",
              "Priority support",
            ]}
            highlighted
          />
          <PricingCard
            name="Enterprise"
            price="Custom"
            features={[
              "Semua fitur Professional",
              "Multi-sekolah",
              "API access",
              "Dedicated support",
              "Custom development",
            ]}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">Siap Memulai?</h2>
        <p className="text-xl text-gray-600 mb-8">
          Bergabunglah dengan ratusan sekolah yang sudah menggunakan platform kami
        </p>
        <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
          <Link href="/register">Coba Gratis 30 Hari</Link>
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2025 AkseSekolah.id - Platform Manajemen Sekolah Indonesia</p>
          <div className="flex gap-6 justify-center mt-4">
            <Link href="/about" className="hover:text-green-600">Tentang</Link>
            <Link href="/contact" className="hover:text-green-600">Kontak</Link>
            <Link href="/privacy" className="hover:text-green-600">Privasi</Link>
            <Link href="/terms" className="hover:text-green-600">Syarat & Ketentuan</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function PricingCard({ 
  name, 
  price, 
  features, 
  highlighted = false 
}: { 
  name: string; 
  price: string; 
  features: string[]; 
  highlighted?: boolean;
}) {
  return (
    <div className={`bg-white p-8 rounded-lg border-2 ${highlighted ? 'border-green-600 shadow-lg scale-105' : 'border-gray-200'}`}>
      {highlighted && (
        <div className="bg-green-600 text-white text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4">
          Paling Populer
        </div>
      )}
      <h3 className="text-2xl font-bold mb-2">{name}</h3>
      <div className="text-3xl font-bold text-green-600 mb-6">{price}</div>
      <ul className="space-y-3 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-green-600 mt-1">✓</span>
            <span className="text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>
      <Button 
        asChild 
        className={highlighted ? 'w-full bg-green-600 hover:bg-green-700' : 'w-full'} 
        variant={highlighted ? 'default' : 'outline'}
      >
        <Link href="/register">Pilih Paket</Link>
      </Button>
    </div>
  );
}
