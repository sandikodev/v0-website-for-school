# Routing Architecture - AkseSekolah.id

## 🎯 Design Philosophy

**Explicit over Implicit**: Gunakan folder biasa (bukan route groups) untuk clarity, dan proxy untuk routing logic.

---

## 📁 App Structure

```
app/
├── layout.tsx                    # Root layout (universal)
├── proxy.ts                      # Routing logic (middleware)
│
├── www/                          # Platform landing (NOT route group!)
│   ├── layout.tsx                # WWW layout
│   └── page.tsx                  # Landing page
│
├── (platform)/                   # Dashboard (route group)
│   ├── layout.tsx                # Platform layout
│   ├── (auth)/                   # Auth pages
│   │   ├── signin/
│   │   └── signup/
│   └── (dashboard)/              # Dashboard routes
│       ├── admin/                # Admin dashboard
│       └── tenant/               # Tenant dashboard
│
├── [tenant]/                     # Tenant sites (dynamic)
│   ├── layout.tsx                # Tenant layout
│   └── page.tsx                  # Tenant homepage
│
├── login/                        # Shared login
├── register/                     # Shared register
└── api/                          # API routes
```

---

## 🌐 Domain to Route Mapping

### Platform Landing (WWW)

```
Domain:
  aksesekolah.id
  www.aksesekolah.id
  aksesekolah.local (dev)
  www.aksesekolah.local (dev)
  localhost (dev)

Route:
  app/www/

Proxy Logic:
  / → rewrite to → /www
  /about → rewrite to → /www/about
  /contact → rewrite to → /www/contact
```

**Why `www` folder (not route group)?**
- ✅ Explicit: Clear that this is WWW content
- ✅ Separation: Not mixed with other routes
- ✅ Flexibility: Can have /www/api, /www/admin, etc.
- ✅ No confusion: No hidden route groups

---

### Dashboard

```
Domain:
  dashboard.aksesekolah.id
  dashboard.aksesekolah.local (dev)

Route:
  app/(platform)/(dashboard)/admin/
  app/(platform)/(dashboard)/tenant/

Proxy Logic:
  /admin/* → app/(platform)/(dashboard)/admin/*
  /tenant/* → app/(platform)/(dashboard)/tenant/*
  /signin → app/(platform)/(auth)/signin/
```

**Why route groups here?**
- ✅ Clean URLs: `/admin/overview` not `/platform/dashboard/admin/overview`
- ✅ Shared layout: (platform) for auth, (dashboard) for nav
- ✅ Organization: Group related routes

---

### Tenant Sites

```
Domain:
  tenant1.aksesekolah.id
  syuhada.aksesekolah.id
  custom-domain.com

Route:
  app/[tenant]/

Proxy Logic:
  / → app/[tenant]/page.tsx
  /admissions → app/[tenant]/admissions/page.tsx
  /contact → app/[tenant]/contact/page.tsx
  
Headers:
  x-tenant-id: tenant_xxx
  x-tenant-slug: tenant1
```

**Why dynamic route?**
- ✅ Multi-tenant: One codebase, many sites
- ✅ Dynamic: Tenant resolved at runtime
- ✅ Scalable: Add tenants without code changes

---

## 🔄 Proxy Logic Flow

### 1. Dashboard Subdomain

```typescript
if (hostname === 'dashboard.aksesekolah.id') {
  // Block /admin, /tenant from non-dashboard domains
  if (isDashboardRoute && !isDashboard) {
    redirect to dashboard subdomain
  }
  
  // Allow dashboard routes
  return NextResponse.next()
}
```

### 2. Platform Domain (WWW)

```typescript
if (hostname === 'aksesekolah.id' || hostname === 'localhost') {
  // Rewrite root to /www
  if (pathname === '/') {
    return NextResponse.rewrite('/www')
  }
  
  // Allow other platform routes (/login, /register)
  return NextResponse.next()
}
```

### 3. Tenant Subdomain

```typescript
if (hostname.endsWith('.aksesekolah.id')) {
  const subdomain = extractSubdomain(hostname)
  const tenant = await getTenantByHost(subdomain)
  
  if (tenant) {
    // Add tenant context to headers
    headers.set('x-tenant-id', tenant.id)
    return NextResponse.next({ headers })
  }
}
```

---

## 📊 URL Examples

### Development

