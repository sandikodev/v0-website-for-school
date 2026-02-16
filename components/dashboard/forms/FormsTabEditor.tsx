"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  FileText,
  AlertCircle,
  Check,
  Loader2,
  Save,
  Plus,
  Trash2,
  Calendar,
  Award,
} from "lucide-react";

interface JalurData {
  id: string;
  name: string;
  quota?: number;
  description?: string;
}

interface GelombangData {
  id: string;
  name: string;
  period: string; // "01 Okt - 31 Jan 2025"
  startDate?: string; // Date format for date input
  endDate?: string; // Date format for date input
  discount: string; // "Potongan 50%"
  price: string; // "Rp 2.500.000"
  description: string;
  color?: string;
  badge?: string;
}

interface FormsData {
  academicYear: string;
  heroTitle: string;
  heroSubtitle: string;
  jalurData: JalurData[];
  gelombangData: GelombangData[];
}

export function FormsTabEditor() {
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [data, setData] = React.useState<FormsData>({
    academicYear: "",
    heroTitle: "",
    heroSubtitle: "",
    jalurData: [],
    gelombangData: [],
  });

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
      setData({
        academicYear: settings.academicYear || "",
        heroTitle: settings.heroTitle || "",
        heroSubtitle: settings.heroSubtitle || "",
        jalurData: settings.jalurData || [],
        gelombangData: settings.gelombangData || [],
      });
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

  const handleSave = async () => {
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
          jalurData: data.jalurData,
          gelombangData: data.gelombangData,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Gagal menyimpan data");
      }

      setSuccessMessage("Data berhasil disimpan");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Terjadi kesalahan saat menyimpan",
      );
    } finally {
      setSaving(false);
    }
  };

  const addJalur = () => {
    setData({
      ...data,
      jalurData: [
        ...data.jalurData,
        {
          id: `jalur-${Date.now()}`,
          name: "",
          quota: 0,
          description: "",
        },
      ],
    });
  };

  const removeJalur = (id: string) => {
    setData({
      ...data,
      jalurData: data.jalurData.filter((j) => j.id !== id),
    });
  };

  const updateJalur = (id: string, updates: Partial<JalurData>) => {
    setData({
      ...data,
      jalurData: data.jalurData.map((j) => (j.id === id ? { ...j, ...updates } : j)),
    });
  };

  const addGelombang = () => {
    setData({
      ...data,
      gelombangData: [
        ...data.gelombangData,
        {
          id: `gelombang-${Date.now()}`,
          name: "",
          period: "",
          startDate: "",
          endDate: "",
          discount: "",
          price: "",
          description: "",
          color: "blue",
        },
      ],
    });
  };

  const removeGelombang = (id: string) => {
    setData({
      ...data,
      gelombangData: data.gelombangData.filter((g) => g.id !== id),
    });
  };

  const updateGelombang = (id: string, updates: Partial<GelombangData>) => {
    setData({
      ...data,
      gelombangData: data.gelombangData.map((g) =>
        g.id === id ? { ...g, ...updates } : g,
      ),
    });
  };

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
              <Input
                id="academic-year"
                value={data.academicYear}
                onChange={(e) =>
                  setData({ ...data, academicYear: e.target.value })
                }
                placeholder="2025/2026"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-title">Judul Formulir</Label>
              <Input
                id="hero-title"
                value={data.heroTitle}
                onChange={(e) =>
                  setData({ ...data, heroTitle: e.target.value })
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
                  setData({ ...data, heroSubtitle: e.target.value })
                }
                placeholder="TAHUN PELAJARAN 2025/2026"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Jalur Pendaftaran */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Jalur Pendaftaran
              </CardTitle>
              <CardDescription>
                Kelola jalur pendaftaran dan kuota untuk setiap jalur
              </CardDescription>
            </div>
            <Button size="sm" onClick={addJalur}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Jalur
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.jalurData.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground text-sm">
              Belum ada jalur pendaftaran. Klik &quot;Tambah Jalur&quot; untuk menambahkan.
            </p>
          ) : (
            data.jalurData.map((jalur, index) => (
              <div key={jalur.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Jalur {index + 1}</h4>
                  {data.jalurData.length > 1 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeJalur(jalur.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`jalur-name-${jalur.id}`}>
                      Nama Jalur <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id={`jalur-name-${jalur.id}`}
                      value={jalur.name}
                      onChange={(e) =>
                        updateJalur(jalur.id, { name: e.target.value })
                      }
                      placeholder="Reguler / Prestasi"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`jalur-quota-${jalur.id}`}>
                      Kuota <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id={`jalur-quota-${jalur.id}`}
                      type="number"
                      min="0"
                      value={jalur.quota || ""}
                      onChange={(e) =>
                        updateJalur(jalur.id, {
                          quota: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="150"
                    />
                    <p className="text-xs text-muted-foreground">
                      Jumlah kuota siswa untuk jalur ini
                    </p>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor={`jalur-description-${jalur.id}`}>
                      Deskripsi
                    </Label>
                    <Textarea
                      id={`jalur-description-${jalur.id}`}
                      value={jalur.description || ""}
                      onChange={(e) =>
                        updateJalur(jalur.id, { description: e.target.value })
                      }
                      placeholder="Deskripsi jalur pendaftaran (opsional)"
                      rows={2}
                    />
                  </div>
                </div>
                {index < data.jalurData.length - 1 && <Separator />}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Gelombang Pendaftaran */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Gelombang Pendaftaran
              </CardTitle>
              <CardDescription>
                Kelola gelombang pendaftaran, periode, biaya, dan potongan
              </CardDescription>
            </div>
            <Button size="sm" onClick={addGelombang}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Gelombang
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.gelombangData.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground text-sm">
              Belum ada gelombang pendaftaran. Klik &quot;Tambah Gelombang&quot; untuk menambahkan.
            </p>
          ) : (
            data.gelombangData.map((gelombang, index) => (
              <div key={gelombang.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Gelombang {index + 1}</h4>
                  {data.gelombangData.length > 1 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeGelombang(gelombang.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`gelombang-name-${gelombang.id}`}>
                      Nama Gelombang <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id={`gelombang-name-${gelombang.id}`}
                      value={gelombang.name}
                      onChange={(e) =>
                        updateGelombang(gelombang.id, { name: e.target.value })
                      }
                      placeholder="Gelombang 1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`gelombang-period-${gelombang.id}`}>
                      Periode (Text) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id={`gelombang-period-${gelombang.id}`}
                      value={gelombang.period}
                      onChange={(e) =>
                        updateGelombang(gelombang.id, { period: e.target.value })
                      }
                      placeholder="01 Okt - 31 Jan 2025"
                    />
                    <p className="text-xs text-muted-foreground">
                      Tampilan periode yang akan ditampilkan ke publik
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`gelombang-start-${gelombang.id}`}>
                      Tanggal Mulai
                    </Label>
                    <Input
                      id={`gelombang-start-${gelombang.id}`}
                      type="date"
                      value={gelombang.startDate || ""}
                      onChange={(e) =>
                        updateGelombang(gelombang.id, {
                          startDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`gelombang-end-${gelombang.id}`}>
                      Tanggal Selesai
                    </Label>
                    <Input
                      id={`gelombang-end-${gelombang.id}`}
                      type="date"
                      value={gelombang.endDate || ""}
                      onChange={(e) =>
                        updateGelombang(gelombang.id, { endDate: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`gelombang-price-${gelombang.id}`}>
                      Biaya Administrasi <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id={`gelombang-price-${gelombang.id}`}
                      value={gelombang.price}
                      onChange={(e) =>
                        updateGelombang(gelombang.id, { price: e.target.value })
                      }
                      placeholder="Rp 2.500.000"
                    />
                    <p className="text-xs text-muted-foreground">
                      Biaya administrasi untuk gelombang ini
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`gelombang-discount-${gelombang.id}`}>
                      Potongan <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id={`gelombang-discount-${gelombang.id}`}
                      value={gelombang.discount}
                      onChange={(e) =>
                        updateGelombang(gelombang.id, { discount: e.target.value })
                      }
                      placeholder="Potongan 50%"
                    />
                    <p className="text-xs text-muted-foreground">
                      Informasi potongan yang diberikan
                    </p>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor={`gelombang-description-${gelombang.id}`}>
                      Deskripsi <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id={`gelombang-description-${gelombang.id}`}
                      value={gelombang.description}
                      onChange={(e) =>
                        updateGelombang(gelombang.id, {
                          description: e.target.value,
                        })
                      }
                      placeholder="Dana pengembangan Rp 2.500.000"
                      rows={2}
                    />
                  </div>
                </div>
                {index < data.gelombangData.length - 1 && <Separator />}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Simpan Semua Perubahan
            </>
          )}
        </Button>
      </div>
    </div>
  );
}


