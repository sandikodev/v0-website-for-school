# Multi-Tenant Development Guide

## Overview

AkseSekolah.id menggunakan **Shared Database, Shared Schema** architecture dengan Row-Level Security (RLS) untuk isolasi data antar tenant.

## 🔒 Security Model

### Row-Level Security (RLS)
Setiap query otomatis di-filter berdasarkan `tenantId` menggunakan Prisma middleware.

```typescript
// ❌ WRONG: Direct Prisma query (no tenant filtering)
const students = await prisma.student.findMany();

// ✅ CORRECT: Use tenant-scoped Prisma
const { prisma: tenantPrisma } = await withTenantPrisma(request);
const students = await tenantPrisma.student.findMany();
```

## 📋 Database Schema Rules

### 1. Add tenantId to All Tenant-Specific Models

```prisma
model Student {
  id       String @id @default(cuid())
  name     String
  
  // Required: Foreign key to Tenant
  tenantId String
  tenant   Tenant @relation(fields: [tenantId], references: [id])
  
  // ... other fields
  
  @@index([tenantId]) // Important for query performance
}
```

### 2. Models Without tenantId
Only for platform-level data:
- `Tenant` (tenant registry)
- Platform admin users
- Billing/subscription data
- System logs

## 🛠️ API Development

### Pattern 1: Tenant-Scoped API (Most Common)

```typescript
// app/api/students/route.ts
import { NextRequest, NextResponse } from "next/server";
import { withTenantPrisma } from "@/lib/api/with-tenant-prisma";

export async function GET(request: NextRequest) {
  try {
    // Get tenant-scoped Prisma client
    const { prisma, tenant, user } = await withTenantPrisma(request);
    
    // All queries automatically filtered by tenantId
    const students = await prisma.student.findMany({
      where: {
        // No need to add tenantId here, middleware handles it
        status: "active",
      },
    });
    
    return NextResponse.json({ students });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 401 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { prisma, tenantId } = await withTenantPrisma(request);
    const body = await request.json();
    
    // tenantId automatically injected by middleware
    const student = await prisma.student.create({
      data: {
        name: body.name,
        email: body.email,
        // No need to add tenantId, middleware handles it
      },
    });
    
    return NextResponse.json({ student });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
```

### Pattern 2: Admin API (Cross-Tenant)

```typescript
// app/api/admin/tenants/route.ts
import { NextRequest, NextResponse } from "next/server";
import { withAdminPrisma } from "@/lib/api/with-tenant-prisma";

export async function GET(request: NextRequest) {
  try {
    // Get admin Prisma (no tenant filtering)
    const { prisma, user } = await withAdminPrisma(request);
    
    // Can query across all tenants
    const tenants = await prisma.tenant.findMany({
      include: {
        _count: {
          select: {
            users: true,
            students: true,
          },
        },
      },
    });
    
    return NextResponse.json({ tenants });
  } catch (error) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
}
```

### Pattern 3: Manual Tenant Filtering (Advanced)

```typescript
// When you need custom logic
import { prisma } from "@/lib/prisma";
import { applyTenantMiddleware } from "@/lib/prisma-middleware";

export async function GET(request: NextRequest) {
  const tenantId = request.headers.get("x-tenant-id");
  
  if (!tenantId) {
    return NextResponse.json({ error: "No tenant" }, { status: 400 });
  }
  
  // Create tenant-scoped client
  const tenantPrisma = Object.create(prisma);
  applyTenantMiddleware(tenantPrisma, tenantId);
  
  // Use it
  const data = await tenantPrisma.student.findMany();
  
  return NextResponse.json({ data });
}
```

## 🎨 Frontend Development

### Get Tenant Context in Server Components

```typescript
// app/[tenant]/students/page.tsx
import { getTenantContext } from "@/lib/tenant/get-tenant-context";
import { prisma } from "@/lib/prisma";

export default async function StudentsPage() {
  const tenant = await getTenantContext();
  
  if (!tenant) {
    return <div>Tenant not found</div>;
  }
  
  // Query with explicit tenantId
  const students = await prisma.student.findMany({
    where: { tenantId: tenant.id },
  });
  
  return (
    <div>
      <h1>{tenant.name} - Students</h1>
      {/* ... */}
    </div>
  );
}
```

### Get Tenant Context in Client Components

```typescript
"use client";

import { useEffect, useState } from "react";

export function StudentList() {
  const [students, setStudents] = useState([]);
  
  useEffect(() => {
    // API automatically scoped to tenant via headers
    fetch("/api/students")
      .then(res => res.json())
      .then(data => setStudents(data.students));
  }, []);
  
  return (
    <ul>
      {students.map(student => (
        <li key={student.id}>{student.name}</li>
      ))}
    </ul>
  );
}
```

