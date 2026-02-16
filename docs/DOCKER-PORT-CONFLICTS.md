# Docker Port Conflicts - Quick Fix

## 🚨 Problem

Error saat menjalankan `docker compose`:
```
Error: failed to bind host port for 0.0.0.0:6379: address already in use
Error: failed to bind host port for 0.0.0.0:5432: address already in use
```

---

## ✅ Solution: Non-Standard Ports (Default)

Docker development sudah dikonfigurasi menggunakan **non-standard ports** untuk menghindari konflik:

```
PostgreSQL: 5433 (instead of 5432)
Redis:      6380 (instead of 6379)
PgAdmin:    8081 (instead of 8080)
```

### Quick Start

```bash
# Just run - no conflicts!
docker compose -f docker/dev/docker-compose.dev.yml up
```

**Access:**
- App: http://localhost:3000
- PgAdmin: http://localhost:8081
- PostgreSQL: localhost:5433
- Redis: localhost:6380

---

## 🔧 Custom Ports (Optional)

Jika masih ada konflik, gunakan custom ports:

### Method 1: Environment Variables

```bash
# Set custom ports
export POSTGRES_PORT=5434
export REDIS_PORT=6381
export PGADMIN_PORT=8082

# Run docker compose
docker compose -f docker/dev/docker-compose.dev.yml up
```

### Method 2: .env File

```bash
# Create docker/.env
cp docker/.env.example docker/.env

# Edit ports
nano docker/.env

# Set your custom ports:
POSTGRES_PORT=5434
REDIS_PORT=6381
PGADMIN_PORT=8082

# Run docker compose
docker compose -f docker/dev/docker-compose.dev.yml up
```

### Method 3: Inline

```bash
POSTGRES_PORT=5434 REDIS_PORT=6381 docker compose -f docker/dev/docker-compose.dev.yml up
```

---

## 🔍 Check What's Using Ports

### PostgreSQL (5432)

```bash
# Check
lsof -i :5432

# Stop system PostgreSQL
sudo systemctl stop postgresql

# Or disable auto-start
sudo systemctl disable postgresql
```

### Redis (6379)

```bash
# Check
lsof -i :6379

# Stop system Redis
sudo systemctl stop redis

# Or disable auto-start
sudo systemctl disable redis
```

### PgAdmin (8080)

```bash
# Check
lsof -i :8080

# Kill process
kill -9 <PID>
```

---

## 📊 Port Mapping Explained

### External vs Internal Ports

```yaml
ports:
  - "5433:5432"
    ↑      ↑
    |      └─ Internal (inside container) - FIXED
    └─ External (on your machine) - CONFIGURABLE
```

**Example:**
```
POSTGRES_PORT=5433 means:
- From your machine: localhost:5433
- From app container: aksesekolah-db-dev:5432
```

**Important:** 
- App container always connects to internal port (5432)
- You connect from host to external port (5433)
- DATABASE_URL in container: `postgresql://postgres:postgres@aksesekolah-db-dev:5432/aksesekolah_dev`

---

## 🎯 Recommended Setup

### For Clean System (No Conflicts)

```bash
# Use standard ports
POSTGRES_PORT=5432 REDIS_PORT=6379 PGADMIN_PORT=8080 \
  docker compose -f docker/dev/docker-compose.dev.yml up
```

### For System with Existing Services (Default)

```bash
# Use non-standard ports (default)
docker compose -f docker/dev/docker-compose.dev.yml up

# Access:
# - PostgreSQL: localhost:5433
# - Redis: localhost:6380
# - PgAdmin: http://localhost:8081
```

### For Multiple Projects

```bash
# Project 1
POSTGRES_PORT=5433 REDIS_PORT=6380 docker compose up

# Project 2
POSTGRES_PORT=5434 REDIS_PORT=6381 docker compose up
```

---

## 🐛 Troubleshooting

### Issue: Still getting port conflict

```bash
# 1. Check all processes
lsof -i :5433
lsof -i :6380
lsof -i :8081

# 2. Stop all Docker containers
docker compose -f docker/dev/docker-compose.dev.yml down

# 3. Kill conflicting processes
kill -9 <PID>

# 4. Try again
docker compose -f docker/dev/docker-compose.dev.yml up
```

### Issue: Can't connect to database from host

```bash
# Check if container is running
docker ps | grep postgres

# Check port mapping
docker port clients-aksesekolah-db-dev

# Should show: 5432/tcp -> 0.0.0.0:5433

# Connect using external port
psql -h localhost -p 5433 -U postgres -d aksesekolah_dev
```

### Issue: App can't connect to database

```bash
# Check DATABASE_URL in container
docker compose -f docker/dev/docker-compose.dev.yml exec aksesekolah-dev env | grep DATABASE_URL

# Should be: postgresql://postgres:postgres@aksesekolah-db-dev:5432/aksesekolah_dev
# Note: Uses internal port 5432, not external 5433!

# Check if database is ready
docker compose -f docker/dev/docker-compose.dev.yml exec aksesekolah-db-dev pg_isready -U postgres
```

---

## 📝 Summary

**Default Ports (No Conflicts):**
```
App:        3000
PostgreSQL: 5433 (external) → 5432 (internal)
Redis:      6380 (external) → 6379 (internal)
PgAdmin:    8081 (external) → 80 (internal)
```

**Connection Strings:**
```bash
# From host machine
postgresql://postgres:postgres@localhost:5433/aksesekolah_dev
redis://localhost:6380

# From app container (internal)
postgresql://postgres:postgres@aksesekolah-db-dev:5432/aksesekolah_dev
redis://aksesekolah-redis-dev:6379
```

**Quick Commands:**
```bash
# Start with defaults
docker compose -f docker/dev/docker-compose.dev.yml up

# Start with custom ports
POSTGRES_PORT=5434 docker compose -f docker/dev/docker-compose.dev.yml up

# Stop
docker compose -f docker/dev/docker-compose.dev.yml down

# Check ports
docker ps
docker port clients-aksesekolah-db-dev
```

---

**Problem solved! Docker development now uses non-standard ports by default to avoid conflicts.** ✅

