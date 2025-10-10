"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Phone, ExternalLink, Copy, CheckCircle2, Info } from "lucide-react"
import { toast } from "sonner"
import { generateWhatsAppUrl } from "@/lib/whatsapp"

interface ContactSetting {
  id: string
  type: string
  phoneNumber: string
  label: string
  description: string | null
  waTemplate: string
  isActive: boolean
}

export function AdmissionsWhatsApp() {
  const [admissions, setAdmissions] = React.useState<ContactSetting | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSaving, setIsSaving] = React.useState(false)

  // Fetch settings on mount
  React.useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings/contact/admissions')
      const { data } = await response.json()
      
      setAdmissions(data || null)
    } catch (error) {
      console.error('Error fetching admissions contact:', error)
      toast.error('Gagal memuat pengaturan')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/settings/contact/admissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(admissions),
      })

      if (response.ok) {
        toast.success('Pengaturan WhatsApp SPMB berhasil disimpan!')
      } else {
        toast.error('Gagal menyimpan pengaturan')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Terjadi kesalahan')
    } finally {
      setIsSaving(false)
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} disalin ke clipboard!`)
  }

  const testWhatsApp = () => {
    if (!admissions) return
    const url = generateWhatsAppUrl(admissions.phoneNumber, admissions.waTemplate)
    window.open(url, '_blank')
  }

  const getWhatsAppUrl = () => {
    if (!admissions) return ''
    return generateWhatsAppUrl(admissions.phoneNumber, admissions.waTemplate)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuat pengaturan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Main Settings Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-emerald-600" />
                WhatsApp Bantuan SPMB
              </CardTitle>
              <CardDescription>
                Nomor WhatsApp khusus untuk bantuan pendaftaran dan penerimaan peserta didik baru
              </CardDescription>
            </div>
            <Badge variant={admissions?.isActive ? "default" : "secondary"} className="bg-emerald-600">
              {admissions?.isActive ? "Aktif" : "Nonaktif"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Phone Number & Label */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Nomor WhatsApp</Label>
              <div className="flex gap-2">
                <Input
                  id="phone"
                  value={admissions?.phoneNumber || ''}
                  onChange={(e) => setAdmissions(prev => prev ? {...prev, phoneNumber: e.target.value} : null)}
                  placeholder="6285878958029"
                  className="font-mono"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(admissions?.phoneNumber || '', 'Nomor WhatsApp')}
                  disabled={!admissions?.phoneNumber}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Format: 628xxx (dengan kode negara Indonesia)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="label">Label Tombol</Label>
              <Input
                id="label"
                value={admissions?.label || ''}
                onChange={(e) => setAdmissions(prev => prev ? {...prev, label: e.target.value} : null)}
                placeholder="Bantuan SPMB"
              />
              <p className="text-xs text-muted-foreground">Teks yang muncul di tombol WhatsApp</p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi Layanan</Label>
            <Textarea
              id="description"
              value={admissions?.description || ''}
              onChange={(e) => setAdmissions(prev => prev ? {...prev, description: e.target.value} : null)}
              placeholder="Layanan bantuan khusus pendaftaran dan penerimaan peserta didik baru"
              rows={2}
            />
            <p className="text-xs text-muted-foreground">Deskripsi singkat tentang layanan ini</p>
          </div>

          {/* WhatsApp Template */}
          <div className="space-y-2">
            <Label htmlFor="template" className="flex items-center gap-2">
              Template Pesan WhatsApp
              <Badge variant="outline" className="text-xs">Auto Pre-fill</Badge>
            </Label>
            <Textarea
              id="template"
              value={admissions?.waTemplate || ''}
              onChange={(e) => setAdmissions(prev => prev ? {...prev, waTemplate: e.target.value} : null)}
              placeholder="Halo Tim SPMB SMP IT Masjid Syuhada.&#10;Saya ingin bertanya terkait pendaftaran siswa baru.&#10;&#10;Nama : &#10;Nomor Pendaftaran (jika ada) : &#10;Pertanyaan : "
              rows={8}
              className="font-mono text-sm"
            />
            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-800">
                <p className="font-semibold mb-1">Template ini akan otomatis muncul saat calon pendaftar klik tombol WhatsApp</p>
                <ul className="space-y-0.5 ml-4">
                  <li>• Gunakan &#10; untuk line break (enter)</li>
                  <li>• Buat format yang memudahkan calon pendaftar mengisi</li>
                  <li>• Sertakan field penting: Nama, Nomor Pendaftaran, Pertanyaan</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t">
            <Button
              onClick={handleSave}
              disabled={isSaving || !admissions}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Menyimpan...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Simpan Pengaturan
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={testWhatsApp}
              disabled={!admissions?.phoneNumber}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Test WhatsApp
            </Button>
            <Button
              variant="ghost"
              onClick={() => copyToClipboard(getWhatsAppUrl(), 'Link WhatsApp')}
              disabled={!admissions?.phoneNumber}
            >
              <Copy className="h-4 w-4 mr-2" />
              Salin Link
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview Card */}
      <Card className="bg-emerald-50 border-emerald-200">
        <CardHeader>
          <CardTitle className="text-emerald-900 text-base">Preview Link WhatsApp</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-white p-3 rounded-lg border border-emerald-200">
            <p className="text-xs text-muted-foreground mb-1">URL yang akan digunakan:</p>
            <p className="text-sm font-mono break-all text-emerald-700">
              {getWhatsAppUrl() || 'Lengkapi nomor WhatsApp untuk melihat preview'}
            </p>
          </div>
          <div className="bg-white p-3 rounded-lg border border-emerald-200">
            <p className="text-xs text-muted-foreground mb-2">Preview pesan:</p>
            <pre className="text-xs whitespace-pre-wrap text-gray-700 bg-gray-50 p-2 rounded">
              {admissions?.waTemplate || 'Belum ada template'}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Usage Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Phone className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 mb-2">Cara Penggunaan WhatsApp SPMB:</h4>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• Nomor ini akan otomatis digunakan di halaman <strong>/admissions</strong></li>
                <li>• Tombol "Bantuan SPMB" akan muncul di banner dan footer halaman pendaftaran</li>
                <li>• Calon pendaftar yang klik tombol akan langsung diarahkan ke WhatsApp dengan template pesan</li>
                <li>• Template pesan akan otomatis terisi, memudahkan calon pendaftar berkomunikasi</li>
                <li>• Pastikan nomor WhatsApp aktif dan siap menerima pesan 24/7</li>
                <li>• Format nomor harus: <code className="bg-blue-100 px-1 rounded">628xxxxxxxxxx</code> (tanpa +, spasi, atau tanda hubung)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">💡 Tips Template Pesan Efektif</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <p className="font-semibold text-emerald-600">✅ Yang Baik:</p>
              <ul className="space-y-1 text-gray-600">
                <li>• Sertakan salam pembuka yang ramah</li>
                <li>• Minta nama lengkap calon pendaftar</li>
                <li>• Sediakan field untuk nomor pendaftaran (jika sudah daftar)</li>
                <li>• Buat format yang mudah diisi</li>
                <li>• Gunakan bahasa yang sopan dan profesional</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-red-600">❌ Yang Dihindari:</p>
              <ul className="space-y-1 text-gray-600">
                <li>• Template terlalu panjang</li>
                <li>• Terlalu banyak field wajib diisi</li>
                <li>• Bahasa yang terlalu formal/kaku</li>
                <li>• Lupa sertakan identitas sekolah</li>
                <li>• Tidak ada ruang untuk pertanyaan</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

