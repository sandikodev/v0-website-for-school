# Documentation Index

Welcome to the AkseSekolah.id documentation! This multi-tenant school management platform is built with Next.js 16 and supports subdomain and custom domain routing.

## 📚 Documentation Structure

### Getting Started
1. **[QUICK-START.md](./QUICK-START.md)** - Get up and running in 5 minutes
   - Installation
   - Database setup
   - First tenant creation
   - Basic usage

2. **[LOCAL-DEVELOPMENT.md](./LOCAL-DEVELOPMENT.md)** - Complete local development guide
   - /etc/hosts setup
   - Project structure
   - Testing multi-tenant
   - Troubleshooting

### Architecture & Design
3. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture overview
   - Request flow diagrams
   - Route groups explained
   - Performance optimizations
   - Security layers

4. **[MULTI-TENANT-SETUP.md](./MULTI-TENANT-SETUP.md)** - Multi-tenant implementation
   - Tenant resolution
   - Caching strategy
   - DNS configuration
   - Nginx setup

## 🏗️ Project Overview

### What is AkseSekolah.id?

A modern, multi-tenant SaaS platform for Indonesian schools to manage:
- Student admissions (SPMB)
- School website with custom branding
- Dashboard and analytics
- Communication with prospective students

### Key Features

✅ **Multi-Tenant Architecture**
- Subdomain support: `tenant1.aksesekolah.id`
- Custom domain support: `smp-syuhada.sch.id`
- Isolated data per tenant

✅ **Dynamic Branding**
- Custom colors per tenant
- Logo and favicon support
- Themed components

✅ **Performance**
- Tenant caching (5min TTL)
- Sub-millisecond lookups
- Static generation where possible

✅ **Security**
- Role-based access control
- Tenant data isolation
- Session management

## 🚀 Quick Links

### For Developers
- [Local Development Guide](./LOCAL-DEVELOPMENT.md)
- [Architecture Overview](./ARCHITECTURE.md)
- [API Documentation](../README.md#api-routes)

### For DevOps
- [Multi-Tenant Setup](./MULTI-TENANT-SETUP.md)
- [Nginx Configuration](../nginx/)
- [Environment Variables](../.env.example)

### For Product
- [Feature List](../README.md#features)
- [Roadmap](../README.md#roadmap)
- [Contributing](../CONTRIBUTING.md)

## 🎯 Common Tasks

### Setup Local Environment
```bash
# 1. Setup hosts
sudo bash scripts/setup-local-hosts.sh

# 2. Install dependencies
pnpm install

# 3. Setup database
pnpm db:generate && pnpm db:push && pnpm db:seed:all

# 4. Start dev server
pnpm dev
```

### Create a New Tenant
```bash
# Via Prisma Studio (recommended)
pnpm db:studio

# Or via API
curl -X POST http://aksesekolah.local:3000/api/tenant/settings \
  -H "Content-Type: application/json" \
  -d '{"name":"My School","slug":"myschool"}'
```

### Deploy to Production
```bash
# 1. Build
pnpm build

# 2. Start
pnpm start

# 3. Configure Nginx (see nginx/ folder)
```

## 📖 Documentation by Role

### 👨‍💻 Developer
Start here:
1. [QUICK-START.md](./QUICK-START.md)
2. [LOCAL-DEVELOPMENT.md](./LOCAL-DEVELOPMENT.md)
3. [ARCHITECTURE.md](./ARCHITECTURE.md)

### 🔧 DevOps Engineer
Start here:
1. [MULTI-TENANT-SETUP.md](./MULTI-TENANT-SETUP.md)
2. [ARCHITECTURE.md](./ARCHITECTURE.md)
3. Nginx configs in `../nginx/`

### 🎨 Frontend Developer
Start here:
1. [LOCAL-DEVELOPMENT.md](./LOCAL-DEVELOPMENT.md)
2. Component structure in `../components/`
3. Tenant theming in `../app/[jajal]/layout.tsx`

### 🗄️ Backend Developer
Start here:
1. [ARCHITECTURE.md](./ARCHITECTURE.md)
2. API routes in `../app/api/`
3. Database schema in `../prisma/schema.prisma`

## 🔍 Key Concepts

### Route Groups
- `(www)` - Platform landing page (public)
- `(platform)` - Platform admin (superadmin only)
- `[jajal]` - Tenant pages (dynamic branding)

### Tenant Resolution
1. Request comes in with hostname
2. `proxy.ts` checks if platform or tenant
3. If tenant: lookup in cache (5min TTL)
4. Add tenant headers to request
5. Layout applies tenant theme

### Caching Strategy
- **In-memory cache** (current): 5min TTL, single-server
- **Redis cache** (future): For multi-server deployment

## 🆘 Getting Help

### Documentation Issues
- Check [Troubleshooting](./LOCAL-DEVELOPMENT.md#troubleshooting)
- Search existing issues on GitHub
- Create new issue with details

### Code Issues
- Check [Architecture](./ARCHITECTURE.md) for design decisions
- Review code comments
- Ask in team chat

### Production Issues
- Check logs: `pm2 logs`
- Check Nginx logs: `/var/log/nginx/`
- Monitor database connections

## 🎓 Learning Path

### Beginner
1. Read [QUICK-START.md](./QUICK-START.md)
2. Follow setup steps
3. Create a test tenant
4. Explore the codebase

### Intermediate
1. Read [ARCHITECTURE.md](./ARCHITECTURE.md)
2. Understand request flow
3. Modify tenant components
4. Add new features

### Advanced
1. Read [MULTI-TENANT-SETUP.md](./MULTI-TENANT-SETUP.md)
2. Setup production environment
3. Configure custom domains
4. Optimize performance

## 📝 Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for:
- Code style guide
- Pull request process
- Testing requirements
- Documentation standards

## 📄 License

See [LICENSE](../LICENSE) file for details.

---

**Last Updated**: 2025-01-XX
**Version**: 1.0.0-beta
**Maintainer**: PT Koneksi Jaringan Indonesia
