# 🔧 Cara Membuat Admin User

Jika Anda perlu membuat admin user untuk testing, gunakan salah satu cara berikut:

## Metode 1: Menggunakan Script Node.js (Recommended)

```bash
node scripts/seed-admin.js
```

Script ini akan:
- ✅ Membuat user dengan username: `admin`
- ✅ Password: `admin123`
- ✅ Email: `admin@school.local`
- ✅ Role: `admin`

## Metode 2: Menggunakan API Endpoint

Jalankan server development terlebih dahulu:
```bash
npm run dev
```

Kemudian panggil API endpoint:
```bash
curl -X POST http://localhost:3000/api/auth/create-admin
```

## Metode 3: Manual via SQLite

```bash
# 1. Buka SQLite shell
sqlite3 prisma/dev.db

# 2. Insert admin user (ganti HASHED_PASSWORD dengan hasil bcrypt)
INSERT INTO users (id, username, password, email, role, isActive, createdAt, updatedAt)
VALUES ('admin-123', 'admin', 'HASHED_PASSWORD', 'admin@school.local', 'admin', 1, datetime('now'), datetime('now'));

# 3. Exit
.exit
```

## Default Credentials

Setelah membuat admin user:

- **Username**: `admin`
- **Password**: `admin123`
- **Login URL**: `http://localhost:3000/signin`

## Troubleshooting

### Error: "Username sudah digunakan"
Admin user sudah ada, gunakan credentials di atas untuk login.

### Error: "Database tidak ditemukan"
Jalankan:
```bash
npx prisma db push
```

### Error: "Prisma enableTracing"
Pastikan file `lib/prisma.ts` menggunakan konfigurasi sederhana tanpa options.

