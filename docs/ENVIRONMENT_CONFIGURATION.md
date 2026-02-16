# Environment Configuration Guide

## Overview

Konfigurasi environment untuk AkseSekolah.id menggunakan **environment variables** yang konsisten dan tidak hardcoded, memudahkan deployment di berbagai environment.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Environment Variables                     │
├─────────────────────────────────────────────────────────────┤
│  .env.development  →  docker-compose.dev.yml  →  Container  │
│  .env.production   →  docker-compose.yml      →  Container  │
│  .env.preview      →  docker-compose.preview.yml            │
└─────────────────────────────────────────────────────────────┘
```

## Key Principle: Single Source of Truth

**❌ Bad (Hardcoded):**
```yaml
environment:
  - PORT=3001
  - NEXTAUTH_URL=http://dashboard.aksesekolah.local:3001
ports:
  - "3001:3001"
```

**✅ Good (Variable-based):**
```yaml
environment:
  - PORT=${DEV_PORT:-3001}
  - NEXTAUTH_URL=http://dashboard.${DEV_DOMAIN:-aksesekolah.local}:${DEV_PORT:-3001}
ports:
  - "${DEV_PORT:-3001}:${DEV_PORT:-3001}"
```

## Environment Files

### 1. `.env.development`

Development-specific configuration:

```bash
# Development Port (must match in all places)
DEV_PORT=3001

# Development Domain
DEV_DOMAIN=aksesekolah.local

# Database
DATABASE_URL=postgresql://postgres:postgres@aksesekolah-db-dev:5432/aksesekolah_dev

# NextAuth
NEXTAUTH_SECRET=dev-secret-change-in-production

# Platform
NEXT_PUBLIC_PLATFORM_DOMAIN=aksesekolah.local
```

### 2. `.env` (Production)

Production configuration (already exists):

```bash
# Production Port (internal, behind nginx)
PROD_PORT=3000

# Production Domain
PROD_DOMAIN=aksesekolah.id

# Database - Turso
DATABASE_URL=libsql://aksesekolah-konxc.aws-ap-northeast-1.turso.io?authToken=...

# JWT
JWT_SECRET=your-jwt-secret-here

# NextAuth
NEXTAUTH_SECRET=your-nextauth-secret-here

# Platform
NEXT_PUBLIC_PLATFORM_DOMAIN=aksesekolah.id
```

### 3. `.env.preview` (Optional)

Preview/staging configuration:

```bash
# Preview Port
PREVIEW_PORT=3002

# Preview Domain
PREVIEW_DOMAIN=preview.aksesekolah.id

# Database
DATABASE_URL=libsql://aksesekolah-preview.turso.io?authToken=...
```

## Docker Compose Configuration

### Development (`docker-compose.dev.yml`)

```yaml
services:
  aksesekolah-dev:
    environment:
      - NODE_ENV=development
      - PORT=${DEV_PORT:-3001}
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_URL=http://dashboard.${DEV_DOMAIN:-aksesekolah.local}:${DEV_PORT:-3001}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET:-dev-secret}
      - NEXT_PUBLIC_PLATFORM_DOMAIN=${DEV_DOMAIN:-aksesekolah.local}
      - NEXT_PUBLIC_APP_URL=http://dashboard.${DEV_DOMAIN:-aksesekolah.local}:${DEV_PORT:-3001}
    
    ports:
      - "${DEV_PORT:-3001}:${DEV_PORT:-3001}"
```

**Key Points:**
- `PORT` matches both external and internal (3001:3001)
- URLs include port number
- Domain uses `.local` for development
- Default values provided with `:-` syntax

### Production (`docker-compose.yml`)

```yaml
services:
  aksesekolah:
    environment:
      - NODE_ENV=production
      - PORT=${PROD_PORT:-3000}
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_URL=https://${PROD_DOMAIN:-aksesekolah.id}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXT_PUBLIC_PLATFORM_DOMAIN=${PROD_DOMAIN:-aksesekolah.id}
      - NEXT_PUBLIC_APP_URL=https://${PROD_DOMAIN:-aksesekolah.id}
    
    # No ports exposed (accessed via nginx)
    networks:
      - nginx-net
```

**Key Points:**
- `PORT=3000` (internal only)
- No port in URLs (handled by nginx)
- HTTPS protocol
- No external port mapping

## Variable Reference

### Core Variables

| Variable | Development | Production | Description |
|----------|-------------|------------|-------------|
| `NODE_ENV` | development | production | Environment mode |
| `PORT` | 3001 | 3000 | Application port |
| `DEV_PORT` | 3001 | - | Development port |
| `PROD_PORT` | - | 3000 | Production port |
| `DEV_DOMAIN` | aksesekolah.local | - | Development domain |
| `PROD_DOMAIN` | - | aksesekolah.id | Production domain |

### URL Variables

| Variable | Development | Production |
|----------|-------------|------------|
| `NEXTAUTH_URL` | http://dashboard.aksesekolah.local:3001 | https://aksesekolah.id |
| `NEXT_PUBLIC_APP_URL` | http://dashboard.aksesekolah.local:3001 | https://aksesekolah.id |
| `NEXT_PUBLIC_PLATFORM_DOMAIN` | aksesekolah.local | aksesekolah.id |

### Database Variables

| Variable | Development | Production |
|----------|-------------|------------|
| `DATABASE_URL` | PostgreSQL local | Turso LibSQL |

## Usage

### Starting Development

```bash
# Load .env.development
export $(cat .env.development | xargs)

