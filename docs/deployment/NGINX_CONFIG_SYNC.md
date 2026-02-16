# Nginx Configuration Sync Guide

## 🏗️ Architecture Overview

### Current Setup
- **Nginx Container**: `nginx-proxy` (nginx:stable-alpine)
- **Config Location**: `infrastructure/nginx/conf.d/`
- **Volume Mount**: `./conf.d:/etc/nginx/conf.d:rw`
- **Network**: `nginx-net` (external)

### Directory Structure
```
web/
├── infrastructure/nginx/
│   ├── docker-compose.yml
│   ├── nginx.conf
│   └── conf.d/
│       └── clients/
│           └── aksesekolah.conf    # ← Active config (read by nginx-proxy)
│
└── instances/clients/
    ├── conf/
    │   └── aksesekolah.conf        # ← Source config (edited here)
    └── services/aksesekolah.id/
        └── docker-compose.yml
```

## 🔄 Configuration Sync Strategy

### Problem
- Source config: `instances/clients/conf/aksesekolah.conf`
- Active config: `infrastructure/nginx/conf.d/clients/aksesekolah.conf`
- Docker volume mounts **cannot resolve symlinks** properly

### Solution: Copy Instead of Symlink

#### Option 1: Manual Copy (Recommended for Development)
```bash
# After editing source config
cp instances/clients/conf/aksesekolah.conf \
   infrastructure/nginx/conf.d/clients/aksesekolah.conf

# Test nginx config
docker exec nginx-proxy nginx -t

# Reload nginx
docker exec nginx-proxy nginx -s reload
```

#### Option 2: Automated Script
Create `scripts/sync-nginx-config.sh`:
```bash
#!/bin/bash
# Sync nginx configs from instances to infrastructure

set -e

SOURCE="instances/clients/conf/aksesekolah.conf"
DEST="infrastructure/nginx/conf.d/clients/aksesekolah.conf"

echo "🔄 Syncing nginx config..."
echo "   Source: $SOURCE"
echo "   Dest:   $DEST"

# Copy config
cp "$SOURCE" "$DEST"

# Test nginx config
echo "🧪 Testing nginx config..."
docker exec nginx-proxy nginx -t

# Reload nginx
echo "♻️  Reloading nginx..."
docker exec nginx-proxy nginx -s reload

echo "✅ Nginx config synced and reloaded!"
```

Make it executable:
```bash
chmod +x scripts/sync-nginx-config.sh
```

Usage:
```bash
# After editing instances/clients/conf/aksesekolah.conf
./scripts/sync-nginx-config.sh
```

#### Option 3: Watch Script (Auto-sync on Change)
Create `scripts/watch-nginx-config.sh`:
```bash
#!/bin/bash
# Watch and auto-sync nginx configs

SOURCE="instances/clients/conf/aksesekolah.conf"
DEST="infrastructure/nginx/conf.d/clients/aksesekolah.conf"

echo "👀 Watching $SOURCE for changes..."
echo "   Press Ctrl+C to stop"

# Install inotify-tools if not available
if ! command -v inotifywait &> /dev/null; then
    echo "⚠️  inotify-tools not found. Install with:"
    echo "   sudo apt-get install inotify-tools"
    exit 1
fi

while inotifywait -e modify,create "$SOURCE"; do
    echo "🔄 Change detected, syncing..."
    cp "$SOURCE" "$DEST"
    
    if docker exec nginx-proxy nginx -t 2>&1 | grep -q "successful"; then
        docker exec nginx-proxy nginx -s reload
        echo "✅ Config synced and reloaded at $(date)"
    else
        echo "❌ Config test failed! Not reloading."
    fi
done
```

## 📝 Workflow

### Development Workflow
1. Edit source config:
   ```bash
   nano instances/clients/conf/aksesekolah.conf
   ```

2. Sync to infrastructure:
   ```bash
   ./scripts/sync-nginx-config.sh
   ```

3. Verify:
   ```bash
   curl -I https://aksesekolah.id
   ```

### Production Workflow
1. Edit source config in version control
2. Commit changes:
   ```bash
   git add instances/clients/conf/aksesekolah.conf
   git commit -m "Update nginx config for aksesekolah.id"
   ```

3. Deploy:
   ```bash
   git pull
   ./scripts/sync-nginx-config.sh
   ```

## 🔍 Verification

### Check Active Config
```bash
# View config in nginx container
docker exec nginx-proxy cat /etc/nginx/conf.d/clients/aksesekolah.conf

# Compare with source
diff instances/clients/conf/aksesekolah.conf \
     infrastructure/nginx/conf.d/clients/aksesekolah.conf
```

### Test Configuration
```bash
# Test syntax
docker exec nginx-proxy nginx -t

# Check if config is loaded
docker exec nginx-proxy nginx -T | grep aksesekolah
```

### Test Domains
```bash
# Main domain
curl -I https://aksesekolah.id

# Dashboard
curl -I https://dashboard.aksesekolah.id

# Tenant
curl -I https://smauii.aksesekolah.id
```

## 🚨 Troubleshooting

### Config Not Applied
```bash
# 1. Check if file exists in container
docker exec nginx-proxy ls -la /etc/nginx/conf.d/clients/

# 2. Check file content
docker exec nginx-proxy cat /etc/nginx/conf.d/clients/aksesekolah.conf

# 3. Force reload
docker exec nginx-proxy nginx -s reload

# 4. Restart container (last resort)
docker restart nginx-proxy
```

### Symlink Issues
```bash
# Check if symlink
ls -la infrastructure/nginx/conf.d/clients/aksesekolah.conf

# If it's a symlink, remove and copy
rm infrastructure/nginx/conf.d/clients/aksesekolah.conf
cp instances/clients/conf/aksesekolah.conf \
   infrastructure/nginx/conf.d/clients/aksesekolah.conf
```

### Permission Issues
```bash
# Check permissions
ls -la infrastructure/nginx/conf.d/clients/

# Fix if needed
chmod 644 infrastructure/nginx/conf.d/clients/aksesekolah.conf
```

## 📋 Checklist

### Adding New Domain (e.g., dashboard.aksesekolah.id)

- [ ] 1. Generate SSL certificate
  ```bash
  sudo certbot certonly --manual \
    --preferred-challenges dns \
    --email system@aksesekolah.id \
    --agree-tos --no-eff-email \
    --cert-name aksesekolah \
    -d "aksesekolah.id" \
    -d "www.aksesekolah.id" \
    -d "dashboard.aksesekolah.id"
  ```

- [ ] 2. Edit source config
  ```bash
  nano instances/clients/conf/aksesekolah.conf
  ```

- [ ] 3. Add server block for dashboard

- [ ] 4. Sync config
  ```bash
  ./scripts/sync-nginx-config.sh
  ```

- [ ] 5. Test
  ```bash
  curl -I https://dashboard.aksesekolah.id
  ```

## 🎯 Best Practices

1. **Always edit source config** (`instances/clients/conf/`)
2. **Never edit infrastructure config directly** (will be overwritten)
3. **Test before reload** (`nginx -t`)
4. **Use version control** (commit both source and infrastructure)
5. **Document changes** (add comments in config)

## 📚 Related Documentation

- [nginx-proxy-integration.md](./nginx-proxy-integration.md)
- [production-deployment.md](./production-deployment.md)
- [SSL Setup Guide](../../SSL_SETUP.md)

---

**Last Updated**: 2025-11-28
**Maintainer**: DevOps Team

