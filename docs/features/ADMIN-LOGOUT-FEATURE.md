# Admin Dashboard - Logout Feature

## Overview

Admin dashboard sekarang memiliki tombol logout yang sama dengan tenant dashboard, menggunakan ProfileDropdown component.

## Implementation

### Changes Made

**File Modified:** `app/(platform)/dashboard/admin/layout.tsx`

1. **Import ProfileDropdown**
```typescript
import { ProfileDropdown } from "@/components/dashboard/profile-dropdown";
```

2. **Add ProfileDropdown to Header**
```typescript
<div className="mb-6 flex items-start justify-between">
  <div>
    <h1>Platform Admin</h1>
    <p>Manage schools, users, and platform settings</p>
  </div>
  <ProfileDropdown user={user} />
</div>
```

## Features

### ProfileDropdown Component

**Location:** Top-right corner of admin dashboard

**Features:**
- ✅ User avatar with initials
- ✅ Username display
- ✅ Email display
- ✅ "Lihat Situs" link (view site)
- ✅ "Pengaturan" link (settings)
- ✅ "Keluar" button (logout)

### Dropdown Menu Items

1. **User Info**
   - Avatar with initials
   - Username
   - Email address

2. **Lihat Situs** (View Site)
   - Opens main site in new tab
   - Icon: ExternalLink

3. **Pengaturan** (Settings)
   - Navigate to settings page
   - Icon: Settings

4. **Keluar** (Logout)
   - Logout with loading state
   - Redirects to signin page
   - Icon: LogOut
   - Destructive variant (red)

## Usage

### Access
```
URL: http://dashboard.aksesekolah.local:3000/admin
```

### Logout Flow
1. Click profile dropdown (top-right)
2. Click "Keluar"
3. Loading state shows "Keluar..."
4. API call to `/api/auth/logout`
5. Success toast: "Berhasil keluar"
6. Redirect to `/signin`

### Visual Layout

```
┌────────────────────────────────────────────────────┐
│ Platform Admin                          [👤 admin] │
│ Manage schools, users, and platform settings       │
├────────────────────────────────────────────────────┤
│ Overview | Schools | Users | Settings              │
├────────────────────────────────────────────────────┤
│                                                     │
│ [Content]                                          │
│                                                     │
└────────────────────────────────────────────────────┘
```

### Dropdown Menu

```
┌─────────────────────────┐
│ 👤 admin                │
│    📧 admin@school.local│
├─────────────────────────┤
│ 🔗 Lihat Situs         │
│ ⚙️  Pengaturan          │
├─────────────────────────┤
│ 🚪 Keluar              │ (red)
└─────────────────────────┘
```

## Consistency

Both admin and tenant dashboards now have:
- ✅ Same ProfileDropdown component
- ✅ Same logout functionality
- ✅ Same user experience
- ✅ Same visual design

## API Endpoint

**Logout API:** `/api/auth/logout`

```typescript
POST /api/auth/logout

Response:
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Testing

### Test Logout
1. Login as admin: `admin` / `admin123`
2. Navigate to: `http://dashboard.aksesekolah.local:3000/admin`
3. Click profile dropdown (top-right)
4. Click "Keluar"
5. Should redirect to `/signin`
6. Try accessing `/admin` again
7. Should redirect to `/signin` (no session)

### Test Settings Link
1. Click profile dropdown
2. Click "Pengaturan"
3. Should navigate to `/admin/settings`

### Test View Site Link
1. Click profile dropdown
2. Click "Lihat Situs"
3. Should open main site in new tab

## Benefits

1. **Consistent UX**: Same experience across admin and tenant
2. **Easy Logout**: One-click logout from any admin page
3. **User Info**: Quick access to user information
4. **Settings Access**: Quick link to settings
5. **Professional**: Clean and modern design

## Summary

✅ Admin dashboard now has logout button
✅ Uses same ProfileDropdown as tenant
✅ Consistent design and functionality
✅ Easy access from top-right corner
✅ Includes user info and quick links