```
# Platform Landing
http://aksesekolah.local:3000           → app/www/page.tsx
http://www.aksesekolah.local:3000       → app/www/page.tsx
http://localhost:3000                   → app/www/page.tsx

# Dashboard
http://dashboard.aksesekolah.local:3000/admin/overview
  → app/(platform)/(dashboard)/admin/overview/page.tsx

http://dashboard.aksesekolah.local:3000/tenant/overview
  → app/(platform)/(dashboard)/tenant/overview/page.tsx

# Tenant
http://tenant1.aksesekolah.local:3000   → app/[tenant]/page.tsx
http://syuhada.aksesekolah.local:3000   → app/[tenant]/page.tsx
```

### Production

```
# Platform Landing
https://aksesekolah.id                  → app/www/page.tsx
https://www.aksesekolah.id              → app/www/page.tsx

# Dashboard
https://dashboard.aksesekolah.id/admin/overview
  → app/(platform)/(dashboard)/admin/overview/page.tsx

https://dashboard.aksesekolah.id/tenant/overview
  → app/(platform)/(dashboard)/tenant/overview/page.tsx

# Tenant
https://tenant1.aksesekolah.id          → app/[tenant]/page.tsx
https://custom-domain.com               → app/[tenant]/page.tsx
```

---

## 🎨 Design Benefits

### 1. Explicit Routing

```
❌ Route Groups (Implicit):
app/(www)/page.tsx → URL: /
  Problem: Hidden, confusing, "where did (www) go?"

✅ Explicit Folder + Proxy (Explicit):
app/www/page.tsx → Proxy rewrite → URL: /
  Benefit: Clear, explicit, proxy handles routing
```

### 2. Clear Separation

```
app/
├── www/          → Platform landing (explicit)
├── (platform)/   → Dashboard (route group for clean URLs)
└── [tenant]/     → Tenant sites (dynamic)

Each has clear purpose and location!
```

### 3. Flexible Routing

```
Platform domain can have:
- / → app/www/page.tsx (rewritten)
- /login → app/login/page.tsx (direct)
- /register → app/register/page.tsx (direct)
- /api/* → app/api/* (direct)

Proxy decides routing logic!
```

### 4. Scalability

```
Easy to add:
- app/www/blog/ → Platform blog
- app/www/docs/ → Platform docs
- app/www/pricing/ → Pricing page

No route group confusion!
```

---

## 🔧 Implementation Details

### Proxy Rewrite Logic

```typescript
// app/proxy.ts

// Platform domain (WWW)
if (isWWW) {
  // Rewrite root to /www
  if (pathname === '/') {
    const url = request.nextUrl.clone()
    url.pathname = '/www'
    return NextResponse.rewrite(url)
  }
  
  // Allow other routes
  return NextResponse.next()
}
```

### Why Rewrite (not Redirect)?

```
Rewrite:
  Browser sees: https://aksesekolah.id/
  Server serves: app/www/page.tsx
  ✅ Clean URL, correct content

Redirect:
  Browser sees: https://aksesekolah.id/www
  Server serves: app/www/page.tsx
  ❌ Ugly URL, but correct content
```

---

## 📝 Best Practices

### 1. Use Folders for Explicit Routes

```
✅ app/www/ → Platform landing
✅ app/blog/ → Platform blog
✅ app/docs/ → Platform docs

❌ app/(www)/ → Hidden, confusing
```

### 2. Use Route Groups for Clean URLs

```
✅ app/(platform)/(dashboard)/admin/
   URL: /admin/* (clean!)

❌ app/platform/dashboard/admin/
   URL: /platform/dashboard/admin/* (ugly!)
```

### 3. Use Dynamic Routes for Multi-Tenant

```
✅ app/[tenant]/ → One codebase, many sites

❌ app/tenant1/, app/tenant2/, ... → Not scalable
```

### 4. Let Proxy Handle Routing Logic

```
✅ Proxy decides: domain → route mapping
✅ Flexible: Easy to change routing
✅ Centralized: One place for routing logic

❌ Rely on Next.js conventions only
❌ Scattered: Routing logic everywhere
```

---

## ✅ Summary

**Architecture:**
- `app/www/` → Platform landing (explicit folder)
- `app/(platform)/` → Dashboard (route group for clean URLs)
- `app/[tenant]/` → Tenant sites (dynamic route)

**Routing:**
- Proxy handles domain → route mapping
- Rewrite for clean URLs
- Headers for tenant context

**Benefits:**
- ✅ Explicit and clear
- ✅ Flexible and scalable
- ✅ Clean URLs
- ✅ Easy to maintain

**This is a brilliant architecture!** 🎉

