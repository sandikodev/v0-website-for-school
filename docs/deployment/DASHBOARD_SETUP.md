# Dashboard Setup Guide - dashboard.aksesekolah.id

## 📋 Overview

Panduan lengkap untuk menambahkan subdomain `dashboard.aksesekolah.id` ke platform aksesekolah.id.

## 🎯 Current Status

- ✅ Nginx config sudah ditambahkan
- ✅ Config sudah di-sync ke nginx-proxy
- ✅ SSL certificate sudah mencakup dashboard subdomain
- ✅ HTTPS working: https://dashboard.aksesekolah.id
- ⏳ Dashboard application belum di-deploy

## 🔐 Step 1: Update SSL Certificate

### Generate New Certificate with Dashboard

Karena sudah ada certificate untuk `aksesekolah.id` dan `www.aksesekolah.id`, kita perlu **expand** certificate untuk include `dashboard.aksesekolah.id`.

```bash
# Expand existing certificate
sudo certbot certonly \
  --manual \
  --preferred-challenges dns \
  --email system@aksesekolah.id \
  --agree-tos \
  --no-eff-email \
  --cert-name aksesekolah \
  --expand \
  -d "aksesekolah.id" \
  -d "www.aksesekolah.id" \
  -d "dashboard.aksesekolah.id"
```

### DNS Challenge

Certbot akan meminta Anda menambahkan TXT record:

```
_acme-challenge.dashboard.aksesekolah.id. 300 IN TXT "random-string-here"
```

**Steps:**
1. Login ke DNS provider (Cloudflare/Route53/etc)
2. Add TXT record sesuai instruksi certbot
3. Tunggu DNS propagation (1-5 menit)
4. Verify dengan:
   ```bash
   dig _acme-challenge.dashboard.aksesekolah.id TXT
   ```
5. Press Enter di certbot untuk continue

### Verify Certificate

```bash
# Check certificate domains
sudo certbot certificates

# Should show:
# Certificate Name: aksesekolah
#   Domains: aksesekolah.id www.aksesekolah.id dashboard.aksesekolah.id
#   Expiry Date: ...
```

### Reload Nginx

```bash
# Test config
docker exec nginx-proxy nginx -t

# Reload
docker exec nginx-proxy nginx -s reload
```

## 🧪 Step 2: Test Dashboard Endpoint

```bash
# Test HTTPS (should work now)
curl -I https://dashboard.aksesekolah.id

# Expected response:
# HTTP/2 200
# server: nginx
# content-type: text/plain
# ...
```

## 🚀 Step 3: Deploy Dashboard Application

### Option A: Separate Container

Create `instances/clients/services/aksesekolah.id-dashboard/`:

```yaml
# docker-compose.yml
version: '3.8'

services:
  dashboard:
    build: .
    container_name: clients-aksesekolah.id-dashboard
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_URL=https://dashboard.aksesekolah.id
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
    networks:
      - nginx-net
      - dashboard-network
    volumes:
      - ./data:/app/data

networks:
  nginx-net:
    external: true
  dashboard-network:
    driver: bridge
```

Update nginx config:
```nginx
# In instances/clients/conf/aksesekolah.conf
server {
    listen 443 ssl;
    http2 on;
    server_name dashboard.aksesekolah.id;
    
    # ... SSL config ...
    
    location / {
        proxy_pass http://clients-aksesekolah.id-dashboard:3000;
        # ... proxy headers ...
    }
}
```

### Option B: Same Container, Different Route

Use existing `clients-aksesekolah.id-school-app` container:

```nginx
# In instances/clients/conf/aksesekolah.conf
server {
    listen 443 ssl;
    http2 on;
    server_name dashboard.aksesekolah.id;
    
    # ... SSL config ...
    
    location / {
        proxy_pass http://clients-aksesekolah.id-school-app:3000;
        proxy_set_header X-Dashboard-Mode "true";
        # ... other proxy headers ...
    }
}
```

