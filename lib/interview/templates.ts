import { InterviewFormStatus, InterviewQuestionType } from "@prisma/client";

import type { InterviewFormInput } from "./types";

const createOptions = (labels: string[]) =>
  labels.map((label, position) => ({
    label,
    position,
  }));

export const seleksiDiniyahTemplate: InterviewFormInput = {
  title: "Seleksi Diniyah",
  description: "TA: 2026/2027",
  status: InterviewFormStatus.DRAFT,
  sections: [
    {
      title: "Identitas Formulir",
      description: "Masukkan nomor formulir sesuai dokumen pendaftaran.",
      questions: [
        {
          title: "No. Formulir",
          description:
            "Masukkan nomor formulir yang tertera pada dokumen pendaftaran calon siswa.",
          type: InterviewQuestionType.SHORT_TEXT,
          required: true,
        },
      ],
    },
    {
      title: "Kemampuan Al-Qur'an",
      description:
        "Nilai bacaan Al-Qur’an, metode belajar, serta capaian hafalan juz 30.",
      questions: [
        {
          title: "Bacaan Al-Qur'an (Fashahah, Makhraj, Tajwid)",
          description:
            "Evaluasi kemampuan membaca Al-Qur'an meliputi kelancaran bacaan (fashahah), pengucapan huruf yang benar (makhraj), dan penerapan hukum tajwid.",
          type: InterviewQuestionType.RADIO,
          required: true,
          options: createOptions([
            "Lancar Fasih",
            "Lancar Belum Fasih",
            "Terbata-bata",
          ]),
        },
        {
          title: "Metode sebelum Al-Qur'an",
          description:
            "Metode pembelajaran membaca yang digunakan sebelum belajar Al-Qur'an secara langsung.",
          type: InterviewQuestionType.RADIO,
          required: true,
          options: createOptions([
            "Iqra'",
            "Ummi",
            "Yanbu'a",
            "Qira'ati",
            "Tilawati",
            "Yang lain",
          ]),
        },
        {
          title: "Tingkatan IQRO' atau Jilid",
          description:
            "Tingkatan atau jilid yang telah diselesaikan dalam metode pembelajaran Iqra' atau metode jilid sebelum melanjutkan ke Al-Qur'an.",
          type: InterviewQuestionType.RADIO,
          required: true,
          options: createOptions(["Jilid 1,2,3", "Jilid 4,5,6", "Al-Qur'an"]),
        },
        {
          title: "Hafalan / Tahfidz Juz 30",
          description:
            "Kemampuan menghafal surat-surat dalam Juz 30 (Juz 'Amma). Pilih kategori sesuai jumlah surat yang telah dihafal.",
          type: InterviewQuestionType.RADIO,
          required: true,
          options: createOptions([
            "Hafal Semua",
            "Lebih dari 20 surat",
            "5–20 surat",
            "Kurang dari 5 surat",
          ]),
        },
        {
          title: "Hafalan Lain (Juz/Surat)",
          description:
            "Apabila hafalan minimal 3 Juz bisa dilanjutkan tes orientasi Jalur Prestasi Tahfidz",
          type: InterviewQuestionType.RADIO,
          required: true,
          options: createOptions([
            "2 Juz",
            "3 Juz",
            "4 Juz",
            "5 Juz",
            "Tidak Ada",
            "Yang lain",
          ]),
        },
        {
          title: "Bukti sertifikat Tahfidz",
          description:
            "Apakah calon siswa memiliki sertifikat yang membuktikan kemampuan tahfidz/hafalan Al-Qur'an?",
          type: InterviewQuestionType.RADIO,
          required: true,
          options: createOptions(["Ada", "Tidak"]),
        },
      ],
    },
    {
      title: "Jalur & Orientasi Tahfidz",
      description:
        "Penentuan jalur prestasi tahfidz dan hasil tes orientasi untuk siswa yang memiliki hafalan minimal 3 Juz.",
      questions: [
        {
          title: "Jalur Prestasi SPMB",
          description:
            "Siswa yang mempunyai hafalan 3 Juz atau lebih masuk dalam Jalur Prestasi Tahfidz",
          type: InterviewQuestionType.RADIO,
          required: true,
          options: createOptions(["Prestasi Tahfidz", "Reguler"]),
        },
        {
          title: "Tes Orientasi Tahfidz",
          description:
            "1. Kelancaran Hafalan\n2. Tajwid & Makhraj\n3. Fashahah",
          type: InterviewQuestionType.RADIO,
          required: true,
          options: createOptions([
            "Memenuhi Kriteria",
            "Tidak Memenuhi Kriteria",
            "Yang lain",
          ]),
        },
      ],
    },
    {
      title: "Aktivitas & Kebiasaan",
      description:
        "Evaluasi kebiasaan ibadah sholat wajib dan kemampuan bacaan-bacaan dalam sholat.",
      questions: [
        {
          title: "Sholat Wajib",
          description:
            "Pilih sholat wajib yang rutin dikerjakan oleh calon siswa. Dapat memilih lebih dari satu.",
          type: InterviewQuestionType.CHECKBOX,
          required: true,
          options: createOptions(["Subuh", "Dzuhur", "Asar", "Magrib", "Isya'"]),
        },
        {
          title: "Bacaan Sholat",
          description:
            "Pilih bacaan-bacaan dalam sholat yang sudah dikuasai oleh calon siswa. Dapat memilih lebih dari satu.",
          type: InterviewQuestionType.CHECKBOX,
          options: createOptions([
            "Iftitah",
            "Ruku'",
            "Iktidal",
            "Sujud",
            "Duduk diantara dua sujud",
            "Tasyahud",
          ]),
        },
      ],
    },
    {
      title: "Penilaian Akhir",
      description:
        "Rangkuman penilaian akhir kemampuan diniyah calon siswa dan informasi petugas yang melakukan wawancara.",
      questions: [
        {
          title: "Kriteria Peserta Didik",
          description:
            "Penilaian keseluruhan kemampuan diniyah calon siswa berdasarkan hasil wawancara dan tes yang telah dilakukan.",
          type: InterviewQuestionType.RADIO,
          required: true,
          options: createOptions(["Baik Sekali (A)", "Baik (B)", "Cukup"]),
        },
        {
          title: "Catatan Calon Siswa",
          description:
            "Catatan tambahan atau observasi khusus tentang calon siswa yang perlu dicatat untuk referensi lebih lanjut.",
          type: InterviewQuestionType.LONG_TEXT,
        },
        {
          title: "Petugas Diniyah",
          description:
            "Nama petugas diniyah yang melakukan wawancara dan penilaian terhadap calon siswa.",
          type: InterviewQuestionType.RADIO,
          required: true,
          options: createOptions([
            "Ustadz Arif",
            "Ustadz Umam",
            "Ustadzah Milla",
            "Ustadzah Zahra",
          ]),
        },
      ],
    },
  ],
};

