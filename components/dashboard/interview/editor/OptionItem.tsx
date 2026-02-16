"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

interface OptionItemProps {
  label: string;
  onLabelChange: (label: string) => void;
  onRemove: () => void;
}

export function OptionItem({
  label,
  onLabelChange,
  onRemove,
}: OptionItemProps) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-white px-2 py-1.5 md:px-3 md:py-2">
      <Input
        value={label}
        onChange={(event) => onLabelChange(event.target.value)}
        className="flex-1 min-w-0"
        placeholder="Label opsi"
      />
      <Button
        size="icon"
        variant="ghost"
        className="min-h-0 h-8 w-8 shrink-0 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700"
        onClick={onRemove}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

