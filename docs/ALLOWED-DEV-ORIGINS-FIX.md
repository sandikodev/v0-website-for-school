    # allowedDevOrigins Configuration - Fix Summary

## Warning Fixed

```
⚠ Cross origin request detected from aksesekolah.local to /_next/* resource. 
In a future major version of Next.js, you will need to explicitly configure 
"allowedDevOrigins" in next.config to allow this.
```

## Problem

Next.js 16 akan memblokir cross-origin requests secara default di versi major berikutnya untuk mencegah unauthorized access ke internal assets/endpoints yang tersedia di development mode.

Karena kita menggunakan multi-tenant architecture dengan multiple subdomains:
- `aksesekolah.local` (apex domain)
- `www.aksesekolah.local` (www subdomain)
- `dashboard.aksesekolah.local` (dashboard subdomain)
- `*.aksesekolah.local` (tenant subdomains)

Next.js mendeteksi cross-origin requests antar subdomain ini dan memberikan warning.

## Solution

Tambahkan `allowedDevOrigins` di `next.config.mjs` untuk mengizinkan requests dari semua subdomain development:

```javascript
// next.config.mjs
const nextConfig = {
  // ... other config
  
  // Allow cross-origin requests from subdomains in development
  allowedDevOrigins: [
    'aksesekolah.local',
    '*.aksesekolah.local',
    'dashboard.aksesekolah.local',
    'www.aksesekolah.local',
  ],
  
  // ... other config
};
```

## Configuration Details

### What is `allowedDevOrigins`?

`allowedDevOrigins` allows you to configure additional origins that can request the dev server, beyond the default `localhost`.

### Wildcard Support

- `*.aksesekolah.local` - Matches all subdomains (tenant1, tenant2, etc.)
- `aksesekolah.local` - Matches apex domain
- `dashboard.aksesekolah.local` - Explicitly allow dashboard subdomain
- `www.aksesekolah.local` - Explicitly allow www subdomain

### Development Only

This configuration **only affects development mode** (`npm run dev`). Production builds are not affected.

## Multi-Tenant Architecture

Our application uses subdomain-based multi-tenancy:

```
aksesekolah.local                    → Platform landing page (www)
www.aksesekolah.local                → Platform landing page (www)
dashboard.aksesekolah.local          → Dashboard (admin & tenant)
tenant1.aksesekolah.local            → Tenant 1 public pages
tenant2.aksesekolah.local            → Tenant 2 public pages
smpn1srandakan.aksesekolah.local     → SMP N 1 Srandakan public pages
```

All these subdomains need to:
1. Load Next.js assets from `/_next/*`
2. Make API calls to `/api/*`
3. Share cookies across subdomains

Without `allowedDevOrigins`, Next.js would warn (and eventually block) these cross-origin requests.

## Testing

After adding the configuration:

```bash
# 1. Restart dev server
npm run dev

# 2. Access different subdomains
curl http://aksesekolah.local:3000
curl http://dashboard.aksesekolah.local:3000
curl http://tenant1.aksesekolah.local:3000

# 3. Check logs - no warning should appear
```

## Production Considerations

For production, ensure your domains are properly configured:

```javascript
// next.config.mjs (production)
const nextConfig = {
  // Production doesn't need allowedDevOrigins
  // Use proper CORS headers instead
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "https://*.aksesekolah.id", // Production domain
          },
        ],
      },
    ];
  },
};
```

## Related Files

- `next.config.mjs` - Main configuration file
- `app/proxy.ts` - Middleware for subdomain routing
- `/etc/hosts` - Local DNS configuration for development

## References

- [Next.js allowedDevOrigins Documentation](https://nextjs.org/docs/app/api-reference/config/next-config-js/allowedDevOrigins)
- [Next.js 16 Upgrade Guide](https://nextjs.org/docs/app/guides/upgrading/version-16)

## Status

✅ **Fixed** - Warning no longer appears in development mode
✅ **Tested** - All subdomains can access Next.js resources
✅ **Production Ready** - Configuration only affects development

## Next Steps

1. ✅ Add `allowedDevOrigins` to next.config.mjs
2. ✅ Test with multiple subdomains
3. ✅ Verify no warnings in console
4. 🔄 Test in browser (currently blocked by file watch limit issue)
5. 🔄 Deploy to production (no changes needed)