## 🧪 Testing Multi-Tenant

### Test Data Isolation

```typescript
// tests/multi-tenant.test.ts
import { prisma } from "@/lib/prisma";
import { applyTenantMiddleware } from "@/lib/prisma-middleware";

describe("Multi-tenant isolation", () => {
  it("should only return tenant's own data", async () => {
    // Create two tenants
    const tenant1 = await prisma.tenant.create({
      data: { name: "School 1", slug: "school1" },
    });
    const tenant2 = await prisma.tenant.create({
      data: { name: "School 2", slug: "school2" },
    });
    
    // Create students for each tenant
    await prisma.student.create({
      data: { name: "Student 1", tenantId: tenant1.id },
    });
    await prisma.student.create({
      data: { name: "Student 2", tenantId: tenant2.id },
    });
    
    // Query with tenant1 scope
    const tenant1Prisma = Object.create(prisma);
    applyTenantMiddleware(tenant1Prisma, tenant1.id);
    
    const students = await tenant1Prisma.student.findMany();
    
    // Should only get tenant1's student
    expect(students).toHaveLength(1);
    expect(students[0].name).toBe("Student 1");
  });
});
```

## ⚠️ Common Pitfalls

### 1. Forgetting to Use Tenant-Scoped Prisma

```typescript
// ❌ WRONG: Direct prisma import
import { prisma } from "@/lib/prisma";
const students = await prisma.student.findMany(); // Returns ALL students!

// ✅ CORRECT: Use withTenantPrisma
const { prisma: tenantPrisma } = await withTenantPrisma(request);
const students = await tenantPrisma.student.findMany(); // Only tenant's students
```

### 2. Missing tenantId Index

```prisma
// ❌ WRONG: No index on tenantId
model Student {
  id       String @id
  tenantId String
  tenant   Tenant @relation(...)
}

// ✅ CORRECT: Add index for performance
model Student {
  id       String @id
  tenantId String
  tenant   Tenant @relation(...)
  
  @@index([tenantId]) // Important!
}
```

### 3. Hardcoding Tenant ID

```typescript
// ❌ WRONG: Hardcoded tenant ID
const students = await prisma.student.findMany({
  where: { tenantId: "some-hardcoded-id" },
});

// ✅ CORRECT: Get from context
const { prisma: tenantPrisma } = await withTenantPrisma(request);
const students = await tenantPrisma.student.findMany();
```

## 📊 Performance Considerations

### 1. Always Index tenantId

```prisma
@@index([tenantId])
@@index([tenantId, createdAt]) // Composite index for common queries
```

### 2. Use Pagination

```typescript
// ❌ WRONG: Load all records
const students = await tenantPrisma.student.findMany();

// ✅ CORRECT: Paginate
const students = await tenantPrisma.student.findMany({
  take: 50,
  skip: page * 50,
  orderBy: { createdAt: "desc" },
});
```

### 3. Monitor Query Performance

```typescript
// Add query logging
prisma.$use(async (params, next) => {
  const before = Date.now();
  const result = await next(params);
  const after = Date.now();
  
  console.log(`Query ${params.model}.${params.action} took ${after - before}ms`);
  
  return result;
});
```

## 🚀 Future: Dedicated Databases

### Preparing for Migration

When we move to dedicated databases per tenant, the API code won't change much:

```typescript
// Current: Shared DB with middleware
const { prisma: tenantPrisma } = await withTenantPrisma(request);

// Future: Dedicated DB per tenant
const { prisma: tenantPrisma } = await withTenantPrisma(request);
// ^ Same API, different implementation

// Implementation will change to:
function getTenantPrisma(tenantId: string) {
  const tenant = getTenant(tenantId);
  
  if (tenant.dbType === "dedicated") {
    return new PrismaClient({
      datasources: { db: { url: tenant.databaseUrl } }
    });
  }
  
  // Fallback to shared DB with middleware
  const sharedPrisma = Object.create(prisma);
  applyTenantMiddleware(sharedPrisma, tenantId);
  return sharedPrisma;
}
```

## 📚 Best Practices

1. ✅ Always use `withTenantPrisma()` in API routes
2. ✅ Add `@@index([tenantId])` to all tenant models
3. ✅ Test data isolation in your tests
4. ✅ Monitor query performance per tenant
5. ✅ Use pagination for large datasets
6. ✅ Validate tenant ownership for sensitive operations
7. ✅ Log all cross-tenant queries (admin operations)
8. ✅ Never expose raw Prisma client to frontend

## 🔗 Related Docs

- [Multi-Tenant Database Strategy](./MULTI-TENANT-DATABASE-STRATEGY.md)
- [Tenant Status Management](./TENANT-STATUS-MANAGEMENT.md)
- [API Development Guide](./API-DEVELOPMENT-GUIDE.md)
