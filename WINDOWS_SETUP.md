# Setup Development di Windows 10/11

## Quick Start (5 Menit)

### 1. Edit hosts File (One Time)

**Windows 10/11:**

1. Buka **Notepad sebagai Administrator**:
   - Tekan `Win + S`
   - Ketik "notepad"
   - Klik kanan "Notepad"
   - Pilih "Run as administrator"

2. Buka file hosts:
   - File → Open
   - Navigate ke: `C:\Windows\System32\drivers\etc\`
   - Ubah filter dari "Text Documents" ke "All Files"
   - Pilih file `hosts`

3. Tambahkan di akhir file:
```
127.0.0.1 aksesekolah.local
127.0.0.1 dashboard.aksesekolah.local
127.0.0.1 tenant1.aksesekolah.local
```

4. Save: `Ctrl+S`

### 2. Install SSH Client (Jika Belum Ada)

**Windows 10/11 sudah include OpenSSH Client!**

Verify:
```powershell
# Buka PowerShell
ssh -V
```

Jika belum ada, install via Settings:
- Settings → Apps → Optional Features
- Add a feature → OpenSSH Client → Install

### 3. Create SSH Tunnel Script

Buat file `dev-tunnel.bat` di Desktop atau folder pilihan Anda:

**File: `dev-tunnel.bat`**
```batch
@echo off
REM ============================================
REM AkseSekolah.id - Development SSH Tunnel
REM ============================================

set SERVER=elearning.smauiiyk.sch.id
set USER=dev
set LOCAL_PORT=3001
set REMOTE_PORT=3001

if "%1"=="start" goto start
if "%1"=="stop" goto stop
if "%1"=="status" goto status
if "%1"=="test" goto test
goto help

:start
echo.
echo Starting SSH Tunnel...
echo Server: %USER%@%SERVER%
echo Local Port: %LOCAL_PORT%
echo Remote Port: %REMOTE_PORT%
echo.
echo Keep this window open!
echo Press Ctrl+C to stop tunnel
echo.
ssh -L %LOCAL_PORT%:localhost:%REMOTE_PORT% -N -o ServerAliveInterval=60 %USER%@%SERVER%
goto end

:stop
echo.
echo Stopping SSH Tunnel...
taskkill /F /IM ssh.exe
echo Tunnel stopped
goto end

:status
echo.
echo Checking tunnel status...
tasklist /FI "IMAGENAME eq ssh.exe" | find "ssh.exe"
if errorlevel 1 (
    echo Tunnel is NOT running
) else (
    echo Tunnel is running
)
goto end

:test
echo.
echo Testing connection...
curl -s http://localhost:%LOCAL_PORT%/api/health
if errorlevel 1 (
    echo Connection FAILED
    echo Make sure tunnel is running and dev container is up
) else (
    echo.
    echo Connection SUCCESS!
    echo.
    echo Access URLs:
    echo   http://dashboard.aksesekolah.local:%LOCAL_PORT%/signin
    echo   http://dashboard.aksesekolah.local:%LOCAL_PORT%/signup
)
goto end

:help
echo.
echo Usage: dev-tunnel.bat [command]
echo.
echo Commands:
echo   start   - Start SSH tunnel
echo   stop    - Stop SSH tunnel
echo   status  - Check tunnel status
echo   test    - Test connection
echo.
echo Example:
echo   dev-tunnel.bat start
echo   dev-tunnel.bat test
echo   dev-tunnel.bat stop
echo.
goto end

:end
```

### 4. Start Development Container (Di Server)

Di Kiro IDE (yang sudah remote ke server):
```bash
cd /home/dev/web/instances/clients/services/aksesekolah.id
docker-compose -f docker-compose.dev.yml up -d
```

### 5. Start SSH Tunnel (Di Windows)

**Option A: Command Prompt**
```cmd
cd Desktop
dev-tunnel.bat start
```

**Option B: PowerShell**
```powershell
cd Desktop
.\dev-tunnel.bat start
```

**Option C: Double-click**
- Double-click `dev-tunnel.bat`
- Pilih "start" saat diminta

Keep window open!

### 6. Test Connection (Windows Terminal Baru)

```cmd
dev-tunnel.bat test
```

Should show: Connection SUCCESS!

### 7. Open Browser (Di Windows)

```
http://dashboard.aksesekolah.local:3001/signin
```

## Alternative: PowerShell Script

Jika prefer PowerShell, buat `dev-tunnel.ps1`:

```powershell
# ============================================
# AkseSekolah.id - Development SSH Tunnel
# ============================================

