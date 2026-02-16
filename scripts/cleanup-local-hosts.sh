#!/bin/bash

# Cleanup Local Hosts
# This script removes development entries from /etc/hosts

echo "🧹 Cleaning up local hosts..."
echo ""

# Check if running with sudo
if [ "$EUID" -ne 0 ]; then 
  echo "❌ Please run with sudo:"
  echo "   sudo bash scripts/cleanup-local-hosts.sh"
  exit 1
fi

# Backup /etc/hosts
echo "📦 Creating backup of /etc/hosts..."
cp /etc/hosts /etc/hosts.backup.$(date +%Y%m%d_%H%M%S)

# Define hosts to remove
HOSTS=(
  "aksesekolah.local"
  "dashboard.aksesekolah.local"
  "tenant1.aksesekolah.local"
  "syuhada.aksesekolah.local"
  "demo.aksesekolah.local"
)

echo ""
echo "➖ Removing hosts from /etc/hosts..."

for host in "${HOSTS[@]}"; do
  if grep -q "$host" /etc/hosts; then
    # Remove the line containing the host
    sed -i.bak "/$host/d" /etc/hosts
    echo "   ✅ Removed $host"
  else
    echo "   ⏭️  $host (not found)"
  fi
done

echo ""
echo "✨ Cleanup complete!"
echo ""
echo "To restore from backup, run:"
echo "  sudo cp /etc/hosts.backup.YYYYMMDD_HHMMSS /etc/hosts"
echo ""
