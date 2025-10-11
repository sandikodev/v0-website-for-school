# 📋 Sistem Interview Terintegrasi dengan Google Forms

## 🎯 Overview

Dokumentasi ini menjelaskan implementasi sistem interview terintegrasi dengan Google Forms untuk website sekolah. Sistem ini memungkinkan admin dan tim penerimaan siswa baru untuk mengelola, memfilter, dan menganalisis hasil interview dengan mudah melalui dashboard.

## 🏗️ Arsitektur Sistem

### Database Schema

Sistem menggunakan 3 tabel utama:

#### 1. InterviewType
```prisma
model InterviewType {
  id              String            @id @default(cuid())
  name            String            @unique
  description     String?
  googleFormUrl   String?
  isRequired      Boolean           @default(false)
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt
  interviewSessions InterviewSession[]
  @@map("interview_types")
}
```

#### 2. InterviewSession
```prisma
model InterviewSession {
  id                String            @id @default(cuid())
  submissionId      String
  interviewTypeId   String
  status            String            @default("PENDING")
  scheduledDate     DateTime?
  completedDate     DateTime?
  notes             String?           @db.Text
  reviewerId        String?
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt
  submission        FormSubmission    @relation(fields: [submissionId], references: [id])
  interviewType     InterviewType     @relation(fields: [interviewTypeId], references: [id])
  interviewResults  InterviewResult[]
  @@map("interview_sessions")
}
```

#### 3. InterviewResult
```prisma
model InterviewResult {
  id                String            @id @default(cuid())
  interviewSessionId String
  question          String
  answer            String            @db.Text
  score             Int?
  feedback          String?           @db.Text
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt
  interviewSession  InterviewSession  @relation(fields: [interviewSessionId], references: [id])
  @@map("interview_results")
}
```

## 🔄 Workflow Sistem

### 1. Setup Interview Types
- Admin membuat jenis interview (Diniyah, Akademik, Psikologis, dll)
- Setiap jenis memiliki link Google Forms yang unik
- Dapat ditandai sebagai required atau optional

### 2. Assignment Interview
- Sistem otomatis membuat InterviewSession untuk setiap pendaftar
- Status awal: PENDING
- Admin dapat menjadwalkan tanggal interview

### 3. Interview Process
- Pendaftar mengisi Google Forms sesuai jenis interview
- Data hasil interview diimport ke sistem (manual atau otomatis)
- Status berubah menjadi COMPLETED

### 4. Review & Analysis
- Admin dapat melihat hasil interview di dashboard
- Filter berdasarkan status, jenis, tanggal, dll
- Export data untuk analisis lebih lanjut

## 🎨 Komponen UI

### 1. Dashboard Interview Management
**Lokasi**: `/dashboard/admissions?tab=interview`

**Fitur**:
- 📊 Statistik interview (total, pending, completed, failed)
- 🔍 Filter dan pencarian
- 📋 Tabel sesi interview
- 📤 Import/Export data
- ⚙️ Manajemen jenis interview

**Komponen**: `components/dashboard/interview-management.tsx`

### 2. Interview Notifications (Registrar)
**Lokasi**: `/registrar?id=<registration_number>`

**Fitur**:
- 🔔 Notifikasi interview yang perlu diselesaikan
- 🔗 Link langsung ke Google Forms
- ⏰ Countdown deadline
- ✅ Status interview real-time

**Komponen**: `components/registrar/interview-notification.tsx`

## 🔌 API Endpoints

### Interview Types
```
GET    /api/interview/types          # Daftar semua jenis interview
POST   /api/interview/types          # Buat jenis interview baru
GET    /api/interview/types?required=true  # Filter required types
```

### Interview Sessions
```
GET    /api/interview/sessions       # Daftar sesi interview
POST   /api/interview/sessions       # Buat sesi interview baru
GET    /api/interview/sessions?submissionId=<id>  # Filter by submission
GET    /api/interview/sessions?status=<status>     # Filter by status
```

### Interview Results
```
GET    /api/interview/results        # Daftar hasil interview
POST   /api/interview/results        # Tambah hasil interview
GET    /api/interview/results?interviewSessionId=<id>  # Filter by session
```

## 📱 Demo Frontend

### Cara Mengakses Demo:

1. **Dashboard Interview Management**:
   ```
   http://localhost:3000/dashboard/admissions?tab=interview
   ```

2. **Interview Notifications (Registrar)**:
   ```
   http://localhost:3000/registrar?id=SPMB-2025-2007
   ```

### Data Demo yang Tersedia:

#### Interview Types:
- Interview Diniyah (Required)
- Interview Akademik (Required) 
- Interview Psikologis (Optional)
- Interview Wawancara Orang Tua (Optional)

