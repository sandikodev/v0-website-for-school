# Environment Configuration - Quick Reference

## 🎯 Problem Solved

**Before (Hardcoded):**
- Port 3001 hardcoded di banyak tempat
- Sulit mengubah konfigurasi
- Tidak konsisten antar environment

**After (Variable-based):**
- Single source of truth: `.env.development`
- Mudah mengubah port/domain
- Konsisten di semua file

## 📝 Quick Setup

### 1. Development Environment

**File: `.env.development`**
```bash
DEV_PORT=3001
DEV_DOMAIN=aksesekolah.local
```

**Start:**
```bash
docker compose -f docker-compose.dev.yml up -d
```

**Access:**
- Dashboard: `http://dashboard.aksesekolah.local:3001`
- Tenant: `http://smpn1srandakan.aksesekolah.local:3001`

### 2. Production Environment

**File: `.env`**
```bash
PROD_PORT=3000
PROD_DOMAIN=aksesekolah.id
```

**Start:**
```bash
docker compose -f docker-compose.yml up -d
```

**Access:**
- Dashboard: `https://dashboard.aksesekolah.id`
- Tenant: `https://smpn1srandakan.aksesekolah.id`

## 🔧 Change Port

### Development

**Option 1: Edit `.env.development`**
```bash
# Change port to 3002
echo "DEV_PORT=3002" > .env.development

# Restart
docker compose -f docker-compose.dev.yml up -d --force-recreate
```

**Option 2: Runtime Override**
```bash
DEV_PORT=3002 docker compose -f docker-compose.dev.yml up -d
```

## ✅ Verify Configuration

```bash
# Check environment variables
docker exec clients-aksesekolah-app-dev env | grep -E "(PORT|URL|DOMAIN)"

# Should show:
# PORT=3001
# NEXTAUTH_URL=http://dashboard.aksesekolah.local:3001
# NEXT_PUBLIC_APP_URL=http://dashboard.aksesekolah.local:3001
# NEXT_PUBLIC_PLATFORM_DOMAIN=aksesekolah.local
```

## 🚨 Troubleshooting

### Port mismatch after login?

```bash
# 1. Check PORT variable
docker exec clients-aksesekolah-app-dev env | grep PORT

# 2. If wrong, restart with correct port
docker compose -f docker-compose.dev.yml down
docker compose -f docker-compose.dev.yml up -d
```

### Environment not loading?

```bash
# Force recreate containers
docker compose -f docker-compose.dev.yml up -d --force-recreate
```

## 📚 Full Documentation

- Complete guide: `docs/ENVIRONMENT_CONFIGURATION.md`
- Port issue fix: `docs/DEVELOPMENT_PORT_ISSUE.md`

---

**Key Principle:** One variable to rule them all! 🎯