export const seleksiKesiswaanTemplate: InterviewFormInput = {
  title: "Wawancara Kesiswaan 25",
  description:
    "Formulir penilaian kesiswaan (konsep diri, sosial, akademik, dan prestasi).",
  status: InterviewFormStatus.DRAFT,
  sections: [
    {
      title: "Identitas Formulir",
      description: "Masukkan nomor formulir sesuai dokumen pendaftaran.",
      questions: [
        {
          title: "No. Formulir",
          type: InterviewQuestionType.SHORT_TEXT,
          required: true,
        },
      ],
    },
    {
      title: "Konsep Diri dan Sosial Calon Siswa",
      description:
        "Penilaian tentang pemahaman diri sendiri, kebiasaan sehari-hari, hubungan dengan keluarga, dan interaksi sosial calon siswa.",
      questions: [
        {
          title: "Kebiasaan Bangun Pagi",
          description:
            "Kebiasaan waktu bangun pagi calon siswa, termasuk apakah rutin bangun sebelum atau tepat waktu Subuh.",
          type: InterviewQuestionType.RADIO,
          required: true,
          options: createOptions([
            "Bangun sebelum/tepat di waktu Subuh",
            "Bangun setelah waktu Subuh (jam 05.00 ke atas)",
          ]),
        },
        {
          title: "Kebiasaan Tidur Malam",
          description:
            "Kebiasaan waktu tidur malam calon siswa, termasuk apakah memiliki waktu tidur yang teratur dan cukup.",
          type: InterviewQuestionType.RADIO,
          required: true,
          options: createOptions([
            "Tidur di bawah jam 10 malam",
            "Tidur di atas jam 10 malam",
          ]),
        },
        {
          title: "Konsep Diri",
          description:
            "Menceritakan diri siswa—arahkan untuk menyampaikan kelebihan dan kekurangan.",
          type: InterviewQuestionType.RADIO,
          required: true,
          options: createOptions([
            "Mampu menceritakan dengan lancar",
            "Mampu menceritakan tapi kurang lancar",
            "Tidak mampu menceritakan",
          ]),
        },
        {
          title: "Tinggal dengan siapa? Bagaimana Hubungan dengan Orang Tua?",
          description:
            "Gali lebih dalam jika siswa tinggal dengan salah satu orang tua atau tidak tinggal bersama orang tua.",
          type: InterviewQuestionType.RADIO,
          required: true,
          options: createOptions([
            "Tinggal dengan orang tua (ayah dan ibu)",
            "Tinggal dengan ayah atau ibu",
            "Tinggal dengan kakek/nenek/saudara",
            "Ngekos",
          ]),
        },
        {
          title: "Bagaimana Hubungan Pertemanan?",
          description:
            "Ditanyakan kepada siswa, baik pengalaman di sekolah sebelumnya maupun di lingkungan tempat tinggal.",
          type: InterviewQuestionType.RADIO,
          required: true,
          options: createOptions([
            "Punya teman banyak dan teman akrab",
            "Punya teman akrab",
            "Tidak punya teman akrab",
          ]),
        },
        {
          title:
            "Teman yang baik menurutmu? Apakah kamu sudah menjadi teman yang baik?",
          description:
            "Evaluasi pemahaman calon siswa tentang konsep pertemanan yang baik dan kesadaran diri untuk menjadi teman yang baik.",
          type: InterviewQuestionType.RADIO,
          required: true,
          options: createOptions([
            "Memiliki konsep pertemanan yang bagus",
            "Kurang memiliki konsep pertemanan",
            "Belum memiliki konsep pertemanan",
          ]),
        },
        {
          title: "Permasalahan dengan Teman",
          description:
            "Baik di sekolah maupun di rumah. Gali respon siswa terhadap masalah dan cara penyelesaiannya.",
          type: InterviewQuestionType.RADIO,
          required: true,
          options: createOptions([
            "Tidak pernah punya masalah",
            "Punya 1–3 masalah",
            "Punya lebih dari 3 masalah",
          ]),
        },
        {
          title: "Catatan Khusus tentang Diri dan Sosial Calon Siswa",
          description:
            "Catatan tambahan atau observasi khusus tentang konsep diri dan kemampuan sosial calon siswa yang perlu dicatat untuk evaluasi lebih lanjut.",
          type: InterviewQuestionType.LONG_TEXT,
          required: true,
        },
      ],
    },
    {
      title: "Akademik dan Karir Calon Siswa",
      description:
        "Evaluasi kebiasaan belajar, penggunaan gadget, dan minat akademik serta karir calon siswa.",
      questions: [
        {
          title:
            "Jadwal Belajar di Rumah dan Cara Belajar (sendiri atau didampingi keluarga)",
          description:
            "Evaluasi apakah calon siswa memiliki rutinitas belajar di rumah dan bagaimana pola belajarnya, apakah mandiri atau didampingi.",
          type: InterviewQuestionType.RADIO,
          required: true,
          options: createOptions([
            "Memiliki jadwal belajar di rumah dan didampingi keluarga",
            "Memiliki jadwal belajar di rumah namun tidak didampingi (belajar mandiri)",
            "Tidak memiliki jadwal belajar di rumah",
          ]),
        },
        {
          title: "Interaksi & Aktivitas Gadget/HP",
          description:
            "Pola penggunaan gadget/HP oleh calon siswa, termasuk aturan yang diterapkan oleh keluarga.",
          type: InterviewQuestionType.RADIO,
          required: true,
          options: createOptions([
            "Dibebaskan oleh keluarga",
            "Memiliki jadwal khusus (Weekend)",
            "Tidak memiliki HP/pinjam bersama orang tua",
          ]),
        },
        {
          title: "Penggunaan Dominan Gadget/HP",
          description:
            "Kegiatan utama yang dilakukan calon siswa saat menggunakan gadget/HP.",
          type: InterviewQuestionType.RADIO,
          required: true,
          options: createOptions([
            "YouTube",
            "Game",
            "Media Sosial",
            "Pembelajaran",
          ]),
        },
      ],
    },
    {
      title: "Prestasi Akademik & Non Akademik",
      description:
        "Rangkuman prestasi, kegiatan ekstrakurikuler, minat, dan rekomendasi akhir untuk calon siswa.",
      questions: [
        {
          title:
            "Sebutkan Prestasi di bidang Akademik dan Non Akademik (ranking, lomba, dsb.)",
          description:
            "Catat semua prestasi yang pernah dicapai calon siswa, baik di bidang akademik (seperti peringkat kelas) maupun non-akademik (seperti lomba olahraga, seni, dll).",
          type: InterviewQuestionType.LONG_TEXT,
          required: true,
        },
        {
          title:
            "Apakah Mengikuti Latihan/Les Bidang Khusus? (olahraga, musik, pelajaran, dll.)",
          description:
            "Informasi tentang kegiatan ekstrakurikuler atau les tambahan yang diikuti calon siswa, termasuk bidang yang dipelajari.",
          type: InterviewQuestionType.LONG_TEXT,
          required: true,
        },
        {
          title: "Ceritakan, Apa Hobby dan Cita-citamu!",
          description:
            "Gali informasi tentang hobi yang disukai calon siswa dan cita-cita yang ingin dicapai di masa depan.",
          type: InterviewQuestionType.LONG_TEXT,
          required: true,
        },
        {
          title:
            "Catatan Khusus (Apakah calon siswa direkomendasikan lulus atau tidak lulus?)",
          description:
            "Catatan evaluasi akhir dan rekomendasi apakah calon siswa direkomendasikan untuk diterima atau tidak diterima berdasarkan hasil wawancara.",
          type: InterviewQuestionType.LONG_TEXT,
          required: true,
        },
        {
          title: "Nama Pewawancara",
          description:
            "Nama pewawancara yang melakukan wawancara kesiswaan terhadap calon siswa.",
          type: InterviewQuestionType.RADIO,
          required: true,
          options: createOptions([
            "Ustadz Tarmidzi Taher AS",
            "Ustadz M. Fauzan Hanif",
            "Ustadzah Nurul Jannah",
            "Ustadzah Putri Leganingtyas",
            "Ustadzah Fathul Laili",
            "Ustadzah Mustaghfiroh",
          ]),
        },
      ],
    },
  ],
};

