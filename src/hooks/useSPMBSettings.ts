"use client";

import { useState, useEffect } from "react";

interface JalurData {
  id: string;
  name: string;
  quota?: number;
  description?: string;
}

interface GelombangData {
  id: string;
  name: string;
  period: string;
  startDate?: string;
  endDate?: string;
  discount: string;
  price: string;
  description: string;
  color?: string;
  badge?: string;
}

interface SPMBSettings {
  academicYear: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription?: string | null;
  jalurData: JalurData[];
  gelombangData: GelombangData[];
}

export function useSPMBSettings() {
  const [settings, setSettings] = useState<SPMBSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/spmb/settings");
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Gagal memuat pengaturan");
        }

        setSettings({
          academicYear: result.data.academicYear || "",
          heroTitle: result.data.heroTitle || "",
          heroSubtitle: result.data.heroSubtitle || "",
          heroDescription: result.data.heroDescription || null,
          jalurData: result.data.jalurData || [],
          gelombangData: result.data.gelombangData || [],
        });
        setError(null);
      } catch (fetchError) {
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Terjadi kesalahan saat memuat pengaturan",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading, error };
}

export type { JalurData, GelombangData, SPMBSettings };


