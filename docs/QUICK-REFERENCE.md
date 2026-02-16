# Multi-Tenant Quick Reference

## 🚀 Quick Start

### API Route (Tenant-Scoped)
```typescript
import { withTenantPrisma } from "@/lib/api/with-tenant-prisma";

export async function GET(request: NextRequest) {
  const { prisma, tenant } = await withTenantPrisma(request);
  const data = await prisma.student.findMany();
  return NextResponse.json({ data });
}
```

### API Route (Admin)
```typescript
import { withAdminPrisma } from "@/lib/api/with-tenant-prisma";

export async function GET(request: NextRequest) {
  const { prisma } = await withAdminPrisma(request);
  const data = await prisma.tenant.findMany();
  return NextResponse.json({ data });
}
```

### Server Component
```typescript
import { getTenantContext } from "@/lib/tenant/get-tenant-context";
import { prisma } from "@/lib/prisma";

export default async function Page() {
  const tenant = await getTenantContext();
  const students = await prisma.student.findMany({
    where: { schoolId: tenant.schools[0].id }
  });
  return <div>{/* ... */}</div>;
}
```

## 📋 Common Patterns

### Get School ID for Tenant
```typescript
import { getSchoolIdForTenant } from "@/lib/tenant/tenant-isolation";

const schoolId = await getSchoolIdForTenant(tenantId);
```

### Query with Tenant Filter
```typescript
// Via school isolation (current pattern)
const students = await prisma.student.findMany({
  where: { schoolId }
});

// Via tenant middleware (for User model)
const users = await prisma.user.findMany({
  where: { tenantId }
});
```

### Create with Tenant Context
```typescript
const student = await prisma.student.create({
  data: {
    name: "John Doe",
    email: "john@example.com",
    schoolId, // Always include schoolId
  }
});
```

## 🔒 Security Rules

### ✅ DO
- Use `withTenantPrisma()` in API routes
- Always filter by `schoolId` or `tenantId`
- Validate tenant ownership for sensitive operations
- Check tenant status before serving content

### ❌ DON'T
- Use raw `prisma` import in tenant APIs
- Hardcode tenant IDs
- Skip tenant filtering
- Expose admin endpoints without auth check

## 📊 Monitoring

### Check Query Performance
```bash
# Get stats
GET /api/admin/monitoring/queries

# Filter by tenant
GET /api/admin/monitoring/queries?tenantId=xxx

# Find slow queries
GET /api/admin/monitoring/queries?minDuration=1000
```

### Verify Implementation
```bash
npx tsx scripts/verify-multi-tenant.ts
```

## 🐛 Debugging

### Enable Query Logging
Already enabled in development mode. Check console for:
```
[Prisma] Student.findMany - 45ms
[Prisma] SLOW QUERY: Student.findMany took 1250ms
```

### Check Tenant Context
```typescript
console.log("Tenant:", tenant);
console.log("School ID:", schoolId);
console.log("User:", user);
```

## 📚 Full Documentation

- [Strategy](./MULTI-TENANT-DATABASE-STRATEGY.md)
- [Development Guide](./MULTI-TENANT-DEVELOPMENT-GUIDE.md)
- [Implementation](./MVP-MULTI-TENANT-IMPLEMENTATION.md)
- [Complete](./IMPLEMENTATION-COMPLETE.md)
