# Environment Variables - Simple Explanation

## Yang Kita BUTUH (Simple!)

### Development

```yaml
environment:
  - NODE_ENV=development
  - PORT=3001
  - DATABASE_URL=postgresql://...
  - NEXT_PUBLIC_PLATFORM_DOMAIN=aksesekolah.local
```

### Production

```yaml
environment:
  - NODE_ENV=production
  - PORT=3000
  - DATABASE_URL=libsql://...
  - JWT_SECRET=your-secret
  - NEXT_PUBLIC_PLATFORM_DOMAIN=aksesekolah.id
```

## Penjelasan Masing-Masing

### 1. `NODE_ENV`
**Untuk apa:** Next.js tahu ini development atau production
**Nilai:** `development` atau `production`
**Digunakan di:** Next.js internal

### 2. `PORT`
**Untuk apa:** Port yang digunakan Next.js server
**Nilai:** 
- Development: `3001`
- Production: `3000`
**Digunakan di:** Next.js server startup

### 3. `DATABASE_URL`
**Untuk apa:** Connection string ke database
**Nilai:**
- Development: PostgreSQL local
- Production: Turso LibSQL
**Digunakan di:** Prisma client

### 4. `JWT_SECRET`
**Untuk apa:** Secret key untuk sign JWT token
**Nilai:** Random string (generate dengan `openssl rand -base64 32`)
**Digunakan di:** `lib/jwt.ts`
```typescript
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret"
);
```

### 5. `NEXT_PUBLIC_PLATFORM_DOMAIN`
**Untuk apa:** Domain platform untuk multi-tenant routing
**Nilai:**
- Development: `aksesekolah.local`
- Production: `aksesekolah.id`
**Digunakan di:** `app/proxy.ts`
```typescript
const platformDomain = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || "aksesekolah.id";

// Untuk detect:
// - aksesekolah.id → Platform landing
// - dashboard.aksesekolah.id → Dashboard
// - tenant1.aksesekolah.id → Tenant website
```

## Yang TIDAK Kita Pakai

### ❌ `NEXTAUTH_URL`
**Kenapa tidak:** Kita pakai JWT custom, bukan NextAuth.js

### ❌ `NEXTAUTH_SECRET`
**Kenapa tidak:** Kita pakai JWT custom, bukan NextAuth.js

### ❌ `NEXT_PUBLIC_APP_URL`
**Kenapa tidak:** Kita pakai relative URL, tidak perlu base URL

## Perbedaan `NEXT_PUBLIC_*` vs Biasa

### `NEXT_PUBLIC_*` (Exposed ke Client)
```typescript
// Bisa diakses di client component
const domain = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN;
```

### Tanpa `NEXT_PUBLIC_` (Server Only)
```typescript
// Hanya bisa diakses di server
const secret = process.env.JWT_SECRET;
```

**Rule:** Jika perlu di client-side code → pakai `NEXT_PUBLIC_*`

## Contoh Penggunaan

### Di Server Component
```typescript
// app/page.tsx (server component)
export default function Page() {
  const domain = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN;
  const secret = process.env.JWT_SECRET; // ✅ OK
  
  return <div>{domain}</div>;
}
```

### Di Client Component
```typescript
"use client";

export default function ClientPage() {
  const domain = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN; // ✅ OK
  const secret = process.env.JWT_SECRET; // ❌ undefined!
  
  return <div>{domain}</div>;
}
```

### Di Middleware
```typescript
// middleware.ts
export function middleware(request) {
  const domain = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN; // ✅ OK
  const secret = process.env.JWT_SECRET; // ✅ OK
}
```

## Summary

**Yang Penting:**
1. `PORT` - Port server
2. `DATABASE_URL` - Database connection
3. `JWT_SECRET` - JWT signing (production only)
4. `NEXT_PUBLIC_PLATFORM_DOMAIN` - Multi-tenant routing

**Yang Tidak Perlu:**
- `NEXTAUTH_*` - Kita tidak pakai NextAuth
- `NEXT_PUBLIC_APP_URL` - Kita pakai relative URL

**Keep it simple!** 🎯
