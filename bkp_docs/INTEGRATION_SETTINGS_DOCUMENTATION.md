# 🔌 Dokumentasi Pengaturan Integrasi Sistem

## 🎯 Overview

Halaman Pengaturan Integrasi memungkinkan sekolah untuk menghubungkan Sistem Administrasi Sekolah dengan berbagai platform eksternal untuk memperluas kemampuan dan efisiensi manajemen data.

## 🏗️ Arsitektur Sistem

### Sistem Administrasi Sekolah (Lite Version)
Aplikasi ini adalah **versi lite** yang fokus pada administrasi umum:
- ✅ Pendaftaran Siswa Baru (SPMB)
- ✅ Manajemen Kontak & Komunikasi
- ✅ Manajemen Staff & Pengajar
- ✅ Konten Website & Artikel
- ✅ Interview Management

### Sistem Akademik Full Version
Sistem lengkap dari **PT Koneksi Jaringan Indonesia** dengan fitur:
- 📚 Manajemen Kurikulum & Mata Pelajaran
- 📅 Penjadwalan Kelas & Ujian
- 📊 Input & Olah Nilai Siswa
- 📜 Rapor & Transkrip Digital
- ✅ Absensi Siswa & Guru
- 💻 E-learning & Materi Ajar
- 📖 Perpustakaan Digital
- 💰 Keuangan & SPP

## 🔗 Integrasi yang Tersedia

### 1. Google Integration

#### Tujuan
Mengintegrasikan Google Forms dan Google Sheets untuk manajemen data interview dan administrasi lainnya.

#### Fitur
- 📋 Import data dari Google Forms
- 📊 Akses Google Sheets untuk analisis data
- 🔄 Sinkronisasi otomatis data interview
- ☁️ Backup data ke Google Drive

#### Cara Setup

