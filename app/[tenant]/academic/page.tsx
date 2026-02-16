import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Clock,
  Users,
  Award,
  Heart,
  Globe,
  Zap,
  Calendar,
  CheckCircle,
  Star,
  Target,
} from "lucide-react";

export default function AkademikPage() {
  const mataPelajaran = [
    "Pendidikan Agama Islam (Fiqih, Qur'an Hadist, Aqidah Ahlaq, Tarih/Sejarah Kebudayaan Islam)",
    "Pendidikan Kewarganegaraan",
    "Bahasa Indonesia",
    "Bahasa Inggris",
    "Matematika",
    "Ilmu Pengetahuan Alam",
    "Ilmu Pengetahuan Sosial",
    "Pendidikan Jasmani dan Kesehatan/Olahraga",
    "Seni Budaya",
    "Prakarya",
    "Bahasa Arab",
    "Bahasa Jawa",
    "Tahfidzul Qur'an (Tahfiz)",
    "Informatika / TIK",
  ];

  const kegiatanKesiswaan = [
    "Fieldtrip",
    "Outbond",
    "Perkemahan",
    "AMT (Achieved Motivation Training)",
    "Manasik Haji",
    "Wide Game",
    "Pesantren Ramadhan",
    "Kunjungan Belajar",
    "Karya Wisata",
    "Rihlah",
    "Mabit",
  ];

  const kegiatanPembiasaan = [
    {
      kegiatan: "Sholat Dhuha, dzikir pagi, dan Sholat Dhuhur berjamaah",
      icon: Heart,
    },
    {
      kegiatan: "Kegiatan Baca Tulis Al Quran (BTAQ)",
      icon: BookOpen,
    },
    {
      kegiatan: "Salam Senyum Sapa (S3)",
      icon: Users,
    },
    {
      kegiatan: "Semutlis (Sepuluh menit untuk lingkungan sekitar)",
      icon: Globe,
    },
    {
      kegiatan: "Adiwiyata (setiap Jum'at pekan ke-2)",
      icon: Globe,
    },
    {
      kegiatan: "Literasi (setiap Jum'at pekan ke-3)",
      icon: BookOpen,
    },
    {
      kegiatan: "Jalan sehat (setiap Jum'at pekan ke-4)",
      icon: Zap,
    },
  ];

  return (
    <div>
        {/* Hero Section */}
        <section className="bg-linear-to-br from-primary/10 via-primary/5 to-background py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Program Akademik
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Kurikulum terpadu dan program unggulan untuk mengembangkan
                potensi siswa secara optimal
              </p>
            </div>
          </div>
        </section>

        {/* Academic Overview */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              <Card className="text-center">
                <CardContent className="p-8">
                  <Clock className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Jam Belajar</h3>
                  <p className="text-muted-foreground mb-4">
                    07.00 - 14.30 WIB
                  </p>
                  <Badge variant="secondary">5 Hari Kerja</Badge>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-8">
                  <BookOpen className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Kurikulum</h3>
                  <p className="text-muted-foreground mb-4">
                    Merdeka + Islam Terpadu
                  </p>
                  <Badge variant="secondary">Terintegrasi</Badge>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-8">
                  <Award className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Program Unggulan</h3>
                  <p className="text-muted-foreground mb-4">Tahfidz & Tahsin</p>
                  <Badge variant="secondary">Berkelanjutan</Badge>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Academic Information */}
            <Tabs defaultValue="kurikulum" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="kurikulum">Kurikulum</TabsTrigger>
                <TabsTrigger value="tahfidz">Tahfidz & Tahsin</TabsTrigger>
                <TabsTrigger value="kegiatan">Kegiatan Siswa</TabsTrigger>
                <TabsTrigger value="pembiasaan">Pembiasaan</TabsTrigger>
              </TabsList>

              <TabsContent value="kurikulum" className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold flex items-center space-x-2">
                      <BookOpen className="h-6 w-6 text-primary" />
                      <span>Kurikulum Terintegrasi</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Kurikulum yang dikembangkan adalah{" "}
                      <strong>Kurikulum Nasional</strong> (saat ini berlaku
                      Kurikulum Merdeka) dan diintegrasikan dengan{" "}
                      <strong>kurikulum Agama Islam</strong>. Pembelajaran
                      dimulai pada pukul 07.00 dan selesai pada pukul 14.30
                      dilanjutkan dengan kegiatan ekstrakurikuler.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-xl font-bold mb-4">
                          Mata Pelajaran
                        </h3>
                        <div className="space-y-2">
                          {mataPelajaran.map((mapel, index) => (
                            <div
                              key={index}
                              className="flex items-start space-x-2"
                            >
                              <CheckCircle className="h-4 w-4 text-primary mt-1 shrink-0" />
                              <span className="text-sm text-muted-foreground">
                                {mapel}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold mb-4">Projek P5</h3>
                        <Card className="bg-muted/30">
                          <CardContent className="p-6">
                            <h4 className="font-bold mb-3">
                              Projek Penguatan Profil Pelajar Pancasila (P5)
                            </h4>
                            <p className="text-sm text-muted-foreground mb-4">
                              Kegiatan pengembangan dan peningkatan kompetensi
                              peserta didik serta penguatan karakter peserta
                              didik melalui tema-tema kontekstual dan
                              kontemporer.
                            </p>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Target className="h-4 w-4 text-primary" />
                                <span className="text-sm">
                                  Berpikir kritis dan solutif
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Target className="h-4 w-4 text-primary" />
                                <span className="text-sm">
                                  Kreatif dan inovatif
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Target className="h-4 w-4 text-primary" />
                                <span className="text-sm">
                                  Tanggap terhadap isu lingkungan
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tahfidz" className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl font-bold flex items-center space-x-2">
                        <BookOpen className="h-6 w-6 text-primary" />
                        <span>Program Tahsin</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        Program Tahsin Tilawah Qur&apos;an bertujuan
                        mengantarkan peserta didik memiliki kemampuan membaca Al
                        Quran dengan tartil sesuai kaidah ilmu tajwid.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span className="text-sm">
                            Pembelajaran berkelanjutan
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span className="text-sm">Sesuai kaidah tajwid</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span className="text-sm">Untuk semua tingkatan</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl font-bold flex items-center space-x-2">
                        <Star className="h-6 w-6 text-primary" />
                        <span>Program Tahfidz</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        Program Tahfidzul Qur&apos;an bertujuan mengantarkan
                        peserta didik memiliki hafalan Qur&apos;an dengan sistem
                        pembelajaran yang terstruktur.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span className="text-sm">
                            Target pencapaian jelas
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span className="text-sm">
                            Metode pembelajaran sistematis
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span className="text-sm">
                            Pembimbing berpengalaman
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">
                      Desain Pembelajaran
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6">
                      Sistem pembelajaran Tahsin dan Tahfidz Qur&apos;an
                      berkelanjutan yang didesain untuk kebutuhan semua
                      tingkatan dari kelas VII sampai dengan kelas IX dengan
                      mengacu kepada:
                    </p>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Target className="h-8 w-8 text-primary" />
                        </div>
                        <h4 className="font-bold mb-2">Tujuan & Kompetensi</h4>
                        <p className="text-sm text-muted-foreground">
                          Pembelajaran yang jelas dan terukur
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <BookOpen className="h-8 w-8 text-primary" />
                        </div>
                        <h4 className="font-bold mb-2">Desain Pembelajaran</h4>
                        <p className="text-sm text-muted-foreground">
                          Metode yang efektif dan menyenangkan
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Award className="h-8 w-8 text-primary" />
                        </div>
                        <h4 className="font-bold mb-2">Target Pencapaian</h4>
                        <p className="text-sm text-muted-foreground">
                          Evaluasi berkala dan berkelanjutan
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="kegiatan" className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold flex items-center space-x-2">
                      <Users className="h-6 w-6 text-primary" />
                      <span>Kegiatan Kesiswaan</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg text-muted-foreground mb-8">
                      Berbagai kegiatan pengembangan karakter dan keterampilan
                      siswa yang dirancang untuk memberikan pengalaman belajar
                      yang bermakna dan menyenangkan.
                    </p>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {kegiatanKesiswaan.map((kegiatan, index) => (
                        <Card
                          key={index}
                          className="bg-muted/30 hover:bg-muted/50 transition-colors"
                        >
                          <CardContent className="p-4 text-center">
                            <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
                            <h4 className="font-semibold">{kegiatan}</h4>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pembiasaan" className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold flex items-center space-x-2">
                      <Heart className="h-6 w-6 text-primary" />
                      <span>Kegiatan Pembiasaan</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg text-muted-foreground mb-8">
                      Kegiatan rutin yang dilaksanakan untuk membentuk karakter
                      dan kebiasaan positif siswa dalam kehidupan sehari-hari di
                      sekolah.
                    </p>
                    <div className="space-y-4">
                      {kegiatanPembiasaan.map((item, index) => (
                        <Card key={index} className="bg-muted/30">
                          <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                                <item.icon className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-lg">
                                  {item.kegiatan}
                                </h4>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
    </div>
  );
}
