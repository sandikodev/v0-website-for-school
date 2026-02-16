# Fix: Tenant Subdomain Routing

## 🐛 Problem

Ketika mengakses tenant subdomain seperti `http://smpn1srandakan.aksesekolah.local:3000`, request di-redirect ke `http://dashboard.aksesekolah.local:3000` alih-alih menampilkan halaman tenant.

## 🔍 Root Cause

1. **File `proxy.ts` tidak digunakan** - Next.js mencari file `middleware.ts` di root project, bukan `proxy.ts`
2. **Tanpa middleware**, semua request masuk ke `app/(platform)/page.tsx` yang melakukan redirect berdasarkan user role
3. **Tenant routing tidak berfungsi** karena middleware tidak aktif

## ✅ Solution

### 1. Rename `proxy.ts` → `middleware.ts`

```bash
mv proxy.ts middleware.ts
```

Next.js secara otomatis akan menjalankan file `middleware.ts` di root project.

### 2. Update Middleware Logic

Tambahkan rewrite ke route `[tenant]` ketika tenant subdomain terdeteksi:

```typescript
// Before: hanya set headers
if (tenant) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-tenant-id", tenant.id);
  // ...
  return NextResponse.next({ request: { headers: requestHeaders } });
}

// After: rewrite ke [tenant] route
if (tenant) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-tenant-id", tenant.id);
  // ...
  
  // Rewrite to [tenant] route
  const url = request.nextUrl.clone();
  url.pathname = `/${tenant.slug}${pathname}`;
  
  return NextResponse.rewrite(url, {
    request: { headers: requestHeaders },
  });
}
```

## 🎯 How It Works

### Routing Flow

```
1. User visits: http://smpn1srandakan.aksesekolah.local:3000
   ↓
2. Middleware detects tenant subdomain
   ↓
3. Resolve tenant from database (slug: "smpn1srandakan")
   ↓
4. Rewrite URL: / → /smpn1srandakan/
   ↓
5. Next.js routes to: app/[tenant]/page.tsx
   ↓
6. Tenant home page rendered with tenant context
```

### Domain Mapping

| Domain | Route | Description |
|--------|-------|-------------|
| `dashboard.aksesekolah.local:3000` | `app/(platform)/dashboard/` | Admin & tenant user dashboard |
| `aksesekolah.local:3000` | `app/www/` | Platform landing page |
| `smpn1srandakan.aksesekolah.local:3000` | `app/[tenant]/` | Tenant (school) website |

## 🧪 Testing

### 1. Restart Development Server

```bash
# Stop server (Ctrl+C)
rm -rf .next
npm run dev
```

### 2. Test Tenant Subdomain

```bash
# Should show tenant home page (NOT redirect to dashboard)
curl -I http://smpn1srandakan.aksesekolah.local:3000
```

Expected: Status 200, renders tenant home page

### 3. Test Dashboard Subdomain

```bash
# Should redirect to /signin (if not logged in)
curl -I http://dashboard.aksesekolah.local:3000
```

Expected: Status 307, redirects to `/signin`

### 4. Test Platform Domain

```bash
# Should show platform landing page
curl -I http://aksesekolah.local:3000
```

Expected: Status 200, renders platform landing page

## 📝 Files Changed

- `proxy.ts` → `middleware.ts` (renamed)
- `middleware.ts` (updated tenant routing logic)

## 🔗 Related Documentation

- [Multi-Tenant Architecture](./MULTI-TENANT-ARCHITECTURE.md)
- [Dashboard Routing Flow](./DASHBOARD-ROUTING-FLOW.md)
- [Admin Tenants Domain Feature](./ADMIN-TENANTS-DOMAIN-FEATURE.md)

## ✨ Result

✅ Tenant subdomain sekarang berfungsi dengan benar
✅ `smpn1srandakan.aksesekolah.local:3000` menampilkan halaman tenant
✅ Middleware aktif dan melakukan rewrite ke route `[tenant]`
✅ Tenant context tersedia via headers (`x-tenant-id`, `x-tenant-slug`)
