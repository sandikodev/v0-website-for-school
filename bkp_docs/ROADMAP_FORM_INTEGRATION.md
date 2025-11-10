# 🎯 ROADMAP: Dynamic Form Builder & Integration
## Formulir Pendaftaran → Admin Dashboard

---

## 📊 **ANALISIS SITUASI SAAT INI**

### ✅ **Yang Sudah Ada:**
1. **Form Pendaftaran** (`/signup` atau `/admissions?tab=form`)
   - Multi-step wizard (4 langkah)
   - Dynamic form schema (`lib/form-schema.ts`)
   - LocalStorage untuk config
   - Beautiful UI/UX
   - Progress tracking

2. **Form Schema System** (`lib/form-schema.ts`)
   - 18 field definitions
   - `enabled` & `required` flags
   - Section grouping (siswa, orangtua, sekolah, tambahan, upload)
   - Load/save to localStorage

3. **Admin Dashboard** (`/admin/admissions`)
   - View applicants
   - Approve/reject functionality
   - Search & filter
   - Basic statistics

### ❌ **Yang Belum Ada:**
1. Form submission **tidak tersimpan** ke database
2. Admin **tidak bisa configure** form fields
3. **Tidak ada** halaman form builder untuk admin
4. Submissions **tidak muncul** di admin dashboard
5. File upload **belum implement**

---

## 🎯 **GOALS**

### **Primary Goals:**
1. ✅ **Form Builder Page** - Admin bisa atur field mana yang aktif
2. ✅ **Save to Database** - Submission tersimpan ke DB
3. ✅ **Admin Integration** - Data muncul di `/admin/admissions`
4. ✅ **File Upload** - Implementasi upload foto & dokumen
5. ✅ **Form Preview** - Admin bisa preview form sebelum publish

### **Secondary Goals:**
6. 🎯 **Custom Fields** - Admin bisa tambah field baru
7. 🎯 **Conditional Logic** - Field muncul berdasarkan kondisi
8. 🎯 **Multi-language** - Support Bahasa & English
9. 🎯 **Form Templates** - Save & load form templates

---

## 📋 **ROADMAP IMPLEMENTATION**

### **FASE 1: Database Schema (30 menit)**

#### 1.1 Update Prisma Schema

```prisma
// prisma/schema.prisma

// 1. Form Configuration (untuk admin atur form)
model FormConfiguration {
  id        String   @id @default(cuid())
  name      String   // "Formulir Pendaftaran 2025"
  isActive  Boolean  @default(false)
  schema    Json     // Store entire form schema
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  schoolId  String
  school    School   @relation(fields: [schoolId], references: [id])
  
  @@map("form_configurations")
}

// 2. Form Submissions (data pendaftaran dari user)
model FormSubmission {
  id                String   @id @default(cuid())
  registrationNumber String  @unique // "SPMB-2025-001"
  
  // Data Siswa
  namaLengkap       String
  tempatLahir       String?
  tanggalLahir      DateTime?
  jenisKelamin      String?
  alamatLengkap     String?
  noHP              String?
  email             String?
  
  // Data Orangtua
  namaAyah          String?
  pekerjaanAyah     String?
  namaIbu           String?
  pekerjaanIbu      String?
  noHPOrangtua      String?
  
  // Data Sekolah
  asalSekolah       String?
  alamatSekolah     String?
  
  // Data Tambahan
  prestasi          String?
  jalurPendaftaran  String?
  gelombangPendaftaran String?
  
  // Metadata
  status            String   @default("pending") // pending, approved, rejected, reviewed
  notes             String?  // Catatan admin
  reviewedBy        String?  // Admin yang review
  reviewedAt        DateTime?
  
  // Files
  uploadedFiles     Json?    // Array of file URLs
  
  // Raw Data (untuk field custom)
  rawData           Json?    // Store all form data as JSON
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  schoolId          String
  school            School   @relation(fields: [schoolId], references: [id])
  
  @@map("form_submissions")
}

// 3. Update School model
model School {
  // ... existing fields ...
  
  formConfigurations FormConfiguration[]
  formSubmissions    FormSubmission[]
}
```

**Action Items:**
```bash
# 1. Add to prisma/schema.prisma
# 2. Generate & push
npx prisma generate
npx prisma db push

# 3. Seed with default form config
node scripts/seed-form-config.js
```

---

### **FASE 2: API Endpoints (1-2 jam)**

