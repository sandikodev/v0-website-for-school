# Development Quick Reference

## 🚀 Quick Commands

```bash
# Setup (first time only)
sudo bash scripts/setup-local-hosts.sh
cp .env.local.example .env.local
pnpm install
pnpm prisma generate
pnpm prisma migrate dev

# Daily development
pnpm dev                    # Start dev server
pnpm build                  # Test build
pnpm prisma studio          # Open database GUI

# Database
pnpm prisma migrate dev     # Run migrations
pnpm prisma migrate reset   # Reset database
pnpm prisma db seed         # Seed data
```

---

## 🌐 Local URLs

### Platform
```
http://aksesekolah.local:3000              → Landing page
http://aksesekolah.local:3000/signin       → Login (redirects to dashboard)
```

### Dashboard (Clean URLs!)
```
http://dashboard.aksesekolah.local:3000/signin          → Login
http://dashboard.aksesekolah.local:3000/admin/overview  → Admin dashboard
http://dashboard.aksesekolah.local:3000/tenant/overview → Tenant dashboard
```

### Tenants
```
http://tenant1.aksesekolah.local:3000      → Tenant 1 public site
http://syuhada.aksesekolah.local:3000      → Tenant 2 public site
```

---

## 🔐 Test Credentials

```
Admin:
  Username: admin
  Password: admin123
  Access: /admin/*

Tenant:
  Username: teacher
  Password: password
  Access: /tenant/*
```

---

## 📁 Key Files

```
Configuration:
  .env.local                    → Local environment variables
  next.config.mjs               → Next.js config
  
Routing:
  app/proxy.ts                  → Multi-tenant routing
  middleware.ts                 → Middleware wrapper
  
Dashboard:
  app/(platform)/(dashboard)/admin/*   → Admin dashboard
  app/(platform)/(dashboard)/tenant/*  → Tenant dashboard
  
Tenant:
  app/[tenant]/*                → Tenant public pages
```

---

## 🐛 Quick Fixes

### Can't access .local domains?
```bash
sudo bash scripts/setup-local-hosts.sh
ping dashboard.aksesekolah.local
```

### Cookie not shared?
```bash
# Check .env.local
NEXT_PUBLIC_PLATFORM_DOMAIN="aksesekolah.local"
# Cookie domain should be: .aksesekolah.local
```

### Database error?
```bash
pnpm prisma generate
pnpm prisma migrate dev
```

### Port 3000 in use?
```bash
lsof -i :3000
kill -9 <PID>
# or
PORT=3001 pnpm dev
```

### Redirect loop?
```bash
# Clear browser cookies
# Check proxy.ts isDashboard logic
# Check login API redirectUrl
```

---

## 🎯 Development Flow

```
1. git pull origin main
2. pnpm install
3. pnpm prisma migrate dev
4. pnpm dev
5. Make changes
6. Test locally
7. git commit & push
```

---

## 📊 URL Structure

```
Production:
  aksesekolah.id                    → Platform WWW
  dashboard.aksesekolah.id/admin    → Admin dashboard
  dashboard.aksesekolah.id/tenant   → Tenant dashboard
  tenant.aksesekolah.id             → Tenant public site

Development:
  aksesekolah.local:3000                    → Platform WWW
  dashboard.aksesekolah.local:3000/admin    → Admin dashboard
  dashboard.aksesekolah.local:3000/tenant   → Tenant dashboard
  tenant.aksesekolah.local:3000             → Tenant public site
```

---

## ✅ Testing Checklist

```
- [ ] Admin login works
- [ ] Tenant login works
- [ ] Dashboard navigation works
- [ ] Tenant public site loads
- [ ] Tenant branding applied
- [ ] /admin blocked from non-dashboard domains
- [ ] /tenant blocked from non-dashboard domains
- [ ] Cookies shared across subdomains
```

---

## 🔗 Documentation

- Full guide: `docs/LOCAL-DEVELOPMENT-GUIDE.md`
- Dashboard setup: `docs/QUICK-DASHBOARD-SETUP.md`
- Clean URLs: `docs/CLEAN-DASHBOARD-URLS.md`
- Next.js 16: `docs/NEXTJS-16-COMPATIBILITY.md`

