# 📖 Panduan Pengguna - School Management System

## 🎯 Pendahuluan

Selamat datang di School Management System! Aplikasi ini dirancang untuk membantu sekolah mengelola data siswa, penerimaan siswa baru (SPMB), dan komunikasi dengan orang tua/siswa.

---

## 🔐 Login ke Sistem

### Akses Admin

1. Buka browser dan akses: `http://localhost:3000/signin`
2. Masukkan kredensial:
   - **Username**: `admin`
   - **Password**: `admin123`
3. Klik tombol **"Login"**
4. Anda akan diarahkan ke Dashboard

### Logout

1. Klik **avatar/nama user** di pojok kanan atas
2. Pilih **"Logout"** dari dropdown menu
3. Anda akan diarahkan kembali ke halaman login

---

## 📊 Dashboard

Dashboard adalah halaman utama yang menampilkan ringkasan informasi sekolah.

### Informasi yang Ditampilkan:

#### 1. **Stats Cards**
- **Total Siswa**: Jumlah seluruh siswa aktif
- **Total Guru**: Jumlah guru dan staff
- **Pendaftar Baru**: Jumlah pendaftar yang menunggu approval
- **Pesan Baru**: Jumlah pesan yang belum dibaca

#### 2. **Quick Actions**
- **Tambah Siswa Baru**: Langsung ke form pendaftaran siswa
- **Lihat Pendaftar**: Akses halaman SPMB
- **Kelola Pesan**: Akses inbox pesan

#### 3. **Charts & Analytics**
- **Trend Pendaftar**: Grafik line menampilkan tren pendaftar 6 bulan terakhir
  - Garis kuning: Pending
  - Garis hijau: Diterima
  - Garis merah: Ditolak
- **Siswa per Jenjang**: Pie chart distribusi siswa per tingkat (SD/SMP/SMA)

#### 4. **Informasi Sekolah**
- Nama sekolah
- Tahun berdiri
- Kontak (email & telepon)

---

## 👥 Manajemen Siswa

### Melihat Daftar Siswa

1. Klik **"Siswa"** di sidebar menu
2. Daftar siswa akan ditampilkan dalam tabel
3. Informasi yang ditampilkan:
   - Nama siswa
   - Email
   - Nomor telepon
   - Kelas/jenjang (SD/SMP/SMA)
   - Status (Aktif/Tidak Aktif/Lulus)

### Mencari Siswa

1. Gunakan **search box** di atas tabel
2. Ketik nama, email, atau kelas siswa
3. Hasil akan ter-filter secara otomatis

### Menambah Siswa Baru

1. Klik tombol **"Tambah Siswa"** (hijau, pojok kanan atas)
2. Isi formulir:
   
   **Data Siswa:**
   - Nama Lengkap (wajib)
   - Email (wajib)
   - Nomor Telepon
   - Kelas/Jenjang (pilih: SD/SMP/SMA)
   - Tanggal Lahir

   **Data Orang Tua/Wali:**
   - Nama Orang Tua/Wali
   - Nomor Telepon Orang Tua

   **Informasi Tambahan:**
   - Alamat Lengkap
   - Status (Aktif/Tidak Aktif/Lulus)

3. Klik **"Simpan Data"**
4. Siswa baru akan muncul di daftar

### Menghapus Siswa

1. Klik tombol **⋮** (tiga titik) di kolom Aksi
2. Pilih **"Hapus"** (merah)
3. Konfirmasi penghapusan
4. Data siswa akan terhapus permanen

⚠️ **Perhatian**: Menghapus siswa akan menghapus semua data terkait (pendaftaran, pesan, dll)

---

## 📝 SPMB - Penerimaan Siswa Baru

### Melihat Daftar Pendaftar

1. Klik **"SPMB"** di sidebar menu
2. Statistik pendaftar ditampilkan di atas:
   - **Pending**: Menunggu persetujuan
   - **Diterima**: Sudah diterima
   - **Ditolak**: Ditolak

### Mencari Pendaftar

1. Gunakan **search box** untuk cari berdasarkan:
   - Nama siswa
   - Email
   - Program pendaftaran

2. Gunakan **dropdown filter** untuk filter berdasarkan status:
   - Semua Status
   - Pending
   - Diterima
   - Ditolak

### Menyetujui/Menolak Pendaftar

**Untuk pendaftar dengan status Pending:**

1. Lihat tombol aksi di kolom **Aksi**
2. Klik **"Terima"** untuk menyetujui pendaftaran
3. Klik **"Tolak"** untuk menolak pendaftaran
4. Status akan berubah otomatis

---

