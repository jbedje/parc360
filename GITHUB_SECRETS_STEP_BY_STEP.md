# GitHub Secrets Configuration - Step-by-Step Guide

## 📋 What You'll Do

You'll add 7 secret values to GitHub that allow automated deployment to your Contabo VM.

**Time needed**: 10-15 minutes

---

## ✅ Prerequisites

- ✅ SSH keys generated (done by `setup-github-secrets.ps1`)
- ✅ Secret values saved in `github-secrets-values.txt`
- ✅ GitHub account with admin access to https://github.com/jbedje/parc360

---

## 🎯 Step-by-Step Instructions

### Step 1: Open GitHub Secrets Page

1. **Click this link**: https://github.com/jbedje/parc360/settings/secrets/actions

   OR manually navigate:
   - Go to https://github.com/jbedje/parc360
   - Click **"Settings"** tab (top right)
   - Click **"Secrets and variables"** in left sidebar
   - Click **"Actions"**

2. You should see a page titled **"Actions secrets and variables"**

---

### Step 2: Open Your Secrets File

1. Open File Explorer
2. Navigate to: `C:\Users\JeremieBEDJE\Downloads\PARC360`
3. **Double-click** `github-secrets-values.txt` to open it in Notepad

**Keep this file open** - you'll copy values from it!

---

### Step 3: Add Secret #1 - SSH_HOST

1. On the GitHub Secrets page, click the green **"New repository secret"** button

2. You'll see a form with two fields:
   - **Name**: (text input)
   - **Secret**: (large text area)

3. **Fill in the form**:
   - **Name**: Type exactly: `SSH_HOST`
   - **Secret**: Copy and paste: `vmi2804403.contaboserver.net`

4. Click the green **"Add secret"** button

5. ✅ You should see "SSH_HOST" in the list

---

### Step 4: Add Secret #2 - SSH_USERNAME

1. Click **"New repository secret"** again

2. **Fill in the form**:
   - **Name**: Type exactly: `SSH_USERNAME`
   - **Secret**: Type: `root`

3. Click **"Add secret"**

4. ✅ You should now see 2 secrets

---

### Step 5: Add Secret #3 - SSH_PRIVATE_KEY

⚠️ **This is the longest secret - be careful!**

1. Click **"New repository secret"** again

2. **Fill in the form**:
   - **Name**: Type exactly: `SSH_PRIVATE_KEY`
   - **Secret**: Go to `github-secrets-values.txt` and copy **EVERYTHING** from:
     ```
     -----BEGIN OPENSSH PRIVATE KEY-----
     ```
     to
     ```
     -----END OPENSSH PRIVATE KEY-----
     ```

     **Important**:
     - Include the BEGIN and END lines
     - Copy ALL the lines in between
     - Don't add extra spaces or line breaks

3. Click **"Add secret"**

4. ✅ You should now see 3 secrets

---

### Step 6: Add Secret #4 - SSH_PORT

1. Click **"New repository secret"**

2. **Fill in the form**:
   - **Name**: Type exactly: `SSH_PORT`
   - **Secret**: Type: `22`

3. Click **"Add secret"**

4. ✅ You should now see 4 secrets

---

### Step 7: Add Secret #5 - REACT_APP_API_URL

1. Click **"New repository secret"**

2. **Fill in the form**:
   - **Name**: Type exactly: `REACT_APP_API_URL`
   - **Secret**: Copy from file: `http://vmi2804403.contaboserver.net/api`

3. Click **"Add secret"**

4. ✅ You should now see 5 secrets

---

### Step 8: Add Secret #6 - JWT_SECRET

1. Click **"New repository secret"**

2. **Fill in the form**:
   - **Name**: Type exactly: `JWT_SECRET`
   - **Secret**: Copy from `github-secrets-values.txt` (should look like: `alv+xaxghcnglVMQ0RL+t6iSpP1k6eaKQxt1h1l+mDk=`)

3. Click **"Add secret"**

4. ✅ You should now see 6 secrets

---

### Step 9: Add Secret #7 - MONGODB_URI

1. Click **"New repository secret"**

2. **Fill in the form**:
   - **Name**: Type exactly: `MONGODB_URI`
   - **Secret**: Type: `mongodb://localhost:27017/parc360`

3. Click **"Add secret"**

4. ✅ You should now see **all 7 secrets**!

---

### Step 10: Verify All Secrets Are Added

You should see this list on the GitHub Secrets page:

```
Repository secrets (7)

MONGODB_URI             Updated now by [your-username]
JWT_SECRET              Updated now by [your-username]
REACT_APP_API_URL       Updated now by [your-username]
SSH_PORT                Updated now by [your-username]
SSH_PRIVATE_KEY         Updated now by [your-username]
SSH_USERNAME            Updated now by [your-username]
SSH_HOST                Updated now by [your-username]
```

**If you see all 7**, you're done! ✅

---

## ⚠️ Common Mistakes to Avoid

