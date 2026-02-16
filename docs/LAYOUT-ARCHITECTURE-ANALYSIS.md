# Layout Architecture Analysis & Recommendations

## 🔍 Current Structure Analysis

### Current Layout Hierarchy

```
app/
├── layout.tsx                    ← ROOT LAYOUT (Universal)
│   ├── Providers: Theme, Toast, School
│   ├── MobileBottomNav
│   └── Issues: ❌ Tenant-specific (SchoolProvider, MobileBottomNav)
│
├── www/
│   ├── layout.tsx                ← WWW Layout (Platform landing)
│   └── page.tsx                  → aksesekolah.id
│
├── (platform)/
│   ├── layout.tsx                ← Platform Layout (Dashboard)
│   │   └── Issues: ❌ No auth check, commented out
│   ├── (auth)/
│   │   ├── signin/
│   │   └── signup/
│   └── (dashboard)/
│       ├── admin/                → /admin/*
│       └── tenant/               → /tenant/*
│
└── [tenant]/
    ├── layout.tsx                ← Tenant Layout
    │   ├── Navigation
    │   ├── Footer
    │   ├── Tenant theming
    │   └── Issues: ⚠️ TypeScript errors
    └── page.tsx                  → tenant.aksesekolah.id
```

---

## ❌ Problems Identified

### 1. Root Layout (app/layout.tsx) - NOT Universal!

**Current Issues:**
```typescript
// ❌ Tenant-specific providers in root layout
<SchoolProvider initialConfig={schoolConfig}>
  <MobileBottomNav />  // ❌ Only for tenant pages!
</SchoolProvider>
```

**Problems:**
- `SchoolProvider` is tenant-specific, shouldn't be in root
- `MobileBottomNav` is tenant-specific, shouldn't be in root
- `getSchoolConfig()` is called for ALL routes (www, platform, tenant)
- Not truly universal - has tenant-specific logic

### 2. Platform Layout - No Auth Protection

```typescript
// ❌ Auth check commented out
// export const dynamic = 'force-dynamic';

// ❌ No actual auth check
// TODO: Implement proper auth check
```

**Problems:**
- No authentication enforcement
- Protected routes not protected
- Commented out code

### 3. Tenant Layout - TypeScript Errors

```typescript
// ❌ TypeScript errors
<Navigation tenant={tenant} />  // Error: Property 'tenant' does not exist
<Footer tenant={tenant} />      // Error: Property 'tenant' does not exist
```

**Problems:**
- Component props mismatch
- Type definitions need update

### 4. Inconsistent Structure

```
www/layout.tsx          → Minimal (good!)
(platform)/layout.tsx   → Minimal but broken (bad!)
[tenant]/layout.tsx     → Full featured but errors (needs fix!)
```

---

## ✅ Recommended Solution

### Architecture Principle

```
Root Layout (app/layout.tsx)
└─ TRULY UNIVERSAL
   ├─ Only global providers (Theme, Toast)
   ├─ No domain-specific logic
   └─ Minimal, clean, universal

Nested Layouts
├─ www/layout.tsx           → Platform landing specific
├─ (platform)/layout.tsx    → Dashboard specific (auth, no nav)
└─ [tenant]/layout.tsx      → Tenant specific (nav, footer, theming)
```

---

## 🎯 Proposed Structure

### 1. Root Layout (Universal)

```typescript
// app/layout.tsx
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import { GeistSans } from "geist/font/sans";
import { Manrope } from "next/font/google";
import "@/app/globals.css";

const geist = GeistSans;
const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata = {
  title: "AkseSekolah.id",
  description: "Platform Manajemen Sekolah Indonesia",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${geist.variable} ${manrope.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**Benefits:**
- ✅ Truly universal
- ✅ No domain-specific logic
- ✅ Clean and minimal
- ✅ Works for www, platform, tenant

---

### 2. WWW Layout (Platform Landing)

```typescript
// app/www/layout.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AkseSekolah.id - Platform Manajemen Sekolah",
  description: "Platform modern untuk manajemen sekolah",
};

