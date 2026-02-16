/* eslint-disable react/no-unescaped-entities */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Eye, Compass, CheckCircle } from "lucide-react";

export default function VisiMisiPage() {
  const indikatorVisi = [
    "Unggul dalam mengamalkan ajaran agama islam sesuai dengan tuntunan Al Quran dan As Sunnah",
    "Unggul dalam prestasi bidang akademik dan non akademik",
    "Cerdas dalam menerapkan ilmu pengetahuan dan teknologi serta tetap berpijak pada jati diri bangsa",
    "Cerdas dalam memadukan nilai-nilai ajaran islam dalam Pendidikan",
    "Kreatif dalam meningkatkan potensi diri untuk berkreasi dan berinovasi",
    "Kreatif dalam mengembangkan lingkungan pembelajaran yang kondusif dan islami",
    "Kreatif dalam mengembangkan bakat dan kecakapan hidup (life skill)",
    "Membentuk dan menumbuhkan pribadi muslim yang berakhlakul karimah",
  ];

  const misiItems = [
    "Menanamkan aqidah yang lurus",
    "Menciptakan lingkungan dan budaya sekolah yang islami",
    "Menanamkan jiwa dakwah, toleransi, dan cinta tanah air",
    "Membina dan mengembangkan karakter peserta didik menjadi generasi muslim yang tangguh, amanah, dan beramar ma'ruf nahi mungkar",
    "Menyelenggarakan program unggulan dalam bidang kediniyahan yang terdiri dari Tahsin, tahfidz, dan Bahasa Arab",
    "Melaksanakan pengembangan kurikulum dalam upaya peningkatan mutu pendidikan bagi peserta didik",
    "Melaksanakan proses pembelajaran dan bimbingan yang optimal dalam upaya peningkatan ilmu dan prestasi peserta didik sesuai potensi yang dimilikinya",
    "Meningkatkan kreasi, prestasi, dan apresiasi dalam bidang kegiatan non-akademik",
    "Menumbuhkan budaya literasi",
    "Memfasilitasi peserta didik yang berkebutuhan khusus (slow learner)",
    "Meningkatkan kompetensi pendidik dan tenaga kependidikan",
    "Menjalin dan meningkatkan kerja sama dengan mitra sekolah",
    "Menanamkan jiwa kewirausahaan melalui pengembangan kecakapan hidup (life skill)",
  ];

  const tujuanItems = [
    "Seluruh peserta didik mampu beribadah sesuai dengan syariat",
    "Seluruh peserta didik menunjukkan karakter profil pelajar Pancasila yaitu beriman, bertakwa kepada Tuhan YME dan berakhlak mulia, berkebhinekaan global, mandiri, gotong royong, bernalar kritis dan kreatif",
    'Terwujudnya "School Wellbeing"',
    "Seluruh peserta didik menjadi seorang muslim yang pantang menyerah, tepercaya, berani menyampaikan kebenaran dan mencegah kemungkaran",
    "Seluruh peserta didik menjalankan ibadah wajib dan sunnah secara baik dan benar",
    "Seluruh peserta didik dapat membaca Al Quran dengan kaidah tajwid yang baik dan benar",
    "Terlaksananya pengembangan kurikulum yang kontinue menyesuaikan perkembangan zaman",
    "Guru mampu mengembangkan inovasi pembelajaran",
    "Meningkatkan pendampingan dan partisipasi peserta didik dalam lomba non akademik minimal meraih juara tingkat kota",
    "Meningkatkan nilai literasi dan numerasi sebesar 5 point dari tahun sebelumnya pada Asesmen Nasional",
    "Meningkatkan kemampuan bidang sains, teknologi informasi, dan komunikasi, bakat dan minat peserta didik",
    "Guru mampu memanfaatkan lingkungan sekolah dan mitra sekolah untuk mendukung proses pembelajaran",
    "Terlaksananya program kecakapan (life skill) untuk siswa",
  ];

  return (
    <div>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Visi & Misi
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Arah dan tujuan pendidikan SMP IT Masjid Syuhada Yogyakarta
              </p>
            </div>
          </div>
        </section>

        {/* Visi Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="mb-12">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <Eye className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-3xl font-bold">Visi</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <blockquote className="text-2xl md:text-3xl font-bold text-primary leading-relaxed mb-8">
                  "SMP IT Masjid Syuhada menjadi Sekolah Unggulan yang
                  Mewujudkan Lulusan yang Unggul, Cerdas, Kreatif, dan
                  Berakhlakul Karimah."
                </blockquote>

                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-6">Indikator Visi</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {indikatorVisi.map((indikator, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 text-left"
                      >
                        <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">
                          {indikator}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Misi Section */}
            <Card className="mb-12">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <Compass className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-3xl font-bold">Misi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {misiItems.map((misi, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="text-muted-foreground">{misi}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tujuan Section */}
            <Card>
              <CardHeader className="text-center pb-6">
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-3xl font-bold">Tujuan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground mb-8">
                  Sesuai dengan visi, misi sekolah, tujuan SMP IT Masjid Syuhada
                  Yogyakarta adalah mengantarkan peserta didik untuk:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {tujuanItems.map((tujuan, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{tujuan}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
    </div>
  );
}
