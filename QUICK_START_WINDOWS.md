# 🚀 Quick Start - Windows 10/11

## 1️⃣ Edit Hosts File (One Time - 2 menit)

1. Buka **Notepad as Administrator**
   - Tekan `Win + S`
   - Ketik "notepad"
   - Klik kanan → "Run as administrator"

2. Open file:
   - File → Open
   - Navigate: `C:\Windows\System32\drivers\etc\`
   - Filter: "All Files"
   - Open: `hosts`

3. Add at the end:
```
127.0.0.1 dashboard.aksesekolah.local
```

4. Save: `Ctrl+S`

## 2️⃣ Create Tunnel Script (One Time - 1 menit)

Create file `dev-tunnel.bat` di Desktop:

```batch
@echo off
echo Starting SSH Tunnel...
echo Keep this window open!
echo.
ssh -L 3001:localhost:3001 -N dev@elearning.smauiiyk.sch.id
```

## 3️⃣ Daily Usage

### Start Development:

**Terminal 1 (Kiro IDE - Server):**
```bash
cd /home/dev/web/instances/clients/services/aksesekolah.id
docker-compose -f docker-compose.dev.yml up -d
```

**Terminal 2 (Windows - Laptop):**
```cmd
cd Desktop
dev-tunnel.bat
```
Keep window open!

**Browser (Windows - Laptop):**
```
http://dashboard.aksesekolah.local:3001/signin
```

### Stop Development:

**Windows:** Press `Ctrl+C` in tunnel window

**Kiro IDE (optional):**
```bash
docker-compose -f docker-compose.dev.yml down
```

## 🎯 URLs

- Signin: `http://dashboard.aksesekolah.local:3001/signin`
- Signup: `http://dashboard.aksesekolah.local:3001/signup`
- Dashboard: `http://dashboard.aksesekolah.local:3001/dashboard`

## ⚡ Troubleshooting

### "ssh is not recognized"
```powershell
# Install OpenSSH Client
Add-WindowsCapability -Online -Name OpenSSH.Client~~~~0.0.1.0
```

### Cannot edit hosts file
- Run Notepad as Administrator
- Disable antivirus temporarily

### Port already in use
```cmd
netstat -ano | findstr :3001
taskkill /PID [PID] /F
```

### Domain not resolving
```cmd
ipconfig /flushdns
ping dashboard.aksesekolah.local
```

## 📚 Full Documentation

- Complete guide: [WINDOWS_SETUP.md](./WINDOWS_SETUP.md)
- SSH tunnel details: [docs/SSH_TUNNEL_DEVELOPMENT.md](./docs/SSH_TUNNEL_DEVELOPMENT.md)

---

**That's it!** Edit code di Kiro IDE, test di browser Windows. 🎉
