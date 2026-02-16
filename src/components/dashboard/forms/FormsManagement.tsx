"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TabsContent } from "@/components/ui/tabs";
import { FlatTabNavigation } from "@/components/dashboard/FlatTabNavigation";
import { JalurTable, type JalurData } from "./JalurTable";
import { GelombangTable, type GelombangData } from "./GelombangTable";
import * as React from "react";
import { toast } from "sonner";

export default function FormsManagement() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const viewFromQuery = useMemo(() => {
    const viewParam = searchParams.get("formsView");
    if (viewParam === "gelombang") return "gelombang";
    return "jalur";
  }, [searchParams]);

  const [tabValue, setTabValue] = useState<"jalur" | "gelombang">(viewFromQuery);

  const [_loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [data, setData] = useState<{
    academicYear: string;
    heroTitle: string;
    heroSubtitle: string;
    heroDescription?: string;
    jalurData: JalurData[];
    gelombangData: GelombangData[];
  }>({
    academicYear: "",
    heroTitle: "",
    heroSubtitle: "",
    heroDescription: "",
    jalurData: [],
    gelombangData: [],
  });

  // Track initial data to detect changes
  const initialDataRef = useRef<typeof data | null>(null);

  useEffect(() => {
    setTabValue(viewFromQuery);
  }, [viewFromQuery]);

  // Load data on mount
  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/spmb/settings");
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Gagal memuat data");
      }

      const settings = result.data;
      const fetchedData = {
        academicYear: settings.academicYear || "",
        heroTitle: settings.heroTitle || "",
        heroSubtitle: settings.heroSubtitle || "",
        heroDescription: settings.heroDescription || "",
        jalurData: settings.jalurData || [],
        gelombangData: settings.gelombangData || [],
      };
      setData(fetchedData);
      initialDataRef.current = JSON.parse(JSON.stringify(fetchedData)); // Deep clone
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Terjadi kesalahan saat memuat data",
      );
    } finally {
      setLoading(false);
    }
  };

  // Check if data has changed
  const hasChanges = useMemo(() => {
    if (!initialDataRef.current) return false;
    return JSON.stringify(data) !== JSON.stringify(initialDataRef.current);
  }, [data]);

  // Validate data before save
  const validateData = (): string | null => {
    // Validate academic year
    if (!data.academicYear.trim()) {
      return "Tahun Ajaran harus diisi";
    }

    // Validate hero title
    if (!data.heroTitle.trim()) {
      return "Judul Formulir harus diisi";
    }

    // Validate jalur data
    for (const jalur of data.jalurData) {
      if (!jalur.name.trim()) {
        return "Nama Jalur tidak boleh kosong";
      }
      if (jalur.quota !== undefined && jalur.quota < 0) {
        return "Kuota Jalur tidak boleh negatif";
      }
    }

    // Validate gelombang data
    for (const gelombang of data.gelombangData) {
      if (!gelombang.name.trim()) {
        return "Nama Gelombang tidak boleh kosong";
      }
      if (!gelombang.period.trim()) {
        return "Periode Gelombang tidak boleh kosong";
      }
      if (!gelombang.discount.trim()) {
        return "Diskon Gelombang tidak boleh kosong";
      }
      if (!gelombang.price.trim()) {
        return "Biaya Gelombang tidak boleh kosong";
      }
      if (!gelombang.description.trim()) {
        return "Deskripsi Gelombang tidak boleh kosong";
      }
    }

    return null;
  };

  const handleSave = async () => {
    // Validate data first
    const validationError = validateData();
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/spmb/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          academicYear: data.academicYear,
          heroTitle: data.heroTitle,
          heroSubtitle: data.heroSubtitle,
          heroDescription: data.heroDescription,
          jalurData: data.jalurData,
          gelombangData: data.gelombangData,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Gagal menyimpan data");
      }

      // Update initial data reference
      initialDataRef.current = JSON.parse(JSON.stringify(data)); // Deep clone

      toast.success("Data berhasil disimpan!");
      setSuccessMessage("Data berhasil disimpan");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (saveError) {
      const errorMessage =
        saveError instanceof Error
          ? saveError.message
          : "Terjadi kesalahan saat menyimpan";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleTabChange = (value: string) => {
    let nextValue: "jalur" | "gelombang" = "jalur";
    if (value === "gelombang") nextValue = "gelombang";

    setTabValue(nextValue);
    const params = new URLSearchParams(searchParams.toString());
    params.set("formsView", nextValue);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const tabs = [
    { key: "jalur", label: "Jalur Pendaftaran" },
    { key: "gelombang", label: "Gelombang Pendaftaran" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Formulir Pendaftaran
        </h1>
        <p className="text-sm text-muted-foreground">
          Kelola jalur pendaftaran dan gelombang pendaftaran.
        </p>
      </div>

      <FlatTabNavigation
        tabs={tabs}
        current={tabValue}
        onTabChange={handleTabChange}
        ariaLabel="Forms sections"
      >
        <TabsContent value="jalur">
          <JalurTable
            data={data.jalurData}
            onChange={(jalurData) => setData({ ...data, jalurData })}
            onSave={handleSave}
            saving={saving}
            error={error}
            successMessage={successMessage}
            hasChanges={hasChanges}
          />
        </TabsContent>

        <TabsContent value="gelombang">
          <GelombangTable
            data={data.gelombangData}
            onChange={(gelombangData) => setData({ ...data, gelombangData })}
            onSave={handleSave}
            saving={saving}
            error={error}
            successMessage={successMessage}
            hasChanges={hasChanges}
          />
        </TabsContent>
      </FlatTabNavigation>
    </div>
  );
}

