# Quick Start Guide

## 🚀 Setup Development Environment

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Setup Database
```bash
# Generate Prisma client
pnpm db:generate

# Push schema to database
pnpm db:push

# Seed initial data
pnpm db:seed:all
```

### 3. Environment Variables
```bash
cp .env.example .env

# Edit .env
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_PLATFORM_DOMAIN="aksesekolah.id"
```

### 4. Start Development Server
```bash
pnpm dev
```

## 🌐 Access URLs

### Platform (WWW)
- **URL**: http://localhost:3000
- **Page**: Landing page dengan pricing & features

### Platform Admin
- **URL**: http://localhost:3000/admin
- **Login**: admin@example.com / password
- **Purpose**: Manage tenants & system

### Tenant (Subdomain)
Edit `/etc/hosts`:
```bash
sudo nano /etc/hosts

# Add:
127.0.0.1 aksesekolah.local
127.0.0.1 tenant1.aksesekolah.local
127.0.0.1 syuhada.aksesekolah.local
```

Then access:
- **Platform**: http://aksesekolah.local:3000
- **Tenant 1**: http://tenant1.aksesekolah.local:3000
- **Tenant 2**: http://syuhada.aksesekolah.local:3000

## 📝 Create Your First Tenant

### Option 1: Via Seed Script
```bash
# Edit scripts/seed-database.js
# Add your tenant data

pnpm db:seed
```

### Option 2: Via Prisma Studio
```bash
pnpm db:studio

# Navigate to Tenant model
# Click "Add record"
# Fill:
#   - name: "SMP IT Syuhada"
#   - slug: "syuhada"
#   - domain: null (or custom domain)
#   - primaryColor: "#10b981"
#   - secondaryColor: "#059669"
```

### Option 3: Via API
```bash
curl -X POST http://localhost:3000/api/tenant/settings \
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

## 🎨 Customize Tenant Branding

### 1. Update Tenant Settings
```typescript
// Via dashboard: /admin/tenants/[id]/edit

// Or via API:
PUT /api/tenant/settings
{
  "name": "SMP IT Syuhada",
  "slug": "syuhada",
  "logo": "/uploads/logo.png",
  "favicon": "/uploads/favicon.ico",
  "primaryColor": "#10b981",
  "secondaryColor": "#059669"
}
```

### 2. Colors Will Apply Automatically
- Hero section background
- Buttons
- Links
- Stats section
- CTA section

### 3. Logo & Favicon
Upload via dashboard or place in `/public/uploads/`

## 🔐 Authentication

### Admin Login
```
URL: /admin
Email: admin@example.com
Password: (set during seed)
```

### Tenant Admin Login
```
URL: /dashboard
Email: tenant@example.com
Password: (set during seed)
```

## 📊 Database Commands

```bash
# Generate Prisma client
pnpm db:generate

# Push schema changes
pnpm db:push

# Open Prisma Studio
pnpm db:studio

# Seed database
pnpm db:seed:all

# Reset database (WARNING: deletes all data)
pnpm db:reset
```

## 🏗️ Build for Production

```bash
# Build
pnpm build

# Start production server
pnpm start
```

## 📁 Project Structure

```
app/
├── (www)/              # Platform landing page
│   ├── page.tsx        # Homepage
│   └── layout.tsx
│
├── (platform)/         # Platform admin
│   └── admin/
│       ├── dashboard/
│       ├── tenants/
│       └── settings/
│
├── [jajal]/            # Tenant pages (dynamic)
│   ├── page.tsx        # Tenant homepage
│   ├── dashboard/      # Tenant dashboard
│   ├── admissions/     # SPMB
│   └── contact/        # Contact form
│
├── api/                # API routes
│   ├── tenant/
│   ├── auth/
│   └── forms/
│
└── proxy.ts            # Multi-tenant routing

components/
├── tenant/             # Tenant-specific components
│   ├── stats-section.tsx
│   ├── features-section.tsx
│   └── cta-section.tsx
│
└── ui/                 # Shared UI components

lib/
├── tenant-resolver.ts  # Tenant caching & resolution
├── tenant/
│   └── get-tenant-context.ts
└── auth/
    └── get-user-from-session.ts
```

## 🐛 Troubleshooting

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Regenerate Prisma client
pnpm db:generate

# Rebuild
pnpm build
```

### Tenant Not Loading
1. Check tenant exists in database
2. Check slug matches URL
3. Restart dev server
4. Clear browser cache

### Styling Not Applied
1. Check tenant.primaryColor in database
2. Check browser DevTools for CSS variables
3. Hard refresh (Ctrl+Shift+R)

## 📚 Next Steps

1. Read [MULTI-TENANT-SETUP.md](./MULTI-TENANT-SETUP.md) for architecture details
2. Configure Nginx for production (see nginx/ folder)
3. Setup wildcard SSL certificate
4. Configure custom domains
5. Setup Redis for caching (optional)

## 🆘 Need Help?

- Check documentation in `/docs`
- Review code comments
- Check Prisma schema in `/prisma/schema.prisma`
- Open issue on GitHub
