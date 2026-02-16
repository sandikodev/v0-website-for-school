# Local Development Guide

## 🚀 Quick Setup

### 1. Setup /etc/hosts (Automated)

```bash
# Run the setup script
sudo bash scripts/setup-local-hosts.sh
```

This will add:
```
127.0.0.1 aksesekolah.local
127.0.0.1 tenant1.aksesekolah.local
127.0.0.1 syuhada.aksesekolah.local
127.0.0.1 demo.aksesekolah.local
```

### 2. Start Development Server

```bash
pnpm dev
```

### 3. Access URLs

| URL | Purpose | Route Group |
|-----|---------|-------------|
| http://aksesekolah.local:3000 | Platform landing page | `(www)` |
| http://aksesekolah.local:3000/admin | Platform admin | `(platform)` |
| http://aksesekolah.local:3000/dashboard | Platform dashboard | `(platform)` |
| http://tenant1.aksesekolah.local:3000 | Tenant 1 homepage | `[jajal]` |
| http://syuhada.aksesekolah.local:3000 | Tenant 2 homepage | `[jajal]` |

---

## 📁 Project Structure

```
app/
├── (www)/                    # Platform landing page
│   ├── page.tsx              # Homepage with features & pricing
│   └── layout.tsx            # Minimal layout
│
├── (platform)/               # Platform management (superadmin)
│   ├── layout.tsx            # Auth check: role="admin"
│   ├── (auth)/               # Auth pages
│   │   ├── signin/
│   │   └── signup/
│   ├── admin/                # Superadmin pages
│   │   ├── dashboard/
│   │   ├── tenants/
│   │   └── settings/
│   ├── admissions/           # Platform admissions
│   ├── dashboard/            # Platform dashboard
│   └── registrar/            # Platform registrar
│
├── [jajal]/                  # Tenant pages (dynamic)
│   ├── layout.tsx            # Tenant theming
│   ├── page.tsx              # Tenant homepage
│   ├── academic/
│   ├── admissions/           # Tenant SPMB
│   ├── contact/
│   ├── dashboard/            # Tenant dashboard
│   ├── facilities/
│   ├── profile/
│   └── staff/
│
├── api/                      # API routes
│   ├── tenant/
│   ├── auth/
│   └── forms/
│
└── proxy.ts                  # Multi-tenant routing
```

---

## 🎯 Understanding Route Groups

### `(www)` - Platform Landing
- **Purpose**: Public marketing site
- **URL**: `aksesekolah.local`
- **Auth**: None (public)
- **Example**: Homepage, pricing, features

### `(platform)` - Platform Admin
- **Purpose**: Superadmin management
- **URL**: `aksesekolah.local/admin/*`
- **Auth**: Required (`role: "admin"`)
- **Example**: Manage tenants, system settings

### `[jajal]` - Tenant Pages
- **Purpose**: Individual tenant websites
- **URL**: `tenant1.aksesekolah.local/*`
- **Auth**: Mixed (public + protected)
- **Example**: School homepage, SPMB, dashboard

---

## 🔄 Request Flow

### Platform Request
```
http://aksesekolah.local:3000
  ↓
proxy.ts → hostname = "aksesekolah.local"
  ↓
isWWW = true → No tenant resolution
  ↓
app/(www)/page.tsx
  ↓
Landing page rendered
```

### Tenant Request
```
http://syuhada.aksesekolah.local:3000
  ↓
proxy.ts → hostname = "syuhada.aksesekolah.local"
  ↓
Extract subdomain: "syuhada"
  ↓
getTenantByHost("syuhada") → Cache/DB lookup
  ↓
Add headers: x-tenant-id, x-tenant-slug
  ↓
app/[jajal]/page.tsx
  ↓
Tenant homepage with branding
```

---

## 🗄️ Database Setup

### 1. Initialize Database
```bash
# Generate Prisma client
pnpm db:generate

# Push schema to database
pnpm db:push
```

### 2. Seed Data
```bash
# Seed all data (tenants, admin, SPMB, contact)
pnpm db:seed:all

# Or seed individually:
pnpm db:seed          # Basic data
pnpm db:seed:admin    # Admin user
pnpm db:seed:spmb     # SPMB settings
pnpm db:seed:contact  # Contact settings
```

### 3. Open Prisma Studio
```bash
pnpm db:studio
```

---

## 🎨 Creating a Test Tenant

### Option 1: Via Prisma Studio
```bash
pnpm db:studio

# Navigate to Tenant model
# Click "Add record"
# Fill:
{
  "name": "SMP IT Syuhada",
  "slug": "syuhada",
  "domain": null,
  "primaryColor": "#10b981",
  "secondaryColor": "#059669",
  "email": "info@syuhada.sch.id",
  "phone": "021-12345678",
  "isActive": true,
  "domainStatus": "active",
  "domainVerified": true
}
```

### Option 2: Via SQL
```bash
sqlite3 prisma/dev.db

INSERT INTO tenants (
  id, name, slug, primaryColor, secondaryColor, 
  isActive, domainStatus, domainVerified, createdAt, updatedAt
) VALUES (
  'tenant_' || hex(randomblob(16)),
  'SMP IT Syuhada',
  'syuhada',
  '#10b981',
  '#059669',
  1,
  'active',
  1,
  datetime('now'),
  datetime('now')
);
```

