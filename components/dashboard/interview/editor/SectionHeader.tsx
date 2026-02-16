"use client";

import { Button } from "@/components/ui/button";
import { Plus, Trash2, ListChecks } from "lucide-react";

interface SectionHeaderProps {
  showDeleteButton?: boolean;
  onAddSection: () => void;
  onRemoveSection?: () => void;
}

export function SectionHeader({
  showDeleteButton = false,
  onAddSection,
  onRemoveSection,
}: SectionHeaderProps) {
  return (
    <div className="sticky top-0 bg-slate-50 p-2 md:p-3 rounded-t-lg z-99 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 md:gap-3 min-w-0">
        <ListChecks className="h-5 w-5 text-slate-500 shrink-0" />
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-slate-800">Bagian Form</h3>
          <p className="hidden md:block text-xs text-muted-foreground">
            Kelompokkan pertanyaan berdasarkan tema (mis. identitas, hafalan,
            evaluasi akhir).
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {showDeleteButton && onRemoveSection && (
          <Button
            variant="outline"
            size="sm"
            className="min-w-0 sm:min-w-auto sm:w-auto w-8 min-h-0 h-8 border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 hover:border-rose-300"
            onClick={onRemoveSection}
          >
            <Trash2 className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Hapus Bagian Ini</span>
          </Button>
        )}
        <Button variant="outline" size="sm" className="min-w-0 sm:min-w-auto sm:w-auto w-8 min-h-0 h-8" onClick={onAddSection}>
          <Plus className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Tambah Bagian</span>
        </Button>
      </div>
    </div>
  );
}

