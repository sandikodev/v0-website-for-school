# Architecture Overview

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         User Request                         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Nginx (TLS Termination)                   │
│  - Wildcard SSL: *.aksesekolah.id                           │
│  - Preserve Host header                                      │
│  - Proxy to localhost:3000                                   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   app/proxy.ts (Next.js 16)                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ 1. Check hostname                                      │  │
│  │    - aksesekolah.id → Platform (www)                  │  │
│  │    - *.aksesekolah.id → Tenant (subdomain)            │  │
│  │    - custom-domain.com → Tenant (custom)              │  │
│  │                                                        │  │
│  │ 2. Resolve tenant (cache-first)                       │  │
│  │    - Check in-memory cache (TTL: 5min)                │  │
│  │    - Fallback to database                             │  │
│  │                                                        │  │
│  │ 3. Add headers                                         │  │
│  │    - x-tenant-id                                       │  │
│  │    - x-tenant-slug                                     │  │
│  │    - x-tenant-domain                                   │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↓
        ┌─────────────────────┴─────────────────────┐
        ↓                     ↓                      ↓
┌──────────────┐    ┌──────────────────┐    ┌──────────────┐
│   (www)      │    │   (platform)     │    │   [jajal]    │
│              │    │                  │    │              │
│ Landing Page │    │ Platform Admin   │    │ Tenant Pages │
│ - Features   │    │ - Superadmin     │    │ - Homepage   │
│ - Pricing    │    │ - Dashboard      │    │ - Dashboard  │
│ - Contact    │    │ - Tenants Mgmt   │    │ - Admissions │
│              │    │                  │    │ - Contact    │
│ No Auth      │    │ Auth: admin role │    │ Tenant Theme │
└──────────────┘    └──────────────────┘    └──────────────┘
```

## 📂 Route Groups Explained

### 1. `(www)` - Platform Landing Page
**Purpose**: Public marketing site for the platform

**URL Pattern**: 
- `aksesekolah.id`
- `www.aksesekolah.id`

**Files**:
```
app/(www)/
├── page.tsx          # Homepage with features & pricing
└── layout.tsx        # Minimal layout, no auth
```

**Characteristics**:
- ✅ Public access (no authentication)
- ✅ Static content (can be cached)
- ✅ SEO optimized
- ✅ Marketing focused

---

### 2. `(platform)` - Platform Management
**Purpose**: Superadmin area for managing the entire platform

**URL Pattern**:
- `aksesekolah.id/admin/*`
- `aksesekolah.id/dashboard/*`

**Files**:
```
app/(platform)/
├── layout.tsx              # Auth check: role="admin"
├── (auth)/
│   ├── signin/
│   └── signup/
├── admin/
│   ├── dashboard/
│   ├── tenants/
│   ├── users/
│   └── settings/
├── admissions/             # Platform-level admissions
├── dashboard/              # Platform dashboard
└── registrar/              # Platform registrar
```

**Characteristics**:
- 🔒 Protected (requires authentication)
- 👑 Admin only (`role: "admin"`)
- 🎛️ Manage all tenants
- 📊 Platform-wide analytics
- ⚙️ System settings

**Auth Flow**:
```typescript
// app/(platform)/layout.tsx
const user = await getUserFromSession();
if (!user) redirect("/signin");
if (user.role !== "admin") redirect("/dashboard");
```

---

### 3. `[jajal]` - Tenant Pages
**Purpose**: Individual tenant websites (schools)

**URL Pattern**:
- `tenant1.aksesekolah.id/*` (subdomain)
- `smp-syuhada.sch.id/*` (custom domain)

**Files**:
```
app/[jajal]/
├── layout.tsx              # Tenant theming
├── page.tsx                # Tenant homepage
├── academic/
├── admissions/             # Tenant SPMB
├── contact/
├── dashboard/              # Tenant dashboard
├── facilities/
├── profile/
└── staff/
```

**Characteristics**:
- 🎨 Dynamic branding (colors, logo)
- 🏫 Tenant-specific content
- 👥 Public + authenticated pages
- 📝 SPMB (admissions system)
- 📊 Tenant dashboard

**Theming**:
```typescript
// app/[jajal]/layout.tsx
const tenant = await getTenantContext();
const theme = await getTenantTheme();

<div style={{
  "--primary": theme.primaryColor,
  "--secondary": theme.secondaryColor,
}}>
```

---

## 🔄 Request Flow Examples

### Example 1: Platform Homepage
```
User → https://aksesekolah.id
  ↓
Nginx → localhost:3000
  ↓
proxy.ts → hostname = "aksesekolah.id"
  ↓
isWWW = true → No tenant resolution
  ↓
Next.js → app/(www)/page.tsx
  ↓
Response: Landing page with pricing
```

### Example 2: Platform Admin
```
User → https://aksesekolah.id/admin/dashboard
  ↓
Nginx → localhost:3000
  ↓
proxy.ts → hostname = "aksesekolah.id"
  ↓
isWWW = true → No tenant resolution
  ↓
Next.js → app/(platform)/admin/dashboard/page.tsx
  ↓
layout.tsx → Check auth (role="admin")
  ↓
Response: Admin dashboard
```

### Example 3: Tenant Subdomain
```
User → https://syuhada.aksesekolah.id
  ↓
Nginx → localhost:3000
  ↓
proxy.ts → hostname = "syuhada.aksesekolah.id"
  ↓
Extract subdomain: "syuhada"
  ↓
getTenantByHost("syuhada")
  ↓
Cache hit → tenant data
  ↓
Add headers: x-tenant-id, x-tenant-slug
  ↓
Next.js → app/[jajal]/page.tsx
  ↓
layout.tsx → Apply tenant theme
  ↓
Response: Tenant homepage with branding
```

### Example 4: Tenant Custom Domain
```
User → https://smp-syuhada.sch.id
  ↓
DNS CNAME → cname.aksesekolah.id
  ↓
Nginx → localhost:3000
  ↓
proxy.ts → hostname = "smp-syuhada.sch.id"
  ↓
getTenantByHost("smp-syuhada.sch.id")
  ↓
Database lookup → tenant found
  ↓
Add headers: x-tenant-id, x-tenant-slug
  ↓
Next.js → app/[jajal]/page.tsx
  ↓
layout.tsx → Apply tenant theme
  ↓
Response: Tenant homepage with branding
```

---

## 🗄️ Database Schema

### Tenant Model
```prisma
model Tenant {
  id               String    @id @default(cuid())
  name             String    // "SMP IT Syuhada"
  slug             String    @unique // "syuhada"
  domain           String?   @unique // "smp-syuhada.sch.id"
  
  // Branding
  logo             String?
  favicon          String?
  primaryColor     String?   // "#10b981"
  secondaryColor   String?   // "#059669"
  
  // Domain config
  domainStatus     String    @default("pending")
  domainVerified   Boolean   @default(false)
  domainVerifiedAt DateTime?
  
  isActive         Boolean   @default(true)
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
  
  // Relations
  users            User[]
  schools          School[]
}
```

---

## 🚀 Performance Optimizations

### 1. Tenant Caching
```typescript
// lib/tenant-resolver.ts
const tenantCache = new Map<string, TenantCache>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Cache hit: ~0.1ms
// Cache miss: ~10-50ms (DB query)
```

### 2. Static Generation
```typescript
// (www) pages are statically generated
export const dynamic = 'force-static';

// (platform) pages are dynamic (auth required)
export const dynamic = 'force-dynamic';

// [jajal] pages are dynamic (tenant-specific)
// Auto-detected by Next.js
```

### 3. Edge Caching (Future)
```nginx
# Nginx caching for static assets
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}
```

---

## 🔐 Security Layers

### Layer 1: Nginx
- TLS termination
- Rate limiting
- DDoS protection

### Layer 2: proxy.ts
- Lightweight auth check (cookie exists?)
- Tenant resolution
- Header injection

### Layer 3: Layout
- Full authentication
- Role-based access control
- Session validation

### Layer 4: API Routes
- Request validation
- Tenant isolation
- Data sanitization

---

## 📊 Monitoring Points

### 1. Tenant Cache Hit Rate
```typescript
// Track in production
const cacheHits = 0;
const cacheMisses = 0;
const hitRate = cacheHits / (cacheHits + cacheMisses);
// Target: > 95%
```

### 2. Response Times
- proxy.ts: < 1ms (cache hit)
- proxy.ts: < 50ms (cache miss)
- Page render: < 200ms

### 3. Database Connections
- Monitor pool usage
- Alert on connection exhaustion
- Use PgBouncer for Postgres

---

## 🔄 Deployment Flow

```
1. Developer pushes code
   ↓
2. CI/CD runs tests
   ↓
3. Build Next.js app
   ↓
4. Deploy to VPS
   ↓
5. Nginx reload (zero-downtime)
   ↓
6. Health check
   ↓
7. Done ✅
```

---

## 📚 Related Documentation

- [MULTI-TENANT-SETUP.md](./MULTI-TENANT-SETUP.md) - Detailed setup guide
- [QUICK-START.md](./QUICK-START.md) - Quick start guide
- [../README.md](../README.md) - Project overview
