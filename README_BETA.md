# 🎓 School Management System - Beta v1.0.0

> Sistem manajemen sekolah modern berbasis web untuk mengelola data siswa, penerimaan siswa baru (SPMB), dan komunikasi.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-beta-yellow.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

---

## ✨ Features

### 🎯 Core Features
- ✅ **Authentication System** - Login/logout dengan session management
- ✅ **Dashboard Analytics** - Real-time stats dan visualisasi data
- ✅ **Students Management** - CRUD lengkap untuk data siswa
- ✅ **Admissions/SPMB** - Kelola pendaftaran siswa baru
- ✅ **Messages Inbox** - Komunikasi dengan siswa/orang tua
- ✅ **School Settings** - Pengaturan profil dan kontak sekolah

### 📊 Analytics & Reporting
- Line chart untuk trend pendaftar
- Pie chart distribusi siswa per jenjang
- Real-time statistics cards

### 🎨 UI/UX
- Modern & responsive design
- Collapsible sidebar navigation
- Loading states & error handling
- Color-coded badges & status indicators

---

## 🚀 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **Shadcn/ui** - UI component library
- **Recharts** - Data visualization

### Backend
- **Next.js API Routes** - RESTful API
- **Prisma ORM** - Type-safe database access
- **SQLite** - Database (Bootstrap phase)
- **bcryptjs** - Password hashing
- **Zod** - Input validation

---

## 📦 Installation

### Prerequisites

- Node.js 18+ atau Bun
- npm atau pnpm

### Quick Start

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd v0-website-for-school
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Seed database** (opsional)
   ```bash
   node scripts/seed-database.js
   ```

5. **Create admin user**
   ```bash
   node scripts/seed-admin.js
   ```

6. **Run development server**
   ```bash
   npm run dev
   ```

7. **Open browser**
   ```
   http://localhost:3000
   ```

### Default Credentials

- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Penting**: Ganti password default setelah login pertama!

---

## 📚 Documentation

- **[User Guide](docs/USER_GUIDE.md)** - Panduan lengkap pengguna
- **[Testing Checklist](docs/TESTING_CHECKLIST.md)** - Checklist untuk testing
- **[API Documentation](docs/API.md)** - API endpoints reference
- **[Architecture](docs/architecture/)** - System architecture docs

---

## 🗂️ Project Structure

```
v0-website-for-school/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth route group
│   │   └── signin/          # Login page
│   ├── admin/               # Admin pages
│   │   ├── dashboard/       # Dashboard
│   │   ├── students/        # Students management
│   │   ├── admissions/      # SPMB
│   │   ├── messages/        # Messages inbox
│   │   └── school/          # School settings
│   └── api/                 # API routes
│       ├── auth/            # Authentication
│       ├── students/        # Students CRUD
│       ├── applications/    # Applications
│       ├── messages/        # Messages
│       └── dashboard/       # Dashboard data
├── components/              # React components
│   ├── admin/              # Admin components
│   ├── navigation/         # Navigation components
│   └── ui/                 # Shadcn UI components
├── lib/                    # Utilities
│   ├── prisma.ts           # Prisma client
│   ├── auth.ts             # Auth utilities
│   └── validations.ts      # Zod schemas
├── prisma/                 # Database
│   ├── schema.prisma       # Database schema
│   └── dev.db              # SQLite database
├── scripts/                # Utility scripts
│   ├── seed-database.js    # Database seeding
│   └── seed-admin.js       # Create admin user
└── docs/                   # Documentation
```

---

## 🎯 Usage

### For Administrators

1. **Login** ke sistem dengan credentials admin
2. **Dashboard** - Lihat overview statistik sekolah
3. **Kelola Siswa** - Tambah, edit, hapus data siswa
4. **SPMB** - Approve/reject pendaftar baru
5. **Pesan** - Baca dan kelola komunikasi
6. **Settings** - Update informasi sekolah

### For Developers

1. **Database Schema**
   ```bash
   npx prisma studio
   # Open: http://localhost:5555
   ```

2. **Run Tests**
   ```bash
   npm run test
   ```

3. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

---

## 🔒 Security

- ✅ HTTP-only cookies for session management
- ✅ Password hashing dengan bcryptjs (12 salt rounds)
- ✅ Input validation dengan Zod
- ✅ SQL injection protection (Prisma ORM)
- ✅ XSS protection
- ✅ CSRF protection (SameSite cookies)

---

## 🗄️ Database Schema

### Models

- **User** - Admin users
- **School** - School profile
- **Student** - Student data
- **Application** - Student applications (SPMB)
- **Message** - Communication messages

See `prisma/schema.prisma` for complete schema.

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Students
- `GET /api/students` - List all students
- `POST /api/students` - Create student
- `GET /api/students/[id]` - Get student
- `PUT /api/students/[id]` - Update student
- `DELETE /api/students/[id]` - Delete student

### Applications
- `GET /api/applications` - List applications
- `PUT /api/applications/[id]` - Update status

### Messages
- `GET /api/messages` - List messages
- `PUT /api/messages/[id]` - Mark as read
- `DELETE /api/messages/[id]` - Delete message

### Dashboard
- `GET /api/dashboard/stats` - Get statistics
- `GET /api/dashboard/charts` - Get chart data

---

## 🧪 Testing

Run testing checklist:

```bash
# See docs/TESTING_CHECKLIST.md
```

**Coverage Areas:**
- Authentication & Authorization
- Students CRUD operations
- Admissions workflow
- Messages management
- School settings
- UI/UX responsiveness

---

## 🚀 Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Variables

Create `.env.production`:

```env
DATABASE_URL="file:./production.db"
NODE_ENV="production"
NEXTAUTH_SECRET="your-super-secret-key"
```

### Docker (Coming Soon)

```bash
docker build -t school-management .
docker run -p 3000:3000 school-management
```

---

## 🎯 Roadmap

### Phase 1: Bootstrap (✅ Complete)
- [x] Authentication system
- [x] Students management
- [x] Admissions/SPMB
- [x] Messages inbox
- [x] School settings
- [x] Dashboard analytics

### Phase 2: Growth (🔄 In Progress)
- [ ] Migrate to PostgreSQL
- [ ] Teachers & Staff management
- [ ] Class scheduling
- [ ] Attendance tracking
- [ ] Grade management

### Phase 3: Scale (📅 Planned)
- [ ] Parent portal
- [ ] Mobile app
- [ ] Reports & exports
- [ ] Multi-school support
- [ ] Advanced analytics

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Development Team** - Initial work

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Shadcn for the beautiful UI components
- Prisma team for the excellent ORM
- All contributors and beta testers

---

## 📞 Support

- **Documentation**: [docs/](docs/)
- **Issues**: GitHub Issues
- **Email**: admin@school.local

---

## 📈 Stats

- **Version**: 1.0.0 Beta
- **Status**: Ready for Beta Testing
- **Last Updated**: October 2024
- **License**: MIT
- **Languages**: TypeScript, JavaScript
- **Framework**: Next.js 14

---

**Made with ❤️ for Education**

