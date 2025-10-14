#!/bin/bash

# PARC360 Deployment Script for Contabo VM
# This script should be run on the server

set -e  # Exit on any error

echo "🚀 Starting PARC360 deployment..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
APP_DIR="/var/www/parc360"
BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"
LOG_DIR="$APP_DIR/logs"

# Create directories if they don't exist
echo -e "${BLUE}📁 Creating directories...${NC}"
sudo mkdir -p $APP_DIR
sudo mkdir -p $LOG_DIR
sudo chown -R $USER:$USER $APP_DIR

# Navigate to app directory
cd $APP_DIR

# Pull latest code
echo -e "${BLUE}📥 Pulling latest code from GitHub...${NC}"
if [ -d ".git" ]; then
    git pull origin main
else
    echo "Git repository not found. Cloning..."
    cd ..
    git clone https://github.com/jbedje/parc360.git
    cd parc360
fi

# Backend deployment
echo -e "${BLUE}🔧 Deploying backend...${NC}"
cd $BACKEND_DIR

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ Backend .env file not found!${NC}"
    echo "Please create $BACKEND_DIR/.env with required variables"
    exit 1
fi

# Install dependencies
echo "Installing backend dependencies..."
npm ci --production

# Database migration (if needed)
# node scripts/migrate.js

# Frontend deployment
echo -e "${BLUE}🎨 Deploying frontend...${NC}"
cd $FRONTEND_DIR

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ Frontend .env file not found!${NC}"
    echo "Please create $FRONTEND_DIR/.env with required variables"
    exit 1
fi

# Install dependencies and build
echo "Installing frontend dependencies..."
npm ci

echo "Building frontend..."
npm run build

# PM2 deployment
echo -e "${BLUE}⚙️  Managing PM2 processes...${NC}"
cd $APP_DIR

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "PM2 not found. Installing..."
    sudo npm install -g pm2
fi

# Start or restart backend
if pm2 list | grep -q "parc360-backend"; then
    echo "Restarting backend with PM2..."
    pm2 restart parc360-backend
else
    echo "Starting backend with PM2..."
    pm2 start ecosystem.config.js
    pm2 save
    sudo pm2 startup systemd -u $USER --hp /home/$USER
fi

# Nginx configuration
echo -e "${BLUE}🌐 Configuring Nginx...${NC}"

# Check if Nginx is installed
if ! command -v nginx &> /dev/null; then
    echo "Nginx not found. Installing..."
    sudo apt update
    sudo apt install -y nginx
fi

# Copy Nginx configuration
if [ -f "$APP_DIR/nginx.conf" ]; then
    sudo cp $APP_DIR/nginx.conf /etc/nginx/sites-available/parc360
    sudo ln -sf /etc/nginx/sites-available/parc360 /etc/nginx/sites-enabled/parc360

    # Test Nginx configuration
    sudo nginx -t

    # Reload Nginx
    sudo systemctl reload nginx
    echo -e "${GREEN}✅ Nginx configured successfully${NC}"
else
    echo -e "${RED}⚠️  nginx.conf not found in $APP_DIR${NC}"
fi

# Enable firewall rules
echo -e "${BLUE}🔥 Configuring firewall...${NC}"
if command -v ufw &> /dev/null; then
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    sudo ufw allow 22/tcp
    echo -e "${GREEN}✅ Firewall rules added${NC}"
fi

# Show PM2 status
echo -e "${BLUE}📊 PM2 Status:${NC}"
pm2 status

# Show deployment summary
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ DEPLOYMENT COMPLETED SUCCESSFULLY!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Backend: Running on port 5000 (via PM2)"
echo "Frontend: Served by Nginx"
echo "Access your app at: http://vmi2804403.contaboserver.net"
echo ""
echo "Useful commands:"
echo "  pm2 status              - Check backend status"
echo "  pm2 logs parc360-backend - View backend logs"
echo "  pm2 restart parc360-backend - Restart backend"
echo "  sudo systemctl status nginx - Check Nginx status"
echo "  sudo nginx -t           - Test Nginx configuration"
echo ""
