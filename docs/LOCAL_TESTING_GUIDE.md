# Local Testing Guide - Multi-Tenant Application

## Problem: Localhost Tidak Cukup

Aplikasi AkseSekolah.id adalah **multi-tenant** yang routing-nya bergantung pada **domain/hostname**:

```typescript
// app/proxy.ts
const hostname = request.nextUrl.hostname;

// Deteksi domain:
// - aksesekolah.id → Platform landing
// - dashboard.aksesekolah.id → Dashboard admin
// - tenant1.aksesekolah.id → Tenant website
```

**Masalah dengan localhost:**
- `localhost` tidak bisa membedakan subdomain
- `localhost:3000` selalu sama, tidak ada tenant routing
- Middleware tidak bisa detect tenant dari hostname

## Solusi: Local Domain Setup

### Option 1: /etc/hosts (Recommended untuk Development)

Edit file `/etc/hosts` untuk mapping domain lokal:

```bash
sudo nano /etc/hosts
```

Tambahkan:
```
# AkseSekolah.id Local Development
127.0.0.1 aksesekolah.local
127.0.0.1 www.aksesekolah.local
127.0.0.1 dashboard.aksesekolah.local
127.0.0.1 tenant1.aksesekolah.local
127.0.0.1 tenant2.aksesekolah.local
127.0.0.1 smauii.aksesekolah.local
127.0.0.1 smpn1.aksesekolah.local
```

**Keuntungan:**
- ✅ Subdomain berfungsi penuh
- ✅ Middleware detect hostname dengan benar
- ✅ Tenant routing bekerja
- ✅ Tidak perlu DNS eksternal
- ✅ Gratis dan cepat

**Akses:**
- Platform: `http://aksesekolah.local:3001`
- Dashboard: `http://dashboard.aksesekolah.local:3001`
- Tenant: `http://tenant1.aksesekolah.local:3001`

### Option 2: Docker Compose dengan Network Alias

Update `docker-compose.dev.yml`:

```yaml
services:
  aksesekolah-dev:
    networks:
      dev-network:
        aliases:
          - aksesekolah.local
          - dashboard.aksesekolah.local
          - tenant1.aksesekolah.local
```

### Option 3: Nginx Proxy Lokal

Setup nginx di host machine untuk proxy ke container:

```nginx
# /etc/nginx/sites-available/aksesekolah-local.conf

server {
    listen 80;
    server_name aksesekolah.local *.aksesekolah.local;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Setup Step-by-Step

### 1. Edit /etc/hosts

```bash
# Backup original
sudo cp /etc/hosts /etc/hosts.backup

# Edit
sudo nano /etc/hosts

# Add entries
127.0.0.1 aksesekolah.local
127.0.0.1 dashboard.aksesekolah.local
127.0.0.1 tenant1.aksesekolah.local

# Save and exit (Ctrl+X, Y, Enter)
```

### 2. Update Environment Variables

Edit `.env`:
```bash
NEXT_PUBLIC_PLATFORM_DOMAIN=aksesekolah.local
NEXT_PUBLIC_APP_URL=http://aksesekolah.local:3001
```

### 3. Start Development Container

```bash
docker-compose -f docker-compose.dev.yml up -d
```

### 4. Test Multi-Tenant Routing

```bash
# Test platform landing
curl -H "Host: aksesekolah.local" http://localhost:3001

# Test dashboard
curl -H "Host: dashboard.aksesekolah.local" http://localhost:3001

# Test tenant
curl -H "Host: tenant1.aksesekolah.local" http://localhost:3001
```

### 5. Browser Testing

Open browser:
- Platform: `http://aksesekolah.local:3001`
- Dashboard: `http://dashboard.aksesekolah.local:3001`
- Signin: `http://dashboard.aksesekolah.local:3001/signin`
- Signup: `http://dashboard.aksesekolah.local:3001/signup`

## Testing Checklist

### ✅ Platform Routes
```bash
# Landing page
curl -I http://aksesekolah.local:3001/

# Should return 200 and show platform landing
```

### ✅ Dashboard Routes
```bash
# Dashboard signin
curl -I http://dashboard.aksesekolah.local:3001/signin

# Should return 200 and show signin page
```

### ✅ Tenant Routes
```bash
# Create test tenant first via signup
# Then test tenant subdomain
curl -I http://testschool.aksesekolah.local:3001/

# Should return 200 and show tenant website
```

### ✅ Middleware Detection
Check logs to verify hostname detection:
```bash
docker logs -f clients-aksesekolah-app-dev | grep "Proxy"

# Should show:
# [Proxy] Debug: { hostname: 'dashboard.aksesekolah.local', ... }
```

## Production vs Development Testing

### Development (Local)
```
Domain: aksesekolah.local:3001
SSL: No (HTTP only)
Database: Local SQLite or dev Turso
Purpose: Development & testing
```

