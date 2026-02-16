"use client";

import { useRef } from "react";
import { Upload, Paperclip, Trash2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  SignupFormSchema,
  SignupValues,
} from "@/lib/signup/schema";
import { SignupUploadedFile } from "@/hooks/useSignupForm";
import type { JalurData, GelombangData } from "@/lib/spmb/getSPMBSettings";

interface StepSchoolProps {
  values: SignupValues;
  schema: SignupFormSchema;
  uploadedFiles: SignupUploadedFile[];
  uploadState: {
    isUploading: boolean;
    error: string | null;
  };
  onChange<Field extends keyof SignupValues>(
    field: Field,
    value: SignupValues[Field],
  ): void;
  onUpload(files: FileList | null): Promise<void>;
  onRemoveFile(filename: string): void;
  jalurData?: JalurData[];
  gelombangData?: GelombangData[];
}

export function StepSchool({
  values,
  schema,
  uploadedFiles,
  uploadState,
  onChange,
  onUpload,
  onRemoveFile,
  jalurData = [],
  gelombangData = [],
}: StepSchoolProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChooseFile = () => {
    inputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {schema.asalSekolah.enabled && (
        <div>
          <Label htmlFor="asalSekolah">
            Asal Sekolah (SD/MI) {schema.asalSekolah.required ? "*" : ""}
          </Label>
          <Input
            id="asalSekolah"
            value={values.asalSekolah}
            onChange={(event) => onChange("asalSekolah", event.target.value)}
            placeholder="Nama sekolah asal"
            required={schema.asalSekolah.required}
          />
        </div>
      )}

      {schema.alamatSekolah.enabled && (
        <div>
          <Label htmlFor="alamatSekolah">
            Alamat Sekolah {schema.alamatSekolah.required ? "*" : ""}
          </Label>
          <Input
            id="alamatSekolah"
            value={values.alamatSekolah}
            onChange={(event) => onChange("alamatSekolah", event.target.value)}
            placeholder="Alamat sekolah asal"
            required={schema.alamatSekolah.required}
          />
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {schema.jalurPendaftaran.enabled && (
          <div>
            <Label htmlFor="jalurPendaftaran">
              Jalur Pendaftaran {schema.jalurPendaftaran.required ? "*" : ""}
            </Label>
            <Select
              value={values.jalurPendaftaran}
              onValueChange={(value) => onChange("jalurPendaftaran", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih jalur pendaftaran" />
              </SelectTrigger>
              <SelectContent>
                {jalurData.length > 0 ? (
                  jalurData.map((jalur) => (
                    <SelectItem key={jalur.id} value={jalur.id}>
                      {jalur.name}
                      {jalur.quota && ` (Kuota: ${jalur.quota})`}
                    </SelectItem>
                  ))
                ) : (
                  <>
                    <SelectItem value="reguler">Jalur Reguler</SelectItem>
                    <SelectItem value="prestasi">Jalur Prestasi</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
            {jalurData.find((j) => j.id === values.jalurPendaftaran)?.description && (
              <p className="mt-1 text-xs text-gray-500">
                {jalurData.find((j) => j.id === values.jalurPendaftaran)?.description}
              </p>
            )}
          </div>
        )}
        {schema.gelombangPendaftaran.enabled && (
          <div>
            <Label htmlFor="gelombangPendaftaran">
              Gelombang Pendaftaran{" "}
              {schema.gelombangPendaftaran.required ? "*" : ""}
            </Label>
            <Select
              value={values.gelombangPendaftaran}
              onValueChange={(value) =>
                onChange("gelombangPendaftaran", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih gelombang" />
              </SelectTrigger>
              <SelectContent>
                {gelombangData.length > 0 ? (
                  gelombangData.map((gelombang) => (
                    <SelectItem key={gelombang.id} value={gelombang.id}>
                      {gelombang.name} - {gelombang.discount} ({gelombang.price})
                    </SelectItem>
                  ))
                ) : (
                  <>
                    <SelectItem value="gelombang-1">
                      Gelombang 1 (Potongan 50%)
                    </SelectItem>
                    <SelectItem value="gelombang-2">
                      Gelombang 2 (Potongan 25%)
                    </SelectItem>
                    <SelectItem value="gelombang-3">
                      Gelombang 3 (Tanpa Potongan)
                    </SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
            {gelombangData.find(
              (g) => g.id === values.gelombangPendaftaran,
            )?.description && (
              <p className="mt-1 text-xs text-gray-500">
                {
                  gelombangData.find((g) => g.id === values.gelombangPendaftaran)
                    ?.description
                }
              </p>
            )}
          </div>
        )}
      </div>

      {schema.prestasi.enabled && (
        <div>
          <Label htmlFor="prestasi">
            Prestasi yang Pernah Diraih {schema.prestasi.required ? "*" : ""}
          </Label>
          <Textarea
            id="prestasi"
            value={values.prestasi}
            onChange={(event) => onChange("prestasi", event.target.value)}
            placeholder="Tuliskan prestasi akademik/non-akademik (opsional)"
            rows={4}
          />
          <p className="mt-1 text-xs text-gray-500">
            Khusus jalur prestasi wajib melampirkan sertifikat pendukung.
          </p>
        </div>
      )}

      {schema.uploadDokumen.enabled && (
        <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50/50 p-6">
          <div className="text-center">
            <Upload className="mx-auto mb-2 h-8 w-8 text-gray-400" />
            <p className="mb-2 text-sm font-medium text-gray-700">
              Upload Foto Siswa & Dokumen Pendukung
            </p>
            <p className="mb-4 text-xs text-gray-500">
              {schema.uploadDokumen.required ? "Wajib diunggah. " : ""}
              Format: JPG, PNG, WebP, PDF. Maksimal 5MB per file.
            </p>
            <input
              ref={inputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.pdf"
              multiple
              onChange={async (event) => {
                const { files } = event.target;
                await onUpload(files);
                if (inputRef.current) {
                  inputRef.current.value = "";
                }
              }}
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleChooseFile}
              disabled={uploadState.isUploading}
              className="inline-flex items-center gap-2"
            >
              {uploadState.isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Mengunggah...
                </>
              ) : (
                <>
                  <Paperclip className="h-4 w-4" />
                  Pilih File
                </>
              )}
            </Button>
          </div>

          {uploadState.error && (
            <p className="mt-3 text-center text-xs text-red-500">
              {uploadState.error}
            </p>
          )}

          {uploadedFiles.length > 0 && (
            <div className="mt-4 rounded-lg bg-white/70 p-4 shadow-inner">
              <p className="mb-2 text-sm font-semibold text-gray-700">
                Dokumen yang Sudah Diunggah
              </p>
              <ul className="space-y-3 text-sm">
                {uploadedFiles.map((file) => (
                  <li
                    key={file.filename}
                    className="flex items-center justify-between gap-3 rounded-md border border-gray-200 bg-white px-3 py-2"
                  >
                    <div className="flex flex-1 items-center gap-3">
                      <Paperclip className="h-4 w-4 text-emerald-500" />
                      <div className="min-w-0">
                        <p className="truncate font-medium text-gray-700">
                          {file.originalName}
                        </p>
                        <p className="text-xs text-gray-400">
                          {(file.size / 1024).toFixed(1)} KB • {file.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-emerald-600 hover:underline"
                      >
                        Lihat
                      </a>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemoveFile(file.filename)}
                        className="h-7 w-7 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