Then handle in Next.js middleware:
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  
  if (hostname === 'dashboard.aksesekolah.id') {
    return NextResponse.rewrite(new URL('/dashboard', request.url));
  }
  
  // ... tenant logic ...
}
```

## 📝 Step 4: Update Nginx Config

Edit source config:
```bash
nano instances/clients/conf/aksesekolah.conf
```

Update dashboard server block:
```nginx
server {
    listen 443 ssl;
    http2 on;
    server_name dashboard.aksesekolah.id;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/aksesekolah/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/aksesekolah/privkey.pem;
    
    # SSL Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Logs
    access_log /var/log/nginx/aksesekolah-dashboard-access.log;
    error_log /var/log/nginx/aksesekolah-dashboard-error.log;
    
    # Rate limiting
    limit_req zone=aksesekolah_limit burst=20 nodelay;
    
    # Proxy to dashboard app
    location / {
        proxy_pass http://clients-aksesekolah.id-dashboard:3000;
        proxy_http_version 1.1;
        
        # WebSocket support
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Standard headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        
        # Timeouts
        proxy_connect_timeout 600s;
        proxy_send_timeout 600s;
        proxy_read_timeout 600s;
        
        # Buffering
        proxy_buffering off;
        client_max_body_size 50M;
    }
}
```

Sync config:
```bash
./scripts/sync-nginx-config.sh
```

## ✅ Verification Checklist

- [ ] SSL certificate includes dashboard.aksesekolah.id
- [ ] DNS A record points to server IP
- [ ] Nginx config updated and synced
- [ ] Dashboard application deployed
- [ ] HTTPS works: `curl -I https://dashboard.aksesekolah.id`
- [ ] Dashboard loads in browser
- [ ] Authentication works
- [ ] Database connection works

## 🔍 Testing

### Test SSL
```bash
# Check SSL certificate
echo | openssl s_client -servername dashboard.aksesekolah.id \
  -connect dashboard.aksesekolah.id:443 2>/dev/null | \
  openssl x509 -noout -text | grep DNS

# Should show:
# DNS:aksesekolah.id, DNS:www.aksesekolah.id, DNS:dashboard.aksesekolah.id
```

### Test HTTP Response
```bash
# Test main domain
curl -I https://aksesekolah.id

# Test dashboard
curl -I https://dashboard.aksesekolah.id

# Test tenant
curl -I https://smauii.aksesekolah.id
```

### Test in Browser
1. Open https://dashboard.aksesekolah.id
2. Check SSL certificate (should be valid)
3. Test login functionality
4. Test dashboard features

## 🚨 Troubleshooting

### SSL Certificate Error
```bash
# Check certificate
sudo certbot certificates

# If dashboard not included, expand:
sudo certbot certonly --cert-name aksesekolah --expand \
  -d aksesekolah.id -d www.aksesekolah.id -d dashboard.aksesekolah.id
```

### 502 Bad Gateway
```bash
# Check if dashboard container is running
docker ps | grep dashboard

# Check container logs
docker logs clients-aksesekolah.id-dashboard

# Check nginx can reach container
docker exec nginx-proxy curl http://clients-aksesekolah.id-dashboard:3000
```

### DNS Not Resolving
```bash
# Check DNS
dig dashboard.aksesekolah.id

# Should return server IP
# If not, add A record in DNS provider
```

## 📚 Related Documentation

- [NGINX_CONFIG_SYNC.md](./NGINX_CONFIG_SYNC.md) - Config sync workflow
- [nginx-proxy-integration.md](./nginx-proxy-integration.md) - Nginx proxy setup
- [production-deployment.md](./production-deployment.md) - Production deployment
- [SSL_SETUP.md](../../SSL_SETUP.md) - SSL certificate setup

## 🎯 Next Steps

1. ✅ Generate SSL certificate with dashboard subdomain
2. ⏳ Build dashboard application
3. ⏳ Deploy dashboard container
4. ⏳ Update nginx config to proxy to dashboard
5. ⏳ Test and verify

---

**Last Updated**: 2025-11-28
**Status**: In Progress - SSL certificate needs to be expanded

