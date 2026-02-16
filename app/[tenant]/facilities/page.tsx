import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building,
  FlaskConical,
  Computer,
  BookOpen,
  Heart,
  Users,
  Coffee,
  ShoppingCart,
  Church,
  UserCheck,
  Settings,
  Crown,
  Wifi,
  Camera,
} from "lucide-react";

export default function FasilitasPage() {
  const fasilitas = [
    {
      nama: "Ruang Kelas",
      deskripsi:
        "Ruang kelas yang representatif dengan fasilitas pembelajaran modern",
      icon: Building,
      kategori: "Akademik",
    },
    {
      nama: "Laboratorium IPA",
      deskripsi: "Laboratorium lengkap untuk praktikum mata pelajaran IPA",
      icon: FlaskConical,
      kategori: "Akademik",
    },
    {
      nama: "Laboratorium Komputer",
      deskripsi: "Lab komputer dengan perangkat terkini untuk pembelajaran TIK",
      icon: Computer,
      kategori: "Akademik",
    },
    {
      nama: "Perpustakaan",
      deskripsi: "Koleksi buku lengkap untuk mendukung kegiatan literasi siswa",
      icon: BookOpen,
      kategori: "Akademik",
    },
    {
      nama: "Ruang UKS",
      deskripsi: "Unit Kesehatan Sekolah untuk pelayanan kesehatan siswa",
      icon: Heart,
      kategori: "Penunjang",
    },
    {
      nama: "Ruang Bimbingan dan Konseling",
      deskripsi: "Ruang konseling untuk pembimbingan siswa",
      icon: Users,
      kategori: "Penunjang",
    },
    {
      nama: "Kantin",
      deskripsi: "Kantin sekolah dengan makanan sehat dan halal",
      icon: Coffee,
      kategori: "Penunjang",
    },
    {
      nama: "Koperasi Sekolah",
      deskripsi: "Koperasi untuk kebutuhan alat tulis dan perlengkapan sekolah",
      icon: ShoppingCart,
      kategori: "Penunjang",
    },
    {
      nama: "Masjid Agung Syuhada",
      deskripsi: "Masjid untuk kegiatan ibadah dan pembelajaran agama",
      icon: Church,
      kategori: "Keagamaan",
    },
    {
      nama: "Ruang Guru",
      deskripsi: "Ruang kerja untuk para guru dan tenaga pendidik",
      icon: UserCheck,
      kategori: "Administrasi",
    },
    {
      nama: "Ruang Tata Usaha",
      deskripsi: "Ruang administrasi dan pelayanan siswa",
      icon: Settings,
      kategori: "Administrasi",
    },
    {
      nama: "Ruang Kepala Sekolah",
      deskripsi: "Ruang kerja kepala sekolah dan ruang tamu",
      icon: Crown,
      kategori: "Administrasi",
    },
    {
      nama: "Free WiFi",
      deskripsi: "Akses internet gratis untuk mendukung pembelajaran digital",
      icon: Wifi,
      kategori: "Teknologi",
    },
    {
      nama: "CCTV",
      deskripsi: "Sistem keamanan dan monitoring area sekolah",
      icon: Camera,
      kategori: "Keamanan",
    },
  ];

  const kategoriFasilitas = {
    Akademik: fasilitas.filter((f) => f.kategori === "Akademik"),
    Penunjang: fasilitas.filter((f) => f.kategori === "Penunjang"),
    Keagamaan: fasilitas.filter((f) => f.kategori === "Keagamaan"),
    Administrasi: fasilitas.filter((f) => f.kategori === "Administrasi"),
    Teknologi: fasilitas.filter((f) => f.kategori === "Teknologi"),
    Keamanan: fasilitas.filter((f) => f.kategori === "Keamanan"),
  };

  return (
    <div>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Fasilitas Sekolah
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Fasilitas lengkap dan modern untuk mendukung kegiatan
                pembelajaran yang optimal
              </p>
            </div>
          </div>
        </section>

        {/* Facilities Overview */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              <Card className="text-center">
                <CardContent className="p-6">
                  <Building className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">4</h3>
                  <p className="text-muted-foreground text-sm">
                    Fasilitas Akademik
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">4</h3>
                  <p className="text-muted-foreground text-sm">
                    Fasilitas Penunjang
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <Church className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">1</h3>
                  <p className="text-muted-foreground text-sm">Masjid</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <Camera className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">2</h3>
                  <p className="text-muted-foreground text-sm">
                    Fasilitas Teknologi
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Facilities by Category */}
            <div className="space-y-12">
              {Object.entries(kategoriFasilitas).map(([kategori, items]) => (
                <div key={kategori}>
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    Fasilitas {kategori}
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((fasilitas, index) => (
                      <Card
                        key={index}
                        className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                      >
                        <CardHeader className="text-center pb-4">
                          <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit group-hover:bg-primary/20 transition-colors">
                            <fasilitas.icon className="h-8 w-8 text-primary" />
                          </div>
                          <CardTitle className="text-lg font-bold">
                            {fasilitas.nama}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground text-center text-sm leading-relaxed">
                            {fasilitas.deskripsi}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Location Advantage */}
            <Card className="mt-16">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">
                  Lokasi Strategis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-muted-foreground text-center mb-8 leading-relaxed">
                  Lokasi SMP IT Masjid Syuhada yang berdekatan dengan berbagai
                  lembaga pendukung pembelajaran
                </p>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Building className="h-8 w-8 text-primary" />
                    </div>
                    <h4 className="font-bold mb-2">RRI</h4>
                    <p className="text-sm text-muted-foreground">
                      Radio Republik Indonesia
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="h-8 w-8 text-primary" />
                    </div>
                    <h4 className="font-bold mb-2">Balai Bahasa</h4>
                    <p className="text-sm text-muted-foreground">
                      Pusat Pengembangan Bahasa
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <h4 className="font-bold mb-2">JSC</h4>
                    <p className="text-sm text-muted-foreground">
                      Jogja Study Center
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
    </div>
  );
}
