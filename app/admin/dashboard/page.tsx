"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

const mockSchoolData = {
  profile: {
    name: "SMP IT Masjid Syuhada",
    foundedYear: "2010",
    address: "Jl. Masjid Syuhada No. 123, Yogyakarta",
    phone: "0274-123456",
    email: "info@smpitsyuhada.sch.id",
    website: "www.smpitsyuhada.sch.id",
  },
  visionMission: {
    vision:
      "Menjadi lembaga pendidikan Islam terpadu yang unggul dalam prestasi, berakhlak mulia, dan berwawasan global.",
    mission: [
      "Menyelenggarakan pendidikan Islam terpadu yang berkualitas",
      "Membentuk generasi yang beriman, bertakwa, dan berakhlak mulia",
      "Mengembangkan potensi siswa secara optimal",
      "Menciptakan lingkungan belajar yang kondusif dan Islami",
    ],
  },
  facilities: [
    { id: 1, name: "Masjid", description: "Masjid untuk kegiatan ibadah dan pembelajaran agama", status: "Tersedia" },
    { id: 2, name: "Laboratorium Komputer", description: "Lab komputer dengan 30 unit PC", status: "Tersedia" },
    { id: 3, name: "Perpustakaan", description: "Perpustakaan dengan koleksi 5000+ buku", status: "Tersedia" },
    { id: 4, name: "Lapangan Olahraga", description: "Lapangan serbaguna untuk berbagai olahraga", status: "Tersedia" },
  ],
  operatingHours: {
    weekdays: "07:00 - 14:30",
    saturday: "07:00 - 11:00",
    sunday: "Libur",
  },
  organizationStructure: [
    { position: "Kepala Sekolah", name: "Drs. Ahmad Fauzi, M.Pd", photo: "/placeholder.svg?height=100&width=100" },
    { position: "Wakil Kepala Sekolah", name: "Siti Nurhaliza, S.Pd", photo: "/placeholder.svg?height=100&width=100" },
    { position: "Kepala TU", name: "Budi Santoso, S.E", photo: "/placeholder.svg?height=100&width=100" },
  ],
}

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null)
  const [schoolData, setSchoolData] = useState(mockSchoolData)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (!response.ok) {
          router.replace("/signin")
        } else {
          const data = await response.json()
          setUser(data.user)
        }
      } catch (error) {
        router.replace("/signin")
      }
    }
    
    checkAuth()
  }, [router])

  return null
}
