#!/bin/bash

# ============================================
# AkseSekolah.id - Quick Deployment Script
# ============================================
# 
# This script provides a quick way to deploy
# the application with minimal steps.
#
# Usage:
#   ./deploy-quick.sh [environment]
#
# Environments:
#   - prod (default)
#   - preview
#   - dev
#

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Environment
ENV=${1:-prod}
COMPOSE_FILE="docker-compose.yml"

case $ENV in
  prod|production)
    COMPOSE_FILE="docker-compose.yml"
    CONTAINER_NAME="clients-aksesekolah-app"
    ;;
  preview)
    COMPOSE_FILE="docker-compose.preview.yml"
    CONTAINER_NAME="clients-aksesekolah-app-preview"
    ;;
  dev|development)
    COMPOSE_FILE="docker-compose.dev.yml"
    CONTAINER_NAME="clients-aksesekolah-app-dev"
    ;;
  *)
    echo -e "${RED}❌ Invalid environment: $ENV${NC}"
    echo "Usage: $0 [prod|preview|dev]"
    exit 1
    ;;
esac

echo -e "${BLUE}🚀 AkseSekolah.id Quick Deployment${NC}"
echo -e "${BLUE}Environment: ${GREEN}$ENV${NC}"
echo -e "${BLUE}Compose File: ${GREEN}$COMPOSE_FILE${NC}"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env file not found!${NC}"
    echo "Please create .env file from .env.example"
    exit 1
fi

# Check required environment variables
echo -e "${YELLOW}📋 Checking environment variables...${NC}"
if ! grep -q "JWT_SECRET" .env; then
    echo -e "${RED}❌ JWT_SECRET not found in .env${NC}"
    echo "Generate with: openssl rand -base64 32"
    exit 1
fi
echo -e "${GREEN}✅ Environment variables OK${NC}"
echo ""

# Stop existing container
echo -e "${YELLOW}🛑 Stopping existing container...${NC}"
docker compose -f $COMPOSE_FILE down 2>/dev/null || true
echo -e "${GREEN}✅ Container stopped${NC}"
echo ""

# Build image
echo -e "${YELLOW}🔨 Building Docker image...${NC}"
docker compose -f $COMPOSE_FILE build
echo -e "${GREEN}✅ Image built${NC}"
echo ""

# Start container
echo -e "${YELLOW}🚀 Starting container...${NC}"
docker compose -f $COMPOSE_FILE up -d
echo -e "${GREEN}✅ Container started${NC}"
echo ""

# Wait for container to be ready
echo -e "${YELLOW}⏳ Waiting for container to be ready...${NC}"
sleep 5

# Check container status
if docker ps | grep -q $CONTAINER_NAME; then
    echo -e "${GREEN}✅ Container is running${NC}"
else
    echo -e "${RED}❌ Container failed to start${NC}"
    echo "Check logs with: docker logs $CONTAINER_NAME"
    exit 1
fi
echo ""

# Test health endpoint
echo -e "${YELLOW}🏥 Testing health endpoint...${NC}"
if docker exec $CONTAINER_NAME wget -q -O- http://localhost:3000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Health check passed${NC}"
else
    echo -e "${YELLOW}⚠️  Health check failed (app may still be starting)${NC}"
fi
echo ""

# Show container info
echo -e "${BLUE}📊 Container Information:${NC}"
echo -e "  Name: ${GREEN}$CONTAINER_NAME${NC}"
echo -e "  Status: ${GREEN}$(docker ps --filter name=$CONTAINER_NAME --format '{{.Status}}')${NC}"
echo -e "  Port: ${GREEN}3000${NC}"
echo ""

# Show URLs
echo -e "${BLUE}🌐 Access URLs:${NC}"
if [ "$ENV" = "prod" ]; then
    echo -e "  Main: ${GREEN}https://aksesekolah.id${NC}"
    echo -e "  Dashboard: ${GREEN}https://dashboard.aksesekolah.id${NC}"
    echo -e "  Signin: ${GREEN}https://dashboard.aksesekolah.id/signin${NC}"
    echo -e "  Signup: ${GREEN}https://dashboard.aksesekolah.id/signup${NC}"
elif [ "$ENV" = "preview" ]; then
    echo -e "  Preview: ${GREEN}https://preview.aksesekolah.id${NC}"
else
    echo -e "  Local: ${GREEN}http://localhost:3000${NC}"
fi
echo ""

# Show useful commands
echo -e "${BLUE}📝 Useful Commands:${NC}"
echo -e "  View logs: ${YELLOW}docker logs -f $CONTAINER_NAME${NC}"
echo -e "  Stop: ${YELLOW}docker compose -f $COMPOSE_FILE down${NC}"
echo -e "  Restart: ${YELLOW}docker compose -f $COMPOSE_FILE restart${NC}"
echo -e "  Shell: ${YELLOW}docker exec -it $CONTAINER_NAME sh${NC}"
echo ""

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