# Start containers
docker compose -f docker-compose.dev.yml up -d

# Verify environment
docker exec clients-aksesekolah-app-dev env | grep -E "(PORT|DOMAIN|URL)"
```

### Starting Production

```bash
# Load .env (production)
export $(cat .env | xargs)

# Start containers
docker compose -f docker-compose.yml up -d

# Verify environment
docker exec clients-aksesekolah-app env | grep -E "(PORT|DOMAIN|URL)"
```

### Changing Port (Development)

**Option 1: Edit `.env.development`**
```bash
# Change port
nano .env.development
# Update: DEV_PORT=3002

# Reload
export $(cat .env.development | xargs)
docker compose -f docker-compose.dev.yml up -d --force-recreate
```

**Option 2: Override at runtime**
```bash
# Temporary override
DEV_PORT=3002 docker compose -f docker-compose.dev.yml up -d
```

## Best Practices

### 1. Use Default Values

Always provide default values:
```yaml
- PORT=${DEV_PORT:-3001}  # Default to 3001 if not set
```

### 2. Consistent Naming

Use consistent prefixes:
- `DEV_*` for development
- `PROD_*` for production
- `PREVIEW_*` for preview

### 3. Document Variables

Always document what each variable does:
```bash
# Development Port (must match in all places)
DEV_PORT=3001
```

### 4. Validate Configuration

Create validation script:
```bash
#!/bin/bash
# validate-env.sh

required_vars=("DEV_PORT" "DEV_DOMAIN" "DATABASE_URL")

for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "❌ Missing: $var"
    exit 1
  fi
done

echo "✅ All required variables set"
```

### 5. Never Commit Secrets

Add to `.gitignore`:
```
.env
.env.local
.env.production
.env.*.local
```

Keep in repo:
```
.env.example
.env.development (without secrets)
```

## Troubleshooting

### Issue: Port mismatch after login

**Symptom:**
```
Login at: http://dashboard.aksesekolah.local:3001
Redirect to: http://dashboard.aksesekolah.local:3000
```

**Cause:** `PORT` variable not set correctly

**Fix:**
```bash
# Check current PORT
docker exec clients-aksesekolah-app-dev env | grep PORT

# Should show: PORT=3001

# If wrong, update .env.development and restart
export $(cat .env.development | xargs)
docker compose -f docker-compose.dev.yml up -d --force-recreate
```

### Issue: Environment variables not loaded

**Symptom:** Container uses default values instead of custom values

**Fix:**
```bash
# Method 1: Export before starting
export $(cat .env.development | xargs)
docker compose -f docker-compose.dev.yml up -d

# Method 2: Use --env-file
docker compose --env-file .env.development -f docker-compose.dev.yml up -d

# Method 3: Inline
DEV_PORT=3001 DEV_DOMAIN=aksesekolah.local docker compose -f docker-compose.dev.yml up -d
```

### Issue: URLs still hardcoded

**Symptom:** Some URLs don't respect environment variables

**Fix:** Check for hardcoded values in code:
```bash
# Search for hardcoded ports
grep -r "3001" app/ --include="*.tsx" --include="*.ts"

# Search for hardcoded domains
grep -r "aksesekolah.local" app/ --include="*.tsx" --include="*.ts"

# Replace with environment variables
# Use process.env.NEXT_PUBLIC_APP_URL instead
```

## Migration from Hardcoded

### Step 1: Identify Hardcoded Values

```bash
# Find all hardcoded ports
grep -r ":3001" . --include="*.yml" --include="*.yaml"

# Find all hardcoded domains
grep -r "aksesekolah.local" . --include="*.yml" --include="*.yaml"
```

### Step 2: Create Environment File

```bash
# Extract values to .env.development
echo "DEV_PORT=3001" > .env.development
echo "DEV_DOMAIN=aksesekolah.local" >> .env.development
```

### Step 3: Update Docker Compose

Replace hardcoded values with variables:
```yaml
# Before
- PORT=3001

# After
- PORT=${DEV_PORT:-3001}
```

### Step 4: Test

```bash
# Test with default values
docker compose -f docker-compose.dev.yml config

# Test with custom values
DEV_PORT=3002 docker compose -f docker-compose.dev.yml config
```

## Summary

**Benefits of Variable-based Configuration:**
- ✅ Easy to change ports without editing multiple files
- ✅ Consistent across all configuration files
- ✅ Environment-specific settings
- ✅ No hardcoded values
- ✅ Easy to maintain
- ✅ Supports multiple environments

**Key Files:**
- `.env.development` - Development configuration
- `.env` - Production configuration
- `docker-compose.dev.yml` - Development compose
- `docker-compose.yml` - Production compose

**Remember:**
- Always use `${VAR:-default}` syntax
- Document all variables
- Never commit secrets
- Test configuration before deploying

---

**Updated:** November 28, 2025
**Status:** ✅ Implemented
**Version:** 1.0.0
