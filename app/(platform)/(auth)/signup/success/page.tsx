"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Check, ArrowRight, ExternalLink } from "lucide-react";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subdomain = searchParams.get("subdomain");
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (!subdomain) {
      router.push("/signin");
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/dashboard");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [subdomain, router]);

  if (!subdomain) {
    return null;
  }

  const tenantUrl = `https://${subdomain}.aksesekolah.id`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">AkseSekolah</h1>
          </div>
        </div>

        {/* Success Card */}
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <CardTitle className="text-3xl text-green-600">Registrasi Berhasil!</CardTitle>
            <CardDescription className="text-base mt-2">
              Sekolah Anda telah berhasil terdaftar di platform AkseSekolah
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Tenant Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3">Informasi Akun Anda:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-blue-800">Subdomain:</span>
                  <span className="font-mono font-semibold text-blue-900">{subdomain}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-800">URL Website:</span>
                  <a
                    href={tenantUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-blue-600 hover:underline flex items-center"
                  >
                    {tenantUrl}
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900">Langkah Selanjutnya:</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Lengkapi profil sekolah di dashboard admin</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Konfigurasi sistem PPDB/SPMB</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Tambahkan konten dan informasi sekolah</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Undang staff untuk mengelola platform</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <Button
                onClick={() => router.push("/dashboard")}
                className="w-full h-12 text-base font-medium"
              >
                Masuk ke Dashboard
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

              <a href={tenantUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full h-12 text-base font-medium">
                  Lihat Website Sekolah
                  <ExternalLink className="ml-2 w-4 h-4" />
                </Button>
              </a>
            </div>

            {/* Auto Redirect Notice */}
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-slate-600">
                Anda akan diarahkan ke dashboard dalam{" "}
                <span className="font-semibold text-blue-600">{countdown}</span> detik
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <div className="text-center mt-6">
          <p className="text-sm text-slate-600">
            Butuh bantuan?{" "}
            <Link href="/contact" className="text-blue-600 hover:underline font-medium">
              Hubungi Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignUpSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