export const observasiKarakterTemplate: InterviewFormInput = {
  title: "Observasi Karakter & Sikap",
  description: "Formulir observasi harian untuk menilai kedisiplinan, interaksi sosial, serta sikap spiritual siswa.",
  status: InterviewFormStatus.DRAFT,
  sections: [
    {
      title: "Identitas Observasi",
      description: "Lengkapi data dasar sebelum melakukan observasi.",
      questions: [
        {
          title: "Nama Siswa",
          type: InterviewQuestionType.SHORT_TEXT,
          required: true,
        },
        {
          title: "Kelas / Jenjang",
          type: InterviewQuestionType.SHORT_TEXT,
          required: true,
        },
        {
          title: "Tanggal & Waktu Observasi",
          type: InterviewQuestionType.SHORT_TEXT,
          required: true,
        },
        {
          title: "Observer / Guru Piket",
          type: InterviewQuestionType.SHORT_TEXT,
          required: true,
        },
      ],
    },
    {
      title: "Kedisiplinan & Tanggung Jawab",
      description: "Nilai kedisiplinan siswa dalam melaksanakan aturan sekolah.",
      questions: [
        {
          title: "Ketepatan Waktu Hadir",
          description: "Apakah siswa hadir tepat waktu sesuai jadwal?",
          type: InterviewQuestionType.RADIO,
          required: true,
          options: createOptions([
            "Sangat konsisten",
            "Konsisten",
            "Kadang terlambat",
            "Sering terlambat",
          ]),
        },
        {
          title: "Kesiapan Perlengkapan Belajar",
          description: "Kel completeness alat tulis, buku, dan perangkat sekolah lainnya.",
          type: InterviewQuestionType.RADIO,
          required: true,
          options: createOptions([
            "Selalu siap lengkap",
            "Cukup lengkap",
            "Sering lupa membawa",
          ]),
        },
        {
          title: "Tanggung Jawab Tugas",
          description: "Penyelesaian tugas harian dan kebersihan area belajar.",
          type: InterviewQuestionType.RADIO,
          required: true,
          options: createOptions([
            "Menyelesaikan sebelum batas waktu",
            "Menyelesaikan sesuai batas waktu",
            "Perlu pengingat",
            "Belum konsisten",
          ]),
        },
      ],
    },
    {
      title: "Kolaborasi & Komunikasi",
      description: "Pantau cara siswa berinteraksi dengan teman dan guru.",
      questions: [
        {
          title: "Kerja Sama dalam Kelompok",
          type: InterviewQuestionType.RADIO,
          required: true,
          options: createOptions([
            "Sangat proaktif",
            "Terlibat aktif",
            "Pasif",
            "Perlu diarahkan",
          ]),
        },
        {
          title: "Komunikasi & Penyampaian Pendapat",
          type: InterviewQuestionType.RADIO,
          options: createOptions([
            "Percaya diri & jelas",
            "Cukup percaya diri",
            "Masih malu-malu",
          ]),
        },
        {
          title: "Catatan Interaksi Sosial",
          type: InterviewQuestionType.LONG_TEXT,
          description: "Tuliskan contoh perilaku positif/negatif yang terlihat.",
        },
      ],
    },
    {
      title: "Spiritual & Akhlak",
      description: "Evaluasi kebiasaan ibadah dan sikap sopan santun.",
      questions: [
        {
          title: "Kebiasaan Ibadah",
          type: InterviewQuestionType.CHECKBOX,
          required: true,
          options: createOptions([
            "Salam & menjawab salam",
            "Doa sebelum/sesudah belajar",
            "Membaca Al-Qur'an / dzikir",
            "Mengikuti sholat berjamaah",
          ]),
        },
        {
          title: "Sikap terhadap Guru & Teman",
          type: InterviewQuestionType.RADIO,
          options: createOptions([
            "Sangat santun",
            "Santun",
            "Perlu ditegur",
          ]),
        },
      ],
    },
    {
      title: "Rekomendasi Tindak Lanjut",
      description: "Catatan akhir dan rencana pembinaan.",
      questions: [
        {
          title: "Ringkasan Observasi",
          type: InterviewQuestionType.LONG_TEXT,
          required: true,
        },
        {
          title: "Rencana Tindak Lanjut",
          description: "Misal: konseling, pembinaan wali kelas, komunikasi dengan orang tua.",
          type: InterviewQuestionType.LONG_TEXT,
        },
      ],
    },
  ],
};