### Production (Server)
```
Domain: aksesekolah.id
SSL: Yes (HTTPS with Let's Encrypt)
Database: Production Turso
Purpose: Live application
```

## Common Issues

### Issue 1: Domain tidak resolve
```bash
# Test DNS resolution
ping aksesekolah.local

# Should return: 127.0.0.1
```

**Fix:**
```bash
# Check /etc/hosts
cat /etc/hosts | grep aksesekolah

# Re-add if missing
sudo nano /etc/hosts
```

### Issue 2: Port tidak bisa diakses
```bash
# Check container running
docker ps | grep aksesekolah-app-dev

# Check port mapping
docker port clients-aksesekolah-app-dev

# Should show: 3000/tcp -> 0.0.0.0:3001
```

### Issue 3: Middleware tidak detect hostname
```bash
# Check proxy.ts logs
docker logs clients-aksesekolah-app-dev | grep hostname

# Verify Host header
curl -v -H "Host: dashboard.aksesekolah.local" http://localhost:3001
```

### Issue 4: Browser cache
```bash
# Clear browser cache
# Or use incognito mode
# Or use curl for testing
```

## Advanced: SSL untuk Local Development

Jika ingin HTTPS di local (optional):

### 1. Generate Self-Signed Certificate
```bash
# Create certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout aksesekolah-local.key \
  -out aksesekolah-local.crt \
  -subj "/CN=*.aksesekolah.local"

# Trust certificate (macOS)
sudo security add-trusted-cert -d -r trustRoot \
  -k /Library/Keychains/System.keychain aksesekolah-local.crt

# Trust certificate (Linux)
sudo cp aksesekolah-local.crt /usr/local/share/ca-certificates/
sudo update-ca-certificates
```

### 2. Setup Nginx with SSL
```nginx
server {
    listen 443 ssl;
    server_name aksesekolah.local *.aksesekolah.local;
    
    ssl_certificate /path/to/aksesekolah-local.crt;
    ssl_certificate_key /path/to/aksesekolah-local.key;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
    }
}
```

### 3. Access via HTTPS
```
https://aksesekolah.local
https://dashboard.aksesekolah.local
```

## Quick Test Script

Create `test-local.sh`:

```bash
#!/bin/bash

echo "🧪 Testing Multi-Tenant Routing..."
echo ""

# Test platform
echo "1. Platform Landing:"
curl -s -o /dev/null -w "%{http_code}" \
  -H "Host: aksesekolah.local" http://localhost:3001/
echo ""

# Test dashboard
echo "2. Dashboard:"
curl -s -o /dev/null -w "%{http_code}" \
  -H "Host: dashboard.aksesekolah.local" http://localhost:3001/
echo ""

# Test signin
echo "3. Signin Page:"
curl -s -o /dev/null -w "%{http_code}" \
  -H "Host: dashboard.aksesekolah.local" http://localhost:3001/signin
echo ""

# Test signup
echo "4. Signup Page:"
curl -s -o /dev/null -w "%{http_code}" \
  -H "Host: dashboard.aksesekolah.local" http://localhost:3001/signup
echo ""

echo "✅ All tests completed!"
```

Run:
```bash
chmod +x test-local.sh
./test-local.sh
```

## Recommended Workflow

### Daily Development:

1. **Start dev container:**
```bash
docker-compose -f docker-compose.dev.yml up -d
```

2. **Open browser:**
- Dashboard: `http://dashboard.aksesekolah.local:3001`
- Edit code, see changes immediately

3. **Test tenant routing:**
- Register new tenant via signup
- Access: `http://[subdomain].aksesekolah.local:3001`

4. **Check logs:**
```bash
docker logs -f clients-aksesekolah-app-dev
```

### Before Production Deploy:

1. **Test production build locally:**
```bash
docker-compose -f docker-compose.yml up -d
```

2. **Test with production domains in /etc/hosts:**
```
127.0.0.1 aksesekolah.id
127.0.0.1 dashboard.aksesekolah.id
```

3. **Verify all routes work**

4. **Deploy to server**

## Summary

❌ **Jangan test dengan localhost** untuk multi-tenant app
✅ **Gunakan /etc/hosts** untuk local domain
✅ **Test dengan subdomain** yang proper
✅ **Verify middleware** detect hostname dengan benar
✅ **Test semua route groups** (platform, dashboard, tenant)

**Minimal Setup:**
```bash
# 1. Edit /etc/hosts
sudo nano /etc/hosts
# Add: 127.0.0.1 dashboard.aksesekolah.local

# 2. Start dev
docker-compose -f docker-compose.dev.yml up -d

# 3. Test
open http://dashboard.aksesekolah.local:3001/signin
```

Dengan setup ini, Anda bisa test multi-tenant routing dengan benar di local development environment.
