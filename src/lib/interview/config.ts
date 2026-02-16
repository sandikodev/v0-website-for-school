export type InterviewFieldType = "text" | "textarea" | "radio" | "checkbox";
export type InterviewValues = Record<string, string | string[] | null>;

export interface InterviewOption {
  value: string;
  label: string;
}

export interface InterviewFieldBase {
  id: keyof InterviewValues;
  label: string;
  type: InterviewFieldType;
  required?: boolean;
  description?: string;
  helperText?: string;
}

export interface InterviewChoiceField extends InterviewFieldBase {
  type: "radio" | "checkbox";
  options: InterviewOption[];
  allowOther?: boolean;
  otherLabel?: string;
  otherFieldId?: string;
}

export type InterviewField =
  | InterviewFieldBase
  | InterviewChoiceField;

export interface InterviewStep {
  id: string;
  title: string;
  description?: string;
  fields: InterviewField[];
}

export interface InterviewResultMapping {
  gradeField?: string;
  recommendationField?: string;
  notesField?: string;
  reviewerField?: string;
  formNumberField?: string;
}

export interface InterviewConfig {
  slug: string;
  name: string;
  description: string;
  steps: InterviewStep[];
  storageVersion: string;
  resultMapping?: InterviewResultMapping;
}

export const interviewConfigs: Record<string, InterviewConfig> = {
  diniyah: {
    slug: "diniyah",
    name: "Interview Diniyah",
    description:
      "Formulir penilaian kemampuan diniyah calon peserta didik. Lengkapi seluruh bagian untuk hasil evaluasi yang akurat.",
    storageVersion: "v1",
    resultMapping: {
      gradeField: "kriteriaPesertaDidik",
      recommendationField: "jalurPrestasiSpmb",
      notesField: "catatanCalonSiswa",
      reviewerField: "petugasDiniyah",
      formNumberField: "nomorFormulir",
    },
    steps: [
      {
        id: "identitas",
        title: "Identitas Formulir",
        description:
          "Verifikasi nomor formulir sebelum melanjutkan penilaian.",
        fields: [
          {
            id: "nomorFormulir",
            label: "No. Formulir",
            type: "text",
            required: true,
            helperText: "Masukkan nomor formulir sesuai bukti pendaftaran.",
          },
        ],
      },
      {
        id: "kemampuan-quran",
        title: "Kemampuan Al-Qur'an",
        description:
          "Nilai kelancaran bacaan Al-Qur'an serta metode belajar yang digunakan.",
        fields: [
          {
            id: "bacaanAlquran",
            label: "Bacaan Al-Qur’an (Fashahah, Makhraj, Tajwid)",
            type: "radio",
            required: true,
            options: [
              { value: "lancar-fasih", label: "Lancar Fasih" },
              { value: "lancar-belum-fasih", label: "Lancar Belum Fasih" },
              { value: "terbata-bata", label: "Terbata-bata" },
            ],
          },
          {
            id: "metodeSebelumAlquran",
            label: "Metode sebelum Al-Qur’an",
            type: "radio",
            required: true,
            allowOther: true,
            otherLabel: "Yang lain",
            otherFieldId: "metodeSebelumAlquranOther",
            options: [
              { value: "iqra", label: "Iqra'" },
              { value: "ummi", label: "Ummi" },
              { value: "yanbua", label: "Yanbu'a" },
              { value: "qiraati", label: "Qira'ati" },
              { value: "tilawati", label: "Tilawati" },
            ],
          },
          {
            id: "tingkatanIqro",
            label: "Tingkatan IQRO’ atau Jilid",
            type: "radio",
            required: true,
            options: [
              { value: "jilid-1-3", label: "Jilid 1,2,3" },
              { value: "jilid-4-6", label: "Jilid 4,5,6" },
              { value: "alquran", label: "Al-Qur'an" },
            ],
          },
          {
            id: "hafalanJuz30",
            label: "Hafalan / Tahfidz Juz 30",
            type: "radio",
            required: true,
            options: [
              { value: "hafal-semua", label: "Hafal Semua" },
              { value: "lebih-20-surat", label: "Lebih dari 20 surat" },
              { value: "5-20-surat", label: "5–20 surat" },
              { value: "kurang-5-surat", label: "Kurang dari 5 surat" },
            ],
          },
        ],
      },
      {
        id: "prestasi-tahfidz",
        title: "Prestasi Tahfidz",
        description:
          "Identifikasi potensi jalur prestasi berdasarkan hafalan dan bukti pendukung.",
        fields: [
          {
            id: "hafalanLain",
            label: "Hafalan Lain (Juz/Surat)",
            type: "radio",
            required: true,
            allowOther: true,
            otherLabel: "Yang lain",
            otherFieldId: "hafalanLainOther",
            helperText:
              "Apabila hafalan minimal 3 juz bisa dilanjutkan tes orientasi jalur prestasi tahfidz.",
            options: [
              { value: "2-juz", label: "2 Juz" },
              { value: "3-juz", label: "3 Juz" },
              { value: "4-juz", label: "4 Juz" },
              { value: "5-juz", label: "5 Juz" },
              { value: "tidak-ada", label: "Tidak Ada" },
            ],
          },
          {
            id: "buktiSertifikatTahfidz",
            label: "Bukti sertifikat Tahfidz",
            type: "radio",
            required: true,
            options: [
              { value: "ada", label: "Ada" },
              { value: "tidak", label: "Tidak" },
            ],
          },
          {
            id: "jalurPrestasiSpmb",
            label: "Jalur Prestasi SPMB",
            type: "radio",
            required: true,
            helperText:
              "Siswa yang mempunyai hafalan 3 juz atau lebih masuk dalam Jalur Prestasi Tahfidz.",
            options: [
              { value: "prestasi-tahfidz", label: "Prestasi Tahfidz" },
              { value: "reguler", label: "Reguler" },
            ],
          },
          {
            id: "tesOrientasiTahfidz",
            label: "Tes Orientasi Tahfidz",
            type: "radio",
            required: true,
            helperText:
              "Penilaian mencakup kelancaran hafalan, tajwid & makhraj, serta fashahah.",
            allowOther: true,
            otherLabel: "Yang lain",
            otherFieldId: "tesOrientasiTahfidzOther",
            options: [
              { value: "memenuhi-kriteria", label: "Memenuhi Kriteria" },
              { value: "tidak-memenuhi", label: "Tidak Memenuhi Kriteria" },
            ],
          },
        ],
      },
      {
        id: "ibadah",
        title: "Aktivitas Ibadah",
        description:
          "Catat kebiasaan ibadah harian untuk memahami kedisiplinan calon siswa.",
        fields: [
          {
            id: "prestasiKediniyahan",
            label: "Prestasi/Lomba Kediniyahan",
            type: "checkbox",
            allowOther: true,
            otherLabel: "Yang lain",
            otherFieldId: "prestasiKediniyahanOther",
            options: [
              { value: "mhq", label: "MHQ" },
              { value: "mtq", label: "MTQ" },
              { value: "adzan", label: "Adzan" },
              { value: "cca", label: "CCA" },
              { value: "mttq", label: "MTtQ" },
              { value: "kaligrafi", label: "Kaligrafi" },
              { value: "tidak-ada", label: "Tidak Ada" },
            ],
          },
          {
            id: "sholatWajib",
            label: "Sholat Wajib",
            type: "checkbox",
            required: true,
            options: [
              { value: "subuh", label: "Subuh" },
              { value: "dzuhur", label: "Dzuhur" },
              { value: "asar", label: "Asar" },
              { value: "magrib", label: "Magrib" },
              { value: "isya", label: "Isya'" },
            ],
          },
          {
            id: "bacaanSholat",
            label: "Bacaan Sholat",
            type: "checkbox",
            options: [
              { value: "iftitah", label: "Iftitah" },
              { value: "ruku", label: "Ruku'" },
              { value: "iktidal", label: "Iktidal" },
              { value: "sujud", label: "Sujud" },
              { value: "duduk-dua-sujud", label: "Duduk diantara dua sujud" },
              { value: "tasyahud", label: "Tasyahud" },
            ],
          },
        ],
      },
      {
        id: "kesimpulan",
        title: "Kesimpulan Interview",
        description:
          "Ringkas hasil interview dan tentukan rekomendasi akhir.",
        fields: [
          {
            id: "kriteriaPesertaDidik",
            label: "Kriteria Peserta Didik",
            type: "radio",
            required: true,
            options: [
              { value: "a", label: "Baik Sekali (A)" },
              { value: "b", label: "Baik (B)" },
              { value: "cukup", label: "Cukup" },
            ],
          },
          {
            id: "catatanCalonSiswa",
            label: "Catatan Calon Siswa",
            type: "textarea",
            description:
              "Tambahkan catatan penting yang perlu diketahui panitia.",
          },
          {
            id: "petugasDiniyah",
            label: "Petugas Diniyah",
            type: "radio",
            required: true,
            options: [
              { value: "ustadz-arif", label: "Ustadz Arif" },
              { value: "ustadz-umam", label: "Ustadz Umam" },
              { value: "ustadzah-milla", label: "Ustadzah Milla" },
              { value: "ustadzah-zahra", label: "Ustadzah Zahra" },
            ],
          },
        ],
      },
    ],
  },
};

