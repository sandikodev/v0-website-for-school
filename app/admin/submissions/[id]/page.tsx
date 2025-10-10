"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, CheckCircle, XCircle, Clock, Eye, User, School, FileText, Calendar } from "lucide-react"
import { toast } from "sonner"

interface SubmissionDetail {
  id: string
  registrationNumber: string
  namaLengkap: string
  tempatLahir: string | null
  tanggalLahir: string | null
  jenisKelamin: string | null
  alamatLengkap: string | null
  noHP: string | null
  email: string | null
  namaAyah: string | null
  pekerjaanAyah: string | null
  namaIbu: string | null
  pekerjaanIbu: string | null
  noHPOrangtua: string | null
  asalSekolah: string | null
  alamatSekolah: string | null
  prestasi: string | null
  jalurPendaftaran: string | null
  gelombangPendaftaran: string | null
  status: string
  notes: string | null
  reviewedAt: Date | null
  reviewedBy: string | null
  createdAt: Date
  uploadedFiles: any[]
  school: {
    name: string
    phone: string | null
    email: string | null
  }
}

export default function SubmissionDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [user, setUser] = useState<any>(null)
  const [submission, setSubmission] = useState<SubmissionDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notes, setNotes] = useState("")
  const [newStatus, setNewStatus] = useState("")

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (!response.ok) {
          router.replace("/signin")
        } else {
          const data = await response.json()
          setUser(data.user)
          fetchSubmission()
        }
      } catch (error) {
        router.replace("/signin")
      }
    }
    
    checkAuth()
  }, [router])

  const fetchSubmission = async () => {
    try {
      const response = await fetch(`/api/forms/submissions/${params.id}`)
      const data = await response.json()
      
      if (data.success) {
        setSubmission(data.data)
        setNotes(data.data.notes || "")
        setNewStatus(data.data.status)
      } else {
        toast.error('Submission tidak ditemukan')
        router.push('/admin/submissions')
      }
    } catch (error) {
      console.error('Error fetching submission:', error)
      toast.error('Gagal memuat data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/forms/submissions/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: newStatus,
          notes: notes,
          reviewedBy: user?.username 
        }),
      })

      if (response.ok) {
        toast.success('Status berhasil diperbarui')
        fetchSubmission()
      } else {
        toast.error('Gagal memperbarui status')
      }
    } catch (error) {
      console.error('Error updating submission:', error)
      toast.error('Terjadi kesalahan')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      case 'reviewed':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200"><Eye className="h-3 w-3 mr-1" />Reviewed</Badge>
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="h-3 w-3 mr-1" />Diterima</Badge>
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="h-3 w-3 mr-1" />Ditolak</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (!user || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!submission) {
    return null
  }

  return (
    <AdminLayout user={user}>
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.push('/admin/submissions')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Detail Pendaftar</h1>
            <p className="mt-2 text-gray-600">No. Pendaftaran: {submission.registrationNumber}</p>
          </div>
          {getStatusBadge(submission.status)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Data Siswa */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Data Siswa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nama Lengkap</label>
                  <p className="text-gray-900">{submission.namaLengkap}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Jenis Kelamin</label>
                  <p className="text-gray-900">{submission.jenisKelamin || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Tempat Lahir</label>
                  <p className="text-gray-900">{submission.tempatLahir || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Tanggal Lahir</label>
                  <p className="text-gray-900">{submission.tanggalLahir || '-'}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-500">Alamat</label>
                  <p className="text-gray-900">{submission.alamatLengkap || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">No. HP</label>
                  <p className="text-gray-900">{submission.noHP || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{submission.email || '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Orangtua */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Data Orangtua
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nama Ayah</label>
                  <p className="text-gray-900">{submission.namaAyah || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Pekerjaan Ayah</label>
                  <p className="text-gray-900">{submission.pekerjaanAyah || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Nama Ibu</label>
                  <p className="text-gray-900">{submission.namaIbu || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Pekerjaan Ibu</label>
                  <p className="text-gray-900">{submission.pekerjaanIbu || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">No. HP Orangtua</label>
                  <p className="text-gray-900">{submission.noHPOrangtua || '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Sekolah Asal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <School className="h-5 w-5 mr-2" />
                Data Sekolah Asal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Asal Sekolah</label>
                  <p className="text-gray-900">{submission.asalSekolah || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Alamat Sekolah</label>
                  <p className="text-gray-900">{submission.alamatSekolah || '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Pendaftaran */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Data Pendaftaran
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Jalur Pendaftaran</label>
                  <p className="text-gray-900">{submission.jalurPendaftaran || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Gelombang</label>
                  <p className="text-gray-900">{submission.gelombangPendaftaran || '-'}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-500">Prestasi</label>
                  <p className="text-gray-900">{submission.prestasi || '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Update */}
          <Card>
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="approved">Diterima</SelectItem>
                    <SelectItem value="rejected">Ditolak</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Catatan</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tambahkan catatan..."
                  className="mt-1"
                  rows={4}
                />
              </div>

              <Button
                onClick={handleUpdate}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                Simpan Perubahan
              </Button>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-600 mt-2" />
                <div>
                  <p className="text-sm font-medium">Pendaftaran Dibuat</p>
                  <p className="text-xs text-gray-500">
                    {new Date(submission.createdAt).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              {submission.reviewedAt && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
                  <div>
                    <p className="text-sm font-medium">Direview oleh {submission.reviewedBy}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(submission.reviewedAt).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* School Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Sekolah</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm font-medium text-gray-500">Nama</p>
                <p className="text-gray-900">{submission.school.name}</p>
              </div>
              {submission.school.phone && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Telepon</p>
                  <p className="text-gray-900">{submission.school.phone}</p>
                </div>
              )}
              {submission.school.email && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-gray-900">{submission.school.email}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}

