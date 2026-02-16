"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Calendar, Plus, Trash2, AlertCircle, Check, Loader2, Save, HelpCircle } from "lucide-react";
import { toast } from "sonner";

export interface GelombangData {
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

interface GelombangTableProps {
  data: GelombangData[];
  onChange: (data: GelombangData[]) => void;
  onSave: () => Promise<void>;
  saving: boolean;
  error: string | null;
  successMessage: string | null;
  hasChanges?: boolean;
}

export function GelombangTable({
  data,
  onChange,
  onSave,
  saving,
  error,
  successMessage,
  hasChanges = false,
}: GelombangTableProps) {
  const [deleteConfirmId, setDeleteConfirmId] = React.useState<string | null>(null);

  const addGelombang = () => {
    onChange([
      ...data,
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
    ]);
    toast.info("Gelombang baru ditambahkan. Jangan lupa simpan perubahan.");
  };

  const removeGelombang = (id: string) => {
    const gelombang = data.find((g) => g.id === id);
    if (gelombang?.name) {
      setDeleteConfirmId(id);
    } else {
      // If empty, remove directly
      onChange(data.filter((g) => g.id !== id));
    }
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      onChange(data.filter((g) => g.id !== deleteConfirmId));
      toast.success("Gelombang dihapus. Jangan lupa simpan perubahan.");
      setDeleteConfirmId(null);
    }
  };

  const updateGelombang = (id: string, updates: Partial<GelombangData>) => {
    onChange(
      data.map((g) => (g.id === id ? { ...g, ...updates } : g))
    );
  };

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

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Gelombang Pendaftaran
              </CardTitle>
              <CardDescription>
                Kelola gelombang pendaftaran dengan periode, diskon, dan biaya
              </CardDescription>
            </div>
            <Button size="sm" onClick={addGelombang}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Gelombang
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {data.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <p className="mb-4">Belum ada gelombang pendaftaran</p>
              <Button variant="outline" onClick={addGelombang}>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Gelombang Pertama
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-slate-50/50">
                      <th className="text-left p-3 font-semibold">
                        <div className="flex items-center gap-1">
                          Nama
                          <span className="text-destructive">*</span>
                          <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" title="Nama gelombang pendaftaran" />
                        </div>
                      </th>
                      <th className="text-left p-3 font-semibold">
                        <div className="flex items-center gap-1">
                          Periode
                          <span className="text-destructive">*</span>
                          <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" title="Periode pendaftaran (contoh: 01 Okt - 31 Jan 2025)" />
                        </div>
                      </th>
                      <th className="text-left p-3 font-semibold">
                        <div className="flex items-center gap-1">
                          Diskon
                          <span className="text-destructive">*</span>
                          <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" title="Informasi diskon (contoh: Potongan 50%)" />
                        </div>
                      </th>
                      <th className="text-left p-3 font-semibold">
                        <div className="flex items-center gap-1">
                          Biaya
                          <span className="text-destructive">*</span>
                          <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" title="Biaya administrasi (contoh: Rp 2.500.000)" />
                        </div>
                      </th>
                      <th className="text-left p-3 font-semibold">
                        <div className="flex items-center gap-1">
                          Deskripsi
                          <span className="text-destructive">*</span>
                          <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" title="Deskripsi gelombang pendaftaran" />
                        </div>
                      </th>
                      <th className="text-right p-3 font-semibold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((gelombang) => (
                      <tr key={gelombang.id} className="border-b hover:bg-slate-50/50">
                        <td className="p-3">
                          <Input
                            value={gelombang.name}
                            onChange={(e) =>
                              updateGelombang(gelombang.id, { name: e.target.value })
                            }
                            placeholder="Nama gelombang"
                            className="min-w-[150px]"
                            required
                          />
                        </td>
                        <td className="p-3">
                          <Input
                            value={gelombang.period}
                            onChange={(e) =>
                              updateGelombang(gelombang.id, { period: e.target.value })
                            }
                            placeholder="01 Okt - 31 Jan 2025"
                            className="min-w-[200px]"
                            required
                          />
                        </td>
                        <td className="p-3">
                          <Input
                            value={gelombang.discount}
                            onChange={(e) =>
                              updateGelombang(gelombang.id, { discount: e.target.value })
                            }
                            placeholder="Potongan 50%"
                            className="min-w-[150px]"
                            required
                          />
                        </td>
                        <td className="p-3">
                          <Input
                            value={gelombang.price}
                            onChange={(e) =>
                              updateGelombang(gelombang.id, { price: e.target.value })
                            }
                            placeholder="Rp 2.500.000"
                            className="min-w-[150px]"
                            required
                          />
                        </td>
                        <td className="p-3">
                          <Input
                            value={gelombang.description}
                            onChange={(e) =>
                              updateGelombang(gelombang.id, { description: e.target.value })
                            }
                            placeholder="Deskripsi gelombang"
                            className="min-w-[250px]"
                            required
                          />
                        </td>
                        <td className="p-3">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeGelombang(gelombang.id)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              title="Hapus gelombang"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end items-center pt-4 mt-4 border-t gap-4">
                {!hasChanges && (
                  <p className="text-sm text-muted-foreground">
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
                      Simpan Perubahan
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmId !== null} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Gelombang Pendaftaran?</AlertDialogTitle>
            <AlertDialogDescription>
              Anda akan menghapus gelombang pendaftaran &quot;{data.find((g) => g.id === deleteConfirmId)?.name || ""}&quot;.
              Tindakan ini tidak dapat dibatalkan. Pastikan tidak ada pendaftar yang menggunakan gelombang ini.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

