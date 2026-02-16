# App Structure Analysis & Recommendations

## Current Structure

```
app/
├── (platform)/              # Route group - Dashboard platform
│   ├── (auth)/             # Auth pages (signin, signup)
│   │   ├── signin/
│   │   └── signup/
│   ├── dashboard/
│   │   ├── admin/          # Platform admin dashboard
│   │   ├── tenant/         # Tenant dashboard
│   │   └── page.tsx        # Redirect logic
│   └── layout.tsx          # Platform layout (minimal)
│
├── [tenant]/               # Dynamic tenant routes
│   ├── (auth)/            # Tenant-specific auth
│   ├── academic/
│   ├── admissions/
│   ├── contact/
│   └── ...                # Public tenant pages
│
├── www/                   # Platform landing page
│   ├── layout.tsx
│   └── page.tsx
│
├── api/                   # API routes
├── login/                 # Legacy redirect
├── register/              # Legacy redirect
└── layout.tsx             # Root layout

```

## Problems Identified

### 1. **Redirect Loop Issue**
- Auth check di nested layouts (admin/tenant) menyebabkan circular redirects
- Middleware dan layout sama-sama melakukan auth check
- Cookie tidak terbaca dengan benar di layout

### 2. **Inconsistent Auth Flow**
- `getUserFromSession()` di nested layouts
- `getCurrentUser()` di dashboard/page.tsx (JWT-based)
- Dua sistem auth berbeda!

### 3. **Route Group Structure**
Current: `(platform)/dashboard/admin/` dan `(platform)/dashboard/tenant/`
- Terlalu nested
- Auth check di level yang salah
- Dashboard page.tsx tidak diperlukan jika auth di parent

### 4. **Legacy Routes**
- `/login` dan `/register` hanya redirect
- Bisa dihapus atau diganti dengan middleware redirect

## Recommended Structure

### Option A: Auth di Platform Layout (RECOMMENDED)

```
app/
├── (platform)/              # Protected platform routes
│   ├── layout.tsx          # ✅ AUTH CHECK HERE
│   ├── (auth)/             # Public auth pages
│   │   ├── layout.tsx      # Override parent auth
│   │   ├── signin/
│   │   └── signup/
│   ├── admin/              # Platform admin
│   │   ├── layout.tsx      # Role check only
│   │   ├── overview/
│   │   ├── tenants/
│   │   └── users/
│   └── tenant/             # Tenant dashboard
│       ├── layout.tsx      # TenantId check only
│       ├── overview/
│       └── settings/
│
├── [tenant]/               # Public tenant pages
├── www/                    # Platform landing
└── api/                    # API routes
```

**Benefits:**
- Single auth check di platform layout
- Nested layouts hanya check role/tenantId
- No circular redirects
- Clear separation of concerns

### Option B: Separate Auth & Dashboard Groups

```
app/
├── (auth)/                 # All auth pages
│   ├── signin/
│   └── signup/
│
├── (dashboard)/            # All protected routes
│   ├── layout.tsx          # ✅ AUTH CHECK HERE
│   ├── admin/
│   │   ├── layout.tsx      # Role check
│   │   └── overview/
│   └── tenant/
│       ├── layout.tsx      # TenantId check
│       └── overview/
│
├── [tenant]/               # Public tenant pages
└── www/                    # Platform landing
```

**Benefits:**
- Even clearer separation
- Auth pages completely separate
- Dashboard routes grouped together

## Recommended Implementation (Option A)

### 1. Platform Layout with Auth
```typescript
// app/(platform)/layout.tsx
import { getUserFromSession } from "@/lib/auth/get-user-from-session";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserFromSession();

  // Allow auth routes to pass through
  // This is handled by nested (auth) layout
  
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
```

### 2. Auth Layout (Override Parent)
```typescript
// app/(platform)/(auth)/layout.tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // No auth check - public routes
  return <>{children}</>;
}
```

### 3. Admin Layout (Role Check Only)
```typescript
// app/(platform)/admin/layout.tsx
import { getUserFromSession } from "@/lib/auth/get-user-from-session";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserFromSession();

  if (!user) {
    redirect("/signin");
  }

  if (user.role !== "admin") {
    redirect("/tenant/overview");
  }

  return (
    <div className="admin-layout">
      {/* Admin navigation */}
      {children}
    </div>
  );
}
```

### 4. Tenant Layout (TenantId Check Only)
```typescript
// app/(platform)/tenant/layout.tsx
import { getUserFromSession } from "@/lib/auth/get-user-from-session";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserFromSession();

  if (!user) {
    redirect("/signin");
  }

  if (user.role === "admin") {
    redirect("/admin/overview");
  }

  if (!user.tenantId) {
    redirect("/signin");
  }

  return (
    <div className="tenant-layout">
      {/* Tenant navigation */}
      {children}
    </div>
  );
}
```

## Migration Steps

1. ✅ Fix signin page to use correct API endpoint
2. ✅ Add logging to debug redirect loop
3. 🔄 Restructure routes:
   - Move `dashboard/admin/` → `admin/`
   - Move `dashboard/tenant/` → `tenant/`
   - Remove `dashboard/page.tsx`
4. 🔄 Update layouts with proper auth flow
5. 🔄 Test auth flow end-to-end
6. 🔄 Remove legacy `/login` and `/register` routes

## Auth Flow Diagram

```
Request → Middleware (proxy.ts)
  ↓
  ├─ Dashboard subdomain?
  │  ├─ /signin, /signup → Allow (public)
  │  └─ /admin, /tenant → Check cookie exists
  │
  └─ Continue to Layout
     ↓
     Platform Layout
     ↓
     ├─ (auth) routes → No auth check
     ├─ /admin → Check role="admin"
     └─ /tenant → Check tenantId exists
```

## Key Principles

1. **Single Source of Truth**: Auth check di satu tempat
2. **Layered Security**: Middleware → Layout → Nested Layout
3. **No Circular Redirects**: Each layer has specific responsibility
4. **Clear Separation**: Public vs Protected routes

## Next Steps

Choose Option A or B, then:
1. Restructure routes
2. Update layouts
3. Test thoroughly
4. Update documentation
