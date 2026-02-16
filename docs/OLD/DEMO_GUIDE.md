# 🎯 Demo Frontend Interview System - Quick Start Guide

## 🚀 Akses Demo

### 1. Dashboard Interview Management

```
URL: http://localhost:3000/dashboard/admissions?tab=interview
```

**Fitur yang bisa dicoba:**

- 📊 Lihat statistik interview (Total: 4, Pending: 2, Completed: 1, Reviewed: 1)
- 🔍 Coba filter berdasarkan status (PENDING, COMPLETED, REVIEWED)
- 🔍 Coba filter berdasarkan jenis interview (Diniyah, Akademik, Psikologis)
- 🔍 Coba search berdasarkan nama atau nomor registrasi
- 📤 Klik tombol "Import CSV" dan "Export Data" (akan muncul toast notification)
- ⚙️ Lihat manajemen Google Forms links

### 2. Interview Notifications (Registrar Page)

```
URL: http://localhost:3000/registrar?id=SPMB-2025-2007
```

**Fitur yang bisa dicoba:**

- 🔔 Lihat notifikasi interview yang perlu diselesaikan
- 🔗 Klik tombol "Ikuti Interview" untuk membuka Google Forms (demo link)
- ⏰ Lihat countdown deadline
- ✅ Lihat status interview yang sudah selesai

**Coba juga dengan data lain:**

```
URL: http://localhost:3000/registrar?id=SPMB-2025-5790
```

## 📊 Data Demo yang Tersedia

### Interview Types:

1. **Interview Diniyah** (Required)
   - Link: https://forms.gle/diniyah-demo
   - Untuk menilai kemampuan diniyah dan hafalan Al-Quran

2. **Interview Akademik** (Required)
   - Link: https://forms.gle/akademik-demo
   - Untuk menilai kemampuan akademik dan motivasi belajar

3. **Interview Psikologis** (Optional)
   - Link: https://forms.gle/psikologis-demo
   - Untuk menilai kondisi psikologis dan kesiapan belajar

4. **Interview Wawancara Orang Tua** (Optional)
   - Link: https://forms.gle/ortu-demo
   - Interview dengan orang tua untuk memahami dukungan keluarga

### Sample Interview Sessions:

#### Ahmad Fauzi (SPMB-2025-2007):

- ✅ **Interview Diniyah**: PENDING (Deadline: 7 hari lagi)
- ✅ **Interview Psikologis**: REVIEWED (Skor: 85/100, Feedback: "Kondisi psikologis baik")

#### Siti Rahma (SPMB-2025-5790):

- ✅ **Interview Diniyah**: COMPLETED (Skor: 87/100, Feedback: "Hafalan lancar")
- ✅ **Interview Akademik**: PENDING (Deadline: 5 hari lagi)

## 🎮 Cara Testing Demo

### 1. Testing Dashboard Filter

1. Buka `/dashboard/admissions?tab=interview`
2. Coba filter "Status" → pilih "PENDING" → lihat hanya 2 session
3. Coba filter "Jenis" → pilih "Interview Diniyah" → lihat 2 session
4. Coba search "Ahmad" → lihat hanya session Ahmad Fauzi

### 2. Testing Registrar Notifications

1. Buka `/registrar?id=SPMB-2025-2007`
2. Scroll ke bawah setelah "Status Pendaftaran"
3. Lihat section "Status Interview Anda"
4. Klik tombol "Ikuti Interview" → akan buka Google Forms demo
5. Ulangi dengan `/registrar?id=SPMB-2025-5790`

### 3. Testing Interactive Elements

1. **Dashboard**: Klik tombol aksi (👁️ Lihat, ✏️ Edit, 🗑️ Hapus)
2. **Registrar**: Hover pada tombol interview untuk melihat efek
3. **Responsive**: Resize browser untuk test mobile view

## 🔧 Technical Details

### Mock API Endpoints:

- `GET /api/interview/types` - Daftar jenis interview
- `GET /api/interview/sessions` - Daftar sesi interview dengan filter
- `GET /api/interview/results` - Daftar hasil interview

### Components:

- `components/dashboard/interview-management.tsx` - Dashboard management
- `components/registrar/interview-notification.tsx` - Registrar notifications

### Database Schema:

- `prisma/interview-schema.prisma` - Schema untuk production

## 🎨 UI/UX Features

### Dashboard:

- 📊 KPI Cards dengan statistik real-time
- 🔍 Advanced filtering (status, jenis, search)
- 📋 Responsive table dengan actions
- 🎨 Clean design dengan hover effects
- 📱 Mobile-friendly layout

### Registrar:

- 🔔 Alert notifications untuk interview pending
- ⏰ Countdown timer untuk deadline
- 🎯 Clear call-to-action buttons
- 📱 Responsive card layout
- ✨ Smooth animations

## 🚀 Next Steps untuk Production

1. **Database Integration**:

   ```bash
   npx prisma migrate dev --name add-interview-tables
   ```

2. **Real API Implementation**:
   - Replace mock data dengan database queries
   - Add proper error handling
   - Implement data validation

3. **Google Forms Integration**:
   - CSV import functionality
   - Automated data sync
   - Real-time notifications

4. **Additional Features**:
   - Email notifications
   - Advanced analytics
   - Export functionality
   - Bulk operations

---

## 📞 Support

Jika ada pertanyaan atau issue dengan demo:

1. Check console untuk error messages
2. Verify URL parameters
3. Test dengan data sample yang tersedia
4. Contact development team untuk assistance

**Happy Testing! 🎉**