#### Sample Sessions:
- Ahmad Fauzi (SPMB-2025-2007): Diniyah (Pending), Psikologis (Reviewed)
- Siti Rahma (SPMB-2025-5790): Diniyah (Completed), Akademik (Pending)

## 🛠️ Implementasi Teknis

### 1. Database Migration
```bash
# Jalankan migration untuk menambahkan tabel interview
npx prisma migrate dev --name add-interview-tables
```

### 2. Seed Data
```bash
# Tambahkan data sample untuk testing
npx prisma db seed
```

### 3. Google Forms Integration

#### Manual Import (Current)
1. Download CSV dari Google Forms
2. Upload melalui dashboard
3. System processes dan stores data

#### Automated Import (Future)
1. Google Forms API integration
2. Webhook untuk real-time updates
3. Automatic data synchronization

### 4. Status Management
```typescript
type InterviewStatus = 
  | "PENDING"     // Menunggu interview
  | "COMPLETED"    // Interview selesai
  | "REVIEWED"     // Sudah ditinjau admin
  | "FAILED"       // Tidak lulus
  | "RESCHEDULED"  // Diundur
```

## 🎯 Fitur Utama

### ✅ Sudah Diimplementasi (Demo)
- [x] Database schema design
- [x] Dashboard interview management UI
- [x] Registrar interview notifications UI
- [x] Mock API endpoints
- [x] Filter dan search functionality
- [x] Status management
- [x] Responsive design

### 🚧 Perlu Diimplementasi (Production)
- [ ] Database migration scripts
- [ ] Real API integration dengan database
- [ ] Google Forms CSV import functionality
- [ ] Email notifications untuk interview
- [ ] Advanced filtering dan analytics
- [ ] Export functionality (PDF, Excel)
- [ ] Bulk operations (assign, update status)
- [ ] Interview scheduling calendar
- [ ] Real-time notifications

## 🔧 Konfigurasi

### Environment Variables
```env
# Google Forms Integration (Future)
GOOGLE_FORMS_API_KEY=your_api_key
GOOGLE_FORMS_CLIENT_ID=your_client_id
GOOGLE_FORMS_CLIENT_SECRET=your_client_secret

# Email Notifications
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### Google Forms Setup
1. Buat Google Form untuk setiap jenis interview
2. Set response collection ke spreadsheet
3. Configure sharing permissions
4. Copy form URL ke sistem

## 📊 Analytics & Reporting

### Dashboard Metrics
- Total interview sessions
- Completion rate per type
- Average scores per question
- Timeline analysis
- Reviewer performance

### Export Options
- CSV untuk analisis data
- PDF reports untuk management
- Excel dengan charts
- JSON untuk API integration

## 🔒 Security Considerations

### Data Protection
- Encrypt sensitive interview data
- Role-based access control
- Audit logs untuk semua actions
- GDPR compliance untuk data privacy

### Google Forms Security
- Secure form sharing
- Response validation
- Anti-spam measures
- Data retention policies

## 🚀 Deployment Checklist

### Pre-deployment
- [ ] Database migration tested
- [ ] API endpoints tested
- [ ] UI components responsive
- [ ] Error handling implemented
- [ ] Loading states added

### Post-deployment
- [ ] Monitor API performance
- [ ] Check error logs
- [ ] Verify data integrity
- [ ] Test email notifications
- [ ] Validate Google Forms integration

## 👥 Team Development Notes

### Frontend Developer
- Focus pada UI/UX consistency
- Implement responsive design
- Add loading states dan error handling
- Optimize performance

### Backend Developer  
- Implement real database integration
- Add data validation
- Implement caching strategies
- Add API rate limiting

### DevOps Engineer
- Setup monitoring dan logging
- Configure backup strategies
- Implement CI/CD pipeline
- Setup staging environment

## 📞 Support & Maintenance

### Monitoring
- API response times
- Database query performance
- Error rates dan exceptions
- User activity metrics

### Maintenance Tasks
- Regular database cleanup
- Update Google Forms URLs
- Monitor storage usage
- Performance optimization

---

## 📝 Next Steps

1. **Immediate (Week 1-2)**:
   - Implement real database integration
   - Add CSV import functionality
   - Test dengan data real

2. **Short-term (Month 1)**:
   - Email notification system
   - Advanced filtering
   - Export functionality

3. **Long-term (Month 2-3)**:
   - Google Forms API integration
   - Real-time notifications
   - Mobile app integration

---

*Dokumentasi ini akan terus diupdate sesuai perkembangan implementasi sistem.*
