# Fix: Tenant URL Environment Detection

## Problem

Tenant URL di `/admin/tenants` masih menampilkan `.id` (production) padahal sedang development:
```
❌ http://smpn1srandakan.aksesekolah.id:3000
✅ http://smpn1srandakan.aksesekolah.local:3000
```

## Root Cause

Environment variable `NEXT_PUBLIC_PLATFORM_DOMAIN` tidak terbaca dengan benar atau ada cache dari build sebelumnya.

## Solution

### 1. Updated getTenantUrl Function

**File:** `app/(platform)/dashboard/admin/tenants/page.tsx`

```typescript
function getTenantUrl(slug: string, customDomain?: string | null): string {
  // Determine environment
  // Priority: NEXT_PUBLIC_PLATFORM_DOMAIN > NODE_ENV
  const platformDomain = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN;
  const nodeEnv = process.env.NODE_ENV;
  
  // Determine if production
  const isProduction = nodeEnv === 'production' || (!platformDomain && nodeEnv !== 'development');
  
  // Use correct base domain
  const baseDomain = platformDomain || (isProduction ? 'aksesekolah.id' : 'aksesekolah.local');
  
  // Build URL...
}
```

### 2. Verify Environment Variables

Check `.env.development`:
```bash
cat .env.development | grep NEXT_PUBLIC_PLATFORM_DOMAIN
```

Should show:
```
NEXT_PUBLIC_PLATFORM_DOMAIN=aksesekolah.local
```

### 3. Clear Cache and Restart

**Important:** You MUST restart the dev server for environment variables to take effect!

```bash
# Stop dev server (Ctrl+C)

# Clear Next.js cache
rm -rf .next

# Restart dev server
npm run dev
```

### 4. Verify in Browser

After restart:
1. Go to: `http://dashboard.aksesekolah.local:3000/admin/tenants`
2. Check domain column
3. Should show: `http://smpn1srandakan.aksesekolah.local:3000`

## Environment Detection Logic

### Development
```
NODE_ENV=development
NEXT_PUBLIC_PLATFORM_DOMAIN=aksesekolah.local

Result: http://slug.aksesekolah.local:3000
```

### Production
```
NODE_ENV=production
NEXT_PUBLIC_PLATFORM_DOMAIN=aksesekolah.id (or not set)

Result: https://slug.aksesekolah.id
```

## Priority Order

1. **NEXT_PUBLIC_PLATFORM_DOMAIN** (if set)
   - Use this value directly
   
2. **NODE_ENV** (fallback)
   - `development` → `aksesekolah.local`
   - `production` → `aksesekolah.id`

## Testing

### Test Development URL
```bash
# In development
echo $NODE_ENV
# Should output: development

# Check env file
cat .env.development
# Should have: NEXT_PUBLIC_PLATFORM_DOMAIN=aksesekolah.local
```

### Test in Browser Console
```javascript
// Open browser console on admin page
console.log(process.env.NODE_ENV);
// Should show: "development"
```

## Common Issues

### Issue 1: Still showing .id domain

**Cause:** Dev server not restarted after code change

**Solution:**
```bash
# Stop server (Ctrl+C)
rm -rf .next
npm run dev
```

### Issue 2: Environment variable not found

**Cause:** `.env.development` file missing or incorrect

**Solution:**
```bash
# Check file exists
ls -la .env.development

# Verify content
cat .env.development | grep PLATFORM_DOMAIN

# If missing, add it:
echo "NEXT_PUBLIC_PLATFORM_DOMAIN=aksesekolah.local" >> .env.development
```

### Issue 3: Cache issue

**Cause:** Browser or Next.js cache

**Solution:**
```bash
# Clear Next.js cache
rm -rf .next

# Clear browser cache
# Chrome: Ctrl+Shift+Delete
# Or hard refresh: Ctrl+Shift+R
```

## Verification Checklist

- [ ] `.env.development` has `NEXT_PUBLIC_PLATFORM_DOMAIN=aksesekolah.local`
- [ ] Dev server restarted after code change
- [ ] `.next` cache cleared
- [ ] Browser hard refresh (Ctrl+Shift+R)
- [ ] URL shows `.local` not `.id`

## Summary

✅ Updated `getTenantUrl` function with better environment detection
✅ Priority: NEXT_PUBLIC_PLATFORM_DOMAIN > NODE_ENV
✅ Fallback to correct domain based on NODE_ENV
⚠️ **MUST restart dev server** for changes to take effect
⚠️ **MUST clear .next cache** if still showing wrong domain

## Next Steps

1. Stop dev server
2. Run: `rm -rf .next`
3. Start dev server: `npm run dev`
4. Refresh browser: `http://dashboard.aksesekolah.local:3000/admin/tenants`
5. Verify URL shows `.local` domain
