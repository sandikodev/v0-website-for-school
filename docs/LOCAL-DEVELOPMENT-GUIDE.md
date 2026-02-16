# Local Development Guide

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- Node.js 20.9+ installed
- pnpm installed (`npm install -g pnpm`)
- Git installed

---

## 📋 Step-by-Step Setup

### 1. Clone & Install

```bash
# Clone repository
git clone <repository-url>
cd aksesekolah.id

# Install dependencies
pnpm install
```

### 2. Setup Local Hosts

```bash
# Add local domains to /etc/hosts
sudo bash scripts/setup-local-hosts.sh
```

This will add:
- `aksesekolah.local` - Platform WWW
- `dashboard.aksesekolah.local` - Dashboard
- `tenant1.aksesekolah.local` - Test tenant 1
- `syuhada.aksesekolah.local` - Test tenant 2
- `demo.aksesekolah.local` - Demo tenant

### 3. Setup Environment Variables

```bash
# Copy local development template
cp .env.local.example .env.local

# Edit if needed (optional)
nano .env.local
```

**Key variables for local development:**
```bash
NODE_ENV=development
DATABASE_URL="file:./prisma/dev.db"
NEXT_PUBLIC_PLATFORM_DOMAIN="aksesekolah.local"
NEXT_PUBLIC_DASHBOARD_URL="http://dashboard.aksesekolah.local:3000"
```

### 4. Setup Database

```bash
# Generate Prisma client
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev

# Seed database (optional)
pnpm prisma db seed
```

### 5. Start Development Server

```bash
# Start Next.js dev server
pnpm dev
```

Server will start on `http://localhost:3000`

---

## 🌐 Local URLs

### Platform URLs

```
http://aksesekolah.local:3000
└─ Landing page, marketing, public content

http://aksesekolah.local:3000/signin
└─ Login page (redirects to dashboard subdomain)
```

### Dashboard URLs (Clean!)

```
http://dashboard.aksesekolah.local:3000/signin
└─ Dashboard login page

http://dashboard.aksesekolah.local:3000/admin/overview
└─ Platform admin dashboard

http://dashboard.aksesekolah.local:3000/admin/tenants
└─ Manage schools

http://dashboard.aksesekolah.local:3000/admin/users
└─ Manage users

http://dashboard.aksesekolah.local:3000/tenant/overview
└─ Tenant dashboard

http://dashboard.aksesekolah.local:3000/tenant/admissions
└─ Manage SPMB
```

### Tenant URLs

```
http://tenant1.aksesekolah.local:3000
└─ Tenant 1 public website

http://syuhada.aksesekolah.local:3000
└─ Tenant 2 public website (SMP IT Masjid Syuhada)

http://demo.aksesekolah.local:3000
└─ Demo tenant public website
```

---

## 🔐 Test Credentials

### Platform Admin
```
URL: http://dashboard.aksesekolah.local:3000/signin
Username: admin
Password: admin123
```

### Tenant User (if seeded)
```
URL: http://dashboard.aksesekolah.local:3000/signin
Username: teacher
Password: password
```

---

## 🧪 Testing Flows

### Test 1: Admin Login Flow

```bash
1. Visit: http://aksesekolah.local:3000/signin
   OR: http://dashboard.aksesekolah.local:3000/signin

2. Login with:
   Username: admin
   Password: admin123

3. Should redirect to:
   http://dashboard.aksesekolah.local:3000/admin/overview

4. Check:
   ✓ Admin dashboard loads
   ✓ Navigation works
   ✓ Can access /admin/tenants
   ✓ Can access /admin/users
```

### Test 2: Tenant Login Flow

```bash
1. Visit: http://dashboard.aksesekolah.local:3000/signin

2. Login with tenant credentials

3. Should redirect to:
   http://dashboard.aksesekolah.local:3000/tenant/overview

4. Check:
   ✓ Tenant dashboard loads
   ✓ Navigation works
   ✓ Can access /tenant/admissions
   ✓ Can access /tenant/school
```

### Test 3: Blocked Access (Security)

```bash
1. Try to access:
   http://aksesekolah.local:3000/admin/overview

2. Should redirect to:
   http://dashboard.aksesekolah.local:3000/admin/overview

3. If not authenticated, redirects to:
   http://dashboard.aksesekolah.local:3000/signin
```

### Test 4: Tenant Public Site

```bash
1. Visit: http://syuhada.aksesekolah.local:3000

2. Should show:
   ✓ School homepage
   ✓ School branding (colors, logo)
   ✓ Public pages (admissions, contact, etc.)

3. Try to access:
   http://syuhada.aksesekolah.local:3000/admin

4. Should redirect to:
   http://dashboard.aksesekolah.local:3000/admin
```

---

## 🔧 Development Commands

### Database

```bash
# Generate Prisma client
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev

# Reset database
pnpm prisma migrate reset

# Open Prisma Studio (GUI)
pnpm prisma studio

# Seed database
pnpm prisma db seed
```

### Development

```bash
# Start dev server
pnpm dev

# Start dev server with Turbopack (faster)
pnpm dev --turbopack

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint

# Format code
pnpm format
```

