#!/bin/bash

# Setup Local Hosts for Development
# This script adds entries to /etc/hosts for local multi-tenant testing

echo "🔧 Setting up local hosts for multi-tenant development..."
echo ""

# Check if running with sudo
if [ "$EUID" -ne 0 ]; then 
  echo "❌ Please run with sudo:"
  echo "   sudo bash scripts/setup-local-hosts.sh"
  exit 1
fi

# Backup /etc/hosts
echo "📦 Creating backup of /etc/hosts..."
cp /etc/hosts /etc/hosts.backup.$(date +%Y%m%d_%H%M%S)

# Define hosts to add
HOSTS=(
  "aksesekolah.local"
  "dashboard.aksesekolah.local"
  "tenant1.aksesekolah.local"
  "syuhada.aksesekolah.local"
  "demo.aksesekolah.local"
)

echo ""
echo "➕ Adding hosts to /etc/hosts..."

for host in "${HOSTS[@]}"; do
  # Check if host already exists
  if grep -q "$host" /etc/hosts; then
    echo "   ⏭️  $host (already exists)"
  else
    echo "127.0.0.1 $host" >> /etc/hosts
    echo "   ✅ $host"
  fi
done

echo ""
echo "✨ Setup complete!"
echo ""
echo "You can now access:"
echo "  - http://aksesekolah.local:3000 (Platform WWW)"
echo "  - http://dashboard.aksesekolah.local:3000 (Unified Dashboard)"
echo "  - http://dashboard.aksesekolah.local:3000/admin (Platform Admin)"
echo "  - http://dashboard.aksesekolah.local:3000/tenant (Tenant Management)"
echo "  - http://tenant1.aksesekolah.local:3000 (Tenant 1 Public Site)"
echo "  - http://syuhada.aksesekolah.local:3000 (Tenant 2 Public Site)"
echo "  - http://demo.aksesekolah.local:3000 (Demo Tenant Public Site)"
echo ""
echo "To remove these entries later, run:"
echo "  sudo bash scripts/cleanup-local-hosts.sh"
echo ""
