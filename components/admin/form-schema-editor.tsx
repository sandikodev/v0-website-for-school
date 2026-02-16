"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import {
  defaultFormSchema,
  loadFormSchema,
  saveFormSchema,
  resetFormSchemaToDefault,
  type FormSchema,
  type FormFieldKey,
  schemaSections,
} from "@/lib/form-schema";

export default function FormSchemaEditor() {
  const [schema, setSchema] = useState<FormSchema>(defaultFormSchema);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSchema(loadFormSchema());
  }, []);

  const fieldsBySection = useMemo(() => {
    const grouped: Record<string, { key: FormFieldKey; label: string }[]> = {};
    (Object.keys(schema) as FormFieldKey[]).forEach((key) => {
      const section = schema[key].section;
      if (!grouped[section]) grouped[section] = [];
      grouped[section].push({ key, label: schema[key].label });
    });
    return grouped;
  }, [schema]);

  const toggleEnabled = (key: FormFieldKey, checked: boolean) => {
    setSchema((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        enabled: !!checked,
        ...(checked ? {} : { required: false }),
      },
    }));
  };

  const toggleRequired = (key: FormFieldKey, checked: boolean) => {
    setSchema((prev) => ({
      ...prev,
      [key]: { ...prev[key], required: !!checked },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    saveFormSchema(schema);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    }, 500);
  };

  const handleReset = () => {
    resetFormSchemaToDefault();
    setSchema(loadFormSchema());
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Kelola Formulir Online</CardTitle>
            <CardDescription>
              Atur field aktif dan sifat wajib/opsional untuk Formulir
              Pendaftaran
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/signup">👁️ Preview</Link>
            </Button>
            <Button onClick={handleReset} variant="outline" size="sm">
              ↩️ Reset Default
            </Button>
            <Button
              onClick={handleSave}
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {saving ? "Menyimpan..." : saved ? "Tersimpan" : "💾 Simpan"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {schemaSections.map((section) => (
          <div key={section.key} className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3">{section.title}</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {(fieldsBySection[section.key] || []).map(({ key, label }) => (
                <div
                  key={key}
                  className="flex items-start gap-3 p-3 border rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`${key}-enabled`}
                      checked={schema[key].enabled}
                      onCheckedChange={(c) => toggleEnabled(key, !!c)}
                    />
                    <Label htmlFor={`${key}-enabled`} className="font-medium">
                      {label}
                    </Label>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <Checkbox
                      id={`${key}-required`}
                      checked={schema[key].required}
                      disabled={!schema[key].enabled}
                      onCheckedChange={(c) => toggleRequired(key, !!c)}
                    />
                    <Label
                      htmlFor={`${key}-required`}
                      className={`text-sm ${!schema[key].enabled ? "text-gray-400" : ""}`}
                    >
                      Wajib
                    </Label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <p className="text-xs text-gray-500">
          Catatan: Perubahan hanya disimpan di perangkat (localStorage) untuk
          keperluan mockup frontend.
        </p>
      </CardContent>
    </Card>
  );
}
