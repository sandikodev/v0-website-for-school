"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { OptionItem } from "./OptionItem";
import type { EditorOption } from "./types";

interface QuestionOptionsEditorProps {
  options: EditorOption[];
  onAddOption: () => void;
  onRemoveOption: (optionId: string) => void;
  onOptionLabelChange: (optionId: string, label: string) => void;
}

export function QuestionOptionsEditor({
  options,
  onAddOption,
  onRemoveOption,
  onOptionLabelChange,
}: QuestionOptionsEditorProps) {
  return (
    <div className="space-y-3 rounded-lg border border-dashed border-primary/20 bg-primary-muted/60 p-2 md:p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold text-primary">Opsi jawaban</p>
        <Button
          size="sm"
          variant="outline"
          className="min-h-0 border-dashed h-8 text-primary hover:bg-primary-muted hover:text-primary hover:border-primary/40 shrink-0"
          onClick={onAddOption}
        >
          <Plus className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">Tambah opsi</span>
        </Button>
      </div>

      <div className="space-y-2">
        {options.map((option) => (
          <OptionItem
            key={option.tempId}
            label={option.label}
            onLabelChange={(label) =>
              onOptionLabelChange(option.tempId, label)
            }
            onRemove={() => onRemoveOption(option.tempId)}
          />
        ))}
      </div>
    </div>
  );
}

