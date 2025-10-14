# GitHub Secrets Setup Helper Script for Windows
# This script helps you prepare the values needed for GitHub Secrets

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "PARC360 - GitHub Secrets Setup" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "This script will help you prepare the values for GitHub Secrets."
Write-Host "You'll need to manually add these to GitHub at:"
Write-Host "https://github.com/jbedje/parc360/settings/secrets/actions" -ForegroundColor Yellow
Write-Host ""

# Check if SSH directory exists
$sshDir = "$env:USERPROFILE\.ssh"
if (-not (Test-Path $sshDir)) {
    New-Item -ItemType Directory -Path $sshDir | Out-Null
}

$sshKeyPath = "$sshDir\parc360_deploy"

# Check if SSH key exists
if (-not (Test-Path $sshKeyPath)) {
    Write-Host "❌ SSH key not found at $sshKeyPath" -ForegroundColor Red
    Write-Host ""
    Write-Host "To generate an SSH key, you have two options:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Option 1: Use Git Bash (if installed)" -ForegroundColor Green
    Write-Host "  ssh-keygen -t rsa -b 4096 -C 'github-actions-parc360' -f $sshKeyPath -N ''" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Option 2: Use Windows OpenSSH" -ForegroundColor Green
    Write-Host "  ssh-keygen -t rsa -b 4096 -C 'github-actions-parc360' -f $sshKeyPath" -ForegroundColor Gray
    Write-Host ""
    Write-Host "After generating the key, run this script again." -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit
} else {
    Write-Host "✅ SSH key found at $sshKeyPath" -ForegroundColor Green
    Write-Host ""
}

# Read SSH keys
$privateKey = Get-Content $sshKeyPath -Raw
$publicKey = Get-Content "$sshKeyPath.pub" -Raw

# Generate JWT secret (using .NET random)
$bytes = New-Object byte[] 32
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($bytes)
$jwtSecret = [Convert]::ToBase64String($bytes)

# Display public key
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "1. PUBLIC KEY (Add to Contabo VM)" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Copy this public key and add it to your Contabo VM:" -ForegroundColor Yellow
Write-Host ""
Write-Host $publicKey -ForegroundColor White
Write-Host ""
Write-Host "To add it to your VM, SSH in and run:" -ForegroundColor Yellow
Write-Host "  mkdir -p ~/.ssh && echo '$publicKey' >> ~/.ssh/authorized_keys" -ForegroundColor Gray
Write-Host "  chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys" -ForegroundColor Gray
Write-Host ""

# Copy public key to clipboard if possible
try {
    Set-Clipboard -Value $publicKey
    Write-Host "✅ Public key copied to clipboard!" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "⚠️  Could not copy to clipboard. Please copy manually." -ForegroundColor Yellow
    Write-Host ""
}

Read-Host "Press Enter once you've added the public key to your VM"
Write-Host ""

# Display all secrets
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "2. GITHUB SECRETS TO ADD" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Go to: https://github.com/jbedje/parc360/settings/secrets/actions" -ForegroundColor Yellow
Write-Host "Click 'New repository secret' and add each of these:" -ForegroundColor Yellow
Write-Host ""

Write-Host "-----------------------------------" -ForegroundColor DarkGray
Write-Host "Secret Name: SSH_HOST" -ForegroundColor Green
Write-Host "Secret Value:" -ForegroundColor Gray
Write-Host "vmi2804403.contaboserver.net" -ForegroundColor White
Write-Host "-----------------------------------" -ForegroundColor DarkGray
Write-Host ""

Write-Host "-----------------------------------" -ForegroundColor DarkGray
Write-Host "Secret Name: SSH_USERNAME" -ForegroundColor Green
Write-Host "Secret Value:" -ForegroundColor Gray
Write-Host "root" -ForegroundColor White
Write-Host "-----------------------------------" -ForegroundColor DarkGray
Write-Host ""

Write-Host "-----------------------------------" -ForegroundColor DarkGray
Write-Host "Secret Name: SSH_PRIVATE_KEY" -ForegroundColor Green
Write-Host "Secret Value:" -ForegroundColor Gray
Write-Host "-----------------------------------" -ForegroundColor DarkGray
Write-Host $privateKey -ForegroundColor White
Write-Host "-----------------------------------" -ForegroundColor DarkGray
Write-Host ""

