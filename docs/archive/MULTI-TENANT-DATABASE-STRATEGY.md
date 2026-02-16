# Multi-Tenant Database Strategy - Brainstorming

## Current Situation

- **Platform**: AkseSekolah.id (SaaS untuk sekolah)
- **Current DB**: SQLite (single database)
- **Tenants**: Multiple schools, each with their own data
- **Scale**: Starting small, potential to grow

## 🎯 Three Main Approaches

### 1. Shared Database, Shared Schema (Current)
**Semua tenant dalam 1 database, 1 schema**

```
┌─────────────────────────────┐
│      Single Database        │
├─────────────────────────────┤
│ tenants                     │
│ users (tenantId FK)         │
│ schools (tenantId FK)       │
│ students (tenantId FK)      │
│ applications (tenantId FK)  │
└─────────────────────────────┘
```

**Pros:**
- ✅ Simple setup & maintenance
- ✅ Easy to implement
- ✅ Cost-effective (1 database)
- ✅ Easy cross-tenant queries (analytics, admin)
- ✅ Easy backup & migration
- ✅ Prisma works out of the box

**Cons:**
- ❌ Security risk (1 bug = all data exposed)
- ❌ Noisy neighbor problem (1 tenant slow = all slow)
- ❌ Hard to scale individual tenants
- ❌ Compliance issues (data residency)
- ❌ Can't offer "bring your own database"

**Best for:**
- Small to medium SaaS (< 1000 tenants)
- Trusted tenants (schools, not public)
- Simple data model
- **Current stage: PERFECT** ✅

---

### 2. Shared Database, Separate Schema
**1 database, tapi setiap tenant punya schema sendiri**

```
┌─────────────────────────────┐
│      Single Database        │
├─────────────────────────────┤
│ Schema: platform            │
│   - tenants                 │
│   - platform_users          │
├─────────────────────────────┤
│ Schema: tenant_smpn1        │
│   - users                   │
│   - students                │
│   - applications            │
├─────────────────────────────┤
│ Schema: tenant_smkn2        │
│   - users                   │
│   - students                │
│   - applications            │
└─────────────────────────────┘
```

**Pros:**
- ✅ Better isolation than shared schema
- ✅ Still 1 database (easier ops)
- ✅ Can customize schema per tenant
- ✅ Easier to migrate tenant to own DB later

**Cons:**
- ❌ SQLite doesn't support schemas! (PostgreSQL only)
- ❌ Complex Prisma setup (dynamic schema)
- ❌ Still noisy neighbor problem
- ❌ Migration complexity (N schemas)

**Best for:**
- PostgreSQL-based SaaS
- Medium scale (100-10k tenants)
- Need some isolation but not full

**For us:**
- ❌ **NOT POSSIBLE with SQLite**

---

### 3. Separate Database per Tenant
**Setiap tenant punya database sendiri**

```
┌─────────────────────┐
│  Platform Database  │
│  - tenants          │
│  - platform_users   │
│  - billing          │
└─────────────────────┘

┌─────────────────────┐
│  Tenant: SMPN1      │
│  - users            │
│  - students         │
│  - applications     │
└─────────────────────┘

┌─────────────────────┐
│  Tenant: SMKN2      │
│  - users            │
│  - students         │
│  - applications     │
└─────────────────────┘
```

**Pros:**
- ✅ Perfect isolation (security)
- ✅ No noisy neighbor
- ✅ Easy to scale per tenant
- ✅ Can offer "bring your own DB"
- ✅ Compliance-friendly (data residency)
- ✅ Easy to backup/restore per tenant
- ✅ Can use different DB types per tenant

**Cons:**
- ❌ Complex connection management
- ❌ More expensive (N databases)
- ❌ Hard to do cross-tenant queries
- ❌ Migration complexity (N databases)
- ❌ Monitoring complexity

**Best for:**
- Large scale SaaS (1000+ tenants)
- Enterprise customers
- High security requirements
- **Future growth** 🚀

---

## 🎯 Recommended Strategy: Hybrid Approach

### Phase 1: Shared Database (NOW)
**Current stage: 0-100 tenants**

```prisma
model Tenant {
  id    String @id
  slug  String @unique
  // ... tenant config
}

model Student {
  id       String @id
  tenantId String // FK to Tenant
  tenant   Tenant @relation(...)
  // ... student data
}
```

