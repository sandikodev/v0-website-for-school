# Authentication Flow Diagrams

## 🎯 Hybrid Authentication Architecture

### Overview
```
┌─────────────────────────────────────────────────────────────┐
│                    AkseSekolah.id Platform                   │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
        ┌───────▼────────┐         ┌───────▼────────┐
        │ Platform Admin │         │  Tenant Users  │
        │   (Superadmin) │         │ (School Users) │
        └───────┬────────┘         └───────┬────────┘
                │                           │
    ┌───────────▼──────────┐    ┌──────────▼──────────┐
    │ aksesekolah.id/admin │    │ tenant.aksesekolah  │
    │                      │    │      .id/signin     │
    │ - Centralized auth   │    │                     │
    │ - SSO capable        │    │ - Branded auth      │
    │ - Cross-tenant       │    │ - Tenant isolated   │
    │ - Cookie: .akses...  │    │ - Cookie: tenant... │
    └──────────────────────┘    └─────────────────────┘
```

---

## 🔐 Platform Admin Flow

### 1. Access Platform Dashboard
```
User Action: Visit aksesekolah.id/admin/dashboard
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ proxy.ts: Check authentication                               │
│ - Cookie: platform-session exists?                           │
└─────────────────────────────────────────────────────────────┘
                              ↓
                    ┌─────────┴─────────┐
                    │                   │
            ┌───────▼────────┐  ┌──────▼───────┐
            │ Cookie exists  │  │ No cookie    │
            └───────┬────────┘  └──────┬───────┘
                    │                   │
                    │                   ↓
                    │         Redirect: /admin/signin
                    │                   ↓
                    │         ┌─────────────────────┐
                    │         │ Platform Login Page │
                    │         │ - No tenant branding│
                    │         │ - Platform logo     │
                    │         │ - Email + password  │
                    │         └─────────┬───────────┘
                    │                   │
                    │                   ↓
                    │         POST /api/auth/platform/login
                    │                   ↓
                    │         ┌─────────────────────┐
                    │         │ Validate credentials│
                    │         │ Check role="admin"  │
                    │         └─────────┬───────────┘
                    │                   │
                    │                   ↓
                    │         Set cookie: platform-session
                    │         Domain: .aksesekolah.id
                    │                   │
                    └───────────────────┘
                                        ↓
┌─────────────────────────────────────────────────────────────┐
│ app/(platform)/layout.tsx                                    │
│ - getUserFromSession()                                       │
│ - Validate role === "admin"                                  │
│ - If not admin → redirect("/dashboard")                      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ Platform Dashboard Rendered                                  │
│ - Access to all tenants                                      │
│ - System settings                                            │
│ - User management                                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏫 Tenant User Flow

### 1. Access Tenant Dashboard
```
User Action: Visit syuhada.aksesekolah.id/dashboard
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ proxy.ts: Resolve tenant                                     │
│ - hostname: syuhada.aksesekolah.id                           │
│ - getTenantByHost("syuhada") → tenant found                  │
│ - Add headers: x-tenant-id, x-tenant-slug                    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ proxy.ts: Check authentication                               │
│ - Cookie: tenant-session exists?                             │
└─────────────────────────────────────────────────────────────┘
                              ↓
                    ┌─────────┴─────────┐
                    │                   │
            ┌───────▼────────┐  ┌──────▼───────┐
            │ Cookie exists  │  │ No cookie    │
            └───────┬────────┘  └──────┬───────┘
                    │                   │
                    │                   ↓
                    │         Redirect: /signin (tenant URL)
                    │                   ↓
                    │         ┌─────────────────────────────┐
                    │         │ Tenant Login Page           │
                    │         │ - Tenant logo & colors      │
                    │         │ - "Login to SMP IT Syuhada" │
                    │         │ - Email + password          │
                    │         │ - Branded with tenant theme │
                    │         └─────────┬───────────────────┘
                    │                   │
                    │                   ↓
                    │         POST /api/auth/tenant/login
                    │         Headers: x-tenant-id
                    │                   ↓
                    │         ┌─────────────────────────────┐
                    │         │ Validate credentials        │
                    │         │ Check user.tenantId matches │
                    │         │ Check user is active        │
                    │         └─────────┬───────────��───────┘
                    │                   │
                    │                   ↓
                    │         Set cookie: tenant-session
                    │         Domain: syuhada.aksesekolah.id
                    │                   │
                    └───────────────────┘
                                        ↓
┌─────────────────────────────────────────────────────────────┐
│ app/[jajal]/dashboard/layout.tsx                             │
│ - getUserFromSession()                                       │
│ - getTenantContext() from headers                            │
│ - Validate user.tenantId === tenant.id                       │
│ - Apply tenant theme                                         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ Tenant Dashboard Rendered                                    │
│ - Tenant-specific data only                                  │
│ - Branded with tenant colors                                 │
│ - Isolated from other tenants                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Cookie Scope Comparison

