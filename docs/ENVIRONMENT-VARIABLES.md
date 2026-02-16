# Environment Variables Guide

## 🎯 Keep It Simple!

Hanya ada **3 environment variables yang WAJIB** untuk production:

```bash
DATABASE_URL="your-database-url"
NEXTAUTH_SECRET="your-secret"
JWT_SECRET="your-jwt-secret"
```

Sisanya optional atau punya default values yang sudah OK.

---

## 📋 Quick Setup

### Production

```bash
# 1. Copy template
cp .env.example .env

# 2. Edit 3 wajib variables
nano .env

# 3. Done!
```

### Local Development

```bash
# 1. Copy template
cp .env.local.example .env.local

# 2. No need to edit! Defaults are good for local dev

# 3. Done!
```

---

## 🔑 Required Variables

### 1. DATABASE_URL

**Production (Turso):**
```bash
DATABASE_URL="libsql://your-database.turso.io?authToken=your-token"
```

**Development (SQLite):**
```bash
DATABASE_URL="file:./prisma/dev.db"
```

**Get Turso URL:**
1. Sign up at https://turso.tech
2. Create database
3. Copy connection string

---

### 2. NEXTAUTH_SECRET

**Generate:**
```bash
openssl rand -base64 32
```

**Example:**
```bash
NEXTAUTH_SECRET="Xk7mP9qR2sT4vW6yZ8aB1cD3eF5gH7iJ9kL0mN2oP4qR6sT8uV0wX2yZ4aB6cD8e"
```

---

### 3. JWT_SECRET

**Generate:**
```bash
openssl rand -base64 32
```

**Example:**
```bash
JWT_SECRET="aB1cD3eF5gH7iJ9kL0mN2oP4qR6sT8uV0wX2yZ4aB6cD8eF0gH2iJ4kL6mN8oP0q"
```

---

## 🌐 Platform Configuration

### Auto-configured based on NODE_ENV

**Production (automatic):**
```bash
NEXT_PUBLIC_PLATFORM_DOMAIN="aksesekolah.id"
NEXT_PUBLIC_DASHBOARD_URL="https://dashboard.aksesekolah.id"
NEXTAUTH_URL="https://aksesekolah.id"
```

**Development (automatic):**
```bash
NEXT_PUBLIC_PLATFORM_DOMAIN="aksesekolah.local"
NEXT_PUBLIC_DASHBOARD_URL="http://dashboard.aksesekolah.local:3000"
NEXTAUTH_URL="http://aksesekolah.local:3000"
```

**Override if needed:**
```bash
# Custom domain
NEXT_PUBLIC_PLATFORM_DOMAIN="myschool.com"
NEXT_PUBLIC_DASHBOARD_URL="https://dashboard.myschool.com"
```

---

## 📊 All Variables Reference

### Core Settings

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | No | `production` | Environment mode |
| `PORT` | No | `3000` | Application port |

### Database

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | **Yes** | - | Database connection string |

### Authentication

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXTAUTH_SECRET` | **Yes** | - | NextAuth secret key |
| `JWT_SECRET` | **Yes** | - | JWT secret key |
| `NEXTAUTH_URL` | No | Auto | Full app URL |

### Platform

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_PLATFORM_DOMAIN` | No | `aksesekolah.id` | Platform domain |
| `NEXT_PUBLIC_DASHBOARD_URL` | No | Auto | Dashboard full URL |

### Custom Domains (Optional)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_CNAME_TARGET` | No | `cname.aksesekolah.id` | CNAME target |
| `NEXT_PUBLIC_A_RECORD_TARGET` | No | `76.76.21.21` | A record IP |

### Email (Optional)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SMTP_HOST` | No | - | SMTP server |
| `SMTP_PORT` | No | `587` | SMTP port |
| `SMTP_USER` | No | - | SMTP username |
| `SMTP_PASSWORD` | No | - | SMTP password |
| `SMTP_FROM` | No | - | From email address |

### Storage (Optional)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `STORAGE_TYPE` | No | `local` | Storage type |
| `S3_BUCKET` | No | - | S3 bucket name |
| `S3_REGION` | No | - | S3 region |
| `S3_ACCESS_KEY` | No | - | S3 access key |
| `S3_SECRET_KEY` | No | - | S3 secret key |

### Feature Flags (Optional)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ENABLE_REGISTRATION` | No | `true` | Enable user registration |
| `ENABLE_TENANT_CREATION` | No | `true` | Enable tenant creation |
| `ENABLE_CUSTOM_DOMAINS` | No | `true` | Enable custom domains |

---

## 🐳 Docker Environment

### Production (docker-compose.yml)

