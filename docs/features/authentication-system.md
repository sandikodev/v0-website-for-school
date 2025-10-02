# Authentication System Documentation

## 🔐 **Overview**

Sistem autentikasi untuk School Website Builder menggunakan SQLite sebagai database bootstrap dengan Prisma ORM untuk type-safe database operations.

## 🏗️ **Architecture**

### **Tech Stack**
- **Database**: SQLite (bootstrap phase)
- **ORM**: Prisma
- **Validation**: Zod
- **Password Hashing**: bcryptjs
- **Session Management**: HTTP-only cookies

### **Database Schema**
```prisma
model User {
  id        String   @id @default(cuid())
  username  String   @unique
  password  String
  email     String?  @unique
  role      String   @default("user") // admin, user
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}
```

## 🚀 **API Endpoints**

### **Authentication Endpoints**

#### **POST /api/auth/login**
Login dengan username dan password.

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login berhasil",
  "user": {
    "id": "cuid",
    "username": "admin",
    "email": "admin@school.local",
    "role": "admin",
    "isActive": true,
    "createdAt": "2024-12-19T...",
    "updatedAt": "2024-12-19T..."
  }
}
```

#### **POST /api/auth/register**
Registrasi user baru.

**Request Body:**
```json
{
  "username": "newuser",
  "password": "password123",
  "email": "user@example.com"
}
```

#### **POST /api/auth/logout**
Logout user dan clear session cookie.

#### **GET /api/auth/me**
Get current user information dari session.

#### **POST /api/auth/create-admin**
Create default admin user untuk testing.

## 🔧 **Implementation Details**

### **Password Security**
```typescript
// Hash password dengan bcryptjs
const hashedPassword = await bcrypt.hash(password, 12)

// Verify password
const isValidPassword = await bcrypt.compare(password, hashedPassword)
```

### **Session Management**
```typescript
// Set session cookie
response.cookies.set('user-session', JSON.stringify({
  id: user.id,
  username: user.username,
  role: user.role,
}), {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 7, // 7 days
})
```

### **Validation**
```typescript
// Zod validation schemas
export const LoginSchema = z.object({
  username: z.string().min(1, 'Username harus diisi'),
  password: z.string().min(1, 'Password harus diisi'),
})

export const RegisterSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6),
  email: z.string().email().optional(),
})
```

## 🎯 **Usage Examples**

### **Frontend Login**
```typescript
const handleLogin = async (credentials) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    const data = await response.json()

    if (data.success) {
      // Redirect to dashboard
      router.push("/admin/dashboard")
    } else {
      setError(data.message)
    }
  } catch (error) {
    setError("Terjadi kesalahan saat login")
  }
}
```

### **Check Authentication**
```typescript
const checkAuth = async () => {
  try {
    const response = await fetch('/api/auth/me')
    if (response.ok) {
      const data = await response.json()
      return data.user
    }
  } catch (error) {
    // User not authenticated
  }
  return null
}
```

## 🔒 **Security Features**

### **Password Security**
- ✅ **bcryptjs hashing** dengan salt rounds 12
- ✅ **Password validation** minimal 6 karakter
- ✅ **No plain text storage** password di database

### **Session Security**
- ✅ **HTTP-only cookies** untuk mencegah XSS
- ✅ **Secure flag** untuk production
- ✅ **SameSite protection** untuk CSRF
- ✅ **Session expiration** 7 hari

### **Input Validation**
- ✅ **Zod validation** untuk semua input
- ✅ **Type safety** dengan TypeScript
- ✅ **SQL injection protection** dengan Prisma
- ✅ **XSS protection** dengan proper escaping

## 🧪 **Testing**

### **Default Admin User**
Untuk testing, gunakan credentials berikut:
- **Username**: `admin`
- **Password**: `admin123`
- **Email**: `admin@school.local`
- **Role**: `admin`

### **Create Admin User**
```bash
# Via API endpoint
curl -X POST http://localhost:3000/api/auth/create-admin
```

## 📊 **Database Operations**

### **Prisma Client Usage**
```typescript
import { prisma } from '@/lib/prisma'

// Create user
const user = await prisma.user.create({
  data: {
    username: 'admin',
    password: hashedPassword,
    email: 'admin@school.local',
    role: 'admin',
    isActive: true,
  }
})

// Find user
const user = await prisma.user.findUnique({
  where: { username: 'admin' }
})

// Update user
const user = await prisma.user.update({
  where: { id: userId },
  data: { isActive: false }
})
```

## 🔄 **Migration Strategy**

### **Bootstrap Phase (Current)**
- SQLite database untuk development
- Simple session management
- Basic authentication

### **Growth Phase (Future)**
- Migrate ke PostgreSQL
- JWT tokens untuk stateless auth
- OAuth integration
- Multi-factor authentication

### **Scale Phase (Long-term)**
- Redis untuk session storage
- Load balancing
- Advanced security features

## 🚨 **Error Handling**

### **Common Errors**
```typescript
// Username tidak ditemukan
{ "success": false, "message": "Username atau password salah" }

// Password salah
{ "success": false, "message": "Username atau password salah" }

// Akun tidak aktif
{ "success": false, "message": "Akun tidak aktif" }

// Username sudah digunakan
{ "success": false, "message": "Username sudah digunakan" }

// Email sudah digunakan
{ "success": false, "message": "Email sudah digunakan" }
```

## 📝 **Best Practices**

### **Password Requirements**
- Minimal 6 karakter
- Kombinasi huruf dan angka
- Tidak menggunakan password yang mudah ditebak

### **Username Requirements**
- Minimal 3 karakter
- Maksimal 50 karakter
- Hanya huruf, angka, dan underscore

### **Session Management**
- Logout saat browser ditutup
- Session timeout setelah 7 hari
- Clear session saat logout

## 🔧 **Configuration**

### **Environment Variables**
```bash
# Database
DATABASE_URL="file:./dev.db"

# Security
NODE_ENV="development" # atau "production"
```

### **Prisma Configuration**
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

## 📈 **Performance Considerations**

### **Database Optimization**
- Index pada username dan email
- Connection pooling dengan Prisma
- Query optimization

### **Security Optimization**
- Rate limiting untuk login attempts
- Brute force protection
- Input sanitization

## 🎯 **Future Enhancements**

### **Planned Features**
- [ ] JWT token authentication
- [ ] OAuth integration (Google, Microsoft)
- [ ] Multi-factor authentication
- [ ] Password reset functionality
- [ ] User profile management
- [ ] Role-based permissions
- [ ] Audit logging

### **WordPress Integration**
- [ ] WordPress plugin authentication
- [ ] Single sign-on (SSO)
- [ ] User synchronization
- [ ] Role mapping

---

**Last Updated**: December 2024  
**Status**: Bootstrap Phase Complete  
**Next Phase**: Growth Phase (PostgreSQL + JWT)
