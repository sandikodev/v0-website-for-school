# Marketplace Ideas Brief

## Context
- Frontend platform untuk sekolah sudah memiliki editor form dan template interview (Seleksi Diniyah, Wawancara Kesiswaan).
- Backend CMS menggunakan WordPress headless; frontend Next.js mengonsumsi data melalui API.
- Tim ingin menambah _marketplace_ yang dapat diakses dari dashboard agar sekolah bisa memilih template siap pakai tanpa coding.

## 1. Template Marketplace (Form & Interview)

### Tujuan
Menyediakan katalog template terkurasi maupun komunitas sehingga admin sekolah bisa:
- Membuat form/flow baru (PPDB, re-registrasi, survei) dengan satu klik.
- Mengimpor struktur interview sesuai kebutuhan (diniyah, kesiswaan, evaluasi karakter, dsb.).

### Konten Template
- **Interview**: Diniyah, Kesiswaan, Observasi BK, Evaluasi Tahfidz, Panel Seleksi Guru.
- **Form Pendaftaran**: PPDB reguler per jenjang, daftar ulang, formulir ekstrakurikuler, registrasi alumni.
- **Evaluasi & Survei**: survei kepuasan orang tua/guru, penilaian karakter, jurnal hafalan, feedback kegiatan sekolah.
- **Administrasi**: checklist sarpras, laporan kunjungan rumah, permohonan izin, jadwal piket dinamis.
- **Komunikasi**: template undangan, notulensi rapat, jadwal broadcast WhatsApp.

### Fitur Minimum
1. **Registry**: struktur metadata (`slug`, `label`, `kategori`, `author`, `previewImage`, `deskripsi`, `form`).
2. **UI Gallery**: grid/card dengan preview, filter kategori, pencarian, CTA “Gunakan Template”.
3. **Preview Quick View**: modal menampilkan TOC form, highlight question types.
4. **Import Flow**: klik apply → memuat template ke editor (logic reuse `buildEditorFromTemplate` + auto slug).
5. **Curated vs Community**: flag `source="official" | "community"` untuk memisahkan.

### Pengembangan Lanjutan
- Penilaian/rating, statistik penggunaan, “disimpan” favorit.
- Upload JSON template oleh user (dengan review).
- API publik untuk memuat/update katalog tanpa redeploy.

## 2. Theme Marketplace (Frontend Website)

### Latar Belakang
Karena CMS menggunakan WordPress headless, sekolah butuh cara cepat mengganti tampilan situs publik tanpa menyentuh kode. Marketplace tema menjadi etalase desain siap pakai.

### Konten & Metadata
- `slug`, `nama tema`, `kategori` (Landing, PPDB, Pesantren, Sekolah Unggulan, dsb.)
- Palet warna utama, dukungan dark mode, layout (sidebar, single column), modul wajib (berita, galeri, jadwal, pengumuman).
- Screenshot/preview, link demo live, status (free/premium), kompatibilitas plugin.

### Fitur UX
1. **Gallery** dengan filter kategori, warna, modul.
2. **Preview** penuh (iframe) + detail modul.
3. **Action**: “Gunakan Tema” → memicu deploy/konfigurasi ke WordPress headless (via REST API atau pipeline build).
4. **Team Picks & Trending** sections.

### Tahap Implementasi
1. **Phase 1**: statis/kurasi internal (metadata JSON) + UI listing di dashboard.
2. **Phase 2**: integrasi WordPress API untuk menerapkan tema (push konfigurasi, update global styles).
3. **Phase 3**: komunitas partner bisa mengunggah tema, review system, monetisasi (gratis/premium).

## 3. Integrasi ke Dashboard
- Tambah tab “Marketplace” pada editor form (untuk template) dan pada pengaturan situs (untuk tema).
- Gunakan komponen kartu/preview seragam (CTA, badge “Official/Community”, rating).
- Sertakan dokumentasi singkat + guideline aksesibilitas (menjaga kualitas template).

## 4. Next Steps
1. **Data Model**: definisikan interface `TemplateMeta`, `ThemeMeta`, dan storage (JSON/Prisma).
2. **UI Prototype**: wireframe grid + preview (bisa di Figma atau langsung Tailwind).
3. **Backend**: endpoint untuk fetch daftar template/tema (cacheable).
4. **Governance**: tentukan proses kurasi & publikasi template/tema komunitas.

Dokumen ini jadi dasar awal untuk menyusun backlog desain & implementasi marketplace template maupun tema di platform sekolah.

