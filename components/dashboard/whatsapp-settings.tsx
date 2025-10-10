"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Phone, ExternalLink, Copy, CheckCircle2 } from "lucide-react"
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

export function WhatsAppSettings() {
  const [callCenter, setCallCenter] = React.useState<ContactSetting | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSaving, setIsSaving] = React.useState(false)

  // Fetch settings on mount
  React.useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings/contact/call_center')
      const { data } = await response.json()
      
      setCallCenter(data || null)
    } catch (error) {
      console.error('Error fetching call center settings:', error)
      toast.error('Gagal memuat pengaturan')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/settings/contact/call_center', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(callCenter),
      })

      if (response.ok) {
        toast.success('Pengaturan Call Center berhasil disimpan!')
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

  const testWhatsApp = (phoneNumber: string, template: string) => {
    const url = generateWhatsAppUrl(phoneNumber, template)
    window.open(url, '_blank')
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
      {/* Call Center Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-blue-600" />
                Call Center - Layanan Umum
              </CardTitle>
              <CardDescription>
                Nomor WhatsApp untuk pertanyaan umum sekolah (Orang Tua, Wali Murid, Tamu)
              </CardDescription>
            </div>
            <Badge variant={callCenter?.isActive ? "default" : "secondary"}>
              {callCenter?.isActive ? "Aktif" : "Nonaktif"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cc-phone">Nomor WhatsApp</Label>
              <div className="flex gap-2">
                <Input
                  id="cc-phone"
                  value={callCenter?.phoneNumber || ''}
                  onChange={(e) => setCallCenter(prev => prev ? {...prev, phoneNumber: e.target.value} : null)}
                  placeholder="6289649246450"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(callCenter?.phoneNumber || '', 'Nomor')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Format: 628xxx (dengan kode negara)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cc-label">Label</Label>
              <Input
                id="cc-label"
                value={callCenter?.label || ''}
                onChange={(e) => setCallCenter(prev => prev ? {...prev, label: e.target.value} : null)}
                placeholder="Call Center"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cc-description">Deskripsi Layanan</Label>
            <Textarea
              id="cc-description"
              value={callCenter?.description || ''}
              onChange={(e) => setCallCenter(prev => prev ? {...prev, description: e.target.value} : null)}
              placeholder="Layanan informasi umum sekolah untuk Orang Tua, Wali Murid, dan Tamu"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cc-template">Template Pesan WhatsApp</Label>
            <Textarea
              id="cc-template"
              value={callCenter?.waTemplate || ''}
              onChange={(e) => setCallCenter(prev => prev ? {...prev, waTemplate: e.target.value} : null)}
              placeholder="Halo Call Center SMP IT Masjid Syuhada.&#10;Saya ingin meminta bantuan atau informasi terkait sekolah.&#10;&#10;Nama : &#10;Sebagai : (Orang Tua/Wali Murid/Tamu)&#10;Pesan : "
              rows={6}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Template ini akan otomatis muncul saat pengguna klik tombol WhatsApp
            </p>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700"
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
              onClick={() => testWhatsApp(callCenter?.phoneNumber || '', callCenter?.waTemplate || '')}
              disabled={!callCenter?.phoneNumber}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Test WhatsApp
            </Button>
            <Button
              variant="ghost"
              onClick={() => copyToClipboard(
                generateWhatsAppUrl(callCenter?.phoneNumber || '', callCenter?.waTemplate || ''),
                'Link WhatsApp'
              )}
              disabled={!callCenter?.phoneNumber}
            >
              <Copy className="h-4 w-4 mr-2" />
              Salin Link
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Phone className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 mb-2">Cara Menggunakan Call Center WhatsApp:</h4>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• <strong>Call Center</strong>: Untuk pertanyaan umum sekolah (Orang Tua, Wali Murid, Tamu)</li>
                <li>• Nomor ini akan digunakan di halaman <strong>Contact Us</strong> dan footer website</li>
                <li>• Template pesan akan otomatis muncul saat pengguna klik tombol WhatsApp</li>
                <li>• Gunakan tombol "Test WhatsApp" untuk melihat preview pesan</li>
                <li>• Nomor harus dalam format internasional (628xxx...)</li>
                <li>• Untuk <strong>Bantuan SPMB</strong>, silakan atur di menu <strong>Dashboard → Admissions → WhatsApp</strong></li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

