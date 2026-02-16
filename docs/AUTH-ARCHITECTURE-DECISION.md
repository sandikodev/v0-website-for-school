# Authentication Architecture Decision

## 🎯 Pertanyaan Kunci
**Dimana sebaiknya menaruh Dashboard, Signin, dan Signup?**
- Option A: Di `(www)` - Platform level
- Option B: Di `[jajal]` - Tenant level
- Option C: Hybrid - Keduanya

---

## 📊 Analisis Mendalam

### Skenario 1: Platform-Level Auth (www)
```
URL Pattern:
- aksesekolah.id/signin → Platform login
- aksesekolah.id/signup → Platform signup
- aksesekolah.id/dashboard → Platform dashboard
```

#### ✅ Kelebihan:
1. **Single Sign-On (SSO) Natural**
   - User login sekali, akses semua tenant
   - Cookie domain: `.aksesekolah.id`
   - Shared session antar tenant

2. **Centralized User Management**
   - Satu database user untuk semua tenant
   - Mudah manage permissions cross-tenant
   - User bisa pindah tenant tanpa re-login

3. **Simpler Architecture**
   - Satu auth flow untuk semua
   - Tidak ada duplikasi kode auth
   - Easier to maintain

4. **Better for Multi-Tenant Users**
   - Admin yang manage banyak sekolah
   - User yang pindah sekolah
   - Platform superadmin

#### ❌ Kekurangan:
1. **Branding Confusion**
   - User login di platform, bukan di sekolah mereka
   - Tidak ada tenant branding di auth pages
   - Kurang personal untuk end-user

2. **URL Tidak Intuitif**
   - Siswa harus ingat `aksesekolah.id/signin`
   - Bukan `smp-syuhada.sch.id/signin`
   - Extra step untuk user

3. **Tenant Isolation Lemah**
   - User bisa lihat tenant lain (jika tidak di-filter)
   - Potensi kebocoran data antar tenant
   - Perlu extra validation di setiap query

---

### Skenario 2: Tenant-Level Auth ([jajal])
```
URL Pattern:
- tenant1.aksesekolah.id/signin → Tenant 1 login
- tenant2.aksesekolah.id/signin → Tenant 2 login
- tenant1.aksesekolah.id/dashboard → Tenant 1 dashboard
```

#### ✅ Kelebihan:
1. **Perfect Branding**
   - Auth pages dengan logo & warna sekolah
   - User merasa login di sekolah mereka
   - Better UX untuk end-user

2. **Strong Tenant Isolation**
   - User hanya bisa akses tenant mereka
   - Cookie scope: `tenant1.aksesekolah.id`
   - Natural data isolation

3. **Intuitive URLs**
   - `smp-syuhada.sch.id/signin` → jelas ini login SMP Syuhada
   - User tidak perlu tahu tentang platform
   - Better for white-label

4. **Custom Auth Flow per Tenant**
   - Tenant A: Email + password
   - Tenant B: Google OAuth
   - Tenant C: LDAP integration
   - Flexibility tinggi

#### ❌ Kekurangan:
1. **No SSO Between Tenants**
   - User harus login ulang per tenant
   - Admin yang manage banyak sekolah repot
   - Multiple sessions

2. **Complex Cookie Management**
   - Cookie per subdomain
   - Sulit share session
   - Cross-domain issues

3. **Code Duplication Risk**
   - Auth logic di setiap tenant
   - Harder to maintain
   - Inconsistent behavior possible

---

### Skenario 3: Hybrid Approach (RECOMMENDED ⭐)
```
URL Pattern:
Platform Admin:
- aksesekolah.id/admin/signin → Platform admin login
- aksesekolah.id/admin/dashboard → Platform dashboard

Tenant Users:
- tenant1.aksesekolah.id/signin → Tenant login
- tenant1.aksesekolah.id/dashboard → Tenant dashboard
```

#### ✅ Kelebihan:
1. **Best of Both Worlds**
   - Platform admin: Centralized auth
   - Tenant users: Branded auth
   - Clear separation

2. **Flexible User Types**
   - Superadmin: Platform level
   - School admin: Tenant level
   - Students/Parents: Tenant level
   - Teachers: Tenant level

3. **Scalable**
   - Easy to add new user types
   - Can implement SSO later if needed
   - Tenant-specific customization

4. **Clear Mental Model**
   - Platform = Management
   - Tenant = End-users
   - No confusion

#### ❌ Kekurangan:
1. **Two Auth Systems**
   - Need to maintain both
   - More code
   - More testing

2. **User Migration Complexity**
   - If user needs access to multiple tenants
   - Need to handle cross-tenant scenarios
   - More complex permission model

---

## 🎯 Rekomendasi Berdasarkan Use Case

