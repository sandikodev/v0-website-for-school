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
import { Award, Plus, Trash2, AlertCircle, Check, Loader2, Save, HelpCircle } from "lucide-react";
import { toast } from "sonner";

export interface JalurData {
  id: string;
  name: string;
  quota?: number;
  description?: string;
}

interface JalurTableProps {
  data: JalurData[];
  onChange: (data: JalurData[]) => void;
  onSave: () => Promise<void>;
  saving: boolean;
  error: string | null;
  successMessage: string | null;
  hasChanges?: boolean;
}

export function JalurTable({
  data,
  onChange,
  onSave,
  saving,
  error,
  successMessage,
  hasChanges = false,
}: JalurTableProps) {
  const [deleteConfirmId, setDeleteConfirmId] = React.useState<string | null>(null);

  const addJalur = () => {
    onChange([
      ...data,
      {
        id: `jalur-${Date.now()}`,
        name: "",
        quota: 0,
        description: "",
      },
    ]);
    toast.info("Jalur baru ditambahkan. Jangan lupa simpan perubahan.");
  };

  const removeJalur = (id: string) => {
    const jalur = data.find((j) => j.id === id);
    if (jalur?.name) {
      setDeleteConfirmId(id);
    } else {
      // If empty, remove directly
      onChange(data.filter((j) => j.id !== id));
    }
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      onChange(data.filter((j) => j.id !== deleteConfirmId));
      toast.success("Jalur dihapus. Jangan lupa simpan perubahan.");
      setDeleteConfirmId(null);
    }
  };

  const updateJalur = (id: string, updates: Partial<JalurData>) => {
    onChange(
      data.map((j) => (j.id === id ? { ...j, ...updates } : j))
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
        <CardContent>
          {data.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <p className="mb-4">Belum ada jalur pendaftaran</p>
              <Button variant="outline" onClick={addJalur}>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Jalur Pertama
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
                          Nama Jalur
                          <span className="text-destructive">*</span>
                          <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" title="Nama jalur pendaftaran (contoh: Reguler, Prestasi)" />
                        </div>
                      </th>
                      <th className="text-left p-3 font-semibold">
                        <div className="flex items-center gap-1">
                          Kuota
                          <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" title="Jumlah kuota siswa untuk jalur ini" />
                        </div>
                      </th>
                      <th className="text-left p-3 font-semibold">
                        <div className="flex items-center gap-1">
                          Deskripsi
                          <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" title="Deskripsi tambahan untuk jalur (opsional)" />
                        </div>
                      </th>
                      <th className="text-right p-3 font-semibold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((jalur) => (
                      <tr key={jalur.id} className="border-b hover:bg-slate-50/50">
                        <td className="p-3">
                          <Input
                            value={jalur.name}
                            onChange={(e) =>
                              updateJalur(jalur.id, { name: e.target.value })
                            }
                            placeholder="Nama jalur (contoh: Reguler, Prestasi)"
                            className="min-w-[200px]"
                            required
                          />
                        </td>
                        <td className="p-3">
                          <Input
                            type="number"
                            value={jalur.quota ?? ""}
                            onChange={(e) =>
                              updateJalur(jalur.id, {
                                quota: e.target.value === "" ? undefined : parseInt(e.target.value) || 0,
                              })
                            }
                            placeholder="0"
                            className="w-24"
                            min="0"
                          />
                        </td>
                        <td className="p-3">
                          <Input
                            value={jalur.description || ""}
                            onChange={(e) =>
                              updateJalur(jalur.id, { description: e.target.value || undefined })
                            }
                            placeholder="Deskripsi jalur (opsional)"
                            className="min-w-[300px]"
                          />
                        </td>
                        <td className="p-3">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeJalur(jalur.id)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              title="Hapus jalur"
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
            <AlertDialogTitle>Hapus Jalur Pendaftaran?</AlertDialogTitle>
            <AlertDialogDescription>
              Anda akan menghapus jalur pendaftaran &quot;{data.find((j) => j.id === deleteConfirmId)?.name || ""}&quot;.
              Tindakan ini tidak dapat dibatalkan. Pastikan tidak ada pendaftar yang menggunakan jalur ini.
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

