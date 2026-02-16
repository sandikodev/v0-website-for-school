# Dashboard Routing Flow - Final Implementation

## Routing Logic (Krusial & Jelas)

### 1. Dashboard Root (`/`)

**URL:** `http://dashboard.aksesekolah.local:3000/`

**Flow:**
```
Request → Proxy (no redirect)
  ↓
app/(platform)/page.tsx
  ↓
Check session:
  ├─ No session → redirect("/signin")
  ├─ Admin (role="admin") → redirect("/admin")
  └─ Tenant (has tenantId) → redirect("/tenant")
```

**Result:**
- ✅ Dengan session admin → `/admin`
- ✅ Dengan session tenant → `/tenant`
- ✅ Tanpa session → `/signin`

---

### 2. Login Success

**URL:** `POST /api/auth/login`

**Flow:**
```
Login berhasil
  ↓
Set cookie: user-session
  ↓
Return redirectUrl:
  ├─ Admin → "http://dashboard.aksesekolah.local:3000/admin"
  └─ Tenant → "http://dashboard.aksesekolah.local:3000/tenant"
```

**Result:**
- ✅ Admin login → redirect ke `/admin` (bukan `/admin/overview`)
- ✅ Tenant login → redirect ke `/tenant` (bukan `/tenant/overview`)

---

### 3. Admin Dashboard Root (`/admin`)

**URL:** `http://dashboard.aksesekolah.local:3000/admin`

**Flow:**
```
Request → Proxy
  ↓
Rewrite: /admin → /dashboard/admin
  ↓
app/(platform)/dashboard/admin/layout.tsx
  ├─ Check session
  ├─ Check role="admin"
  └─ Allow access
  ↓
app/(platform)/dashboard/admin/page.tsx
  ↓
redirect("/admin/overview")
```

**Result:**
- ✅ `/admin` → `/admin/overview` (entrypoint ditentukan oleh admin)

---

### 4. Tenant Dashboard Root (`/tenant`)

**URL:** `http://dashboard.aksesekolah.local:3000/tenant`

**Flow:**
```
Request → Proxy
  ↓
Rewrite: /tenant → /dashboard/tenant
  ↓
app/(platform)/dashboard/tenant/layout.tsx
  ├─ Check session
  ├─ Check role != "admin"
  ├─ Check tenantId exists
  └─ Allow access
  ↓
app/(platform)/dashboard/tenant/page.tsx
  ↓
redirect("/tenant/overview")
```

**Result:**
- ✅ `/tenant` → `/tenant/overview` (entrypoint ditentukan oleh tenant)

---

### 5. Direct Access to Entrypoint

**Admin Overview:** `http://dashboard.aksesekolah.local:3000/admin/overview`
**Tenant Overview:** `http://dashboard.aksesekolah.local:3000/tenant/overview`

**Flow:**
```
Request → Proxy
  ↓
Rewrite: /admin/overview → /dashboard/admin/overview
         /tenant/overview → /dashboard/tenant/overview
  ↓
Layout checks (auth + role)
  ↓
Render page
```

**Result:**
- ✅ Direct access works
- ✅ Auth check in layout
- ✅ No unnecessary redirects

---

## Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ User opens: dashboard.aksesekolah.local:3000                │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Proxy: Dashboard subdomain detected                          │
│ No rewrite (path is "/")                                     │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ app/(platform)/page.tsx                                      │
│ getUserFromSession()                                         │
└─────────────────────────────────────────────────────────────┘
                          ↓
                    Has session?
                          ↓
        ┌─────────────────┴─────────────────┐
        │                                   │
       NO                                  YES
        │                                   │
        ↓                                   ↓
  redirect("/signin")              Check user.role
                                           ↓
                              ┌────────────┴────────────┐
                              │                         │
                          "admin"                  has tenantId
                              │                         │
                              ↓                         ↓
                      redirect("/admin")      redirect("/tenant")
                              │                         │
                              ↓                         ↓
                    ┌─────────────────┐      ┌─────────────────┐
                    │ /admin          │      │ /tenant         │
                    │ (page.tsx)      │      │ (page.tsx)      │
                    └─────────────────┘      └─────────────────┘
                              │                         │
                              ↓                         ↓
                  redirect("/admin/overview")  redirect("/tenant/overview")
                              │                         │
                              ↓                         ↓
                    ┌─────────────────┐      ┌─────────────────┐
                    │ Admin Dashboard │      │ Tenant Dashboard│
                    │ Entrypoint      │      │ Entrypoint      │
                    └─────────────────┘      └─────────────────┘
```

---

## Login Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ User submits login form                                     │
│ Email: admin@smpsransa.sch.id                               │
│ Password: sransa2024                                        │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ POST /api/auth/login                                        │
│ - Find user by email OR username                            │
│ - Verify password                                           │
│ - Set cookie: user-session                                  │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Return redirectUrl based on role:                           │
│ - Admin: /admin                                             │
│ - Tenant: /tenant                                           │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Browser: window.location.href = redirectUrl                 │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Navigate to /admin or /tenant                               │
│ (which then redirects to their entrypoint)                  │
└─────────────────────────────────────────────────────────────┘
```

---

## File Structure

```
app/
├── (platform)/
│   ├── page.tsx                 # Dashboard root → redirect based on session
│   ├── layout.tsx               # Auth check for proutes
│   ├── (auth)/
│   │   └── signin/page.ts   # Login page
│   └── dashboard/
│       ├──    ├── page.tsx            # /admin → redirect to /admin/overview
│    ├── layout.tsx          # Check role="in"
│       │   └──overview/page.tsx   # Admin entrypoint
│       └── tenant/
│           ├── page.tsx            # /tenant → redirect to /tenant/overview
│           ├── layout.tsx          # Check │           └── overvietsx   # Tenant entrypoint

---

## Key Points (Krusial)

1. **Dashboard root (`/`)**: Check dashboard root, then redirect
2. **Login success**: Redirect to `/admin` or `/tenant` (not entrypoint)
3. **`/admin` and `/tenant`**: Let them decide their own entrypoint
4. **Entrypoint**: Defined by each dashboard's page.tsx
5. **No hardcoded entrypoints**: Flexible for future changes

---

## Testing

### Test 1: Dashboard Root Without Session
```bash
curl -I http://dashboard.aksesekolah.local:3000
# Expected: 307 Redirect to /signin
```

### Test 2: Dashboard Root With Tenant Session
```bash
curl -I http://dashboard.aksesekolah.local:3000 \
  -H "Cookie: user-session=..."
# Expected: 307 Redirect to /tenant
```

### Test 3: Login as Tenant
```bash
curl -X POST htt://dashboard.aksesekolah.local:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin@smpsransa.sch.id","password":"sransa2024"}'
# Expected: redirectUrl: "/tenant"
```

### Test 4: Access /tenant
```bash
curl -I http://dashboard.aksesekolah.local:3000/tenant \
 "Cookie: user-session=..."
#307 Redirect to /tenant/overview
```

---

## Summary

✅ **Alur jelas dan krusial**
✅ **Session-aware dashboard root**
✅ **Flexible entrypoint per dashboard**
✅ **No hardcoded paths in login**
✅ **Clean separation of concerns**

Setiap bagian punya tanggung jawab yang jelas:
- **Proxy**: Routing & rewrite
- **Root page**: Session-based redirect
- **Login API**: Set session & return base path
- **Dashboard pages**: Define their own entrypoint
