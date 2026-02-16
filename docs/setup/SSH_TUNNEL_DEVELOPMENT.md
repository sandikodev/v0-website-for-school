# SSH Tunnel untuk Development - Remote Container Access

## Situasi

```
┌─────────────────┐         SSH          ┌─────────────────┐
│  Laptop Axioo   │ ◄─────────────────► │  Server Cloud   │
│  (Local)        │                      │  (Remote)       │
│                 │                      │                 │
│  Browser        │                      │  Docker         │
│  localhost:3001 │                      │  Container      │
│                 │                      │  Port 3001      │
└─────────────────┘                      └─────────────────┘
```

**Problem:**
- Kiro IDE berjalan di server cloud (remote SSH)
- Development container berjalan di server cloud
- Browser di laptop lokal tidak bisa akses container

**Solution:**
- SSH Port Forwarding (SSH Tunnel)
- Forward port 3001 dari server ke laptop
- Browser lokal bisa akses container remote

## SSH Port Forwarding Explained

### Local Port Forwarding
```bash
ssh -L [local_port]:[remote_host]:[remote_port] user@server
```

**Artinya:**
- Buat tunnel dari laptop ke server
- Port di laptop → Port di server
- Traffic ke localhost:local_port → diteruskan ke remote_host:remote_port

## Setup Step-by-Step

### 1. Start Development Container di Server

Di server (via Kiro IDE terminal):
```bash
cd /home/dev/web/instances/clients/services/aksesekolah.id

# Start development container
docker-compose -f docker-compose.dev.yml up -d

# Verify container running
docker ps | grep aksesekolah-app-dev

# Should show:
# clients-aksesekolah-app-dev   Up   0.0.0.0:3001->3000/tcp
```

### 2. Create SSH Tunnel dari Laptop

Di laptop Axioo (terminal baru):
```bash
# Basic tunnel
ssh -L 3001:localhost:3001 dev@elearning.smauiiyk.sch.id

# Atau dengan options lengkap
ssh -L 3001:localhost:3001 \
    -N \
    -f \
    dev@elearning.smauiiyk.sch.id
```

**Options:**
- `-L 3001:localhost:3001` - Forward port 3001
- `-N` - No command execution (hanya tunnel)
- `-f` - Background process
- `-v` - Verbose (untuk debugging)

### 3. Verify Tunnel Active

Di laptop:
```bash
# Check tunnel process
ps aux | grep "ssh -L"

# Test connection
curl http://localhost:3001/api/health

# Should return: {"status":"ok"}
```

### 4. Access dari Browser

Di laptop, buka browser:
```
http://localhost:3001
```

**Tapi ingat:** Aplikasi multi-tenant butuh hostname!

## Multi-Tenant dengan SSH Tunnel

### Problem: Hostname Detection

Aplikasi detect tenant dari hostname:
```typescript
const hostname = request.nextUrl.hostname;
// localhost → tidak bisa detect tenant
```

### Solution 1: Edit /etc/hosts di Laptop

Di laptop Axioo:
```bash
sudo nano /etc/hosts

# Add:
127.0.0.1 aksesekolah.local
127.0.0.1 dashboard.aksesekolah.local
127.0.0.1 tenant1.aksesekolah.local
```

Kemudian akses:
```
http://dashboard.aksesekolah.local:3001/signin
```

### Solution 2: Browser Extension (ModHeader)

Install extension untuk modify request headers:
- Chrome: ModHeader
- Firefox: Modify Header Value

Set header:
```
Host: dashboard.aksesekolah.local
```

### Solution 3: Local Nginx Proxy (Advanced)

Setup nginx di laptop untuk proxy dengan hostname:

```nginx
# /etc/nginx/sites-available/aksesekolah-dev

server {
    listen 80;
    server_name dashboard.aksesekolah.local;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Akses: `http://dashboard.aksesekolah.local`

## Complete Workflow

### Daily Development:

**1. Di Server (via Kiro IDE):**
```bash
# Start dev container
cd /home/dev/web/instances/clients/services/aksesekolah.id
docker-compose -f docker-compose.dev.yml up -d

# Edit code di Kiro IDE
# Hot reload otomatis
```

**2. Di Laptop (terminal):**
```bash
# Create SSH tunnel
ssh -L 3001:localhost:3001 -N dev@elearning.smauiiyk.sch.id

# Keep terminal open (atau gunakan -f untuk background)
```

**3. Di Laptop (browser):**
```bash
# Edit /etc/hosts dulu (one time)
sudo nano /etc/hosts
# Add: 127.0.0.1 dashboard.aksesekolah.local

# Open browser
open http://dashboard.aksesekolah.local:3001/signin
```

**4. Development Loop:**
```
Edit code di Kiro IDE → Save → Browser auto refresh → See changes
```

## Advanced: Multiple Ports

Forward multiple ports sekaligus:

```bash
ssh -L 3001:localhost:3001 \
    -L 5432:localhost:5432 \
    -L 6379:localhost:6379 \
    dev@elearning.smauiiyk.sch.id
```

**Use cases:**
- 3001: Next.js dev server
- 5432: PostgreSQL database
- 6379: Redis cache

## SSH Config untuk Kemudahan

Edit `~/.ssh/config` di laptop:

```bash
nano ~/.ssh/config
```

