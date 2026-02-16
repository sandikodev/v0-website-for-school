# School Verification System

## 🎯 Core Concept: Email-Based Verification

**Menggunakan email guru.belajar.id sebagai proof of institutional affiliation**

---

## 📧 Email Belajar.id System

### Background: Belajar.id

**Belajar.id** adalah sistem email resmi dari Kemendikbud untuk ekosistem pendidikan Indonesia.

#### Email Structure

```
Student Email:
nama.siswa@smp.belajar.id
nama.siswa@sd.belajar.id
nama.siswa@sma.belajar.id
nama.siswa@smk.belajar.id

Teacher Email (VERIFIED):
nama.guru@guru.smp.belajar.id
nama.guru@guru.sd.belajar.id
nama.guru@guru.sma.belajar.id
nama.guru@guru.smk.belajar.id
```

### Key Difference

```
❌ Student Email: nama@smp.belajar.id
   - No "guru" subdomain
   - Cannot register school account
   - Personal use only

✅ Teacher Email: nama@guru.smp.belajar.id
   - Has "guru" subdomain
   - Can register school account
   - Institutional authority
```

---

## 🔐 Verification Flow

### Registration Process

```
1. User visits aksesekolah.id/register
   ↓
2. Enter email: nama@guru.smp.belajar.id
   ↓
3. System validates email pattern
   ↓
4. Check: Contains "guru" subdomain?
   ↓
   ├─ YES → Proceed to school registration
   │         ↓
   │         Extract school info from email
   │         (smp.belajar.id → SMP)
   │         ↓
   │         Request school details
   │         ↓
   │         Create school account
   │
   └─ NO → Show error
           "Gunakan email guru.belajar.id untuk mendaftar"
```

### Email Validation Logic

```typescript
// lib/validation/email-validator.ts

export function validateSchoolEmail(email: string): {
  valid: boolean;
  schoolType?: string;
  error?: string;
} {
  // Pattern: nama@guru.{schooltype}.belajar.id
  const pattern = /^[a-zA-Z0-9._%+-]+@guru\.(sd|smp|sma|smk)\.belajar\.id$/i;
  
  const match = email.match(pattern);
  
  if (!match) {
    return {
      valid: false,
      error: "Email harus menggunakan format guru.{sd|smp|sma|smk}.belajar.id"
    };
  }
  
  return {
    valid: true,
    schoolType: match[1].toUpperCase() // SD, SMP, SMA, SMK
  };
}

// Usage
const result = validateSchoolEmail("john@guru.smp.belajar.id");
// { valid: true, schoolType: "SMP" }

const result2 = validateSchoolEmail("student@smp.belajar.id");
// { valid: false, error: "..." }
```

---

## 🏢 Awan Kinton Organization System

### Concept: GitHub-Style Organizations

```
Similar to GitHub Organizations:
- Organization = School/Institution
- Members = Teachers/Staff
- Projects = Services/Websites
- Billing = Centralized
- Permissions = Role-based
```

### Organization Structure

```
Organization: SMP Negeri 1 Jakarta
├── Owner: kepala.sekolah@guru.smp.belajar.id
├── Admins:
│   ├── wakil.kepala@guru.smp.belajar.id
│   └── admin.sekolah@guru.smp.belajar.id
├── Members:
│   ├── guru.matematika@guru.smp.belajar.id
│   ├── guru.bahasa@guru.smp.belajar.id
│   └── guru.ipa@guru.smp.belajar.id
├── Services:
│   ├── Website (aksesekolah.id)
│   ├── Email Hosting
│   ├── Cloud Storage
│   └── Database
└── Billing:
    └── Centralized invoice
```

---

## 🔄 Integration Flow: AkseSekolah.id ↔ Awan Kinton

### Seamless Organization Creation

```
User registers at AkseSekolah.id
  ↓
Email: john@guru.smp.belajar.id
  ↓
AkseSekolah.id validates email
  ↓
Extract school info: SMP
  ↓
Check Awan Kinton: Organization exists?
  ↓
  ├─ YES → Link to existing organization
  │        ↓
  │        Add user as member
  │        ↓
  │        Grant access to school resources
  │
  └─ NO → Create new organization
           ↓
           Request school details:
           - School name
           - NPSN (National School ID)
           - Address
           - Phone
           - Official letter (optional for verification)
           ↓
           Create organization at Awan Kinton
           ↓
           Set user as organization owner
           ↓
           Provision resources
           ↓
           Done! School account ready
```

