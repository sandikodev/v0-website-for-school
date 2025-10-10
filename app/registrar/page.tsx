"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, CheckCircle, Clock, XCircle, Eye, Calendar, User, School, FileText, Home, FileSearch, Printer } from "lucide-react"

interface SubmissionDetail {
  id: string
  registrationNumber: string
  namaLengkap: string
  email: string | null
  noHP: string | null
  tempatLahir: string | null
  tanggalLahir: string | null
  jenisKelamin: string | null
  asalSekolah: string | null
  jalurPendaftaran: string | null
  gelombangPendaftaran: string | null
  status: string
  notes: string | null
  reviewedAt: Date | null
  reviewedBy: string | null
  createdAt: Date
}

export default function RegistrarStatusPage() {
  const params = useSearchParams()
  const router = useRouter()
  const regNumberParam = params.get("id") || ""
  const [query, setQuery] = React.useState(regNumberParam)
  const [result, setResult] = React.useState<SubmissionDetail | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [notFound, setNotFound] = React.useState(false)

  React.useEffect(() => {
    if (regNumberParam) {
      searchSubmission(regNumberParam)
    } else {
      setResult(null)
      setNotFound(false)
    }
  }, [regNumberParam])

  const searchSubmission = async (registrationNumber: string) => {
    setIsLoading(true)
    setNotFound(false)
    
    try {
      // Search by registration number
      const response = await fetch(`/api/forms/submissions?search=${encodeURIComponent(registrationNumber)}`)
      const data = await response.json()
      
      if (data.success && data.data.submissions.length > 0) {
        // Find exact match
        const found = data.data.submissions.find(
          (s: any) => s.registrationNumber.toLowerCase() === registrationNumber.toLowerCase()
        )
        
        if (found) {
          setResult(found)
          setNotFound(false)
        } else {
          setResult(null)
          setNotFound(true)
        }
      } else {
        setResult(null)
        setNotFound(true)
      }
    } catch (error) {
      console.error('Error searching submission:', error)
      setResult(null)
      setNotFound(true)
    } finally {
      setIsLoading(false)
    }
  }

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    router.push(`/registrar?id=${encodeURIComponent(query.trim())}`)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      case 'reviewed':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200"><Eye className="h-3 w-3 mr-1" />Sedang Ditinjau</Badge>
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="h-3 w-3 mr-1" />Diterima</Badge>
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="h-3 w-3 mr-1" />Ditolak</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendaftaran Anda sedang menunggu untuk ditinjau oleh tim kami.'
      case 'reviewed':
        return 'Pendaftaran Anda sedang dalam proses peninjauan.'
      case 'approved':
        return 'Selamat! Pendaftaran Anda telah disetujui. Tim kami akan segera menghubungi Anda.'
      case 'rejected':
        return 'Mohon maaf, pendaftaran Anda tidak dapat dilanjutkan saat ini.'
      default:
        return ''
    }
  }

  return (
    <main className="container mx-auto px-4 py-12 pb-20 md:pb-12">
      <div className="max-w-3xl mx-auto">
        {/* Back Navigation - Desktop */}
        <div className="hidden md:flex items-center gap-2 mb-6 no-print">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/')}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Beranda
          </Button>
          <span className="text-gray-300">|</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/admissions')}
            className="text-gray-600 hover:text-gray-900"
          >
            Informasi SPMB
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-8 no-print">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cek Status Pendaftaran</h1>
          <p className="text-gray-600">Masukkan nomor pendaftaran SPMB untuk melihat status Anda</p>
        </div>

        {/* Search Card */}
        <Card className="mb-6 no-print">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Nomor Pendaftaran
            </CardTitle>
            <CardDescription>Masukkan nomor pendaftaran yang Anda terima setelah mendaftar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSearch} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <Input
                inputMode="search"
                placeholder="SPMB-2025-XXXX"
                value={query}
                onChange={(e) => setQuery(e.target.value.toUpperCase())}
                className="flex-1 font-mono"
                disabled={isLoading}
              />
              <Button type="submit" className="shrink-0 bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
                {isLoading ? 'Mencari...' : 'Cari Status'}
              </Button>
            </form>

            {!regNumberParam && (
              <div className="mt-4 text-sm text-gray-500">
                <p className="mb-2">Contoh nomor pendaftaran:</p>
                <code className="bg-gray-100 px-3 py-1 rounded text-emerald-600 font-mono">SPMB-2025-0935</code>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <Card className="no-print">
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Mencari data pendaftaran...</p>
            </CardContent>
          </Card>
        )}

        {/* Not Found */}
        {regNumberParam && notFound && !isLoading && (
          <Card className="border-red-200 bg-red-50/50 no-print">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <XCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-900 mb-1">Nomor Pendaftaran Tidak Ditemukan</h3>
                  <p className="text-sm text-red-700 mb-3">
                    Nomor pendaftaran <span className="font-mono font-bold">{regNumberParam}</span> tidak ditemukan dalam sistem kami.
                  </p>
                  <div className="text-sm text-red-600">
                    <p className="mb-2">Kemungkinan penyebab:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Nomor pendaftaran salah ketik</li>
                      <li>Pendaftaran belum disubmit</li>
                      <li>Data belum tersinkronisasi</li>
                    </ul>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setQuery('')
                      router.push('/registrar')
                    }}
                    className="mt-4"
                  >
                    Coba Lagi
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Result Found */}
        {result && !isLoading && (
          <div className="space-y-6">
            {/* Print Header - Only visible when printing */}
            <div className="hidden print:block print-header">
              <div className="text-center border-b border-gray-400">
                <h1 className="font-bold text-gray-900">SMP IT Masjid Syuhada</h1>
                <p className="text-gray-600">Bukti Pendaftaran SPMB - {new Date().toLocaleDateString('id-ID', { 
                  day: '2-digit', 
                  month: 'short', 
                  year: 'numeric'
                })}</p>
              </div>
            </div>

            {/* Status Card */}
            <Card className={`print-card border-2 ${
              result.status === 'approved' ? 'border-green-200 bg-green-50/50' :
              result.status === 'rejected' ? 'border-red-200 bg-red-50/50' :
              result.status === 'reviewed' ? 'border-blue-200 bg-blue-50/50' :
              'border-yellow-200 bg-yellow-50/50'
            }`}>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle>Status Pendaftaran</CardTitle>
                  {getStatusBadge(result.status)}
                </div>
                <CardDescription className={`text-base font-medium ${
                  result.status === 'approved' ? 'text-green-700' :
                  result.status === 'rejected' ? 'text-red-700' :
                  result.status === 'reviewed' ? 'text-blue-700' :
                  'text-yellow-700'
                }`}>
                  {getStatusMessage(result.status)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="bg-white rounded-lg p-4 border">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <p className="text-sm text-gray-600">Nomor Pendaftaran</p>
                    </div>
                    <p className="text-lg font-bold text-emerald-600 font-mono">{result.registrationNumber}</p>
                  </div>

                  {result.notes && (
                    <div className="bg-white rounded-lg p-4 border">
                      <p className="text-sm text-gray-600 mb-1">Catatan dari Tim:</p>
                      <p className="text-gray-900">{result.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Data Lengkap - Combined for print efficiency */}
            <Card className="print-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Data Lengkap Pendaftar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <p className="text-sm text-gray-500">Nama Lengkap</p>
                    <p className="font-medium text-gray-900">{result.namaLengkap}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Jenis Kelamin</p>
                    <p className="font-medium text-gray-900">{result.jenisKelamin || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">TTL</p>
                    <p className="font-medium text-gray-900">{result.tempatLahir}, {result.tanggalLahir}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">No. HP</p>
                    <p className="font-medium text-gray-900">{result.noHP || '-'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{result.email || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Asal Sekolah</p>
                    <p className="font-medium text-gray-900">{result.asalSekolah || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Jalur</p>
                    <p className="font-medium text-gray-900">{result.jalurPendaftaran || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Gelombang</p>
                    <p className="font-medium text-gray-900">{result.gelombangPendaftaran || '-'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            {result.reviewedAt && (
              <Card className="print-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-600 mt-2" />
                      <div>
                        <p className="text-sm font-medium">Pendaftaran Dibuat</p>
                        <p className="text-xs text-gray-500">{new Date(result.createdAt).toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
                      <div>
                        <p className="text-sm font-medium">Ditinjau oleh {result.reviewedBy}</p>
                        <p className="text-xs text-gray-500">{new Date(result.reviewedAt).toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions - Desktop */}
            <div className="hidden md:flex gap-3 print-hide">
              <Button
                variant="outline"
                onClick={() => {
                  setQuery('')
                  setResult(null)
                  router.push('/registrar')
                }}
                className="flex-1"
              >
                Cari Nomor Lain
              </Button>
              <Button
                onClick={() => router.push('/')}
                variant="outline"
                className="flex-1"
              >
                Beranda
              </Button>
              <Button
                onClick={() => router.push('/admissions')}
                variant="outline"
                className="flex-1"
              >
                Info SPMB
              </Button>
              <Button
                onClick={() => window.print()}
                variant="outline"
                className="flex-1"
              >
                Cetak
              </Button>
            </div>

            {/* Print Footer - Only visible when printing */}
            <div className="hidden print:block print-footer border-t border-gray-400">
              <p className="text-gray-600 text-center">
                Dokumen resmi SPMB SMP IT Masjid Syuhada · Verifikasi: smpit-syuhada.sch.id/registrar
              </p>
            </div>
          </div>
        )}

        {/* Mobile/Tablet Bottom Navigation - Only when result is shown */}
        {result && !isLoading && (
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg print-hide z-50">
            <div className="grid grid-cols-4 gap-1 p-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setQuery('')
                  setResult(null)
                  router.push('/registrar')
                }}
                className="flex flex-col items-center gap-1 h-auto py-2 px-1"
              >
                <FileSearch className="h-5 w-5" />
                <span className="text-xs">Cari Lagi</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/')}
                className="flex flex-col items-center gap-1 h-auto py-2 px-1"
              >
                <Home className="h-5 w-5" />
                <span className="text-xs">Beranda</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/admissions')}
                className="flex flex-col items-center gap-1 h-auto py-2 px-1"
              >
                <FileText className="h-5 w-5" />
                <span className="text-xs">SPMB</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.print()}
                className="flex flex-col items-center gap-1 h-auto py-2 px-1"
              >
                <Printer className="h-5 w-5" />
                <span className="text-xs">Cetak</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
