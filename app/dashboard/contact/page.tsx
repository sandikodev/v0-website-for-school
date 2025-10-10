"use client"

import * as React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Globe,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Calendar,
  Users,
  Building,
  Car,
  Bus,
  Wifi,
  Shield,
  Camera,
  Music,
  Dumbbell,
  Microscope,
  Computer,
  BookOpen,
  GraduationCap,
  Award,
  School,
  Settings,
  MessageSquare,
  FileText
} from "lucide-react"
import { useTabParam } from "@/hooks"
import { WhatsAppSettings } from "@/components/dashboard/whatsapp-settings"

export default function ContactPage() {
  const { current, setTab } = useTabParam("contact")

  return (
    <div className="space-y-6">
      <nav aria-label="Contact sections" className="mb-6 overflow-x-auto">
        <ul className="flex items-center gap-1">
          {[
            { key: "contact", label: "Kontak" },
            { key: "whatsapp", label: "WhatsApp Center" },
            { key: "hours", label: "Jam Operasional" },
            { key: "social", label: "Media Sosial" },
            { key: "location", label: "Lokasi" },
          ].map((item) => {
            const isActive = current === item.key
            return (
              <li key={item.key}>
                <button
                  onClick={() => setTab(item.key)}
                  className={`inline-flex items-center rounded-md px-3 py-2 text-sm transition-colors ${
                    isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent text-muted-foreground"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      <Tabs value={current} onValueChange={setTab} className="w-full">
        {/* Informasi Kontak */}
        <TabsContent value="contact">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Informasi Kontak Utama
                </CardTitle>
                <CardDescription>Informasi kontak utama sekolah</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <Input id="phone" placeholder="(0274) 123-4567" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="fax">Nomor Fax</Label>
                  <Input id="fax" placeholder="(0274) 123-4568" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" placeholder="info@smp-syuhada.sch.id" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" placeholder="www.smp-syuhada.sch.id" />
                </div>
                <div className="grid gap-2 md:col-span-2">
                  <Label htmlFor="emergency-contact">Kontak Darurat</Label>
                  <Input id="emergency-contact" placeholder="0812-3456-7890 (24 Jam)" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Kontak Person
                </CardTitle>
                <CardDescription>Kontak person untuk berbagai keperluan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="principal-contact">Kepala Sekolah</Label>
                    <Input id="principal-contact" placeholder="Dr. Ahmad Fauzi, M.Pd - 0812-3456-7891" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vice-principal-contact">Wakil Kepala Sekolah</Label>
                    <Input id="vice-principal-contact" placeholder="Siti Rahma, S.Pd - 0812-3456-7892" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="curriculum-contact">Koordinator Kurikulum</Label>
                    <Input id="curriculum-contact" placeholder="Budi Setiawan, M.Pd - 0812-3456-7893" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="student-affairs-contact">Kesiswaan</Label>
                    <Input id="student-affairs-contact" placeholder="Fatimah Az-Zahra, S.Pd - 0812-3456-7894" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admission-contact">Penerimaan Siswa Baru</Label>
                    <Input id="admission-contact" placeholder="Muhammad Yusuf, S.Pd - 0812-3456-7895" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="finance-contact">Keuangan</Label>
                    <Input id="finance-contact" placeholder="Ahmad Rizki, S.E - 0812-3456-7896" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* WhatsApp Center */}
        <TabsContent value="whatsapp">
          <WhatsAppSettings />
        </TabsContent>

        {/* Jam Operasional */}
        <TabsContent value="hours">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Jam Operasional Sekolah
                </CardTitle>
                <CardDescription>Jadwal operasional sekolah</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="school-hours">Jam Sekolah</Label>
                    <Input id="school-hours" placeholder="07:00 - 15:00 WIB" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="office-hours">Jam Kantor</Label>
                    <Input id="office-hours" placeholder="07:00 - 16:00 WIB" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="break-time">Jam Istirahat</Label>
                    <Input id="break-time" placeholder="09:30 - 10:00 & 12:00 - 12:30" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prayer-time">Jam Shalat</Label>
                    <Input id="prayer-time" placeholder="Dzuhur: 12:00, Ashar: 15:30" />
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Jadwal Mingguan</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="monday-friday">Senin - Jumat</Label>
                      <Input id="monday-friday" placeholder="07:00 - 15:00 (Kegiatan Belajar)" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="saturday">Sabtu</Label>
                      <Input id="saturday" placeholder="07:00 - 12:00 (Ekstrakurikuler)" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sunday">Minggu</Label>
                      <Input id="sunday" placeholder="Libur (Kecuali Kegiatan Khusus)" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="holidays">Hari Libur</Label>
                      <Input id="holidays" placeholder="Mengikuti Kalender Pendidikan" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Jadwal Khusus
                </CardTitle>
                <CardDescription>Jadwal kegiatan khusus dan acara</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="upacara">Upacara Bendera</Label>
                    <Input id="upacara" placeholder="Setiap Senin, 07:00 - 08:00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meeting">Rapat Guru</Label>
                    <Input id="meeting" placeholder="Setiap Jumat, 15:00 - 16:00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parent-meeting">Pertemuan Orang Tua</Label>
                    <Input id="parent-meeting" placeholder="Setiap Bulan, Sabtu 08:00 - 12:00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="exam-period">Masa Ujian</Label>
                    <Input id="exam-period" placeholder="Jadwal Khusus (Diumumkan)" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Media Sosial */}
        <TabsContent value="social">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Media Sosial & Online
                </CardTitle>
                <CardDescription>Akun media sosial dan platform online sekolah</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input id="facebook" placeholder="SMP Syuhada Official" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input id="instagram" placeholder="@smpsyuhada_official" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="youtube">YouTube</Label>
                    <Input id="youtube" placeholder="SMP Syuhada Channel" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input id="twitter" placeholder="@smpsyuhada" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tiktok">TikTok</Label>
                    <Input id="tiktok" placeholder="@smpsyuhada_official" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input id="linkedin" placeholder="SMP Syuhada" />
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Platform Online</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="e-learning">E-Learning Platform</Label>
                      <Input id="e-learning" placeholder="https://elearning.smp-syuhada.sch.id" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="student-portal">Portal Siswa</Label>
                      <Input id="student-portal" placeholder="https://portal.smp-syuhada.sch.id" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="parent-portal">Portal Orang Tua</Label>
                      <Input id="parent-portal" placeholder="https://ortu.smp-syuhada.sch.id" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="teacher-portal">Portal Guru</Label>
                      <Input id="teacher-portal" placeholder="https://guru.smp-syuhada.sch.id" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Lokasi */}
        <TabsContent value="location">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Informasi Lokasi
                </CardTitle>
                <CardDescription>Alamat dan informasi lokasi sekolah</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="address">Alamat Lengkap</Label>
                    <Textarea 
                      id="address" 
                      placeholder="Jl. Pendidikan No. 123, Kelurahan Pendidikan, Kecamatan Pendidikan, Kota Yogyakarta, Daerah Istimewa Yogyakarta 55111"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postal-code">Kode Pos</Label>
                    <Input id="postal-code" placeholder="55111" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Kota/Kabupaten</Label>
                    <Input id="city" placeholder="Kota Yogyakarta" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="province">Provinsi</Label>
                    <Input id="province" placeholder="Daerah Istimewa Yogyakarta" />
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Akses Transportasi</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="public-transport">Transportasi Umum</Label>
                      <Textarea 
                        id="public-transport" 
                        placeholder="Bus Trans Jogja: Halte Pendidikan (Rute 1A, 2B)&#10;Angkot: Jalur 15, 16, 17&#10;Ojek Online: Tersedia 24 jam"
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="parking">Area Parkir</Label>
                      <Textarea 
                        id="parking" 
                        placeholder="Parkir Motor: 200 slot&#10;Parkir Mobil: 50 slot&#10;Parkir Bus: 5 slot&#10;Area khusus untuk tamu"
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="landmarks">Titik Acuan</Label>
                      <Textarea 
                        id="landmarks" 
                        placeholder="Sebelah timur: Pasar Pendidikan&#10;Sebelah barat: Masjid Al-Ikhlas&#10;Sebelah utara: SD Negeri 1 Pendidikan&#10;Sebelah selatan: Puskesmas Pendidikan"
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="coordinates">Koordinat GPS</Label>
                      <Input id="coordinates" placeholder="-7.7956, 110.3695" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Fasilitas Umum Sekitar
                </CardTitle>
                <CardDescription>Fasilitas umum di sekitar sekolah</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Building className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Bank</p>
                      <p className="text-sm text-muted-foreground">BCA, BRI, Mandiri</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Building className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Rumah Sakit</p>
                      <p className="text-sm text-muted-foreground">RS Pendidikan (2 km)</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Building className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="font-medium">Puskesmas</p>
                      <p className="text-sm text-muted-foreground">Puskesmas Pendidikan</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Building className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="font-medium">Pasar</p>
                      <p className="text-sm text-muted-foreground">Pasar Pendidikan</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Building className="h-5 w-5 text-pink-500" />
                    <div>
                      <p className="font-medium">Masjid</p>
                      <p className="text-sm text-muted-foreground">Masjid Al-Ikhlas</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Building className="h-5 w-5 text-indigo-500" />
                    <div>
                      <p className="font-medium">ATM</p>
                      <p className="text-sm text-muted-foreground">Tersedia 24 jam</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
