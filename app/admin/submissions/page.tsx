"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, CheckCircle, XCircle, Clock, Eye, FileText } from "lucide-react"
import { toast } from "sonner"

interface Submission {
  id: string
  registrationNumber: string
  namaLengkap: string
  email: string | null
  noHPOrangtua: string | null
  asalSekolah: string | null
  jalurPendaftaran: string | null
  gelombangPendaftaran: string | null
  status: string
  createdAt: Date
}

export default function SubmissionsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [jalurFilter, setJalurFilter] = useState("all")
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewed: 0,
    approved: 0,
    rejected: 0,
  })

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (!response.ok) {
          router.replace("/signin")
        } else {
          const data = await response.json()
          setUser(data.user)
          fetchSubmissions()
        }
      } catch (error) {
        router.replace("/signin")
      }
    }
    
    checkAuth()
  }, [router])

  const fetchSubmissions = async () => {
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (searchQuery) params.append('search', searchQuery)
      if (jalurFilter !== 'all') params.append('jalur', jalurFilter)

      const response = await fetch(`/api/forms/submissions?${params.toString()}`)
      const data = await response.json()
      
      if (data.success) {
        setSubmissions(data.data.submissions)
        setStats(data.data.stats)
      }
    } catch (error) {
      console.error('Error fetching submissions:', error)
      toast.error('Gagal memuat data pendaftar')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchSubmissions()
    }
  }, [statusFilter, jalurFilter])

  const handleSearch = () => {
    if (user) {
      fetchSubmissions()
    }
  }

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/forms/submissions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: newStatus,
          reviewedBy: user?.username 
        }),
      })

      if (response.ok) {
        const statusText = newStatus === 'approved' ? 'diterima' : newStatus === 'rejected' ? 'ditolak' : 'direview'
        toast.success(`Pendaftar berhasil ${statusText}`)
        fetchSubmissions()
      } else {
        toast.error('Gagal memperbarui status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Pendaftar SPMB</h1>
        <p className="mt-2 text-gray-600">Kelola data pendaftar dan status pendaftaran</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Reviewed</p>
                <p className="text-2xl font-bold text-blue-600">{stats.reviewed}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Diterima</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ditolak</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Cari nama, email, atau nomor pendaftaran..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="approved">Diterima</SelectItem>
                <SelectItem value="rejected">Ditolak</SelectItem>
              </SelectContent>
            </Select>

            <Select value={jalurFilter} onValueChange={setJalurFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Jalur" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Jalur</SelectItem>
                <SelectItem value="reguler">Reguler</SelectItem>
                <SelectItem value="prestasi">Prestasi</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Pendaftar</CardTitle>
          <CardDescription>Total {submissions.length} pendaftar</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">Memuat data...</p>
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p>Belum ada pendaftar</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No. Pendaftaran</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Asal Sekolah</TableHead>
                  <TableHead>Jalur</TableHead>
                  <TableHead>Gelombang</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">{submission.registrationNumber}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{submission.namaLengkap}</p>
                        <p className="text-sm text-gray-500">{submission.email || '-'}</p>
                      </div>
                    </TableCell>
                    <TableCell>{submission.asalSekolah || '-'}</TableCell>
                    <TableCell>
                      {submission.jalurPendaftaran ? (
                        <Badge variant="outline">{submission.jalurPendaftaran}</Badge>
                      ) : '-'}
                    </TableCell>
                    <TableCell>{submission.gelombangPendaftaran || '-'}</TableCell>
                    <TableCell>{getStatusBadge(submission.status)}</TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(submission.createdAt).toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/admin/submissions/${submission.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {submission.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 hover:text-green-700"
                              onClick={() => updateStatus(submission.id, 'approved')}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => updateStatus(submission.id, 'rejected')}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  )
}

