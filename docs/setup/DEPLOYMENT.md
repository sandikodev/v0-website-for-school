# AkseSekolah.id - Deployment Guide

## 🏗️ Architecture Overview

AkseSekolah.id follows **AWAN CLI conventions** for consistent infrastructure management across all services.

### Container Naming Pattern

```
{instance_id}-{service_id}-{component}[-{environment}]
```

**Examples:**
- Production: `clients-aksesekolah.id-school-app`
- Preview: `clients-aksesekolah.id-school-app-preview`
- Development: `clients-aksesekolah.id-school-app-dev`

### Environment Structure

```
┌─────────────────────────────────────────────────────────┐
│                    nginx-proxy                          │
│  Port 80/443 → SSL Termination → Proxy to containers   │
└─────────────────────────────────────────────────────────┘
                         ↓
        ┌────────────────┼────────────────┐
        ↓                ↓                 ↓
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Production   │  │ Preview      │  │ Development  │
│ :3000        │  │ :3000        │  │ :3000        │
│              │  │              │  │              │
│ aksesekolah  │  │ preview.     │  │ localhost    │
│ .id          │  │ aksesekolah  │  │ :3000        │
│              │  │ .id          │  │              │
└──────────────┘  └──────────────┘  └──────────────┘
```

## 📦 Environments

### 1. Development

**Purpose:** Local development with hot reload

**Container:** `clients-aksesekolah.id-school-app-dev`

**Access:**
- http://localhost:3000
- http://aksesekolah.local:3000

**Features:**
- Hot reload enabled
- Source code mounted
- Development database
- Debug mode

**Deploy:**
```bash
./deploy.sh dev
```

**Manual:**
```bash
docker compose -f docker-compose.dev.yml up -d
```

---

### 2. Preview/Staging

**Purpose:** Testing before production

**Container:** `clients-aksesekolah.id-school-app-preview`

**Access:**
- https://aksesekolah.preview

**Features:**
- Production build
- Staging database
- Same config as production
- Testing environment

**Deploy:**
```bash
./deploy.sh preview
```

**Manual:**
```bash
docker compose -f docker-compose.preview.yml up -d
```

---

### 3. Production

**Purpose:** Live production environment

**Container:** `clients-aksesekolah.id-school-app`

**Access:**
- https://aksesekolah.id
- https://www.aksesekolah.id
- https://dashboard.aksesekolah.id
- https://*.aksesekolah.id (tenants)

**Features:**
- Production build
- Production database
- SSL enabled
- Monitoring enabled

**Deploy:**
```bash
./deploy.sh prod
```

**Manual:**
```bash
docker compose up -d
```

## 🚀 Quick Start

### First Time Setup

1. **Clone repository** (if not already)
   ```bash
   cd instances/clients/services/aksesekolah.id
   ```

2. **Create .env file**
   ```bash
   cp .env.example .env
   nano .env
   ```

3. **Build and deploy**
   ```bash
   ./deploy.sh prod
   ```

### Regular Deployment

```bash
# Pull latest code
git pull

# Deploy to production
./deploy.sh prod

# Or deploy to preview first
./deploy.sh preview
# Test at https://aksesekolah.preview
# Then deploy to production
./deploy.sh prod
```

## 🔧 Manual Operations

### Build Image

```bash
# Production
docker compose build

# Development
docker compose -f docker-compose.dev.yml build

# Preview
docker compose -f docker-compose.preview.yml build
```

### Start/Stop Containers

```bash
# Start
docker compose up -d

# Stop
docker compose down

# Restart
docker compose restart

# View logs
docker compose logs -f
```

### Database Migrations

```bash
# Run migrations
docker exec clients-aksesekolah.id-school-app npx prisma migrate deploy

# Generate Prisma client
docker exec clients-aksesekolah.id-school-app npx prisma generate

# Seed database
docker exec clients-aksesekolah.id-school-app npx prisma db seed
```