param(
    [Parameter(Position=0)]
    [ValidateSet('start','stop','status','test')]
    [string]$Command = 'help'
)

$SERVER = "elearning.smauiiyk.sch.id"
$USER = "dev"
$LOCAL_PORT = 3001
$REMOTE_PORT = 3001

switch ($Command) {
    'start' {
        Write-Host "`n🚇 Starting SSH Tunnel..." -ForegroundColor Blue
        Write-Host "Server: $USER@$SERVER" -ForegroundColor Green
        Write-Host "Local Port: $LOCAL_PORT" -ForegroundColor Green
        Write-Host "Remote Port: $REMOTE_PORT" -ForegroundColor Green
        Write-Host "`nKeep this window open!" -ForegroundColor Yellow
        Write-Host "Press Ctrl+C to stop tunnel`n" -ForegroundColor Yellow
        
        ssh -L ${LOCAL_PORT}:localhost:${REMOTE_PORT} -N -o ServerAliveInterval=60 ${USER}@${SERVER}
    }
    
    'stop' {
        Write-Host "`n🛑 Stopping SSH Tunnel..." -ForegroundColor Blue
        Get-Process ssh -ErrorAction SilentlyContinue | Stop-Process -Force
        Write-Host "✅ Tunnel stopped" -ForegroundColor Green
    }
    
    'status' {
        Write-Host "`n📊 Tunnel Status" -ForegroundColor Blue
        $process = Get-Process ssh -ErrorAction SilentlyContinue
        if ($process) {
            Write-Host "✅ Tunnel is running" -ForegroundColor Green
            $process | Format-Table Id, ProcessName, StartTime
        } else {
            Write-Host "❌ Tunnel is not running" -ForegroundColor Red
        }
    }
    
    'test' {
        Write-Host "`n🧪 Testing Connection..." -ForegroundColor Blue
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:$LOCAL_PORT/api/health" -UseBasicParsing
            Write-Host "✅ Connection successful!" -ForegroundColor Green
            Write-Host "`n🌐 Access URLs:" -ForegroundColor Blue
            Write-Host "  http://dashboard.aksesekolah.local:$LOCAL_PORT/signin" -ForegroundColor Cyan
            Write-Host "  http://dashboard.aksesekolah.local:$LOCAL_PORT/signup" -ForegroundColor Cyan
        } catch {
            Write-Host "❌ Connection failed!" -ForegroundColor Red
            Write-Host "Make sure tunnel is running and dev container is up" -ForegroundColor Yellow
        }
    }
    
    default {
        Write-Host "`n╔════════════════════════════════════════╗" -ForegroundColor Blue
        Write-Host "║  AkseSekolah.id Development Tunnel    ║" -ForegroundColor Blue
        Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Blue
        Write-Host "`nUsage: .\dev-tunnel.ps1 [command]"
        Write-Host "`nCommands:"
        Write-Host "  start   - Start SSH tunnel"
        Write-Host "  stop    - Stop SSH tunnel"
        Write-Host "  status  - Check tunnel status"
        Write-Host "  test    - Test connection"
        Write-Host "`nExample:"
        Write-Host "  .\dev-tunnel.ps1 start"
        Write-Host "  .\dev-tunnel.ps1 test"
        Write-Host "  .\dev-tunnel.ps1 stop`n"
    }
}
```

Run:
```powershell
# Allow script execution (one time)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Run script
.\dev-tunnel.ps1 start
```

## Daily Workflow

### Morning (Start Development)

**1. Di Kiro IDE (Server):**
```bash
cd /home/dev/web/instances/clients/services/aksesekolah.id
docker-compose -f docker-compose.dev.yml up -d
```

**2. Di Windows (Command Prompt/PowerShell):**
```cmd
dev-tunnel.bat start
```
atau
```powershell
.\dev-tunnel.ps1 start
```

**3. Di Windows (Browser):**
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

**1. Di Windows:**
```cmd
dev-tunnel.bat stop
```
atau tekan `Ctrl+C` di window tunnel

**2. Di Kiro IDE (Optional):**
```bash
docker-compose -f docker-compose.dev.yml down
```

## Windows-Specific Tips

### 1. Windows Terminal (Recommended)

Install Windows Terminal dari Microsoft Store:
- Modern terminal
- Multiple tabs
- Better colors
- Copy/paste support

### 2. SSH Key Setup (Optional)

Generate SSH key untuk auto-login:

```powershell
# Generate key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy to server
type $env:USERPROFILE\.ssh\id_ed25519.pub | ssh dev@elearning.smauiiyk.sch.id "cat >> ~/.ssh/authorized_keys"
```

### 3. Create Desktop Shortcut

1. Right-click Desktop → New → Shortcut
2. Location: `C:\Windows\System32\cmd.exe /k "cd /d C:\path\to\script && dev-tunnel.bat start"`
3. Name: "Dev Tunnel"
4. Change icon (optional)

Double-click to start tunnel!

### 4. Auto-start on Login (Advanced)

Create scheduled task:
1. Task Scheduler → Create Basic Task
2. Trigger: At log on
3. Action: Start program
4. Program: `cmd.exe`
5. Arguments: `/c "C:\path\to\dev-tunnel.bat start"`

### 5. Use WSL2 (Alternative)

Jika sudah install WSL2 (Ubuntu):

```bash
# Di WSL2
sudo nano /etc/hosts
# Add: 127.0.0.1 dashboard.aksesekolah.local