export default function WWWLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* Optional: Add platform-specific header/footer */}
      {children}
    </div>
  );
}
```

**Benefits:**
- ✅ Platform landing specific
- ✅ Can add platform nav/footer if needed
- ✅ Clean separation

---

### 3. Platform Layout (Dashboard)

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
  // Check authentication for all platform routes
  const user = await getUserFromSession();

  // Allow auth routes (signin/signup) to pass through
  // They are in (auth) route group and will handle their own logic
  
  // For protected routes, auth check is in nested layouts:
  // - admin/layout.tsx checks role="admin"
  // - tenant/layout.tsx checks tenantId

  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
```

**Benefits:**
- ✅ Dashboard specific
- ✅ No navigation (dashboard has its own)
- ✅ Clean background
- ✅ Auth handled in nested layouts

---

### 4. Tenant Layout (School Sites)

```typescript
// app/[tenant]/layout.tsx
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { getTenantContext, getTenantTheme } from "@/lib/tenant/get-tenant-context";
import { SchoolProvider } from "@/app/providers/SchoolProvider";
import { MobileBottomNav } from "@/components/site/mobile-nav";
import { getSchoolConfig } from "@/lib/school/getSchoolConfig";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenantContext();
  
  return {
    title: tenant?.name || "Sekolah",
    description: `Website resmi ${tenant?.name || "sekolah"}`,
    icons: {
      icon: tenant?.favicon || "/favicon.ico",
    },
  };
}

export default async function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tenant = await getTenantContext();
  const theme = await getTenantTheme();
  const schoolConfig = await getSchoolConfig();

  // Redirect if no tenant in production
  if (!tenant && process.env.NODE_ENV === "production") {
    redirect("/");
  }

  return (
    <div
      style={{
        ["--primary" as string]: theme.primaryColor,
        ["--secondary" as string]: theme.secondaryColor,
      }}
    >
      <SchoolProvider initialConfig={schoolConfig}>
        <Navigation />
        <main className="min-h-screen pb-16 md:pb-0">
          {children}
        </main>
        <Footer />
        <MobileBottomNav />
      </SchoolProvider>
    </div>
  );
}
```

**Benefits:**
- ✅ Tenant-specific providers (SchoolProvider)
- ✅ Tenant-specific UI (Navigation, Footer, MobileNav)
- ✅ Tenant theming
- ✅ All tenant logic in one place

---

## 📊 Comparison

### Before (Current)

```
Root Layout:
  ❌ Has tenant-specific logic (SchoolProvider)
  ❌ Has tenant-specific UI (MobileBottomNav)
  ❌ Calls getSchoolConfig() for all routes
  ❌ Not truly universal

Platform Layout:
  ❌ No auth check
  ❌ Commented out code
  ❌ Not protecting routes

Tenant Layout:
  ❌ TypeScript errors
  ❌ Missing providers (moved to root)
```

### After (Proposed)

```
Root Layout:
  ✅ Truly universal
  ✅ Only global providers (Theme, Toast)
  ✅ No domain-specific logic
  ✅ Clean and minimal

Platform Layout:
  ✅ Dashboard specific
  ✅ Auth check enabled
  ✅ Clean structure
  ✅ No navigation (dashboard has its own)

Tenant Layout:
  ✅ All tenant logic in one place
  ✅ Tenant providers (SchoolProvider)
  ✅ Tenant UI (Nav, Footer, MobileNav)
  ✅ Tenant theming
  ✅ No TypeScript errors
```

---

## 🔄 Migration Steps

### Step 1: Update Root Layout

```typescript
// app/layout.tsx
// Remove:
// - SchoolProvider
// - MobileBottomNav
// - getSchoolConfig()

// Keep only:
// - ThemeProvider
// - ToastProvider
// - Font setup
```

