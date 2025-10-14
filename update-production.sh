#!/bin/bash

# Quick Update Script for Production Server
# Run this on vmi2804403.contaboserver.net to deploy latest changes

set -e

echo "========================================"
echo "PARC360 - Production Update"
echo "========================================"
echo ""

# Navigate to application directory
cd /var/www/parc360

echo "Step 1: Pulling latest code from GitHub..."
git pull origin main

echo ""
echo "Step 2: Installing/updating backend dependencies..."
cd backend
npm install --production

echo ""
echo "Step 3: Installing/updating frontend dependencies..."
cd ../frontend
npm install

echo ""
echo "Step 4: Building frontend..."
npm run build

echo ""
echo "Step 5: Restarting backend with PM2..."
cd ..
pm2 restart parc360-backend

echo ""
echo "Step 6: Reloading Nginx..."
sudo systemctl reload nginx

echo ""
echo "========================================"
echo "Update Complete!"
echo "========================================"
echo ""
echo "Services Status:"
pm2 status
echo ""
echo "Application should be updated at:"
echo "http://vmi2804403.contaboserver.net"
echo ""
echo "To view logs:"
echo "  pm2 logs parc360-backend"
echo ""
