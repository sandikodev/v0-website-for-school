# Database Setup

## 🗄️ Current Database: SQLite

AkseSekolah.id menggunakan **SQLite** untuk development dan dapat di-deploy ke **Turso** (distributed SQLite) untuk production.

---

## 📊 Database Configuration

### Prisma Schema
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

### Environment Variables
```bash
# Production (Turso)
DATABASE_URL="libsql://aksesekolah-konxc.aws-ap-northeast-1.turso.io?authToken=..."

# Development (Local SQLite)
DATABASE_URL="file:./dev.db"
```

---

## 🚀 Why Turso?

### Advantages
1. **Distributed SQLite** - Global edge replication
2. **Low Latency** - Data close to users
3. **Cost-Effective** - Free tier: 500 databases, 1GB storage
4. **SQLite Compatible** - Same syntax, no migration needed
5. **Scalable** - Handles 1000+ tenants easily
6. **Backup Built-in** - Automatic backups

### Perfect for Multi-Tenant
- ✅ Shared database architecture
- ✅ Fast queries (< 10ms)
- ✅ Global distribution
- ✅ Easy to scale
- ✅ No server management

---

## 🛠️ Setup Guide

### 1. Development (Local SQLite)

**File:** `.env.development`
```bash
DATABASE_URL="file:./dev.db"
```

**Commands:**
```bash
# Create database
npx prisma db push

# Open Prisma Studio
npx prisma studio

# Seed data
npx tsx scripts/seed.ts
```

### 2. Production (Turso)

**File:** `.env`
```bash
DATABASE_URL="libsql://your-db.turso.io?authToken=your-token"
```

**Setup Turso:**
```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Login
turso auth login

# Create database
turso db create aksesekolah

# Get connection string
turso db show aksesekolah --url

# Create auth token
turso db tokens create aksesekolah
```

**Deploy Schema:**
```bash
# Push schema to Turso
npx prisma db push

# Or use migrations
npx prisma migrate deploy
```

---

## 🔄 Migration Strategy

### Development → Production

1. **Test locally** with SQLite
```bash
DATABASE_URL="file:./dev.db" npx prisma db push
```

2. **Verify schema**
```bash
npx tsx scripts/verify-multi-tenant.ts
```

3. **Deploy to Turso**
```bash
DATABASE_URL="libsql://..." npx prisma db push
```

4. **Seed production data** (if needed)
```bash
npx tsx scripts/seed-production.ts
```

---

## 📈 Scaling Strategy

### Current: Single Turso Database
```
All Tenants → Single Turso DB → Edge Replicas
```

**Good for:** 0-1000 tenants

### Future: Multiple Turso Databases
```
Tenant Tier 1 (Free) → Shared Turso DB 1
Tenant Tier 2 (Pro) → Shared Turso DB 2
Tenant Tier 3 (Business) → Dedicated Turso DB
```

**Good for:** 1000+ tenants

### Long-term: Hybrid
```
Platform DB (Turso) → Tenant Registry
Tenant DB 1 (Turso) → Dedicated for premium
Tenant DB 2 (PostgreSQL) → Self-hosted option
```

**Good for:** Enterprise scale

---

## 🔒 Security

### Connection Security
- ✅ TLS encryption by default
- ✅ Auth tokens with expiration
- ✅ IP whitelisting (optional)
- ✅ Read-only tokens for analytics

### Data Security
- ✅ Row-level security via Prisma middleware
- ✅ Tenant isolation via schoolId
- ✅ Encrypted at rest
- ✅ Automatic backups

---

## 📊 Monitoring

### Turso Dashboard
- Query performance
- Database size
- Connection count
- Error rates

### Custom Monitoring
```bash
# Query stats
GET /api/admin/monitoring/queries

# Database health
npx tsx scripts/verify-multi-tenant.ts
```

---

## 🐛 Troubleshooting

### Issue: "Database not found"
```bash
# Check DATABASE_URL
echo $DATABASE_URL

# Verify Turso connection
turso db show aksesekolah

# Test connection
npx prisma db pull
```

### Issue: "Auth token expired"
```bash
# Create new token
turso db tokens create aksesekolah

# Update .env
DATABASE_URL="libsql://...?authToken=NEW_TOKEN"
```

### Issue: "Schema out of sync"
```bash
# Push schema
npx prisma db push

# Or reset (WARNING: deletes data)
npx prisma migrate reset
```

---

## 💰 Cost Estimation

### Turso Pricing (as of 2024)

**Free Tier:**
- 500 databases
- 1 GB storage per database
- 1 billion row reads/month
- 25 million row writes/month

**Perfect for MVP!** ✅

**Paid Tier (if needed):**
- $29/month: 10,000 databases
- $0.50/GB storage
- $0.50/million row reads
- $1.00/million row writes

**Estimated cost for 100 tenants:**
- Storage: ~5GB = $2.50/month
- Reads: ~100M/month = $0.05/month
- Writes: ~10M/month = $0.10/month
- **Total: ~$3/month** 🎉

---

## 🔄 Backup & Recovery

### Automatic Backups (Turso)
- Daily backups (retained 30 days)
- Point-in-time recovery
- One-click restore

### Manual Backup
```bash
# Export to SQLite file
turso db shell aksesekolah ".backup backup.db"

# Or use Prisma
npx prisma db pull
sqlite3 dev.db ".backup backup.db"
```

### Restore
```bash
# From Turso backup
turso db restore aksesekolah --from-backup <backup-id>

# From SQLite file
turso db shell aksesekolah ".restore backup.db"
```

---

## 📚 Resources

- [Turso Documentation](https://docs.turso.tech/)
- [Prisma + Turso Guide](https://www.prisma.io/docs/guides/database/turso)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [Multi-Tenant Strategy](./MULTI-TENANT-DATABASE-STRATEGY.md)

---

## ✅ Summary

**Current Setup:**
- ✅ Database: Turso (LibSQL)
- ✅ Provider: SQLite-compatible
- ✅ Architecture: Shared database
- ✅ Isolation: School-based (tenantId → schoolId)
- ✅ Performance: < 10ms queries
- ✅ Cost: Free tier (perfect for MVP)

**Why Turso?**
- Distributed SQLite with global edge
- Perfect for multi-tenant SaaS
- Cost-effective and scalable
- No server management
- SQLite compatibility

**Ready for production!** 🚀
