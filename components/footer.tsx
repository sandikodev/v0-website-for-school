"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-primary text-primary-foreground relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Logo & Description */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4 group">
              <div className="h-8 w-8 bg-primary-foreground/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                🎓
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg">SMP IT Masjid Syuhada</span>
                <span className="text-sm opacity-90">
                  Mencetak Generasi Qurani
                </span>
              </div>
            </Link>
            <p className="text-primary-foreground/80 mb-4 max-w-md leading-relaxed">
              Sekolah Menengah Pertama Islam Terpadu yang berkomitmen mewujudkan
              lulusan yang unggul, cerdas, kreatif, dan berakhlakul karimah.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2 hover:text-primary-foreground/90 transition-colors">
                <span className="text-base">🏆</span>
                <span>Terakreditasi A sejak 2014</span>
              </div>
              <div className="flex items-center space-x-2 hover:text-primary-foreground/90 transition-colors">
                <span className="text-base">👥</span>
                <span>18 Guru Berkualifikasi S1</span>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg mb-4">Kontak Kami</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2 hover:text-primary-foreground/90 transition-colors group">
                <span className="text-base mt-0.5 flex-shrink-0">📍</span>
                <span>
                  Jl. I Dewa Nyoman Oka No. 28, Kotabaru, Yogyakarta 55224
                </span>
              </div>
              <a
                href="tel:(0274)563972"
                className="flex items-center space-x-2 hover:text-primary-foreground/90 transition-colors group"
              >
                <span className="text-base">📞</span>
                <span>(0274) 563972</span>
              </a>
              <a
                href="mailto:info@smpitmasjidsyuhada.sch.id"
                className="flex items-center space-x-2 hover:text-primary-foreground/90 transition-colors group"
              >
                <span className="text-base">✉️</span>
                <span>info@smpitmasjidsyuhada.sch.id</span>
              </a>
              <div className="flex items-center space-x-2 hover:text-primary-foreground/90 transition-colors group">
                <span className="text-base">🕐</span>
                <span>Senin - Jumat: 07.00 - 14.30</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg mb-4">Tautan Cepat</h3>
            <div className="space-y-2 text-sm">
              <Link
                href="/profile"
                className="block hover:text-primary-foreground/80 hover:translate-x-1 transition-all duration-200"
              >
                Profil Sekolah
              </Link>
              <Link
                href="/academic"
                className="block hover:text-primary-foreground/80 hover:translate-x-1 transition-all duration-200"
              >
                Program Akademik
              </Link>
              <Link
                href="/staff"
                className="block hover:text-primary-foreground/80 hover:translate-x-1 transition-all duration-200"
              >
                Staff & Pengajar
              </Link>
              <Link
                href="/facilities"
                className="block hover:text-primary-foreground/80 hover:translate-x-1 transition-all duration-200"
              >
                Fasilitas
              </Link>
              <Link
                href="/admissions"
                className="block hover:text-primary-foreground/80 hover:translate-x-1 transition-all duration-200"
              >
                SPMB
              </Link>
              <Link
                href="/contact"
                className="block hover:text-primary-foreground/80 hover:translate-x-1 transition-all duration-200"
              >
                Hubungi Kami
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-6 md:pt-8 flex flex-col sm:flex-row justify-between items-center text-sm gap-4">
          <p>
            &copy; 2025 SMP IT Masjid Syuhada Yogyakarta. Semua hak dilindungi.
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={scrollToTop}
            className="text-primary-foreground hover:text-primary-foreground/80 hover:bg-primary-foreground/10 transition-all duration-200 hover:scale-105"
          >
            <span className="mr-2">⬆️</span>
            Kembali ke Atas
          </Button>
        </div>
      </div>
    </footer>
  );
}
