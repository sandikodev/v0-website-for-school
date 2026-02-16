import type { InterviewFormInput } from "@/lib/interview/types";
import {
  homeVisitTemplate,
  observasiKarakterTemplate,
  seleksiDiniyahTemplate,
  seleksiKesiswaanTemplate,
} from "@/lib/interview/templates";

export type TemplateMarketplaceMeta = {
  summary: string;
  category: string;
  level: string;
  persona: string;
  price: string;
  status: "ready" | "coming-soon";
  highlights: string[];
};

export type TemplateRegistryItem = {
  id: string;
  label: string;
  form: InterviewFormInput;
  aliases?: string[];
  marketplace?: TemplateMarketplaceMeta;
};

export const TEMPLATE_REGISTRY: TemplateRegistryItem[] = [
  {
    id: "seleksi-diniyah",
    label: "Seleksi Diniyah",
    form: seleksiDiniyahTemplate,
    marketplace: {
      summary:
        "Checklist kelulusan diniyah dengan rubrik tahfidz, kebiasaan ibadah, serta catatan petugas.",
      category: "Interview Template",
      level: "Madrasah / Boarding",
      persona: "Tim Diniyah & Tahfidz",
      price: "Rp 350.000",
      status: "ready",
      highlights: [
        "Rubrik tahfidz lengkap dari IQRA' hingga Juz 30",
        "Catatan petugas & orientasi jalur prestasi",
        "Checklist ibadah harian dan bukti sertifikat",
      ],
    },
  },
  {
    id: "seleksi-kesiswaan",
    aliases: ["wawancara-kesiswaan"],
    label: "Wawancara Kesiswaan",
    form: seleksiKesiswaanTemplate,
    marketplace: {
      summary:
        "Kuesioner mendalam untuk aspek konsep diri, sosial, akademik, dan rekomendasi akhir peserta.",
      category: "Interview Template",
      level: "SMP / SMA",
      persona: "Tim Kesiswaan & BK",
      price: "Rp 390.000",
      status: "ready",
      highlights: [
        "Pertanyaan sosial-emosional terstruktur",
        "Monitoring kebiasaan belajar & gadget",
        "Rangkuman prestasi dan rekomendasi akhir",
      ],
    },
  },
  {
    id: "observasi-karakter",
    aliases: ["observasi-sikap"],
    label: "Observasi Karakter & Sikap",
    form: observasiKarakterTemplate,
    marketplace: {
      summary:
        "Form observasi harian untuk memantau kedisiplinan, interaksi sosial, serta sikap spiritual siswa.",
      category: "Interview Template",
      level: "SMP / SMA",
      persona: "Tim BK & Guru Piket",
      price: "Rp 320.000",
      status: "ready",
      highlights: [
        "Rubrik kedisiplinan dan tanggung jawab",
        "Catatan perilaku sosial terstruktur",
        "Rencana tindak lanjut pembinaan",
      ],
    },
  },
  {
    id: "kunjungan-rumah",
    aliases: ["home-visit"],
    label: "Kunjungan Rumah",
    form: homeVisitTemplate,
    marketplace: {
      summary:
        "Template home visit untuk menggali kondisi keluarga, lingkungan belajar, serta dukungan orang tua.",
      category: "Interview Template",
      level: "Semua Jenjang",
      persona: "Tim Humas & Wali Kelas",
      price: "Rp 360.000",
      status: "ready",
      highlights: [
        "Checklist lingkungan dan fasilitas belajar",
        "Kolaborasi komunikasi orang tua",
        "Bagian khusus rencana tindak lanjut",
      ],
    },
  },
];