```yaml
environment:
  # Core
  - NODE_ENV=production
  - PORT=3000
  # Database
  - DATABASE_URL=${DATABASE_URL}
  # Authentication
  - JWT_SECRET=${JWT_SECRET}
  - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
  - NEXTAUTH_URL=https://${DOMAIN:-aksesekolah.id}
  # Platform
  - NEXT_PUBLIC_PLATFORM_DOMAIN=${DOMAIN:-aksesekolah.id}
  - NEXT_PUBLIC_DASHBOARD_URL=https://dashboard.${DOMAIN:-aksesekolah.id}
```

### Development (docker/dev/docker-compose.dev.yml)

```yaml
environment:
  # Core
  - NODE_ENV=development
  - PORT=3000
  # Database
  - DATABASE_URL=${DATABASE_URL:-postgresql://postgres:postgres@aksesekolah-db-dev:5432/aksesekolah_dev}
  # Authentication
  - NEXTAUTH_SECRET=${NEXTAUTH_SECRET:-dev-secret-key}
  - JWT_SECRET=${JWT_SECRET:-dev-jwt-secret}
  - NEXTAUTH_URL=http://aksesekolah.local:3000
  # Platform
  - NEXT_PUBLIC_PLATFORM_DOMAIN=aksesekolah.local
  - NEXT_PUBLIC_DASHBOARD_URL=http://dashboard.aksesekolah.local:3000
```

---

## 🔒 Security Best Practices

### 1. Never Commit Secrets

```bash
# .gitignore already includes:
.env
.env.local
.env.production
.env.development
```

### 2. Use Strong Secrets

```bash
# Generate strong secrets
openssl rand -base64 32

# Don't use:
❌ "secret"
❌ "password123"
❌ "my-secret-key"

# Use:
✅ "Xk7mP9qR2sT4vW6yZ8aB1cD3eF5gH7iJ9kL0mN2oP4qR6sT8uV0wX2yZ4aB6cD8e"
```

### 3. Different Secrets Per Environment

```bash
# Development
NEXTAUTH_SECRET="dev-secret-key"

# Production
NEXTAUTH_SECRET="Xk7mP9qR2sT4vW6yZ8aB1cD3eF5gH7iJ9kL0mN2oP4qR6sT8uV0wX2yZ4aB6cD8e"
```

### 4. Rotate Secrets Regularly

```bash
# Generate new secret
openssl rand -base64 32

# Update .env
# Restart application
```

---

## 🧪 Testing Configuration

### Check Current Config

```bash
# Show all environment variables
node -e "console.log(process.env)" | grep NEXT_PUBLIC

# Check specific variable
echo $NEXT_PUBLIC_PLATFORM_DOMAIN
```

### Verify in Application

```bash
# Visit health check endpoint
curl http://localhost:3000/api/health

# Response includes environment
{
  "status": "ok",
  "environment": "development",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## 📝 Checklist

### Production Setup

- [ ] Copy `.env.example` to `.env`
- [ ] Set `DATABASE_URL` (Turso)
- [ ] Generate and set `NEXTAUTH_SECRET`
- [ ] Generate and set `JWT_SECRET`
- [ ] Verify `NEXT_PUBLIC_PLATFORM_DOMAIN`
- [ ] Verify `NEXT_PUBLIC_DASHBOARD_URL`
- [ ] Test application startup
- [ ] Test database connection
- [ ] Test authentication

### Development Setup

- [ ] Copy `.env.local.example` to `.env.local`
- [ ] Run `sudo bash scripts/setup-local-hosts.sh`
- [ ] Run `pnpm prisma generate`
- [ ] Run `pnpm prisma migrate dev`
- [ ] Run `pnpm dev`
- [ ] Test `http://aksesekolah.local:3000`
- [ ] Test `http://dashboard.aksesekolah.local:3000`

---

## 🆘 Troubleshooting

### Issue: "DATABASE_URL not found"

```bash
# Check if .env exists
ls -la .env

# Check if variable is set
cat .env | grep DATABASE_URL

# Solution: Copy from example
cp .env.example .env
nano .env
```

### Issue: "Invalid secret"

```bash
# Generate new secret
openssl rand -base64 32

# Update .env
NEXTAUTH_SECRET="new-secret-here"

# Restart app
```

### Issue: "Cannot connect to dashboard subdomain"

```bash
# Check NEXT_PUBLIC_DASHBOARD_URL
echo $NEXT_PUBLIC_DASHBOARD_URL

# Should be:
# Production: https://dashboard.aksesekolah.id
# Development: http://dashboard.aksesekolah.local:3000

# Fix in .env or .env.local
```

---

## ✅ Summary

**Keep it simple:**
1. Only 3 required variables: `DATABASE_URL`, `NEXTAUTH_SECRET`, `JWT_SECRET`
2. Everything else has sensible defaults
3. Copy template, edit 3 variables, done!

**Files:**
- `.env.example` → Template for production
- `.env.local.example` → Template for development
- `.env` → Your production config (gitignored)
- `.env.local` → Your development config (gitignored)

**Remember:**
- Never commit `.env` files
- Use strong secrets
- Different secrets per environment
- Rotate secrets regularly

