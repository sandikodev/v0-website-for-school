"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface DesktopNavigationProps {
  onReset: () => void;
}

export function DesktopNavigation({ onReset }: DesktopNavigationProps) {
  const router = useRouter();

  return (
    <div className="print-hide hidden gap-3 md:flex">
      <Button variant="outline" className="flex-1" onClick={onReset}>
        Cari Nomor Lain
      </Button>
      <Button
        variant="outline"
        className="flex-1"
        onClick={() => router.push("/")}
      >
        Beranda
      </Button>
      <Button
        variant="outline"
        className="flex-1"
        onClick={() => router.push("/admissions")}
      >
        Info SPMB
      </Button>
      <Button
        variant="outline"
        className="flex-1"
        onClick={() => window.print()}
      >
        Cetak
      </Button>
    </div>
  );
}

