"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2, Mail, Phone, MapPin, Calendar, User, Users } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Student {
  id: string
  name: string
  email: string
  phone?: string
  grade: string
  birthDate?: Date
  parentName?: string
  parentPhone?: string
  address?: string
  status: string
  createdAt: Date
  school: {
    name: string
  }
  applications: Array<{
    id: string
    program: string
    status: string
    createdAt: Date
  }>
  messages: Array<{
    id: string
    subject: string
    type: string
    read: boolean
    createdAt: Date
  }>
}

export default function StudentDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [student, setStudent] = useState<Student | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (!response.ok) {
          router.replace("/signin")
        } else {
          const data = await response.json()
          setUser(data.user)
          fetchStudent()
        }
      } catch (error) {
        router.replace("/signin")
      }
    }
    
    checkAuth()
  }, [router])

  const fetchStudent = async () => {
    try {
      const response = await fetch(`/api/students/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setStudent(data.data)
      } else {
        router.push('/admin/students')
      }
    } catch (error) {
      console.error('Error fetching student:', error)
      router.push('/admin/students')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Apakah Anda yakin ingin menghapus siswa "${student?.name}"? Tindakan ini tidak dapat dibatalkan.`)) {
      return
    }

    try {
      const response = await fetch(`/api/students/${params.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/admin/students')
      } else {
        alert('Gagal menghapus siswa')
      }
    } catch (error) {
      console.error('Error deleting student:', error)
      alert('Terjadi kesalahan saat menghapus siswa')
    }
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-emerald-100 text-emerald-800',
      inactive: 'bg-red-100 text-red-800',
      graduated: 'bg-amber-100 text-amber-800',
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getGradeBadge = (grade: string) => {
    const colors = {
      SD: 'bg-green-100 text-green-800',
      SMP: 'bg-blue-100 text-blue-800',
      SMA: 'bg-purple-100 text-purple-800',
    }
    return colors[grade as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

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

  if (isLoading) {
    return (
      <AdminLayout user={user}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data siswa...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!student) {
    return (
      <AdminLayout user={user}>
        <div className="text-center py-12">
          <p className="text-gray-500">Siswa tidak ditemukan</p>
          <Button onClick={() => router.push('/admin/students')} className="mt-4">
            Kembali ke Daftar Siswa
          </Button>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout user={user}>
      <div className="max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{student.name}</h1>
              <p className="mt-2 text-gray-600">{student.email}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => router.push(`/admin/students/${student.id}/edit`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                className="text-red-600 hover:text-red-700"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Hapus
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getGradeBadge(student.grade)}`}>
                  {student.grade}
                </div>
                <p className="text-xs text-gray-500 mt-2">Jenjang</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(student.status)}`}>
                  {student.status === 'active' ? 'Aktif' : student.status === 'graduated' ? 'Lulus' : 'Tidak Aktif'}
                </div>
                <p className="text-xs text-gray-500 mt-2">Status</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{student.school.name}</p>
                <p className="text-xs text-gray-500 mt-2">Sekolah</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="info" className="space-y-6">
          <TabsList>
            <TabsTrigger value="info">Informasi Pribadi</TabsTrigger>
            <TabsTrigger value="applications">
              Pendaftaran ({student.applications.length})
            </TabsTrigger>
            <TabsTrigger value="messages">
              Pesan ({student.messages.length})
            </TabsTrigger>
          </TabsList>

          {/* Informasi Pribadi */}
          <TabsContent value="info">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Data Siswa */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Data Siswa
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{student.email}</p>
                    </div>
                  </div>
                  {student.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Telepon</p>
                        <p className="font-medium">{student.phone}</p>
                      </div>
                    </div>
                  )}
                  {student.birthDate && (
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Tanggal Lahir</p>
                        <p className="font-medium">{new Date(student.birthDate).toLocaleDateString('id-ID')}</p>
                      </div>
                    </div>
                  )}
                  {student.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Alamat</p>
                        <p className="font-medium">{student.address}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Data Orang Tua */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Data Orang Tua/Wali
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {student.parentName && (
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Nama</p>
                        <p className="font-medium">{student.parentName}</p>
                      </div>
                    </div>
                  )}
                  {student.parentPhone && (
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Telepon</p>
                        <p className="font-medium">{student.parentPhone}</p>
                      </div>
                    </div>
                  )}
                  {!student.parentName && !student.parentPhone && (
                    <p className="text-gray-400 italic">Data orang tua belum diisi</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Pendaftaran */}
          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>Riwayat Pendaftaran</CardTitle>
                <CardDescription>Daftar pendaftaran program yang diikuti</CardDescription>
              </CardHeader>
              <CardContent>
                {student.applications.length === 0 ? (
                  <p className="text-gray-400 italic text-center py-8">Belum ada pendaftaran</p>
                ) : (
                  <div className="space-y-4">
                    {student.applications.map((app) => (
                      <div key={app.id} className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{app.program}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(app.createdAt).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                        <Badge className={
                          app.status === 'approved' ? 'bg-green-100 text-green-800' :
                          app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }>
                          {app.status === 'approved' ? 'Diterima' :
                           app.status === 'rejected' ? 'Ditolak' : 'Pending'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pesan */}
          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Riwayat Pesan</CardTitle>
                <CardDescription>Komunikasi dengan siswa/orang tua</CardDescription>
              </CardHeader>
              <CardContent>
                {student.messages.length === 0 ? (
                  <p className="text-gray-400 italic text-center py-8">Belum ada pesan</p>
                ) : (
                  <div className="space-y-4">
                    {student.messages.map((message) => (
                      <div key={message.id} className={`p-4 border rounded-lg ${!message.read ? 'bg-emerald-50 border-emerald-200' : ''}`}>
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium">{message.subject}</p>
                          <Badge variant="outline" className={
                            message.type === 'urgent' ? 'bg-red-50 text-red-700' :
                            message.type === 'warning' ? 'bg-yellow-50 text-yellow-700' :
                            'bg-blue-50 text-blue-700'
                          }>
                            {message.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(message.createdAt).toLocaleDateString('id-ID')}
                        </p>
                        {!message.read && (
                          <Badge className="mt-2 bg-emerald-600 text-white text-xs">Baru</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}

