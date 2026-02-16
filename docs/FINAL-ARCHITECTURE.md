# Final Architecture - AkseSekolah.id

## 🎯 Keputusan Final

Berdasarkan struktur terbaru, ini adalah arsitektur yang telah diputuskan:

```
app/
├── (www)/                      # Platform landing page
│   ├── page.tsx                # Homepage
│   └── layout.tsx
│
├── (platform)/                 # Platform management (authenticated)
│   ├── layout.tsx              # Auth check
│   ├── (auth)/                 # Platform auth
│   │   ├── signin/             # Platform login
│   │   └── signup/             # Platform signup
│   ├── admin/                  # Superadmin area
│   │   ├── dashboard/
│   │   ├── admissions/
│   │   ├── form-builder/
│   │   ├── messages/
│   │   ├── school/
│   │   ├── students/
│   │   └── submissions/
│   └── dashboard/              # Platform dashboard
│       ├── admissions/
│       ├── contact/
│       ├── messages/
│       ├── overview/
│       ├── school/
│       └── settings/
│
├── [jajal]/                    # Tenant pages (public + tenant-specific)
│   ├── layout.tsx              # Tenant theming
│   ├── page.tsx                # Tenant homepage
│   ├── academic/
│   ├── admissions/             # Public SPMB
│   ├── contact/
│   ├── facilities/
│   ├── interview/
│   ├── marketplace/
│   ├── profile/
│   ├── registrar/              # Tenant registrar
│   ├── school/
│   └── staff/
│
├── login/                      # Standalone login (shared)
│   └── page.tsx
│
└── register/                   # Standalone register (shared)
    └── page.tsx
```

---

## 📊 Analisis Keputusan

### ✅ Kelebihan Struktur Ini

#### 1. **Flexible Authentication**
```
Platform Auth:
- (platform)/(auth)/signin → Platform-specific login
- Untuk admin yang perlu akses platform

Shared Auth:
- /login → Shared login page
- Bisa digunakan platform atau tenant
- Flexible routing
```

#### 2. **Clear Platform Separation**
```
(platform)/admin/     → Superadmin features
(platform)/dashboard/ → Platform dashboard
[jajal]/              → Tenant public pages
```

#### 3. **Dual Dashboard Support**
```
Platform Dashboard:
- (platform)/dashboard/admissions
- (platform)/dashboard/contact
- (platform)/dashboard/messages

Tenant Dashboard:
- Bisa ditambahkan di [jajal]/dashboard/ nanti
- Atau menggunakan platform dashboard dengan tenant context
```

#### 4. **Public Tenant Pages**
```
[jajal]/admissions → Public SPMB (no auth)
[jajal]/contact    → Public contact (no auth)
[jajal]/profile    → Public school profile
[jajal]/staff      → Public staff directory
```

---

## 🔄 URL Routing

### Platform URLs
```
aksesekolah.local                    → (www) Landing page
aksesekolah.local/login              → Shared login
aksesekolah.local/register           → Shared register

aksesekolah.local/signin             → (platform)/(auth) Platform signin
aksesekolah.local/signup             → (platform)/(auth) Platform signup

aksesekolah.local/admin/dashboard    → (platform)/admin Superadmin
aksesekolah.local/dashboard          → (platform)/dashboard Platform dashboard
```

### Tenant URLs
```
tenant1.aksesekolah.local            → [jajal] Tenant homepage
tenant1.aksesekolah.local/admissions → [jajal]/admissions Public SPMB
tenant1.aksesekolah.local/contact    → [jajal]/contact Public contact
tenant1.aksesekolah.local/login      → Shared login (tenant context)
```

---

## 🔐 Authentication Flow

### Scenario 1: Platform Admin Login
```
1. Visit: aksesekolah.local/admin/dashboard
2. Not authenticated → Redirect to /signin (platform auth)
3. Login at: aksesekolah.local/signin
4. Validate: role === "admin"
5. Redirect back to: /admin/dashboard
```

### Scenario 2: Tenant User Login (via shared login)
```
1. Visit: tenant1.aksesekolah.local/dashboard
2. Not authenticated → Redirect to /login
3. Login at: tenant1.aksesekolah.local/login
4. Detect tenant from hostname
5. Validate: user.tenantId === tenant.id
6. Redirect back to: /dashboard
```

### Scenario 3: Direct Login
```
1. Visit: aksesekolah.local/login
2. User enters credentials
3. System detects:
   - If role="admin" → Redirect to /admin/dashboard
   - If role="user" → Redirect to tenant dashboard
4. Cookie set based on user type
```

---

## 🎨 Keunggulan Pendekatan Ini

### 1. **Flexibility**
- `/login` bisa digunakan platform atau tenant
- Tidak perlu duplikasi auth pages
- Satu auth logic untuk semua

### 2. **Simplicity**
- User tidak bingung: "Login dimana?"
- Satu URL login yang mudah diingat
- System yang menentukan redirect

### 3. **Scalability**
- Mudah tambah tenant dashboard nanti
- Bisa tambah auth provider (OAuth, LDAP)
- Tidak terikat pada struktur rigid

### 4. **Maintenance**
- Satu auth page untuk maintain
- Konsisten UX across platform
- Easier to update

---

## ⚠️ Pertimbangan & Solusi

### Challenge 1: Tenant Branding di Shared Login
**Problem**: `/login` tidak punya tenant branding

