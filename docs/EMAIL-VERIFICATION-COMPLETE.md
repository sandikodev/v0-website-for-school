# Complete Email Verification System

## 🎯 Overview

**AkseSekolah.id menggunakan email-based verification untuk memastikan hanya institusi pendidikan resmi yang dapat mendaftar.**

---

## 📧 Allowed Email Domains

### Tier 1: Government-Backed (Belajar.id) - Auto-Approved ✅

```
Pattern: nama@guru.{schooltype}.belajar.id

Valid Examples:
✅ john@guru.smp.belajar.id
✅ jane@guru.sd.belajar.id
✅ admin@guru.sma.belajar.id
✅ kepala@guru.smk.belajar.id

Verification:
- Automatic (no manual review)
- Government-backed (Kemendikbud)
- Instant approval
- Full platform access

Why Trusted:
- Email issued by Kemendikbud
- Only teachers get guru.* subdomain
- Cannot be faked
- Already verified by government
```

### Tier 2: Private Schools (sch.id) - Manual Verification ⚠️

```
Pattern: nama@{schoolname}.sch.id

Valid Examples:
✅ admin@smpitmasjidsyuhada.sch.id
✅ kepala@sdmuhammadiyah.sch.id
✅ guru@smacatholic.sch.id
✅ admin@smknu.sch.id

Verification Required:
- Official letter from school
- School registration document (NPSN)
- Principal signature
- School stamp

Process:
1. User registers with sch.id email
2. Upload official letter
3. Admin reviews (1-3 business days)
4. Approval/rejection notification
5. If approved, full platform access

Why Manual Review:
- sch.id domain can be purchased by anyone
- Need to verify actual school affiliation
- Prevent fraud
- Maintain platform quality
```

### Tier 3: Not Allowed ❌

```
Generic Email Providers:
❌ john@gmail.com
❌ admin@yahoo.com
❌ school@outlook.com
❌ teacher@hotmail.com

Student Emails (belajar.id without guru):
❌ student@smp.belajar.id
❌ siswa@sd.belajar.id
❌ murid@sma.belajar.id

Other Domains:
❌ Any other domain not listed above
```

---

## 🔄 Registration Flow

### Flow 1: Belajar.id (Auto-Approved)

```
1. User visits: aksesekolah.id/signup
   ↓
2. Enter email: john@guru.smp.belajar.id
   ↓
3. System validates:
   - Contains "guru" subdomain? ✅
   - Domain is belajar.id? ✅
   ↓
4. Send verification code to email
   ↓
5. User enters code
   ↓
6. Request school details:
   - School name
   - NPSN
   - Address
   - Phone
   ↓
7. Check Awan Kinton: Organization exists for this school?
   ├─ YES → Add user to existing organization
   │        (Other teachers already registered)
   └─ NO → Create new organization
            (First teacher from this school)
   ↓
8. Account created! ✅
   Redirect to: dashboard.aksesekolah.id/dashboard/tenant
   
Note: Organization creation works for BOTH belajar.id and sch.id emails!
```

### Flow 2: sch.id (Manual Verification)

```
1. User visits: aksesekolah.id/signup
   ↓
2. Enter email: admin@smpitmasjidsyuhada.sch.id
   ↓
3. System validates:
   - Domain is sch.id? ✅
   - Show: "Manual verification required"
   ↓
4. Send verification code to email
   ↓
5. User enters code
   ↓
6. Request school details + documents:
   - School name
   - NPSN
   - Address
   - Phone
   - Official letter (PDF/Image) ⚠️ REQUIRED
   - School registration document
   ↓
7. Submit for review
   ↓
8. Admin reviews (1-3 business days)
   ├─ APPROVED → Account activated
   │             Check Awan Kinton: Organization exists?
   │             ├─ YES → Add to existing org
   │             └─ NO → Create new org
   │             Email notification sent
   │             Redirect to dashboard
   │
   └─ REJECTED → Email notification with reason
                 Can resubmit with corrections
                 
Note: Organization creation works for BOTH belajar.id and sch.id emails!
```

### Flow 3: Invalid Email (Rejected)