Add:
```
Host awan-dev
    HostName elearning.smauiiyk.sch.id
    User dev
    LocalForward 3001 localhost:3001
    LocalForward 5432 localhost:5432
    ServerAliveInterval 60
    ServerAliveCountMax 3
```

Kemudian cukup:
```bash
ssh awan-dev
```

Tunnel otomatis aktif!

## Troubleshooting

### Issue 1: Port Already in Use

```bash
# Error: bind: Address already in use
```

**Fix:**
```bash
# Find process using port
lsof -i :3001

# Kill process
kill -9 [PID]

# Or use different port
ssh -L 3002:localhost:3001 dev@server
```

### Issue 2: Tunnel Disconnected

```bash
# Tunnel mati setelah beberapa waktu
```

**Fix:**
```bash
# Use ServerAliveInterval
ssh -L 3001:localhost:3001 \
    -o ServerAliveInterval=60 \
    -o ServerAliveCountMax=3 \
    dev@server
```

### Issue 3: Cannot Access via Domain

```bash
# http://dashboard.aksesekolah.local:3001 tidak bisa diakses
```

**Fix:**
```bash
# Check /etc/hosts
cat /etc/hosts | grep aksesekolah

# Test DNS resolution
ping dashboard.aksesekolah.local

# Should return: 127.0.0.1
```

### Issue 4: Slow Connection

```bash
# Tunnel lambat
```

**Fix:**
```bash
# Use compression
ssh -L 3001:localhost:3001 -C dev@server

# Or check network
ping elearning.smauiiyk.sch.id
```

## Alternative: VS Code Remote SSH

Jika menggunakan VS Code:

1. Install "Remote - SSH" extension
2. Connect to server
3. VS Code otomatis forward ports
4. Akses via localhost:3001

## Alternative: Cloudflare Tunnel (Advanced)

Untuk akses dari mana saja tanpa SSH:

```bash
# Di server
cloudflared tunnel --url http://localhost:3001

# Output:
# https://random-name.trycloudflare.com
```

Akses dari browser mana saja!

## Security Considerations

### ✅ Aman:
- SSH tunnel encrypted
- Hanya localhost yang bisa akses
- Tidak expose ke internet

### ⚠️ Perhatian:
- Jangan share tunnel URL
- Gunakan SSH key authentication
- Set firewall rules di server

## Quick Reference

### Start Development

**Server:**
```bash
docker-compose -f docker-compose.dev.yml up -d
```

**Laptop:**
```bash
# Terminal 1: SSH Tunnel
ssh -L 3001:localhost:3001 dev@elearning.smauiiyk.sch.id

# Terminal 2: Test
curl http://localhost:3001/api/health

# Browser
open http://dashboard.aksesekolah.local:3001/signin
```

### Stop Development

**Laptop:**
```bash
# Kill SSH tunnel
pkill -f "ssh -L 3001"
```

**Server:**
```bash
docker-compose -f docker-compose.dev.yml down
```

## Recommended Setup

### One-Time Setup (Laptop):

```bash
# 1. Edit /etc/hosts
sudo nano /etc/hosts
# Add:
127.0.0.1 aksesekolah.local
127.0.0.1 dashboard.aksesekolah.local
127.0.0.1 tenant1.aksesekolah.local

# 2. Setup SSH config
nano ~/.ssh/config
# Add:
Host awan-dev
    HostName elearning.smauiiyk.sch.id
    User dev
    LocalForward 3001 localhost:3001
    ServerAliveInterval 60
```

### Daily Workflow:

```bash
# 1. Start tunnel (laptop)
ssh awan-dev

# 2. Start dev container (server, via Kiro IDE)
docker-compose -f docker-compose.dev.yml up -d

# 3. Open browser (laptop)
open http://dashboard.aksesekolah.local:3001/signin

# 4. Edit code di Kiro IDE
# 5. See changes in browser immediately
```

## Comparison: Local vs Remote Development

### Local Development (Laptop)
```
✅ Fast (no network latency)
✅ Works offline
❌ Need powerful laptop
❌ Setup dependencies locally
```

### Remote Development (SSH Tunnel)
```
✅ Use server resources
✅ Consistent environment
✅ Access from anywhere
❌ Need internet connection
❌ Network latency
```

### Remote Development (SSH Tunnel) - Your Case
```
✅ Server sudah setup (Awan Kinton)
✅ Kiro IDE sudah remote
✅ Docker sudah running
✅ Tinggal forward port
✅ Edit code di Kiro IDE
✅ Test di browser laptop
✅ Perfect workflow!
```

## Summary

**Untuk situasi Anda:**

1. **Kiro IDE** → Sudah remote SSH ke server ✅
2. **Development Container** → Running di server ✅
3. **SSH Tunnel** → Forward port 3001 ke laptop ✅
4. **Browser** → Akses via localhost:3001 atau domain lokal ✅

**Command:**
```bash
# Di laptop
ssh -L 3001:localhost:3001 dev@elearning.smauiiyk.sch.id

# Browser
http://dashboard.aksesekolah.local:3001/signin
```

**Tidak butuh nginx** untuk development, cukup SSH tunnel!

Workflow ini sangat efisien karena:
- Edit code di Kiro IDE (remote)
- Hot reload otomatis
- Test di browser laptop (via tunnel)
- Semua resource di server
- Laptop hanya butuh browser + SSH
