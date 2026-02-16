# Multi-Tenant Setup Guide

## Arsitektur

Project ini menggunakan arsitektur multi-tenant dengan subdomain dan custom domain support.

### Route Structure

```
app/
├── (www)/              # Platform landing page
│   ├── page.tsx        # https://aksesekolah.id
│   └── layout.tsx
│
├── (platform)/         # Platform admin (superadmin)
│   └── admin/          # https://aksesekolah.id/admin
│
└── [jajal]/            # Tenant pages (dynamic)
    ├── page.tsx        # https://tenant1.aksesekolah.id
    ├── dashboard/      # https://tenant1.aksesekolah.id/dashboard
    └── admissions/     # https://tenant1.aksesekolah.id/admissions
```

## URL Routing

### 1. Platform WWW (Landing Page)
- **URL**: `https://aksesekolah.id` atau `https://www.aksesekolah.id`
- **Route**: `app/(www)/page.tsx`
- **Purpose**: Marketing page, pricing, features

### 2. Platform Admin (Superadmin)
- **URL**: `https://aksesekolah.id/admin`
- **Route**: `app/(platform)/admin/`
- **Purpose**: Manage tenants, system settings
- **Auth**: Requires `role: "admin"`

### 3. Tenant Subdomain
- **URL**: `https://tenant1.aksesekolah.id`
- **Route**: `app/[jajal]/page.tsx`
- **Purpose**: Tenant-specific website
- **Branding**: Dynamic colors, logo, content

### 4. Tenant Custom Domain
- **URL**: `https://smp-syuhada.sch.id`
- **Route**: `app/[jajal]/page.tsx`
- **Purpose**: Custom domain for tenant
- **Setup**: DNS CNAME to platform

## How It Works

### 1. Request Flow

```
User Request
    ↓
Nginx (TLS termination)
    ↓
proxy.ts (Tenant resolution)
    ↓
├─ www.aksesekolah.id → (www) route group
├─ aksesekolah.id/admin → (platform) route group
├─ tenant1.aksesekolah.id → [jajal] with tenant headers
└─ custom-domain.com → [jajal] with tenant headers
```

### 2. Tenant Resolution (proxy.ts)

```typescript
// 1. Check if WWW/platform domain
if (hostname === "aksesekolah.id") {
  return NextResponse.next(); // Use (www) routes
}

// 2. Check if subdomain
if (hostname.endsWith(".aksesekolah.id")) {
  const tenant = await getTenantByHost(subdomain);
  // Add tenant headers
  headers.set("x-tenant-id", tenant.id);
  return NextResponse.next(); // Use [jajal] routes
}

// 3. Check if custom domain
const tenant = await getTenantByHost(hostname);
if (tenant) {
  // Add tenant headers
  return NextResponse.next(); // Use [jajal] routes
}
```

### 3. Tenant Context (layout.tsx)

```typescript
// Read tenant from headers (set by proxy.ts)
const tenant = await getTenantContext();

// Apply dynamic theming
<div style={{
  "--primary": tenant.primaryColor,
  "--secondary": tenant.secondaryColor,
}}>
```

## Caching Strategy

### In-Memory Cache (Current)
- **TTL**: 5 minutes
- **Storage**: Map<hostname, tenant>
- **Invalidation**: On tenant update

### Redis Cache (Future)
For multi-server deployment:
```typescript
// lib/tenant-resolver.ts
const cached = await redis.get(`tenant:${host}`);
if (cached) return JSON.parse(cached);

const tenant = await prisma.tenant.findFirst(...);
await redis.setex(`tenant:${host}`, 300, JSON.stringify(tenant));
```

## Environment Variables

```env
# Platform domain
NEXT_PUBLIC_PLATFORM_DOMAIN=aksesekolah.id

# For custom domains
NEXT_PUBLIC_CNAME_TARGET=cname.aksesekolah.id
NEXT_PUBLIC_A_RECORD_TARGET=1.2.3.4
```

## DNS Setup

### Subdomain (tenant1.aksesekolah.id)
```
A     *.aksesekolah.id    → 1.2.3.4
```

### Custom Domain (smp-syuhada.sch.id)
```
CNAME smp-syuhada.sch.id  → cname.aksesekolah.id
```

## Nginx Configuration

```nginx
server {
  listen 443 ssl http2;
  server_name .aksesekolah.id aksesekolah.id;
  
  # Wildcard SSL
  ssl_certificate     /etc/letsencrypt/live/aksesekolah.id/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/aksesekolah.id/privkey.pem;
  
  location / {
    proxy_pass         http://127.0.0.1:3000;
    proxy_set_header   Host              $host;
    proxy_set_header   X-Forwarded-Host  $host;
    proxy_set_header   X-Forwarded-Proto $scheme;
    proxy_set_header   X-Real-IP         $remote_addr;
  }
}
```

## Testing Locally

### Using /etc/hosts (Recommended)
```bash
# Edit /etc/hosts
sudo nano /etc/hosts

# Add these lines:
127.0.0.1 aksesekolah.local
127.0.0.1 tenant1.aksesekolah.local
127.0.0.1 syuhada.aksesekolah.local
127.0.0.1 demo.aksesekolah.local

# Save and exit (Ctrl+X, Y, Enter)
```

### Start Development Server
```bash
pnpm dev
```

### Access URLs
```
Platform WWW:
http://aksesekolah.local:3000

Platform Admin:
http://aksesekolah.local:3000/admin
http://aksesekolah.local:3000/dashboard

Tenant 1 (subdomain):
http://tenant1.aksesekolah.local:3000

Tenant 2 (subdomain):
http://syuhada.aksesekolah.local:3000
```

### Alternative: Using lvh.me (automatic localhost DNS)
```bash
# No /etc/hosts needed, works automatically:
# - http://lvh.me:3000 → Platform WWW
# - http://tenant1.lvh.me:3000 → Tenant 1
# - http://syuhada.lvh.me:3000 → Tenant 2
```

## Creating a New Tenant

### 1. Via Admin Dashboard
```
1. Login as admin
2. Go to /admin/tenants
3. Click "Add Tenant"
4. Fill: name, slug, domain (optional)
5. Save
```

### 2. Via API
```bash
curl -X POST http://localhost:3000/api/tenant/settings \
  -H "Content-Type: application/json" \
  -d '{
    "name": "SMP IT Syuhada",
    "slug": "syuhada",
    "domain": "smp-syuhada.sch.id",
    "primaryColor": "#10b981",
    "secondaryColor": "#059669"
  }'
```

### 3. Via Prisma Studio
```bash
pnpm db:studio

# Create new Tenant record
```

## Troubleshooting

### Tenant not found
1. Check DNS resolves to correct IP
2. Check tenant exists in database
3. Check domain/slug matches
4. Clear tenant cache: restart server

### Wrong tenant loaded
1. Check proxy.ts headers
2. Check getTenantContext() logic
3. Clear browser cache
4. Check tenant cache TTL

### Styling not applied
1. Check tenant.primaryColor exists
2. Check CSS variables in layout
3. Check component uses tenant theme
4. Inspect element for inline styles

## Performance Tips

1. **Enable Redis caching** for production
2. **Use CDN** for static assets
3. **Enable Nginx caching** for static pages
4. **Monitor cache hit rate**
5. **Set appropriate TTL** (5-15 minutes)

## Security Considerations

1. **Validate tenant ownership** in API routes
2. **Isolate tenant data** in queries
3. **Rate limit** per tenant
4. **Sanitize custom domains** before DNS setup
5. **Verify domain ownership** before activation