**Implementation:**
- ✅ Already done!
- ✅ Add `tenantId` to all tenant-specific tables
- ✅ Use Row-Level Security (RLS) in queries
- ✅ Prisma middleware for auto-filtering

**Security:**
```typescript
// Prisma middleware - auto add tenantId filter
prisma.$use(async (params, next) => {
  if (params.model && tenantModels.includes(params.model)) {
    if (params.action === 'findMany' || params.action === 'findFirst') {
      params.args.where = {
        ...params.args.where,
        tenantId: currentTenantId,
      };
    }
  }
  return next(params);
});
```

---

### Phase 2: Hybrid (100-1000 tenants)
**Mix of shared DB + separate DB for premium tenants**

```
Platform DB (shared)
├── Free tier tenants (shared schema)
└── Small tenants

Separate DBs
├── Premium Tenant 1 (dedicated DB)
├── Premium Tenant 2 (dedicated DB)
└── Enterprise Tenant (their own DB)
```

**Implementation:**
```typescript
// Dynamic Prisma client per tenant
function getPrismaClient(tenantId: string) {
  const tenant = getTenant(tenantId);
  
  if (tenant.dbType === 'dedicated') {
    // Use dedicated database
    return new PrismaClient({
      datasources: {
        db: { url: tenant.databaseUrl }
      }
    });
  }
  
  // Use shared database
  return sharedPrismaClient;
}
```

**Tenant config:**
```prisma
model Tenant {
  id          String  @id
  slug        String  @unique
  
  // Database config
  dbType      String  @default("shared") // shared, dedicated, external
  databaseUrl String? // For dedicated/external
  dbProvider  String  @default("sqlite") // sqlite, postgres, mysql
}
```

---

### Phase 3: Full Separation (1000+ tenants)
**All tenants get dedicated databases**

**Options:**
1. **Turso (SQLite)**: Each tenant = 1 Turso database
2. **PostgreSQL**: Each tenant = 1 schema or 1 database
3. **Hybrid**: Mix based on tenant tier

---

## 🔧 Technical Considerations

### 1. Connection Pooling
**Problem**: N tenants = N database connections

**Solution:**
```typescript
// Connection pool per tenant
const connectionPools = new Map<string, PrismaClient>();

function getTenantPrisma(tenantId: string) {
  if (!connectionPools.has(tenantId)) {
    const tenant = getTenant(tenantId);
    connectionPools.set(tenantId, new PrismaClient({
      datasources: { db: { url: tenant.databaseUrl } }
    }));
  }
  return connectionPools.get(tenantId)!;
}

// Cleanup inactive connections
setInterval(() => {
  for (const [tenantId, client] of connectionPools) {
    if (isInactive(tenantId)) {
      client.$disconnect();
      connectionPools.delete(tenantId);
    }
  }
}, 60000); // Every minute
```

### 2. Migration Management
**Problem**: How to migrate N databases?

**Solution:**
```bash
# Shared DB: Easy
npx prisma migrate deploy

# Separate DBs: Need script
for tenant in $(get_all_tenants); do
  DATABASE_URL=$tenant.databaseUrl npx prisma migrate deploy
done
```

### 3. Backup Strategy
**Shared DB:**
```bash
# Single backup
sqlite3 platform.db ".backup platform-backup.db"
```

**Separate DBs:**
```bash
# Backup all tenant DBs
for tenant in $(get_all_tenants); do
  backup_tenant_db $tenant
done
```

### 4. Cross-Tenant Queries
**Shared DB:** Easy
```typescript
// Get all students across tenants (admin)
const allStudents = await prisma.student.findMany();
```

**Separate DBs:** Complex
```typescript
// Need to query each DB and merge
const allStudents = [];
for (const tenant of tenants) {
  const prisma = getTenantPrisma(tenant.id);
  const students = await prisma.student.findMany();
  allStudents.push(...students);
}
```

---

## 💡 Recommendation for AkseSekolah.id

### Current Stage (0-100 tenants): Shared Database ✅

**Why:**
1. Simple to maintain
2. Cost-effective
3. Easy to implement
4. Schools are trusted tenants (not public)
5. Can migrate later if needed

**Action Items:**
- ✅ Already using `tenantId` FK
- ⚠️ Need: Prisma middleware for RLS
- ⚠️ Need: Audit logging per tenant
- ⚠️ Need: Query performance monitoring

---

