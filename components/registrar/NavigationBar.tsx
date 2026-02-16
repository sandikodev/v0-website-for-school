"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function NavigationBar() {
  const router = useRouter();

  return (
    <div className="no-print mb-6 hidden items-center gap-2 md:flex">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/")}
        className="text-gray-600 hover:text-gray-900"
      >
        ← Beranda
      </Button>
      <span className="text-gray-300">|</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/admissions")}
        className="text-gray-600 hover:text-gray-900"
      >
        Informasi SPMB
      </Button>
    </div>
  );
}

