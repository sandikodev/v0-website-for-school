"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Building2, Mail, Phone, Globe } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface School {
  id: string
  name: string
  description?: string
  address?: string
  phone?: string
  email?: string
  website?: string
  logo?: string
}

export default function SchoolPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [school, setSchool] = useState<School | null>(null)
  const [formData, setFormData] = useState<School>({
    id: "",
    name: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    logo: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (!response.ok) {
          router.replace("/signin")
        } else {
          const data = await response.json()
          setUser(data.user)
          fetchSchool()
        }
      } catch (error) {
        router.replace("/signin")
      }
    }
    
    checkAuth()
  }, [router])

  const fetchSchool = async () => {
    try {
      const response = await fetch('/api/schools/first')
      if (response.ok) {
        const data = await response.json()
        setSchool(data.data)
        setFormData(data.data)
      }
    } catch (error) {
      console.error('Error fetching school:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: keyof School, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage(null)

    try {
      const response = await fetch(`/api/schools/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'Data sekolah berhasil diperbarui!' })
        fetchSchool()
      } else {
        setMessage({ type: 'error', text: data.message || 'Gagal memperbarui data sekolah' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan saat menyimpan data' })
      console.error('Error saving school:', error)
    } finally {
      setIsSaving(false)
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

  if (isLoading) {
    return (
      <AdminLayout user={user}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data sekolah...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout user={user}>
      <div className="max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Pengaturan Sekolah</h1>
          <p className="mt-2 text-gray-600">Kelola informasi dan profil sekolah</p>
        </div>

        {message && (
          <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className="mb-6">
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profil Sekolah</TabsTrigger>
            <TabsTrigger value="contact">Kontak & Lokasi</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            {/* Profil Sekolah Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Sekolah</CardTitle>
                  <CardDescription>Data utama sekolah</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Nama Sekolah */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Sekolah *</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="pl-10"
                        placeholder="Nama lengkap sekolah"
                        required
                      />
                    </div>
                  </div>

                  {/* Deskripsi */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Deskripsi/Visi Sekolah</Label>
                    <Textarea
                      id="description"
                      value={formData.description || ''}
                      onChange={(e) => handleChange('description', e.target.value)}
                      rows={4}
                      placeholder="Visi, misi, atau deskripsi singkat sekolah..."
                    />
                  </div>

                  {/* Logo URL */}
                  <div className="space-y-2">
                    <Label htmlFor="logo">URL Logo Sekolah</Label>
                    <Input
                      id="logo"
                      type="url"
                      value={formData.logo || ''}
                      onChange={(e) => handleChange('logo', e.target.value)}
                      placeholder="https://example.com/logo.png"
                    />
                    <p className="text-xs text-gray-500">
                      Upload logo ke hosting image kemudian paste URL-nya di sini
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Kontak & Lokasi Tab */}
            <TabsContent value="contact" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Kontak</CardTitle>
                  <CardDescription>Detail kontak dan lokasi sekolah</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Alamat */}
                  <div className="space-y-2">
                    <Label htmlFor="address">Alamat Lengkap</Label>
                    <Textarea
                      id="address"
                      value={formData.address || ''}
                      onChange={(e) => handleChange('address', e.target.value)}
                      rows={3}
                      placeholder="Jl. Nama Jalan No. XX, Kecamatan, Kabupaten/Kota, Provinsi"
                    />
                  </div>

                  {/* Telepon & Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Nomor Telepon</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone || ''}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          className="pl-10"
                          placeholder="0274-123456"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          value={formData.email || ''}
                          onChange={(e) => handleChange('email', e.target.value)}
                          className="pl-10"
                          placeholder="info@sekolah.sch.id"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Website */}
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="website"
                        type="url"
                        value={formData.website || ''}
                        onChange={(e) => handleChange('website', e.target.value)}
                        className="pl-10"
                        placeholder="www.sekolah.sch.id"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Save Button */}
            <div className="flex justify-end pt-6">
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </div>
          </form>
        </Tabs>
      </div>
    </AdminLayout>
  )
}

