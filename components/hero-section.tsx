import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export function HeroSection() {
  return (
    <div className="relative">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background min-h-[600px] md:min-h-[700px] flex items-center">
        <div className="absolute inset-0 bg-[url('/islamic-school-building-with-students.png')] bg-cover bg-center opacity-10"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6 md:space-y-8 text-center lg:text-left">
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight animate-fade-in">
                  SMP Islam Terpadu
                  <span className="text-primary block">Masjid Syuhada</span>
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground font-medium animate-fade-in-delay-1">
                  Mencetak Generasi Qurani
                </p>
                <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 animate-fade-in-delay-2">
                  Sekolah unggulan yang mewujudkan lulusan yang unggul, cerdas, kreatif, dan berakhlakul karimah melalui
                  pendidikan Islam terpadu.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-delay-3">
                <Button
                  size="lg"
                  className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 hover:scale-105 transition-transform duration-200"
                  asChild
                >
                  <Link href="/profile">Tentang Kami</Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 bg-transparent hover:scale-105 transition-transform duration-200"
                  asChild
                >
                  <Link href="/contact">Hubungi Kami</Link>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mt-8 lg:mt-0">
              <Card className="bg-card/50 backdrop-blur hover:bg-card/70 transition-all duration-300 hover:scale-105 hover:shadow-lg group">
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="text-4xl sm:text-5xl mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-200">
                    🏆
                  </div>
                  <h3 className="font-bold text-base sm:text-lg mb-2">Terakreditasi A</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Sejak tahun 2014</p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur hover:bg-card/70 transition-all duration-300 hover:scale-105 hover:shadow-lg group">
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="text-4xl sm:text-5xl mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-200">
                    👥
                  </div>
                  <h3 className="font-bold text-base sm:text-lg mb-2">18 Guru</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Berkualifikasi S1</p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur hover:bg-card/70 transition-all duration-300 hover:scale-105 hover:shadow-lg group">
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="text-4xl sm:text-5xl mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-200">
                    📖
                  </div>
                  <h3 className="font-bold text-base sm:text-lg mb-2">Program Tahfidz</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Hafalan Al-Quran</p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur hover:bg-card/70 transition-all duration-300 hover:scale-105 hover:shadow-lg group">
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="text-4xl sm:text-5xl mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-200">
                    ❤️
                  </div>
                  <h3 className="font-bold text-base sm:text-lg mb-2">Sejak 2004</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">20+ tahun pengalaman</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
