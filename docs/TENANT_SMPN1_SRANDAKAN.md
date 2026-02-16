# Tenant Mockup: SMP Negeri 1 Srandakan

## Overview

Tenant mockup untuk **SMP Negeri 1 Srandakan** telah berhasil dibuat berdasarkan data dari website resmi mereka di https://smpsransa.sch.id

## Data yang Di-seed

### 1. Tenant Information
- **Name**: SMP Negeri 1 Srandakan
- **Slug**: `smpn1srandakan`
- **Domain**: `smpn1srandakan.aksesekolah.id`
- **Email**: layanan@smpsransa.sch.id
- **Phone**: (0274) 6464726
- **Address**: Jl. Nengahan Paten, Srandakan, Trimurti, Kec. Srandakan, Kabupaten Bantul, DIY 55762
- **Website**: https://smpsransa.sch.id
- **Status**: Active & Verified

### 2. School Profile
- **Tagline**: "Berjiwa Pancasila, Berprestasi, Berwawasan Global"
- **Type**: Sekolah Penggerak
- **Description**: Pionir dalam penerapan Pendidikan inovasi Teknologi Berbudaya
- **Location**: 13.1km dari pusat kota Bantul, Yogyakarta

### 3. Admin User
- **Email**: admin@smpsransa.sch.id
- **Password**: sransa2024
- **Role**: tenant_admin
- **Status**: Active

### 4. Contact Settings
**Call Center:**
- Phone: +62 896-2785-0100
- Label: Call Center SMP N 1 Srandakan
- WhatsApp Template: "Halo, saya ingin bertanya tentang SMP N 1 Srandakan"

**PPDB/Admissions:**
- Phone: +62 896-2785-0100
- Label: Bantuan PPDB
- WhatsApp Template: "Halo, saya ingin bertanya tentang PPDB SMP N 1 Srandakan"

### 5. PPDB/SPMB Settings
**Academic Year**: 2025/2026
**Status**: Open for Registration

**Gelombang Pendaftaran:**
1. Gelombang 1: 1 Mei - 15 Juni 2025 (Quota: 100)
2. Gelombang 2: 16 Juni - 15 Juli 2025 (Quota: 50)

**Jalur Pendaftaran:**
1. Jalur Prestasi (untuk siswa berprestasi)
2. Jalur Reguler (pendaftaran umum)

**Biaya:**
- Pendaftaran: Gratis
- SPP: Gratis (Sekolah Negeri)
- Seragam: Rp 500.000
- Buku: Rp 300.000

**Persyaratan:**
- Fotocopy Ijazah SD/MI yang telah dilegalisir
- Fotocopy SKHUN SD/MI yang telah dilegalisir
- Fotocopy Akta Kelahiran
- Fotocopy Kartu Keluarga
- Pas foto berwarna ukuran 3x4 (3 lembar)
- Map warna merah

### 6. Sample Students (Prestasi)
**Nabila Nur Azizah**
- Email: nabila@student.smpsransa.sch.id
- Prestasi: Juara 3 Taekwondo kategori kyorugi under 43 Putri - Pekan Olahraga Pelajar Kabupaten Bantul 2025

**Galuh Sekar Utami**
- Email: galuh@student.smpsransa.sch.id
- Prestasi: Juara 2 Panahan kategori compound 50 meter putri - Pekan Olahraga Pelajar Kabupaten Bantul 2025

**Senior Cheza Adellio**
- Email: senior@student.smpsransa.sch.id
- Prestasi: Juara 3 Pencak silat kategori kelas A putra 39-43 kg - Pekan Olahraga Pelajar Kabupaten Bantul 2025

### 7. Form Configuration
**PPDB Form** dengan sections:
1. Data Pribadi Siswa
2. Data Orang Tua/Wali
3. Data Sekolah Asal
4. Prestasi & Jalur Pendaftaran

## Access URLs

### Production
- **Dashboard**: https://dashboard.aksesekolah.id
- **Login**: https://dashboard.aksesekolah.id/signin
- **Tenant Website**: https://smpn1srandakan.aksesekolah.id
- **PPDB**: https://smpn1srandakan.aksesekolah.id/admissions

### Development (via SSH Tunnel)
- **Dashboard**: http://dashboard.aksesekolah.local:3001
- **Login**: http://dashboard.aksesekolah.local:3001/signin
- **Tenant Website**: http://smpn1srandakan.aksesekolah.local:3001
- **PPDB**: http://smpn1srandakan.aksesekolah.local:3001/admissions

## Login Credentials

```
Email: admin@smpsransa.sch.id
Password: sransa2024
```

## Testing Checklist

### ✅ Authentication
- [ ] Login dengan credentials di atas
- [ ] Verify redirect ke tenant dashboard
- [ ] Check user profile shows correct tenant

### ✅ Tenant Website
- [ ] Access tenant subdomain
- [ ] Verify school information displayed
- [ ] Check contact information
- [ ] Test WhatsApp links

### ✅ PPDB/Admissions
- [ ] Access admissions page
- [ ] View PPDB information
- [ ] Check gelombang & jalur pendaftaran
- [ ] Test registration form
- [ ] Submit test application

### ✅ Dashboard Features
- [ ] View school profile
- [ ] Edit school information
- [ ] Manage students
- [ ] View applications
- [ ] Manage PPDB settings

## Re-seeding

Jika perlu re-seed data:

```bash
# Delete existing data (optional)
# Then re-run seed
pnpm run db:seed:smpn1srandakan
```

## Data Source

Data di-scrape dari website resmi menggunakan Firecrawl:
- **URL**: https://smpsransa.sch.id
- **Method**: Firecrawl API v2
- **Format**: Markdown
- **Date**: November 28, 2025

## Notes

1. **Password**: Password default adalah `sransa2024`, sebaiknya diganti setelah first login
2. **Email**: Email menggunakan domain `@smpsransa.sch.id` sesuai dengan website asli
3. **Phone**: Nomor telepon menggunakan format yang sama dengan website asli
4. **Logo**: Logo URL diambil dari website asli
5. **Prestasi**: Data prestasi siswa diambil dari website asli (TA 2024/2025)

## Next Steps

1. **Login & Verify**
   - Login ke dashboard
   - Verify semua data ter-load dengan benar
   - Check tenant isolation

2. **Customize**
   - Update school profile jika perlu
   - Add more students
   - Configure PPDB settings
   - Upload school photos

3. **Test Features**
   - Test PPDB registration flow
   - Test student management
   - Test messaging system
   - Test form builder

4. **Production Ready**
   - Change default password
   - Configure email settings
   - Setup custom domain (optional)
   - Enable SSL for custom domain

## Support

Untuk pertanyaan atau issues:
- Check documentation di `docs/`
- Review seed script di `prisma/seeds/smpn1-srandakan.ts`
- Contact development team

---

**Created**: November 28, 2025
**Status**: ✅ Active
**Environment**: Production & Development Ready
