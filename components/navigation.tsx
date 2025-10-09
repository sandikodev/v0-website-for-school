"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
    // Check authentication status by checking API
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        setIsLoggedIn(response.ok)
      } catch (error) {
        setIsLoggedIn(false)
      }
    }
    checkAuth()
  }, [pathname])

  const navItems = [
    { href: "/", label: "Beranda" },
    { href: "/profile", label: "Profil" },
    { href: "/academic", label: "Akademik" },
    { href: "/staff", label: "Staff & Pengajar" },
    { href: "/facilities", label: "Fasilitas" },
    { href: "/admissions", label: "SPMB" },
    { href: "/contact", label: "Kontak" },
  ]

  return (
    <nav
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-sm" : "bg-background/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
              🎓
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-primary">SMP IT</span>
              <span className="text-xs text-muted-foreground">Masjid Syuhada</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-accent/50 hover:scale-105 ${
                  pathname === item.href ? "text-primary bg-accent/30" : "text-foreground hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Admin login/dashboard button */}
            <div className="ml-4 pl-4 border-l border-border">
              {isLoggedIn ? (
                <Link href="/admin/dashboard">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 bg-transparent"
                  >
                    👤 Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/signin">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 bg-transparent"
                  >
                    👤 Admin
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className="transition-transform duration-200 hover:scale-110"
            >
              {isOpen ? "✕" : "☰"}
            </Button>
          </div>
        </div>

        <div
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-card/95 backdrop-blur-sm rounded-lg mt-2 border shadow-lg">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-3 rounded-md font-medium transition-all duration-200 hover:bg-accent/50 hover:translate-x-2 ${
                  pathname === item.href
                    ? "text-primary bg-accent/30 border-l-4 border-primary"
                    : "text-foreground hover:text-primary"
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile admin access */}
            <div className="border-t border-border pt-2 mt-2">
              {isLoggedIn ? (
                <Link
                  href="/admin/dashboard"
                  className="block px-4 py-3 rounded-md font-medium text-emerald-600 hover:bg-emerald-50 hover:translate-x-2 transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  👤 Dashboard Admin
                </Link>
              ) : (
                <Link
                  href="/auth/signin"
                  className="block px-4 py-3 rounded-md font-medium text-emerald-600 hover:bg-emerald-50 hover:translate-x-2 transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  👤 Login Admin
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
