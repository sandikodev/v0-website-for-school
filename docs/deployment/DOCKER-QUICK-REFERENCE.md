# Docker Quick Reference

## 🚀 Quick Commands

### Development (Hot Reload)

```bash
# Start
docker compose -f docker/dev/docker-compose.dev.yml up

# Start detached
docker compose -f docker/dev/docker-compose.dev.yml up -d

# Stop
docker compose -f docker/dev/docker-compose.dev.yml down

# Logs
docker compose -f docker/dev/docker-compose.dev.yml logs -f

# Rebuild
docker compose -f docker/dev/docker-compose.dev.yml build --no-cache
```

### Production (Optimized)

```bash
# Start
docker compose -f docker/prod/docker-compose.prod.yml up -d

# Stop
docker compose -f docker/prod/docker-compose.prod.yml down

# Logs
docker compose -f docker/prod/docker-compose.prod.yml logs -f

# Restart
docker compose -f docker/prod/docker-compose.prod.yml restart
```

---

## 📊 Key Differences

| Feature | Development | Production |
|---------|-------------|------------|
| **Command** | `pnpm dev` | `pnpm build` + `node server.js` |
| **Hot Reload** | ✅ Yes | ❌ No |
| **Source Mounted** | ✅ Yes | ❌ No (standalone) |
| **Optimization** | ❌ No | ✅ Yes (multi-stage) |
| **Image Size** | ~1.5GB | ~200MB |
| **Startup Time** | ~10s | ~5s |
| **Use Case** | Local development | Production deployment |

---

## 🌐 Access URLs

### Development
```
App:        http://localhost:3000
PgAdmin:    http://localhost:8081
PostgreSQL: localhost:5433
Redis:      localhost:6380
```

**Note:** Non-standard ports to avoid conflicts with existing services.

### Production
```
App:       https://aksesekolah.id
Dashboard: https://dashboard.aksesekolah.id
```

---

## 🔧 Common Tasks

### Database

```bash
# Run migrations (dev)
docker compose -f docker/dev/docker-compose.dev.yml exec aksesekolah-dev pnpm prisma migrate dev

# Run migrations (prod)
docker compose -f docker/prod/docker-compose.prod.yml exec aksesekolah-prod pnpm prisma migrate deploy

# Open Prisma Studio
docker compose -f docker/dev/docker-compose.dev.yml exec aksesekolah-dev pnpm prisma studio

# Reset database
docker compose -f docker/dev/docker-compose.dev.yml exec aksesekolah-dev pnpm prisma migrate reset
```

### Shell Access

```bash
# Dev container
docker compose -f docker/dev/docker-compose.dev.yml exec aksesekolah-dev sh

# Prod container
docker compose -f docker/prod/docker-compose.prod.yml exec aksesekolah-prod sh

# Database
docker compose -f docker/dev/docker-compose.dev.yml exec aksesekolah-db-dev psql -U postgres -d aksesekolah_dev
```

---

## 🐛 Troubleshooting

### Port in use
```bash
# Check and kill process
lsof -i :3000
kill -9 <PID>

# Or use different ports
POSTGRES_PORT=5434 REDIS_PORT=6381 docker compose -f docker/dev/docker-compose.dev.yml up
```

### Clean everything
```bash
docker system prune -a --volumes
```

### Rebuild from scratch
```bash
docker compose -f docker/dev/docker-compose.dev.yml down -v
docker compose -f docker/dev/docker-compose.dev.yml build --no-cache
docker compose -f docker/dev/docker-compose.dev.yml up
```

---

## 📝 Environment Files

### Development
```bash
# .env.local
DATABASE_URL=postgresql://postgres:postgres@aksesekolah-db-dev:5432/aksesekolah_dev
NEXT_PUBLIC_PLATFORM_DOMAIN=aksesekolah.local
```

### Production
```bash
# .env
DATABASE_URL=your-production-url
NEXT_PUBLIC_PLATFORM_DOMAIN=aksesekolah.id
```

---

## ✅ Checklist

### First Time Setup
- [ ] Install Docker
- [ ] Copy .env.local.example
- [ ] Run `docker compose -f docker/dev/docker-compose.dev.yml up`
- [ ] Run migrations
- [ ] Access http://localhost:3000

### Daily Development
- [ ] Start: `docker compose -f docker/dev/docker-compose.dev.yml up -d`
- [ ] Code (hot reload works!)
- [ ] Stop: `docker compose -f docker/dev/docker-compose.dev.yml down`

---

**Full documentation:** `docker/README.md`

