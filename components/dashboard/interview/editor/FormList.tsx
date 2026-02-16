"use client";

import { InterviewFormStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import type { FormSummary } from "./types";

interface FormListProps {
  forms: FormSummary[];
  selectedFormId: string | null;
  onSelect: (form: FormSummary) => void;
  emptyMessage?: string;
}

export function FormList({
  forms,
  selectedFormId,
  onSelect,
  emptyMessage = 'Belum ada form interview. Klik "Form Baru" untuk memulai.',
}: FormListProps) {
  return (
    <div className="space-y-2 max-h-[540px] overflow-y-auto pr-2">
      {forms.length === 0 && (
        <div className="rounded-lg border border-dashed border-slate-300 p-4 text-center text-sm text-muted-foreground">
          {emptyMessage}
        </div>
      )}

      {forms.map((form) => (
        <button
          key={form.id}
          onClick={() => onSelect(form)}
          className={`flex w-full flex-col gap-1.5 md:gap-2 rounded-xl border p-3 md:p-4 text-left transition hover:border-primary/40 hover:bg-primary-muted ${
            selectedFormId === form.id
              ? "border-primary/60 bg-primary-muted"
              : "border-border bg-card"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs md:text-sm font-semibold text-foreground truncate">
              {form.title}
            </span>
            <Badge
              variant={
                form.status === InterviewFormStatus.PUBLISHED
                  ? "default"
                  : form.status === InterviewFormStatus.DRAFT
                    ? "secondary"
                    : "outline"
              }
              className="shrink-0 text-xs"
            >
              {form.status === InterviewFormStatus.PUBLISHED && "Published"}
              {form.status === InterviewFormStatus.DRAFT && "Draft"}
              {form.status === InterviewFormStatus.ARCHIVED && "Archived"}
            </Badge>
          </div>

          <p className="line-clamp-2 text-xs text-muted-foreground">
            {form.description ?? "Tidak ada deskripsi"}
          </p>

          {form.interviewType && (
            <p className="text-xs text-primary truncate">
              Tipe: {form.interviewType.name}
            </p>
          )}

          <div className="flex items-center gap-1.5 md:gap-2 text-xs text-muted-foreground">
            <span>{form.sections.length} bagian</span>
            <span className="hidden md:inline">•</span>
            <span>
              {form.sections.reduce(
                (total, section) => total + section.questions.length,
                0,
              )}{" "}
              pertanyaan
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}