### Testing

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run E2E tests
pnpm test:e2e
```

---

## 🐛 Troubleshooting

### Issue 1: "Cannot access dashboard.aksesekolah.local"

**Solution:**
```bash
# Check if hosts are added
cat /etc/hosts | grep aksesekolah

# If not, run setup script again
sudo bash scripts/setup-local-hosts.sh

# Verify DNS resolution
ping dashboard.aksesekolah.local
```

### Issue 2: "Cookie not shared between subdomains"

**Solution:**
```bash
# Check .env.local
cat .env.local | grep PLATFORM_DOMAIN

# Should be:
NEXT_PUBLIC_PLATFORM_DOMAIN="aksesekolah.local"

# Cookie domain should be: .aksesekolah.local (with dot)
```

### Issue 3: "Database connection error"

**Solution:**
```bash
# Check database file exists
ls -la prisma/dev.db

# If not, run migrations
pnpm prisma migrate dev

# Check DATABASE_URL in .env.local
cat .env.local | grep DATABASE_URL

# Should be:
DATABASE_URL="file:./prisma/dev.db"
```

### Issue 4: "Port 3000 already in use"

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port
PORT=3001 pnpm dev
```

### Issue 5: "Redirect loop on login"

**Solution:**
```bash
# Clear cookies
# In browser: DevTools → Application → Cookies → Clear all

# Check proxy.ts logic
# Make sure isDashboard detection is correct

# Check login API
# Make sure redirectUrl is correct
```

---

## 📊 Development Workflow

### Daily Development

```bash
# 1. Pull latest changes
git pull origin main

# 2. Install new dependencies (if any)
pnpm install

# 3. Run migrations (if any)
pnpm prisma migrate dev

# 4. Start dev server
pnpm dev

# 5. Make changes and test

# 6. Commit and push
git add .
git commit -m "feat: your changes"
git push origin your-branch
```

### Adding New Features

```bash
# 1. Create feature branch
git checkout -b feature/your-feature

# 2. Make changes

# 3. Test locally
pnpm dev

# 4. Build to check for errors
pnpm build

# 5. Commit and push
git add .
git commit -m "feat: your feature"
git push origin feature/your-feature

# 6. Create pull request
```

---

## 🎯 Key Files for Development

### Configuration
- `.env.local` - Local environment variables
- `next.config.mjs` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS configuration

### Core Logic
- `app/proxy.ts` - Multi-tenant routing logic
- `middleware.ts` - Middleware wrapper
- `lib/tenant-resolver.ts` - Tenant resolution logic
- `lib/auth/get-user-from-session.ts` - Auth helper

### Dashboard
- `app/(platform)/(dashboard)/admin/*` - Admin dashboard
- `app/(platform)/(dashboard)/tenant/*` - Tenant dashboard
- `app/(platform)/(auth)/*` - Auth pages

### Tenant Pages
- `app/[tenant]/*` - Tenant public pages
- `app/[tenant]/layout.tsx` - Tenant layout with branding

---

## 📝 Environment Variables Reference

### Required for Development

```bash
# Database
DATABASE_URL="file:./prisma/dev.db"

# Platform
NEXT_PUBLIC_PLATFORM_DOMAIN="aksesekolah.local"
NEXT_PUBLIC_DASHBOARD_URL="http://dashboard.aksesekolah.local:3000"

# Auth
NEXTAUTH_URL="http://aksesekolah.local:3000"
NEXTAUTH_SECRET="local-dev-secret"
JWT_SECRET="local-dev-jwt-secret"
```

### Optional for Development

```bash
# Email (skip in development)
SMTP_HOST=""
SMTP_PORT=""
SMTP_USER=""
SMTP_PASSWORD=""

# Storage (use local)
STORAGE_TYPE="local"

# Feature Flags
ENABLE_REGISTRATION="true"
ENABLE_TENANT_CREATION="true"
ENABLE_CUSTOM_DOMAINS="false"

# Debug
DEBUG="true"
NEXT_PUBLIC_DEBUG="true"
```

---

## 🚀 Ready for Production?

Before deploying to production:

- [ ] Update environment variables for production
- [ ] Setup production database (Turso)
- [ ] Configure DNS for production domains
- [ ] Setup SSL certificates
- [ ] Configure Nginx/reverse proxy
- [ ] Test all flows in production-like environment
- [ ] Setup monitoring and logging
- [ ] Configure backup strategy

See `docs/QUICK-DASHBOARD-SETUP.md` for production deployment guide.

---

## 📚 Additional Resources

- [Next.js 16 Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

---

## ✅ Checklist: First Time Setup

- [ ] Clone repository
- [ ] Install dependencies (`pnpm install`)
- [ ] Setup local hosts (`sudo bash scripts/setup-local-hosts.sh`)
- [ ] Copy `.env.local.example` to `.env.local`
- [ ] Generate Prisma client (`pnpm prisma generate`)
- [ ] Run migrations (`pnpm prisma migrate dev`)
- [ ] Seed database (optional)
- [ ] Start dev server (`pnpm dev`)
- [ ] Test admin login
- [ ] Test tenant login
- [ ] Test tenant public site

---

**Happy coding!** 🎉

If you encounter any issues, check the troubleshooting section or create an issue in the repository.

