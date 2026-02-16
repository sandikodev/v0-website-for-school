# 🐳 Docker Setup - AkseSekolah.id

## 📁 Clean Structure

```
.
├── docker-compose.yml                    # Quick start (production)
└── docker/
    ├── Dockerfile                        # Production image
    ├── .env.example                      # Port configuration
    ├── README.md                         # Complete guide
    ├── dev/
    │   ├── Dockerfile.dev                # Development image
    │   └── docker-compose.dev.yml        # Development setup
    └── prod/
        └── docker-compose.prod.yml       # Production setup
```

---

## 🚀 Quick Start

### Development (Hot Reload)

```bash
# Start
docker compose -f docker/dev/docker-compose.dev.yml up

# Stop
docker compose -f docker/dev/docker-compose.dev.yml down
```

**Access:**
- App: http://localhost:3000
- PgAdmin: http://localhost:8081 (admin@localhost.com / admin)
- PostgreSQL: localhost:5433
- Redis: localhost:6380

---

### Production

```bash
# Start
docker compose up -d

# Or use full path
docker compose -f docker/prod/docker-compose.prod.yml up -d

# Stop
docker compose down
```

---

## 📊 Key Differences

| Feature | Development | Production |
|---------|-------------|------------|
| **File** | `docker/dev/docker-compose.dev.yml` | `docker-compose.yml` |
| **Dockerfile** | `docker/dev/Dockerfile.dev` | `docker/Dockerfile` |
| **Command** | `pnpm dev` | `pnpm build` + `node server.js` |
| **Hot Reload** | ✅ Yes | ❌ No |
| **Source Mounted** | ✅ Yes | ❌ No |
| **Database** | PostgreSQL (included) | External (Turso) |
| **Redis** | Included | Optional |
| **PgAdmin** | Included | Not included |

---

## 🔧 Environment Variables

### Development

No setup needed! Defaults work out of the box.

**Optional:** Customize ports if needed
```bash
cp docker/.env.example docker/.env
nano docker/.env
```

### Production

```bash
# Required
DATABASE_URL="your-database-url"
NEXTAUTH_SECRET="your-secret"
JWT_SECRET="your-jwt-secret"

# Optional (has defaults)
DOMAIN="aksesekolah.id"
```

---

## 📚 Documentation

- **Complete Guide:** `docker/README.md`
- **Quick Reference:** `docs/DOCKER-QUICK-REFERENCE.md`
- **Port Conflicts:** `docs/DOCKER-PORT-CONFLICTS.md`
- **Environment Variables:** `docs/ENVIRONMENT-VARIABLES.md`

---

## 🐛 Troubleshooting

### Port conflicts?
```bash
# Development uses non-standard ports by default
PostgreSQL: 5433 (not 5432)
Redis:      6380 (not 6379)
PgAdmin:    8081 (not 8080)
```

### Can't connect to database?
```bash
# Check if containers are running
docker ps

# Check logs
docker compose -f docker/dev/docker-compose.dev.yml logs -f
```

### Need to rebuild?
```bash
# Development
docker compose -f docker/dev/docker-compose.dev.yml build --no-cache

# Production
docker compose build --no-cache
```

---

## ✅ Clean Setup

All unnecessary files removed:
- ❌ `docker.old/` - Removed
- ❌ `docker/staging/` - Removed
- ❌ `docker/test/` - Removed
- ❌ `Dockerfile` (root) - Removed (use `docker/Dockerfile`)
- ❌ `docker-compose.preview.yml` - Removed

Only essential files remain:
- ✅ `docker-compose.yml` - Production quick start
- ✅ `docker/Dockerfile` - Production image
- ✅ `docker/dev/Dockerfile.dev` - Development image
- ✅ `docker/dev/docker-compose.dev.yml` - Development setup
- ✅ `docker/prod/docker-compose.prod.yml` - Production setup

---

**Keep it simple!** 🎯

