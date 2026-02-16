"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileText, AlertCircle, Check, Loader2, Save } from "lucide-react";

/**
 * Generate academic year options (e.g., 2025/2026, 2026/2027, ...)
 * Default: current year to 5 years ahead
 */
function generateAcademicYearOptions(startYear?: number, yearsAhead: number = 5): string[] {
  const currentYear = startYear || new Date().getFullYear();
  const options: string[] = [];

  for (let i = 0; i <= yearsAhead; i++) {
    const year = currentYear + i;
    const nextYear = year + 1;
    options.push(`${year}/${nextYear}`);
  }

  return options;
}

interface FormsSettingsData {
  academicYear: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription?: string;
}

interface FormsSettingsTabProps {
  data: FormsSettingsData;
  onChange: (data: FormsSettingsData) => void;
  onSave: () => Promise<void>;
  saving: boolean;
  error: string | null;
  successMessage: string | null;
  loading: boolean;
  hasChanges?: boolean;
}

export function FormsSettingsTab({
  data,
  onChange,
  onSave,
  saving,
  error,
  successMessage,
  loading,
  hasChanges = false,
}: FormsSettingsTabProps) {
  const academicYearOptions = React.useMemo(() => generateAcademicYearOptions(), []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Success Alert */}
      {successMessage && (
        <Alert className="border-emerald-200 bg-emerald-50 text-emerald-700">
          <Check className="h-4 w-4" />
          <AlertTitle>Berhasil</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Informasi Umum
          </CardTitle>
          <CardDescription>
            Informasi dasar formulir pendaftaran
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="academic-year">Tahun Ajaran</Label>
              <Select
                value={data.academicYear}
                onValueChange={(value) =>
                  onChange({ ...data, academicYear: value })
                }
              >
                <SelectTrigger id="academic-year">
                  <SelectValue placeholder="Pilih tahun ajaran" />
                </SelectTrigger>
                <SelectContent>
                  {academicYearOptions.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Tahun ajaran ini akan digunakan untuk generate nomor registrasi (contoh: SPMB-2025-XXXX)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-title">Judul Formulir</Label>
              <Input
                id="hero-title"
                value={data.heroTitle}
                onChange={(e) =>
                  onChange({ ...data, heroTitle: e.target.value })
                }
                placeholder="Formulir Pendaftaran SMP Syuhada 2024/2025"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="hero-subtitle">Subtitle</Label>
              <Input
                id="hero-subtitle"
                value={data.heroSubtitle}
                onChange={(e) =>
                  onChange({ ...data, heroSubtitle: e.target.value })
                }
                placeholder="TAHUN PELAJARAN 2025/2026"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="hero-description">Deskripsi (Opsional)</Label>
              <Input
                id="hero-description"
                value={data.heroDescription || ""}
                onChange={(e) =>
                  onChange({ ...data, heroDescription: e.target.value })
                }
                placeholder="Deskripsi tambahan untuk formulir pendaftaran"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            {!hasChanges && (
              <p className="text-sm text-muted-foreground mr-4 self-center">
                Tidak ada perubahan
              </p>
            )}
            <Button onClick={onSave} disabled={saving || !hasChanges}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Simpan Pengaturan
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