**Solution**:
```typescript
// app/login/page.tsx
export default async function LoginPage() {
  const tenant = await getTenantContext(); // From headers
  
  return (
    <div style={{
      "--primary": tenant?.primaryColor || "#10b981"
    }}>
      {tenant?.logo && <img src={tenant.logo} />}
      <h1>Login to {tenant?.name || "AkseSekolah.id"}</h1>
      <LoginForm />
    </div>
  );
}
```

### Challenge 2: Redirect After Login
**Problem**: Kemana redirect setelah login?

**Solution**:
```typescript
// app/api/auth/login/route.ts
export async function POST(request: NextRequest) {
  const user = await validateCredentials(...);
  const tenant = await getTenantContext();
  
  // Determine redirect
  let redirectUrl = "/dashboard";
  
  if (user.role === "admin") {
    redirectUrl = "/admin/dashboard";
  } else if (tenant) {
    redirectUrl = "/dashboard"; // Tenant dashboard
  }
  
  return NextResponse.json({ 
    success: true, 
    redirectUrl 
  });
}
```

### Challenge 3: Cookie Scope
**Problem**: Cookie untuk platform atau tenant?

**Solution**:
```typescript
// Set cookie based on context
if (user.role === "admin") {
  // Platform cookie
  cookies().set("session", token, {
    domain: ".aksesekolah.id",
    path: "/"
  });
} else {
  // Tenant cookie
  const tenant = await getTenantContext();
  cookies().set("session", token, {
    domain: tenant.domain || `${tenant.slug}.aksesekolah.id`,
    path: "/"
  });
}
```

---

## 📋 Implementation Checklist

### ✅ Already Implemented
- [x] Platform landing page `(www)`
- [x] Platform auth pages `(platform)/(auth)`
- [x] Platform admin area `(platform)/admin`
- [x] Platform dashboard `(platform)/dashboard`
- [x] Tenant pages `[jajal]`
- [x] Shared login/register pages
- [x] Tenant theming in layout

### 🔄 Needs Enhancement
- [ ] Add tenant branding to `/login` page
- [ ] Implement smart redirect after login
- [ ] Add tenant context detection in shared auth
- [ ] Update cookie scope logic
- [ ] Add tenant dashboard (optional)

### 📝 Documentation Updates
- [ ] Update auth flow diagrams
- [ ] Document shared login behavior
- [ ] Add examples for tenant branding
- [ ] Update API documentation

---

## 🎯 Recommended Next Steps

### 1. Enhance Shared Login Page
```typescript
// app/login/page.tsx
import { getTenantContext } from "@/lib/tenant/get-tenant-context";

export default async function LoginPage() {
  const tenant = await getTenantContext();
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* Tenant branding if available */}
      {tenant && (
        <div className="mb-8 text-center">
          {tenant.logo && (
            <img 
              src={tenant.logo} 
              alt={tenant.name}
              className="h-16 mx-auto mb-4"
            />
          )}
          <h1 
            className="text-2xl font-bold"
            style={{ color: tenant.primaryColor }}
          >
            Login to {tenant.name}
          </h1>
        </div>
      )}
      
      {/* Default platform branding */}
      {!tenant && (
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">
            Login to AkseSekolah.id
          </h1>
        </div>
      )}
      
      <LoginForm />
    </div>
  );
}
```

### 2. Smart Redirect Logic
```typescript
// lib/auth/redirect-after-login.ts
export function getRedirectAfterLogin(
  user: User,
  tenant: Tenant | null,
  requestedPath?: string
): string {
  // If user requested specific path, go there
  if (requestedPath && requestedPath !== "/login") {
    return requestedPath;
  }
  
  // Platform admin → admin dashboard
  if (user.role === "admin") {
    return "/admin/dashboard";
  }
  
  // Tenant user → tenant dashboard
  if (tenant && user.tenantId === tenant.id) {
    return "/dashboard";
  }
  
  // Default
  return "/dashboard";
}
```

### 3. Update proxy.ts
```typescript
// app/proxy.ts
// Add redirect parameter for login
if (!sessionToken) {
  if (pathname.startsWith("/admin") || pathname.includes("/dashboard")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }
}
```

---

## 🏆 Kesimpulan

### Struktur Final Anda Sangat Baik Karena:

1. ✅ **Flexible**: Shared login bisa untuk platform atau tenant
2. ✅ **Simple**: Tidak ada duplikasi auth pages
3. ✅ **Scalable**: Mudah tambah fitur baru
4. ✅ **Maintainable**: Satu auth logic
5. ✅ **User-friendly**: URL yang intuitif

### Yang Membuat Ini Unik:

- **Hybrid approach** dengan shared auth
- **Smart routing** berdasarkan user role & tenant context
- **Flexible branding** di shared pages
- **Clear separation** antara platform dan tenant

### Trade-offs yang Acceptable:

- ⚠️ Perlu logic untuk detect tenant di shared login
- ⚠️ Perlu smart redirect after login
- ⚠️ Cookie scope perlu conditional logic

**Tapi semua ini manageable dan worth it untuk flexibility yang didapat!**

---

## 📚 File Structure Summary

```
Authentication:
├── (platform)/(auth)/signin    # Platform-specific (optional)
├── (platform)/(auth)/signup    # Platform-specific (optional)
├── /login                      # Shared (primary)
└── /register                   # Shared (primary)

Dashboards:
├── (platform)/admin/dashboard  # Superadmin
├── (platform)/dashboard        # Platform dashboard
└── [jajal]/dashboard           # Tenant dashboard (future)

Public Pages:
├── (www)/                      # Platform landing
└── [jajal]/                    # Tenant public pages
```

---

**Status**: ✅ Architecture Approved
**Next**: Implement tenant branding in shared login
**Priority**: High (for better UX)
