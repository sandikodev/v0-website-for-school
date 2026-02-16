# 🚀 Beta Deployment Guide

## 📋 Pre-Deployment Checklist

- [ ] All tests passed (see TESTING_CHECKLIST.md)
- [ ] No linter errors
- [ ] Database seeded with sample data
- [ ] Admin user created
- [ ] Documentation complete

---

## 🎯 Quick Deployment (Local/Development)

### 1. Setup Environment

```bash
# Clone repository
git clone <repo-url>
cd v0-website-for-school

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate
```

### 2. Setup Database

```bash
# Push schema to database
npx prisma db push

# Seed database with sample data
node scripts/seed-database.js

# Create admin user
node scripts/seed-admin.js
```

### 3. Run Application

```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

### 4. Access Application

- **URL**: http://localhost:3000
- **Admin Login**: http://localhost:3000/signin
- **Username**: `admin`
- **Password**: `admin123`

---

## 🐳 Docker Deployment (Coming Soon)

```bash
# Build image
docker build -t school-management:beta .

# Run container
docker run -p 3000:3000 school-management:beta
```

---

## ☁️ VPS Deployment

### Requirements

- Ubuntu 20.04+ or Debian 11+
- Node.js 18+
- nginx (optional, for reverse proxy)
- Domain name (optional)

### Steps

1. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Clone & Setup**
   ```bash
   git clone <repo-url>
   cd v0-website-for-school
   npm install
   npx prisma generate
   npx prisma db push
   node scripts/seed-database.js
   node scripts/seed-admin.js
   ```

3. **Build Application**
   ```bash
   npm run build
   ```

4. **Run with PM2**
   ```bash
   npm install -g pm2
   pm2 start npm --name "school-app" -- start
   pm2 save
   pm2 startup
   ```

5. **Setup nginx (Optional)**
   ```nginx
   server {
       listen 80;
       server_name school.yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

## 🔒 Production Checklist

### Security
- [ ] Change default admin password
- [ ] Set strong NEXTAUTH_SECRET
- [ ] Enable HTTPS
- [ ] Configure CORS
- [ ] Setup rate limiting
- [ ] Regular security updates

### Database
- [ ] Migrate to PostgreSQL (for production)
- [ ] Setup automated backups
- [ ] Configure connection pooling

### Monitoring
- [ ] Setup error logging
- [ ] Configure uptime monitoring
- [ ] Setup alerts

---

## 🎯 Beta Testing

### Test Users

Create test accounts:
```bash
# Via Prisma Studio
npx prisma studio
# Create users manually
```

### Feedback Collection

- GitHub Issues for bugs
- Email untuk feature requests
- User survey form

---

## 📊 Migration to Production

### From SQLite to PostgreSQL

1. **Update DATABASE_URL** in `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/schooldb"
   ```

2. **Update schema.prisma**:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

3. **Migrate data**:
   ```bash
   npx prisma db push
   # Import data dari SQLite
   ```

---

## 🆘 Troubleshooting

### Problem: Database errors

```bash
# Reset database
npx prisma db push --force-reset
node scripts/seed-database.js
```

### Problem: Port already in use

```bash
# Change port in package.json
"dev": "next dev -p 3001"
```

### Problem: Prisma errors

```bash
# Regenerate Prisma client
npx prisma generate
```

---

## 📞 Support

- **Documentation**: See `/docs` folder
- **Issues**: Create GitHub issue
- **Email**: admin@school.local

---

**Ready for Beta Testing!** 🎉