```
1. User visits: aksesekolah.id/signup
   ↓
2. Enter email: john@gmail.com
   ↓
3. System validates:
   - Domain is belajar.id? ❌
   - Domain is sch.id? ❌
   ↓
4. Show error:
   "Email tidak valid. Gunakan email:
    - guru.{schooltype}.belajar.id (guru)
    - {schoolname}.sch.id (sekolah swasta)"
   ↓
5. Cannot proceed
```

---

## 💻 Implementation

### Email Validation Logic

```typescript
// lib/validation/email-validator.ts

export type EmailValidationResult = {
  valid: boolean;
  tier: 'belajar' | 'sch' | 'invalid';
  schoolType?: 'SD' | 'SMP' | 'SMA' | 'SMK';
  requiresManualVerification: boolean;
  error?: string;
};

export function validateSchoolEmail(email: string): EmailValidationResult {
  // Tier 1: Belajar.id (guru subdomain)
  const belajarPattern = /^[a-zA-Z0-9._%+-]+@guru\.(sd|smp|sma|smk)\.belajar\.id$/i;
  const belajarMatch = email.match(belajarPattern);
  
  if (belajarMatch) {
    return {
      valid: true,
      tier: 'belajar',
      schoolType: belajarMatch[1].toUpperCase() as 'SD' | 'SMP' | 'SMA' | 'SMK',
      requiresManualVerification: false
    };
  }
  
  // Tier 2: sch.id (requires manual verification)
  const schPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.sch\.id$/i;
  const schMatch = email.match(schPattern);
  
  if (schMatch) {
    return {
      valid: true,
      tier: 'sch',
      requiresManualVerification: true
    };
  }
  
  // Tier 3: Invalid
  return {
    valid: false,
    tier: 'invalid',
    requiresManualVerification: false,
    error: 'Email harus menggunakan domain guru.{sd|smp|sma|smk}.belajar.id atau {sekolah}.sch.id'
  };
}

// Usage Examples
const result1 = validateSchoolEmail('john@guru.smp.belajar.id');
// { valid: true, tier: 'belajar', schoolType: 'SMP', requiresManualVerification: false }

const result2 = validateSchoolEmail('admin@smpitmasjidsyuhada.sch.id');
// { valid: true, tier: 'sch', requiresManualVerification: true }

const result3 = validateSchoolEmail('john@gmail.com');
// { valid: false, tier: 'invalid', error: '...' }
```

### Registration API

```typescript
// app/api/auth/register/route.ts

export async function POST(request: NextRequest) {
  const { email, password, ...otherData } = await request.json();
  
  // Validate email
  const validation = validateSchoolEmail(email);
  
  if (!validation.valid) {
    return NextResponse.json(
      { error: validation.error },
      { status: 400 }
    );
  }
  
  // Send verification code
  await sendVerificationCode(email);
  
  // Store pending registration
  await storePendingRegistration({
    email,
    tier: validation.tier,
    requiresManualVerification: validation.requiresManualVerification,
    schoolType: validation.schoolType,
    ...otherData
  });
  
  return NextResponse.json({
    success: true,
    requiresManualVerification: validation.requiresManualVerification,
    message: validation.requiresManualVerification
      ? 'Pendaftaran Anda akan direview dalam 1-3 hari kerja'
      : 'Kode verifikasi telah dikirim ke email Anda'
  });
}
```

### Admin Review Dashboard

```typescript
// app/(platform)/dashboard/admin/verifications/page.tsx

export default async function VerificationsPage() {
  const pendingVerifications = await getPendingVerifications();
  
  return (
    <div>
      <h1>Pending Verifications</h1>
      
      {pendingVerifications.map(verification => (
        <VerificationCard
          key={verification.id}
          email={verification.email}
          schoolName={verification.schoolName}
          npsn={verification.npsn}
          documents={verification.documents}
          onApprove={() => approveVerification(verification.id)}
          onReject={(reason) => rejectVerification(verification.id, reason)}
        />
      ))}
    </div>
  );
}
```

---

## 🔐 Security Considerations

### Belajar.id Verification

```
Security Level: HIGH ✅

Why Secure:
- Government-issued email
- Only teachers get guru.* subdomain
- Cannot be purchased or faked
- Already verified by Kemendikbud
- Trusted source

Risk: VERY LOW
```

### sch.id Verification

