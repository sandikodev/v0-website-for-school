# Codebase Analysis - Structure Review

## 🔍 Current Structure Analysis

### Struktur Saat Ini

```
app/
├── (www)/                      # ✅ Platform landing
│   └── page.tsx                # aksesekolah.id
│
├── (platform)/                 # ⚠️ CONFUSING STRUCTURE
│   ├── layout.tsx              # Auth: role="admin" only
│   ├── (auth)/                 # Platform auth
│   │   ├── signin/
│   │   └── signup/
│   ├── admin/                  # ⚠️ Superadmin area
│   │   ├── dashboard/          # /admin/dashboard
│   │   ├── admissions/
│   │   ├── form-builder/
│   │   ├── messages/
│   │   ├── students/
│   │   └── submissions/
│   └── dashboard/              # ⚠️ PROBLEM: What is this?
│       ├── layout.tsx          # Different auth (any user)
│       ├── admissions/
│       ├── contact/
│       ├── messages/
│       ├── overview/
│       ├── school/
│       └── settings/
│
├── [jajal]/                    # ✅ Tenant public pages
│   ├── admissions/
│   ├── contact/
│   └── ...
│
├── login/                      # ✅ Shared login
└── register/                   # ✅ Shared register
```

---

## ⚠️ Issues Found

### Issue 1: Duplicate Dashboard Concept

```
Problem:
- (platform)/admin/dashboard     → Superadmin dashboard
- (platform)/dashboard           → ??? What is this for?

Confusion:
- Both are in (platform) route group
- But (platform)/layout.tsx requires role="admin"
- Yet (platform)/dashboard/layout.tsx allows any user
- This creates auth conflict!

URLs:
- /admin/dashboard  → Superadmin (clear)
- /dashboard        → ??? (unclear purpose)
```

### Issue 2: Auth Logic Conflict

```typescript
// (platform)/layout.tsx
if (user.role !== "admin") {
  redirect("/dashboard");  // ⚠️ Redirects to /dashboard
}

// But /dashboard is INSIDE (platform)!
// Which means it will check (platform)/layout.tsx again
// Which will redirect non-admin users
// INFINITE LOOP POTENTIAL!
```

### Issue 3: Unclear Purpose

```
Questions:
1. Apa purpose dari (platform)/dashboard?
2. Siapa yang seharusnya akses /dashboard?
3. Kenapa ada 2 dashboard di (platform)?
4. Apakah ini untuk tenant admin?
```

---

## 🎯 Recommended Structure

### Option A: Separate Tenant Dashboard (RECOMMENDED)

```
app/
├── (www)/                      # Platform landing
│   └── page.tsx                # aksesekolah.id
│
├── (platform)/                 # Platform admin ONLY
│   ├── layout.tsx              # Auth: role="admin"
│   ├── (auth)/
│   │   ├── signin/             # /signin
│   │   └── signup/             # /signup
│   └── admin/                  # Superadmin area
│       ├── dashboard/          # /admin/dashboard
│       ├── tenants/            # /admin/tenants (manage schools)
│       ├── users/              # /admin/users
│       └── settings/           # /admin/settings
│
├── [jajal]/                    # Tenant pages
│   ├── layout.tsx              # Tenant theming
│   ├── page.tsx                # Tenant homepage
│   ├── admissions/             # Public SPMB
│   ├── contact/                # Public contact
│   ├── (dashboard)/            # 🆕 Tenant dashboard (protected)
│   │   ├── layout.tsx          # Auth: user.tenantId matches
│   │   ├── overview/           # /dashboard/overview
│   │   ├── admissions/         # /dashboard/admissions
│   │   ├── messages/           # /dashboard/messages
│   │   ├── school/             # /dashboard/school
│   │   └── settings/           # /dashboard/settings
│   └── ...
│
├── login/                      # Shared login
└── register/                   # Shared register
```

**Rationale:**
- ✅ Clear separation: Platform admin vs Tenant dashboard
- ✅ Tenant dashboard di dalam [jajal] (makes sense!)
- ✅ URL: tenant.aksesekolah.id/dashboard (tenant-specific)
- ✅ No auth conflict
- ✅ Scalable

---

### Option B: Keep Current, Fix Auth (NOT RECOMMENDED)

