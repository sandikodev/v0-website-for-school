#!/bin/sh

# Development startup script for School Website
# Detects package manager and runs appropriate dev command

set -e

echo "🚀 Starting School Website Development Server..."

# Check for package manager lockfiles
if [ -f yarn.lock ]; then
    echo "📦 Detected Yarn - Starting with yarn dev"
    exec yarn dev
elif [ -f package-lock.json ]; then
    echo "📦 Detected npm - Starting with npm run dev"
    exec npm run dev
elif [ -f pnpm-lock.yaml ]; then
    echo "📦 Detected pnpm - Starting with pnpm run dev"
    exec pnpm run dev
else
    echo "❌ Error: No package manager lockfile found!"
    echo "Expected one of: yarn.lock, package-lock.json, or pnpm-lock.yaml"
    exit 1
fi
