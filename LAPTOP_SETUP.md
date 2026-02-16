# Setup Development di Laptop

## 📌 Pilih Guide Sesuai OS Anda

### Windows 10/11 ⭐
- **Quick Start (5 menit):** [QUICK_START_WINDOWS.md](./QUICK_START_WINDOWS.md)
- **Complete Guide:** [WINDOWS_SETUP.md](./WINDOWS_SETUP.md)

### macOS / Linux
- **Continue below** for macOS/Linux setup

---

## Quick Start (5 Menit) - macOS/Linux

### 1. Edit /etc/hosts (One Time)

Di laptop Axioo:
```bash
sudo nano /etc/hosts
```

Tambahkan di akhir file:
```
127.0.0.1 aksesekolah.local
127.0.0.1 dashboard.aksesekolah.local
127.0.0.1 tenant1.aksesekolah.local
```

Save: `Ctrl+X`, `Y`, `Enter`

### 2. Copy Script ke Laptop

Copy file `dev-tunnel.sh` ke laptop:
```bash
# Di laptop
scp dev@elearning.smauiiyk.sch.id:/home/dev/web/instances/clients/services/aksesekolah.id/dev-tunnel.sh ~/

# Make executable
chmod +x ~/dev-tunnel.sh
```

### 3. Start Development Container (Di Server)

Di Kiro IDE (yang sudah remote ke server):
```bash
cd /home/dev/web/instances/clients/services/aksesekolah.id
docker-compose -f docker-compose.dev.yml up -d
```

### 4. Start SSH Tunnel (Di Laptop)

Di laptop, terminal baru:
```bash
cd ~
./dev-tunnel.sh start
```

Keep terminal open!

### 5. Test Connection (Di Laptop)

Terminal baru:
```bash
./dev-tunnel.sh test
```

Should show: ✅ Connection successful!

### 6. Open Browser (Di Laptop)

```
http://dashboard.aksesekolah.local:3001/signin
```

## Daily Workflow

### Morning (Start Development)

**1. Di Kiro IDE (Server):**
```bash
cd /home/dev/web/instances/clients/services/aksesekolah.id
docker-compose -f docker-compose.dev.yml up -d
```

**2. Di Laptop (Terminal):**
```bash
~/dev-tunnel.sh start
```

**3. Di Laptop (Browser):**
```
http://dashboard.aksesekolah.local:3001/signin
```

### During Development

**Edit Code:**
- Edit di Kiro IDE (remote)
- Save file
- Browser auto-refresh
- See changes immediately

**Test Features:**
- Registration: `http://dashboard.aksesekolah.local:3001/signup`
- Login: `http://dashboard.aksesekolah.local:3001/signin`
- Dashboard: `http://dashboard.aksesekolah.local:3001/dashboard`

### Evening (Stop Development)

**1. Di Laptop:**
```bash
~/dev-tunnel.sh stop
```

**2. Di Kiro IDE (Optional):**
```bash
docker-compose -f docker-compose.dev.yml down
```

## Troubleshooting

### Issue: Cannot connect to server

```bash
# Test SSH connection
ssh dev@elearning.smauiiyk.sch.id

# If fails, check:
# - Internet connection
# - Server is running
# - SSH credentials
```

### Issue: Port already in use

```bash
# Find what's using port 3001
lsof -i :3001

# Kill process
kill -9 [PID]

# Or use different port
# Edit dev-tunnel.sh, change LOCAL_PORT=3002
```

### Issue: Domain not resolving

```bash
# Check /etc/hosts
cat /etc/hosts | grep aksesekolah

# Test DNS
ping dashboard.aksesekolah.local

# Should return: 127.0.0.1
```

### Issue: Tunnel disconnected

```bash
# Check status
~/dev-tunnel.sh status

# Restart
~/dev-tunnel.sh stop
~/dev-tunnel.sh start
```

### Issue: Container not running

```bash
# Check on server (via Kiro IDE)
docker ps | grep aksesekolah-app-dev

# If not running, start it
docker-compose -f docker-compose.dev.yml up -d
```

## Advanced: SSH Config (Optional)

Untuk kemudahan, edit `~/.ssh/config`:

```bash
nano ~/.ssh/config
```

Add:
```
Host awan-dev
    HostName elearning.smauiiyk.sch.id
    User dev
    LocalForward 3001 localhost:3001
    ServerAliveInterval 60
    ServerAliveCountMax 3
```

Kemudian cukup:
```bash
ssh awan-dev
```

Tunnel otomatis aktif!

## Tips & Tricks

### 1. Keep Tunnel Running in Background

```bash
# Start tunnel
~/dev-tunnel.sh start

# Press Ctrl+Z to suspend
# Then type:
bg

# Tunnel runs in background
```

### 2. Multiple Terminals

```
Terminal 1: SSH Tunnel (keep open)
Terminal 2: SSH to server (for commands)
Terminal 3: Local commands
Browser: Development testing
```

### 3. Quick Test

```bash
# One command to test everything
curl http://localhost:3001/api/health && \
curl http://dashboard.aksesekolah.local:3001/signin -I
```

### 4. Auto-start Tunnel (macOS/Linux)

Create alias in `~/.bashrc` or `~/.zshrc`:
```bash
alias dev-start='~/dev-tunnel.sh start'
alias dev-stop='~/dev-tunnel.sh stop'
alias dev-test='~/dev-tunnel.sh test'
```

Then:
```bash
dev-start
dev-test
dev-stop
```

## Summary

**Setup (One Time):**
1. ✅ Edit /etc/hosts
2. ✅ Copy dev-tunnel.sh
3. ✅ Make executable

**Daily Use:**
1. Start container (Kiro IDE)
2. Start tunnel (Laptop)
3. Open browser (Laptop)
4. Edit code (Kiro IDE)
5. Test (Browser)

**URLs:**
- Signin: `http://dashboard.aksesekolah.local:3001/signin`
- Signup: `http://dashboard.aksesekolah.local:3001/signup`
- Dashboard: `http://dashboard.aksesekolah.local:3001/dashboard`

**Commands:**
```bash
# Start
~/dev-tunnel.sh start

# Test
~/dev-tunnel.sh test

# Status
~/dev-tunnel.sh status

# Stop
~/dev-tunnel.sh stop
```

Simple dan efisien! 🚀