### API Integration

```typescript
// lib/awan-kinton/organization.ts

interface OrganizationData {
  name: string;
  npsn: string;
  schoolType: 'SD' | 'SMP' | 'SMA' | 'SMK';
  address: string;
  phone: string;
  email: string;
  ownerEmail: string;
}

export async function createOrganization(data: OrganizationData) {
  // Call Awan Kinton API
  const response = await fetch('https://api.awankinton.id/v1/organizations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.AWAN_KINTON_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: data.name,
      type: 'education',
      metadata: {
        npsn: data.npsn,
        schoolType: data.schoolType,
        address: data.address,
        phone: data.phone,
        verifiedEmail: data.ownerEmail
      },
      owner: {
        email: data.ownerEmail
      }
    })
  });
  
  return response.json();
}

export async function checkOrganization(email: string) {
  // Extract school identifier from email
  const schoolId = extractSchoolId(email);
  
  // Check if organization exists
  const response = await fetch(
    `https://api.awankinton.id/v1/organizations/by-email/${schoolId}`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.AWAN_KINTON_API_KEY}`
      }
    }
  );
  
  if (response.status === 404) {
    return null; // Organization doesn't exist
  }
  
  return response.json();
}
```

---

## 📋 Registration Form

### Step 1: Email Verification

```typescript
// components/auth/EmailVerification.tsx

export function EmailVerification() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate email
    const validation = validateSchoolEmail(email);
    
    if (!validation.valid) {
      setError(validation.error);
      return;
    }
    
    // Send verification code
    await sendVerificationCode(email);
    
    // Proceed to next step
    router.push('/register/verify');
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <h2>Daftar dengan Email Guru Belajar.id</h2>
      
      <input
        type="email"
        placeholder="nama@guru.smp.belajar.id"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      
      {error && <p className="error">{error}</p>}
      
      <button type="submit">Lanjutkan</button>
      
      <div className="help">
        <p>Gunakan email guru belajar.id Anda</p>
        <p>Format: nama@guru.[sd|smp|sma|smk].belajar.id</p>
      </div>
    </form>
  );
}
```

### Step 2: School Details

```typescript
// components/auth/SchoolDetails.tsx

export function SchoolDetails() {
  const [formData, setFormData] = useState({
    schoolName: '',
    npsn: '',
    address: '',
    phone: '',
    officialLetter: null as File | null
  });
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Check if organization exists at Awan Kinton
    const org = await checkOrganization(userEmail);
    
    if (org) {
      // Organization exists, link user
      await linkToOrganization(org.id, userEmail);
    } else {
      // Create new organization
      await createOrganization({
        ...formData,
        ownerEmail: userEmail,
        schoolType: extractSchoolType(userEmail)
      });
    }
    
    // Complete registration
    router.push('/dashboard');
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <h2>Detail Sekolah</h2>
      
      <input
        type="text"
        placeholder="Nama Sekolah"
        value={formData.schoolName}
        onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
        required
      />
      
      <input
        type="text"
        placeholder="NPSN (Nomor Pokok Sekolah Nasional)"
        value={formData.npsn}
        onChange={(e) => setFormData({...formData, npsn: e.target.value})}
        required
      />
      
      <textarea
        placeholder="Alamat Lengkap"
        value={formData.address}
        onChange={(e) => setFormData({...formData, address: e.target.value})}
        required
      />
      
      <input
        type="tel"
        placeholder="Nomor Telepon"
        value={formData.phone}
        onChange={(e) => setFormData({...formData, phone: e.target.value})}
        required
      />
      
      <div className="file-upload">
        <label>Surat Tugas/Pengantar (Opsional)</label>
        <input
          type="file"
          accept=".pdf,.jpg,.png"
          onChange={(e) => setFormData({
            ...formData, 
            officialLetter: e.target.files?.[0] || null
          })}
        />
        <p className="help">
          Upload surat resmi dari sekolah untuk verifikasi lebih cepat
        </p>
      </div>
      
      <button type="submit">Buat Akun Sekolah</button>
    </form>
  );
}
```

---

## 🎯 Benefits of This System

### 1. Automatic Verification
```
✅ Email guru.belajar.id = Verified teacher
✅ No manual verification needed
✅ Government-backed authentication
✅ Trusted by Kemendikbud
```

### 2. Seamless Organization Management
```
✅ Auto-create organization at Awan Kinton
✅ Teachers can join existing organization
✅ Centralized billing & management
✅ Role-based permissions
```

### 3. Collective Benefits
```
✅ Shared resources (storage, bandwidth)
✅ Volume discounts
✅ Centralized support
✅ Easier collaboration
```

### 4. Fraud Prevention
```
✅ Only verified teachers can register
✅ Email domain controlled by Kemendikbud
✅ Cannot fake institutional affiliation
✅ Audit trail via email
```

---

## 🔮 Future Enhancements

### 1. Multi-School Teachers
```
Teacher works at multiple schools:
- john@guru.smp.belajar.id (School A)
- john@guru.sma.belajar.id (School B)

