"use client";

import { formatDate } from "@/lib/registrar/helpers";

export function PrintHeader() {
  return (
    <div className="print-header hidden border-b border-gray-400 text-center print:block">
      <h1 className="font-bold text-gray-900">SMP IT Masjid Syuhada</h1>
      <p className="text-gray-600">
        Bukti Pendaftaran SPMB - {formatDate(new Date())}
      </p>
    </div>
  );
}

