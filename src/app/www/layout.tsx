import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AkseSekolah.id - Platform Manajemen Sekolah Indonesia",
  description: "Platform modern untuk manajemen penerimaan siswa baru, administrasi, dan komunikasi sekolah",
};

/**
 * WWW Layout - Platform Landing
 * 
 * Layout untuk halaman landing platform.
 * Minimal layout, bisa ditambahkan platform-specific nav/footer jika diperlukan.
 * 
 * Route: www folder
 * URL: aksesekolah.id atau www.aksesekolah.id
 */
export default function WWWLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* Optional: Add platform navigation/header here */}
      {children}
      {/* Optional: Add platform footer here */}
    </div>
  );
}
