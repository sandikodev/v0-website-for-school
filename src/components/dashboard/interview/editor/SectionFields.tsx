"use client";

import { useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface SectionFieldsProps {
  title: string;
  description?: string | null;
  sectionIndex: number;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  autoFocus?: boolean;
}

export function SectionFields({
  title,
  description,
  sectionIndex,
  onTitleChange,
  onDescriptionChange,
  autoFocus = false,
}: SectionFieldsProps) {
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && titleInputRef.current) {
      // Delay to ensure the accordion is fully expanded and scrolled into view
      const timeoutId = setTimeout(() => {
        titleInputRef.current?.focus();
        titleInputRef.current?.select();
      }, 400);
      return () => clearTimeout(timeoutId);
    }
  }, [autoFocus]);

  return (
    <div className="flex flex-col gap-3">
      <div className="space-y-2">
        <Input
          ref={titleInputRef}
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder={`Judul Bagian ${sectionIndex + 1}`}
        />
        <Textarea
          value={description ?? ""}
          onChange={(event) => onDescriptionChange(event.target.value)}
          placeholder="Deskripsi atau instruksi untuk bagian ini"
          rows={2}
        />
      </div>
    </div>
  );
}

