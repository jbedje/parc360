# 🚨 URGENT: Update Production Server Now

## The Problem

Your **production server** (http://vmi2804403.contaboserver.net) has the **old code** that causes 401 errors. You need to update it with the AuthContext fix.

---

## ✅ Quick Solution (5 minutes)

### Option 1: SSH and Update Manually

**Run these commands on your Contabo VM:**

```bash
# 1. SSH into your VM
ssh root@vmi2804403.contaboserver.net

# 2. Navigate to app directory
cd /var/www/parc360

# 3. Pull latest code (includes AuthContext fix)
git pull origin main

# 4. Set correct environment variable
echo "REACT_APP_API_URL=http://vmi2804403.contaboserver.net/api" > frontend/.env

# 5. Reinstall and rebuild frontend
cd frontend
npm install
npm run build

# 6. Restart backend
cd ..
pm2 restart parc360-backend || pm2 start ecosystem.config.js

# 7. Reload Nginx
sudo systemctl reload nginx

# 8. Check status
pm2 status
```

---

### Option 2: Use the Update Script (Even Faster)

```bash
# SSH into VM
ssh root@vmi2804403.contaboserver.net

# Run update script
cd /var/www/parc360
./update-production.sh
```

---

## 🧪 After Update - Test It

1. **Clear browser cache**:
   - Press `Ctrl + Shift + Delete`
   - Select "Cached images and files"
   - Click "Clear data"

2. **Go to production**: http://vmi2804403.contaboserver.net

3. **Login**:
   - Email: `admin@parc360.ci`
   - Password: `admin123`

4. **Try creating a vehicle**:
   - The 401 error should be **GONE** ✅

---

## 📝 What This Does

The update will:
- ✅ Pull the AuthContext fix from GitHub
- ✅ Set production API URL in .env
- ✅ Rebuild frontend with the fix
- ✅ Restart all services
- ✅ Fix the 401 Unauthorized errors

---

## ⏰ Do This Now

**Before configuring GitHub Secrets**, update the production server so it works properly.

**After you update**, you can:
1. ✅ Use the production app immediately
2. ✅ Configure GitHub Secrets for automated future deployments
3. ✅ Every future push will auto-deploy

---

## 🔍 Verify It Worked

After running the update, check:

```bash
# On VM
pm2 logs parc360-backend --lines 20

# Should show no errors
```

Then test:
```bash
curl http://localhost:5000/api/health
# Should return: {"success":true,"message":"API is running"}
```

---

**Run the update now, then come back to configure GitHub Secrets!** 🚀
