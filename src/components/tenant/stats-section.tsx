import { prisma } from "@/lib/prisma";

interface StatsSectionProps {
  tenant: Awaited<ReturnType<typeof import("@/lib/tenant/get-tenant-context").getTenantContext>>;
}

/**
 * Stats Section - Menampilkan statistik sekolah
 * Dinamis berdasarkan data tenant
 */
export async function StatsSection({ tenant }: StatsSectionProps) {
  if (!tenant) return null;

  // Get real stats from database
  const [studentsCount, applicationsCount, messagesCount] = await Promise.all([
    prisma.student.count({
      where: { schoolId: tenant.schools[0]?.id },
    }),
    prisma.formSubmission.count({
      where: { schoolId: tenant.schools[0]?.id },
    }),
    prisma.contactMessage.count(),
  ]);

  const stats = [
    {
      label: "Siswa Aktif",
      value: studentsCount.toString(),
      icon: "👨‍🎓",
    },
    {
      label: "Pendaftar Tahun Ini",
      value: applicationsCount.toString(),
      icon: "📝",
    },
    {
      label: "Tingkat Kepuasan",
      value: "98%",
      icon: "⭐",
    },
    {
      label: "Tahun Berdiri",
      value: "2010",
      icon: "🏫",
    },
  ];

  return (
    <section 
      className="py-16 bg-gradient-to-r from-primary/10 to-secondary/10"
      style={{
        background: `linear-gradient(to right, ${tenant.primaryColor}15, ${tenant.secondaryColor}15)`,
      }}
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          {tenant.name} dalam Angka
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div 
                className="text-4xl font-bold mb-2"
                style={{ color: tenant.primaryColor || "#10b981" }}
              >
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
