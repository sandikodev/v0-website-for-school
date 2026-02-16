# Tenant Status Management

## Overview

Admin dapat mengatur status tenant untuk mengontrol akses ke site tenant. Sistem ini memberikan UX yang optimal dengan error pages yang informatif.

## Tenant Status

### 1. Active ✅
- **Warna**: Green
- **Icon**: CheckCircle2
- **Behavior**: Site berjalan normal, semua fitur tersedia
- **Use case**: Tenant yang aktif dan membayar

### 2. Inactive ⏸️
- **Warna**: Gray
- **Icon**: Pause
- **Behavior**: Site tidak dapat diakses, tampilkan halaman "Site Inactive"
- **Use case**: Tenant yang belum setup atau temporary disabled

### 3. Suspended ⚠️
- **Warna**: Yellow
- **Icon**: Ban
- **Behavior**: Site tidak dapat diakses, tampilkan halaman "Site Suspended" dengan reason
- **Use case**: Payment overdue, temporary violation

### 4. Banned 🚫
- **Warna**: Red
- **Icon**: XCircle
- **Behavior**: Site tidak dapat diakses, tampilkan halaman "Site Banned" dengan reason
- **Use case**: Terms violation, fraud, permanent ban

## Admin UI

### Location
`/dashboard/admin/tenants`

### Features
1. **Status Dropdown**: Click status badge untuk change status
2. **Reason Dialog**: Untuk suspended/banned, admin harus provide reason
3. **Real-time Update**: Status langsung update setelah confirm
4. **Cache Invalidation**: Tenant cache otomatis di-clear setelah update

### Usage
```typescript
<StatusCell 
  tenantId={tenant.id}
  currentStatus={tenant.status}
  statusReason={tenant.statusReason}
/>
```

## Error Pages

### 1. Suspended Page
**Path**: `/[tenant]/suspended`
- Yellow gradient background
- Ban icon
- Display reason dari admin
- Contact support button

### 2. Banned Page
**Path**: `/[tenant]/banned`
- Red gradient background
- XCircle icon
- Display reason dari admin
- Contact support button

### 3. Inactive Page
**Path**: `/[tenant]/inactive`
- Gray gradient background
- Pause icon
- Simple message
- Back to home button

## Proxy Logic

### Flow
1. Tenant request masuk ke proxy
2. Resolve tenant dari cache/DB (include status)
3. Check tenant status:
   - `active` → proceed normal
   - `inactive` → rewrite ke `/[tenant]/inactive`
   - `suspended` → rewrite ke `/[tenant]/suspended`
   - `banned` → rewrite ke `/[tenant]/banned`
4. Add status headers untuk error pages

### Headers
```typescript
x-tenant-status: "active" | "inactive" | "suspended" | "banned"
x-tenant-status-reason: string (optional)
x-tenant-name: string
```

## API Endpoint

### Update Tenant Status
**POST** `/api/admin/tenants/[id]/status`

**Auth**: Admin only

**Body**:
```json
{
  "status": "active" | "inactive" | "suspended" | "banned",
  "reason": "Optional reason for suspended/banned"
}
```

**Response**:
```json
{
  "success": true,
  "tenant": {
    "id": "...",
    "status": "suspended",
    "statusReason": "Payment overdue"
  }
}
```

## Database Schema

```prisma
model Tenant {
  // ... other fields
  
  status        String   @default("active")
  statusReason  String?
  isActive      Boolean  @default(true) // Legacy
}
```

## Development Mode

Di development, tenant resolver skip domain verification:
- Tidak perlu `domainVerified: true`
- Tidak perlu `domainStatus: "active"`
- Hanya check `isActive: true` dan `status`

## Testing

### 1. Test Status Change
```bash
# Login as admin
# Go to /dashboard/admin/tenants
# Click status dropdown
# Select "Suspended"
# Enter reason: "Testing suspension"
# Confirm
```

### 2. Test Error Pages
```bash
# Visit tenant site after status change
http://smpn1srandakan.aksesekolah.local:3000

# Should show suspended page with reason
```

### 3. Test Cache Invalidation
```bash
# Change status back to "Active"
# Refresh tenant site
# Should show normal homepage
```

## UX Considerations

1. **Clear Communication**: Error pages explain why site is unavailable
2. **Contact Support**: All error pages have support contact
3. **Professional Design**: Gradient backgrounds, proper icons, clean layout
4. **Reason Display**: Admin reason shown to users (for transparency)
5. **No Redirect Loop**: Status pages themselves are excluded from status check

## Future Enhancements

1. **Email Notification**: Notify tenant owner when status changes
2. **Auto-suspension**: Suspend tenant after X days of payment overdue
3. **Status History**: Log all status changes with timestamp and admin
4. **Bulk Actions**: Change status for multiple tenants at once
5. **Scheduled Status**: Schedule status change (e.g., suspend on specific date)
