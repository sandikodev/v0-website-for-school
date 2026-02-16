"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Building2, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

type Step = 1 | 2 | 3;

interface FormData {
  // Step 1: School Info
  schoolName: string;
  schoolType: string;
  npsn: string;
  address: string;
  city: string;
  province: string;
  phone: string;
  
  // Step 2: Admin Info
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  adminPosition: string;
  
  // Step 3: Account
  password: string;
  confirmPassword: string;
  subdomain: string;
}

export default function PlatformSignUpPage() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    schoolName: "",
    schoolType: "smp",
    npsn: "",
    address: "",
    city: "",
    province: "",
    phone: "",
    adminName: "",
    adminEmail: "",
    adminPhone: "",
    adminPosition: "kepala_sekolah",
    password: "",
    confirmPassword: "",
    subdomain: "",
  });

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError("");
  };

  const validateStep = (step: Step): boolean => {
    switch (step) {
      case 1:
        if (!formData.schoolName || !formData.npsn || !formData.address) {
          setError("Mohon lengkapi semua field yang wajib diisi");
          return false;
        }
        break;
      case 2:
        if (!formData.adminName || !formData.adminEmail || !formData.adminPhone) {
          setError("Mohon lengkapi informasi admin");
          return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.adminEmail)) {
          setError("Format email tidak valid");
          return false;
        }
        break;
      case 3:
        if (!formData.subdomain || !formData.password || !formData.confirmPassword) {
          setError("Mohon lengkapi semua field");
          return false;
        }
        if (formData.password.length < 8) {
          setError("Password minimal 8 karakter");
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError("Password tidak cocok");
          return false;
        }
        if (!/^[a-z0-9-]+$/.test(formData.subdomain)) {
          setError("Subdomain hanya boleh huruf kecil, angka, dan tanda hubung");
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(3, prev + 1) as Step);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1) as Step);
    setError("");
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/tenant/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registrasi gagal");
      }

      // Redirect to success page or dashboard
      router.push("/signup/success?subdomain=" + formData.subdomain);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat registrasi");
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { number: 1, title: "Informasi Sekolah", icon: Building2 },
    { number: 2, title: "Data Admin", icon: User },
    { number: 3, title: "Akun & Domain", icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">AkseSekolah</h1>
          </div>
          <p className="text-slate-600 text-lg">Daftarkan Sekolah Anda</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all",
                      currentStep >= step.number
                        ? "bg-blue-600 text-white"
                        : "bg-slate-200 text-slate-400"
                    )}
                  >
                    {currentStep > step.number ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </div>
                  <p className={cn(
                    "text-sm mt-2 font-medium",
                    currentStep >= step.number ? "text-slate-900" : "text-slate-400"
                  )}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "h-1 flex-1 mx-4 rounded transition-all",
                      currentStep > step.number ? "bg-blue-600" : "bg-slate-200"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <Card className="shadow-2xl border-0">
          <CardHeader>
            <CardTitle className="text-2xl">
              {currentStep === 1 && "Informasi Sekolah"}
              {currentStep === 2 && "Data Administrator"}
              {currentStep === 3 && "Buat Akun"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Masukkan informasi dasar sekolah Anda"}
              {currentStep === 2 && "Siapa yang akan mengelola platform ini?"}
              {currentStep === 3 && "Buat akun dan pilih subdomain Anda"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Step 1: School Info */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="schoolName">Nama Sekolah *</Label>
                  <Input
                    id="schoolName"
                    placeholder="SMP Negeri 1 Jakarta"
                    value={formData.schoolName}
                    onChange={(e) => updateFormData("schoolName", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="schoolType">Jenjang *</Label>
                    <select
                      id="schoolType"
                      value={formData.schoolType}
                      onChange={(e) => updateFormData("schoolType", e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="tk">TK</option>
                      <option value="sd">SD</option>
                      <option value="smp">SMP</option>
                      <option value="sma">SMA</option>
                      <option value="smk">SMK</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="npsn">NPSN *</Label>
                    <Input
                      id="npsn"
                      placeholder="12345678"
                      value={formData.npsn}
                      onChange={(e) => updateFormData("npsn", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Alamat Lengkap *</Label>
                  <Input
                    id="address"
                    placeholder="Jl. Pendidikan No. 123"
                    value={formData.address}
                    onChange={(e) => updateFormData("address", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Kota/Kabupaten</Label>
                    <Input
                      id="city"
                      placeholder="Jakarta"
                      value={formData.city}
                      onChange={(e) => updateFormData("city", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="province">Provinsi</Label>
                    <Input
                      id="province"
                      placeholder="DKI Jakarta"
                      value={formData.province}
                      onChange={(e) => updateFormData("province", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telepon Sekolah</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="021-12345678"
                    value={formData.phone}
                    onChange={(e) => updateFormData("phone", e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Admin Info */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="adminName">Nama Lengkap *</Label>
                  <Input
                    id="adminName"
                    placeholder="Dr. Ahmad Suryadi, M.Pd"
                    value={formData.adminName}
                    onChange={(e) => updateFormData("adminName", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adminPosition">Jabatan *</Label>
                  <select
                    id="adminPosition"
                    value={formData.adminPosition}
                    onChange={(e) => updateFormData("adminPosition", e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="kepala_sekolah">Kepala Sekolah</option>
                    <option value="wakil_kepala">Wakil Kepala Sekolah</option>
                    <option value="admin">Admin</option>
                    <option value="staff_tu">Staff TU</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="adminEmail"
                      type="email"
                      placeholder="admin@sekolah.sch.id"
                      value={formData.adminEmail}
                      onChange={(e) => updateFormData("adminEmail", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adminPhone">No. HP/WhatsApp *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="adminPhone"
                      type="tel"
                      placeholder="08123456789"
                      value={formData.adminPhone}
                      onChange={(e) => updateFormData("adminPhone", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Account */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subdomain">Subdomain *</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="subdomain"
                      placeholder="sekolahku"
                      value={formData.subdomain}
                      onChange={(e) => updateFormData("subdomain", e.target.value.toLowerCase())}
                      className="flex-1"
                    />
                    <span className="text-sm text-slate-600 whitespace-nowrap">
                      .aksesekolah.id
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    URL sekolah Anda: https://{formData.subdomain || "sekolahku"}.aksesekolah.id
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Minimal 8 karakter"
                      value={formData.password}
                      onChange={(e) => updateFormData("password", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Konfirmasi Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Ketik ulang password"
                      value={formData.confirmPassword}
                      onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                  <h4 className="font-semibold text-blue-900 mb-2">Yang Anda Dapatkan:</h4>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li className="flex items-center">
                      <Check className="w-4 h-4 mr-2 flex-shrink-0" />
                      Website sekolah dengan subdomain sendiri
                    </li>
                    <li className="flex items-center">
                      <Check className="w-4 h-4 mr-2 flex-shrink-0" />
                      Dashboard admin untuk kelola data
                    </li>
                    <li className="flex items-center">
                      <Check className="w-4 h-4 mr-2 flex-shrink-0" />
                      Sistem PPDB/SPMB online
                    </li>
                    <li className="flex items-center">
                      <Check className="w-4 h-4 mr-2 flex-shrink-0" />
                      SSL certificate gratis
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1 || isLoading}
                className="min-w-[120px]"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>

              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="min-w-[120px]"
                >
                  Lanjut
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="min-w-[120px]"
                >
                  {isLoading ? "Memproses..." : "Daftar Sekarang"}
                </Button>
              )}
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Sudah punya akun?{" "}
                <Link href="/signin" className="text-blue-600 hover:underline font-medium">
                  Masuk di sini
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-xs text-center text-slate-500 mt-6">
          Dengan mendaftar, Anda menyetujui{" "}
          <Link href="/terms" className="text-blue-600 hover:underline">
            Syarat & Ketentuan
          </Link>{" "}
          dan{" "}
          <Link href="/privacy" className="text-blue-600 hover:underline">
            Kebijakan Privasi
          </Link>
        </p>
      </div>
    </div>
  );
}
