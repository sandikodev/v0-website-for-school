"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { XCircle, Search, HelpCircle, ExternalLink, RefreshCw } from "lucide-react";
import Link from "next/link";

interface NotFoundCardProps {
  query: string;
  onReset: () => void;
  onRetry?: () => void;
}

export function NotFoundCard({ query, onReset, onRetry }: NotFoundCardProps) {
  const [isRetrying, setIsRetrying] = React.useState(false);

  const handleRetry = React.useCallback(async () => {
    setIsRetrying(true);
    // Small delay to show retry state
    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsRetrying(false);
    if (onRetry) {
      onRetry();
    } else {
      onReset();
    }
  }, [onReset, onRetry]);

  return (
    <Card className="no-print border-red-200 bg-red-50/50 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="shrink-0">
            <XCircle className="h-6 w-6 text-red-600" aria-hidden="true" />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="mb-1 text-lg font-semibold text-red-900">
                Nomor Pendaftaran Tidak Ditemukan
              </h3>
              <p className="text-sm text-red-700">
                Nomor pendaftaran{" "}
                <span className="font-mono font-bold bg-red-100 px-1.5 py-0.5 rounded">
                  {query}
                </span>{" "}
                tidak ditemukan dalam sistem kami.
              </p>
            </div>

            <div className="rounded-lg border border-red-200 bg-white p-4">
              <div className="mb-3 flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-red-600" aria-hidden="true" />
                <p className="text-sm font-medium text-red-900">
                  Kemungkinan penyebab:
                </p>
              </div>
              <ul className="space-y-2 text-sm text-red-700">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                  <span>Nomor pendaftaran salah ketik atau kurang lengkap</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                  <span>Pendaftaran belum disubmit atau masih dalam proses</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                  <span>Data belum tersinkronisasi (tunggu beberapa saat)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                  <span>Format nomor pendaftaran harus: SPMB-YYYY-XXXX</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                variant="default"
                onClick={handleRetry}
                disabled={isRetrying}
                className="bg-red-600 hover:bg-red-700"
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${isRetrying ? "animate-spin" : ""}`}
                  aria-hidden="true"
                />
                {isRetrying ? "Mencari ulang..." : "Coba Lagi"}
              </Button>
              <Button variant="outline" onClick={onReset}>
                <Search className="mr-2 h-4 w-4" aria-hidden="true" />
                Pencarian Baru
              </Button>
              <Button variant="outline" asChild>
                <Link href="/signup">
                  <ExternalLink className="mr-2 h-4 w-4" aria-hidden="true" />
                  Daftar Baru
                </Link>
              </Button>
            </div>

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
              <p className="font-medium mb-1">💡 Tips:</p>
              <p>
                Pastikan nomor pendaftaran menggunakan format{" "}
                <span className="font-mono font-bold">SPMB-YYYY-XXXX</span>. Jika
                Anda baru saja mendaftar, tunggu beberapa menit untuk sinkronisasi data.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

