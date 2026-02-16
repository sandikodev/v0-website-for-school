"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SignupFormSchema, SignupValues } from "@/lib/signup/schema";

interface StepPersonalProps {
  values: SignupValues;
  schema: SignupFormSchema;
  onChange<Field extends keyof SignupValues>(
    field: Field,
    value: SignupValues[Field],
  ): void;
}

export function StepPersonal({
  values,
  schema,
  onChange,
}: StepPersonalProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {schema.namaLengkap.enabled && (
          <div>
            <Label htmlFor="namaLengkap">
              Nama Lengkap {schema.namaLengkap.required ? "*" : ""}
            </Label>
            <Input
              id="namaLengkap"
              value={values.namaLengkap}
              onChange={(event) => onChange("namaLengkap", event.target.value)}
              placeholder="Masukkan nama lengkap"
              required={schema.namaLengkap.required}
            />
          </div>
        )}

        {schema.tempatLahir.enabled && (
          <div>
            <Label htmlFor="tempatLahir">
              Tempat Lahir {schema.tempatLahir.required ? "*" : ""}
            </Label>
            <Input
              id="tempatLahir"
              value={values.tempatLahir}
              onChange={(event) => onChange("tempatLahir", event.target.value)}
              placeholder="Masukkan tempat lahir"
              required={schema.tempatLahir.required}
            />
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {schema.tanggalLahir.enabled && (
          <div>
            <Label htmlFor="tanggalLahir">
              Tanggal Lahir {schema.tanggalLahir.required ? "*" : ""}
            </Label>
            <Input
              id="tanggalLahir"
              type="date"
              value={values.tanggalLahir}
              onChange={(event) => onChange("tanggalLahir", event.target.value)}
              required={schema.tanggalLahir.required}
            />
          </div>
        )}

        {schema.jenisKelamin.enabled && (
          <div>
            <Label>Jenis Kelamin {schema.jenisKelamin.required ? "*" : ""}</Label>
            <RadioGroup
              value={values.jenisKelamin}
              onValueChange={(value) => onChange("jenisKelamin", value)}
              className="mt-2 flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="laki-laki" id="laki-laki" />
                <Label htmlFor="laki-laki">Laki-laki</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="perempuan" id="perempuan" />
                <Label htmlFor="perempuan">Perempuan</Label>
              </div>
            </RadioGroup>
          </div>
        )}
      </div>

      {schema.alamatLengkap.enabled && (
        <div>
          <Label htmlFor="alamatLengkap">
            Alamat Lengkap {schema.alamatLengkap.required ? "*" : ""}
          </Label>
          <Textarea
            id="alamatLengkap"
            rows={3}
            value={values.alamatLengkap}
            onChange={(event) => onChange("alamatLengkap", event.target.value)}
            placeholder="Masukkan alamat lengkap"
            required={schema.alamatLengkap.required}
          />
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {schema.noHP.enabled && (
          <div>
            <Label htmlFor="noHP">
              No. HP Siswa {schema.noHP.required ? "*" : ""}
            </Label>
            <Input
              id="noHP"
              value={values.noHP}
              onChange={(event) => onChange("noHP", event.target.value)}
              placeholder="08xxxxxxxxxx"
              required={schema.noHP.required}
            />
          </div>
        )}

        {schema.email.enabled && (
          <div>
            <Label htmlFor="email">
              Email {schema.email.required ? "*" : ""}
            </Label>
            <Input
              id="email"
              type="email"
              value={values.email}
              onChange={(event) => onChange("email", event.target.value)}
              placeholder="email@example.com"
              required={schema.email.required}
            />
          </div>
        )}
      </div>
    </div>
  );
}

