# Test Credentials - Dashboard Login

## Platform Admin (Test `/admin` routes)

### Credentials
```
Username: admin
Email: admin@school.local
Password: admin123
```

### User Details
- **Role:** `admin` (Platform Admin)
- **TenantId:** `null` (No tenant association)
- **Access:** Full platform administration

### Login URLs
```
Development: http://dashboard.aksesekolah.local:3000/signin
Production: https://dashboard.aksesekolah.id/signin
```

### After Login
- Redirects to: `/admin`
- Then redirects to: `/admin/overview` (admin entrypoint)

### Test Flow
```bash
# 1. Login
curl -X POST http://dashboard.aksesekolah.local:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Expected Response:
{
  "success": true,
  "message": "Login berhasil",
  "user": {
    "id": "...",
    "username": "admin",
    "email": "admin@school.local",
    "role": "admin",
    "tenantId": null
  },
  "redirectUrl": "http://dashboard.aksesekolah.local:3000/admin"
}

# 2. Access dashboard root (with session)
# Should redirect to /admin
curl -I http://dashboard.aksesekolah.local:3000 -b cookies.txt

# 3. Access /admin
# Should redirect to /admin/overview
curl -I http://dashboard.aksesekolah.local:3000/admin -b cookies.txt
```

---

## Tenant Admin (Test `/tenant` routes)

### Credentials
```
Username: admin_sransa
Email: admin@smpsransa.sch.id
Password: sransa2024
```

### User Details
- **Role:** `tenant_admin` (Tenant Administrator)
- **TenantId:** `cmij4yhmg0000kzpot23cfi2v`
- **Tenant:** SMP Negeri 1 Srandakan
- **Access:** Tenant-specific administration

### Login URLs
```
Development: http://dashboard.aksesekolah.local:3000/signin
Production: https://dashboard.aksesekolah.id/signin
```

### After Login
- Redirects to: `/tenant`
- Then redirects to: `/tenant/overview` (tenant entrypoint)

### Test Flow
```bash
# 1. Login
curl -X POST http://dashboard.aksesekolah.local:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin@smpsransa.sch.id","password":"sransa2024"}'

# Expected Response:
{
  "success": true,
  "message": "Login berhasil",
  "user": {
    "id": "...",
    "username": "admin_sransa",
    "email": "admin@smpsransa.sch.id",
    "role": "tenant_admin",
    "tenantId": "cmij4yhmg0000kzpot23cfi2v"
  },
  "redirectUrl": "http://dashboard.aksesekolah.local:3000/tenant"
}

# 2. Access dashboard root (with session)
# Should redirect to /tenant
curl -I http://dashboard.aksesekolah.local:3000 -b cookies.txt

# 3. Access /tenant
# Should redirect to /tenant/overview
curl -I http://dashboard.aksesekolah.local:3000/tenant -b cookies.txt
```

---

## Login Flexibility

### Login with Username OR Email
Both methods work for all users:

```javascript
// Login with username
{ "username": "admin", "password": "admin123" }

// Login with email (also works)
{ "username": "admin@school.local", "password": "admin123" }
```

```javascript
// Login with username
{ "username": "admin_sransa", "password": "sransa2024" }

// Login with email (also works)
{ "username": "admin@smpsransa.sch.id", "password": "sransa2024" }
```

---

## Quick Test Commands

### Test Platform Admin Login
```bash
# Login and save cookie
curl -X POST http://dashboard.aksesekolah.local:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  -c /tmp/admin-cookies.txt

# Access dashboard (should redirect to /admin)
curl -L http://dashboard.aksesekolah.local:3000 \
  -b /tmp/admin-cookies.txt
```

### Test Tenant Admin Login
```bash
# Login and save cookie
curl -X POST http://dashboard.aksesekolah.local:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin@smpsransa.sch.id","password":"sransa2024"}' \
  -c /tmp/tenant-cookies.txt

# Access dashboard (should redirect to /tenant)
curl -L http://dashboard.aksesekolah.local:3000 \
  -b /tmp/tenant-cookies.txt
```

---

## Browser Testing

### Platform Admin
1. Open: `http://dashboard.aksesekolah.local:3000`
2. Should redirect to: `/signin`
3. Login with:
   - Username: `admin` (or email: `admin@school.local`)
   - Password: `admin123`
4. Should redirect to: `/admin`
5. Should then redirect to: `/admin/overview`

### Tenant Admin
1. Open: `http://dashboard.aksesekolah.local:3000`
2. Should redirect to: `/signin`
3. Login with:
   - Username: `admin_sransa` (or email: `admin@smpsransa.sch.id`)
   - Password: `sransa2024`
4. Should redirect to: `/tenant`
5. Should then redirect to: `/tenant/overview`

---

## Database Query

To see all users:
```bash
echo "SELECT username, email, role, tenantId FROM users;" | sqlite3 -header -column prisma/dev.db
```

To check specific user:
```bash
echo "SELECT * FROM users WHERE username = 'admin';" | sqlite3 -header -column prisma/dev.db
```

---

## Creating New Admin User

If you need to create a new platform admin:

```bash
# Run the create admin script
node scripts/create-admin.js

# Or manually with SQL
sqlite3 prisma/dev.db
```

```sql
-- Generate bcrypt hash for password first
-- Then insert:
INSERT INTO users (id, username, password, email, role, isActive, createdAt, updatedAt)
VALUES (
  'admin-new-id',
  'newadmin',
  '$2a$12$HASHED_PASSWORD_HERE',
  'newadmin@school.local',
  'admin',
  1,
  datetime('now'),
  datetime('now')
);
```

---

## Summary

| User Type | Username | Email | Password | Role | TenantId | Dashboard |
|-----------|----------|-------|----------|------|----------|-----------|
| Platform Admin | `admin` | `admin@school.local` | `admin123` | `admin` | `null` | `/admin` |
| Tenant Admin | `admin_sransa` | `admin@smpsransa.sch.id` | `sransa2024` | `tenant_admin` | `cmij...` | `/tenant` |

Both users can login with either **username** or **email**.
