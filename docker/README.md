# Docker Setup for AkseSekolah.id

## 📁 Structure

```
docker/
├── dev/
│   ├── Dockerfile.dev              # Development Dockerfile (pnpm dev)
│   ├── docker-compose.dev.yml      # Development compose with hot reload
│   └── entrypoint-dev.sh           # Development entrypoint script
├── prod/
│   └── docker-compose.prod.yml     # Production compose
├── staging/
│   └── docker-compose.staging.yml  # Staging environment
├── test/
│   ├── docker-compose.test.yml     # Testing environment
│   └── nginx-test.conf             # Nginx config for testing
├── Dockerfile                      # Production Dockerfile (pnpm build)
└── README.md                       # This file
```

---

## 🚀 Quick Start

### Development (Hot Reload)

```bash
# Start development environment
docker compose -f docker/dev/docker-compose.dev.yml up

# Start in detached mode
docker compose -f docker/dev/docker-compose.dev.yml up -d

# View logs
docker compose -f docker/dev/docker-compose.dev.yml logs -f

# Stop
docker compose -f docker/dev/docker-compose.dev.yml down
```

**Features:**
- ✅ Hot reload enabled (`pnpm dev`)
- ✅ Source code mounted for live changes
- ✅ PostgreSQL database
- ✅ Redis for caching
- ✅ PgAdmin for database management

**Access:**
- App: http://localhost:3000
- PgAdmin: http://localhost:8081 (default, configurable)
- PostgreSQL: localhost:5433 (default, configurable)
- Redis: localhost:6380 (default, configurable)

**Note:** Ports use non-standard defaults (5433, 6380, 8081) to avoid conflicts with existing services.

---

### Production (Optimized Build)

```bash
# Start production environment
docker compose -f docker/prod/docker-compose.prod.yml up -d

# View logs
docker compose -f docker/prod/docker-compose.prod.yml logs -f

# Stop
docker compose -f docker/prod/docker-compose.prod.yml down
```

**Features:**
- ✅ Optimized build (`pnpm build`)
- ✅ Multi-stage Dockerfile
- ✅ Standalone output
- ✅ Health checks
- ✅ Resource limits
- ✅ Auto-restart

---

## 🔧 Environment Variables

### Development (.env.local)

```bash
# Database
DATABASE_URL=postgresql://postgres:postgres@aksesekolah-db-dev:5432/aksesekolah_dev

# Platform
NEXT_PUBLIC_PLATFORM_DOMAIN=aksesekolah.local
NEXT_PUBLIC_DASHBOARD_URL=http://dashboard.aksesekolah.local:3000

# Auth
NEXTAUTH_URL=http://aksesekolah.local:3000
NEXTAUTH_SECRET=dev-secret-key
JWT_SECRET=dev-jwt-secret
```

### Production (.env)

```bash
# Database
DATABASE_URL=your-production-database-url

# Platform
DOMAIN=aksesekolah.id
NEXT_PUBLIC_PLATFORM_DOMAIN=aksesekolah.id
NEXT_PUBLIC_DASHBOARD_URL=https://dashboard.aksesekolah.id

# Auth
NEXTAUTH_URL=https://aksesekolah.id
NEXTAUTH_SECRET=your-production-secret
JWT_SECRET=your-production-jwt-secret
```

---

## 📊 Docker Commands

### Development

```bash
# Build image
docker compose -f docker/dev/docker-compose.dev.yml build

# Rebuild without cache
docker compose -f docker/dev/docker-compose.dev.yml build --no-cache

# Start services
docker compose -f docker/dev/docker-compose.dev.yml up

# Start specific service
docker compose -f docker/dev/docker-compose.dev.yml up aksesekolah-dev

# Stop services
docker compose -f docker/dev/docker-compose.dev.yml down

# Remove volumes
docker compose -f docker/dev/docker-compose.dev.yml down -v

# View logs
docker compose -f docker/dev/docker-compose.dev.yml logs -f

# Execute command in container
docker compose -f docker/dev/docker-compose.dev.yml exec aksesekolah-dev sh

# Run Prisma migrations
docker compose -f docker/dev/docker-compose.dev.yml exec aksesekolah-dev pnpm prisma migrate dev

# Generate Prisma client
docker compose -f docker/dev/docker-compose.dev.yml exec aksesekolah-dev pnpm prisma generate
```

### Production

```bash
# Build image
docker compose -f docker/prod/docker-compose.prod.yml build

# Start services
docker compose -f docker/prod/docker-compose.prod.yml up -d

# Stop services
docker compose -f docker/prod/docker-compose.prod.yml down

# View logs
docker compose -f docker/prod/docker-compose.prod.yml logs -f

# Restart service
docker compose -f docker/prod/docker-compose.prod.yml restart

# Scale service
docker compose -f docker/prod/docker-compose.prod.yml up -d --scale aksesekolah-prod=2
```

---

## 🐛 Troubleshooting

### Issue 1: Port already in use

**App port (3000):**
```bash
# Check what's using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port
PORT=3001 docker compose -f docker/dev/docker-compose.dev.yml up
```

