# Platform Authentication System

## Overview

Sistem autentikasi platform untuk AkseSekolah.id yang memungkinkan registrasi tenant baru dan login admin platform.

## Architecture

### Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Platform Authentication                   │
└─────────────────────────────────────────────────────────────┘

1. User Registration (Tenant Creation)
   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
   │  Signup  │───▶│   API    │───▶│ Database │───▶│   JWT    │
   │   Page   │    │ Register │    │  Create  │    │  Token   │
   └──────────┘    └──────────┘    └──────────┘    └──────────┘
        │                                                  │
        └──────────────────────────────────────────────────┘
                    Redirect to Dashboard

2. User Login
   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
   │  Signin  │───▶│   API    │───▶│ Database │───▶│   JWT    │
   │   Page   │    │  Signin  │    │  Verify  │    │  Token   │
   └──────────┘    └──────────┘    └──────────┘    └──────────┘
        │                                                  │
        └──────────────────────────────────────────────────┘
                    Redirect to Dashboard

3. Protected Routes
   ┌──────────┐    ┌──────────┐    ┌──────────┐
   │Dashboard │───▶│Middleware│───▶│   JWT    │
   │  Access  │    │  Check   │    │  Verify  │
   └──────────┘    └──────────┘    └──────────┘
        │                                  │
        └──────────────────────────────────┘
              Allow/Deny Access
