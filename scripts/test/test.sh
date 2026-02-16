#!/bin/bash

# School Website Testing Suite
# Comprehensive testing toolkit for development, staging, and production environments
# Usage: ./test.sh [command] [options]

set -e

# Colors for beautiful output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TESTING_DIR="$SCRIPT_DIR/scripts/testing"

# Function to show banner
show_banner() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                🧪 School Website Testing Suite              ║"
    echo "║                                                              ║"
    echo "║  🚀 Comprehensive testing toolkit for all environments      ║"
    echo "║  📊 Performance analysis and monitoring                      ║"
    echo "║  🔧 Easy-to-use commands for daily development               ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# Function to show usage
show_usage() {
    show_banner
    echo -e "${YELLOW}📋 Available Commands:${NC}"
    echo ""
    echo -e "${GREEN}🚀 Environment Management:${NC}"
    echo -e "  dev       - Start development testing environment"
    echo -e "  full      - Start full testing environment (dev + staging + prod)"
    echo -e "  stop      - Stop all testing environments"
    echo -e "  restart   - Restart all testing environments"
    echo -e "  cleanup   - Clean up all testing containers"
    echo ""
    echo -e "${GREEN}📊 Status & Monitoring:${NC}"
    echo -e "  status    - Check container status"
    echo -e "  logs      - Show logs for all containers"
    echo -e "  health    - Health check for all services"
    echo ""
    echo -e "${GREEN}🧪 Testing & Validation:${NC}"
    echo -e "  test      - Test all endpoints"
    echo -e "  validate  - Comprehensive validation test"
    echo -e "  smoke     - Quick smoke test"
    echo ""
    echo -e "${GREEN}⚡ Performance Testing:${NC}"
    echo -e "  perf      - Performance testing suite"
    echo -e "  load      - Load testing"
    echo -e "  stress    - Stress testing"
    echo -e "  compare   - Compare environment performance"
    echo ""
    echo -e "${GREEN}🔧 Utilities:${NC}"
    echo -e "  info      - Show environment information"
    echo -e "  urls      - Show all accessible URLs"
    echo -e "  help      - Show this help message"
    echo ""
    echo -e "${YELLOW}💡 Examples:${NC}"
    echo -e "  $0 dev         # Start development testing"
    echo -e "  $0 test        # Test all endpoints"
    echo -e "  $0 perf        # Run performance tests"
    echo -e "  $0 status       # Check container status"
    echo -e "  $0 cleanup      # Clean up everything"
    echo ""
    echo -e "${CYAN}📚 For detailed documentation, see: docs/testing/README.md${NC}"
}

# Function to start development environment
start_dev() {
    echo -e "${BLUE}🚀 Starting Development Testing Environment...${NC}"
    "$SCRIPT_DIR/scripts/test/setup-test-env.sh" dev
}

# Function to start full environment
start_full() {
    echo -e "${BLUE}🚀 Starting Full Testing Environment...${NC}"
    "$SCRIPT_DIR/scripts/test/setup-test-env.sh" full
}

# Function to stop environments
stop_env() {
    echo -e "${YELLOW}🛑 Stopping Testing Environments...${NC}"
    "$TESTING_DIR/quick-test.sh" stop
}

# Function to restart environments
restart_env() {
    echo -e "${YELLOW}🔄 Restarting Testing Environments...${NC}"
    stop_env
    sleep 2
    start_full
}

# Function to cleanup
cleanup() {
    echo -e "${YELLOW}🧹 Cleaning up all testing containers...${NC}"
    "$SCRIPT_DIR/scripts/test/setup-test-env.sh" cleanup
}

# Function to check status
check_status() {
    echo -e "${BLUE}📊 Container Status:${NC}"
    "$TESTING_DIR/quick-test.sh" status
}

# Function to show logs
show_logs() {
    echo -e "${BLUE}📝 Container Logs:${NC}"
    "$TESTING_DIR/quick-test.sh" logs
}

# Function to health check
health_check() {
    echo -e "${BLUE}🏥 Health Check:${NC}"
    echo ""
    
    # Check if containers are running
    containers=$(docker ps --format "{{.Names}}" | grep -E "(nginx-test|school-website.*-test)" || true)
    
    if [ -z "$containers" ]; then
        echo -e "${RED}❌ No testing containers are running${NC}"
        echo -e "${YELLOW}💡 Run '$0 dev' or '$0 full' to start testing environment${NC}"
        return 1
    fi
    
    echo -e "${GREEN}✅ Testing containers are running:${NC}"
    echo "$containers" | while read container; do
        echo -e "  - $container"
    done
    
    echo ""
    echo -e "${YELLOW}🔍 Testing endpoints...${NC}"
    "$TESTING_DIR/quick-test.sh" test
}

# Function to test endpoints
test_endpoints() {
    echo -e "${BLUE}🧪 Testing All Endpoints:${NC}"
    "$TESTING_DIR/quick-test.sh" test
}

