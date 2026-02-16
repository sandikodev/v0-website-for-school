"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Shield } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";

export default function PlatformSignInPage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">AkseSekolah</h1>
                <p className="text-sm text-slate-600">Platform Management</p>
              </div>
            </div>

            <div className="space-y-3 pt-8">
              <h2 className="text-2xl font-semibold text-slate-900">
                Kelola Platform Pendidikan Anda
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                Sistem manajemen sekolah yang powerful dan mudah digunakan.
                Kelola multiple sekolah, siswa, dan data akademik dalam satu platform.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Keamanan Terjamin</h3>
                <p className="text-sm text-slate-600">Data terenkripsi dan backup otomatis</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Building2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Multi-Tenant</h3>
                <p className="text-sm text-slate-600">Kelola banyak sekolah dalam satu dashboard</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <Card className="shadow-2xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold">Masuk ke Platform</CardTitle>
            <CardDescription className="text-base">
              Masukkan kredensial Anda untuk mengakses dashboard
            </CardDescription>
          </CardHeader>

          <CardContent>
            <LoginForm type="platform" />

            <div className="mt-6 pt-6 border-t border-slate-200">
              <p className="text-xs text-center text-slate-500">
                Dengan masuk, Anda menyetujui{" "}
                <Link href="/terms" className="text-blue-600 hover:underline">
                  Syarat & Ketentuan
                </Link>{" "}
                dan{" "}
                <Link href="/privacy" className="text-blue-600 hover:underline">
                  Kebijakan Privasi
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
