# Platform Authentication Setup Guide

## Quick Start

Sistem autentikasi platform untuk AkseSekolah.id telah diimplementasikan dengan fitur:
- Multi-step registration wizard untuk tenant baru
- Professional signin page untuk admin
- JWT-based authentication dengan HTTP-only cookies
- Role-based access control (admin, tenant_admin, user)
- Middleware protection untuk protected routes

## Files Created

### Authentication Pages
```
app/(platform)/(auth)/
├── signin/page.tsx          # Login page
├── signup/page.tsx          # Multi-step registration
└── signup/success/page.tsx  # Success confirmation
```

### API Endpoints
```
app/api/
├── auth/
│   ├── signin/route.ts      # POST /api/auth/signin
│   └── signout/route.ts     # POST /api/auth/signout
└── tenant/
    └── register/route.ts    # POST /api/tenant/register
```

### Utilities
```
lib/
└── jwt.ts                   # JWT utilities (sign, verify, cookies)
```

### Dashboard
```
app/(platform)/(dashboard)/
└── dashboard/page.tsx       # Role-based redirect
```

## Environment Setup

Add to `.env`:
```bash
JWT_SECRET="your-jwt-secret-here-generate-with-openssl-rand-base64-32"
```

Generate secure secret:
```bash
openssl rand -base64 32
```

## Dependencies Installed

```bash
pnpm add jose
```

## URLs

### Platform Authentication
- Sign In: `https://dashboard.aksesekolah.id/signin`
- Sign Up: `https://dashboard.aksesekolah.id/signup`
- Dashboard: `https://dashboard.aksesekolah.id/dashboard`

### Admin Dashboard
- Platform Admin: `https://dashboard.aksesekolah.id/admin/dashboard`
- Tenant Admin: `https://dashboard.aksesekolah.id/tenant/overview`

## Registration Flow

1. User visits `/signup`
2. Fills 3-step form:
   - Step 1: School info (name, NPSN, address)
   - Step 2: Admin info (name, email, phone)
   - Step 3: Account (subdomain, password)
3. System creates:
   - Tenant record
   - School record
   - Admin user with hashed password
4. JWT token generated and set as HTTP-only cookie
5. Redirect to success page
6. Auto-redirect to dashboard after 10 seconds

## Login Flow

1. User visits `/signin`
2. Enters email and password
3. System verifies credentials
4. JWT token generated and set as HTTP-only cookie
5. Redirect based on role:
   - `admin` → `/admin/dashboard`
   - `tenant_admin` → `/tenant/overview`

## Security Features

✅ Bcrypt password hashing (12 rounds)
✅ HTTP-only cookies (XSS protection)
✅ Secure cookies in production (HTTPS only)
✅ SameSite: lax (CSRF protection)
✅ JWT with 7-day expiration
✅ Input validation (email, password, subdomain)
✅ Duplicate email/subdomain check
✅ Active user check

## Testing

### Test Registration
1. Visit: `https://dashboard.aksesekolah.id/signup`
2. Fill form with test data
3. Use unique subdomain (e.g., `test-school-001`)
4. Submit and verify redirect to success page
5. Check dashboard access

### Test Login
1. Visit: `https://dashboard.aksesekolah.id/signin`
2. Use registered email and password
3. Verify redirect to correct dashboard
4. Check protected routes are accessible

### Test Protection
1. Try accessing `/admin/dashboard` without login
2. Should redirect to `/signin?redirect=/admin/dashboard`
3. After login, should redirect back to original URL

## Database Schema

### User
- `id`: Unique identifier
- `username`: Generated from email
- `email`: Unique email address
- `password`: Bcrypt hashed
- `role`: admin | tenant_admin | user
- `isActive`: Boolean flag
- `tenantId`: Foreign key to tenant

### Tenant
- `id`: Unique identifier
- `name`: School name
- `slug`: Subdomain (unique)
- `domain`: Custom domain (optional)
- `email`: Contact email
- `phone`: Contact phone
- `address`: Full address
- `domainStatus`: pending | active | suspended
- `isActive`: Boolean flag

## API Reference

### POST /api/auth/signin
```json
// Request
{
  "email": "admin@sekolah.id",
  "password": "password123"
}

// Response
{
  "message": "Login berhasil",
  "user": {
    "id": "...",
    "email": "admin@sekolah.id",
    "role": "tenant_admin",
    "tenantId": "..."
  }
}
```

### POST /api/tenant/register
```json
// Request
{
  "schoolName": "SMP Negeri 1 Jakarta",
  "schoolType": "smp",
  "npsn": "12345678",
  "address": "Jl. Pendidikan No. 123",
  "city": "Jakarta",
  "province": "DKI Jakarta",
  "phone": "021-12345678",
  "adminName": "Dr. Ahmad Suryadi",
  "adminEmail": "admin@sekolah.id",
  "adminPhone": "08123456789",
  "adminPosition": "kepala_sekolah",
  "password": "password123",
  "subdomain": "sekolahku"
}

// Response
{
  "message": "Registrasi berhasil",
  "tenant": {
    "id": "...",
    "name": "SMP Negeri 1 Jakarta",
    "slug": "sekolahku",
    "domain": "sekolahku.aksesekolah.id"
  },
  "user": {
    "id": "...",
    "email": "admin@sekolah.id",
    "role": "tenant_admin"
  }
}
```

### POST /api/auth/signout
```json
// Response
{
  "message": "Logout berhasil"
}
```

## Middleware Configuration

File: `app/proxy.ts`

Protected routes:
- `/admin/*` - Platform admin only
- `/tenant/*` - Tenant admin only
- `/dashboard` - Authenticated users

Public routes:
- `/signin` - Login page
- `/signup` - Registration page
- `/` - Landing page

## Next Steps

1. **Deploy to Production**
   - Update JWT_SECRET with secure value
   - Test on dashboard.aksesekolah.id subdomain
   - Verify SSL certificate includes dashboard subdomain

2. **Create Initial Admin**
   - Run seed script or manually create admin user
   - Test platform admin access

3. **Test Complete Flow**
   - Register new tenant
   - Login as tenant admin
   - Access tenant dashboard
   - Verify tenant isolation

4. **Monitor & Optimize**
   - Add logging for auth events
   - Monitor failed login attempts
   - Set up alerts for suspicious activity

## Troubleshooting

### Cannot access signin page
- Check nginx configuration for dashboard subdomain
- Verify SSL certificate includes dashboard.aksesekolah.id
- Check DNS records

### Registration fails
- Check database connection
- Verify Turso database is accessible
- Check Prisma schema is up to date

### Login successful but cannot access dashboard
- Check cookie domain settings
- Verify middleware is checking correct cookie name
- Check JWT_SECRET is set correctly

### Redirect loop
- Ensure auth routes are excluded from middleware
- Check (auth) route group is not protected
- Verify cookie is being set correctly

## Documentation

Full documentation: `docs/PLATFORM_AUTH.md`

## Support

For issues or questions:
- Check documentation
- Review error logs
- Contact development team
