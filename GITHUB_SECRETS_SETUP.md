# GitHub Secrets Configuration Guide

This guide will help you configure the GitHub Secrets required for automated CI/CD deployment to your Contabo VM.

## Prerequisites

- Access to your Contabo VM: vmi2804403.contaboserver.net
- GitHub repository: https://github.com/jbedje/parc360
- Admin access to the GitHub repository

## Step 1: Generate SSH Key Pair (If you don't have one)

On your local machine or the Contabo VM, generate an SSH key pair:

```bash
# Generate SSH key (run this on your local machine)
ssh-keygen -t rsa -b 4096 -C "github-actions-parc360" -f ~/.ssh/parc360_deploy

# This creates two files:
# - ~/.ssh/parc360_deploy (private key - keep this secret!)
# - ~/.ssh/parc360_deploy.pub (public key - add to server)
```

## Step 2: Add Public Key to Contabo VM

```bash
# Copy the public key
cat ~/.ssh/parc360_deploy.pub

# SSH into your Contabo VM
ssh root@vmi2804403.contaboserver.net

# Add the public key to authorized_keys
mkdir -p ~/.ssh
echo "YOUR_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys

# Test the connection (from your local machine)
ssh -i ~/.ssh/parc360_deploy root@vmi2804403.contaboserver.net
```

## Step 3: Configure GitHub Secrets

1. Go to your GitHub repository: https://github.com/jbedje/parc360

2. Navigate to: **Settings** → **Secrets and variables** → **Actions**

3. Click **"New repository secret"** and add each of the following:

### Required Secrets:

#### SSH_HOST
- **Name**: `SSH_HOST`
- **Value**: `vmi2804403.contaboserver.net`
- **Description**: Your Contabo VM hostname

#### SSH_USERNAME
- **Name**: `SSH_USERNAME`
- **Value**: `root` (or your VM username)
- **Description**: SSH username for the VM

#### SSH_PRIVATE_KEY
- **Name**: `SSH_PRIVATE_KEY`
- **Value**: Contents of your private key file
  ```bash
  # On your local machine, copy the private key:
  cat ~/.ssh/parc360_deploy
  # Copy the ENTIRE output including:
  # -----BEGIN OPENSSH PRIVATE KEY-----
  # ... (all lines)
  # -----END OPENSSH PRIVATE KEY-----
  ```
- **Description**: Private SSH key for authentication

#### SSH_PORT
- **Name**: `SSH_PORT`
- **Value**: `22`
- **Description**: SSH port (default is 22)

#### REACT_APP_API_URL
- **Name**: `REACT_APP_API_URL`
- **Value**: `http://vmi2804403.contaboserver.net/api`
- **Description**: API URL for the React frontend
- **Note**: Update to `https://` once SSL is configured

### Optional Secrets (for production):

#### MONGODB_URI
- **Name**: `MONGODB_URI`
- **Value**: `mongodb://localhost:27017/parc360`
- **Description**: MongoDB connection string

#### JWT_SECRET
- **Name**: `JWT_SECRET`
- **Value**: Generate a secure random string:
  ```bash
  openssl rand -base64 32
  ```
- **Description**: JWT signing secret

## Step 4: Verify Secrets Configuration

After adding all secrets, you should see them listed in:
**Settings** → **Secrets and variables** → **Actions** → **Repository secrets**

You should see:
- ✅ SSH_HOST
- ✅ SSH_USERNAME
- ✅ SSH_PRIVATE_KEY
- ✅ SSH_PORT
- ✅ REACT_APP_API_URL

## Step 5: Test the CI/CD Pipeline

1. Make a small change to trigger deployment:
   ```bash
   # Add a comment or update README
   git commit -am "Test CI/CD deployment"
   git push origin main
   ```

2. Monitor the deployment:
   - Go to: https://github.com/jbedje/parc360/actions
   - Watch the "Deploy to Contabo" workflow
   - Check for any errors in the logs

## Step 6: Initial Server Setup (One-time)

Before the automated deployment can work, you need to prepare your Contabo VM:

