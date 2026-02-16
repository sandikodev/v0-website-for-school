# Quick Dashboard Setup Guide

## 🚀 Setup Dashboard Subdomain (5 Minutes)

### Step 1: DNS Configuration ✅ (Already Done)

```bash
# You already pointed dashboard.aksesekolah.id to your server
✅ DNS: dashboard.aksesekolah.id → Server IP
```

### Step 2: SSL Certificate

```bash
# Generate SSL for dashboard subdomain
sudo certbot certonly --nginx \
  -d dashboard.aksesekolah.id

# Or use existing wildcard certificate
# (if you have *.aksesekolah.id certificate, it already covers dashboard)
```

### Step 3: Nginx Configuration

Create or update nginx config:

```bash
sudo nano /etc/nginx/sites-available/aksesekolah.id
```

Add dashboard subdomain:

```nginx
# Dashboard subdomain
server {
  listen 443 ssl http2;
  server_name dashboard.aksesekolah.id;

  ssl_certificate /etc/letsencrypt/live/aksesekolah.id/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/aksesekolah.id/privkey.pem;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

Test and reload nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Step 4: Environment Variables

Update your `.env` file:

```bash
# Add dashboard URL
NEXT_PUBLIC_DASHBOARD_URL=https://dashboard.aksesekolah.id
```

### Step 5: Restart Application

```bash
# If using PM2
pm2 restart aksesekolah

# If using systemd
sudo systemctl restart aksesekolah

# Or just restart your Next.js app
```

---

## 🧪 Testing

### Test 1: Dashboard Subdomain Access

```bash
# Visit dashboard subdomain
https://dashboard.aksesekolah.id/signin

# Expected: Login page loads
```

### Test 2: Login Flow

```bash
# 1. Visit main domain login
https://aksesekolah.id/signin

# 2. Login with admin credentials
Username: admin
Password: admin123

# 3. Should redirect to:
https://dashboard.aksesekolah.id/dashboard/admin/overview

# Expected: Admin dashboard loads
```

### Test 3: Direct Dashboard Access (Should Redirect)

```bash
# Try to access dashboard from main domain
https://aksesekolah.id/dashboard/admin/overview

# Expected: Automatically redirects to
https://dashboard.aksesekolah.id/dashboard/admin/overview
```

---

## 🔍 Troubleshooting

### Issue 1: "Cannot connect to dashboard.aksesekolah.id"

**Solution:**
```bash
# Check DNS propagation
dig dashboard.aksesekolah.id

# Should return your server IP
```

### Issue 2: SSL Certificate Error

**Solution:**
```bash
# Check if certificate covers dashboard subdomain
sudo certbot certificates

# If not, generate new certificate
sudo certbot certonly --nginx -d dashboard.aksesekolah.id
```

### Issue 3: Login redirects but shows error

**Solution:**
```bash
# Check if NEXT_PUBLIC_DASHBOARD_URL is set
cat .env | grep DASHBOARD_URL

# Should show:
# NEXT_PUBLIC_DASHBOARD_URL=https://dashboard.aksesekolah.id

# If not, add it and restart app
```

### Issue 4: Cookie not shared between domains

**Solution:**
```bash
# Check cookie domain in browser DevTools
# Should be: .aksesekolah.id (with dot prefix)

# If not, check app/api/auth/login/route.ts
# Should have: domain: ".aksesekolah.id"
```

---

## ✅ Verification Checklist

- [ ] DNS: `dashboard.aksesekolah.id` resolves to server IP
- [ ] SSL: Certificate valid for `dashboard.aksesekolah.id`
- [ ] Nginx: Dashboard subdomain configured
- [ ] Environment: `NEXT_PUBLIC_DASHBOARD_URL` set
- [ ] App: Restarted after environment change
- [ ] Test: Can access `https://dashboard.aksesekolah.id/signin`
- [ ] Test: Login redirects to dashboard subdomain
- [ ] Test: Direct `/dashboard` access redirects to subdomain

---

## 📊 Expected Behavior

### ✅ Correct Flow

```
User visits: aksesekolah.id/signin
  ↓
Login: admin / admin123
  ↓
Redirects to: dashboard.aksesekolah.id/dashboard/admin/overview
  ↓
Shows: Admin dashboard
```

### ✅ Blocked Access (Auto-redirect)

```
User visits: aksesekolah.id/dashboard/admin/overview
  ↓
Proxy detects: Not dashboard subdomain
  ↓
Redirects to: dashboard.aksesekolah.id/dashboard/admin/overview
  ↓
Shows: Dashboard (if authenticated) or Login page
```

---

## 🎯 Summary

**What we implemented:**
1. ✅ Dashboard ONLY accessible via `dashboard.aksesekolah.id`
2. ✅ Direct `/dashboard` access auto-redirects to subdomain
3. ✅ Login flow redirects to dashboard subdomain
4. ✅ Cookies shared across subdomains

**What you need to do:**
1. ✅ DNS pointing (Already done!)
2. ⏳ SSL certificate (If not using wildcard)
3. ⏳ Nginx configuration
4. ⏳ Environment variable
5. ⏳ Restart app

**Time required:** ~5 minutes

---

**Ready to go live!** 🚀