### Nginx Operations

```bash
# Sync nginx config
cd /home/dev/web
./scripts/sync-nginx-config.sh

# Test nginx config
docker exec nginx-proxy nginx -t

# Reload nginx
docker exec nginx-proxy nginx -s reload

# View nginx logs
docker exec nginx-proxy tail -f /var/log/nginx/aksesekolah-main-access.log
```

## 🔍 Troubleshooting

### Container Not Starting

```bash
# Check logs
docker logs clients-aksesekolah.id-school-app

# Check if port is in use
docker ps | grep 3000

# Remove and recreate
docker compose down
docker compose up -d
```

### 502 Bad Gateway

```bash
# Check if container is running
docker ps | grep aksesekolah

# Check container health
docker inspect clients-aksesekolah.id-school-app --format='{{.State.Health.Status}}'

# Reload nginx (IP might have changed)
docker exec nginx-proxy nginx -s reload
```

### Middleware Not Working

```bash
# Rebuild image (middleware.ts needs to be compiled)
docker compose build --no-cache
docker compose up -d

# Check if middleware.ts exists in container
docker exec clients-aksesekolah.id-school-app ls -la /app/middleware.ts
```

### Database Connection Issues

```bash
# Check DATABASE_URL in .env
cat .env | grep DATABASE_URL

# Test database connection
docker exec clients-aksesekolah.id-school-app npx prisma db pull
```

## 📊 Monitoring

### Container Status

```bash
# Check all aksesekolah containers
docker ps --filter "name=aksesekolah"

# Check resource usage
docker stats clients-aksesekolah.id-school-app
```

### Application Logs

```bash
# View logs
docker logs clients-aksesekolah.id-school-app

# Follow logs
docker logs -f clients-aksesekolah.id-school-app

# Last 100 lines
docker logs --tail 100 clients-aksesekolah.id-school-app
```

### Health Check

```bash
# Check health endpoint
curl https://aksesekolah.id/api/health

# Expected response:
# {"status":"healthy","timestamp":"...","uptime":123.45}
```

## 🔐 Security

### Environment Variables

Never commit `.env` file to git. Always use `.env.example` as template.

**Required variables:**
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
- `NEXTAUTH_URL` - Full URL of the application

### SSL Certificates

Certificates are managed by Let's Encrypt and mounted from host:
- `/etc/letsencrypt/live/aksesekolah/` - Main domain
- `/etc/letsencrypt/live/wildcard-aksesekolah/` - Wildcard

### Network Security

- Containers only accessible via nginx-proxy
- No direct port exposure to host
- Internal network for service communication

## 📚 Related Documentation

- [NGINX_CONFIG_SYNC.md](docs/deployment/NGINX_CONFIG_SYNC.md) - Nginx configuration management
- [DASHBOARD_SETUP.md](docs/deployment/DASHBOARD_SETUP.md) - Dashboard setup guide
- [ARCHITECTURE.md](docs/ARCHITECTURE.md) - System architecture
- [MULTI-TENANT-SETUP.md](docs/MULTI-TENANT-SETUP.md) - Multi-tenant configuration

## 🎯 AWAN CLI Integration

This service follows AWAN CLI conventions:

**instance.yaml:**
```yaml
services:
  - id: "aksesekolah.id"
    name: "aksesekolah"
    template: "nextjs"
    status: "running"
    domains:
      - "aksesekolah.id"
      - "www.aksesekolah.id"
      - "*.aksesekolah.id"
```

**AWAN CLI commands:**
```bash
# List services
awan svc list -u clients

# Service info
awan svc info -u clients aksesekolah.id

# Start/stop
awan svc start -u clients aksesekolah.id
awan svc stop -u clients aksesekolah.id

# View logs
awan svc logs -u clients aksesekolah.id
```

---

**Last Updated:** 2025-11-28  
**Maintainer:** DevOps Team