### ❌ Wrong Secret Names
Make sure the names are **EXACTLY** as shown (case-sensitive):
- ✅ `SSH_HOST` - Correct
- ❌ `ssh_host` - Wrong
- ❌ `SSH_HOST ` - Wrong (extra space)

### ❌ Missing BEGIN/END in SSH_PRIVATE_KEY
The private key **MUST** include:
```
-----BEGIN OPENSSH PRIVATE KEY-----
[lots of lines]
-----END OPENSSH PRIVATE KEY-----
```

### ❌ Extra Spaces or Line Breaks
Copy values **exactly** as they appear in `github-secrets-values.txt`

---

## 🧪 Testing the Secrets

Once all 7 secrets are added, test the CI/CD:

### Option 1: Make a Small Change
```bash
# In your terminal
cd C:\Users\JeremieBEDJE\Downloads\PARC360
git commit --allow-empty -m "Test CI/CD deployment"
git push origin main
```

### Option 2: Watch the Existing Workflow
Go to: https://github.com/jbedje/parc360/actions

Click "Re-run all jobs" on the failed deployment

---

## 🎉 What Happens Next

When you push to the `main` branch:

1. **GitHub Actions** will automatically trigger
2. **Build Frontend** - React app will be built
3. **Deploy to Contabo VM** - Code will be deployed via SSH
4. **Restart Services** - PM2 and Nginx will restart
5. **Deployment Complete** - App updated at http://vmi2804403.contaboserver.net

You can watch the progress at: https://github.com/jbedje/parc360/actions

---

## 📊 Quick Reference - All 7 Secrets

| # | Secret Name | Where to Get Value |
|---|------------|-------------------|
| 1 | `SSH_HOST` | `vmi2804403.contaboserver.net` |
| 2 | `SSH_USERNAME` | `root` |
| 3 | `SSH_PRIVATE_KEY` | Copy from `github-secrets-values.txt` (lines 20-68) |
| 4 | `SSH_PORT` | `22` |
| 5 | `REACT_APP_API_URL` | `http://vmi2804403.contaboserver.net/api` |
| 6 | `JWT_SECRET` | Copy from `github-secrets-values.txt` (line 84) |
| 7 | `MONGODB_URI` | `mongodb://localhost:27017/parc360` |

---

## 🔒 Security Notes

### After Adding Secrets:

1. **Delete `github-secrets-values.txt`**
   - This file contains sensitive data
   - It's only needed during setup
   - Right-click → Delete after you're done

2. **Never Share SSH Private Key**
   - Don't email it
   - Don't post it online
   - Don't commit it to Git

3. **GitHub Secrets Are Safe**
   - GitHub encrypts all secrets
   - They can't be viewed after creation (only updated)
   - They're only available to GitHub Actions

---

## ❓ Troubleshooting

### "I made a typo in a secret name"
- You can delete and re-create the secret
- Click the secret → Click "Remove" → Add it again

### "I can't see the secret value after adding it"
- This is normal! GitHub hides secret values for security
- If you need to change it, click "Update" on the secret

### "The deployment still fails"
- Check that all 7 secrets are added
- Verify the secret names are exact (case-sensitive)
- Check the Actions tab for specific errors
- Make sure your VM is set up (see `VM_SETUP_INSTRUCTIONS.md`)

### "I lost the github-secrets-values.txt file"
- Run `setup-github-secrets.ps1` again
- It will generate a new file with new values
- You'll need to update all secrets in GitHub

---

## 📚 Related Documentation

- **VM Setup**: See `VM_SETUP_INSTRUCTIONS.md`
- **Deployment Guide**: See `DEPLOYMENT_GUIDE.md`
- **Quick Deploy**: See `QUICK_DEPLOY.md`
- **Environment Setup**: See `ENVIRONMENT_SETUP.md`

---

## ✅ Checklist

Before you start:
- [ ] Ran `setup-github-secrets.ps1`
- [ ] Have `github-secrets-values.txt` file open
- [ ] Logged into GitHub with admin access

During setup:
- [ ] Added SSH_HOST
- [ ] Added SSH_USERNAME
- [ ] Added SSH_PRIVATE_KEY (with BEGIN/END lines)
- [ ] Added SSH_PORT
- [ ] Added REACT_APP_API_URL
- [ ] Added JWT_SECRET
- [ ] Added MONGODB_URI

After setup:
- [ ] Verified all 7 secrets are in the list
- [ ] Deleted `github-secrets-values.txt`
- [ ] Tested deployment by pushing to main

---

## 🎯 Summary

**You need to**:
1. Go to https://github.com/jbedje/parc360/settings/secrets/actions
2. Click "New repository secret" **7 times**
3. Add each secret with the exact name and value from `github-secrets-values.txt`
4. Verify all 7 are in the list
5. Test by pushing to main branch

**After this**, every push to `main` will automatically deploy to your Contabo server! 🚀

---

**Generated for PARC360 - Fleet Management Application**
**Need help?** Check the troubleshooting section or create an issue on GitHub.
