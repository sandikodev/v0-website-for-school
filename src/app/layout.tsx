import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Manrope } from "next/font/google";
import "@/app/globals.css";
import { ToastProvider } from "@/components/providers/toast-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeInitializer } from "@/components/ThemeInitializer";

const geist = GeistSans;

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "AkseSekolah.id - Platform Manajemen Sekolah Indonesia",
  description:
    "Platform modern untuk manajemen penerimaan siswa baru, administrasi, dan komunikasi sekolah",
  generator: "v0.app",
};

/**
 * Root Layout - Universal
 * 
 * Layout utama yang TRULY UNIVERSAL untuk semua routes:
 * - www (platform landing)
 * - platform (dashboard)
 * - tenant (school sites)
 * 
 * Hanya menyediakan providers global yang dibutuhkan semua routes:
 * - ThemeProvider (untuk dark/light mode)
 * - ToastProvider (untuk notifications)
 * - Font setup
 * 
 * Domain-specific logic ada di nested layouts:
 * - app/www/layout.tsx → Platform landing
 * - app/(platform)/layout.tsx → Dashboard
 * - app/[tenant]/layout.tsx → Tenant sites (Navigation, Footer, SchoolProvider)
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${geist.variable} ${manrope.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeInitializer />
          <ToastProvider />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
