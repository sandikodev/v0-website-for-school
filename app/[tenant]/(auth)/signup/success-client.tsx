"use client";

import { Copy, Paperclip, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SignupUploadedFile } from "@/hooks/useSignupForm";

interface SuccessClientProps {
  registrationNumber: string;
  uploadedFiles: SignupUploadedFile[];
  onReset: () => void;
}

export default function SuccessClient({
  registrationNumber,
  uploadedFiles,
  onReset,
}: SuccessClientProps) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(registrationNumber);
  };

  return (
    <div className="flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="p-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <span className="text-3xl">🎉</span>
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            Pendaftaran Berhasil!
          </h2>
          <p className="mb-6 text-gray-600">
            Terima kasih telah mendaftar. Simpan nomor berikut untuk memantau
            status pendaftaran Anda.
          </p>

          <div className="mb-4 rounded-lg border-2 border-emerald-200 bg-linear-to-br from-emerald-50 to-emerald-100/50 p-4">
            <p className="mb-2 text-sm font-medium text-gray-900">
              Nomor Pendaftaran Anda
            </p>
            <div className="relative">
              <p className="mb-3 select-all text-2xl font-bold text-emerald-600">
                {registrationNumber}
              </p>
              <Button
                onClick={handleCopy}
                variant="outline"
                size="sm"
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white"
              >
                <Copy className="mr-2 h-4 w-4" />
                Salin Nomor
              </Button>
            </div>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="mt-4 border-t pt-4 text-left">
              <h3 className="mb-2 text-sm font-semibold text-gray-800">
                Dokumen Terunggah
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {uploadedFiles.map((file) => (
                  <li key={file.filename} className="flex items-start gap-2">
                    <Paperclip className="mt-0.5 h-4 w-4 text-emerald-500" />
                    <div>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 hover:underline"
                      >
                        {file.originalName}
                      </a>
                      <p className="text-xs text-gray-400">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 space-y-3">
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              onClick={() =>
                (window.location.href = `/registrar?id=${registrationNumber}`)
              }
            >
              <Search className="mr-2 h-5 w-5" />
              Pantau Status Pendaftaran
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => (window.location.href = "/admissions")}
            >
              Kembali ke Halaman SPMB
            </Button>
            <Button variant="ghost" className="w-full text-sm" onClick={onReset}>
              Isi Formulir Baru
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

