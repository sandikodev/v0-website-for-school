# AkseSekolah.id Deployment Checklist

## Pre-Deployment

### 1. Environment Variables
```bash
# Check .env file
cd instances/clients/services/aksesekolah.id
cat .env

# Required variables:
✅ DATABASE_URL (Turso LibSQL)
✅ JWT_SECRET (generate with: openssl rand -base64 32)
✅ NEXT_PUBLIC_PLATFORM_DOMAIN=aksesekolah.id
✅ NEXT_PUBLIC_APP_URL=https://aksesekolah.id
```

### 2. Database Setup
```bash
# Generate Prisma client
pnpm run db:generate

# Push schema to database
pnpm run db:push

# Optional: Seed initial data
pnpm run db:seed:all
```

### 3. Build Application
```bash
# Install dependencies
pnpm install

# Type check
pnpm run type-check

# Build for production
pnpm run build
```

## Deployment Steps

### 1. Build Docker Image
```bash
cd instances/clients/services/aksesekolah.id

# Build production image
docker build -t clients-aksesekolah-app:latest .

# Or use docker-compose
docker-compose -f docker-compose.yml build
```

### 2. Start Container
```bash
# Production
docker-compose -f docker-compose.yml up -d

# Preview
docker-compose -f docker-compose.preview.yml up -d

# Development
docker-compose -f docker-compose.dev.yml up -d
```

### 3. Verify Container
```bash
# Check container status
docker ps | grep aksesekolah

# Check logs
docker logs clients-aksesekolah-app

# Test health endpoint
curl http://localhost:3000/api/health
```

### 4. Update Nginx Configuration
```bash
# Edit nginx config
nano instances/clients/conf/aksesekolah.conf

# Update dashboard proxy target:
location / {
    proxy_pass http://clients-aksesekolah-app:3000;
    # ... other proxy settings
}

# Sync to infrastructure
./scripts/sync-nginx-config.sh
```

### 5. Test SSL Certificate
```bash
# Verify certificate includes dashboard subdomain
sudo certbot certificates | grep aksesekolah

# Should show:
# - aksesekolah.id
# - www.aksesekolah.id
# - dashboard.aksesekolah.id

# If not, expand certificate:
./scripts/expand-ssl-aksesekolah.sh
```

## Post-Deployment Testing

### 1. Test Landing Page
```bash
# Main domain
curl -I https://aksesekolah.id
# Expected: HTTP/2 200

# WWW redirect
curl -I https://www.aksesekolah.id
# Expected: HTTP/2 200
```

### 2. Test Dashboard Access
```bash
# Dashboard subdomain
curl -I https://dashboard.aksesekolah.id
# Expected: HTTP/2 200

# Signin page
curl https://dashboard.aksesekolah.id/signin
# Expected: HTML with signin form

# Signup page
curl https://dashboard.aksesekolah.id/signup
# Expected: HTML with signup form
```

### 3. Test Authentication Flow

**A. Registration:**
1. Visit: https://dashboard.aksesekolah.id/signup
2. Fill Step 1: School information
3. Fill Step 2: Admin information
4. Fill Step 3: Account creation
5. Submit form
6. Verify redirect to success page
7. Check database for new tenant and user

**B. Login:**
1. Visit: https://dashboard.aksesekolah.id/signin
2. Enter email and password
3. Submit form
4. Verify redirect to dashboard
5. Check auth cookie is set

**C. Protected Routes:**
1. Try accessing /admin/dashboard without login
2. Should redirect to /signin
3. After login, should access dashboard
4. Verify role-based access

### 4. Test Tenant Subdomains
```bash
# Test tenant subdomain (if any created)
curl -I https://test-school.aksesekolah.id
# Expected: HTTP/2 200 (tenant website)
```

## Monitoring

### 1. Container Health
```bash
# Check container status
docker ps -a | grep aksesekolah

# Check resource usage
docker stats clients-aksesekolah-app

# View logs
docker logs -f clients-aksesekolah-app --tail 100
```

### 2. Application Logs
```bash
# Inside container
docker exec -it clients-aksesekolah-app sh
cat /app/.next/server/app-paths-manifest.json

# Check for errors
docker logs clients-aksesekolah-app 2>&1 | grep -i error
```

### 3. Database Connection
```bash
# Test database connection
docker exec -it clients-aksesekolah-app sh
node -e "const { prisma } = require('./lib/prisma'); prisma.user.count().then(console.log)"
```

## Rollback Procedure

### If deployment fails:

1. **Stop new container:**
```bash
docker-compose -f docker-compose.yml down
```

2. **Restore previous image:**
```bash
docker-compose -f docker-compose.yml up -d
```

3. **Check logs for errors:**
```bash
docker logs clients-aksesekolah-app
```

4. **Restore nginx config if needed:**
```bash
git checkout instances/clients/conf/aksesekolah.conf
./scripts/sync-nginx-config.sh
```

## Troubleshooting

### Issue: Container won't start
```bash
# Check logs
docker logs clients-aksesekolah-app

# Common causes:
# - Missing environment variables
# - Database connection failed
# - Port already in use
# - Build errors
```

### Issue: Cannot access dashboard
```bash
# Check nginx config
sudo nginx -t

# Check SSL certificate
sudo certbot certificates

# Check DNS
dig dashboard.aksesekolah.id

# Check container is running
docker ps | grep aksesekolah
```

### Issue: Authentication not working
```bash
# Check JWT_SECRET is set
docker exec clients-aksesekolah-app env | grep JWT_SECRET

# Check database connection
docker exec clients-aksesekolah-app node -e "const { prisma } = require('./lib/prisma'); prisma.user.findMany().then(console.log)"

# Check cookies are being set
# Use browser DevTools > Application > Cookies
```

### Issue: Database errors
```bash
# Regenerate Prisma client
docker exec clients-aksesekolah-app pnpm run db:generate

# Push schema
docker exec clients-aksesekolah-app pnpm run db:push

# Check Turso connection
curl "https://aksesekolah-konxc.aws-ap-northeast-1.turso.io/v2/pipeline" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Security Checklist

- [ ] JWT_SECRET is strong and unique
- [ ] Database credentials are secure
- [ ] HTTPS is enforced (no HTTP access)
- [ ] Cookies are HTTP-only and secure
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled (if applicable)
- [ ] Error messages don't leak sensitive info
- [ ] File upload validation is in place
- [ ] SQL injection protection (Prisma handles this)
- [ ] XSS protection (React handles this)

## Performance Checklist

- [ ] Static assets are cached
- [ ] Images are optimized
- [ ] Database queries are optimized
- [ ] API responses are fast (<200ms)
- [ ] Container has adequate resources
- [ ] CDN is configured (if applicable)
- [ ] Gzip compression is enabled
- [ ] Database connection pooling is configured

## Backup Checklist

- [ ] Database backups are automated
- [ ] Backup retention policy is set
- [ ] Backup restoration is tested
- [ ] Environment variables are backed up
- [ ] SSL certificates are backed up
- [ ] Docker images are tagged and stored

## Documentation

- [x] PLATFORM_AUTH.md - Complete authentication documentation
- [x] PLATFORM_AUTH_SETUP.md - Quick setup guide
- [x] NGINX_CONFIG_SYNC.md - Nginx configuration management
- [x] DASHBOARD_SETUP.md - Dashboard deployment guide
- [x] SSL_DASHBOARD_SETUP.md - SSL certificate setup

## Support

For issues or questions:
1. Check documentation in `docs/` directory
2. Review error logs
3. Check GitHub issues
4. Contact development team

---

**Last Updated:** November 28, 2025
**Version:** 1.0.0-beta