### Step 2: Update Tenant Layout

```typescript
// app/[tenant]/layout.tsx
// Add back:
// - SchoolProvider
// - MobileBottomNav
// - getSchoolConfig()

// Fix:
// - Remove tenant prop from Navigation
// - Remove tenant prop from Footer
// - They should get tenant from context
```

### Step 3: Update Platform Layout

```typescript
// app/(platform)/layout.tsx
// Enable:
// - export const dynamic = 'force-dynamic'

// Keep minimal:
// - No navigation
// - No footer
// - Just background wrapper
```

### Step 4: Fix Component Props

```typescript
// components/navigation.tsx
// Remove tenant prop, use context instead
export function Navigation() {
  const { tenant } = useSchool(); // Get from context
  // ...
}

// components/footer.tsx
// Remove tenant prop, use context instead
export function Footer() {
  const { tenant } = useSchool(); // Get from context
  // ...
}
```

---

## 🎯 Benefits of Proposed Structure

### 1. Separation of Concerns ✅
```
Root Layout    → Universal (Theme, Toast)
WWW Layout     → Platform landing
Platform Layout → Dashboard (no nav/footer)
Tenant Layout  → School sites (nav/footer/theming)
```

### 2. Performance ✅
```
Root Layout:
  - No unnecessary getSchoolConfig() calls
  - No tenant resolution for platform routes
  - Faster for www and platform routes
```

### 3. Maintainability ✅
```
Clear boundaries:
  - Tenant logic → Tenant layout
  - Platform logic → Platform layout
  - Universal logic → Root layout
```

### 4. Type Safety ✅
```
No prop drilling:
  - Components get data from context
  - No TypeScript errors
  - Better DX
```

### 5. Scalability ✅
```
Easy to add:
  - New platform features
  - New tenant features
  - New route groups
```

---

## 📝 Implementation Checklist

- [ ] Update `app/layout.tsx` (remove tenant-specific logic)
- [ ] Update `app/[tenant]/layout.tsx` (add tenant-specific logic)
- [ ] Update `app/(platform)/layout.tsx` (enable auth check)
- [ ] Update `components/navigation.tsx` (remove tenant prop)
- [ ] Update `components/footer.tsx` (remove tenant prop)
- [ ] Test www routes
- [ ] Test platform routes
- [ ] Test tenant routes
- [ ] Fix TypeScript errors
- [ ] Update documentation

---

## 🚀 Expected Result

### Clean Architecture

```
app/
├── layout.tsx                    ✅ Universal (Theme, Toast)
│
├── www/
│   └── layout.tsx                ✅ Platform landing
│
├── (platform)/
│   └── layout.tsx                ✅ Dashboard (auth, no nav)
│
└── [tenant]/
    └── layout.tsx                ✅ Tenant (nav, footer, theming)
```

### Clear Responsibilities

```
Root Layout:
  - Font setup
  - Theme provider
  - Toast provider
  - HTML/Body wrapper

WWW Layout:
  - Platform metadata
  - Platform-specific wrapper

Platform Layout:
  - Auth check (in nested layouts)
  - Dashboard background
  - No navigation

Tenant Layout:
  - Tenant metadata
  - Tenant theming
  - Tenant providers
  - Navigation & Footer
  - Mobile nav
```

---

## ✅ Summary

**Current Issues:**
1. ❌ Root layout has tenant-specific logic
2. ❌ Platform layout has no auth check
3. ❌ Tenant layout has TypeScript errors
4. ❌ Inconsistent structure

**Proposed Solution:**
1. ✅ Root layout truly universal
2. ✅ Platform layout with auth
3. ✅ Tenant layout with all tenant logic
4. ✅ Clean separation of concerns

**Benefits:**
- Better performance
- Better maintainability
- Better type safety
- Better scalability
- Cleaner code

**Recommendation:** Implement the proposed structure for a more maintainable and intuitive app architecture.