#### 2.1 Form Configuration API

**File: `app/api/forms/config/route.ts`**
```typescript
// GET - Ambil active form config
// POST - Create new form config (admin only)
// PUT - Update form config (admin only)
```

**File: `app/api/forms/config/[id]/route.ts`**
```typescript
// GET - Get specific config
// PUT - Update specific config
// DELETE - Delete config
```

**File: `app/api/forms/active/route.ts`**
```typescript
// GET - Get active form config (public, untuk /signup)
```

#### 2.2 Form Submission API

**File: `app/api/forms/submit/route.ts`**
```typescript
// POST - Submit form pendaftaran
// - Generate registration number
// - Save to database
// - Send confirmation email (optional)
// - Return registration number
```

**File: `app/api/forms/submissions/route.ts`**
```typescript
// GET - List all submissions (admin only)
// - Pagination
// - Search by name, email, registration number
// - Filter by status, jalur, gelombang
```

**File: `app/api/forms/submissions/[id]/route.ts`**
```typescript
// GET - Get submission detail
// PUT - Update submission (admin: status, notes)
// DELETE - Delete submission
```

#### 2.3 File Upload API

**File: `app/api/upload/route.ts`**
```typescript
// POST - Upload files
// - Handle multiple files
// - Validate file type & size
// - Save to /public/uploads or cloud storage
// - Return file URLs
```

---

### **FASE 3: Form Builder UI (2-3 jam)**

#### 3.1 Form Builder Page

**File: `app/admin/forms/builder/page.tsx`**

**Features:**
- ✅ List semua fields dengan toggle enable/disable
- ✅ Toggle required/optional
- ✅ Drag & drop untuk reorder (optional)
- ✅ Preview form real-time
- ✅ Save configuration
- ✅ Activate/deactivate form

**UI Layout:**
```
┌─────────────────────────────────────────────────┐
│  Form Builder                                   │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────────────┐  ┌──────────────────────┐ │
│  │  Field Config   │  │   Live Preview       │ │
│  │                 │  │                      │ │
│  │  □ Nama Lengkap │  │  [Form Preview]      │ │
│  │  ☑ Required     │  │                      │ │
│  │                 │  │  Step 1: Data Siswa  │ │
│  │  □ Tempat Lahir │  │  • Nama Lengkap *    │ │
│  │  ☐ Required     │  │  • Email             │ │
│  │                 │  │                      │ │
│  │  [Save Config]  │  │  [Update Preview]    │ │
│  └─────────────────┘  └──────────────────────┘ │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Component Structure:**
```tsx
<AdminLayout>
  <Tabs>
    <TabsList>
      <TabsTrigger>Field Configuration</TabsTrigger>
      <TabsTrigger>Preview</TabsTrigger>
      <TabsTrigger>Settings</TabsTrigger>
    </TabsList>
    
    <TabsContent value="config">
      {/* Field configuration with toggles */}
      <FormFieldConfigurator schema={schema} onChange={handleSchemaChange} />
    </TabsContent>
    
    <TabsContent value="preview">
      {/* Live preview of the form */}
      <FormPreview schema={schema} />
    </TabsContent>
    
    <TabsContent value="settings">
      {/* Form settings (name, active status) */}
      <FormSettings config={config} onChange={handleConfigChange} />
    </TabsContent>
  </Tabs>
</AdminLayout>
```

---

### **FASE 4: Update Form Pendaftaran (1 jam)**

#### 4.1 Update `/signup` Page

**Changes to: `app/(auth)/signup/page.tsx`**

```typescript
// 1. Fetch active form config dari API (bukan localStorage)
useEffect(() => {
  fetchActiveFormConfig()
}, [])

const fetchActiveFormConfig = async () => {
  const response = await fetch('/api/forms/active')
  const data = await response.json()
  setSchema(data.schema)
}