export function getInterviewConfig(slug: string): InterviewConfig | null {
  return interviewConfigs[slug] ?? null;
}

import type {
  InterviewForm,
  InterviewSection,
  InterviewQuestion,
  InterviewOption,
  InterviewQuestionType,
} from "@prisma/client";

export type FormWithRelations = InterviewForm & {
  sections: Array<
    InterviewSection & {
      questions: Array<
        InterviewQuestion & {
          options: InterviewOption[];
        }
      >;
    }
  >;
};

function mapQuestionType(
  type: InterviewQuestionType,
): InterviewFieldType {
  switch (type) {
    case "SHORT_TEXT":
      return "text";
    case "LONG_TEXT":
      return "textarea";
    case "RADIO":
    case "SELECT":
      return "radio";
    case "CHECKBOX":
      return "checkbox";
    default:
      return "text";
  }
}

function buildScaleOptions(question: InterviewQuestion) {
  const settings = (question.settings as Record<string, unknown> | null) ?? {};
  const min = Number(settings.min ?? 1);
  const max = Number(settings.max ?? 5);
  const step = Number(settings.step ?? 1);

  if (Number.isNaN(min) || Number.isNaN(max) || min >= max) {
    return [];
  }

  const labels =
    typeof settings.labels === "object" && settings.labels
      ? (settings.labels as Record<string, string>)
      : {};

  const options: InterviewOptionInput[] = [];
  for (let value = min; value <= max; value += step) {
    const key = String(value);
    options.push({
      label: labels[key] ?? key,
      value: key,
    });
  }
  return options;
}