Write-Host "-----------------------------------" -ForegroundColor DarkGray
Write-Host "Secret Name: SSH_PORT" -ForegroundColor Green
Write-Host "Secret Value:" -ForegroundColor Gray
Write-Host "22" -ForegroundColor White
Write-Host "-----------------------------------" -ForegroundColor DarkGray
Write-Host ""

Write-Host "-----------------------------------" -ForegroundColor DarkGray
Write-Host "Secret Name: REACT_APP_API_URL" -ForegroundColor Green
Write-Host "Secret Value:" -ForegroundColor Gray
Write-Host "http://vmi2804403.contaboserver.net/api" -ForegroundColor White
Write-Host "Note: Change to https:// after SSL setup" -ForegroundColor Yellow
Write-Host "-----------------------------------" -ForegroundColor DarkGray
Write-Host ""

Write-Host "-----------------------------------" -ForegroundColor DarkGray
Write-Host "Secret Name: JWT_SECRET" -ForegroundColor Green
Write-Host "Secret Value:" -ForegroundColor Gray
Write-Host $jwtSecret -ForegroundColor White
Write-Host "-----------------------------------" -ForegroundColor DarkGray
Write-Host ""

Write-Host "-----------------------------------" -ForegroundColor DarkGray
Write-Host "Secret Name: MONGODB_URI" -ForegroundColor Green
Write-Host "Secret Value:" -ForegroundColor Gray
Write-Host "mongodb://localhost:27017/parc360" -ForegroundColor White
Write-Host "-----------------------------------" -ForegroundColor DarkGray
Write-Host ""

# Save to file
$secretsFile = "github-secrets-values.txt"
$secretsContent = @"
PARC360 - GitHub Secrets Values
Generated: $(Get-Date)

Copy these values to GitHub Secrets:
https://github.com/jbedje/parc360/settings/secrets/actions

-----------------------------------
SSH_HOST
-----------------------------------
vmi2804403.contaboserver.net

-----------------------------------
SSH_USERNAME
-----------------------------------
root

-----------------------------------
SSH_PRIVATE_KEY
-----------------------------------
$privateKey

-----------------------------------
SSH_PORT
-----------------------------------
22

-----------------------------------
REACT_APP_API_URL
-----------------------------------
http://vmi2804403.contaboserver.net/api

-----------------------------------
JWT_SECRET
-----------------------------------
$jwtSecret

-----------------------------------
MONGODB_URI
-----------------------------------
mongodb://localhost:27017/parc360

"@

Set-Content -Path $secretsFile -Value $secretsContent

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "3. SAVED TO FILE" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ All secret values have been saved to: $secretsFile" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  IMPORTANT: This file contains sensitive data!" -ForegroundColor Red
Write-Host "   - Keep it secure" -ForegroundColor Yellow
Write-Host "   - Delete it after adding secrets to GitHub" -ForegroundColor Yellow
Write-Host "   - Never commit it to Git" -ForegroundColor Yellow
Write-Host ""

# Display next steps
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "4. NEXT STEPS" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. ✅ Add all secrets to GitHub (see above or $secretsFile)" -ForegroundColor Green
Write-Host "2. ⏳ Prepare your Contabo VM (run initial setup)" -ForegroundColor Yellow
Write-Host "3. ⏳ Test deployment (push to main branch)" -ForegroundColor Yellow
Write-Host ""
Write-Host "For initial VM setup, see: DEPLOYMENT_GUIDE.md" -ForegroundColor Gray
Write-Host "For quick deployment, see: QUICK_DEPLOY.md" -ForegroundColor Gray
Write-Host ""

# Open GitHub secrets page
$openGitHub = Read-Host "Do you want to open GitHub Secrets page in browser? (Y/N)"
if ($openGitHub -eq "Y" -or $openGitHub -eq "y") {
    Start-Process "https://github.com/jbedje/parc360/settings/secrets/actions"
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Setup complete!" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

Read-Host "Press Enter to exit"