```
Security Level: MEDIUM ⚠️

Why Manual Review Needed:
- sch.id domain can be purchased by anyone
- Need to verify actual school affiliation
- Prevent fraud attempts
- Maintain platform quality

Verification Checklist:
✅ Official letter with school letterhead
✅ Principal signature
✅ School stamp
✅ NPSN matches school name
✅ Contact information verifiable
✅ School exists in Kemendikbud database

Risk: MEDIUM (mitigated by manual review)
```

---

## 📊 Statistics & Monitoring

### Metrics to Track

```
Registration Attempts:
- Total attempts
- Belajar.id (auto-approved)
- sch.id (manual review)
- Invalid emails (rejected)

Approval Rate:
- sch.id approvals
- sch.id rejections
- Average review time

Fraud Detection:
- Suspicious patterns
- Duplicate attempts
- Fake documents
```

---

## 🎯 User Communication

### Email Templates

#### Belajar.id - Welcome Email

```
Subject: Selamat Datang di AkseSekolah.id!

Halo [Name],

Selamat! Akun Anda telah berhasil dibuat.

Email: [email]
Sekolah: [school_name]
Akses: dashboard.aksesekolah.id

Anda dapat langsung login dan mulai menggunakan platform.

Terima kasih,
Tim AkseSekolah.id
```

#### sch.id - Pending Review

```
Subject: Pendaftaran Anda Sedang Direview

Halo [Name],

Terima kasih telah mendaftar di AkseSekolah.id.

Pendaftaran Anda sedang dalam proses review oleh tim kami.
Kami akan menghubungi Anda dalam 1-3 hari kerja.

Dokumen yang kami terima:
- Surat pengantar resmi: ✅
- NPSN: [npsn]

Jika ada pertanyaan, hubungi: support@aksesekolah.id

Terima kasih,
Tim AkseSekolah.id
```

#### sch.id - Approved

```
Subject: Akun Anda Telah Disetujui!

Halo [Name],

Selamat! Pendaftaran Anda telah disetujui.

Email: [email]
Sekolah: [school_name]
Akses: dashboard.aksesekolah.id

Anda sekarang dapat login dan mulai menggunakan platform.

Terima kasih,
Tim AkseSekolah.id
```

#### sch.id - Rejected

```
Subject: Pendaftaran Memerlukan Perbaikan

Halo [Name],

Mohon maaf, pendaftaran Anda memerlukan perbaikan.

Alasan:
[rejection_reason]

Anda dapat mendaftar ulang dengan dokumen yang lengkap.

Jika ada pertanyaan, hubungi: support@aksesekolah.id

Terima kasih,
Tim AkseSekolah.id
```

---

## 📋 Implementation Checklist

### Phase 1: Email Validation
- [ ] Implement validateSchoolEmail()
- [ ] Add belajar.id pattern check
- [ ] Add sch.id pattern check
- [ ] Add error messages
- [ ] Unit tests

### Phase 2: Registration Flow
- [ ] Update signup form
- [ ] Add document upload (sch.id)
- [ ] Implement verification code
- [ ] Store pending registrations
- [ ] Email notifications

### Phase 3: Admin Review
- [ ] Admin verification dashboard
- [ ] Approve/reject functionality
- [ ] Document viewer
- [ ] NPSN validation
- [ ] Audit logs

### Phase 4: Integration
- [ ] Awan Kinton organization creation
- [ ] Email templates
- [ ] Monitoring & analytics
- [ ] Support system

---

## 🎯 Benefits

### For Platform
```
✅ Only verified schools
✅ High-quality user base
✅ Fraud prevention
✅ Government alignment
✅ Professional reputation
```

### For Schools
```
✅ Easy registration (belajar.id)
✅ Alternative for private schools (sch.id)
✅ Trusted platform
✅ Secure environment
✅ Professional service
```

### For Users
```
✅ Know all schools are verified
✅ Trust in platform
✅ Safe environment
✅ Quality assurance
```

---

## ✅ Conclusion

**Two-tier email verification system:**

1. **Belajar.id (guru.*)**: Auto-approved, government-backed
2. **sch.id**: Manual verification, private schools

**This ensures:**
- ✅ Only legitimate schools can register
- ✅ Government schools get instant access
- ✅ Private schools can still join (with verification)
- ✅ Platform maintains high quality
- ✅ Fraud prevention

**Perfect balance between accessibility and security!** 🎯