// 2. Update handleSubmit untuk save ke database
const handleSubmit = async () => {
  setIsSubmitting(true)
  
  try {
    const response = await fetch('/api/forms/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    
    const result = await response.json()
    
    if (result.success) {
      setRegistrationNumber(result.registrationNumber)
      setSubmitSuccess(true)
      toast.success('Pendaftaran berhasil!')
    } else {
      toast.error(result.message || 'Gagal mengirim pendaftaran')
    }
  } catch (error) {
    toast.error('Terjadi kesalahan')
  } finally {
    setIsSubmitting(false)
  }
}
```

---

### **FASE 5: Update Admin Admissions (1 jam)**

#### 5.1 Update `/admin/admissions` Page

**Changes to: `app/admin/admissions/page.tsx`**

```typescript
// 1. Fetch submissions dari API (bukan applications)
useEffect(() => {
  fetchSubmissions()
}, [])

const fetchSubmissions = async () => {
  const response = await fetch('/api/forms/submissions')
  const data = await response.json()
  setSubmissions(data.submissions)
}

// 2. Update UI untuk show data dari submissions
// 3. Add view detail modal
// 4. Add download as PDF/Excel
```

**New Features:**
- ✅ View submission details (modal atau detail page)
- ✅ Batch actions (approve multiple, export)
- ✅ Advanced filters (date range, jalur, gelombang)
- ✅ Export to Excel/PDF
- ✅ Send email notifications

---

### **FASE 6: File Upload Implementation (1-2 jam)**

#### 6.1 File Upload Component

**File: `components/forms/file-uploader.tsx`**

```typescript
interface FileUploaderProps {
  onUpload: (urls: string[]) => void
  maxFiles?: number
  maxSize?: number // in MB
  acceptedTypes?: string[]
}

export function FileUploader({ onUpload, maxFiles = 5, maxSize = 5, acceptedTypes }: FileUploaderProps) {
  // Handle file selection
  // Validate file type & size
  // Upload to API
  // Return URLs
  // Show preview
}
```

#### 6.2 Storage Options

**Option A: Local Storage** (Development)
```typescript
// Save to /public/uploads/
// File: /public/uploads/submissions/[id]/[filename]
```

**Option B: Cloud Storage** (Production)
```typescript
// Use MinIO, S3, or Cloudinary
// Better for scalability
```

---

## 🚀 **IMPLEMENTATION TIMELINE**

### **Day 1: Backend Foundation (3-4 jam)**
- [ ] Update Prisma schema
- [ ] Create API endpoints
- [ ] Test APIs dengan Postman

### **Day 2: Admin Form Builder (3-4 jam)**
- [ ] Build form builder page
- [ ] Field configuration UI
- [ ] Live preview
- [ ] Save/activate functionality

### **Day 3: Integration (2-3 jam)**
- [ ] Update signup form
- [ ] Connect to API
- [ ] Update admin admissions
- [ ] Testing end-to-end

### **Day 4: Polish & Features (2-3 jam)**
- [ ] File upload
- [ ] Email notifications
- [ ] Export functionality
- [ ] Final testing

**Total Estimate: 10-14 hours** (2-3 hari kerja)

---

## 📊 **DETAILED WORKFLOW**

### **User Journey:**
```
1. User buka /signup
   ↓
2. Form load active configuration dari API
   ↓
3. User isi form (only enabled fields shown)
   ↓
4. User upload files (optional)
   ↓
5. User submit form
   ↓
6. API generate registration number (SPMB-2025-XXX)
   ↓
7. Save to FormSubmission table
   ↓
8. Send confirmation email (optional)
   ↓
9. Show success message with registration number
```

### **Admin Journey:**
```
1. Admin buka /admin/forms/builder
   ↓
2. Toggle fields on/off, required/optional
   ↓
3. Preview form real-time
   ↓
4. Save & activate configuration
   ↓
5. Buka /admin/admissions
   ↓
6. View all submissions
   ↓
7. Filter, search, sort
   ↓
8. View detail submission
   ↓
9. Approve/reject/review
   ↓
10. Export data
```

---

## 🎨 **UI/UX DESIGN**

### **Form Builder Page**

```tsx
┌──────────────────────────────────────────────────────────┐
│  📋 Form Builder - Formulir Pendaftaran 2025            │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ 📝 Data Siswa                                      │ │
│  ├────────────────────────────────────────────────────┤ │
│  │ ☑ Nama Lengkap        [Required ☑] [Enabled ☑]   │ │
│  │ ☑ Tempat Lahir        [Required ☑] [Enabled ☑]   │ │
│  │ ☑ Tanggal Lahir       [Required ☑] [Enabled ☑]   │ │
│  │ ☑ Jenis Kelamin       [Required ☑] [Enabled ☑]   │ │
│  │ ☑ Alamat              [Required ☑] [Enabled ☑]   │ │
│  │ □ No. HP Siswa        [Required ☐] [Enabled ☑]   │ │
│  │ □ Email               [Required ☐] [Enabled ☑]   │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ 👨‍👩‍👧 Data Orangtua                                  │ │
│  ├────────────────────────────────────────────────────┤ │
│  │ ☑ Nama Ayah           [Required ☑] [Enabled ☑]   │ │
│  │ ☑ Pekerjaan Ayah      [Required ☐] [Enabled ☑]   │ │
│  │ ☑ Nama Ibu            [Required ☑] [Enabled ☑]   │ │
│  │ ☑ Pekerjaan Ibu       [Required ☐] [Enabled ☑]   │ │
│  │ ☑ No. HP Orangtua     [Required ☑] [Enabled ☑]   │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  [Save Draft]  [Preview]  [Save & Activate]             │
└──────────────────────────────────────────────────────────┘
```

### **Submissions List Page**

```tsx
┌──────────────────────────────────────────────────────────┐
│  📋 Pendaftar SPMB 2025                                  │
├──────────────────────────────────────────────────────────┤
│  [Search...]  [Status ▼]  [Jalur ▼]  [Gelombang ▼]     │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ SPMB-2025-001 │ Ahmad Rizki      │ Reguler │ ⏱️     │ │
│  │ 085xxx        │ SD Negeri 1      │ Gel 1   │ Review │ │
│  ├────────────────────────────────────────────────────┤ │
│  │ SPMB-2025-002 │ Siti Aminah      │ Prestasi│ ✅     │ │
│  │ 081xxx        │ MI Al-Ikhlas     │ Gel 1   │ Approve│ │
│  ├────────────────────────────────────────────────────┤ │
│  │ SPMB-2025-003 │ Budi Santoso     │ Reguler │ ⏱️     │ │
│  │ 082xxx        │ SD Muhammadiyah  │ Gel 2   │ Pending│ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  [Export Excel]  [Export PDF]  [Bulk Actions ▼]         │
└──────────────────────────────────────────────────────────┘
```

---

## 🎯 **QUICK START - MULAI SEKARANG**

### **Option 1: Full Implementation** (Recommended)
Saya akan build complete system dalam 1 session:
- Database schema
- All API endpoints
- Form builder page
- Update signup form
- Update admin admissions
- File upload
- Testing

**Timeline: 10-14 jam total, bisa split jadi 2-3 session**

### **Option 2: Step by Step**
Kita mulai dari mana dulu:
1. **Database & API** (Foundation first)
2. **Form Builder UI** (Admin tools)
3. **Signup Integration** (Public form)
4. **Admin Dashboard** (View submissions)
5. **File Upload** (Advanced feature)

### **Option 3: MVP (Minimum Viable Product)**
Quick implementation untuk test concept:
- Simple form config in database
- Basic submission save
- Show in admin dashboard
- **Timeline: 3-4 jam**

---

## 🤔 **PERTANYAAN UNTUK ANDA:**

1. **Mau mulai yang mana?**
   - [ ] Full implementation (10-14 jam, complete)
   - [ ] Step by step (mulai dari database)
   - [ ] MVP quick test (3-4 jam)

2. **File upload strategy?**
   - [ ] Local storage (`/public/uploads/`)
   - [ ] Cloud storage (MinIO/S3/Cloudinary)
   - [ ] Skip dulu (focus on form data)

3. **Additional features needed?**
   - [ ] Email notifications
   - [ ] SMS notifications
   - [ ] PDF export
   - [ ] Batch operations
   - [ ] Custom fields (admin bisa tambah field baru)

4. **Timeline preference?**
   - [ ] ASAP (1-2 hari intensive)
   - [ ] Gradual (1 minggu, 2-3 jam/hari)
   - [ ] Flexible

---

## 🚀 **READY TO START?**

**Bilang salah satu:**
- "Mulai full implementation" - Saya akan build semua
- "Mulai dari database" - Step by step approach
- "Buat MVP dulu" - Quick test version
- "Tunjukkan code example" - Preview dulu sebelum mulai

**Atau custom request:**
- "Saya mau fokus ke [specific feature]"
- "Buat [feature] dulu baru [feature lain]"

**Tinggal bilang, dan saya langsung coding! 💪**

---

*Roadmap: Dynamic Form Builder & Integration*  
*For: v0-website-for-school*  
*Date: October 9, 2025*  
*Status: Ready to Implement* 🚀

