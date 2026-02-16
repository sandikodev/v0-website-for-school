"use client";

import { Switch } from "@/components/ui/switch";

interface RequiredSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function RequiredSwitch({
  checked,
  onCheckedChange,
}: RequiredSwitchProps) {
  return (
    <div className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2">
      <div>
        <p className="text-xs font-medium text-slate-600">Wajib diisi</p>
        <p className="text-[11px] text-muted-foreground">
          Tanda bintang akan ditambahkan
        </p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