### Use Case 1: School Management Platform (Your Case)
**Recommended: Hybrid Approach**

**Reasoning:**
- **Platform Admin** (`aksesekolah.id/admin`)
  - Superadmin yang manage semua sekolah
  - Perlu akses cross-tenant
  - Centralized auth makes sense

- **School Staff** (`tenant.aksesekolah.id/dashboard`)
  - Guru, admin sekolah
  - Hanya perlu akses satu sekolah
  - Branded auth better UX

- **Students/Parents** (`tenant.aksesekolah.id/signin`)
  - End-users
  - Hanya satu sekolah
  - Must have tenant branding

**Implementation:**
```
app/
├── (platform)/
│   ├── (auth)/
│   │   ├── signin/         # Platform admin login
│   │   └── signup/         # Platform admin signup
│   ├── admin/
│   └── dashboard/          # Platform dashboard
│
└── [jajal]/
    ├── (auth)/
    │   ├── signin/         # Tenant user login
    │   └── signup/         # Tenant user signup
    └── dashboard/          # Tenant dashboard
```

---

### Use Case 2: Pure SaaS (e.g., Slack, Notion)
**Recommended: Platform-Level Auth**

**Reasoning:**
- Users often belong to multiple workspaces
- SSO is critical
- Centralized user management
- Workspace switching common

**Example:**
```
slack.com/signin → Login once
workspace1.slack.com → Auto-authenticated
workspace2.slack.com → Auto-authenticated
```

---

### Use Case 3: White-Label Platform
**Recommended: Tenant-Level Auth Only**

**Reasoning:**
- Each tenant is completely independent
- No platform branding visible
- Custom domains only
- No cross-tenant access

**Example:**
```
school-a.com/signin → School A login
school-b.com/signin → School B login
(No aksesekolah.id visible to users)
```

---

## 🏗️ Implementation Strategy (Hybrid)

### Phase 1: Current State Analysis
```
Current structure:
app/
├── (platform)/
│   ├── (auth)/           # ✅ Already exists
│   │   ├── signin/
│   │   └── signup/
│   └── dashboard/        # ✅ Platform dashboard
│
├── [jajal]/
│   └── dashboard/        # ⚠️ Tenant dashboard exists
│
├── login/                # ❓ Standalone login (confusing)
└── register/             # ❓ Standalone register (confusing)
```

### Phase 2: Recommended Structure
```
app/
├── (www)/
│   └── page.tsx          # Landing page only
│
├── (platform)/
│   ├── (auth)/
│   │   ├── signin/       # Platform admin login
│   │   └── signup/       # Platform admin signup (invite-only)
│   ├── admin/
│   └── dashboard/        # Platform dashboard
│
└── [jajal]/
    ├── (auth)/           # 🆕 Add this
    │   ├── signin/       # Tenant user login
    │   └── signup/       # Tenant user signup
    ├── dashboard/        # Tenant dashboard
    └── page.tsx          # Tenant homepage
```

### Phase 3: Auth Flow

#### Platform Admin Flow:
```
1. Visit: aksesekolah.id/admin
2. Not authenticated → Redirect to /admin/signin
3. Login with admin credentials
4. Check role === "admin"
5. Access granted to platform dashboard
```

#### Tenant User Flow:
```
1. Visit: syuhada.aksesekolah.id/dashboard
2. Not authenticated → Redirect to /signin (tenant-branded)
3. Login with tenant credentials
4. Check tenantId matches
5. Access granted to tenant dashboard
```

---

## 🔐 Security Considerations

### Platform-Level Auth
```typescript
// Cookie configuration
{
  domain: '.aksesekolah.id',  // Shared across subdomains
  sameSite: 'lax',
  secure: true,
  httpOnly: true
}

// Risk: User could access wrong tenant if not validated
// Mitigation: Always check tenantId in every query
```

### Tenant-Level Auth
```typescript
// Cookie configuration
{
  domain: 'tenant1.aksesekolah.id',  // Isolated per tenant
  sameSite: 'strict',
  secure: true,
  httpOnly: true
}

// Risk: No SSO between tenants
// Mitigation: Implement OAuth if needed later
```

### Hybrid Auth
```typescript
// Platform cookie
{
  name: 'platform-session',
  domain: '.aksesekolah.id',
  path: '/admin'
}

// Tenant cookie
{
  name: 'tenant-session',
  domain: 'tenant1.aksesekolah.id',
  path: '/'
}

// Benefit: Complete isolation, no cross-contamination
```

---

## 📊 Decision Matrix

