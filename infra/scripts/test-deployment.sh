#!/bin/bash

# ============================================
# AkseSekolah.id - Deployment Test Script
# ============================================
#
# Tests all critical endpoints to verify
# deployment is working correctly

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Function to test endpoint
test_endpoint() {
    local name=$1
    local url=$2
    local expected_code=${3:-200}
    
    echo -n "Testing $name... "
    
    response=$(curl -k -s -o /dev/null -w "%{http_code}" "$url" 2>&1 || echo "000")
    
    if [ "$response" = "$expected_code" ]; then
        echo -e "${GREEN}✓ PASS${NC} ($response)"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC} (got $response, expected $expected_code)"
        ((FAILED++))
    fi
}

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  AkseSekolah.id Deployment Test       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Check if container is running
echo -e "${YELLOW}📦 Checking container status...${NC}"
if docker ps | grep -q clients-aksesekolah-app; then
    echo -e "${GREEN}✓ Container is running${NC}"
else
    echo -e "${RED}✗ Container is not running${NC}"
    echo "Start with: docker-compose -f docker-compose.yml up -d"
    exit 1
fi
echo ""

# Platform Tests
echo -e "${YELLOW}🌐 Testing Platform Routes...${NC}"
test_endpoint "Main Domain" "https://aksesekolah.id"
test_endpoint "WWW Domain" "https://www.aksesekolah.id"
echo ""

# Dashboard Tests
echo -e "${YELLOW}🎛️  Testing Dashboard Routes...${NC}"
test_endpoint "Dashboard Home" "https://dashboard.aksesekolah.id"
test_endpoint "Signin Page" "https://dashboard.aksesekolah.id/signin"
test_endpoint "Signup Page" "https://dashboard.aksesekolah.id/signup"
echo ""

# API Tests
echo -e "${YELLOW}🔌 Testing API Endpoints...${NC}"
test_endpoint "Health Check" "https://aksesekolah.id/api/health"
echo ""

# Tenant Tests (if any exist)
echo -e "${YELLOW}🏫 Testing Tenant Routes...${NC}"
test_endpoint "SMAUII Tenant" "https://smauii.aksesekolah.id"
test_endpoint "SMPN1 Tenant" "https://smpn1.aksesekolah.id"
echo ""

# SSL Tests
echo -e "${YELLOW}🔒 Testing SSL Certificates...${NC}"
echo -n "Checking SSL for dashboard... "
if curl -s -I https://dashboard.aksesekolah.id | grep -q "HTTP/2 200"; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((FAILED++))
fi
echo ""

# Summary
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Test Summary                          ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo -e "  ${GREEN}Passed: $PASSED${NC}"
echo -e "  ${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed! Deployment is working correctly.${NC}"
    exit 0
else
    echo -e "${RED}❌ Some tests failed. Please check the logs.${NC}"
    echo ""
    echo "View logs with: docker logs clients-aksesekolah-app"
    exit 1
fi
