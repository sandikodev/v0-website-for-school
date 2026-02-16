# Configuration Files

## 📁 Folder Structure

```
config/
├── README.md                    # This file
├── docker.env.example           # Docker environment template (legacy)
├── env.dev.example              # Development environment template
├── env.staging.example          # Staging environment template
└── env.prod.example             # Production environment template
```

## 🔧 Usage

### Copy Environment Files

```bash
# Development
cp config/env.dev.example .env.dev

# Staging
cp config/env.staging.example .env.staging

# Production
cp config/env.prod.example .env.prod
```

### Edit Environment Variables

```bash
# Edit development environment
nano .env.dev

# Edit staging environment
nano .env.staging

# Edit production environment
nano .env.prod
```

## 📋 Environment Variables

### Development Environment

- `NODE_ENV=development`
- `DATABASE_URL=postgresql://school_user:dev_password@postgres:5432/school_db_dev`
- `REDIS_URL=redis://redis:6379`
- `NEXTAUTH_SECRET=dev-secret-key`
- `NEXTAUTH_URL=http://localhost:3000`

### Staging Environment

- `NODE_ENV=staging`
- `DOMAIN=staging.your-domain.com`
- `EMAIL=admin@your-domain.com`
- `DATABASE_URL=postgresql://school_user:staging_password@postgres:5432/school_db_staging`
- `REDIS_URL=redis://:staging_password@redis:6379`
- `NEXTAUTH_SECRET=staging-secret-key`
- `NEXTAUTH_URL=https://staging.your-domain.com`

### Production Environment

- `NODE_ENV=production`
- `DOMAIN=your-domain.com`
- `EMAIL=admin@your-domain.com`
- `DATABASE_URL=postgresql://school_user:production_password@postgres:5432/school_db`
- `REDIS_URL=redis://:production_password@redis:6379`
- `NEXTAUTH_SECRET=production-secret-key`
- `NEXTAUTH_URL=https://your-domain.com`

## 🔒 Security Notes

- Never commit actual `.env` files to version control
- Use strong passwords for production environments
- Rotate secrets regularly
- Use different secrets for each environment

## 📚 Documentation

For detailed documentation, see:

- [Development Deployment](../../docs/deployment/development-deployment.md)
- [Staging Deployment](../../docs/deployment/staging-deployment.md)
- [Production Deployment](../../docs/deployment/production-deployment.md)
- [Deployment Strategy](../../docs/deployment/deployment-strategy.md)