| Criteria | Platform Auth | Tenant Auth | Hybrid |
|----------|--------------|-------------|--------|
| **Branding** | ❌ Poor | ✅ Excellent | ✅ Good |
| **SSO** | ✅ Easy | ❌ Hard | ⚠️ Partial |
| **Isolation** | ❌ Weak | ✅ Strong | ✅ Strong |
| **Maintenance** | ✅ Simple | ⚠️ Medium | ❌ Complex |
| **UX (End-user)** | ❌ Confusing | ✅ Clear | ✅ Clear |
| **UX (Admin)** | ✅ Convenient | ❌ Repetitive | ✅ Good |
| **Scalability** | ✅ Good | ✅ Good | ✅ Excellent |
| **White-label** | ❌ No | ✅ Yes | ✅ Yes |

---

## 🎯 Final Recommendation for AkseSekolah.id

### ⭐ Use Hybrid Approach

**Structure:**
```
Platform Admin (Superadmin):
- URL: aksesekolah.id/admin/signin
- Users: Platform administrators
- Access: All tenants
- Cookie: .aksesekolah.id

Tenant Users (School staff, students, parents):
- URL: tenant.aksesekolah.id/signin
- Users: School-specific users
- Access: Single tenant only
- Cookie: tenant.aksesekolah.id
```

**Why?**
1. ✅ Clear separation of concerns
2. ✅ Better UX for end-users (branded auth)
3. ✅ Convenient for platform admins (SSO)
4. ✅ Strong tenant isolation
5. ✅ Scalable for future features
6. ✅ Supports white-label (custom domains)

**Trade-offs:**
- ⚠️ More code to maintain (acceptable)
- ⚠️ Two auth systems (manageable)
- ⚠️ Need clear documentation (we have it!)

---

## 🚀 Migration Plan

### Step 1: Keep Current Platform Auth
```
app/(platform)/(auth)/signin → Platform admin login
app/(platform)/dashboard → Platform dashboard
```

### Step 2: Add Tenant Auth
```
app/[jajal]/(auth)/signin → Tenant user login
app/[jajal]/dashboard → Tenant dashboard
```

### Step 3: Remove Standalone Auth
```
Delete:
- app/login/
- app/register/

These are confusing and don't fit the model
```

### Step 4: Update Redirects
```typescript
// proxy.ts
if (pathname.startsWith('/admin') && !sessionToken) {
  redirect('/admin/signin');  // Platform auth
}

if (pathname.startsWith('/dashboard') && !sessionToken) {
  redirect('/signin');  // Tenant auth (tenant-branded)
}
```

---

## 📝 Implementation Checklist

- [ ] Create `app/[jajal]/(auth)/signin/page.tsx`
- [ ] Create `app/[jajal]/(auth)/signup/page.tsx`
- [ ] Add tenant branding to auth pages
- [ ] Update cookie configuration (separate domains)
- [ ] Update redirect logic in proxy.ts
- [ ] Add tenant validation in auth flow
- [ ] Remove `app/login/` and `app/register/`
- [ ] Update documentation
- [ ] Test both auth flows
- [ ] Test tenant isolation

---

## 🎓 Learning from Industry

### Slack (Platform-Level)
- `slack.com/signin` → Login once
- Auto-authenticated to all workspaces
- Good for: Frequent workspace switching

### Shopify (Tenant-Level)
- `store1.myshopify.com/admin` → Store 1 login
- `store2.myshopify.com/admin` → Store 2 login
- Good for: Independent stores

### Notion (Hybrid)
- `notion.so/login` → Personal login
- `workspace.notion.so` → Workspace-specific
- Good for: Both personal and team use

**AkseSekolah.id is most similar to Shopify model** → Hybrid with strong tenant isolation

---

## 🔮 Future Considerations

### If You Need SSO Later:
```typescript
// Implement OAuth flow
// Platform issues JWT token
// Tenant validates token
// User auto-authenticated to tenant

// This is possible with hybrid approach!
```

### If You Need Multi-Tenant Users:
```typescript
// User table:
{
  id: "user_123",
  email: "admin@example.com",
  tenants: [
    { tenantId: "tenant1", role: "admin" },
    { tenantId: "tenant2", role: "viewer" }
  ]
}

// Tenant switcher in UI
// Still use tenant-level auth, but allow switching
```

---

## ✅ Conclusion

**For AkseSekolah.id: Use Hybrid Approach**

**Platform Admin:**
- `aksesekolah.id/admin/signin`
- Centralized, SSO-capable
- For superadmins only

**Tenant Users:**
- `tenant.aksesekolah.id/signin`
- Branded, isolated
- For school staff, students, parents

This gives you:
- ✅ Best UX for all user types
- ✅ Strong security & isolation
- ✅ Scalability for future features
- ✅ White-label support
- ✅ Clear mental model

**Next Step:** Implement tenant-level auth in `app/[jajal]/(auth)/`