Solution:
- Link both emails to one account
- Switch between organizations
- Separate billing per school
```

### 2. Non-Belajar.id Schools
```
Private schools without belajar.id:
- Use alternative verification
- Upload official documents
- Manual verification by admin
- Still create organization
```

### 3. Organization Invitations
```
School admin invites teachers:
- Send invitation link
- Teacher signs up with any email
- Admin approves
- Added to organization
```

### 4. Organization Analytics
```
Dashboard for school:
- Total members
- Resource usage
- Cost breakdown
- Activity logs
```

---

## 📊 Verification Statistics

### Success Metrics
```
- Email verification rate: Target >95%
- Organization creation time: <5 minutes
- False positive rate: <1%
- User satisfaction: >90%
```

### Monitoring
```
Track:
- Verification attempts
- Success/failure rate
- Common errors
- Support tickets
```

---

## 🚨 Edge Cases & Solutions

### Case 1: Email Not Recognized
```
Problem: Email format correct but not in system

Solution:
- Show helpful error message
- Suggest contacting school admin
- Provide alternative verification
- Support ticket option
```

### Case 2: Organization Already Exists
```
Problem: Teacher tries to create duplicate org

Solution:
- Detect existing organization
- Show "Organization exists"
- Offer to join existing org
- Contact current owner
```

### Case 3: Invalid NPSN
```
Problem: NPSN doesn't match school name

Solution:
- Validate against Kemendikbud database
- Show warning if mismatch
- Allow override with explanation
- Flag for manual review
```

### Case 4: Multiple Owners
```
Problem: Two teachers claim to be owner

Solution:
- First registrant = owner
- Others = members
- Owner can transfer ownership
- Admin can resolve disputes
```

---

## 🔐 Security Considerations

### Email Verification
```
✅ Send verification code to email
✅ Time-limited code (15 minutes)
✅ Rate limiting (3 attempts)
✅ IP tracking
```

### Organization Security
```
✅ Owner approval for new members
✅ Role-based access control
✅ Audit logs
✅ 2FA for sensitive actions
```

### Data Privacy
```
✅ GDPR compliance
✅ Data encryption
✅ Access logs
✅ Right to deletion
```

---

## 📋 Implementation Checklist

### Phase 1: Email Verification
- [ ] Email validation logic
- [ ] Verification code system
- [ ] Error handling
- [ ] UI/UX for registration

### Phase 2: Awan Kinton Integration
- [ ] API client
- [ ] Organization creation
- [ ] Organization lookup
- [ ] Member management

### Phase 3: School Details
- [ ] NPSN validation
- [ ] Document upload
- [ ] Manual verification workflow
- [ ] Admin dashboard

### Phase 4: Organization Features
- [ ] Member invitation
- [ ] Role management
- [ ] Resource allocation
- [ ] Billing integration

---

## ✅ Conclusion

**Email-based verification using guru.belajar.id is brilliant because:**

1. ✅ **Trusted**: Government-backed email system
2. ✅ **Automatic**: No manual verification needed
3. ✅ **Scalable**: Works for all schools in Indonesia
4. ✅ **Secure**: Cannot be faked or spoofed
5. ✅ **Seamless**: Integrates with Awan Kinton organizations

**Combined with Awan Kinton organization system:**
- ✅ GitHub-style collaboration
- ✅ Centralized management
- ✅ Collective benefits
- ✅ Professional structure

**This creates a robust, scalable, and trustworthy platform for Indonesian schools.**

---

**Powered by Belajar.id (Kemendikbud) + Awan Kinton (Koneksi Cloud)**
