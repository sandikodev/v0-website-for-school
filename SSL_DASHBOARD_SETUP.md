# SSL Certificate Setup for dashboard.aksesekolah.id

## 🔐 DNS Challenge Method

Karena kita menggunakan nginx-proxy docker (bukan nginx system service), kita harus pakai DNS challenge untuk expand certificate.

## 📋 Step-by-Step Guide

### Step 1: Run Certbot with DNS Challenge

```bash
sudo certbot certonly \
  --manual \
  --preferred-challenges dns \
  --cert-name aksesekolah \
  --expand \
  -d aksesekolah.id \
  -d www.aksesekolah.id \
  -d dashboard.aksesekolah.id \
  --email system@aksesekolah.id \
  --agree-tos \
  --no-eff-email
```

### Step 2: Add DNS TXT Record

Certbot akan memberikan challenge seperti ini:

```
Please deploy a DNS TXT record under the name:
_acme-challenge.dashboard.aksesekolah.id.

with the following value:
zcbTxLtCZluqZ7b4UHBQ8pLAhf0pEkMBYSm4gPjIhMY
```

**Tambahkan TXT record di DNS provider:**

| Type | Name | Value | TTL |
|------|------|-------|-----|
| TXT | `_acme-challenge.dashboard` | `zcbTxLtCZluqZ7b4UHBQ8pLAhf0pEkMBYSm4gPjIhMY` | 300 |

**Catatan:** Value akan berbeda setiap kali run certbot!

### Step 3: Verify DNS Propagation

Tunggu 1-5 menit, lalu verify:

```bash
# Check DNS TXT record
dig _acme-challenge.dashboard.aksesekolah.id TXT

# Or use online tool
# https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.dashboard.aksesekolah.id
```

**Expected output:**
```
;; ANSWER SECTION:
_acme-challenge.dashboard.aksesekolah.id. 300 IN TXT "zcbTxLtCZluqZ7b4UHBQ8pLAhf0pEkMBYSm4gPjIhMY"
```

### Step 4: Continue Certbot

Setelah DNS record terverifikasi, press **Enter** di certbot untuk continue.

Certbot akan:
1. Verify DNS challenge
2. Generate certificate
3. Save to `/etc/letsencrypt/live/aksesekolah/`

### Step 5: Verify Certificate

```bash
# Check certificate domains
sudo certbot certificates

# Expected output:
# Certificate Name: aksesekolah
#   Domains: aksesekolah.id www.aksesekolah.id dashboard.aksesekolah.id
#   Expiry Date: ...
#   Certificate Path: /etc/letsencrypt/live/aksesekolah/fullchain.pem
#   Private Key Path: /etc/letsencrypt/live/aksesekolah/privkey.pem
```

### Step 6: Reload Nginx

```bash
# Test nginx config
docker exec nginx-proxy nginx -t

# Reload nginx
docker exec nginx-proxy nginx -s reload
```

### Step 7: Test Dashboard

```bash
# Test HTTPS
curl -I https://dashboard.aksesekolah.id

# Expected:
# HTTP/2 200
# server: nginx
# ...
```

## 🔄 Alternative: Webroot Method (If DNS Not Available)

Jika tidak bisa akses DNS provider, gunakan webroot method:

### Prerequisites

1. Pastikan nginx config sudah ada `.well-known/acme-challenge/` location
2. Pastikan `/var/www/certbot` mounted di nginx-proxy

### Check Nginx Config

```bash
# Check if acme-challenge location exists
docker exec nginx-proxy cat /etc/nginx/conf.d/clients/aksesekolah.conf | grep -A 3 "well-known"
```

Should have:
```nginx
location /.well-known/acme-challenge/ {
    root /var/www/certbot;
    try_files $uri =404;
}
```

### Run Certbot with Webroot

```bash
sudo certbot certonly \
  --webroot \
  --webroot-path /var/www/certbot \
  --cert-name aksesekolah \
  --expand \
  -d aksesekolah.id \
  -d www.aksesekolah.id \
  -d dashboard.aksesekolah.id \
  --email system@aksesekolah.id \
  --agree-tos \
  --no-eff-email
```

**Note:** Webroot method requires:
- Port 80 accessible
- Nginx serving `.well-known/acme-challenge/`
- DNS already pointing to server

## 🚨 Troubleshooting

### Error: "Address already in use"

**Problem:** Certbot nginx plugin tries to restart system nginx, but we use docker.

**Solution:** Use `--manual` with DNS challenge or `--webroot` method.

### Error: "can't set attribute"

**Problem:** Certbot version issue or permission problem.

**Solution:** 
```bash
# Update certbot
sudo apt update
sudo apt install --only-upgrade certbot

# Or use snap version
sudo snap install --classic certbot
```

### DNS Record Not Propagating

**Problem:** DNS changes take time to propagate.

**Solution:**
```bash
# Wait 5 minutes
sleep 300

# Check again
dig _acme-challenge.dashboard.aksesekolah.id TXT

# Use different DNS server
dig @8.8.8.8 _acme-challenge.dashboard.aksesekolah.id TXT
```

### Certificate Not Applied

**Problem:** Nginx not reloaded or config error.

**Solution:**
```bash
# Test config
docker exec nginx-proxy nginx -t

# Check certificate path
ls -la /etc/letsencrypt/live/aksesekolah/

# Reload nginx
docker exec nginx-proxy nginx -s reload

# Restart nginx (last resort)
docker restart nginx-proxy
```

## 📝 Complete Workflow

```bash
# 1. Start certbot
sudo certbot certonly --manual --preferred-challenges dns \
  --cert-name aksesekolah --expand \
  -d aksesekolah.id -d www.aksesekolah.id -d dashboard.aksesekolah.id

# 2. Add DNS TXT record (from certbot output)
# Login to DNS provider and add the TXT record

# 3. Wait for DNS propagation
sleep 300

# 4. Verify DNS
dig _acme-challenge.dashboard.aksesekolah.id TXT

# 5. Press Enter in certbot to continue

# 6. Verify certificate
sudo certbot certificates

# 7. Reload nginx
docker exec nginx-proxy nginx -s reload

# 8. Test
curl -I https://dashboard.aksesekolah.id
```

## ✅ Success Checklist

- [ ] Certbot command executed
- [ ] DNS TXT record added
- [ ] DNS propagation verified
- [ ] Certbot completed successfully
- [ ] Certificate includes dashboard.aksesekolah.id
- [ ] Nginx reloaded
- [ ] HTTPS works for dashboard.aksesekolah.id
- [ ] Browser shows valid certificate

## 🔐 Certificate Auto-Renewal

Certbot auto-renewal will handle all domains:

```bash
# Test renewal
sudo certbot renew --dry-run

# Check renewal timer
sudo systemctl status certbot.timer

# Manual renewal (if needed)
sudo certbot renew
```

## 📚 Related Documentation

- [DASHBOARD_SETUP.md](./DASHBOARD_SETUP.md) - Complete dashboard setup
- [NGINX_CONFIG_SYNC.md](./NGINX_CONFIG_SYNC.md) - Nginx config management
- [SSL_SETUP.md](../../SSL_SETUP.md) - General SSL setup

---

**Last Updated:** 2025-11-28  
**Status:** Ready to execute

