"use client";

import { Button } from "@/components/ui/button";
import { FileSearch, FileText, Home, Printer } from "lucide-react";
import { useRouter } from "next/navigation";

interface MobileNavigationProps {
  onReset: () => void;
}

export function MobileNavigation({ onReset }: MobileNavigationProps) {
  const router = useRouter();

  return (
    <div className="print-hide fixed bottom-0 left-0 right-0 z-50 grid grid-cols-4 gap-1 border-t border-gray-200 bg-white p-2 shadow-lg md:hidden">
      <Button
        variant="ghost"
        size="sm"
        className="flex h-auto flex-col items-center gap-1 px-1 py-2"
        onClick={onReset}
      >
        <FileSearch className="h-5 w-5" />
        <span className="text-xs">Cari Lagi</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="flex h-auto flex-col items-center gap-1 px-1 py-2"
        onClick={() => router.push("/")}
      >
        <Home className="h-5 w-5" />
        <span className="text-xs">Beranda</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="flex h-auto flex-col items-center gap-1 px-1 py-2"
        onClick={() => router.push("/admissions")}
      >
        <FileText className="h-5 w-5" />
        <span className="text-xs">SPMB</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="flex h-auto flex-col items-center gap-1 px-1 py-2"
        onClick={() => window.print()}
      >
        <Printer className="h-5 w-5" />
        <span className="text-xs">Cetak</span>
      </Button>
    </div>
  );
}

