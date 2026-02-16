"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Paperclip, AlertCircle } from "lucide-react";
import {
  SignupFormSchema,
  SignupValues,
} from "@/lib/signup/schema";
import { SignupUploadedFile } from "@/hooks/useSignupForm";

interface StepConfirmProps {
  values: SignupValues;
  schema: SignupFormSchema;
  uploadedFiles: SignupUploadedFile[];
  onToggleAgreement(value: boolean): void;
}

export function StepConfirm({
  values,
  schema,
  uploadedFiles,
  onToggleAgreement,
}: StepConfirmProps) {
  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Periksa kembali seluruh data yang telah Anda masukkan sebelum mengirim
          formulir.
        </AlertDescription>
      </Alert>

      <div className="space-y-4 rounded-lg bg-gray-50 p-6">
        <h3 className="font-semibold text-gray-900">Ringkasan Data</h3>
        <div className="grid gap-4 text-sm md:grid-cols-2">
          <div>
            <p>
              <strong>Nama:</strong> {values.namaLengkap}
            </p>
            <p>
              <strong>TTL:</strong> {values.tempatLahir}, {values.tanggalLahir}
            </p>
            <p>
              <strong>Jenis Kelamin:</strong> {values.jenisKelamin}
            </p>
            <p>
              <strong>Asal Sekolah:</strong> {values.asalSekolah}
            </p>
          </div>
          <div>
            <p>
              <strong>Nama Ayah:</strong> {values.namaAyah}
            </p>
            <p>
              <strong>Nama Ibu:</strong> {values.namaIbu}
            </p>
            <p>
              <strong>No. HP Orangtua:</strong> {values.noHPOrangtua}
            </p>
            <p>
              <strong>Jalur:</strong> {values.jalurPendaftaran}
            </p>
          </div>
        </div>

        {schema.uploadDokumen.enabled && uploadedFiles.length > 0 && (
          <div>
            <p className="mb-2 font-medium text-gray-800">Dokumen Terunggah:</p>
            <ul className="space-y-1 text-sm text-gray-600">
              {uploadedFiles.map((file) => (
                <li key={file.filename} className="flex items-center gap-2">
                  <Paperclip className="h-4 w-4 text-emerald-500" />
                  <span>{file.originalName}</span>
                  <span className="text-xs text-gray-400">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="rounded-lg border-2 border-emerald-100 bg-emerald-50/50 p-4 transition-colors hover:bg-emerald-50">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="persetujuan"
            checked={values.persetujuan}
            onCheckedChange={(checked) => onToggleAgreement(Boolean(checked))}
            className="mt-0.5"
          />
          <Label
            htmlFor="persetujuan"
            className="cursor-pointer text-sm font-medium leading-relaxed text-gray-700"
          >
            Saya menyatakan bahwa data yang saya masukkan adalah benar dan dapat
            dipertanggungjawabkan. Saya bersedia mengikuti seluruh proses seleksi
            dan mematuhi peraturan yang berlaku di SMP IT Masjid Syuhada.
          </Label>
        </div>
      </div>
    </div>
  );
}

