# Dashboard Subdomain Setup

## 🎯 Objective

Dashboard **HANYA** bisa diakses via subdomain `dashboard.aksesekolah.id`, **TIDAK** via path `/dashboard` di domain utama.

---

## 🏗️ Architecture

### ❌ Old (Blocked)
```
aksesekolah.id/admin              → ❌ BLOCKED (redirects to dashboard subdomain)
aksesekolah.id/tenant             → ❌ BLOCKED (redirects to dashboard subdomain)
tenant.aksesekolah.id/admin       → ❌ BLOCKED (redirects to dashboard subdomain)
```

### ✅ New (Clean URLs!)
```
dashboard.aksesekolah.id/admin/*     → ✅ Admin dashboard
dashboard.aksesekolah.id/tenant/*    → ✅ Tenant dashboard
```

---

## 🔧 Implementation

### 1. Proxy Logic (app/proxy.ts)

```typescript
// BLOCK dashboard routes (/admin, /tenant) from non-dashboard domains
const isDashboardRoute = pathname.startsWith("/admin") || 
                        pathname.startsWith("/tenant");

if (isDashboardRoute && !isDashboard) {
  console.log(`[Proxy] Blocking dashboard route ${pathname} from ${hostname}`);
  
  const dashboardUrl = new URL(request.url);
  dashboardUrl.hostname = `dashboard.${platformDomain}`;
  dashboardUrl.pathname = pathname;
  
  return NextResponse.redirect(dashboardUrl);
}
```

**Behavior:**
- User visits: `aksesekolah.id/admin/overview`
- Proxy redirects to: `dashboard.aksesekolah.id/admin/overview`

### 2. Login API (app/api/auth/login/route.ts)

```typescript
// Get dashboard URL from environment
const dashboardDomain = process.env.NEXT_PUBLIC_DASHBOARD_URL || 
                       (process.env.NODE_ENV === "production" 
                         ? "https://dashboard.aksesekolah.id"
                         : "http://dashboard.aksesekolah.local:3000");

// Always redirect to dashboard subdomain
let redirectUrl = `${dashboardDomain}/tenant/overview`;

if (user.role === "admin") {
  redirectUrl = `${dashboardDomain}/admin/overview`;
}
```

**Behavior:**
- Login returns full URL: `https://dashboard.aksesekolah.id/dashboard/admin/overview`
- Frontend redirects to dashboard subdomain

### 3. Frontend Redirect (app/(platform)/(auth)/signin/page.tsx)

```typescript
if (data.success) {
  const redirectUrl = data.redirectUrl;
  
  if (redirectUrl.startsWith("http")) {
    // Full URL - cross-domain redirect
    window.location.href = redirectUrl;
  } else {
    // Relative path
    router.push(redirectUrl);
  }
}
```

---

## 🌐 DNS Configuration

### Production

```bash
# DNS Records
A     dashboard.aksesekolah.id    → Server IP (e.g., 103.xxx.xxx.xxx)
```

### Local Development

```bash
# /etc/hosts
127.0.0.1 dashboard.aksesekolah.local
```

---

## 🔐 Cookie Configuration

### Important: Cookie Domain

Cookies harus di-set dengan domain yang tepat agar bisa di-share antara subdomain:

```typescript
// app/api/auth/login/route.ts

response.cookies.set(
  "user-session",
  JSON.stringify({ ... }),
  {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    domain: ".aksesekolah.id",  // ← Share across subdomains
    maxAge: 60 * 60 * 24 * 7,
  },
);
```

**Note:** Domain dengan prefix `.` (dot) akan share cookie ke semua subdomain:
- `.aksesekolah.id` → Works for `dashboard.aksesekolah.id`, `tenant.aksesekolah.id`, etc.

---

## 🧪 Testing

### Test 1: Direct Dashboard Access (Should Block)

```bash
# Try to access dashboard from main domain
curl -I http://aksesekolah.id/dashboard/admin/overview

# Expected: 307 Redirect to dashboard.aksesekolah.id
```

### Test 2: Dashboard Subdomain Access (Should Allow)

```bash
# Access dashboard from dashboard subdomain
curl -I http://dashboard.aksesekolah.id/dashboard/admin/overview

# Expected: 200 OK (or 302 to /signin if not authenticated)
```

### Test 3: Login Flow

```bash
# 1. Login from main domain
Visit: http://aksesekolah.id/signin
Login: admin / admin123

# 2. API returns full URL
Response: {
  "redirectUrl": "http://dashboard.aksesekolah.id/dashboard/admin/overview"
}

# 3. Browser redirects to dashboard subdomain
Final URL: http://dashboard.aksesekolah.id/dashboard/admin/overview
```

