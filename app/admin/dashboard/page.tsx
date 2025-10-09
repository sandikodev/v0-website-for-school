"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"

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

  // Show loading while checking auth
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <AdminLayout user={user}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Selamat datang kembali, {user.username}!</p>
      </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-emerald-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Siswa</dt>
                  <dd className="text-lg font-semibold text-gray-900">1,234</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Guru</dt>
                  <dd className="text-lg font-semibold text-gray-900">45</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pendaftar Baru</dt>
                  <dd className="text-lg font-semibold text-gray-900">87</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pesan Baru</dt>
                  <dd className="text-lg font-semibold text-gray-900">12</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => router.push('/admin/students/new')}
              className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Tambah Siswa Baru
            </button>
            <button 
              onClick={() => router.push('/admin/admissions')}
              className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Lihat Pendaftar
            </button>
            <button 
              onClick={() => router.push('/admin/messages')}
              className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Kelola Pesan
            </button>
          </div>
        </div>

        {/* School Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Informasi Sekolah</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Nama Sekolah:</span>
              <span className="font-medium text-gray-900">{schoolData.profile.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tahun Berdiri:</span>
              <span className="font-medium text-gray-900">{schoolData.profile.foundedYear}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium text-gray-900">{schoolData.profile.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Telepon:</span>
              <span className="font-medium text-gray-900">{schoolData.profile.phone}</span>
            </div>
          </div>
        </div>
    </AdminLayout>
  )
}