export const homeVisitTemplate: InterviewFormInput = {
  title: "Kunjungan Rumah & Kolaborasi Orang Tua",
  description:
    "Template laporan home visit untuk menggali kondisi keluarga, lingkungan belajar, serta dukungan orang tua.",
  status: InterviewFormStatus.DRAFT,
  sections: [
    {
      title: "Data Keluarga",
      description: "Informasi dasar keluarga/wali siswa.",
      questions: [
        {
          title: "Nama Wali / Orang Tua",
          type: InterviewQuestionType.SHORT_TEXT,
          required: true,
        },
        {
          title: "Hubungan dengan Siswa",
          type: InterviewQuestionType.RADIO,
          required: true,
          options: createOptions([
            "Ayah",
            "Ibu",
            "Saudara",
            "Wali Pengganti",
          ]),
        },
        {
          title: "Nomor Kontak yang Dapat Dihubungi",
          type: InterviewQuestionType.SHORT_TEXT,
          required: true,
        },
        {
          title: "Anggota Keluarga yang Tinggal Serumah",
          type: InterviewQuestionType.LONG_TEXT,
          description: "Tuliskan nama & hubungan singkat.",
        },
      ],
    },
    {
      title: "Lingkungan & Kondisi Rumah",
      description: "Catatan observasi langsung saat kunjungan.",
      questions: [
        {
          title: "Kondisi Lingkungan Sekitar",
          type: InterviewQuestionType.RADIO,
          required: true,
          options: createOptions([
            "Bersih & rapi",
            "Cukup bersih",
            "Perlu pembinaan kebersihan",
          ]),
        },
        {
          title: "Area Belajar di Rumah",
          type: InterviewQuestionType.RADIO,
          options: createOptions([
            "Tersedia meja khusus belajar",
            "Menggunakan ruang bersama",
            "Belum memiliki area belajar",
          ]),
        },
        {
          title: "Catatan Observasi Fisik",
          type: InterviewQuestionType.LONG_TEXT,
        },
      ],
    },
    {
      title: "Fasilitas & Dukungan Belajar",
      questions: [
        {
          title: "Fasilitas Belajar yang Tersedia",
          type: InterviewQuestionType.CHECKBOX,
          options: createOptions([
            "Perangkat elektronik (laptop/PC)",
            "Koneksi internet",
            "Rak buku / perpustakaan mini",
            "Peralatan seni/olahraga",
          ]),
        },
        {
          title: "Pendampingan Tugas Harian",
          type: InterviewQuestionType.RADIO,
          options: createOptions([
            "Didampingi setiap hari",
            "Didampingi saat diperlukan",
            "Belajar mandiri",
            "Belum terpantau",
          ]),
        },
      ],
    },
    {
      title: "Kolaborasi & Komunikasi Orang Tua",
      questions: [
        {
          title: "Keterbukaan Orang Tua terhadap Informasi Sekolah",
          type: InterviewQuestionType.RADIO,
          required: true,
          options: createOptions([
            "Sangat kooperatif",
            "Kooperatif",
            "Perlu pendekatan khusus",
          ]),
        },
        {
          title: "Komitmen Mendukung Program Sekolah",
          type: InterviewQuestionType.RADIO,
          options: createOptions([
            "Sangat siap berkolaborasi",
            "Siap dengan panduan",
            "Perlu pendampingan intensif",
          ]),
        },
        {
          title: "Catatan Diskusi dengan Orang Tua",
          type: InterviewQuestionType.LONG_TEXT,
        },
      ],
    },
    {
      title: "Rekomendasi & Tindak Lanjut",
      questions: [
        {
          title: "Ringkasan Temuan",
          type: InterviewQuestionType.LONG_TEXT,
          required: true,
        },
        {
          title: "Rencana Tindak Lanjut",
          description: "Misal jadwal kunjungan berikutnya, konseling, atau rujukan program sekolah.",
          type: InterviewQuestionType.LONG_TEXT,
        },
      ],
    },
  ],
};


