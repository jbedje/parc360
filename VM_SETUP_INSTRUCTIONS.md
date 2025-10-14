# VM Setup Instructions - Contabo vmi2804403

**Current Situation**: You're SSH'd into the VM but Node.js and MongoDB aren't installed yet.

## Quick Fix - Run These Commands on Your VM

Copy and paste these commands **one section at a time** into your SSH session:

### 1. Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install Node.js 20.x
```bash
# Install Node.js from NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

### 3. Install MongoDB 7.0

First, check your Ubuntu version:
```bash
lsb_release -a
```

**For Ubuntu 22.04 (Jammy)**:
```bash
# Import MongoDB GPG key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
    sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
    sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update and install
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
sudo systemctl status mongod
```

**For Ubuntu 20.04 (Focal)**:
```bash
# Import MongoDB GPG key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
    sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | \
    sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update and install
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
sudo systemctl status mongod
```

### 4. Install PM2
```bash
sudo npm install -g pm2
pm2 --version
```

### 5. Install Nginx
```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl status nginx
```

### 6. Install Git
```bash
sudo apt install -y git
git --version
```

### 7. Configure Firewall
```bash
sudo apt install -y ufw
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
sudo ufw status
```

### 8. Clone Repository
```bash
# Create directory
sudo mkdir -p /var/www/parc360
sudo chown $USER:$USER /var/www/parc360
cd /var/www/parc360

# Clone repository
git clone https://github.com/jbedje/parc360.git .
```

### 9. Configure Environment Files

**Backend .env**:
```bash
cat > backend/.env << 'EOF'
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/parc360
JWT_SECRET=TEMP_SECRET_CHANGE_ME_LATER
JWT_EXPIRE=30d
EOF
```

**Frontend .env**:
```bash
cat > frontend/.env << 'EOF'
REACT_APP_API_URL=http://vmi2804403.contaboserver.net/api
EOF
```

### 10. Install Dependencies & Build

**Backend**:
```bash
cd /var/www/parc360/backend
npm install --production
```

**Frontend**:
```bash
cd /var/www/parc360/frontend
npm install
npm run build
```

### 11. Start with PM2
```bash
cd /var/www/parc360
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

**Important**: PM2 will show a command to run. Copy and execute that command, then run:
```bash
pm2 save
```

### 12. Configure Nginx
```bash
sudo cp /var/www/parc360/nginx.conf /etc/nginx/sites-available/parc360
sudo ln -sf /etc/nginx/sites-available/parc360 /etc/nginx/sites-enabled/parc360
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

### 13. Seed Database (Optional)
```bash
cd /var/www/parc360/backend
node scripts/seeders/seed.js
```

### 14. Test Everything
```bash
# Check services
pm2 status
sudo systemctl status mongod
sudo systemctl status nginx

# Test API
curl http://localhost:5000/api/health

# Test from outside
curl http://vmi2804403.contaboserver.net/api/health
```

### 15. Generate Secure JWT Secret
```bash
# Generate a secure secret
openssl rand -base64 32

# Edit .env file
nano /var/www/parc360/backend/.env
# Replace JWT_SECRET=TEMP_SECRET_CHANGE_ME_LATER with the generated secret

# Restart backend
pm2 restart parc360-backend
```

---

## Alternative: Automated Script

Or you can use the automated setup script:

```bash
# Download the script
cd ~
wget https://raw.githubusercontent.com/jbedje/parc360/main/vm-initial-setup.sh

# Make it executable
chmod +x vm-initial-setup.sh

# Run it
./vm-initial-setup.sh
```

---

## Verification Checklist

After setup, verify:

- ✅ Node.js installed: `node --version` (should show v20.x)
- ✅ npm installed: `npm --version`
- ✅ MongoDB running: `sudo systemctl status mongod`
- ✅ PM2 running: `pm2 status` (should show parc360-backend)
- ✅ Nginx running: `sudo systemctl status nginx`
- ✅ API responds: `curl http://localhost:5000/api/health`
- ✅ Frontend accessible: Visit http://vmi2804403.contaboserver.net in browser

---

## Troubleshooting

### MongoDB Won't Start
```bash
# Check logs
sudo journalctl -u mongod -n 50

# Try manual start
sudo systemctl start mongod

# Check if port is already in use
sudo netstat -tulpn | grep 27017
```

### PM2 App Crashed
```bash
# View logs
pm2 logs parc360-backend --lines 100

# Restart
pm2 restart parc360-backend

# Delete and start fresh
pm2 delete parc360-backend
pm2 start ecosystem.config.js
```

### Nginx 502 Error
```bash
# Check if backend is running
pm2 status

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Restart both
pm2 restart parc360-backend
sudo systemctl restart nginx
```

---

## Next Steps After Setup

1. **Configure SSL** (Recommended):
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d vmi2804403.contaboserver.net
   ```

2. **Update GitHub Secret** to use HTTPS:
   - Go to: https://github.com/jbedje/parc360/settings/secrets/actions
   - Update `REACT_APP_API_URL` to: `https://vmi2804403.contaboserver.net/api`

3. **Test CI/CD**:
   ```bash
   # On your local machine
   git commit --allow-empty -m "Test CI/CD"
   git push origin main
   ```

4. **Monitor Logs**:
   ```bash
   pm2 logs parc360-backend
   ```

---

**Your application will be available at**: http://vmi2804403.contaboserver.net

**Default login credentials** (if you seeded the database):
- Email: admin@parc360.ci
- Password: admin123

---

**Support**: For issues, check [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) or create an issue at https://github.com/jbedje/parc360/issues