### Future (100+ tenants): Hybrid Approach

**Tier-based strategy:**

| Tier | Database | Price | Features |
|------|----------|-------|----------|
| Free | Shared | $0 | Basic features, shared resources |
| Pro | Shared | $29/mo | More storage, priority support |
| Business | Dedicated | $99/mo | Dedicated DB, better performance |
| Enterprise | External | Custom | Bring your own DB, full control |

**Implementation:**
```typescript
// Tenant config
interface TenantConfig {
  tier: 'free' | 'pro' | 'business' | 'enterprise';
  dbType: 'shared' | 'dedicated' | 'external';
  databaseUrl?: string;
  dbProvider?: 'sqlite' | 'postgres' | 'mysql';
}
```

---

## 🚀 Migration Path

### Step 1: Optimize Current (Shared DB)
```typescript
// Add Prisma middleware for RLS
// Add query monitoring
// Add per-tenant rate limiting
```

### Step 2: Support Dedicated DBs
```typescript
// Add dbType field to Tenant
// Implement dynamic Prisma client
// Test with 1-2 premium tenants
```

### Step 3: Offer "Bring Your Own DB"
```typescript
// Support external database URLs
// Support multiple DB providers
// Add DB health checks
```

### Step 4: Full Separation (if needed)
```typescript
// Migrate all tenants to dedicated DBs
// Keep platform DB for tenant registry
// Implement distributed queries for admin
```

---

## 🎯 Decision Matrix

| Factor | Shared DB | Separate DB |
|--------|-----------|-------------|
| **Setup Complexity** | ⭐ Easy | ⭐⭐⭐ Complex |
| **Maintenance** | ⭐ Easy | ⭐⭐⭐ Hard |
| **Cost** | ⭐ Low | ⭐⭐⭐ High |
| **Security** | ⭐⭐ Medium | ⭐⭐⭐ High |
| **Scalability** | ⭐⭐ Medium | ⭐⭐⭐ High |
| **Isolation** | ⭐ Low | ⭐⭐⭐ High |
| **Cross-tenant queries** | ⭐⭐⭐ Easy | ⭐ Hard |
| **Compliance** | ⭐⭐ Medium | ⭐⭐⭐ High |

---

## 📝 Next Steps

### Immediate (This Week)
1. ✅ Keep shared database
2. ⚠️ Add Prisma middleware for RLS
3. ⚠️ Add query logging per tenant
4. ⚠️ Document current schema

### Short-term (1-3 Months)
1. Monitor query performance per tenant
2. Identify "noisy neighbors"
3. Plan tier-based pricing
4. Prototype dedicated DB for 1 tenant

### Long-term (6-12 Months)
1. Implement hybrid approach
2. Offer dedicated DB for premium tier
3. Support external databases
4. Build migration tools

---

## 🤔 Questions to Consider

1. **How many tenants do we expect in 1 year?**
   - < 100: Stay with shared DB
   - 100-1000: Plan hybrid
   - > 1000: Plan full separation

2. **What's our target customer?**
   - Small schools: Shared DB is fine
   - Large schools/universities: Need dedicated
   - Government: Need compliance (separate DB)

3. **What's our budget for infrastructure?**
   - Limited: Shared DB
   - Flexible: Hybrid
   - Unlimited: Separate DB per tenant

4. **Do we need data residency compliance?**
   - No: Shared DB is fine
   - Yes: Need separate DBs per region

5. **Will tenants want to self-host?**
   - No: Keep it simple
   - Yes: Need to support external DBs

---

## 💭 My Recommendation

**Start with Shared Database (current), but prepare for Hybrid:**

1. **Now**: Optimize shared DB with proper RLS
2. **Next**: Add `dbType` field to Tenant model
3. **Later**: Implement dynamic Prisma client
4. **Future**: Offer dedicated DB as premium feature

**Why?**
- Premature optimization is evil
- Schools are trusted tenants
- Can migrate later without breaking changes
- Focus on product features first, not infrastructure

**But prepare for:**
- Add abstraction layer for database access
- Don't hardcode shared DB assumptions
- Design schema to be migration-friendly
- Monitor performance per tenant

---

## 🎬 Conclusion

**Current answer: Shared Database is PERFECT for now** ✅

**Future answer: Hybrid (shared + dedicated) when we hit 100+ tenants** 🚀

**The key: Build abstraction layer NOW so migration is easy LATER** 🔑