### Option 3: Via API
```bash
curl -X POST http://aksesekolah.local:3000/api/tenant/settings \
  -H "Content-Type: application/json" \
  -d '{
    "name": "SMP IT Syuhada",
    "slug": "syuhada",
    "primaryColor": "#10b981",
    "secondaryColor": "#059669",
    "email": "info@syuhada.sch.id",
    "phone": "021-12345678"
  }'
```

---

## 🧪 Testing Multi-Tenant

### 1. Test Platform Landing
```bash
curl http://aksesekolah.local:3000
# Should return: Platform landing page HTML
```

### 2. Test Tenant Resolution
```bash
curl -H "Host: syuhada.aksesekolah.local" http://localhost:3000
# Should return: Tenant homepage with Syuhada branding
```

### 3. Test Tenant Caching
```bash
# First request (cache miss)
time curl -H "Host: syuhada.aksesekolah.local" http://localhost:3000

# Second request (cache hit - should be faster)
time curl -H "Host: syuhada.aksesekolah.local" http://localhost:3000
```

### 4. Test Tenant Theming
```bash
# Check if tenant colors are applied
curl http://syuhada.aksesekolah.local:3000 | grep "10b981"
# Should find the primary color in inline styles
```

---

## 🐛 Troubleshooting

### Issue: "Tenant not found"

**Symptoms**: 404 or blank page on tenant subdomain

**Solutions**:
1. Check tenant exists in database:
   ```bash
   pnpm db:studio
   # Verify Tenant record exists with correct slug
   ```

2. Check tenant is active:
   ```sql
   SELECT * FROM tenants WHERE slug = 'syuhada';
   -- Verify: isActive = 1, domainStatus = 'active'
   ```

3. Clear tenant cache:
   ```bash
   # Restart dev server
   # Cache will be cleared automatically
   ```

### Issue: "Wrong tenant loaded"

**Symptoms**: Tenant A shows Tenant B's content

**Solutions**:
1. Check /etc/hosts:
   ```bash
   cat /etc/hosts | grep aksesekolah
   # Verify correct mappings
   ```

2. Check browser cache:
   ```
   Hard refresh: Ctrl+Shift+R (Linux/Windows)
   or Cmd+Shift+R (Mac)
   ```

3. Check proxy.ts logic:
   ```bash
   # Add debug logging in app/proxy.ts
   console.log('[Proxy] hostname:', hostname);
   console.log('[Proxy] tenant:', tenant);
   ```

### Issue: "Styles not applied"

**Symptoms**: Tenant colors not showing

**Solutions**:
1. Check tenant has colors:
   ```bash
   pnpm db:studio
   # Verify primaryColor and secondaryColor are set
   ```

2. Check CSS variables:
   ```
   Open DevTools → Elements → <div> with tenant theme
   Check inline styles: --primary, --secondary
   ```

3. Check component usage:
   ```typescript
   // Components should use tenant colors
   style={{ color: tenant.primaryColor }}
   ```

### Issue: "/etc/hosts not working"

**Symptoms**: DNS not resolving to localhost

**Solutions**:
1. Flush DNS cache:
   ```bash
   # Linux
   sudo systemd-resolve --flush-caches
   
   # macOS
   sudo dscacheutil -flushcache
   ```

2. Check /etc/hosts syntax:
   ```bash
   cat /etc/hosts
   # Format: 127.0.0.1 hostname (no http://)
   ```

3. Try with IP directly:
   ```bash
   curl -H "Host: syuhada.aksesekolah.local" http://127.0.0.1:3000
   ```

---

## 🔧 Development Tips

### 1. Hot Reload
Next.js will auto-reload on file changes. No need to restart server.

### 2. Debug Tenant Resolution
Add logging in `app/proxy.ts`:
```typescript
console.log('[Proxy] hostname:', hostname);
console.log('[Proxy] tenant:', tenant);
console.log('[Proxy] headers:', Object.fromEntries(requestHeaders));
```

### 3. Clear Tenant Cache
Restart dev server to clear in-memory cache:
```bash
# Stop: Ctrl+C
pnpm dev
```

### 4. Test Different Tenants
Create multiple tenants with different slugs:
- `tenant1` → http://tenant1.aksesekolah.local:3000
- `syuhada` → http://syuhada.aksesekolah.local:3000
- `demo` → http://demo.aksesekolah.local:3000

### 5. Use Prisma Studio
Best way to manage data during development:
```bash
pnpm db:studio
# Opens at http://localhost:5555
```

---

## 🧹 Cleanup

### Remove /etc/hosts entries
```bash
sudo bash scripts/cleanup-local-hosts.sh
```

### Reset Database
```bash
pnpm db:reset
# WARNING: This deletes all data!
```

### Clear Next.js Cache
```bash
rm -rf .next
pnpm dev
```

---

## 📚 Next Steps

1. Read [ARCHITECTURE.md](./ARCHITECTURE.md) for system overview
2. Read [MULTI-TENANT-SETUP.md](./MULTI-TENANT-SETUP.md) for production setup
3. Customize tenant pages in `app/[jajal]/`
4. Add custom components in `components/tenant/`
5. Configure Nginx for production (see `nginx/` folder)