### Platform Admin Cookie
```
Cookie Name: platform-session
Domain: .aksesekolah.id
Path: /admin
SameSite: Lax
Secure: true
HttpOnly: true

Accessible from:
✅ aksesekolah.id/admin
✅ aksesekolah.id/admin/dashboard
✅ aksesekolah.id/admin/tenants
❌ tenant1.aksesekolah.id (different subdomain)
❌ tenant2.aksesekolah.id (different subdomain)

Purpose:
- Platform administration
- Cross-tenant access
- System management
```

### Tenant User Cookie
```
Cookie Name: tenant-session
Domain: syuhada.aksesekolah.id
Path: /
SameSite: Strict
Secure: true
HttpOnly: true

Accessible from:
✅ syuhada.aksesekolah.id
✅ syuhada.aksesekolah.id/dashboard
✅ syuhada.aksesekolah.id/admissions
❌ aksesekolah.id/admin (different domain)
❌ tenant1.aksesekolah.id (different subdomain)

Purpose:
- Tenant-specific access
- Strong isolation
- End-user authentication
```

---

## 👥 User Type Matrix

| User Type | Login URL | Dashboard URL | Cookie Domain | Access Scope |
|-----------|-----------|---------------|---------------|--------------|
| **Superadmin** | aksesekolah.id/admin/signin | aksesekolah.id/admin/dashboard | .aksesekolah.id | All tenants |
| **School Admin** | tenant.aksesekolah.id/signin | tenant.aksesekolah.id/dashboard | tenant.aksesekolah.id | Single tenant |
| **Teacher** | tenant.aksesekolah.id/signin | tenant.aksesekolah.id/dashboard | tenant.aksesekolah.id | Single tenant |
| **Student** | tenant.aksesekolah.id/signin | tenant.aksesekolah.id/dashboard | tenant.aksesekolah.id | Single tenant |
| **Parent** | tenant.aksesekolah.id/signin | tenant.aksesekolah.id/dashboard | tenant.aksesekolah.id | Single tenant |

---

## 🔐 Security Validation Layers

### Layer 1: proxy.ts (Lightweight)
```typescript
// Check cookie exists
const platformSession = request.cookies.get('platform-session');
const tenantSession = request.cookies.get('tenant-session');

if (pathname.startsWith('/admin') && !platformSession) {
  return NextResponse.redirect('/admin/signin');
}

if (pathname.startsWith('/dashboard') && !tenantSession) {
  return NextResponse.redirect('/signin');
}
```

### Layer 2: Layout (Full Validation)
```typescript
// Platform layout
const user = await getUserFromSession();
if (!user) redirect('/admin/signin');
if (user.role !== 'admin') redirect('/dashboard');

// Tenant layout
const user = await getUserFromSession();
const tenant = await getTenantContext();
if (!user) redirect('/signin');
if (user.tenantId !== tenant.id) redirect('/signin');
```

### Layer 3: API Routes (Data Access)
```typescript
// Platform API
const user = await getUserFromSession();
if (user.role !== 'admin') {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
}

// Tenant API
const user = await getUserFromSession();
const tenantId = headers.get('x-tenant-id');
if (user.tenantId !== tenantId) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
}
```

---

## 🚀 Migration Path

### Current State (Confusing)
```
app/
├── login/              # ❓ Who is this for?
├── register/           # ❓ Platform or tenant?
├── (platform)/
│   └── dashboard/      # ✅ Platform dashboard
└── [jajal]/
    └── dashboard/      # ✅ Tenant dashboard
```

### Target State (Clear)
```
app/
├── (platform)/
│   ├── (auth)/
│   │   ├── signin/     # 🎯 Platform admin login
│   │   └── signup/     # 🎯 Platform admin signup (invite-only)
│   └── dashboard/      # ✅ Platform dashboard
│
└── [jajal]/
    ├── (auth)/
    │   ├── signin/     # 🎯 Tenant user login (branded)
    │   └── signup/     # 🎯 Tenant user signup (branded)
    └── dashboard/      # ✅ Tenant dashboard
```

### Migration Steps
```
1. ✅ Keep platform auth: (platform)/(auth)/signin
2. 🆕 Create tenant auth: [jajal]/(auth)/signin
3. 🗑️ Remove standalone: login/, register/
4. 🔄 Update redirects in proxy.ts
5. 🧪 Test both flows
6. 📝 Update documentation
```

---

## 🎯 Decision Summary

### ✅ Recommended: Hybrid Approach

**Why?**
1. **Clear separation**: Platform vs Tenant
2. **Better UX**: Branded auth for end-users
3. **Strong isolation**: Tenant data protected
4. **Scalable**: Easy to add features
5. **Flexible**: Supports future SSO if needed

**Trade-offs:**
- More code (acceptable)
- Two auth systems (manageable)
- Need documentation (we have it!)

**Result:**
- ✅ Superadmins happy (convenient platform access)
- ✅ School staff happy (branded experience)
- ✅ Students/parents happy (intuitive URLs)
- ✅ Developers happy (clear architecture)
- ✅ Security team happy (strong isolation)

---

## 📚 Related Documentation

- [AUTH-ARCHITECTURE-DECISION.md](./AUTH-ARCHITECTURE-DECISION.md) - Detailed analysis
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [LOCAL-DEVELOPMENT.md](./LOCAL-DEVELOPMENT.md) - Development guide