# Start tunnel
ssh -L 3001:localhost:3001 -N dev@elearning.smauiiyk.sch.id
```

Browser Windows bisa akses `http://dashboard.aksesekolah.local:3001`

## Troubleshooting

### Issue: "ssh is not recognized"

**Fix:**
```powershell
# Check if OpenSSH is installed
Get-WindowsCapability -Online | Where-Object Name -like 'OpenSSH*'

# Install if needed
Add-WindowsCapability -Online -Name OpenSSH.Client~~~~0.0.1.0
```

### Issue: Cannot edit hosts file

**Fix:**
- Make sure Notepad is running as Administrator
- Disable antivirus temporarily
- Check file permissions

### Issue: Port already in use

**Fix:**
```cmd
# Find process using port
netstat -ano | findstr :3001

# Kill process
taskkill /PID [PID] /F
```

### Issue: Domain not resolving

**Fix:**
```cmd
# Flush DNS cache
ipconfig /flushdns

# Test
ping dashboard.aksesekolah.local
```

### Issue: Firewall blocking

**Fix:**
- Windows Defender Firewall → Allow an app
- Add ssh.exe
- Allow private and public networks

### Issue: Connection timeout

**Fix:**
```cmd
# Test SSH connection first
ssh dev@elearning.smauiiyk.sch.id

# If works, then start tunnel
dev-tunnel.bat start
```

## Browser Testing

### Recommended Browsers:
- ✅ Chrome/Edge (Best compatibility)
- ✅ Firefox
- ⚠️ Internet Explorer (Not recommended)

### Browser DevTools:
- Press `F12` to open DevTools
- Network tab to see requests
- Console tab to see errors
- Application tab to see cookies

## Summary

**Setup (One Time):**
1. ✅ Edit `C:\Windows\System32\drivers\etc\hosts`
2. ✅ Create `dev-tunnel.bat` or `dev-tunnel.ps1`
3. ✅ Verify SSH client installed

**Daily Use:**
1. Start container (Kiro IDE)
2. Start tunnel (Windows: `dev-tunnel.bat start`)
3. Open browser (Windows)
4. Edit code (Kiro IDE)
5. Test (Browser)

**URLs:**
- Signin: `http://dashboard.aksesekolah.local:3001/signin`
- Signup: `http://dashboard.aksesekolah.local:3001/signup`
- Dashboard: `http://dashboard.aksesekolah.local:3001/dashboard`

**Commands:**
```cmd
REM Batch script
dev-tunnel.bat start
dev-tunnel.bat test
dev-tunnel.bat status
dev-tunnel.bat stop
```

```powershell
# PowerShell script
.\dev-tunnel.ps1 start
.\dev-tunnel.ps1 test
.\dev-tunnel.ps1 status
.\dev-tunnel.ps1 stop
```

Simple dan works di Windows! 🚀
