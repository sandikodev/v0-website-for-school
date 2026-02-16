import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProgramsSection() {
  const programs = [
    {
      icon: "📖",
      title: "Program Tahfidz",
      description:
        "Program hafalan Al-Quran dengan metode pembelajaran yang sistematis dan berkelanjutan untuk semua tingkatan kelas.",
    },
    {
      icon: "👥",
      title: "Pendidikan Karakter",
      description:
        "Pembentukan akhlakul karimah melalui pembiasaan ibadah, salam senyum sapa, dan kegiatan keagamaan.",
    },
    {
      icon: "🌍",
      title: "Kurikulum Terintegrasi",
      description:
        "Perpaduan kurikulum nasional dengan kurikulum agama Islam untuk menghasilkan lulusan yang seimbang.",
    },
    {
      icon: "⚡",
      title: "Kegiatan Ekstrakurikuler",
      description:
        "Beragam kegiatan pengembangan bakat dan minat siswa dalam bidang akademik dan non-akademik.",
    },
    {
      icon: "❤️",
      title: "Lingkungan Islami",
      description:
        "Suasana sekolah yang kondusif dengan nilai-nilai Islam dalam setiap aspek kehidupan sekolah.",
    },
    {
      icon: "⭐",
      title: "Prestasi Unggul",
      description:
        "Pencapaian prestasi tingkat kota dan provinsi dalam berbagai bidang lomba dan kompetisi.",
    },
  ];

  return (
    <section className="py-12 md:py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 tablet-optimized">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 animate-fade-in">
            Program Unggulan Kami
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in-delay-1">
            SMP IT Masjid Syuhada menawarkan berbagai program unggulan yang
            dirancang untuk mengembangkan potensi siswa secara optimal dalam
            aspek akademik, spiritual, dan karakter.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {programs.map((program, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 bg-card/80 backdrop-blur-sm border-2 hover:border-primary/20 animate-stagger"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="text-center pb-4 card-mobile-padding">
                <div className="mx-auto mb-4 p-3 sm:p-4 bg-primary/10 rounded-full w-fit group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <div className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-300">
                    {program.icon}
                  </div>
                </div>
                <CardTitle className="text-lg sm:text-xl font-bold group-hover:text-primary transition-colors duration-200">
                  {program.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="card-mobile-padding">
                <p className="text-muted-foreground text-center leading-relaxed text-sm sm:text-base group-hover:text-foreground transition-colors duration-200">
                  {program.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