**Langkah 1: Buat Project di Google Cloud Console**
1. Buka [Google Cloud Console](https://console.cloud.google.com)
2. Klik "New Project" atau pilih project yang ada
3. Berikan nama project (contoh: "School Admin System")

**Langkah 2: Aktifkan API**
1. Di sidebar, pilih "APIs & Services" → "Library"
2. Cari dan aktifkan:
   - Google Drive API
   - Google Sheets API
   - Google Forms API (jika tersedia)

**Langkah 3: Buat OAuth 2.0 Credentials**
1. Di "APIs & Services" → "Credentials"
2. Klik "Create Credentials" → "OAuth client ID"
3. Pilih "Application type" → "Web application"
4. Tambahkan nama (contoh: "School Admin OAuth")
5. Authorized redirect URIs:
   ```
   http://localhost:3000/api/auth/google/callback
   https://yourdomain.com/api/auth/google/callback
   ```
6. Klik "Create" dan simpan Client ID dan Client Secret

**Langkah 4: Konfigurasi di Aplikasi**
1. Buka `/dashboard/settings?tab=google`
2. Masukkan Client ID dan Client Secret
3. Klik "Hubungkan dengan Google"
4. Authorize aplikasi untuk mengakses Google account
5. Selesai! Status akan berubah menjadi "Terhubung"

#### Penggunaan
```javascript
// Import data dari Google Sheets
const response = await fetch('/api/google/sheets/import', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    spreadsheetId: 'YOUR_SPREADSHEET_ID',
    range: 'Sheet1!A1:Z100'
  })
})
```

#### Environment Variables
```env
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
```

---

### 2. WordPress CMS Integration

#### Tujuan
Mengintegrasikan WordPress sebagai Content Management System untuk blog dan artikel sekolah.

#### Fitur
- ✍️ Buat & Edit artikel dari dashboard
- 📸 Upload media ke WordPress
- 🏷️ Manajemen categories & tags
- 📱 Auto-publish ke website WordPress

#### Cara Setup

**Langkah 1: Persiapan WordPress**
1. Pastikan WordPress versi 5.6 atau lebih baru
2. Aktifkan REST API (default sudah aktif)
3. Install plugin "Application Passwords" (untuk WordPress < 5.6)

**Langkah 2: Generate Application Password**
1. Login ke WordPress dashboard
2. Buka menu "Users" → "Profile"
3. Scroll ke bawah ke section "Application Passwords"
4. Masukkan nama aplikasi: "School Admin System"
5. Klik "Add New Application Password"
6. **PENTING**: Copy password yang muncul (format: xxxx xxxx xxxx xxxx xxxx xxxx)
   - Password ini hanya muncul sekali!
   - Simpan di tempat yang aman

**Langkah 3: Konfigurasi di Aplikasi**
1. Buka `/dashboard/settings?tab=wordpress`
2. Masukkan:
   - WordPress Site URL: `https://blog.sekolah.com`
   - Username: Username WordPress Anda
   - Application Password: Password yang sudah di-copy
3. Klik "Hubungkan dengan WordPress"
4. Sistem akan melakukan test koneksi
5. Jika berhasil, status akan "Terhubung"

#### Penggunaan
```javascript
// Create new post
const response = await fetch('/api/wordpress/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Judul Artikel',
    content: 'Konten artikel...',
    status: 'publish',
    categories: [1, 2],
    tags: [3, 4]
  })
})
```

#### Environment Variables
```env
WORDPRESS_URL=https://blog.sekolah.com
WORDPRESS_USERNAME=admin
WORDPRESS_APP_PASSWORD=xxxx_xxxx_xxxx_xxxx_xxxx_xxxx
```

#### WordPress REST API Endpoints
```
GET    /wp-json/wp/v2/posts          # List posts
POST   /wp-json/wp/v2/posts          # Create post
GET    /wp-json/wp/v2/posts/{id}     # Get post
PUT    /wp-json/wp/v2/posts/{id}     # Update post
DELETE /wp-json/wp/v2/posts/{id}     # Delete post
```

---

### 3. Sistem Akademik Integration (PT Koneksi Jaringan Indonesia)

#### Tujuan
Menghubungkan Sistem Administrasi (lite) dengan Sistem Akademik Full Version untuk transfer data dan sinkronisasi.

#### Fitur
- 👨‍🎓 Transfer data siswa dari SPMB ke Sistem Akademik
- 👨‍🏫 Sinkronisasi data staff dan guru
- 📊 Akses laporan akademik dari dashboard
- 🔄 Real-time data synchronization

#### Cara Setup

**Langkah 1: Aktivasi API di Sistem Akademik**
1. Login ke dashboard Sistem Akademik Full Version
2. Buka menu "Pengaturan" → "API & Integrasi"
3. Klik "Aktifkan API Access"
4. Pilih permission level yang diinginkan

**Langkah 2: Generate API Key**
1. Di halaman "API & Integrasi"
2. Klik "Generate New API Key"
3. Berikan nama: "School Admin Lite System"
4. Pilih scopes yang diperlukan:
   - `students:read`, `students:write`
   - `staff:read`, `staff:write`
   - `reports:read`
5. Copy API Key yang dihasilkan

**Langkah 3: Dapatkan School Code**
1. School Code biasanya tersedia di "Profil Sekolah"
2. Format: `SCH-2024-XXXX`
3. Atau hubungi support untuk mendapatkannya

**Langkah 4: Konfigurasi di Aplikasi**
1. Buka `/dashboard/settings?tab=academic`
2. Masukkan:
   - API URL: `https://api.akademik.koneksijaringan.com`
   - School Code: `SCH-2024-XXXX`
   - API Key: Key yang sudah di-copy
3. Klik "Hubungkan dengan Sistem Akademik"
4. Sistem akan verifikasi koneksi
5. Status akan "Terhubung" jika berhasil

#### Penggunaan
```javascript
// Transfer student data
const response = await fetch('/api/academic/students/transfer', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    submissionId: 'cmgkjjjpt000b112dwcpgc3ay',
    enrollmentYear: '2024',
    classLevel: '10'
  })
})
```

#### Environment Variables
```env
ACADEMIC_API_URL=https://api.akademik.koneksijaringan.com
ACADEMIC_API_KEY=ak_live_xxxxxxxxxxxxxxxxxxxxxxxx
ACADEMIC_SCHOOL_CODE=SCH-2024-XXXX
```

#### API Endpoints
```
GET    /api/v1/school/verify          # Verify connection
POST   /api/v1/students/import         # Import students
GET    /api/v1/students/{id}           # Get student
PUT    /api/v1/students/{id}           # Update student
GET    /api/v1/reports/summary         # Get reports
```

#### Support
- Email: support@koneksijaringan.com
- Phone: +62 xxx-xxxx-xxxx
- Documentation: https://docs.koneksijaringan.com

---

## 🔧 Konfigurasi Database

### Schema untuk Settings
```prisma
model IntegrationSettings {
  id          String   @id @default(cuid())
  schoolId    String   @unique
  
  // Google Integration
  googleClientId        String?
  googleClientSecret    String?
  googleAccessToken     String?
  googleRefreshToken    String?
  googleConnected       Boolean  @default(false)
  googleLastSync        DateTime?
  
  // WordPress Integration
  wordpressUrl          String?
  wordpressUsername     String?
  wordpressAppPassword  String?
  wordpressConnected    Boolean  @default(false)
  wordpressLastSync     DateTime?
  
  // Academic System Integration
  academicApiUrl        String?
  academicApiKey        String?
  academicSchoolCode    String?
  academicConnected     Boolean  @default(false)
  academicLastSync      DateTime?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("integration_settings")
}
```

## 🔒 Security Best Practices

### 1. Credentials Storage
- ✅ Simpan credentials terenkripsi di database
- ✅ Gunakan environment variables untuk sensitive data
- ✅ Jangan commit credentials ke Git
- ✅ Rotate API keys secara berkala

### 2. Access Control
- ✅ Hanya admin yang bisa akses settings
- ✅ Implement role-based access control
- ✅ Log semua aktivitas integrasi
- ✅ Audit trail untuk perubahan settings

### 3. API Security
- ✅ Gunakan HTTPS untuk semua API calls
- ✅ Implement rate limiting
- ✅ Validate semua input
- ✅ Handle errors dengan aman (jangan expose sensitive info)

## 📊 Monitoring & Logging

### Metrics to Track
```javascript
{
  googleIntegration: {
    status: 'connected',
    lastSync: '2024-10-12T10:30:00Z',
    totalRequests: 1234,
    failedRequests: 2,
    avgResponseTime: '250ms'
  },
  wordpressIntegration: {
    status: 'connected',
    lastSync: '2024-10-12T09:15:00Z',
    totalPosts: 45,
    publishedToday: 3
  },
  academicIntegration: {
    status: 'connected',
    lastSync: '2024-10-12T08:00:00Z',
    studentsTransferred: 156,
    pendingTransfers: 3
  }
}
```

### Error Handling
```javascript
try {
  const response = await fetch('/api/google/sheets/import')
  const result = await response.json()
  
  if (!result.success) {
    // Log error
    console.error('Google Sheets import failed:', result.message)
    
    // Notify admin
    await sendNotification({
      type: 'integration_error',
      integration: 'google',
      message: result.message
    })
    
    // Update status
    await updateIntegrationStatus('google', 'error')
  }
} catch (error) {
  // Handle network or unexpected errors
  console.error('Unexpected error:', error)
}
```

## 🚀 Deployment Checklist

### Pre-deployment
- [ ] Semua environment variables sudah di-set
- [ ] Credentials sudah terenkripsi
- [ ] Database migration sudah dijalankan
- [ ] Testing semua integrasi di staging
- [ ] Backup database

### Post-deployment
- [ ] Verifikasi semua integrasi berfungsi
- [ ] Monitor error logs
- [ ] Test sync functionality
- [ ] Verifikasi webhook callbacks
- [ ] Check API rate limits

## 🧪 Testing

### Unit Tests
```javascript
describe('Google Integration', () => {
  it('should connect successfully with valid credentials', async () => {
    const result = await connectGoogle({
      clientId: 'valid_id',
      clientSecret: 'valid_secret'
    })
    expect(result.success).toBe(true)
  })
  
  it('should fail with invalid credentials', async () => {
    const result = await connectGoogle({
      clientId: 'invalid_id',
      clientSecret: 'invalid_secret'
    })
    expect(result.success).toBe(false)
  })
})
```

### Integration Tests
```javascript
describe('WordPress Integration', () => {
  it('should create post successfully', async () => {
    const post = await createWordPressPost({
      title: 'Test Post',
      content: 'Test content'
    })
    expect(post.id).toBeDefined()
    expect(post.status).toBe('publish')
  })
})
```

## 📱 UI Components

### Settings Page
**Location**: `/dashboard/settings`

**Tabs**:
1. **Google Integration**: OAuth setup, status, test connection
2. **WordPress CMS**: Credentials, connection test, features
3. **Sistem Akademik**: API config, school code, sync status
4. **Pengaturan Umum**: Auto-sync, notifications, logging

### Features
- 📊 Real-time connection status
- 🧪 Test connection button
- 📝 Configuration forms
- 🔔 Success/error notifications
- 📈 Last sync timestamp
- 🔐 Secure credential input

## 🔄 Data Flow

### SPMB to Academic System
```
1. Siswa mendaftar via SPMB
2. Admin review & approve
3. Status changed to "approved"
4. Trigger automatic transfer
5. Data sent to Academic System API
6. Academic System creates student record
7. Confirmation sent back
8. Update status in Admin System
```

### Google Forms to Dashboard
```
1. Applicant fills Google Form
2. Response saved to Google Sheets
3. Admin clicks "Import" in dashboard
4. System fetches latest responses
5. Parse and validate data
6. Save to database
7. Update interview session status
```

### WordPress Content Sync
```
1. Admin creates article in dashboard
2. Fill title, content, categories
3. Click "Publish to WordPress"
4. System calls WordPress REST API
5. Post created in WordPress
6. Get post ID & URL
7. Save reference in database
```

## 📞 Troubleshooting

### Google Integration Issues

**Problem**: "Invalid credentials"
- ✅ Check Client ID dan Client Secret
- ✅ Verify Redirect URI di Google Console
- ✅ Pastikan APIs sudah diaktifkan

**Problem**: "Access denied"
- ✅ Check OAuth scopes
- ✅ Re-authorize aplikasi
- ✅ Verify user permissions

### WordPress Integration Issues

**Problem**: "Connection failed"
- ✅ Check WordPress URL (include https://)
- ✅ Verify Application Password format
- ✅ Test WordPress REST API manually

**Problem**: "Unauthorized"
- ✅ Regenerate Application Password
- ✅ Check username spelling
- ✅ Verify user has proper permissions

### Academic System Issues

**Problem**: "API key invalid"
- ✅ Check API key expiration
- ✅ Verify School Code
- ✅ Contact PT Koneksi JI support

**Problem**: "Sync failed"
- ✅ Check internet connection
- ✅ Verify API endpoint URL
- ✅ Check API rate limits

---

## 📚 Resources

### Documentation Links
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [WordPress REST API](https://developer.wordpress.org/rest-api/)
- [PT Koneksi JI Docs](https://docs.koneksijaringan.com)

### Support Contacts
- **Google**: Google Cloud Console Support
- **WordPress**: WordPress.org Support Forums
- **Sistem Akademik**: support@koneksijaringan.com

---

*Dokumentasi ini akan terus diupdate sesuai perkembangan fitur integrasi.*
