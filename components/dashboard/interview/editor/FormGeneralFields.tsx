"use client";

import {
  InterviewFormStatus,
} from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { EditorForm, InterviewTypeSummary } from "./types";
import { slugify } from "@/lib/interview/utils";

interface FormGeneralFieldsProps {
  editor: EditorForm;
  types: InterviewTypeSummary[];
  onChange: (updater: (prev: EditorForm) => EditorForm) => void;
}

export function FormGeneralFields({
  editor,
  types,
  onChange,
}: FormGeneralFieldsProps) {
  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-3 md:p-4">
      <div className="grid gap-3 md:gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase text-slate-600">
            Judul Form
          </Label>
          <Input
            value={editor.title}
            onChange={(event) => {
              const nextTitle = event.target.value;
              onChange((prev) => {
                const normalizedPrevTitle = prev.title ?? "";
                const normalizedPrevSlug = prev.slug ?? "";
                const prevAutoSlug = slugify(normalizedPrevTitle);
                const shouldUpdateSlug =
                  normalizedPrevSlug.length === 0 ||
                  normalizedPrevSlug === prevAutoSlug;

                return {
                  ...prev,
                  title: nextTitle,
                  slug: shouldUpdateSlug ? slugify(nextTitle) : prev.slug,
                };
              });
            }}
            placeholder="Contoh: Interview Diniyah 2025"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase text-slate-600">
            Slug (URL)
          </Label>
          <Input
            value={editor.slug ?? ""}
            onChange={(event) =>
              onChange((prev) => ({
                ...prev,
                slug: event.target.value,
              }))
            }
            placeholder="interview-diniyah-2025"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase text-slate-600">
            Status
          </Label>
          <Select
            value={editor.status}
            onValueChange={(value) =>
              onChange((prev) => ({
                ...prev,
                status: value as InterviewFormStatus,
              }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={InterviewFormStatus.DRAFT}>Draft</SelectItem>
              <SelectItem value={InterviewFormStatus.PUBLISHED}>
                Published
              </SelectItem>
              <SelectItem value={InterviewFormStatus.ARCHIVED}>
                Archived
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase text-slate-600">
            Tipe Interview
          </Label>
          <Select
            value={editor.interviewTypeId ?? "none"}
            onValueChange={(value) =>
              onChange((prev) => ({
                ...prev,
                interviewTypeId: value === "none" ? undefined : value,
                setAsDefault: value === "none" ? false : prev.setAsDefault,
              }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Hubungkan ke tipe interview" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Tidak terhubung</SelectItem>
              {types.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 rounded-md border border-slate-200 bg-white px-3 py-2 lg:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase text-slate-600">
                Jadikan default untuk tipe
              </p>
              <p className="hidden md:block text-[11px] text-muted-foreground">
                Form ini akan otomatis digunakan saat pewawancara membuka sesi
                interview tipe terkait.
              </p>
            </div>
            <Switch
              disabled={!editor.interviewTypeId}
              checked={
                Boolean(editor.setAsDefault) && Boolean(editor.interviewTypeId)
              }
              onCheckedChange={(checked) =>
                onChange((prev) => ({
                  ...prev,
                  setAsDefault: checked,
                }))
              }
              className="shrink-0"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase text-slate-600">
          Deskripsi
        </Label>
        <Textarea
          value={editor.description ?? ""}
          onChange={(event) =>
            onChange((prev) => ({
              ...prev,
              description: event.target.value,
            }))
          }
          placeholder="Berikan ringkasan atau instruksi untuk petugas interview."
          rows={3}
        />
      </div>
    </div>
  );
}

