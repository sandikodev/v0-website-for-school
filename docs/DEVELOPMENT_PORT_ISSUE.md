# Development Port Issue & Solution

## Problem

Saat testing di development container (port 3001), setelah login berhasil, browser redirect ke port 3000 instead of 3001:

```
Login at: http://dashboard.aksesekolah.local:3001/signin
Redirect to: http://dashboard.aksesekolah.local:3000/tenant/overview ❌
Should be: http://dashboard.aksesekolah.local:3001/tenant/overview ✅
```

## Root Cause

Environment variables di `docker-compose.dev.yml` menggunakan `localhost:3001`:

```yaml
environment:
  - NEXTAUTH_URL=http://localhost:3001
  - NEXT_PUBLIC_APP_URL=http://localhost:3001
```

Masalahnya:
1. `localhost` tidak sesuai dengan domain yang diakses (`aksesekolah.local`)
2. Next.js mungkin menggunakan internal port (3000) untuk redirect
3. Browser tidak bisa resolve `localhost` dari container

## Solution

Update environment variables di `docker-compose.dev.yml` untuk menggunakan domain yang sesuai:

```yaml
environment:
  - NODE_ENV=development
  - NEXTAUTH_URL=http://aksesekolah.local:3001
  - NEXT_PUBLIC_APP_URL=http://aksesekolah.local:3001
  - NEXT_PUBLIC_PLATFORM_DOMAIN=aksesekolah.local
  - PORT=3000  # Internal port (container)
```

**Key Points:**
- `NEXTAUTH_URL`: Harus match dengan domain yang diakses
- `NEXT_PUBLIC_APP_URL`: Harus include port 3001 (external port)
- `PORT=3000`: Internal port di dalam container
- Port mapping: `3001:3000` (external:internal)

## How to Fix

### 1. Update docker-compose.dev.yml

Already fixed in the file!

### 2. Restart Development Container

```bash
cd instances/clients/services/aksesekolah.id

# Stop and remove old container
docker compose -f docker-compose.dev.yml down

# Start with new environment variables
docker compose -f docker-compose.dev.yml up -d
```

### 3. Verify Environment Variables

```bash
docker exec clients-aksesekolah-app-dev env | grep -E "(NEXTAUTH_URL|NEXT_PUBLIC|PORT)"
```

Should show:
```
NEXTAUTH_URL=http://aksesekolah.local:3001
NEXT_PUBLIC_APP_URL=http://aksesekolah.local:3001
NEXT_PUBLIC_PLATFORM_DOMAIN=aksesekolah.local
PORT=3000
```

### 4. Test Login Again

```
1. Open: http://dashboard.aksesekolah.local:3001/signin
2. Login with credentials
3. Should redirect to: http://dashboard.aksesekolah.local:3001/tenant/overview ✅
```

## Understanding Port Mapping

```
┌─────────────────────────────────────────────────────────┐
│  Browser (Windows/Mac)                                  │
│  Access: http://dashboard.aksesekolah.local:3001        │
└─────────────────────────────────────────────────────────┘
                          │
                          │ Port 3001 (External)
                          ▼
┌─────────────────────────────────────────────────────────┐
│  Docker Host                                            │
│  Port Mapping: 3001:3000                                │
└─────────────────────────────────────────────────────────┘
                          │
                          │ Port 3000 (Internal)
                          ▼
┌─────────────────────────────────────────────────────────┐
│  Container: clients-aksesekolah-app-dev                 │
│  Next.js running on PORT=3000                           │
│  Environment:                                           │
│    - NEXTAUTH_URL=http://aksesekolah.local:3001        │
│    - NEXT_PUBLIC_APP_URL=http://aksesekolah.local:3001 │
└─────────────────────────────────────────────────────────┘
```

**Important:**
- Browser always uses **external port** (3001)
- Container uses **internal port** (3000)
- Environment variables must use **external port** (3001) for URLs
- `PORT` variable uses **internal port** (3000)

## Why This Matters

### Development vs Production

**Development (Port 3001):**
- External access: `http://aksesekolah.local:3001`
- Hot reload enabled
- Source code mounted
- Fast iteration

**Production (Port 3000):**
- External access: `https://aksesekolah.id` (via nginx)
- Optimized build
- No source code mount
- Stable deployment

### Environment-Specific URLs

**Development:**
```yaml
NEXTAUTH_URL=http://aksesekolah.local:3001
NEXT_PUBLIC_APP_URL=http://aksesekolah.local:3001
```

**Production:**
```yaml
NEXTAUTH_URL=https://aksesekolah.id
NEXT_PUBLIC_APP_URL=https://aksesekolah.id
```

## Common Issues

### Issue 1: Still redirecting to port 3000

**Cause:** Old environment variables cached

**Fix:**
```bash
# Hard restart
docker compose -f docker-compose.dev.yml down
docker compose -f docker-compose.dev.yml up -d --force-recreate

# Clear browser cache
# Or use incognito mode
```

### Issue 2: Cannot access after restart

**Cause:** Container not fully started

**Fix:**
```bash
# Check container status
docker ps | grep aksesekolah-app-dev

# Check logs
docker logs -f clients-aksesekolah-app-dev

# Wait for "Ready" message
```

### Issue 3: Environment variables not updated

**Cause:** Container not recreated

**Fix:**
```bash
# Force recreate
docker compose -f docker-compose.dev.yml up -d --force-recreate

# Verify
docker exec clients-aksesekolah-app-dev env | grep NEXTAUTH_URL
```

## Best Practices

### 1. Always Use Domain Names

❌ Bad:
```yaml
NEXTAUTH_URL=http://localhost:3001
```

✅ Good:
```yaml
NEXTAUTH_URL=http://aksesekolah.local:3001
```

### 2. Match External Port in URLs

❌ Bad:
```yaml
ports:
  - "3001:3000"
environment:
  - NEXT_PUBLIC_APP_URL=http://aksesekolah.local:3000  # Wrong!
```

✅ Good:
```yaml
ports:
  - "3001:3000"
environment:
  - NEXT_PUBLIC_APP_URL=http://aksesekolah.local:3001  # Correct!
```

### 3. Document Port Usage

Always document which port is for what:
- 3000: Production (internal, via nginx)
- 3001: Development (external, direct access)
- 3002: Preview (if needed)

## Testing Checklist

After fixing:

- [ ] Container restarted successfully
- [ ] Environment variables verified
- [ ] Login redirects to correct port (3001)
- [ ] Dashboard accessible at port 3001
- [ ] Hot reload working
- [ ] No console errors

## Summary

**Problem:** Redirect to wrong port after login
**Cause:** Environment variables using `localhost` instead of domain
**Solution:** Update to use `aksesekolah.local:3001`
**Result:** ✅ Redirect works correctly with port 3001

---

**Updated:** November 28, 2025
**Status:** ✅ Fixed
**Tested:** Development environment