## 💬 Kelola Pesan

### Melihat Inbox

1. Klik **"Pesan"** di sidebar menu
2. Pesan yang belum dibaca akan di-highlight dengan warna hijau
3. Badge **"X Pesan Baru"** menampilkan jumlah unread

### Filter Pesan

Gunakan tabs di atas tabel:
- **Semua**: Menampilkan semua pesan
- **Belum Dibaca**: Hanya pesan yang belum dibaca
- **Sudah Dibaca**: Hanya pesan yang sudah dibaca

### Mencari Pesan

1. Gunakan **search box**
2. Cari berdasarkan:
   - Subjek pesan
   - Nama pengirim
   - Isi pesan

### Menandai Pesan Sebagai Dibaca

1. Untuk pesan yang belum dibaca, klik **"Tandai Dibaca"**
2. Background hijau akan hilang
3. Icon berubah dari tertutup ke terbuka
4. Counter "Pesan Baru" berkurang

### Menghapus Pesan

1. Klik tombol **🗑️** (trash icon)
2. Konfirmasi penghapusan
3. Pesan akan terhapus permanen

---

## 🏫 Pengaturan Sekolah

### Mengedit Profil Sekolah

1. Klik **"Sekolah"** di sidebar menu
2. Pilih tab **"Profil Sekolah"**
3. Edit informasi:
   - Nama Sekolah
   - Deskripsi/Visi Sekolah
   - URL Logo Sekolah
4. Klik **"Simpan Perubahan"**

### Mengedit Kontak & Lokasi

1. Pilih tab **"Kontak & Lokasi"**
2. Edit informasi:
   - Alamat Lengkap
   - Nomor Telepon
   - Email
   - Website
3. Klik **"Simpan Perubahan"**

---

## 🎨 Navigasi Aplikasi

### Sidebar Menu

Menu utama di sebelah kiri:
- **Dashboard**: Halaman utama
- **Siswa**: Manajemen data siswa
- **Guru & Staff**: (Coming soon)
- **SPMB**: Penerimaan siswa baru
- **Pesan**: Inbox dan kelola pesan
- **Sekolah**: Pengaturan profil sekolah
- **Settings**: (Coming soon)

### Collapse/Expand Sidebar

- Klik tombol **◀** atau **▶** di sidebar untuk collapse/expand
- Mode collapsed hanya menampilkan icon
- Hemat ruang layar saat bekerja dengan tabel besar

### Top Navigation

- **Notifikasi**: Bell icon menampilkan notifikasi baru
- **User Menu**: Klik avatar/nama untuk:
  - Lihat profile
  - Settings
  - Logout

---

## 💡 Tips & Trik

### Pencarian Efektif

- Gunakan kata kunci spesifik
- Search bekerja real-time (tanpa perlu enter)
- Kombinasikan search dengan filter untuk hasil lebih akurat

### Keyboard Shortcuts

- `Tab`: Navigate antar form fields
- `Enter`: Submit form (saat di field input)
- `Esc`: Close modal/dialog

### Best Practices

1. **Backup Data Reguler**: Export data siswa secara berkala
2. **Update Informasi**: Pastikan data kontak selalu ter-update
3. **Review Pendaftar**: Check pendaftar minimal 2x seminggu
4. **Baca Pesan**: Tandai pesan sudah dibaca untuk tracking yang lebih baik

---

## 🐛 Troubleshooting

### Problem: Tidak bisa login

**Solusi:**
1. Pastikan username dan password benar
2. Clear browser cache
3. Coba browser lain
4. Contact admin sistem

### Problem: Data tidak muncul

**Solusi:**
1. Refresh halaman (F5)
2. Check koneksi internet
3. Logout dan login kembali

### Problem: Form tidak bisa submit

**Solusi:**
1. Pastikan semua field yang wajib (*) sudah diisi
2. Check format email dan phone number
3. Lihat error message yang muncul

---

## 📞 Bantuan & Support

Jika mengalami kendala:

1. **Check Documentation**: Baca panduan ini dengan teliti
2. **Testing Checklist**: Lihat `TESTING_CHECKLIST.md`
3. **Contact Support**: Email ke `admin@school.local`

---

## 📋 Changelog

### Version 1.0.0 (Beta)
- ✅ Authentication system
- ✅ Dashboard with analytics
- ✅ Students management (CRUD)
- ✅ Admissions/SPMB management
- ✅ Messages inbox
- ✅ School settings
- ✅ Charts and visualizations

---

**Last Updated**: October 2024  
**Version**: 1.0.0 Beta  
**Status**: Ready for Beta Testing

