"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { User, School, Users, FileText, CheckCircle, XCircle, Clock, Calendar, ExternalLink } from "lucide-react"
import { toast } from "sonner"

interface SubmissionDetailModalProps {
  submissionId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate?: () => void
}

export function SubmissionDetailModal({
  submissionId,
  open,
  onOpenChange,
  onUpdate
}: SubmissionDetailModalProps) {
  const [submission, setSubmission] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const [notes, setNotes] = React.useState("")
  const [newStatus, setNewStatus] = React.useState("")

  React.useEffect(() => {
    if (submissionId && open) {
      fetchSubmission()
    }
  }, [submissionId, open])

  const fetchSubmission = async () => {
    if (!submissionId) return
    
    setIsLoading(true)
    try {
      const response = await fetch(`/api/forms/submissions/${submissionId}`)
      const data = await response.json()
      
      if (data.success) {
        setSubmission(data.data)
        setNotes(data.data.notes || "")
        setNewStatus(data.data.status)
      } else {
        toast.error('Gagal memuat data')
      }
    } catch (error) {
      console.error('Error fetching submission:', error)
      toast.error('Terjadi kesalahan')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateStatus = async () => {
    if (!submissionId) return
    
    setIsSaving(true)
    try {
      const response = await fetch(`/api/forms/submissions/${submissionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          notes: notes
        })
      })

      if (response.ok) {
        toast.success('Status berhasil diperbarui!')
        onUpdate?.()
        onOpenChange(false)
      } else {
        toast.error('Gagal memperbarui status')
      }
    } catch (error) {
      console.error('Error updating:', error)
      toast.error('Terjadi kesalahan')
    } finally {
      setIsSaving(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-600"><CheckCircle className="h-3 w-3 mr-1" />Disetujui</Badge>
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Ditolak</Badge>
      case 'reviewed':
        return <Badge className="bg-blue-600"><Eye className="h-3 w-3 mr-1" />Ditinjau</Badge>
      default:
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Detail Pendaftar
          </DialogTitle>
          <DialogDescription>
            Informasi lengkap pendaftar dan review status
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Memuat data...</p>
            </div>
          </div>
        ) : !submission ? (
          <div className="text-center py-12 text-gray-500">
            Data tidak ditemukan
          </div>
        ) : (
          <div className="space-y-4">
            {/* Header Info */}
            <Card className="border-emerald-200 bg-emerald-50/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Nomor Pendaftaran</p>
                    <p className="text-lg font-bold font-mono text-emerald-600">
                      {submission.registrationNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Status</p>
                    {getStatusBadge(submission.status)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Siswa */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Data Siswa
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">Nama Lengkap</p>
                    <p className="font-semibold">{submission.namaLengkap}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Tempat, Tanggal Lahir</p>
                    <p className="font-semibold">
                      {submission.tempatLahir || '-'}, {submission.tanggalLahir || '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Jenis Kelamin</p>
                    <p className="font-semibold capitalize">{submission.jenisKelamin || '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">No. HP</p>
                    <p className="font-semibold">{submission.noHP || '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Email</p>
                    <p className="font-semibold">{submission.email || '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Alamat</p>
                    <p className="font-semibold">{submission.alamatLengkap || '-'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Orangtua */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Data Orangtua
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">Nama Ayah</p>
                    <p className="font-semibold">{submission.namaAyah || '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Pekerjaan Ayah</p>
                    <p className="font-semibold">{submission.pekerjaanAyah || '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Nama Ibu</p>
                    <p className="font-semibold">{submission.namaIbu || '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Pekerjaan Ibu</p>
                    <p className="font-semibold">{submission.pekerjaanIbu || '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">No. HP Orangtua</p>
                    <p className="font-semibold">{submission.noHPOrangtua || '-'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Sekolah & Pendaftaran */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <School className="h-4 w-4" />
                    Asal Sekolah
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>
                    <p className="text-gray-600">Nama Sekolah</p>
                    <p className="font-semibold">{submission.asalSekolah || '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Alamat</p>
                    <p className="font-semibold">{submission.alamatSekolah || '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Prestasi</p>
                    <p className="font-semibold">{submission.prestasi || '-'}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Info Pendaftaran
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>
                    <p className="text-gray-600">Jalur</p>
                    <p className="font-semibold capitalize">{submission.jalurPendaftaran || '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Gelombang</p>
                    <p className="font-semibold capitalize">
                      {submission.gelombangPendaftaran?.replace('gelombang-', 'Gelombang ') || '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Tanggal Daftar</p>
                    <p className="font-semibold">
                      {new Date(submission.createdAt).toLocaleString('id-ID', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator />

            {/* Review Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Review & Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status Pendaftaran</label>
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="reviewed">Ditinjau</SelectItem>
                        <SelectItem value="approved">Disetujui</SelectItem>
                        <SelectItem value="rejected">Ditolak</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Catatan Admin</label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Tambahkan catatan untuk pendaftar (opsional)"
                    rows={4}
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => window.open(`/admin/submissions/${submissionId}`, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Buka di Tab Baru
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => onOpenChange(false)}
                    >
                      Batal
                    </Button>
                    <Button
                      onClick={handleUpdateStatus}
                      disabled={isSaving}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