**Database/Redis ports:**
```bash
# Check what's using the port
lsof -i :5432  # PostgreSQL
lsof -i :6379  # Redis

# Use different ports (set in .env or command line)
POSTGRES_PORT=5434 REDIS_PORT=6381 docker compose -f docker/dev/docker-compose.dev.yml up

# Or stop conflicting services
sudo systemctl stop postgresql
sudo systemctl stop redis
```

### Issue 2: Database connection error

```bash
# Check if database is running
docker compose -f docker/dev/docker-compose.dev.yml ps

# Restart database
docker compose -f docker/dev/docker-compose.dev.yml restart aksesekolah-db-dev

# Check database logs
docker compose -f docker/dev/docker-compose.dev.yml logs aksesekolah-db-dev
```

### Issue 3: Hot reload not working

```bash
# Rebuild without cache
docker compose -f docker/dev/docker-compose.dev.yml build --no-cache

# Check if volumes are mounted correctly
docker compose -f docker/dev/docker-compose.dev.yml config
```

### Issue 4: Out of disk space

```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove everything
docker system prune -a --volumes
```

---

## 📝 Development Workflow

### 1. First Time Setup

```bash
# Clone repository
git clone <repository-url>
cd aksesekolah.id

# Copy environment file
cp .env.local.example .env.local

# Start development environment
docker compose -f docker/dev/docker-compose.dev.yml up -d

# Run migrations
docker compose -f docker/dev/docker-compose.dev.yml exec aksesekolah-dev pnpm prisma migrate dev

# Seed database (optional)
docker compose -f docker/dev/docker-compose.dev.yml exec aksesekolah-dev pnpm prisma db seed
```

### 2. Daily Development

```bash
# Start services
docker compose -f docker/dev/docker-compose.dev.yml up -d

# View logs
docker compose -f docker/dev/docker-compose.dev.yml logs -f aksesekolah-dev

# Make changes to code (hot reload will pick up changes)

# Stop services when done
docker compose -f docker/dev/docker-compose.dev.yml down
```

### 3. Database Changes

```bash
# Create migration
docker compose -f docker/dev/docker-compose.dev.yml exec aksesekolah-dev pnpm prisma migrate dev --name your_migration_name

# Apply migrations
docker compose -f docker/dev/docker-compose.dev.yml exec aksesekolah-dev pnpm prisma migrate deploy

# Reset database
docker compose -f docker/dev/docker-compose.dev.yml exec aksesekolah-dev pnpm prisma migrate reset
```

---

## 🚀 Production Deployment

### 1. Build and Push Image

```bash
# Build production image
docker build -f docker/Dockerfile -t clients-aksesekolah:latest .

# Tag image
docker tag clients-aksesekolah:latest registry.example.com/clients-aksesekolah:latest

# Push to registry
docker push registry.example.com/clients-aksesekolah:latest
```

### 2. Deploy to Server

```bash
# SSH to server
ssh user@server

# Pull latest image
docker pull registry.example.com/clients-aksesekolah:latest

# Start services
docker compose -f docker/prod/docker-compose.prod.yml up -d

# Run migrations
docker compose -f docker/prod/docker-compose.prod.yml exec aksesekolah-prod pnpm prisma migrate deploy
```

---

## 📊 Monitoring

### Health Checks

```bash
# Check health status
docker compose -f docker/prod/docker-compose.prod.yml ps

# View health check logs
docker inspect --format='{{json .State.Health}}' clients-aksesekolah-app-prod | jq
```

### Resource Usage

```bash
# View resource usage
docker stats

# View specific container
docker stats clients-aksesekolah-app-prod
```

### Logs

```bash
# View all logs
docker compose -f docker/prod/docker-compose.prod.yml logs

# View specific service logs
docker compose -f docker/prod/docker-compose.prod.yml logs aksesekolah-prod

# Follow logs
docker compose -f docker/prod/docker-compose.prod.yml logs -f

# View last 100 lines
docker compose -f docker/prod/docker-compose.prod.yml logs --tail=100
```

---

## 🔒 Security Best Practices

1. **Never commit .env files**
   - Use .env.example as template
   - Keep secrets in environment variables

2. **Use non-root user**
   - Production Dockerfile uses nextjs user
   - UID/GID: 1001

3. **Limit resources**
   - Set memory and CPU limits
   - Prevent resource exhaustion

4. **Health checks**
   - Monitor application health
   - Auto-restart on failure

5. **Network isolation**
   - Use Docker networks
   - Limit external access

---

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Docker Documentation](https://nextjs.org/docs/deployment#docker-image)
- [Multi-stage Builds](https://docs.docker.com/build/building/multi-stage/)

---

## ✅ Checklist

### Development Setup
- [ ] Install Docker and Docker Compose
- [ ] Copy .env.local.example to .env.local
- [ ] Start development environment
- [ ] Run database migrations
- [ ] Access app at http://localhost:3000

### Production Deployment
- [ ] Set production environment variables
- [ ] Build production image
- [ ] Push to registry
- [ ] Deploy to server
- [ ] Run migrations
- [ ] Verify health checks
- [ ] Monitor logs

---

**Happy Dockerizing!** 🐳

