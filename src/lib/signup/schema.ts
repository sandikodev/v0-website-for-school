import { z } from "zod";
import {
  defaultFormSchema as baseSchema,
  loadFormSchema,
  type FormFieldKey,
  type FormSchema,
} from "@/lib/form-schema";

const requiredString = (message: string) => z.string().trim().min(1, message);
const optionalString = () => z.string().trim();

const fieldDefinitions: Record<
  Exclude<FormFieldKey, "uploadDokumen">,
  {
    required: z.ZodTypeAny;
    optional: z.ZodTypeAny;
  }
> = {
  namaLengkap: {
    required: requiredString("Nama lengkap wajib diisi"),
    optional: optionalString(),
  },
  tempatLahir: {
    required: requiredString("Tempat lahir wajib diisi"),
    optional: optionalString(),
  },
  tanggalLahir: {
    required: requiredString("Tanggal lahir wajib diisi"),
    optional: optionalString(),
  },
  jenisKelamin: {
    required: requiredString("Jenis kelamin wajib diisi"),
    optional: optionalString(),
  },
  alamatLengkap: {
    required: requiredString("Alamat wajib diisi"),
    optional: optionalString(),
  },
  noHP: {
    required: z
      .string()
      .trim()
      .min(10, "Nomor HP tidak valid"),
    optional: z
      .string()
      .trim()
      .refine(
        (value) => value.length === 0 || value.length >= 10,
        "Nomor HP tidak valid",
      ),
  },
  email: {
    required: z.string().trim().email("Email tidak valid"),
    optional: z
      .string()
      .trim()
      .refine(
        (value) => value.length === 0 || z.string().email().safeParse(value).success,
        "Email tidak valid",
      ),
  },
  namaAyah: {
    required: requiredString("Nama ayah wajib diisi"),
    optional: optionalString(),
  },
  pekerjaanAyah: {
    required: requiredString("Pekerjaan ayah wajib diisi"),
    optional: optionalString(),
  },
  namaIbu: {
    required: requiredString("Nama ibu wajib diisi"),
    optional: optionalString(),
  },
  pekerjaanIbu: {
    required: requiredString("Pekerjaan ibu wajib diisi"),
    optional: optionalString(),
  },
  noHPOrangtua: {
    required: z
      .string()
      .trim()
      .min(10, "Nomor HP orangtua tidak valid"),
    optional: z
      .string()
      .trim()
      .refine(
        (value) => value.length >= 10 || value.length === 0,
        "Nomor HP orangtua tidak valid",
      ),
  },
  asalSekolah: {
    required: requiredString("Asal sekolah wajib diisi"),
    optional: optionalString(),
  },
  alamatSekolah: {
    required: requiredString("Alamat sekolah wajib diisi"),
    optional: optionalString(),
  },
  prestasi: {
    required: requiredString("Prestasi wajib diisi"),
    optional: optionalString(),
  },
  jalurPendaftaran: {
    required: requiredString("Jalur pendaftaran wajib diisi"),
    optional: optionalString(),
  },
  gelombangPendaftaran: {
    required: requiredString("Gelombang pendaftaran wajib diisi"),
    optional: optionalString(),
  },
};

export type SignupFormSchema = typeof baseSchema;

export function buildSignupSchema(formSchema: SignupFormSchema) {
  const shape: Record<string, z.ZodTypeAny> = {};

  (Object.keys(fieldDefinitions) as Exclude<FormFieldKey, "uploadDokumen">[]).forEach(
    (key) => {
      const config = formSchema[key] as FormSchema[typeof key];
      const definition = fieldDefinitions[key];
      const enabled = config?.enabled ?? true;
      const required = config?.required ?? false;
      const schema = required && enabled ? definition.required : definition.optional;
      shape[key] = schema.transform((value: string) => value ?? "");
    },
  );

  shape.prestasi = shape.prestasi ?? optionalString();

  return z.object({
    ...shape,
    persetujuan: z.boolean().refine((value) => value, {
      message: "Persetujuan wajib dicentang",
    }),
  });
}

export const signupSchema = buildSignupSchema(baseSchema);

export type SignupValues = z.infer<typeof signupSchema>;
export type SignupStep = 1 | 2 | 3 | 4;

export interface SignupUploadedFilePayload {
  filename: string;
  originalName: string;
  size: number;
  type: string;
  url: string;
}

export type SignupFormSchema = typeof baseSchema;

export const defaultFormSchema = baseSchema;

export function loadDynamicFormSchema(): SignupFormSchema {
  return loadFormSchema();
}

