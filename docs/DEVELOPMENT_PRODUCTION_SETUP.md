# Development & Production Setup - Running Together

## Overview

Anda **BISA** menjalankan production dan development container bersamaan tanpa crash, asalkan dikonfigurasi dengan benar.

## Arsitektur Multi-Environment

```
┌─────────────────────────────────────────────────────────────┐
│                    Nginx Proxy (Port 80/443)                 │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
        ┌───────▼────────┐         ┌───────▼────────┐
        │   Production   │         │  Development   │
        │   Container    │         │   Container    │
        ├────────────────┤         ├────────────────┤
        │ Port: 3000     │         │ Port: 3001     │
        │ Name: prod-app │         │ Name: dev-app  │
        │ Domain:        │         │ Domain:        │
        │ aksesekolah.id │         │ dev.local:3001 │
        └────────────────┘         └────────────────┘
```

## Konfigurasi yang Benar

### 1. Docker Compose - Port yang Berbeda

**Production (`docker-compose.yml`):**
```yaml
services:
  app:
    container_name: clients-aksesekolah-app
    ports:
      - "3000:3000"  # Production port
    environment:
      - NODE_ENV=production
      - PORT=3000
```

**Development (`docker-compose.dev.yml`):**
```yaml
services:
  app:
    container_name: clients-aksesekolah-app-dev
    ports:
      - "3001:3000"  # Development port (external:internal)
    environment:
      - NODE_ENV=development
      - PORT=3000
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next
```

### 2. Nginx Configuration

**Production Domain:**
```nginx
server {
    server_name aksesekolah.id dashboard.aksesekolah.id;
    location / {
        proxy_pass http://clients-aksesekolah-app:3000;
    }
}
```

**Development Access:**
- Tidak perlu nginx config
- Akses langsung via: `http://localhost:3001`
- Atau setup subdomain: `dev.aksesekolah.local`

## Cara Menjalankan Bersamaan

### Step 1: Start Production
```bash
cd instances/clients/services/aksesekolah.id

# Start production container
docker-compose -f docker-compose.yml up -d

# Verify
docker ps | grep clients-aksesekolah-app
curl http://localhost:3000/api/health
```

### Step 2: Start Development
```bash
# Start development container (port 3001)
docker-compose -f docker-compose.dev.yml up -d

# Verify
docker ps | grep clients-aksesekolah-app-dev
curl http://localhost:3001/api/health
```

### Step 3: Verify Both Running
```bash
docker ps --filter name=clients-aksesekolah

# Output should show:
# clients-aksesekolah-app       (port 3000)
# clients-aksesekolah-app-dev   (port 3001)
```

## Access URLs

### Production
- Main: `https://aksesekolah.id`
- Dashboard: `https://dashboard.aksesekolah.id`
- Direct: `http://localhost:3000` (internal)

### Development
- Direct: `http://localhost:3001`
- With hot reload
- Real-time code changes

## Development Workflow

### 1. Edit Code
```bash
# Edit any file
nano app/(platform)/(auth)/signin/page.tsx

# Changes automatically reflected in dev container
# No need to rebuild!
```

### 2. Test in Development
```bash
# Open browser
open http://localhost:3001/signin

# See changes immediately
# Hot reload active
```

### 3. Test in Production (if needed)
```bash
# Rebuild production
docker-compose -f docker-compose.yml build
docker-compose -f docker-compose.yml up -d

# Test
open https://dashboard.aksesekolah.id/signin
```

## Resource Management

### Memory Usage
```bash
# Check memory usage
docker stats clients-aksesekolah-app clients-aksesekolah-app-dev

# Typical usage:
# Production: ~200-300MB
# Development: ~400-600MB (with hot reload)
```

### CPU Usage
- Production: Minimal (only serves requests)
- Development: Higher (watches files, rebuilds)

### Disk Space
- Production: ~500MB (optimized build)
- Development: ~1GB (includes node_modules, source maps)

## Best Practices

### 1. Use Development for Coding
```bash
# Always develop in dev container
docker-compose -f docker-compose.dev.yml up -d

# Edit code, see changes immediately
# No rebuild needed
```

### 2. Test in Production Before Deploy
```bash
# Before deploying to production server
docker-compose -f docker-compose.yml build
docker-compose -f docker-compose.yml up -d

# Test thoroughly
# Then deploy to server
```

### 3. Stop Unused Containers
```bash
# If not using production locally
docker-compose -f docker-compose.yml down

# If not developing
docker-compose -f docker-compose.dev.yml down
```

## Common Issues & Solutions

### Issue 1: Port Already in Use
```
Error: bind: address already in use
```

**Solution:**
```bash
# Check what's using the port
lsof -i :3000
lsof -i :3001

# Stop conflicting container
docker stop clients-aksesekolah-app

# Or change port in docker-compose.dev.yml
ports:
  - "3002:3000"  # Use different port
```

### Issue 2: Container Name Conflict
```
Error: container name already in use
```

**Solution:**
```bash
# Remove old container
docker rm clients-aksesekolah-app-dev

# Or use different name in docker-compose.dev.yml
container_name: clients-aksesekolah-app-dev-v2
```

### Issue 3: Database Connection Conflict
```
Error: database locked
```

**Solution:**
Use different databases for dev and prod:

```bash
# .env.development
DATABASE_URL="file:./prisma/dev.db"

# .env.production
DATABASE_URL="libsql://production.turso.io"
```

### Issue 4: Hot Reload Not Working
```bash
# Check volume mounts
docker-compose -f docker-compose.dev.yml config

# Restart container
docker-compose -f docker-compose.dev.yml restart

# Check logs
docker logs -f clients-aksesekolah-app-dev
```

## Recommended Setup

### For Local Development Machine

**Option A: Development Only**
```bash
# Most common for daily development
docker-compose -f docker-compose.dev.yml up -d

# Access: http://localhost:3001
# Hot reload: ✅
# Fast: ✅
```

**Option B: Both (Testing)**
```bash
# When you need to test production build
docker-compose -f docker-compose.yml up -d        # Production
docker-compose -f docker-compose.dev.yml up -d    # Development

# Production: http://localhost:3000
# Development: http://localhost:3001
```

### For Production Server

**Production Only**
```bash
# Only run production container
docker-compose -f docker-compose.yml up -d

# Access via nginx proxy
# https://aksesekolah.id
# https://dashboard.aksesekolah.id
```

## Quick Commands

### Start Both
```bash
# Start production
docker-compose -f docker-compose.yml up -d

# Start development
docker-compose -f docker-compose.dev.yml up -d
```

### Stop Both
```bash
docker-compose -f docker-compose.yml down
docker-compose -f docker-compose.dev.yml down
```

### Logs
```bash
# Production logs
docker logs -f clients-aksesekolah-app

# Development logs
docker logs -f clients-aksesekolah-app-dev

# Both
docker logs -f clients-aksesekolah-app clients-aksesekolah-app-dev
```

### Restart
```bash
# Restart production
docker-compose -f docker-compose.yml restart

# Restart development
docker-compose -f docker-compose.dev.yml restart
```

## Summary

✅ **AMAN** menjalankan production dan development bersamaan
✅ Gunakan **port berbeda** (3000 vs 3001)
✅ Gunakan **container name berbeda**
✅ Development untuk **coding** (hot reload)
✅ Production untuk **testing** sebelum deploy
✅ Di server production, **hanya jalankan production container**

**Tidak akan crash** selama:
- Port tidak konflik
- Container name berbeda
- Database tidak konflik (gunakan DB berbeda)
- Resource cukup (RAM minimal 2GB)