```
app/
├── (platform)/
│   ├── layout.tsx              # Remove admin-only check
│   ├── (auth)/
│   ├── admin/                  # Add separate layout with admin check
│   │   ├── layout.tsx          # 🆕 Auth: role="admin"
│   │   └── dashboard/
│   └── dashboard/              # For all authenticated users
│       └── ...
```

**Problems:**
- ⚠️ Still confusing (why is tenant dashboard in platform?)
- ⚠️ URL: aksesekolah.id/dashboard (not tenant-specific)
- ⚠️ Doesn't align with platform-centric vision
- ⚠️ Hard to apply tenant branding

---

## 📊 Comparison

| Aspect | Current | Option A (Recommended) | Option B |
|--------|---------|----------------------|----------|
| **Clarity** | ❌ Confusing | ✅ Very clear | ⚠️ Still confusing |
| **URL Structure** | ❌ Unclear | ✅ Logical | ⚠️ Not tenant-specific |
| **Auth Logic** | ❌ Conflict | ✅ Clean | ⚠️ Complex |
| **Tenant Branding** | ❌ Hard | ✅ Easy | ❌ Hard |
| **Scalability** | ⚠️ Limited | ✅ Excellent | ⚠️ Limited |
| **Maintenance** | ❌ Confusing | ✅ Easy | ⚠️ Complex |

---

## 🎯 Detailed Recommendation: Option A

### Step 1: Move Dashboard to Tenant

```bash
# Move dashboard from (platform) to [jajal]
mv app/(platform)/dashboard app/[jajal]/(dashboard)
```

### Step 2: Update Dashboard Layout

```typescript
// app/[jajal]/(dashboard)/layout.tsx

import { getUserFromSession } from "@/lib/auth/get-user-from-session";
import { getTenantContext } from "@/lib/tenant/get-tenant-context";
import { redirect } from "next/navigation";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { DashboardMobileNav } from "@/components/site/dashboard-mobile-nav";

export const dynamic = 'force-dynamic';

export default async function TenantDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get user and tenant
  const user = await getUserFromSession();
  const tenant = await getTenantContext();

  // Check authentication
  if (!user) {
    redirect("/login");
  }

  // Check tenant access
  if (tenant && user.tenantId !== tenant.id) {
    redirect("/login");
  }

  return (
    <main className="container mx-auto px-4 py-2 lg:py-4 pb-20 md:pb-6">
      <DashboardClient user={user} tenant={tenant} />
      {children}
      <DashboardMobileNav />
    </main>
  );
}
```

### Step 3: Clean Up Platform Layout

```typescript
// app/(platform)/layout.tsx

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserFromSession();

  if (!user) {
    redirect("/signin");
  }

  // Only allow admin role
  if (user.role !== "admin") {
    // Redirect to tenant dashboard (on their tenant subdomain)
    redirect("/dashboard/overview");
  }

  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
```

### Step 4: Update Admin Dashboard

```typescript
// app/(platform)/admin/dashboard/page.tsx

// Keep as superadmin dashboard
// Shows platform-wide stats:
// - Total schools
// - Total users
// - Revenue
// - System health
```

### Step 5: Update Redirects in proxy.ts

```typescript
// app/proxy.ts

// Redirect to login if accessing protected routes without session
if (!sessionToken) {
  if (pathname.startsWith("/admin")) {
    // Platform admin → platform login
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }
  
  if (pathname.startsWith("/dashboard")) {
    // Tenant dashboard → shared login
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }
}
```

---

## 🗂️ Final Structure (Option A)

