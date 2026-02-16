"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignupFormSchema, SignupValues } from "@/lib/signup/schema";

interface StepParentProps {
  values: SignupValues;
  schema: SignupFormSchema;
  onChange<Field extends keyof SignupValues>(
    field: Field,
    value: SignupValues[Field],
  ): void;
}

export function StepParent({ values, schema, onChange }: StepParentProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {schema.namaAyah.enabled && (
          <div>
            <Label htmlFor="namaAyah">
              Nama Ayah {schema.namaAyah.required ? "*" : ""}
            </Label>
            <Input
              id="namaAyah"
              value={values.namaAyah}
              onChange={(event) => onChange("namaAyah", event.target.value)}
              placeholder="Masukkan nama ayah"
              required={schema.namaAyah.required}
            />
          </div>
        )}
        {schema.pekerjaanAyah.enabled && (
          <div>
            <Label htmlFor="pekerjaanAyah">
              Pekerjaan Ayah {schema.pekerjaanAyah.required ? "*" : ""}
            </Label>
            <Input
              id="pekerjaanAyah"
              value={values.pekerjaanAyah}
              onChange={(event) => onChange("pekerjaanAyah", event.target.value)}
              placeholder="Masukkan pekerjaan ayah"
              required={schema.pekerjaanAyah.required}
            />
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {schema.namaIbu.enabled && (
          <div>
            <Label htmlFor="namaIbu">
              Nama Ibu {schema.namaIbu.required ? "*" : ""}
            </Label>
            <Input
              id="namaIbu"
              value={values.namaIbu}
              onChange={(event) => onChange("namaIbu", event.target.value)}
              placeholder="Masukkan nama ibu"
              required={schema.namaIbu.required}
            />
          </div>
        )}
        {schema.pekerjaanIbu.enabled && (
          <div>
            <Label htmlFor="pekerjaanIbu">
              Pekerjaan Ibu {schema.pekerjaanIbu.required ? "*" : ""}
            </Label>
            <Input
              id="pekerjaanIbu"
              value={values.pekerjaanIbu}
              onChange={(event) => onChange("pekerjaanIbu", event.target.value)}
              placeholder="Masukkan pekerjaan ibu"
              required={schema.pekerjaanIbu.required}
            />
          </div>
        )}
      </div>

      {schema.noHPOrangtua.enabled && (
        <div>
          <Label htmlFor="noHPOrangtua">
            No. HP Orangtua {schema.noHPOrangtua.required ? "*" : ""}
          </Label>
          <Input
            id="noHPOrangtua"
            value={values.noHPOrangtua}
            onChange={(event) => onChange("noHPOrangtua", event.target.value)}
            placeholder="08xxxxxxxxxx"
            required={schema.noHPOrangtua.required}
          />
          <p className="mt-1 text-xs text-gray-500">
            Nomor ini akan digunakan untuk komunikasi terkait proses pendaftaran
          </p>
        </div>
      )}
    </div>
  );
}

