interface FeaturesSectionProps {
  tenant: Awaited<ReturnType<typeof import("@/lib/tenant/get-tenant-context").getTenantContext>>;
}

/**
 * Features Section - Keunggulan sekolah
 * Dapat dikustomisasi per tenant
 */
export function FeaturesSection({ tenant }: FeaturesSectionProps) {
  if (!tenant) return null;

  const features = [
    {
      icon: "🎓",
      title: "Kurikulum Berkualitas",
      description: "Mengintegrasikan kurikulum nasional dengan pendidikan karakter islami",
    },
    {
      icon: "👨‍🏫",
      title: "Tenaga Pengajar Profesional",
      description: "Guru-guru berpengalaman dan bersertifikat pendidik",
    },
    {
      icon: "🏢",
      title: "Fasilitas Modern",
      description: "Ruang kelas ber-AC, laboratorium, perpustakaan, dan masjid",
    },
    {
      icon: "🌐",
      title: "Teknologi Pembelajaran",
      description: "E-learning dan sistem manajemen sekolah terintegrasi",
    },
    {
      icon: "🏆",
      title: "Prestasi Gemilang",
      description: "Berbagai penghargaan akademik dan non-akademik",
    },
    {
      icon: "🤝",
      title: "Lingkungan Kondusif",
      description: "Suasana belajar yang nyaman dan mendukung perkembangan siswa",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">
          Keunggulan {tenant.name}
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Kami berkomitmen memberikan pendidikan terbaik untuk membentuk generasi yang cerdas, berkarakter, dan berakhlak mulia
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="p-6 rounded-lg border hover:shadow-lg transition-shadow"
              style={{
                borderColor: `${tenant.primaryColor}20`,
              }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 
                className="text-xl font-semibold mb-2"
                style={{ color: tenant.primaryColor || "#10b981" }}
              >
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
