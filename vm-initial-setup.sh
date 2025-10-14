#!/bin/bash

# PARC360 - Contabo VM Initial Setup Script
# For Ubuntu/Debian systems
# Run this script on vmi2804403.contaboserver.net

set -e  # Exit on any error

echo "========================================"
echo "PARC360 - Initial VM Setup"
echo "========================================"
echo ""

# Detect OS
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$ID
    VERSION=$VERSION_ID
    echo "Detected OS: $OS $VERSION"
else
    echo "Cannot detect OS. This script is for Ubuntu/Debian."
    exit 1
fi

echo ""
echo "Step 1: System Update"
echo "========================================"
sudo apt update
sudo apt upgrade -y

echo ""
echo "Step 2: Install Node.js 20.x"
echo "========================================"
# Remove any existing Node.js
sudo apt remove -y nodejs npm || true

# Install Node.js 20.x from NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version

echo ""
echo "Step 3: Install MongoDB"
echo "========================================"

if [[ "$OS" == "ubuntu" ]]; then
    # Ubuntu MongoDB installation
    echo "Installing MongoDB for Ubuntu..."

    # Import MongoDB GPG key
    curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
        sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg

    # Add MongoDB repository based on Ubuntu version
    if [[ "$VERSION" == "22.04" ]]; then
        echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
            sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
    elif [[ "$VERSION" == "20.04" ]]; then
        echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | \
            sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
    else
        echo "Ubuntu version $VERSION detected. Using jammy repository."
        echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
            sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
    fi

    sudo apt update
    sudo apt install -y mongodb-org

elif [[ "$OS" == "debian" ]]; then
    # Debian MongoDB installation
    echo "Installing MongoDB for Debian..."

    # Import MongoDB GPG key
    curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
        sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg

    # Add MongoDB repository
    echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/debian bullseye/mongodb-org/7.0 main" | \
        sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

    sudo apt update
    sudo apt install -y mongodb-org
else
    echo "Unsupported OS: $OS"
    exit 1
fi

# Start and enable MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
sudo systemctl status mongod --no-pager

echo ""
echo "Step 4: Install PM2"
echo "========================================"
sudo npm install -g pm2

# Verify PM2
pm2 --version

echo ""
echo "Step 5: Install Nginx"
echo "========================================"
sudo apt install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl status nginx --no-pager

echo ""
echo "Step 6: Install Git"
echo "========================================"
sudo apt install -y git

# Verify Git
git --version

echo ""
echo "Step 7: Configure Firewall"
echo "========================================"
# Check if UFW is installed
if command -v ufw &> /dev/null; then
    echo "Configuring UFW firewall..."
    sudo ufw allow 22/tcp    # SSH
    sudo ufw allow 80/tcp    # HTTP
    sudo ufw allow 443/tcp   # HTTPS
    sudo ufw --force enable
    sudo ufw status
else
    echo "UFW not installed. Installing..."
    sudo apt install -y ufw
    sudo ufw allow 22/tcp
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    sudo ufw --force enable
    sudo ufw status
fi

echo ""
echo "Step 8: Create Deployment Directory"
echo "========================================"
sudo mkdir -p /var/www/parc360
sudo chown $USER:$USER /var/www/parc360
cd /var/www/parc360

echo ""
echo "Step 9: Clone Repository"
echo "========================================"
echo "Cloning from https://github.com/jbedje/parc360.git"
git clone https://github.com/jbedje/parc360.git .

echo ""
echo "Step 10: Configure Environment Files"
echo "========================================"

# Backend .env
echo "Creating backend/.env..."
cat > backend/.env << 'EOF'
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/parc360
JWT_SECRET=CHANGEME_GENERATE_SECURE_SECRET
JWT_EXPIRE=30d
EOF

echo "⚠️  IMPORTANT: Edit backend/.env and set a secure JWT_SECRET"

# Frontend .env
echo "Creating frontend/.env..."
cat > frontend/.env << 'EOF'
REACT_APP_API_URL=http://vmi2804403.contaboserver.net/api
EOF

echo ""
echo "Step 11: Install Dependencies"
echo "========================================"

echo "Installing backend dependencies..."
cd /var/www/parc360/backend
npm install --production

echo "Installing frontend dependencies..."
cd /var/www/parc360/frontend
npm install

echo ""
echo "Step 12: Build Frontend"
echo "========================================"
npm run build

echo ""
echo "Step 13: Start Backend with PM2"
echo "========================================"
cd /var/www/parc360
pm2 start ecosystem.config.js
pm2 save
pm2 startup

echo "Copy and run the command above if prompted!"
read -p "Press Enter after running the startup command (or Enter to skip)..."

echo ""
echo "Step 14: Configure Nginx"
echo "========================================"
sudo cp /var/www/parc360/nginx.conf /etc/nginx/sites-available/parc360
sudo ln -sf /etc/nginx/sites-available/parc360 /etc/nginx/sites-enabled/parc360
sudo rm -f /etc/nginx/sites-enabled/default

echo "Testing Nginx configuration..."
sudo nginx -t

echo "Restarting Nginx..."
sudo systemctl restart nginx

echo ""
echo "Step 15: Seed Database (Optional)"
echo "========================================"
read -p "Do you want to seed the database with initial data? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    cd /var/www/parc360/backend
    node scripts/seeders/seed.js
    echo "✅ Database seeded successfully!"
else
    echo "Skipping database seeding."
fi

echo ""
echo "========================================"
echo "Installation Complete!"
echo "========================================"
echo ""
echo "Services Status:"
echo "----------------"
pm2 status
echo ""
sudo systemctl status mongod --no-pager | head -3
sudo systemctl status nginx --no-pager | head -3

echo ""
echo "Next Steps:"
echo "----------------"
echo "1. ✅ Edit /var/www/parc360/backend/.env and set JWT_SECRET"
echo "   Use: openssl rand -base64 32"
echo ""
echo "2. ✅ Restart backend after changing .env:"
echo "   pm2 restart parc360-backend"
echo ""
echo "3. ✅ Test your application:"
echo "   curl http://localhost:5000/api/health"
echo "   curl http://vmi2804403.contaboserver.net/api/health"
echo ""
echo "4. ✅ View logs:"
echo "   pm2 logs parc360-backend"
echo ""
echo "5. ✅ Configure SSL (recommended):"
echo "   sudo apt install certbot python3-certbot-nginx"
echo "   sudo certbot --nginx -d vmi2804403.contaboserver.net"
echo ""
echo "6. ✅ Monitor deployment:"
echo "   cd /var/www/parc360 && bash check-deployment.sh"
echo ""
echo "Your application should be accessible at:"
echo "http://vmi2804403.contaboserver.net"
echo ""
echo "========================================"
