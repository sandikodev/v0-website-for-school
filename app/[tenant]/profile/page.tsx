import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function ProfilPage() {
  return (
    <div>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Profil Sekolah
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Mengenal lebih dekat SMP Islam Terpadu Masjid Syuhada Yogyakarta
              </p>
            </div>
          </div>
        </section>

        {/* School Overview */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6">
                  SMP Islam Terpadu Masjid Syuhada
                </h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Sekolah Menengah Pertama Islam Terpadu Masjid Syuhada (SMP IT
                  Masjid Syuhada) Yogyakarta secara resmi berdiri pada tanggal
                  25 Maret 2004 seiring dengan adanya SK dari Dinas Pendidikan
                  dan Pengajaran Kota Yogyakarta Nomor 188/853 Tahun 2004.
                </p>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  SMP IT Masjid Syuhada berlindung dalam Yayasan Masjid dan
                  Asrama (YASMA) Syuhada Yogyakarta bersama dengan TK Masjid
                  Syuhada dan SD Masjid Syuhada Yogyakarta.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge variant="secondary" className="text-sm">
                    Terakreditasi A
                  </Badge>
                  <Badge variant="secondary" className="text-sm">
                    Sejak 2004
                  </Badge>
                  <Badge variant="secondary" className="text-sm">
                    Islam Terpadu
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl text-primary mx-auto mb-4">📅</div>
                    <h3 className="font-bold text-lg mb-2">Berdiri</h3>
                    <p className="text-muted-foreground">25 Maret 2004</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl text-primary mx-auto mb-4">🏆</div>
                    <h3 className="font-bold text-lg mb-2">Akreditasi</h3>
                    <p className="text-muted-foreground">A (2014)</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl text-primary mx-auto mb-4">👥</div>
                    <h3 className="font-bold text-lg mb-2">Tenaga Pendidik</h3>
                    <p className="text-muted-foreground">18 Guru + 5 Staff</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl text-primary mx-auto mb-4">📍</div>
                    <h3 className="font-bold text-lg mb-2">Lokasi</h3>
                    <p className="text-muted-foreground">
                      Kotabaru, Yogyakarta
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Quick Links to Other Pages */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span className="text-2xl">🎯</span>
                    <span>Visi & Misi</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Pelajari visi, misi, dan tujuan pendidikan di SMP IT Masjid
                    Syuhada.
                  </p>
                  <Link
                    href="/profile/vision-mission"
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    Selengkapnya →
                  </Link>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span className="text-2xl">🎓</span>
                    <span>Sejarah</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Perjalanan dan perkembangan sekolah dari tahun 2004 hingga
                    sekarang.
                  </p>
                  <Link
                    href="/profile/history"
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    Selengkapnya →
                  </Link>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span className="text-2xl">🏆</span>
                    <span>Prestasi</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Berbagai pencapaian dan prestasi yang telah diraih sekolah.
                  </p>
                  <Link
                    href="/academic"
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    Selengkapnya →
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
    </div>
  );
}
