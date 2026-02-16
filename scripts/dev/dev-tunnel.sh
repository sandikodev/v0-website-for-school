#!/bin/bash

# ============================================
# AkseSekolah.id - Development SSH Tunnel
# ============================================
#
# Script untuk memudahkan setup SSH tunnel
# dari laptop lokal ke development container
# di server remote.
#
# Usage:
#   ./dev-tunnel.sh start   - Start tunnel
#   ./dev-tunnel.sh stop    - Stop tunnel
#   ./dev-tunnel.sh status  - Check status
#   ./dev-tunnel.sh test    - Test connection

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
SERVER="elearning.smauiiyk.sch.id"
USER="dev"
LOCAL_PORT=3001
REMOTE_PORT=3001

case "$1" in
    start)
        echo -e "${BLUE}🚇 Starting SSH Tunnel...${NC}"
        echo ""
        echo -e "${YELLOW}Configuration:${NC}"
        echo -e "  Server: ${GREEN}$USER@$SERVER${NC}"
        echo -e "  Local Port: ${GREEN}$LOCAL_PORT${NC}"
        echo -e "  Remote Port: ${GREEN}$REMOTE_PORT${NC}"
        echo ""
        
        # Check if tunnel already running
        if pgrep -f "ssh.*-L.*$LOCAL_PORT:localhost:$REMOTE_PORT" > /dev/null; then
            echo -e "${YELLOW}⚠️  Tunnel already running!${NC}"
            echo ""
            echo "Stop with: $0 stop"
            exit 1
        fi
        
        # Check if port is in use
        if lsof -Pi :$LOCAL_PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
            echo -e "${RED}❌ Port $LOCAL_PORT is already in use!${NC}"
            echo ""
            echo "Find process: lsof -i :$LOCAL_PORT"
            exit 1
        fi
        
        echo -e "${YELLOW}📡 Creating tunnel...${NC}"
        echo ""
        echo -e "${BLUE}Command:${NC}"
        echo "ssh -L $LOCAL_PORT:localhost:$REMOTE_PORT -N -o ServerAliveInterval=60 $USER@$SERVER"
        echo ""
        echo -e "${YELLOW}Note: Keep this terminal open or press Ctrl+Z then 'bg' to background${NC}"
        echo ""
        
        # Start tunnel
        ssh -L $LOCAL_PORT:localhost:$REMOTE_PORT \
            -N \
            -o ServerAliveInterval=60 \
            -o ServerAliveCountMax=3 \
            $USER@$SERVER
        ;;
        
    stop)
        echo -e "${BLUE}🛑 Stopping SSH Tunnel...${NC}"
        
        PID=$(pgrep -f "ssh.*-L.*$LOCAL_PORT:localhost:$REMOTE_PORT")
        
        if [ -z "$PID" ]; then
            echo -e "${YELLOW}⚠️  No tunnel found${NC}"
            exit 0
        fi
        
        kill $PID
        echo -e "${GREEN}✅ Tunnel stopped (PID: $PID)${NC}"
        ;;
        
    status)
        echo -e "${BLUE}📊 Tunnel Status${NC}"
        echo ""
        
        PID=$(pgrep -f "ssh.*-L.*$LOCAL_PORT:localhost:$REMOTE_PORT")
        
        if [ -z "$PID" ]; then
            echo -e "${RED}❌ Tunnel is not running${NC}"
            echo ""
            echo "Start with: $0 start"
            exit 1
        else
            echo -e "${GREEN}✅ Tunnel is running (PID: $PID)${NC}"
            echo ""
            echo -e "${YELLOW}Process:${NC}"
            ps -p $PID -o pid,etime,command | tail -n 1
            echo ""
            echo -e "${YELLOW}Port:${NC}"
            lsof -i :$LOCAL_PORT | grep LISTEN
        fi
        ;;
        
    test)
        echo -e "${BLUE}🧪 Testing Connection${NC}"
        echo ""
        
        # Check tunnel
        if ! pgrep -f "ssh.*-L.*$LOCAL_PORT:localhost:$REMOTE_PORT" > /dev/null; then
            echo -e "${RED}❌ Tunnel is not running${NC}"
            echo ""
            echo "Start with: $0 start"
            exit 1
        fi
        
        echo -e "${YELLOW}Testing localhost:$LOCAL_PORT...${NC}"
        
        # Test health endpoint
        if curl -s -f http://localhost:$LOCAL_PORT/api/health > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Connection successful!${NC}"
            echo ""
            echo -e "${YELLOW}Response:${NC}"
            curl -s http://localhost:$LOCAL_PORT/api/health | jq . 2>/dev/null || curl -s http://localhost:$LOCAL_PORT/api/health
            echo ""
            echo ""
            echo -e "${GREEN}🌐 Access URLs:${NC}"
            echo -e "  Platform: ${BLUE}http://aksesekolah.local:$LOCAL_PORT${NC}"
            echo -e "  Dashboard: ${BLUE}http://dashboard.aksesekolah.local:$LOCAL_PORT${NC}"
            echo -e "  Signin: ${BLUE}http://dashboard.aksesekolah.local:$LOCAL_PORT/signin${NC}"
            echo -e "  Signup: ${BLUE}http://dashboard.aksesekolah.local:$LOCAL_PORT/signup${NC}"
            echo ""
            echo -e "${YELLOW}Note: Add to /etc/hosts first:${NC}"
            echo "  127.0.0.1 aksesekolah.local"
            echo "  127.0.0.1 dashboard.aksesekolah.local"
        else
            echo -e "${RED}❌ Connection failed!${NC}"
            echo ""
            echo "Possible issues:"
            echo "  1. Development container not running on server"
            echo "  2. Port $REMOTE_PORT not exposed"
            echo "  3. Network issue"
            echo ""
            echo "Check server with:"
            echo "  ssh $USER@$SERVER 'docker ps | grep aksesekolah-app-dev'"
        fi
        ;;
        
    *)
        echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
        echo -e "${BLUE}║  AkseSekolah.id Development Tunnel    ║${NC}"
        echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
        echo ""
        echo "Usage: $0 {start|stop|status|test}"
        echo ""
        echo "Commands:"
        echo -e "  ${GREEN}start${NC}   - Start SSH tunnel"
        echo -e "  ${GREEN}stop${NC}    - Stop SSH tunnel"
        echo -e "  ${GREEN}status${NC}  - Check tunnel status"
        echo -e "  ${GREEN}test${NC}    - Test connection"
        echo ""
        echo "Example:"
        echo "  $0 start    # Start tunnel"
        echo "  $0 test     # Test connection"
        echo "  $0 stop     # Stop tunnel"
        echo ""
        exit 1
        ;;
esac
