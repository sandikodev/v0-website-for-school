import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // SPMB Setting with current data
  await prisma.sPMBSetting.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      academicYear: "2025/2026",
      registrationOpen: true,
      heroTitle: "SPMB SMP IT MASJID SYUHADA",
      heroSubtitle: "TAHUN PELAJARAN 2025/2026",
      heroDescription:
        "Selamat datang di laman informasi Penerimaan Peserta Didik Baru (PPDB) SMP IT Masjid Syuhada. Kami melayani pendaftaran secara online maupun offline dan TIDAK MEMBERLAKUKAN SISTEM ZONASI WILAYAH.",

      gelombangData: JSON.stringify([
        {
          id: "inden",
          name: "Gelombang Inden",
          period: "September 2024",
          startDate: "2024-09-01",
          endDate: "2024-09-30",
          discount: "Potongan maksimal",
          price: "Rp 1.000.000",
          description: "Dana pengembangan hanya Rp 1.000.000. Gelombang khusus untuk pendaftaran dini dengan potongan maksimal.",
          color: "emerald",
          badge: "Gelombang Inden",
        },
        {
          id: "gelombang1",
          name: "Gelombang 1",
          period: "01 Okt 2024 - 31 Jan 2025",
          startDate: "2024-10-01",
          endDate: "2025-01-31",
          discount: "Potongan 50%",
          price: "Rp 2.500.000",
          description: "Dana pengembangan Rp 2.500.000 (dari Rp 5.000.000 dengan potongan 50%). Pendaftaran periode awal dengan diskon terbesar.",
          color: "blue",
          badge: "Gelombang 1",
        },
        {
          id: "gelombang2",
          name: "Gelombang 2",
          period: "01 Feb - 30 Apr 2025",
          startDate: "2025-02-01",
          endDate: "2025-04-30",
          discount: "Potongan 25%",
          price: "Rp 3.750.000",
          description: "Dana pengembangan Rp 3.750.000 (dari Rp 5.000.000 dengan potongan 25%). Periode pendaftaran menengah dengan diskon.",
          color: "orange",
          badge: "Gelombang 2",
        },
        {
          id: "gelombang3",
          name: "Gelombang 3",
          period: "01 Mei - Juli 2025",
          startDate: "2025-05-01",
          endDate: "2025-07-31",
          discount: "Tanpa potongan",
          price: "Rp 5.000.000",
          description: "Dana pengembangan Rp 5.000.000 (tanpa potongan). Periode pendaftaran akhir gelombang.",
          color: "red",
          badge: "Gelombang 3",
        },
      ]),

      jalurData: JSON.stringify([
        {
          id: "reguler",
          name: "Jalur Reguler",
          quota: 150,
          description:
            "Jalur pendaftaran umum untuk semua calon siswa yang memenuhi persyaratan dasar. Dana pengembangan sesuai gelombang pendaftaran yang dipilih.",
        },
        {
          id: "prestasi",
          name: "Jalur Prestasi",
          quota: 50,
          description:
            "Jalur khusus untuk calon siswa berprestasi (akademik, non-akademik, atau tahfidz). Dana pengembangan hanya Rp 1.000.000. Wajib melampirkan sertifikat pendukung.",
        },
      ]),

      biayaData: JSON.stringify({
        wajib: [
          { name: "Dana Pengembangan", amount: "Rp 5.000.000" },
          { name: "Pendaftaran (Formulir)", amount: "Rp 100.000" },
          { name: "SPP + Komite (per bulan)", amount: "Rp 580.000" },
        ],
        potongan: [
          {
            name: "Gelombang Inden",
            badge: "Rp 1.000.000",
            description: "Dana pengembangan khusus",
            color: "emerald",
          },
          {
            name: "Gelombang 1",
            badge: "Potongan 50%",
            description: "Dari dana pengembangan",
            color: "blue",
          },
          {
            name: "Gelombang 2",
            badge: "Potongan 25%",
            description: "Dari dana pengembangan",
            color: "orange",
          },
          {
            name: "Jalur Prestasi",
            badge: "Rp 1.000.000",
            description: "Dana pengembangan khusus",
            color: "yellow",
          },
        ],
        catatan: [
          "Dana pengembangan dapat diangsur selama 1 semester (2-3 kali angsuran)",
          "SPP sudah termasuk catering",
          "Biaya tambahan untuk ekstrakurikuler Robotika dan Futsal",
        ],
      }),

      syaratData: JSON.stringify([
        "Mengisi Formulir Pendaftaran online",
        "Fotokopi Ijazah dan Surat Keterangan Nilai ASPD yang dilegalisir (gelombang 3)",
        "Fotokopi Kartu Keluarga (C1) 1 lembar",
        "Fotokopi Piagam Prestasi (jika ada)",
        "Fotokopi Akta Kelahiran 1 lembar",
        "Mengikuti wawancara siswa dan orangtua",
      ]),

      wawancaraData: JSON.stringify({
        siswa: {
          diniyah:
            "Praktek Ibadah, Membaca Al-Quran, Hafalan Surat-surat pendek",
          kesiswaan: "Pembiasaan/keseharian anak dan identifikasi potensi",
        },
        orangtua: "Tentang pembayaran administrasi keuangan",
        catatan:
          "Bacaan Quran dan hafalan tidak menjadi patokan lolos/tidaknya, hanya untuk pemetaan siswa.",
      }),

      schoolAddress: "Jl. Masjid Syuhada, Yogyakarta",
      schoolPhone: "085878958029",
      schoolEmail: "info@smpit-syuhada.sch.id",
    },
  });

  console.log("✅ SPMB settings seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