```

## Components

### 1. Authentication Pages

#### Sign In Page
- **Path**: `/signin`
- **Route**: `app/(platform)/(auth)/signin/page.tsx`
- **Features**:
  - Email & password login
  - Professional corporate design
  - Redirect to appropriate dashboard based on role
  - Forgot password link
  - Link to signup page

#### Sign Up Page
- **Path**: `/signup`
- **Route**: `app/(platform)/(auth)/signup/page.tsx`
- **Features**:
  - Multi-step wizard (3 steps)
  - Step 1: School Information (name, NPSN, address)
  - Step 2: Admin Information (name, email, phone)
  - Step 3: Account Creation (subdomain, password)
  - Form validation
  - Progress indicator
  - Professional design with benefits showcase

#### Success Page
- **Path**: `/signup/success`
- **Route**: `app/(platform)/(auth)/signup/success/page.tsx`
- **Features**:
  - Success confirmation
  - Tenant information display
  - Next steps guide
  - Auto-redirect to dashboard (10 seconds)
  - Manual navigation buttons

### 2. API Endpoints

#### POST /api/auth/signin
- **Purpose**: Authenticate user and create session
- **Input**:
  ```json
  {
    "email": "admin@sekolah.id",
    "password": "password123"
  }
  ```
- **Output**:
  ```json
  {
    "message": "Login berhasil",
    "user": {
      "id": "user_id",
      "email": "admin@sekolah.id",
      "role": "tenant_admin",
      "tenantId": "tenant_id"
    }
  }
  ```
- **Actions**:
  - Verify email and password
  - Check if user is active
  - Create JWT token
  - Set HTTP-only cookie
  - Return user data

#### POST /api/tenant/register
- **Purpose**: Register new tenant and create admin user
- **Input**:
  ```json
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
  ```
- **Output**:
  ```json
  {
    "message": "Registrasi berhasil",
    "tenant": {
      "id": "tenant_id",
      "name": "SMP Negeri 1 Jakarta",
      "slug": "sekolahku",
      "domain": "sekolahku.aksesekolah.id"
    },
    "user": {
      "id": "user_id",
      "email": "admin@sekolah.id",
      "role": "tenant_admin"
    }
  }
  ```
- **Actions**:
  - Validate input data
  - Check subdomain availability
  - Check email uniqueness
  - Create tenant record
  - Create school record
  - Create admin user
  - Hash password
  - Create JWT token
  - Set HTTP-only cookie

#### POST /api/auth/signout
- **Purpose**: Logout user and clear session
- **Output**:
  ```json
  {
    "message": "Logout berhasil"
  }
  ```
- **Actions**:
  - Remove auth cookie
  - Clear session

### 3. JWT Utilities

#### File: `lib/jwt.ts`

**Functions**:

1. `signToken(payload: JWTPayload): Promise<string>`
   - Creates JWT token with 7-day expiration
   - Uses HS256 algorithm
   - Includes user ID, email, role, and tenant ID

2. `verifyToken(token: string): Promise<JWTPayload>`
   - Verifies JWT token
   - Returns decoded payload
   - Throws error if invalid

3. `setAuthCookie(token: string): Promise<void>`
   - Sets HTTP-only cookie
   - 7-day expiration
   - Secure in production
   - SameSite: lax

4. `getAuthToken(): Promise<string | undefined>`
   - Retrieves auth token from cookies

5. `removeAuthCookie(): Promise<void>`
   - Deletes auth cookie

6. `getCurrentUser(): Promise<JWTPayload | null>`
   - Gets current authenticated user
   - Returns null if not authenticated

**JWT Payload Structure**:
```typescript
interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  tenantId?: string;
}
```

### 4. Middleware Protection

#### File: `app/proxy.ts`

**Protected Routes**:
- `/admin/*` - Platform admin routes
- `/tenant/*` - Tenant admin routes
- `/dashboard` - Dashboard redirect

**Authentication Check**:
```typescript
const authToken = request.cookies.get("auth-token")?.value;
if (!authToken && isDashboardRoute) {
  redirect("/signin?redirect=" + pathname);
}
```

**Features**:
- Lightweight cookie check (no DB query)
- Redirect to signin with return URL
- Preserves original destination

## Database Schema

### User Model
```prisma
model User {
  id        String   @id @default(cuid())
  username  String   @unique
  password  String
  email     String?  @unique
  role      String   @default("user") // admin, user, tenant_admin
  isActive  Boolean  @default(true)
  tenantId  String?
  tenant    Tenant?  @relation(fields: [tenantId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Tenant Model
```prisma
model Tenant {
  id               String    @id @default(cuid())
  name             String
  slug             String    @unique
  domain           String?   @unique
  email            String?
  phone            String?
  address          String?
  domainStatus     String    @default("pending")
  domainVerified   Boolean   @default(false)
  isActive         Boolean   @default(true)
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
  users            User[]
  schools          School[]
}
```

## User Roles

### 1. admin (Platform Admin)
- Full access to platform
- Can manage all tenants
- Access to `/admin/*` routes
- Dashboard: `/admin/dashboard`

### 2. tenant_admin (Tenant Administrator)
- Manages single tenant
- Access to `/tenant/*` routes
- Dashboard: `/tenant/overview`
- Can manage school data, students, admissions

### 3. user (Regular User)
- Limited access
- Can view tenant content
- No admin access

## Security Features

### 1. Password Security
- Bcrypt hashing with salt rounds: 12
- Passwords never stored in plain text
- Passwords never returned in API responses

### 2. JWT Security
- HTTP-only cookies (not accessible via JavaScript)
- Secure flag in production (HTTPS only)
- SameSite: lax (CSRF protection)
- 7-day expiration
- Secret key from environment variable

### 3. Input Validation
- Email format validation
- Password minimum length (8 characters)
- Subdomain format validation (lowercase, alphanumeric, hyphens)
- Required field validation
- Duplicate email/subdomain check

### 4. Session Management
- Automatic token expiration
- Secure cookie storage
- Logout clears all session data

## Environment Variables

```bash
# JWT Authentication
JWT_SECRET="your-jwt-secret-here-generate-with-openssl-rand-base64-32"

# Platform Configuration
NEXT_PUBLIC_PLATFORM_DOMAIN="aksesekolah.id"
NEXT_PUBLIC_APP_URL="https://aksesekolah.id"
```

## Usage Examples

### 1. Sign Up New Tenant

```typescript
// Client-side
const response = await fetch("/api/tenant/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    schoolName: "SMP Negeri 1 Jakarta",
    schoolType: "smp",
    npsn: "12345678",
    address: "Jl. Pendidikan No. 123",
    adminName: "Dr. Ahmad Suryadi",
    adminEmail: "admin@sekolah.id",
    adminPhone: "08123456789",
    password: "password123",
    subdomain: "sekolahku",
  }),
});

const data = await response.json();
// Redirect to /signup/success?subdomain=sekolahku
```

### 2. Sign In

```typescript
// Client-side
const response = await fetch("/api/auth/signin", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "admin@sekolah.id",
    password: "password123",
  }),
});

const data = await response.json();
// Redirect based on role
if (data.user.role === "admin") {
  router.push("/admin/dashboard");
} else {
  router.push("/tenant/overview");
}
```

### 3. Get Current User

```typescript
// Server-side
import { getCurrentUser } from "@/lib/jwt";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/signin");
  }
  
  return <div>Welcome, {user.email}</div>;
}
```

### 4. Sign Out

```typescript
// Client-side
const response = await fetch("/api/auth/signout", {
  method: "POST",
});

// Redirect to signin
router.push("/signin");
```

## Testing

### Manual Testing Checklist

- [ ] Sign up with valid data creates tenant and user
- [ ] Sign up with duplicate subdomain shows error
- [ ] Sign up with duplicate email shows error
- [ ] Sign up with invalid subdomain format shows error
- [ ] Sign up with weak password shows error
- [ ] Sign in with valid credentials succeeds
- [ ] Sign in with invalid credentials shows error
- [ ] Sign in with inactive account shows error
- [ ] Protected routes redirect to signin when not authenticated
- [ ] Dashboard redirects to correct route based on role
- [ ] Sign out clears session and redirects to signin
- [ ] Success page shows correct tenant information
- [ ] Success page auto-redirects after 10 seconds

## Future Enhancements

1. **Email Verification**
   - Send verification email on signup
   - Verify email before activating account

2. **Password Reset**
   - Forgot password flow
   - Email with reset link
   - Secure token-based reset

3. **Two-Factor Authentication**
   - TOTP-based 2FA
   - SMS verification option

4. **Social Login**
   - Google OAuth
   - Microsoft OAuth

5. **Session Management**
   - View active sessions
   - Revoke sessions
   - Device tracking

6. **Audit Logging**
   - Log all authentication events
   - Track login attempts
   - Security alerts

## Troubleshooting

### Issue: "Invalid token" error
- Check JWT_SECRET is set in .env
- Verify cookie is being set correctly
- Check token expiration

### Issue: Redirect loop on signin page
- Ensure auth routes are excluded from middleware check
- Verify (auth) route group is not protected

### Issue: "Email already exists" on signup
- Check if user already registered
- Verify email uniqueness in database

### Issue: Cannot access dashboard after login
- Check cookie is set with correct domain
- Verify middleware is checking correct cookie name
- Check user role matches route requirements

## References

- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [jose JWT Library](https://github.com/panva/jose)
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- [Prisma Client](https://www.prisma.io/docs/concepts/components/prisma-client)