---

## 📊 User Journey

### Admin Login Journey

```
1. User visits: aksesekolah.id/signin
   ↓
2. Enter credentials: admin / admin123
   ↓
3. POST /api/auth/login
   ↓
4. API returns: {
     redirectUrl: "https://dashboard.aksesekolah.id/dashboard/admin/overview"
   }
   ↓
5. Frontend: window.location.href = redirectUrl
   ↓
6. Browser navigates to: dashboard.aksesekolah.id/dashboard/admin/overview
   ↓
7. Proxy checks: isDashboard = true ✓
   ↓
8. Admin layout checks: role="admin" ✓
   ↓
9. Shows: Admin dashboard
```

### Blocked Access Journey

```
1. User tries: aksesekolah.id/dashboard/admin/overview
   ↓
2. Proxy checks: isDashboard = false
   ↓
3. Proxy blocks and redirects to:
   dashboard.aksesekolah.id/dashboard/admin/overview
   ↓
4. User sees dashboard on correct subdomain
```

---

## 🚀 Deployment Checklist

### Production

- [ ] DNS: Add `A` record for `dashboard.aksesekolah.id`
- [ ] SSL: Generate certificate for `dashboard.aksesekolah.id`
- [ ] Nginx: Configure proxy for dashboard subdomain
- [ ] Environment: Set `NEXT_PUBLIC_DASHBOARD_URL=https://dashboard.aksesekolah.id`
- [ ] Cookie: Set `domain: ".aksesekolah.id"`
- [ ] Test: Login flow
- [ ] Test: Direct dashboard access (should redirect)

### Local Development

- [ ] Hosts: Add `127.0.0.1 dashboard.aksesekolah.local` to `/etc/hosts`
- [ ] Environment: Set `NEXT_PUBLIC_DASHBOARD_URL=http://dashboard.aksesekolah.local:3000`
- [ ] Cookie: Set `domain: ".aksesekolah.local"`
- [ ] Test: Login flow
- [ ] Test: Direct dashboard access (should redirect)

---

## 🔧 Nginx Configuration

### Production

```nginx
# Dashboard subdomain
server {
  listen 443 ssl http2;
  server_name dashboard.aksesekolah.id;

  ssl_certificate /etc/letsencrypt/live/aksesekolah.id/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/aksesekolah.id/privkey.pem;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}

# Main domain (blocks /dashboard)
server {
  listen 443 ssl http2;
  server_name aksesekolah.id www.aksesekolah.id;

  ssl_certificate /etc/letsencrypt/live/aksesekolah.id/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/aksesekolah.id/privkey.pem;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

---

## 📝 Environment Variables

### .env.production

```bash
# Dashboard URL (production)
NEXT_PUBLIC_DASHBOARD_URL=https://dashboard.aksesekolah.id

# Platform domain
NEXT_PUBLIC_PLATFORM_DOMAIN=aksesekolah.id
```

### .env.local

```bash
# Dashboard URL (local)
NEXT_PUBLIC_DASHBOARD_URL=http://dashboard.aksesekolah.local:3000

# Platform domain
NEXT_PUBLIC_PLATFORM_DOMAIN=aksesekolah.local
```

---

## ✅ Benefits

### 1. Security
- ✅ Clear separation between public and admin areas
- ✅ Easier to apply different security rules
- ✅ Separate rate limiting per subdomain

### 2. Performance
- ✅ Can deploy dashboard on separate server
- ✅ Independent scaling
- ✅ Separate caching strategies

### 3. Professional
- ✅ Enterprise-grade architecture
- ✅ Clear URL structure
- ✅ Better user perception

### 4. Maintenance
- ✅ Easier to debug (clear separation)
- ✅ Easier to monitor (separate logs)
- ✅ Easier to update (independent deployment)

---

## 🎯 Summary

**Dashboard access is now enforced via subdomain only:**

```
❌ aksesekolah.id/dashboard          → Redirects to dashboard subdomain
❌ tenant.aksesekolah.id/dashboard   → Redirects to dashboard subdomain
✅ dashboard.aksesekolah.id/dashboard → Allowed
```

**Login flow automatically redirects to dashboard subdomain:**

```
Login at: aksesekolah.id/signin
  ↓
Redirects to: dashboard.aksesekolah.id/dashboard/admin/overview
```

**This ensures:**
- ✅ Professional architecture
- ✅ Clear separation of concerns
- ✅ Better security
- ✅ Scalable infrastructure

---

**Status**: ✅ Implemented
**Testing**: Ready for local testing
**Production**: Ready for deployment

