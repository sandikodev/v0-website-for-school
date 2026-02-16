# ERR_TOO_MANY_REDIRECTS - Fix Summary

## Problem

User mengalami redirect loop saat mengakses dashboard setelah login:
- Login berhasil → redirect ke `/tenant/overview`
- `/tenant/overview` → redirect loop (ERR_TOO_MANY_REDIRECTS)

## Root Causes

### 1. **Wrong API Endpoint in Signin Page**
```typescript
// ❌ WRONG - endpoint tidak ada
fetch("/api/auth/signin", ...)

// ✅ CORRECT
fetch("/api/auth/login", ...)
```

### 2. **Hostname Detection Issue in Middleware**
```typescript
// ❌ WRONG - hostname selalu "localhost"
const { hostname } = request.nextUrl;

// ✅ CORRECT - gunakan Host header
const hostHeader = request.headers.get("host") || hostname;
```

### 3. **Route Structure Mismatch**
```
Folder: app/(platform)/dashboard/tenant/overview/page.tsx
URL Expected: /tenant/overview
URL Actual: /dashboard/tenant/overview ❌
```

## Solutions Implemented

### 1. Fix Signin API Endpoint
**File:** `app/(platform)/(auth)/signin/page.tsx`

```typescript
const response = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: email, password }),
});

// Use redirectUrl from API response
if (data.redirectUrl) {
  window.location.href = data.redirectUrl;
}
```

### 2. Fix Hostname Detection in Middleware
**File:** `app/proxy.ts`

```typescript
// Use Host header as source of truth
const hostHeader = request.headers.get("host") || hostname;
const isDashboard = 
  hostHeader === `dashboard.${platformDomain}` ||
  hostHeader === "dashboard.aksesekolah.local" ||
  hostHeader.startsWith("dashboard.aksesekolah.local:");
```

### 3. Implement URL Rewrite (Like /www Route)
**File:** `app/proxy.ts`

```typescript
// Dashboard subdomain - rewrite to /dashboard route
if (isDashboard) {
  // Rewrite /admin/* → /dashboard/admin/*
  // Rewrite /tenant/* → /dashboard/tenant/*
  if (pathname.startsWith("/admin") || pathname.startsWith("/tenant")) {
    const url = request.nextUrl.clone();
    url.pathname = `/dashboard${pathname}`;
    
    return NextResponse.rewrite(url, {
      request: {
        headers: requestHeaders,
      },
    });
  }
}
```

**How it works (same as /www route):**
- User accesses: `dashboard.aksesekolah.local/tenant/overview`
- Middleware rewrites to: `/dashboard/tenant/overview`
- Maps to folder: `app/(platform)/dashboard/tenant/overview/page.tsx`
- URL stays: `/tenant/overview` (user doesn't see /dashboard prefix)

### 4. Move Auth Check to Platform Layout
**File:** `app/(platform)/layout.tsx`

```typescript
export default async function PlatformLayout({ children }) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  
  // Public routes - no auth required
  const publicRoutes = ['/signin', '/signup'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  if (isPublicRoute) {
    return <div>{children}</div>;
  }

  // Protected routes - require authentication
  const user = await getUserFromSession();

  if (!user) {
    redirect("/signin");
  }

  return <div>{children}</div>;
}
```

**Benefits:**
- Single auth check di parent layout
- No circular redirects
- Nested layouts hanya check role/tenantId

### 5. Simplify Nested Layouts
**Files:** 
- `app/(platform)/dashboard/admin/layout.tsx`
- `app/(platform)/dashboard/tenant/layout.tsx`

```typescript
// Admin layout - only check role
export default async function AdminLayout({ children }) {
  const user = await getUserFromSession();
  
  if (!user) redirect("/signin"); // Safety check
  if (user.role !== "admin") redirect("/tenant/overview");
  
  return <div>{/* Admin UI */}{children}</div>;
}

// Tenant layout - only check tenantId
export default async function TenantLayout({ children }) {
  const user = await getUserFromSession();
  
  if (!user) redirect("/signin"); // Safety check
  if (user.role === "admin") redirect("/admin/overview");
  if (!user.tenantId) redirect("/signin");
  
  return <div>{/* Tenant UI */}{children}</div>;
}
```

## Auth Flow Diagram

```
User → Login API (/api/auth/login)
  ↓
  Set cookie: user-session
  Return: redirectUrl
  ↓
Browser → Redirect to dashboard.aksesekolah.local/tenant/overview
  ↓
Middleware (proxy.ts)
  ├─ Detect: dashboard subdomain ✓
  ├─ Rewrite: /tenant/overview → /dashboard/tenant/overview
  └─ Add header: x-pathname=/tenant/overview
  ↓
Platform Layout
  ├─ Check pathname: /tenant/overview
  ├─ Not public route → Check auth
  ├─ getUserFromSession() → user found ✓
  └─ Allow access
  ↓
Tenant Layout
  ├─ Check role: tenant_admin ✓
  ├─ Check tenantId: exists ✓
  └─ Render dashboard
  ↓
Success! ✅
```

## Key Principles

1. **Use Host Header**: `request.headers.get("host")` is source of truth, not `request.nextUrl.hostname`
2. **Rewrite, Don't Redirect**: Use `NextResponse.rewrite()` for internal routing
3. **Single Auth Check**: Do auth once in parent layout, not in every nested layout
4. **Layered Authorization**: 
   - Middleware: Check cookie exists
   - Platform Layout: Check user authenticated
   - Nested Layouts: Check role/permissions

## Folder Structure (Final)

```
app/
├── (platform)/              # Dashboard platform
│   ├── layout.tsx          # ✅ AUTH CHECK HERE
│   ├── (auth)/             # Public auth pages
│   │   ├── signin/         # URL: /signin
│   │   └── signup/         # URL: /signup
│   └── dashboard/
│       ├── admin/          # URL: /admin/* (via rewrite)
│       │   ├── layout.tsx  # Role check only
│       │   └── overview/
│       └── tenant/         # URL: /tenant/* (via rewrite)
│           ├── layout.tsx  # TenantId check only
│           └── overview/
│
├── www/                    # Platform landing (URL: /)
├── [tenant]/               # Tenant public pages
└── api/                    # API routes
```

## Testing

```bash
# 1. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin_sransa","password":"sransa2024"}' \
  -c /tmp/cookies.txt

# 2. Access dashboard
curl http://dashboard.aksesekolah.local:3000/tenant/overview \
  -b /tmp/cookies.txt

# Expected: 200 OK with dashboard content
# Header: x-middleware-rewrite: /dashboard/tenant/overview
```

## Next Steps

1. ✅ Fix signin API endpoint
2. ✅ Fix hostname detection
3. ✅ Implement URL rewrite
4. ✅ Move auth to platform layout
5. ✅ Simplify nested layouts
6. 🔄 Test in browser (currently blocked by file watch limit issue)
7. 🔄 Remove debug console.log statements
8. 🔄 Add proper error handling

## Notes

- File watch limit issue is system-level, not related to routing
- Rewrite mechanism works exactly like `/www` route
- Structure tetap intuitif dengan folder `dashboard/`
- URL tetap clean tanpa prefix `/dashboard`
