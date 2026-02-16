export type FormFieldKey =
  | "namaLengkap"
  | "tempatLahir"
  | "tanggalLahir"
  | "jenisKelamin"
  | "alamatLengkap"
  | "noHP"
  | "email"
  | "namaAyah"
  | "pekerjaanAyah"
  | "namaIbu"
  | "pekerjaanIbu"
  | "noHPOrangtua"
  | "asalSekolah"
  | "alamatSekolah"
  | "prestasi"
  | "jalurPendaftaran"
  | "gelombangPendaftaran"
  | "uploadDokumen";

export type SectionKey =
  | "siswa"
  | "orangtua"
  | "sekolah"
  | "tambahan"
  | "upload";

export interface FieldConfig {
  enabled: boolean;
  required: boolean;
  label: string;
  section: SectionKey;
}

export type FormSchema = Record<FormFieldKey, FieldConfig>;

export const defaultFormSchema: FormSchema = {
  // siswa
  namaLengkap: {
    enabled: true,
    required: true,
    label: "Nama Lengkap",
    section: "siswa",
  },
  tempatLahir: {
    enabled: true,
    required: true,
    label: "Tempat Lahir",
    section: "siswa",
  },
  tanggalLahir: {
    enabled: true,
    required: true,
    label: "Tanggal Lahir",
    section: "siswa",
  },
  jenisKelamin: {
    enabled: true,
    required: true,
    label: "Jenis Kelamin",
    section: "siswa",
  },
  alamatLengkap: {
    enabled: true,
    required: true,
    label: "Alamat Lengkap",
    section: "siswa",
  },
  noHP: {
    enabled: true,
    required: false,
    label: "No. HP Siswa",
    section: "siswa",
  },
  email: { enabled: true, required: false, label: "Email", section: "siswa" },

  // orangtua
  namaAyah: {
    enabled: true,
    required: true,
    label: "Nama Ayah",
    section: "orangtua",
  },
  pekerjaanAyah: {
    enabled: true,
    required: true,
    label: "Pekerjaan Ayah",
    section: "orangtua",
  },
  namaIbu: {
    enabled: true,
    required: true,
    label: "Nama Ibu",
    section: "orangtua",
  },
  pekerjaanIbu: {
    enabled: true,
    required: true,
    label: "Pekerjaan Ibu",
    section: "orangtua",
  },
  noHPOrangtua: {
    enabled: true,
    required: true,
    label: "No. HP Orangtua",
    section: "orangtua",
  },

  // sekolah
  asalSekolah: {
    enabled: true,
    required: true,
    label: "Asal Sekolah",
    section: "sekolah",
  },
  alamatSekolah: {
    enabled: true,
    required: false,
    label: "Alamat Sekolah",
    section: "sekolah",
  },

  // tambahan
  prestasi: {
    enabled: true,
    required: false,
    label: "Prestasi",
    section: "tambahan",
  },
  jalurPendaftaran: {
    enabled: true,
    required: true,
    label: "Jalur Pendaftaran",
    section: "sekolah",
  },
  gelombangPendaftaran: {
    enabled: true,
    required: true,
    label: "Gelombang Pendaftaran",
    section: "sekolah",
  },

  // upload
  uploadDokumen: {
    enabled: true,
    required: false,
    label: "Upload Foto & Dokumen",
    section: "upload",
  },
};

export function loadFormSchema(): FormSchema {
  if (typeof window === "undefined") return defaultFormSchema;
  try {
    const raw = localStorage.getItem("formSchema");
    if (!raw) return defaultFormSchema;
    const parsed = JSON.parse(raw) as Partial<FormSchema>;
    // merge to ensure new keys exist
    return { ...defaultFormSchema, ...parsed };
  } catch {
    return defaultFormSchema;
  }
}

export function saveFormSchema(schema: FormSchema) {
  if (typeof window === "undefined") return;
  localStorage.setItem("formSchema", JSON.stringify(schema));
}

export function resetFormSchemaToDefault() {
  if (typeof window === "undefined") return;
  localStorage.setItem("formSchema", JSON.stringify(defaultFormSchema));
}

export const schemaSections: { key: SectionKey; title: string }[] = [
  { key: "siswa", title: "Data Siswa" },
  { key: "orangtua", title: "Data Orangtua" },
  { key: "sekolah", title: "Data Sekolah" },
  { key: "tambahan", title: "Data Tambahan" },
  { key: "upload", title: "Upload Dokumen" },
];