# Function to comprehensive validation
validate_all() {
    echo -e "${BLUE}🔍 Comprehensive Validation Test:${NC}"
    echo ""
    
    echo -e "${YELLOW}1. Container Status Check:${NC}"
    check_status
    
    echo -e "${YELLOW}2. Endpoint Testing:${NC}"
    test_endpoints
    
    echo -e "${YELLOW}3. Performance Check:${NC}"
    "$TESTING_DIR/perf-test.sh" single
    
    echo -e "${YELLOW}4. Load Test (5 concurrent requests):${NC}"
    for env in "dev" "staging" "prod"; do
        echo -e "${CYAN}Testing $env environment:${NC}"
        for i in {1..5}; do
            case $env in
                "dev") url="http://localhost:8080/websekolah-dev/" ;;
                "staging") url="http://localhost:8080/websekolah-staging/" ;;
                "prod") url="http://localhost:8080/websekolah/" ;;
            esac
            curl -s -o /dev/null -w "Request $i: %{time_total}s\n" "$url" &
        done
        wait
        echo ""
    done
    
    echo -e "${GREEN}✅ Comprehensive validation completed!${NC}"
}

# Function to smoke test
smoke_test() {
    echo -e "${BLUE}💨 Quick Smoke Test:${NC}"
    echo ""
    
    echo -e "${YELLOW}Testing main endpoints...${NC}"
    curl -f http://localhost:8080/websekolah-dev/ > /dev/null 2>&1 && echo -e "${GREEN}✅ Development endpoint OK${NC}" || echo -e "${RED}❌ Development endpoint FAILED${NC}"
    curl -f http://localhost:8080/websekolah-staging/ > /dev/null 2>&1 && echo -e "${GREEN}✅ Staging endpoint OK${NC}" || echo -e "${RED}❌ Staging endpoint FAILED${NC}"
    curl -f http://localhost:8080/websekolah/ > /dev/null 2>&1 && echo -e "${GREEN}✅ Production endpoint OK${NC}" || echo -e "${RED}❌ Production endpoint FAILED${NC}"
    
    echo -e "${GREEN}✅ Smoke test completed!${NC}"
}

# Function to run performance tests
run_perf() {
    echo -e "${BLUE}⚡ Performance Testing Suite:${NC}"
    "$TESTING_DIR/perf-test.sh" compare
}

# Function to run load test
run_load() {
    echo -e "${BLUE}⚡ Load Testing:${NC}"
    "$TESTING_DIR/perf-test.sh" load
}

# Function to run stress test
run_stress() {
    echo -e "${BLUE}⚡ Stress Testing:${NC}"
    "$TESTING_DIR/perf-test.sh" stress
}

# Function to compare performance
compare_perf() {
    echo -e "${BLUE}⚡ Performance Comparison:${NC}"
    "$TESTING_DIR/perf-test.sh" compare
}

# Function to show environment info
show_info() {
    echo -e "${BLUE}ℹ️  Environment Information:${NC}"
    echo ""
    
    echo -e "${YELLOW}📁 Script Locations:${NC}"
    echo -e "  Main Test Script: $SCRIPT_DIR/scripts/test/setup-test-env.sh"
    echo -e "  Quick Test Script: $TESTING_DIR/quick-test.sh"
    echo -e "  Performance Script: $TESTING_DIR/perf-test.sh"
    echo ""
    
    echo -e "${YELLOW}🐳 Docker Configuration:${NC}"
    echo -e "  Development: docker/test/docker-compose.dev-test.yml"
    echo -e "  Full Testing: docker/test/docker-compose.test.yml"
    echo -e "  Nginx Config: docker/test/nginx-test.conf"
    echo ""
    
    echo -e "${YELLOW}🌐 Access URLs:${NC}"
    show_urls
}

# Function to show URLs
show_urls() {
    echo -e "${BLUE}🌐 Access URLs:${NC}"
    echo ""
    echo -e "${GREEN}Through Nginx Proxy (Port 8080):${NC}"
    echo -e "  Development: http://localhost:8080/websekolah-dev/"
    echo -e "  Staging:     http://localhost:8080/websekolah-staging/"
    echo -e "  Production:  http://localhost:8080/websekolah/"
    echo ""
    echo -e "${GREEN}Direct Container Access:${NC}"
    echo -e "  Development: http://localhost:3001/"
    echo -e "  Staging:     http://localhost:3002/"
    echo -e "  Production:  http://localhost:3003/"
    echo ""
    echo -e "${GREEN}Management Commands:${NC}"
    echo -e "  Stop:        $0 stop"
    echo -e "  Restart:     $0 restart"
    echo -e "  Status:      $0 status"
    echo -e "  Logs:        $0 logs"
    echo -e "  Test:        $0 test"
    echo -e "  Cleanup:     $0 cleanup"
}

# Main execution
main() {
    case "${1:-help}" in
        "dev")
            start_dev
            ;;
        "full")
            start_full
            ;;
        "stop")
            stop_env
            ;;
        "restart")
            restart_env
            ;;
        "cleanup")
            cleanup
            ;;
        "status")
            check_status
            ;;
        "logs")
            show_logs
            ;;
        "health")
            health_check
            ;;
        "test")
            test_endpoints
            ;;
        "validate")
            validate_all
            ;;
        "smoke")
            smoke_test
            ;;
        "perf")
            run_perf
            ;;
        "load")
            run_load
            ;;
        "stress")
            run_stress
            ;;
        "compare")
            compare_perf
            ;;
        "info")
            show_info
            ;;
        "urls")
            show_urls
            ;;
        "help"|"-h"|"--help")
            show_usage
            ;;
        *)
            echo -e "${RED}❌ Unknown command: $1${NC}"
            echo -e "${YELLOW}Use '$0 help' for available commands${NC}"
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
