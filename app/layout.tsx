import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans";

import { Manrope } from "next/font/google"
import "./globals.css"
import { MobileBottomNav } from "@/components/site/mobile-nav"

const geist = GeistSans

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
})

export const metadata: Metadata = {
  title: "SMP IT Masjid Syuhada Yogyakarta",
  description: "Sekolah Menengah Pertama Islam Terpadu Masjid Syuhada - Mencetak Generasi Qurani",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className={`${geist.variable} ${manrope.variable} antialiased`}>
      <body className="font-sans">
        <div className="min-h-dvh pb-16 md:pb-0">{children}</div>
        <MobileBottomNav />
      </body>
    </html>
  )
}