```
app/
├── (www)/
│   └── page.tsx                # Landing page
│
├── (platform)/                 # Platform admin ONLY
│   ├── layout.tsx              # Auth: role="admin"
│   ├── (auth)/
│   │   ├── signin/             # /signin (platform admin)
│   │   └── signup/             # /signup (platform admin)
│   └── admin/
│       ├── dashboard/          # /admin/dashboard (superadmin)
│       ├── tenants/            # /admin/tenants (manage schools)
│       ├── users/              # /admin/users
│       ├── analytics/          # /admin/analytics
│       └── settings/           # /admin/settings
│
├── [jajal]/                    # Tenant pages
│   ├── layout.tsx              # Tenant theming
│   ├── page.tsx                # Tenant homepage (public)
│   │
│   ├── (public)/               # Public pages
│   │   ├── admissions/         # SPMB (public)
│   │   ├── contact/            # Contact (public)
│   │   ├── profile/            # School profile (public)
│   │   ├── facilities/         # Facilities (public)
│   │   └── staff/              # Staff directory (public)
│   │
│   └── (dashboard)/            # Protected dashboard
│       ├── layout.tsx          # Auth: user.tenantId matches
│       ├── overview/           # /dashboard/overview
│       ├── admissions/         # /dashboard/admissions (manage)
│       ├── messages/           # /dashboard/messages
│       ├── students/           # /dashboard/students
│       ├── school/             # /dashboard/school (edit info)
│       └── settings/           # /dashboard/settings
│
├── login/                      # Shared login
├── register/                   # Shared register
└── api/                        # API routes
```

---

## 🎯 URL Structure After Refactor

### Platform URLs (aksesekolah.id)
```
aksesekolah.id                  → Landing page
aksesekolah.id/signin           → Platform admin login
aksesekolah.id/admin/dashboard  → Superadmin dashboard
aksesekolah.id/admin/tenants    → Manage schools
aksesekolah.id/admin/users      → Manage users
```

### Tenant URLs (tenant.aksesekolah.id)
```
tenant.aksesekolah.id           → School homepage (public)
tenant.aksesekolah.id/admissions → SPMB (public)
tenant.aksesekolah.id/contact   → Contact (public)
tenant.aksesekolah.id/login     → Tenant login

tenant.aksesekolah.id/dashboard → Tenant dashboard (protected)
tenant.aksesekolah.id/dashboard/overview
tenant.aksesekolah.id/dashboard/admissions
tenant.aksesekolah.id/dashboard/messages
```

---

## ✅ Benefits of Option A

### 1. Clear Separation
```
Platform admin:  aksesekolah.id/admin/*
Tenant dashboard: tenant.aksesekolah.id/dashboard/*

No confusion!
```

### 2. Proper Auth
```
Platform: role="admin" check
Tenant: tenantId match check

No conflicts!
```

### 3. Tenant Branding
```
Dashboard inherits tenant theme
Logo, colors, branding applied
Professional look!
```

### 4. Scalable
```
Easy to add features per tenant
Easy to customize per school
Easy to maintain!
```

### 5. Aligns with Vision
```
Platform-centric architecture
Tenant-specific experience
Best of both worlds!
```

---

## 🚀 Migration Steps

### Phase 1: Backup
```bash
# Create backup branch
git checkout -b backup-before-dashboard-refactor
git push origin backup-before-dashboard-refactor
```

### Phase 2: Move Files
```bash
# Move dashboard to tenant
mv app/(platform)/dashboard app/[jajal]/(dashboard)

# Update imports in moved files
# (will need to update relative paths)
```

### Phase 3: Update Layouts
```bash
# Update auth logic in layouts
# Update redirects in proxy.ts
# Update navigation components
```

### Phase 4: Test
```bash
# Test platform admin access
# Test tenant dashboard access
# Test auth flows
# Test redirects
```

### Phase 5: Deploy
```bash
# Merge to main
# Deploy to production
```

---

## 📋 Checklist

### Before Refactor
- [ ] Backup current code
- [ ] Document current behavior
- [ ] List all affected files
- [ ] Plan migration steps

### During Refactor
- [ ] Move dashboard files
- [ ] Update layouts
- [ ] Update auth logic
- [ ] Update redirects
- [ ] Update imports
- [ ] Update components

### After Refactor
- [ ] Test platform admin
- [ ] Test tenant dashboard
- [ ] Test auth flows
- [ ] Test redirects
- [ ] Update documentation
- [ ] Deploy

---

## 🎯 Conclusion

**Current structure has confusion between platform admin and tenant dashboard.**

**Recommended: Move dashboard to [jajal]/(dashboard)**

**Benefits:**
- ✅ Clear separation
- ✅ Proper auth
- ✅ Tenant branding
- ✅ Scalable
- ✅ Maintainable

**This aligns perfectly with your platform-centric vision while giving tenants their own branded dashboard experience.**

---

**Status**: Analysis complete
**Recommendation**: Option A (Move to [jajal])
**Priority**: High (before MVP launch)
**Effort**: Medium (2-3 hours)
