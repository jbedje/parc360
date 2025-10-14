# PARC360 - Environment Configuration Guide

## Understanding Development vs Production

Your PARC360 application can run in two different environments:

### 🏠 Local Development (Your Computer)
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **Database**: MongoDB running on your local machine

### 🌐 Production (Contabo Server)
- **Frontend**: http://vmi2804403.contaboserver.net
- **Backend**: http://vmi2804403.contaboserver.net/api
- **Database**: MongoDB running on the server

---

## Current Configuration

### ✅ Fixed Issues:
1. **AuthContext** now uses dynamic API URL (from environment variables)
2. **Frontend .env** properly configured for local development
3. **Both servers running** - backend on port 5000, frontend on port 3000

### 📁 Configuration Files:

#### **frontend/.env** (Local Development)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

#### **Production frontend/.env** (On Contabo VM)
```env
REACT_APP_API_URL=http://vmi2804403.contaboserver.net/api
```

---

## How to Switch Between Environments

### Option 1: Local Development (Default)

**When to use**: When developing on your computer

**Configuration**:
```env
# frontend/.env
REACT_APP_API_URL=http://localhost:5000/api
```

**Start servers**:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

**Access**: http://localhost:3000

### Option 2: Test Against Production API

**When to use**: When you want to test the local frontend against the production backend

**Configuration**:
```env
# frontend/.env
REACT_APP_API_URL=http://vmi2804403.contaboserver.net/api
```

**Start only frontend**:
```bash
cd frontend
npm start
```

**Access**: http://localhost:3000 (will connect to production API)

### Option 3: Full Production

**When to use**: Deploy to the Contabo server

**Configuration**: Set on the server
```bash
# On VM: /var/www/parc360/frontend/.env
REACT_APP_API_URL=http://vmi2804403.contaboserver.net/api
```

**Deploy**:
```bash
ssh root@vmi2804403.contaboserver.net
cd /var/www/parc360
./update-production.sh
```

**Access**: http://vmi2804403.contaboserver.net

---

## Important Notes

### ⚠️ Environment Variables Require Restart

When you change `.env` files, **you MUST restart** the development server:

```bash
# Stop the server (Ctrl+C in terminal)
# Then start again
npm start
```

The `.env` file is **read only once** when the server starts!

### ⚠️ .env Files Are Not Committed to Git

The `.env` files are **ignored by Git** (for security). This means:

- **Local development**: Create your own `frontend/.env` with localhost
- **Production server**: Create `frontend/.env` on the VM with production URL
- **Never commit** sensitive credentials to `.env` files

### ✅ AuthContext is Now Fixed

The **AuthContext** now dynamically uses the API URL from environment variables:

```typescript
// Before (BROKEN - hardcoded localhost)
const response = await axios.get('http://localhost:5000/api/auth/me');

// After (FIXED - uses environment variable)
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const response = await axios.get(`${API_URL}/auth/me`);
```

This fix allows the same code to work in both development and production!

---

## Quick Reference Commands

### Local Development Setup
```bash
# 1. Start backend
cd backend
npm run dev

# 2. Configure frontend for local
echo "REACT_APP_API_URL=http://localhost:5000/api" > frontend/.env

# 3. Start frontend
cd frontend
npm start

# 4. Open browser
# http://localhost:3000
```

### Production Update
```bash
# SSH into server
ssh root@vmi2804403.contaboserver.net

# Update code
cd /var/www/parc360
git pull origin main

# Set production URL
echo "REACT_APP_API_URL=http://vmi2804403.contaboserver.net/api" > frontend/.env

# Rebuild and restart
cd frontend
npm run build
cd ..
pm2 restart parc360-backend
sudo systemctl reload nginx
```

### Quick Production Update (Using Script)
```bash
ssh root@vmi2804403.contaboserver.net
cd /var/www/parc360
./update-production.sh
```

---

## Troubleshooting

### 401 Unauthorized Errors

**Symptom**: "Token invalide" or 401 errors when making API calls

**Causes**:
1. Frontend .env pointing to wrong API URL
2. Need to restart frontend after changing .env
3. Not logged in or token expired

**Solutions**:
```bash
# 1. Check your .env file
cat frontend/.env

# 2. Make sure it matches your setup:
#    - Local dev: http://localhost:5000/api
#    - Production: http://vmi2804403.contaboserver.net/api

# 3. Restart frontend
# (Ctrl+C then npm start again)

# 4. Clear browser cache and login again
# (Ctrl+Shift+R or Cmd+Shift+R)
```

### Cannot Connect to API

**Symptom**: Network errors, cannot reach API

**Causes**:
1. Backend not running
2. Wrong API URL in .env
3. Firewall blocking connection

**Solutions**:
```bash
# Check backend is running
curl http://localhost:5000/api/health

# Check .env configuration
cat frontend/.env

# Verify backend process
# Windows
netstat -ano | findstr ":5000"

# Linux/Mac
lsof -i :5000
```

### Frontend Shows Old Code

**Symptom**: Changes not appearing, old bugs still present

**Causes**:
1. Browser cache
2. Need to rebuild (production)
3. Old build files

**Solutions**:
```bash
# Development: Hard refresh browser
# Ctrl+Shift+R (Windows/Linux)
# Cmd+Shift+R (Mac)

# Production: Rebuild
cd frontend
npm run build
```

---

## Environment Variable Reference

### Frontend Environment Variables

| Variable | Description | Local Value | Production Value |
|----------|-------------|-------------|------------------|
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:5000/api` | `http://vmi2804403.contaboserver.net/api` |

### Backend Environment Variables

Located in `backend/.env`:

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` or `production` |
| `PORT` | Backend server port | `5000` |
| `MONGODB_URI` | MongoDB connection | `mongodb://localhost:27017/parc360` |
| `JWT_SECRET` | JWT signing secret | `your-secret-key-here` |
| `JWT_EXPIRE` | JWT expiration time | `30d` |

---

## Best Practices

1. **Never commit `.env` files** to Git (they contain secrets)
2. **Always restart** after changing `.env` files
3. **Use environment variables** instead of hardcoding URLs
4. **Test locally first** before deploying to production
5. **Clear browser cache** after deploying updates
6. **Keep production and development configurations separate**

---

## Summary

- ✅ **Local development**: Use `http://localhost:5000/api`
- ✅ **Production**: Use `http://vmi2804403.contaboserver.net/api`
- ✅ **AuthContext fixed**: Now uses dynamic API URL
- ✅ **Restart required**: After changing `.env` files
- ✅ **Separate configs**: Different `.env` for dev and prod

---

**Current Status**:
- ✅ Local backend running on port 5000
- ✅ Local frontend running on port 3000
- ✅ Frontend configured for local development
- ✅ AuthContext using dynamic API URLs
- ✅ Ready for development!

**Access your local app**: http://localhost:3000

**Login credentials** (if database is seeded):
- Email: `admin@parc360.ci`
- Password: `admin123`