export function buildConfigFromForm(form: FormWithRelations): InterviewConfig {
  const steps: InterviewStep[] = form.sections
    .sort((a, b) => a.position - b.position)
    .map((section, sectionIndex) => {
      const fields: InterviewField[] = section.questions
        .sort((a, b) => a.position - b.position)
        .map((question) => {
          let fieldType = mapQuestionType(question.type);
          let options: InterviewOptionInput[] | undefined = question.options
            .sort((a, b) => a.position - b.position)
            .map((option) => ({
              value: option.value ?? option.label.toLowerCase().replace(/\s+/g, "-"),
              label: option.label,
            }));

          if (question.type === "SCALE") {
            const scaleOptions = buildScaleOptions(question);
            if (scaleOptions.length > 0) {
              fieldType = "radio";
              options = scaleOptions;
            } else {
              fieldType = "text";
              options = undefined;
            }
          }

          if (
            question.type === "RADIO" ||
            question.type === "CHECKBOX" ||
            question.type === "SELECT"
          ) {
            fieldType = question.type === "CHECKBOX" ? "checkbox" : "radio";
          }

          const baseField: InterviewFieldBase = {
            id: question.id,
            label: question.title,
            type: fieldType,
            required: question.required ?? false,
            description: question.description ?? undefined,
            helperText: question.helperText ?? undefined,
          };

          if (fieldType === "radio" || fieldType === "checkbox") {
            return {
              ...(baseField as InterviewChoiceField),
              type: fieldType,
              options: options ?? [],
            };
          }

          return baseField;
        });

      return {
        id: section.id ?? `section-${sectionIndex + 1}`,
        title: section.title,
        description: section.description ?? undefined,
        fields,
      };
    });

  return {
    slug: form.slug,
    name: form.title,
    description: form.description ?? "",
    steps,
    storageVersion: `form/${form.id}/v${form.version ?? 1}`,
  };
}


