"use client"

import * as React from "react"
import Link from "next/link"
import { generateWhatsAppUrl } from "@/lib/whatsapp"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Calendar,
  Clock,
  Users,
  Award,
  Phone,
  MapPin,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Home,
} from "lucide-react"
import { useTabParam } from "@/hooks"
import { Breadcrumb, FloatingActions } from "@/components/navigation-components"

interface SPMBSettings {
  academicYear: string
  registrationOpen: boolean
  heroTitle: string
  heroSubtitle: string
  heroDescription: string | null
  gelombangData: any[]
  jalurData: any[]
  biayaData: any
  syaratData: string[]
  wawancaraData: any
  schoolAddress: string | null
  schoolPhone: string | null
  schoolEmail: string | null
}

const getColorClasses = (color: string) => {
  const colorMap: Record<string, { border: string; bg: string; text: string }> = {
    emerald: { border: 'border-emerald-200', bg: 'bg-emerald-600', text: 'text-emerald-600' },
    blue: { border: 'border-blue-200', bg: 'bg-blue-600', text: 'text-blue-600' },
    orange: { border: 'border-orange-200', bg: 'bg-orange-600', text: 'text-orange-600' },
    red: { border: 'border-red-200', bg: 'bg-red-600', text: 'text-red-600' },
    yellow: { border: 'border-yellow-200', bg: 'bg-yellow-600', text: 'text-yellow-600' },
    green: { border: 'border-green-200', bg: 'bg-green-600', text: 'text-green-600' },
  }
  return colorMap[color] || colorMap.emerald
}

