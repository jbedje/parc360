#!/bin/bash

# PARC360 Deployment Health Check Script
# Run this on your Contabo VM to verify the deployment

echo "🔍 PARC360 Deployment Health Check"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check functions
check_service() {
    if systemctl is-active --quiet $1; then
        echo -e "${GREEN}✅ $1 is running${NC}"
        return 0
    else
        echo -e "${RED}❌ $1 is NOT running${NC}"
        return 1
    fi
}

check_port() {
    if sudo lsof -i :$1 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Port $1 is in use${NC}"
        return 0
    else
        echo -e "${RED}❌ Port $1 is NOT in use${NC}"
        return 1
    fi
}

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅ $1 exists${NC}"
        return 0
    else
        echo -e "${RED}❌ $1 does NOT exist${NC}"
        return 1
    fi
}

# 1. Check Node.js
echo "1️⃣  Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js installed: $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ Node.js is NOT installed${NC}"
fi
echo ""

# 2. Check PM2
echo "2️⃣  Checking PM2..."
if command -v pm2 &> /dev/null; then
    echo -e "${GREEN}✅ PM2 is installed${NC}"
    pm2 list
else
    echo -e "${RED}❌ PM2 is NOT installed${NC}"
fi
echo ""

# 3. Check MongoDB
echo "3️⃣  Checking MongoDB..."
check_service mongod
if command -v mongo &> /dev/null || command -v mongosh &> /dev/null; then
    echo -e "${GREEN}✅ MongoDB client installed${NC}"
fi
echo ""

# 4. Check Nginx
echo "4️⃣  Checking Nginx..."
check_service nginx
if command -v nginx &> /dev/null; then
    NGINX_VERSION=$(nginx -v 2>&1 | cut -d'/' -f2)
    echo -e "${GREEN}✅ Nginx installed: $NGINX_VERSION${NC}"
fi
echo ""

# 5. Check Ports
echo "5️⃣  Checking Ports..."
check_port 80   # Nginx
check_port 5000 # Backend API
check_port 27017 # MongoDB
echo ""

# 6. Check Application Files
echo "6️⃣  Checking Application Files..."
check_file "/var/www/parc360/backend/server.js"
check_file "/var/www/parc360/backend/.env"
check_file "/var/www/parc360/frontend/build/index.html"
check_file "/var/www/parc360/ecosystem.config.js"
check_file "/etc/nginx/sites-enabled/parc360"
echo ""

# 7. Check API Endpoint
echo "7️⃣  Checking API Endpoint..."
API_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/auth/me)
if [ "$API_RESPONSE" == "401" ] || [ "$API_RESPONSE" == "200" ]; then
    echo -e "${GREEN}✅ Backend API is responding (HTTP $API_RESPONSE)${NC}"
else
    echo -e "${RED}❌ Backend API is NOT responding (HTTP $API_RESPONSE)${NC}"
fi
echo ""

# 8. Check Frontend
echo "8️⃣  Checking Frontend..."
FRONTEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost)
if [ "$FRONTEND_RESPONSE" == "200" ]; then
    echo -e "${GREEN}✅ Frontend is responding (HTTP $FRONTEND_RESPONSE)${NC}"
else
    echo -e "${RED}❌ Frontend is NOT responding (HTTP $FRONTEND_RESPONSE)${NC}"
fi
echo ""

# 9. Check Disk Space
echo "9️⃣  Checking Disk Space..."
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -lt 80 ]; then
    echo -e "${GREEN}✅ Disk usage: ${DISK_USAGE}%${NC}"
else
    echo -e "${YELLOW}⚠️  Disk usage: ${DISK_USAGE}% (High)${NC}"
fi
echo ""

# 10. Check Memory
echo "🔟 Checking Memory..."
MEMORY_USAGE=$(free | awk '/Mem:/ {printf("%.0f", $3/$2 * 100)}')
if [ "$MEMORY_USAGE" -lt 80 ]; then
    echo -e "${GREEN}✅ Memory usage: ${MEMORY_USAGE}%${NC}"
else
    echo -e "${YELLOW}⚠️  Memory usage: ${MEMORY_USAGE}% (High)${NC}"
fi
echo ""

# Summary
echo "===================================="
echo "✅ Health Check Complete!"
echo ""
echo "Useful commands:"
echo "  pm2 status              - Check backend status"
echo "  pm2 logs parc360-backend - View backend logs"
echo "  sudo systemctl status nginx - Check Nginx status"
echo "  sudo tail -f /var/log/nginx/parc360-access.log - View access logs"
echo ""
echo "Application URLs:"
echo "  Frontend: http://vmi2804403.contaboserver.net"
echo "  API: http://vmi2804403.contaboserver.net/api"
echo ""