```bash
# SSH into your VM
ssh root@vmi2804403.contaboserver.net

# Update system
apt update && apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
apt update
apt install -y mongodb-org

# Start MongoDB
systemctl start mongod
systemctl enable mongod

# Install PM2 globally
npm install -g pm2

# Install Nginx
apt install -y nginx

# Install Git
apt install -y git

# Create deployment directory
mkdir -p /var/www/parc360
cd /var/www/parc360

# Clone repository (you may need to set up deploy keys)
git clone https://github.com/jbedje/parc360.git .

# Create backend .env file
cat > backend/.env << 'EOF'
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/parc360
JWT_SECRET=YOUR_JWT_SECRET_HERE
JWT_EXPIRE=30d
EOF

# Create frontend .env file
cat > frontend/.env << 'EOF'
REACT_APP_API_URL=http://vmi2804403.contaboserver.net/api
EOF

# Install dependencies
cd backend && npm install --production
cd ../frontend && npm install

# Build frontend
npm run build

# Start backend with PM2
cd /var/www/parc360
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Configure Nginx
cp nginx.conf /etc/nginx/sites-available/parc360
ln -s /etc/nginx/sites-available/parc360 /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx

# Configure firewall
ufw allow 22
ufw allow 80
ufw allow 443
ufw --force enable

# Seed database (optional)
cd /var/www/parc360/backend
node scripts/seeders/seed.js
```

## Step 7: Post-Deployment Verification

After deployment completes, verify everything is working:

```bash
# Check if services are running
pm2 status
systemctl status mongod
systemctl status nginx

# Check application logs
pm2 logs parc360-backend

# Test API endpoint
curl http://localhost:5000/api/health

# Test from external
curl http://vmi2804403.contaboserver.net/api/health
```

## Troubleshooting

### SSH Connection Issues

```bash
# Test SSH connection manually
ssh -i ~/.ssh/parc360_deploy -v root@vmi2804403.contaboserver.net

# Check SSH key permissions
chmod 600 ~/.ssh/parc360_deploy
chmod 644 ~/.ssh/parc360_deploy.pub
```

### GitHub Actions Fails

1. Check the Actions tab: https://github.com/jbedje/parc360/actions
2. Review the error logs
3. Common issues:
   - SSH key not properly formatted (must include BEGIN/END lines)
   - Wrong hostname or username
   - Server not prepared with initial setup

### Application Not Starting

```bash
# Check PM2 logs
pm2 logs parc360-backend --lines 100

# Check Nginx logs
tail -f /var/log/nginx/error.log

# Check MongoDB status
systemctl status mongod
```

## Optional: Configure SSL with Let's Encrypt

Once the basic deployment is working:

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d vmi2804403.contaboserver.net

# Update REACT_APP_API_URL secret to use https://
# Update nginx.conf for SSL redirect
```

## Security Best Practices

1. ✅ Use SSH keys instead of passwords
2. ✅ Keep private keys secure (never commit to Git)
3. ✅ Use strong JWT_SECRET (minimum 32 characters)
4. ✅ Enable firewall (UFW)
5. ✅ Keep server updated: `apt update && apt upgrade`
6. ✅ Use environment variables for sensitive data
7. ✅ Configure SSL certificates (Let's Encrypt)
8. ✅ Regular backups of MongoDB database

## Next Steps

1. ✅ Generate SSH key pair
2. ✅ Add public key to Contabo VM
3. ✅ Configure all GitHub Secrets
4. ✅ Complete initial server setup
5. ✅ Test deployment by pushing to main branch
6. ✅ Configure SSL with Let's Encrypt
7. ✅ Set up monitoring and alerts

## Support

- GitHub Repository: https://github.com/jbedje/parc360
- GitHub Actions Docs: https://docs.github.com/en/actions
- PM2 Documentation: https://pm2.keymetrics.io/
- Nginx Documentation: https://nginx.org/en/docs/

---

**Generated for PARC360 - Fleet Management Application**
**Contabo VM: vmi2804403.contaboserver.net**
