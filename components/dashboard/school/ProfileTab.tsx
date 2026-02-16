"use client";

import { useMemo, useState, useTransition, type FormEvent } from "react";
import { School } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useSchoolConfig } from "@/hooks/useSchoolConfig";
import {
  updateSchoolConfig,
  type UpdateSchoolConfigInput,
} from "@/lib/school/updateSchoolConfig";

export default function ProfileTab() {
  const { config, setConfig } = useSchoolConfig();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<
    { message: string; variant: "success" | "error" } | null
  >(null);

  const initialValues = useMemo(
    () => ({
      schoolName: config.schoolName ?? "",
      academicYear: config.academicYear ?? "",
      address: config.address ?? "",
      contactEmail: config.contactEmail ?? "",
      logoUrl: config.logoUrl ?? "",
    }),
    [config],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload: UpdateSchoolConfigInput = {
      schoolName: (formData.get("schoolName") as string) ?? "",
      academicYear: (formData.get("academicYear") as string) ?? "",
      address: (formData.get("address") as string) || undefined,
      contactEmail: (formData.get("contactEmail") as string) || undefined,
      logoUrl: (formData.get("logoUrl") as string) || undefined,
    };

    startTransition(async () => {
      try {
        const updated = await updateSchoolConfig(payload);
        setConfig(updated);
        setFeedback({
          message: "Konfigurasi sekolah berhasil diperbarui.",
          variant: "success",
        });
      } catch (error) {
        setFeedback(
          error instanceof Error
            ? {
                message: error.message,
                variant: "error",
              }
            : {
                message:
                  "Terjadi kesalahan saat memperbarui konfigurasi. Coba lagi.",
                variant: "error",
              },
        );
      }
    });
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <School className="h-5 w-5" />
            Profil Sekolah
          </CardTitle>
          <CardDescription>
            Atur informasi utama yang digunakan di seluruh aplikasi.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="schoolName">Nama Sekolah</Label>
            <Input
              id="schoolName"
              name="schoolName"
              defaultValue={initialValues.schoolName}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="academicYear">Tahun Pelajaran</Label>
            <Input
              id="academicYear"
              name="academicYear"
              defaultValue={initialValues.academicYear}
              placeholder="2025/2026"
              required
            />
          </div>
          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="address">Alamat Lengkap</Label>
            <Textarea
              id="address"
              name="address"
              defaultValue={initialValues.address}
              rows={3}
              placeholder="Jl. Masjid Syuhada No.1, Yogyakarta"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="contactEmail">Email Kontak</Label>
            <Input
              id="contactEmail"
              name="contactEmail"
              type="email"
              defaultValue={initialValues.contactEmail}
              placeholder="info@smpitsyuhada.sch.id"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="logoUrl">URL Logo</Label>
            <Input
              id="logoUrl"
              name="logoUrl"
              type="url"
              defaultValue={initialValues.logoUrl}
              placeholder="/logo.png"
            />
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Perubahan akan diterapkan ke halaman publik dan dashboard.
            {feedback && (
              <span
                className={`ml-2 ${
                  feedback.variant === "success"
                    ? "text-primary"
                    : "text-destructive"
                }`}
              >
                {feedback.message}
              </span>
            )}
          </p>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Menyimpan..." : "Simpan Konfigurasi"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

