# Admin Tenants - Domain Display Feature

## Overview

Halaman `/admin/tenants` sekarang menampilkan domain tenant dengan fitur:
- ✅ Domain otomatis menyesuaikan environment (dev/prod)
- ✅ Input disabled untuk menampilkan URL lengkap
- ✅ Tombol Copy untuk copy URL ke clipboard
- ✅ Tombol New Tab untuk membuka tenant di tab baru
- ✅ Layout minimal dan clean

## Features

### 1. Environment-Aware Domain

Domain akan otomatis menyesuaikan dengan environment:

**Development:**
```
http://smpn1srandakan.aksesekolah.local:3000
```

**Production:**
```
https://smpn1srandakan.aksesekolah.id
```

**Custom Domain (if set):**
```
Development: http://smpsransa.sch.id:3000
Production: https://smpsransa.sch.id
```

### 2. Domain Display Component

**Component:** `DomainCell`
- Input field (read-only) dengan URL lengkap
- Copy button dengan feedback visual (checkmark)
- New tab button untuk membuka URL

**Layout:**
```
┌─────────────────────────────────────────┬───┬───┐
│ http://tenant.aksesekolah.local:3000    │ 📋│ 🔗│
└─────────────────────────────────────────┴───┴───┘
```

### 3. User Experience

**Copy Button:**
- Click → Copy URL to clipboard
- Shows checkmark for 2 seconds
- Returns to copy icon

**New Tab Button:**
- Click → Opens tenant URL in new tab
- Uses `noopener,noreferrer` for security

## Implementation

### Files Created/Modified

1. **`app/(platform)/dashboard/admin/tenants/page.tsx`**
   - Added `getTenantUrl()` helper function
   - Integrated `DomainCell` component
   - Environment-aware URL generation

2. **`app/(platform)/dashboard/admin/tenants/domain-cell.tsx`** (NEW)
   - Client component for interactive buttons
   - Copy to clipboard functionality
   - Open in new tab functionality
   - Visual feedback for copy action

### Code Structure

```typescript
// Server Component (page.tsx)
function getTenantUrl(slug: string, customDomain?: string | null): string {
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (customDomain) {
    return isProduction 
      ? `https://${customDomain}` 
      : `http://${customDomain}:3000`;
  }
  
  const baseDomain = isProduction ? 'aksesekolah.id' : 'aksesekolah.local';
  const port = isProduction ? '' : ':3000';
  const protocol = isProduction ? 'https' : 'http';
  
  return `${protocol}://${slug}.${baseDomain}${port}`;
}

// Client Component (domain-cell.tsx)
export function DomainCell({ url }: DomainCellProps) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleOpenNewTab = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  
  return (
    <div className="flex items-center gap-2 max-w-md">
      <Input value={url} readOnly className="text-sm h-8 bg-muted" />
      <Button onClick={handleCopy}>
        {copied ? <Check /> : <Copy />}
      </Button>
      <Button onClick={handleOpenNewTab}>
        <ExternalLink />
      </Button>
    </div>
  );
}
```

## Usage

### Access Page
```
Development: http://dashboard.aksesekolah.local:3000/admin/tenants
Production: https://dashboard.aksesekolah.id/admin/tenants
```

### Test Scenarios

**Scenario 1: View Tenant Domain**
1. Login as platform admin
2. Navigate to `/admin/tenants`
3. See tenant list with domains
4. Domain shows correct environment URL

**Scenario 2: Copy Domain**
1. Click copy button (📋)
2. Button shows checkmark (✓)
3. URL copied to clipboard
4. Paste to verify

**Scenario 3: Open in New Tab**
1. Click new tab button (🔗)
2. Tenant site opens in new tab
3. Original tab stays on admin page

## Environment Variables

The feature uses these environment variables:

```bash
# Development
NODE_ENV=development

# Production
NODE_ENV=production
```

No additional configuration needed!

## Benefits

1. **Clear URL Display**: Full URL visible in input field
2. **Quick Access**: One-click to open tenant site
3. **Easy Sharing**: Copy URL for sharing with others
4. **Environment Safe**: Automatically uses correct domain
5. **Minimal Layout**: Clean and professional appearance

## Future Enhancements

Possible improvements:
- [ ] QR code generation for mobile access
- [ ] Domain status indicator (active/inactive)
- [ ] SSL certificate status
- [ ] Custom domain verification status
- [ ] Analytics link (visits, users, etc.)

## Screenshots

### Development Mode
```
┌──────────────────────────────────────────────────────────────┐
│ Name                  Domain                          Actions │
├──────────────────────────────────────────────────────────────┤
│ SMP N 1 Srandakan    ┌────────────────────────────┬──┬──┐    │
│ smpn1srandakan       │ http://smpn1srandakan...   │📋│🔗│    │
│                      └────────────────────────────┴──┴──┘    │
└──────────────────────────────────────────────────────────────┘
```

### Production Mode
```
┌──────────────────────────────────────────────────────────────┐
│ Name                  Domain                          Actions │
├──────────────────────────────────────────────────────────────┤
│ SMP N 1 Srandakan    ┌────────────────────────────┬──┬──┐    │
│ smpn1srandakan       │ https://smpn1srandakan...  │📋│🔗│    │
│                      └────────────────────────────┴──┴──┘    │
└──────────────────────────────────────────────────────────────┘
```

## Summary

✅ Domain display mengikuti environment (dev/prod)
✅ Input disabled dengan URL lengkap
✅ Tombol Copy dengan visual feedback
✅ Tombol New Tab untuk quick access
✅ Layout minimal dan professional
✅ No additional configuration needed
