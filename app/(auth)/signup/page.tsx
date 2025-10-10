"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { User, GraduationCap, Upload, CheckCircle, AlertCircle, ArrowLeft, ArrowRight } from "lucide-react"
import { defaultFormSchema, loadFormSchema } from "@/lib/form-schema"

interface FormData {
  // Data Siswa
  namaLengkap: string
  tempatLahir: string
  tanggalLahir: string
  jenisKelamin: string
  alamatLengkap: string
  noHP: string
  email: string

  // Data Orangtua
  namaAyah: string
  pekerjaanAyah: string
  namaIbu: string
  pekerjaanIbu: string
  noHPOrangtua: string

  // Data Sekolah
  asalSekolah: string
  alamatSekolah: string

  // Data Tambahan
  prestasi: string
  jalurPendaftaran: string
  gelombangPendaftaran: string

  // Persetujuan
  persetujuan: boolean
}

export default function FormulirOnlinePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [schema, setSchema] = useState(defaultFormSchema)
  const [formData, setFormData] = useState<FormData>({
    namaLengkap: "",
    tempatLahir: "",
    tanggalLahir: "",
    jenisKelamin: "",
    alamatLengkap: "",
    noHP: "",
    email: "",
    namaAyah: "",
    pekerjaanAyah: "",
    namaIbu: "",
    pekerjaanIbu: "",
    noHPOrangtua: "",
    asalSekolah: "",
    alamatSekolah: "",
    prestasi: "",
    jalurPendaftaran: "",
    gelombangPendaftaran: "",
    persetujuan: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  useEffect(() => {
    setSchema(loadFormSchema())
  }, [])

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        setSubmitSuccess(true)
        // Store registration number for display
        sessionStorage.setItem('registrationNumber', result.data.registrationNumber)
      } else {
        alert(result.message || 'Gagal mengirim pendaftaran')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Terjadi kesalahan saat mengirim pendaftaran')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    const registrationNumber = sessionStorage.getItem('registrationNumber') || 'N/A'
    
    return (
      <div className="flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Pendaftaran Berhasil!</h2>
            <p className="text-gray-600 mb-6">
              Terima kasih telah mendaftar. Kami akan menghubungi Anda dalam 1-2 hari kerja untuk proses selanjutnya.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm font-medium text-gray-900">Nomor Pendaftaran</p>
              <p className="text-lg font-bold text-emerald-600">{registrationNumber}</p>
              <p className="text-xs text-gray-500 mt-2">Simpan nomor ini untuk referensi Anda</p>
            </div>
            <Button
              onClick={() => (window.location.href = "/admissions")}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              Kembali ke SPMB
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-800 mb-2">Formulir Pendaftaran Online</h1>
          <p className="text-gray-600">SMP IT Masjid Syuhada - Tahun Pelajaran 2025/2026</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Langkah {currentStep} dari {totalSteps}
            </span>
            <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {currentStep === 1 && (
                <>
                  <User className="h-5 w-5" /> Data Pribadi Siswa
                </>
              )}
              {currentStep === 2 && (
                <>
                  <User className="h-5 w-5" /> Data Orangtua
                </>
              )}
              {currentStep === 3 && (
                <>
                  <GraduationCap className="h-5 w-5" /> Data Sekolah & Prestasi
                </>
              )}
              {currentStep === 4 && (
                <>
                  <CheckCircle className="h-5 w-5" /> Konfirmasi & Persetujuan
                </>
              )}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Lengkapi data pribadi calon siswa"}
              {currentStep === 2 && "Lengkapi data orangtua/wali"}
              {currentStep === 3 && "Lengkapi data sekolah asal dan prestasi"}
              {currentStep === 4 && "Periksa kembali data dan berikan persetujuan"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Data Pribadi */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {schema.namaLengkap.enabled && (
                    <div>
                      <Label htmlFor="namaLengkap">Nama Lengkap {schema.namaLengkap.required ? "*" : ""}</Label>
                      <Input
                        id="namaLengkap"
                        value={formData.namaLengkap}
                        onChange={(e) => handleInputChange("namaLengkap", e.target.value)}
                        placeholder="Masukkan nama lengkap"
                        required={schema.namaLengkap.required}
                      />
                    </div>
                  )}
                  {schema.tempatLahir.enabled && (
                    <div>
                      <Label htmlFor="tempatLahir">Tempat Lahir {schema.tempatLahir.required ? "*" : ""}</Label>
                      <Input
                        id="tempatLahir"
                        value={formData.tempatLahir}
                        onChange={(e) => handleInputChange("tempatLahir", e.target.value)}
                        placeholder="Masukkan tempat lahir"
                        required={schema.tempatLahir.required}
                      />
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {schema.tanggalLahir.enabled && (
                    <div>
                      <Label htmlFor="tanggalLahir">Tanggal Lahir {schema.tanggalLahir.required ? "*" : ""}</Label>
                      <Input
                        id="tanggalLahir"
                        type="date"
                        value={formData.tanggalLahir}
                        onChange={(e) => handleInputChange("tanggalLahir", e.target.value)}
                        required={schema.tanggalLahir.required}
                      />
                    </div>
                  )}
                  {schema.jenisKelamin.enabled && (
                    <div>
                      <Label>Jenis Kelamin {schema.jenisKelamin.required ? "*" : ""}</Label>
                      <RadioGroup
                        value={formData.jenisKelamin}
                        onValueChange={(value) => handleInputChange("jenisKelamin", value)}
                        className="flex gap-6 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="laki-laki" id="laki-laki" />
                          <Label htmlFor="laki-laki">Laki-laki</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="perempuan" id="perempuan" />
                          <Label htmlFor="perempuan">Perempuan</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  )}
                </div>

                {schema.alamatLengkap.enabled && (
                  <div>
                    <Label htmlFor="alamatLengkap">Alamat Lengkap {schema.alamatLengkap.required ? "*" : ""}</Label>
                    <Textarea
                      id="alamatLengkap"
                      value={formData.alamatLengkap}
                      onChange={(e) => handleInputChange("alamatLengkap", e.target.value)}
                      placeholder="Masukkan alamat lengkap"
                      rows={3}
                      required={schema.alamatLengkap.required}
                    />
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  {schema.noHP.enabled && (
                    <div>
                      <Label htmlFor="noHP">No. HP Siswa {schema.noHP.required ? "*" : ""}</Label>
                      <Input
                        id="noHP"
                        value={formData.noHP}
                        onChange={(e) => handleInputChange("noHP", e.target.value)}
                        placeholder="08xxxxxxxxxx"
                        required={schema.noHP.required}
                      />
                    </div>
                  )}
                  {schema.email.enabled && (
                    <div>
                      <Label htmlFor="email">Email {schema.email.required ? "*" : ""}</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="email@example.com"
                        required={schema.email.required}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Data Orangtua */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {schema.namaAyah.enabled && (
                    <div>
                      <Label htmlFor="namaAyah">Nama Ayah {schema.namaAyah.required ? "*" : ""}</Label>
                      <Input
                        id="namaAyah"
                        value={formData.namaAyah}
                        onChange={(e) => handleInputChange("namaAyah", e.target.value)}
                        placeholder="Masukkan nama ayah"
                        required={schema.namaAyah.required}
                      />
                    </div>
                  )}
                  {schema.pekerjaanAyah.enabled && (
                    <div>
                      <Label htmlFor="pekerjaanAyah">Pekerjaan Ayah {schema.pekerjaanAyah.required ? "*" : ""}</Label>
                      <Input
                        id="pekerjaanAyah"
                        value={formData.pekerjaanAyah}
                        onChange={(e) => handleInputChange("pekerjaanAyah", e.target.value)}
                        placeholder="Masukkan pekerjaan ayah"
                        required={schema.pekerjaanAyah.required}
                      />
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {schema.namaIbu.enabled && (
                    <div>
                      <Label htmlFor="namaIbu">Nama Ibu {schema.namaIbu.required ? "*" : ""}</Label>
                      <Input
                        id="namaIbu"
                        value={formData.namaIbu}
                        onChange={(e) => handleInputChange("namaIbu", e.target.value)}
                        placeholder="Masukkan nama ibu"
                        required={schema.namaIbu.required}
                      />
                    </div>
                  )}
                  {schema.pekerjaanIbu.enabled && (
                    <div>
                      <Label htmlFor="pekerjaanIbu">Pekerjaan Ibu {schema.pekerjaanIbu.required ? "*" : ""}</Label>
                      <Input
                        id="pekerjaanIbu"
                        value={formData.pekerjaanIbu}
                        onChange={(e) => handleInputChange("pekerjaanIbu", e.target.value)}
                        placeholder="Masukkan pekerjaan ibu"
                        required={schema.pekerjaanIbu.required}
                      />
                    </div>
                  )}
                </div>

                {schema.noHPOrangtua.enabled && (
                  <div>
                    <Label htmlFor="noHPOrangtua">No. HP Orangtua {schema.noHPOrangtua.required ? "*" : ""}</Label>
                    <Input
                      id="noHPOrangtua"
                      value={formData.noHPOrangtua}
                      onChange={(e) => handleInputChange("noHPOrangtua", e.target.value)}
                      placeholder="08xxxxxxxxxx"
                      required={schema.noHPOrangtua.required}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Nomor ini akan digunakan untuk komunikasi terkait proses pendaftaran
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Data Sekolah & Prestasi */}
            {currentStep === 3 && (
              <div className="space-y-4">
                {schema.asalSekolah.enabled && (
                  <div>
                    <Label htmlFor="asalSekolah">Asal Sekolah (SD/MI) {schema.asalSekolah.required ? "*" : ""}</Label>
                    <Input
                      id="asalSekolah"
                      value={formData.asalSekolah}
                      onChange={(e) => handleInputChange("asalSekolah", e.target.value)}
                      placeholder="Nama sekolah asal"
                      required={schema.asalSekolah.required}
                    />
                  </div>
                )}

                {schema.alamatSekolah.enabled && (
                  <div>
                    <Label htmlFor="alamatSekolah">
                      Alamat Sekolah Asal {schema.alamatSekolah.required ? "*" : ""}
                    </Label>
                    <Input
                      id="alamatSekolah"
                      value={formData.alamatSekolah}
                      onChange={(e) => handleInputChange("alamatSekolah", e.target.value)}
                      placeholder="Alamat sekolah asal"
                      required={schema.alamatSekolah.required}
                    />
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  {schema.jalurPendaftaran.enabled && (
                    <div>
                      <Label htmlFor="jalurPendaftaran">
                        Jalur Pendaftaran {schema.jalurPendaftaran.required ? "*" : ""}
                      </Label>
                      <Select
                        value={formData.jalurPendaftaran}
                        onValueChange={(value) => handleInputChange("jalurPendaftaran", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jalur pendaftaran" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="reguler">Jalur Reguler</SelectItem>
                          <SelectItem value="prestasi">Jalur Prestasi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {schema.gelombangPendaftaran.enabled && (
                    <div>
                      <Label htmlFor="gelombangPendaftaran">
                        Gelombang Pendaftaran {schema.gelombangPendaftaran.required ? "*" : ""}
                      </Label>
                      <Select
                        value={formData.gelombangPendaftaran}
                        onValueChange={(value) => handleInputChange("gelombangPendaftaran", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih gelombang" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gelombang-1">Gelombang 1 (Potongan 50%)</SelectItem>
                          <SelectItem value="gelombang-2">Gelombang 2 (Potongan 25%)</SelectItem>
                          <SelectItem value="gelombang-3">Gelombang 3 (Tanpa Potongan)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {schema.prestasi.enabled && (
                  <div>
                    <Label htmlFor="prestasi">Prestasi yang Pernah Diraih {schema.prestasi.required ? "*" : ""}</Label>
                    <Textarea
                      id="prestasi"
                      value={formData.prestasi}
                      onChange={(e) => handleInputChange("prestasi", e.target.value)}
                      placeholder="Tuliskan prestasi akademik/non-akademik yang pernah diraih (opsional)"
                      rows={4}
                      required={schema.prestasi.required}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Khusus untuk jalur prestasi, wajib melampirkan sertifikat
                    </p>
                  </div>
                )}

                {schema.uploadDokumen.enabled && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Upload Foto Siswa & Dokumen Pendukung</p>
                    <p className="text-xs text-gray-500 mb-4">
                      {schema.uploadDokumen.required ? "Wajib diunggah. " : ""}
                      Format: JPG, PNG, PDF. Maksimal 5MB per file
                    </p>
                    <Button variant="outline" size="sm">
                      Pilih File
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Konfirmasi */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Periksa kembali semua data yang telah Anda masukkan sebelum mengirim formulir.
                  </AlertDescription>
                </Alert>

                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <h3 className="font-semibold text-gray-900">Ringkasan Data</h3>

                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p>
                        <strong>Nama:</strong> {formData.namaLengkap}
                      </p>
                      <p>
                        <strong>TTL:</strong> {formData.tempatLahir}, {formData.tanggalLahir}
                      </p>
                      <p>
                        <strong>Jenis Kelamin:</strong> {formData.jenisKelamin}
                      </p>
                      <p>
                        <strong>Asal Sekolah:</strong> {formData.asalSekolah}
                      </p>
                    </div>
                    <div>
                      <p>
                        <strong>Nama Ayah:</strong> {formData.namaAyah}
                      </p>
                      <p>
                        <strong>Nama Ibu:</strong> {formData.namaIbu}
                      </p>
                      <p>
                        <strong>No. HP Orangtua:</strong> {formData.noHPOrangtua}
                      </p>
                      <p>
                        <strong>Jalur:</strong> {formData.jalurPendaftaran}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="persetujuan"
                      checked={formData.persetujuan}
                      onCheckedChange={(checked) => handleInputChange("persetujuan", checked as boolean)}
                    />
                    <Label htmlFor="persetujuan" className="text-sm leading-relaxed">
                      Saya menyatakan bahwa data yang saya masukkan adalah benar dan dapat dipertanggungjawabkan. Saya
                      bersedia mengikuti seluruh proses seleksi dan mematuhi peraturan yang berlaku di SMP IT Masjid
                      Syuhada.
                    </Label>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Sebelumnya
              </Button>

              {currentStep < totalSteps ? (
                <Button onClick={handleNext} className="bg-emerald-600 hover:bg-emerald-700">
                  Selanjutnya
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!formData.persetujuan || isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {isSubmitting ? "Mengirim..." : "Kirim Pendaftaran"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Info Box */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Informasi Penting:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Pastikan semua data yang dimasukkan sudah benar</li>
                  <li>• Setelah mengirim formulir, Anda akan mendapat nomor pendaftaran</li>
                  <li>• Tim kami akan menghubungi dalam 1-2 hari kerja untuk jadwal wawancara</li>
                  <li>• Untuk pertanyaan, hubungi WA Center: 085878958029</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
