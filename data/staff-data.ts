import type { StaffMember, PengurusYasma, WaliKelas, StafPengajar, StaffStats } from "@/types/staff"

export const staffStats: StaffStats = {
  totalGuru: 18,
  totalStaff: 5,
  kualifikasi: "Berkualifikasi S1"
}

export const pimpinanSekolah: StaffMember[] = [
  {
    nama: "Meilani Noor Khasanah, S. Pd.",
    jabatan: "Kepala Sekolah",
    mapel: "IPS",
  },
  {
    nama: "Yamidah, M. Pd.",
    jabatan: "Wakil Kepala Bidang Akademik/Kurikulum",
    mapel: "IPA Fisika",
  },
  {
    nama: "Dwi Purnomo, S. Pd. Si.",
    jabatan: "Wakil Kepala Bidang Administrasi Umum, Sarpras & Keuangan",
    mapel: "Matematika",
  },
  {
    nama: "Tarmidzi Taher A.S. S. Pt.",
    jabatan: "Wakil Kepala Bidang Kesiswaan dan Diniyah",
    mapel: "Tahfidz Putra",
  },
]

export const pengurusYasma: PengurusYasma[] = [
  {
    nama: "H.R.M. Tirun Marwito, S.H",
    jabatan: "Ketua Umum",
  },
  {
    nama: "Ir. H. Muhammad Hanief, M.T",
    jabatan: "Wakil Ketua Umum",
  },
  {
    nama: "Muhammad Suyanto, S.Ag, M.Si.",
    jabatan: "Sekretaris",
  },
  {
    nama: "Busro Sanjaya, S.EI.",
    jabatan: "Wakil Sekretaris",
  },
  {
    nama: "Drs. H. Sunardi Syahuri",
    jabatan: "Bendahara",
  },
  {
    nama: "Drs. H. Muhammad Bachroni, S.U",
    jabatan: "Wakil Bendahara",
  },
  {
    nama: "DR. Ir. Harry Sulistyo",
    jabatan: "Ketua Bidang Pendidikan",
  },
  {
    nama: "Drs. Sholihin",
    jabatan: "Anggota Bidang Pendidikan",
  },
  {
    nama: "Mu'minan",
    jabatan: "Anggota Bidang Pendidikan",
  },
  {
    nama: "Dra. Hj. Suwarni Angesti Rahayu",
    jabatan: "Anggota Bidang Pendidikan",
  },
]

export const waliKelas: WaliKelas[] = [
  { kelas: "VII A", nama: "DITA WULANSARI, S. Pd. Gr." },
  { kelas: "VII B", nama: "HASIFAH NUR F., S.Pd." },
  { kelas: "VII C", nama: "FATHUL LAILI K., S. Pd." },
  { kelas: "VII D", nama: "-" },
  { kelas: "VIII A", nama: "Dra. ZAMROH NOVIANDARI" },
  { kelas: "VIII B", nama: "DINI PRISTIANA, S.Pd. Gr." },
  { kelas: "VIII C", nama: "AULIYATUN NISA', S.Sos.I. M.A." },
  { kelas: "VIII D", nama: "NURUL HIDAYAH, S.Pd." },
  { kelas: "IX A", nama: "MUSTAGHFIROH, S. Pd." },
  { kelas: "IX B", nama: "MUHAMMAD FAUZAN HANIF, S. Pd." },
  { kelas: "IX C", nama: "AYUN KHILIYATUL MILLA, S.Pd.I" },
  { kelas: "IX D", nama: "YUNITA IKA SARI B., M.P." },
]

export const stafPengajar: StafPengajar[] = [
  { nama: "Meilani Noor Khasanah, S. Pd.", jabatan: "Kepala Sekolah", mapel: "IPS" },
  { nama: "Yamidah, M. Pd.", jabatan: "Wakil Kepala Bid. Akademik", mapel: "IPA Fisika" },
  {
    nama: "Dwi Purnomo, S. Pd. Si.",
    jabatan: "Wakil Kepala Bid. Administrasi, Sarana Prasarana, dan Keuangan",
    mapel: "Matematika",
  },
  { nama: "Arif Taba Nasuha, S. Ag.", jabatan: "Koordinator Bidang Diniyah", mapel: "Pendidikan Agama Islam" },
  { nama: "Dra. Zamroh Noviandari", jabatan: "Staf Urusan Humas", mapel: "IPA Biologi" },
  { nama: "Mustaghfiroh, S. Pd.", jabatan: "–", mapel: "Matematika" },
  { nama: "Ayun Khiliyatul Milla, S. Pd. I.", jabatan: "–", mapel: "Bahasa Arab/PAI" },
  { nama: "Yunita Ika Sari B., M. P.", jabatan: "–", mapel: "Prakarya/TIK" },
  { nama: "Dini Pristiana, S. Pd. Gr.", jabatan: "–", mapel: "Bahasa Inggris" },
  { nama: "Karlina, S. Pd.", jabatan: "–", mapel: "Bahasa Jawa" },
  { nama: "Nur Arif Fuadi, M. Si.", jabatan: "–", mapel: "Matematika" },
  { nama: "Hasifah Nur Fitriana, S. Pd.", jabatan: "–", mapel: "Bahasa Indonesia" },
  { nama: "Dita Wulansari, S. Pd. Gr.", jabatan: "–", mapel: "Bahasa Inggris" },
  { nama: "Tarmidzi Taher AS, S. Pt.", jabatan: "Wakil Kepala Bidang Kesiswaan dan Diniyah", mapel: "Tahfidz Putra" },
  { nama: "Okita Maya Asiah, S. Pd.", jabatan: "–", mapel: "Tahfidz Putri" },
  { nama: "Feplita Agustin Kusrianingtyas", jabatan: "–", mapel: "Tahfidz Putri" },
  { nama: "Muhammad Fauzan Hanif, S. Pd.", jabatan: "–", mapel: "Bimbingan dan Konseling Putra" },
  { nama: "Muhammad Tahir, S. Pd.", jabatan: "–", mapel: "SBK" },
  { nama: "Ada Kurnia, S. Pd.", jabatan: "–", mapel: "IPS" },
  { nama: "Auliyatun Nisa', S. Sos. MA.", jabatan: "–", mapel: "Bimbingan dan Konseling Putri" },
  { nama: "Pandhu Daudha Sulaiman", jabatan: "–", mapel: "Bahasa Arab" },
  { nama: "Fathul Laili Khoirun Nisa", jabatan: "–", mapel: "Pendidikan Kewarganegaraan" },
  { nama: "Muhammad Raihan A. P.", jabatan: "–", mapel: "Penjasorkes Putra" },
  { nama: "Muhammad Agung Nugraha", jabatan: "–", mapel: "Pendidikan Kewarganegaraan" },
  { nama: "Aufa Nada", jabatan: "–", mapel: "Penjasorkes Putri" },
  { nama: "Annisa Cahya R., M.Pd.", jabatan: "–", mapel: "Bahasa Indonesia" },
  { nama: "Joko Susanto", jabatan: "–", mapel: "IPA" },
]
