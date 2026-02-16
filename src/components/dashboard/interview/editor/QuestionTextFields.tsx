"use client";

import { Textarea } from "@/components/ui/textarea";

interface QuestionTextFieldsProps {
  description?: string | null;
  helperText?: string | null;
  onDescriptionChange: (description: string) => void;
  onHelperTextChange: (helperText: string) => void;
}

export function QuestionTextFields({
  description,
  helperText,
  onDescriptionChange,
  onHelperTextChange,
}: QuestionTextFieldsProps) {
  return (
    <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
      <Textarea
        value={description ?? ""}
        onChange={(event) => onDescriptionChange(event.target.value)}
        placeholder="Deskripsi tambahan (opsional)"
        rows={2}
      />
      <Textarea
        value={helperText ?? ""}
        onChange={(event) => onHelperTextChange(event.target.value)}
        placeholder="Catatan untuk pewawancara (opsional)"
        rows={2}
      />
    </div>
  );
}