export default function SMPBPage() {
  const { current, setTab } = useTabParam("gelombang")
  const [admissionsWA, setAdmissionsWA] = React.useState<{ phoneNumber: string; waUrl: string; label: string } | null>(null)
  const [spmb, setSpmb] = React.useState<SPMBSettings | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    // Fetch all data
    Promise.all([
      fetch('/api/settings/contact/admissions').then(res => res.json()),
      fetch('/api/spmb/settings').then(res => res.json())
    ])
      .then(([waData, spmbData]) => {
        // Set WhatsApp contact
        if (waData.data) {
          setAdmissionsWA({
            phoneNumber: waData.data.phoneNumber,
            waUrl: generateWhatsAppUrl(waData.data.phoneNumber, waData.data.waTemplate),
            label: waData.data.label
          })
        }
        
        // Set SPMB settings
        if (spmbData.data) {
          setSpmb(spmbData.data)
        }
      })
      .catch(err => console.error('Error fetching data:', err))
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: "Beranda", href: "/", icon: Home },
          { label: "SPMB", current: true },
        ]}
      />

      {/* Hero Section */}
      <section className="bg-emerald-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-10 bg-white/20 rounded w-3/4 mx-auto"></div>
                <div className="h-6 bg-white/20 rounded w-1/2 mx-auto"></div>
                <div className="h-20 bg-white/10 rounded w-full max-w-4xl mx-auto"></div>
              </div>
            ) : (
              <>
                <h1 className="text-4xl font-bold mb-4">{spmb?.heroTitle || 'SPMB SMP IT MASJID SYUHADA'}</h1>
                <p className="text-xl mb-2">{spmb?.heroSubtitle || 'TAHUN PELAJARAN 2025/2026'}</p>
                <p className="text-emerald-100 mb-6">Assalaamu'alaikum warahmatullaahi wabarakaatuh</p>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-4xl mx-auto">
                  <p className="text-lg leading-relaxed">
                    {spmb?.heroDescription || 'Selamat datang di laman informasi Penerimaan Peserta Didik Baru (PPDB) SMP IT Masjid Syuhada. Kami melayani pendaftaran secara online maupun offline dan TIDAK MEMBERLAKUKAN SISTEM ZONASI WILAYAH.'}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Post Registration Info Banner */}
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-4">
        <Card className="border-2 border-emerald-200 bg-emerald-50/50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Sudah Mendaftar?</h3>
                <p className="text-gray-700 mb-4">
                  Jika Anda telah menyelesaikan pendaftaran online, Anda dapat memantau status pendaftaran Anda kapan saja menggunakan nomor pendaftaran yang telah Anda terima.
                </p>
                
                <div className="bg-white rounded-lg p-4 mb-4 border border-emerald-200">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-emerald-600" />
                    <p className="font-semibold text-gray-900">Cara Cek Status Pendaftaran:</p>
                  </div>
                  <ol className="space-y-2 text-sm text-gray-700 ml-7">
                    <li>1. Kunjungi halaman <Link href="/registrar" className="text-emerald-600 hover:text-emerald-700 font-semibold underline">Cek Status Pendaftaran</Link></li>
                    <li>2. Masukkan nomor pendaftaran Anda (contoh: SPMB-2025-XXXX)</li>
                    <li>3. Lihat status terkini pendaftaran Anda dan keterangan lengkap</li>
                    <li>4. Cetak bukti pendaftaran jika diperlukan</li>
                  </ol>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link href="/registrar">
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Cek Status Pendaftaran
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Daftar Baru
                    </Button>
                  </Link>
                  <a href={admissionsWA?.waUrl || "https://wa.me/6285878958029"} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline">
                      <Phone className="h-4 w-4 mr-2" />
                      {admissionsWA?.label || "Bantuan: 0858 7895 8029"}
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <Tabs value={current} onValueChange={setTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="gelombang">Gelombang</TabsTrigger>
            <TabsTrigger value="jalur">Jalur</TabsTrigger>
            <TabsTrigger value="biaya">Biaya</TabsTrigger>
            <TabsTrigger value="syarat">Syarat</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          {/* Gelombang Pendaftaran */}
          <TabsContent value="gelombang" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-emerald-600" />
                  Gelombang Pendaftaran
                </CardTitle>
                <CardDescription>
                  Periode pendaftaran dibagi menjadi beberapa gelombang dengan potongan biaya yang berbeda
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="animate-pulse">
                        <div className="h-40 bg-gray-200 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {spmb?.gelombangData && spmb.gelombangData.length > 0 ? (
                      spmb.gelombangData.map((gelombang: any) => {
                        const colors = getColorClasses(gelombang.color)
                        return (
                          <Card key={gelombang.id} className={`border-2 ${colors.border}`}>
                            <CardHeader className="pb-3">
                              <Badge className={`w-fit ${colors.bg}`}>{gelombang.badge}</Badge>
                              <CardTitle className="text-lg">{gelombang.period}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-gray-600 mb-2">{gelombang.discount}</p>
                              <p className={`font-semibold ${colors.text}`}>{gelombang.description}</p>
                            </CardContent>
                          </Card>
                        )
                      })
                    ) : (
                      <p className="col-span-4 text-center text-gray-500">Belum ada data gelombang pendaftaran</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Jalur Pendaftaran */}
          <TabsContent value="jalur" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-emerald-600" />
                  Jalur Pendaftaran
                </CardTitle>
                <CardDescription>
                  Tersedia jalur reguler dan jalur prestasi dengan keunggulan masing-masing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border-2 border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-lg">Jalur Reguler</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">
                        Jalur pendaftaran umum untuk semua calon siswa yang memenuhi persyaratan dasar.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-emerald-200 bg-emerald-50">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Award className="h-5 w-5 text-emerald-600" />
                        Jalur Prestasi
                      </CardTitle>
                      <Badge className="w-fit bg-emerald-600">Dana pengembangan hanya Rp 1.000.000</Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-emerald-700 mb-2">Prestasi Akademik</h4>
                        <p className="text-sm text-gray-600">
                          Ranking 1-3 di kelas 4, 5, 6 SD (dibuktikan dengan surat pernyataan)
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-emerald-700 mb-2">Prestasi Non Akademik</h4>
                        <p className="text-sm text-gray-600">Dibuktikan dengan sertifikat kejuaraan lomba</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-emerald-700 mb-2">Prestasi Tahfidz</h4>
                        <p className="text-sm text-gray-600">
                          Hafal 3 juz Al-Quran (dibuktikan dengan sertifikat dan tes)
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Biaya */}
          <TabsContent value="biaya" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-6 w-6 text-emerald-600" />
                  Rincian Biaya
                </CardTitle>
                <CardDescription>Struktur biaya pendidikan di SMP IT Masjid Syuhada</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Biaya Wajib</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span>Dana Pengembangan</span>
                        <span className="font-semibold">Rp 5.000.000</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span>Pendaftaran (Formulir)</span>
                        <span className="font-semibold">Rp 100.000</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span>SPP + Komite (per bulan)</span>
                        <span className="font-semibold">Rp 580.000</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Potongan Biaya</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">Gelombang Inden</span>
                          <Badge className="bg-emerald-600">Rp 1.000.000</Badge>
                        </div>
                        <p className="text-sm text-emerald-700">Dana pengembangan khusus</p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">Gelombang 1</span>
                          <Badge className="bg-blue-600">Potongan 50%</Badge>
                        </div>
                        <p className="text-sm text-blue-700">Dari dana pengembangan</p>
                      </div>
                      <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">Gelombang 2</span>
                          <Badge className="bg-orange-600">Potongan 25%</Badge>
                        </div>
                        <p className="text-sm text-orange-700">Dari dana pengembangan</p>
                      </div>
                      <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">Jalur Prestasi</span>
                          <Badge className="bg-yellow-600">Rp 1.000.000</Badge>
                        </div>
                        <p className="text-sm text-yellow-700">Dana pengembangan khusus</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-800">Catatan Penting:</p>
                      <ul className="text-sm text-blue-700 mt-1 space-y-1">
                        <li>• Dana pengembangan dapat diangsur selama 1 semester (2-3 kali angsuran)</li>
                        <li>• SPP sudah termasuk catering</li>
                        <li>• Biaya tambahan untuk ekstrakurikuler Robotika dan Futsal</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Syarat Pendaftaran */}
          <TabsContent value="syarat" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-6 w-6 text-emerald-600" />
                    Syarat Pendaftaran
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2"></div>
                      <p className="text-sm">Mengisi Formulir Pendaftaran online</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2"></div>
                      <p className="text-sm">
                        Fotokopi Ijazah dan Surat Keterangan Nilai ASPD yang dilegalisir (gelombang 3)
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2"></div>
                      <p className="text-sm">Fotokopi Kartu Keluarga (C1) 1 lembar</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2"></div>
                      <p className="text-sm">Fotokopi Piagam Prestasi (jika ada)</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2"></div>
                      <p className="text-sm">Fotokopi Akta Kelahiran 1 lembar</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2"></div>
                      <p className="text-sm">Mengikuti wawancara siswa dan orangtua</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-6 w-6 text-emerald-600" />
                    Proses Wawancara
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-emerald-700 mb-2">Wawancara Siswa</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>
                          <strong>Diniyah:</strong> Praktek Ibadah, Membaca Al-Quran, Hafalan Surat-surat pendek
                        </p>
                        <p>
                          <strong>Kesiswaan:</strong> Pembiasaan/keseharian anak dan identifikasi potensi
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-emerald-700 mb-2">Wawancara Orangtua</h4>
                      <p className="text-sm text-gray-600">Tentang pembayaran administrasi keuangan</p>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                      <p className="text-sm text-emerald-700">
                        <strong>Catatan:</strong> Bacaan Quran dan hafalan tidak menjadi patokan lolos/tidaknya, hanya
                        untuk pemetaan siswa.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Action Reminder */}
            <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border border-emerald-200">
              <p className="text-center text-sm text-gray-700">
                💡 <strong>Siap mendaftar?</strong> Klik tombol <span className="text-emerald-600 font-semibold">"Daftar Baru"</span> di atas untuk memulai pendaftaran online, atau hubungi tim kami untuk bantuan.
              </p>
            </div>
          </TabsContent>

          {/* FAQ */}
          <TabsContent value="faq" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions (FAQ)</CardTitle>
                <CardDescription>
                  Pertanyaan yang paling sering ditanyakan seputar PPDB SMP IT Masjid Syuhada
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="space-y-2">
                  <AccordionItem value="item-0a" className="border-emerald-200 bg-emerald-50/30">
                    <AccordionTrigger className="font-bold text-emerald-900">
                      📋 Bagaimana cara cek status pendaftaran saya?
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 text-sm">
                        <p className="font-semibold text-emerald-900">
                          Setelah mendaftar online, Anda akan menerima nomor pendaftaran (contoh: SPMB-2025-XXXX):
                        </p>
                        <ol className="list-decimal list-inside space-y-2 ml-2">
                          <li>Kunjungi <Link href="/registrar" className="text-emerald-600 hover:text-emerald-700 font-semibold underline">halaman Cek Status</Link></li>
                          <li>Masukkan nomor pendaftaran</li>
                          <li>Lihat status real-time pendaftaran Anda</li>
                          <li>Baca catatan dari tim jika ada</li>
                          <li>Cetak bukti untuk arsip</li>
                        </ol>
                        <p className="text-emerald-800 bg-emerald-100 p-2 rounded">
                          💡 <strong>Tips:</strong> Simpan nomor pendaftaran. Cek status berkala setiap 1-2 hari kerja.
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-0b" className="border-blue-200 bg-blue-50/30">
                    <AccordionTrigger className="font-bold text-blue-900">
                      ⏱️ Berapa lama proses verifikasi?
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 text-sm">
                        <p><strong>Timeline:</strong></p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li><strong>Hari 1:</strong> Status <span className="text-yellow-600 font-semibold">Pending</span></li>
                          <li><strong>Hari 1-2:</strong> Status <span className="text-blue-600 font-semibold">Ditinjau</span></li>
                          <li><strong>Hari 2-3:</strong> Status <span className="text-green-600 font-semibold">Diterima</span>/<span className="text-red-600 font-semibold">Ditolak</span></li>
                          <li><strong>Hari 3-5:</strong> Tim menghubungi via WA/Email</li>
                        </ul>
                        <p className="text-blue-800 bg-blue-100 p-2 rounded mt-2">
                          📞 Belum ada kabar setelah 3 hari? Hubungi: 0858 7895 8029
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-0c" className="border-red-200 bg-red-50/30">
                    <AccordionTrigger className="font-bold text-red-900">
                      ❌ Jika ditolak, apa yang harus dilakukan?
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 text-sm">
                        <p><strong>Alasan Penolakan:</strong></p>
                        <ul className="list-disc list-inside space-y-1 ml-2 text-gray-700">
                          <li>Data tidak lengkap/valid</li>
                          <li>Kuota penuh</li>
                          <li>Usia tidak sesuai</li>
                          <li>Dokumen tidak sesuai</li>
                        </ul>
                        
                        <p className="font-semibold mt-3">Solusi:</p>
                        <ol className="list-decimal list-inside space-y-1 ml-2">
                          <li>Baca catatan di <Link href="/registrar" className="text-red-600 font-semibold underline">halaman tracking</Link></li>
                          <li>Hubungi WA: 0858 7895 8029 untuk klarifikasi</li>
                          <li>Perbaiki data dan daftar ulang jika memungkinkan</li>
                          <li>Daftar gelombang berikutnya jika kuota penuh</li>
                        </ol>

                        <p className="text-red-800 bg-red-100 p-2 rounded mt-2">
                          💬 Setiap penolakan ada catatannya. Anda bisa perbaiki dan daftar lagi!
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-0d" className="border-yellow-200 bg-yellow-50/30">
                    <AccordionTrigger className="font-bold text-yellow-900">
                      ⚠️ Ada masalah dengan data pendaftaran?
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 text-sm">
                        <p><strong>Masalah Umum:</strong></p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>Nomor HP/Email tidak aktif</li>
                          <li>Data orangtua tidak lengkap</li>
                          <li>Dokumen tidak terbaca</li>
                          <li>Alamat tidak jelas</li>
                        </ul>
                        
                        <p className="font-semibold mt-3">Cara Mengatasi:</p>
                        <ol className="list-decimal list-inside space-y-1 ml-2">
                          <li>Cek catatan tim di <Link href="/registrar" className="text-yellow-700 font-semibold underline">halaman status</Link></li>
                          <li>Hubungi WA: 0858 7895 8029</li>
                          <li>Siapkan data/dokumen perbaikan</li>
                          <li>Tim bantu update atau instruksi daftar ulang</li>
                        </ol>

                        <p className="text-yellow-800 bg-yellow-100 p-2 rounded mt-2">
                          ✅ Solusi cepat: Masalah biasanya selesai dalam 1 hari kerja!
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-1">
                    <AccordionTrigger>Bagaimana tata cara pendaftaran siswa baru?</AccordionTrigger>
                    <AccordionContent>
                      <ol className="list-decimal list-inside space-y-2 text-sm">
                        <li>Membayar uang pendaftaran Rp. 100.000</li>
                        <li>Mengisi formulir pendaftaran dengan melengkapi fotokopi akta lahir dan kartu keluarga</li>
                        <li>Mengikuti sesi wawancara (diniyah, kepribadian, keuangan)</li>
                        <li>Setelah dinyatakan lolos, membayar administrasi wajib</li>
                        <li>Mengambil kain seragam (jika sudah lunas administrasi wajib)</li>
                        <li>Dana Pengembangan dapat dibayarkan setelah masuk sekolah dan boleh diangsur</li>
                      </ol>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger>
                      Apakah belum bisa Quran dan belum hafal juz 30 tetap dapat lolos masuk?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm">
                        Ya, bacaan Quran dan hafalan yang dimiliki tidak menjadi patokan lolos atau tidaknya siswa. Hal
                        ini hanya menjadi pemetaan siswa untuk penempatan kelas yang sesuai.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger>Berapa kelas yang dibuka setiap angkatan?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm">
                        Total setiap angkatan ada 4 kelas: 2 kelas putra dan 2 kelas putri. Kelas putra dan putri
                        dipisah sesuai dengan konsep pendidikan Islam terpadu.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger>Jam berapa mulai KBM dan pulangnya?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm">
                        Jam masuk sekolah adalah 7.00 WIB, dimulai dengan sholat dhuha dan dzikir pagi di masjid
                        Syuhada, kemudian dilanjutkan dengan KBM. Pulang sekolah pukul 14.30 WIB jika tidak ada kegiatan
                        tambahan (ekstrakurikuler atau kegiatan diniyah).
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5">
                    <AccordionTrigger>Apakah siswa diperkenankan membawa HP?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm">
                        Siswa tidak boleh membawa HP ke sekolah. Untuk keperluan penjemputan, dapat menghubungi wali
                        kelas atau satpam sekolah. Jika ada keperluan mendesak dan harus membawa HP, harus dengan izin
                        dan dititipkan ke waka kesiswaan sampai pulang.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-6">
                    <AccordionTrigger>Apa saja ekstrakurikuler yang tersedia?</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="font-semibold">Ekstrakurikuler Wajib:</p>
                          <p>Pramuka</p>
                        </div>
                        <div>
                          <p className="font-semibold">Ekstrakurikuler Wajib Pilihan:</p>
                          <p>Qiro'ah, Murottal, Adzan, Kaligrafi, Pidato, Rebana, Acapella</p>
                        </div>
                        <div>
                          <p className="font-semibold">Ekstrakurikuler Umum Pilihan:</p>
                          <p>
                            Film Maker, Tari Tradisional, Nasyid Vocal, KIR, Robotika, Multimedia, OSN, Futsal,
                            Bulutangkis, Jemparingan, Pencak Silat
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-7">
                    <AccordionTrigger>Apa program unggulan sekolah?</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 text-sm">
                        <p>• Program Perbaikan Baca Alquran dengan metode Tilawati</p>
                        <p>• Hafalan/Tahfidz Alquran, baik yang reguler maupun intensif (takhosus)</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-8">
                    <AccordionTrigger>Apakah sekolah menerima siswa pindahan dari luar kota?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm">
                        Ya, kami menerima siswa pindahan dari luar kota. Untuk tata cara mengurus siswa pindah/mutasi
                        masuk, langsung hubungi Bu Ning/WA Center (0858 7895 8029).
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Contact Information - Compact */}
        <Card className="mt-8 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <h3 className="font-bold text-lg mb-1">Butuh Bantuan?</h3>
                <p className="text-emerald-100 text-sm">Tim kami siap membantu Anda</p>
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a href={admissionsWA?.waUrl || "https://wa.me/6285878958029"} target="_blank" rel="noopener noreferrer">
                  <Button variant="secondary" size="lg" className="shadow-lg">
                    <Phone className="h-4 w-4 mr-2" />
                    {admissionsWA?.label || "WA: 0858 7895 8029"}
                  </Button>
                </a>
                <Button variant="outline" size="lg" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                  <MapPin className="h-4 w-4 mr-2" />
                  Lokasi Sekolah
                </Button>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-emerald-500/30 text-center">
              <p className="text-emerald-100 text-xs">
                📱 Follow: <span className="text-white font-medium">YouTube</span> • <span className="text-white font-medium">TikTok</span> • <span className="text-white font-medium">Facebook</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floating Action Buttons */}
      <FloatingActions
        backButton={{
          href: "/",
          label: "Kembali ke Beranda",
        }}
        scrollToTop={{
          show: true,
          threshold: 400,
          label: "Kembali ke Atas",
        }}
      />
    </div>
  )
}
