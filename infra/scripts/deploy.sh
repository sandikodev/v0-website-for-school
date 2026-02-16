#!/bin/bash
# ============================================
# AkseSekolah.id Deployment Script
# ============================================
#
# Usage:
#   ./deploy.sh dev      # Development
#   ./deploy.sh preview  # Preview/Staging
#   ./deploy.sh prod     # Production

set -e

ENVIRONMENT=${1:-prod}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "═══════════════════════════════════════════════════════════"
echo "  AkseSekolah.id Deployment"
echo "  Environment: $ENVIRONMENT"
echo "═══════════════════════════════════════════════════════════"
echo ""

cd "$SCRIPT_DIR"

# Validate environment
case $ENVIRONMENT in
  dev|development)
    COMPOSE_FILE="docker-compose.dev.yml"
    CONTAINER_NAME="clients-aksesekolah-app-dev"
    ;;
  preview|staging)
    COMPOSE_FILE="docker-compose.preview.yml"
    CONTAINER_NAME="clients-aksesekolah-app-preview"
    ;;
  prod|production)
    COMPOSE_FILE="docker-compose.yml"
    CONTAINER_NAME="clients-aksesekolah-app"
    ;;
  *)
    echo "❌ Invalid environment: $ENVIRONMENT"
    echo "   Valid options: dev, preview, prod"
    exit 1
    ;;
esac

echo "📋 Configuration:"
echo "   Compose file: $COMPOSE_FILE"
echo "   Container: $CONTAINER_NAME"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "   Creating from .env.example..."
    cp .env.example .env
    echo "   ✅ Please edit .env with your configuration"
    echo ""
fi

# Note: Git pull disabled for solo dev workflow
# Uncomment below if working in team with git workflow
# if [ -d .git ]; then
#     echo "📥 Pulling latest code..."
#     git pull
#     echo ""
# fi

# Build image
echo "🔨 Building Docker image..."
docker compose -f "$COMPOSE_FILE" build --no-cache
echo ""

# Stop existing container
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "🛑 Stopping existing container..."
    docker compose -f "$COMPOSE_FILE" down
    echo ""
fi

# Start new container
echo "🚀 Starting container..."
docker compose -f "$COMPOSE_FILE" up -d
echo ""

# Wait for container to be healthy
echo "⏳ Waiting for container to be ready..."
sleep 5

# Check container status
if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "✅ Container is running!"
    echo ""
    
    # Show logs
    echo "📋 Recent logs:"
    docker logs "$CONTAINER_NAME" --tail 20
    echo ""
    
    # Show container info
    echo "ℹ️  Container info:"
    docker ps --filter "name=$CONTAINER_NAME" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    echo ""
    
    # Reload nginx if production
    if [ "$ENVIRONMENT" = "prod" ] || [ "$ENVIRONMENT" = "production" ]; then
        echo "♻️  Reloading nginx..."
        docker exec nginx-proxy nginx -s reload 2>/dev/null || echo "⚠️  Could not reload nginx (container not found)"
        echo ""
    fi
    
    echo "✅ Deployment complete!"
    echo ""
    
    # Show access URLs
    case $ENVIRONMENT in
      dev|development)
        echo "🌐 Access URLs:"
        echo "   http://localhost:3000"
        echo "   http://aksesekolah.local:3000"
        ;;
      preview|staging)
        echo "🌐 Access URL:"
        echo "   http://aksesekolah.preview"
        echo ""
        echo "⚠️  Add to /etc/hosts:"
        echo "   127.0.0.1 aksesekolah.preview"
        ;;
      prod|production)
        echo "🌐 Access URLs:"
        echo "   https://aksesekolah.id"
        echo "   https://www.aksesekolah.id"
        echo "   https://dashboard.aksesekolah.id"
        ;;
    esac
else
    echo "❌ Container failed to start!"
    echo ""
    echo "📋 Logs:"
    docker logs "$CONTAINER_NAME" --tail 50
    exit 1
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
