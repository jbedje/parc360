#!/bin/bash

# GitHub Secrets Setup Helper Script
# This script helps you prepare the values needed for GitHub Secrets

echo "=================================="
echo "PARC360 - GitHub Secrets Setup"
echo "=================================="
echo ""
echo "This script will help you prepare the values for GitHub Secrets."
echo "You'll need to manually add these to GitHub at:"
echo "https://github.com/jbedje/parc360/settings/secrets/actions"
echo ""

# Check if SSH key exists
SSH_KEY_PATH="$HOME/.ssh/parc360_deploy"

if [ ! -f "$SSH_KEY_PATH" ]; then
    echo "❌ SSH key not found at $SSH_KEY_PATH"
    echo ""
    echo "Generating new SSH key pair..."
    ssh-keygen -t rsa -b 4096 -C "github-actions-parc360" -f "$SSH_KEY_PATH" -N ""
    echo "✅ SSH key pair generated!"
    echo ""
else
    echo "✅ SSH key found at $SSH_KEY_PATH"
    echo ""
fi

# Display public key
echo "=================================="
echo "1. PUBLIC KEY (Add to Contabo VM)"
echo "=================================="
echo ""
echo "Copy this public key and add it to your Contabo VM:"
echo ""
cat "${SSH_KEY_PATH}.pub"
echo ""
echo "To add it to your VM, run this command on the VM:"
echo "  mkdir -p ~/.ssh && echo \"$(cat ${SSH_KEY_PATH}.pub)\" >> ~/.ssh/authorized_keys"
echo ""
read -p "Press Enter once you've added the public key to your VM..."
echo ""

# Test SSH connection
echo "=================================="
echo "2. TESTING SSH CONNECTION"
echo "=================================="
echo ""
echo "Testing SSH connection to vmi2804403.contaboserver.net..."
ssh -i "$SSH_KEY_PATH" -o ConnectTimeout=10 -o StrictHostKeyChecking=no root@vmi2804403.contaboserver.net "echo 'Connection successful!'" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ SSH connection successful!"
else
    echo "❌ SSH connection failed. Please check:"
    echo "   - VM hostname: vmi2804403.contaboserver.net"
    echo "   - Public key added to VM's ~/.ssh/authorized_keys"
    echo "   - VM firewall allows SSH (port 22)"
fi
echo ""

# Generate JWT secret
echo "=================================="
echo "3. GENERATING JWT SECRET"
echo "=================================="
echo ""
JWT_SECRET=$(openssl rand -base64 32)
echo "Generated JWT Secret: $JWT_SECRET"
echo ""

# Display all secrets to add
echo "=================================="
echo "4. GITHUB SECRETS TO ADD"
echo "=================================="
echo ""
echo "Go to: https://github.com/jbedje/parc360/settings/secrets/actions"
echo "Click 'New repository secret' and add each of these:"
echo ""

echo "-----------------------------------"
echo "Secret Name: SSH_HOST"
echo "Secret Value:"
echo "vmi2804403.contaboserver.net"
echo "-----------------------------------"
echo ""

echo "-----------------------------------"
echo "Secret Name: SSH_USERNAME"
echo "Secret Value:"
echo "root"
echo "-----------------------------------"
echo ""

echo "-----------------------------------"
echo "Secret Name: SSH_PRIVATE_KEY"
echo "Secret Value:"
echo "-----------------------------------"
cat "$SSH_KEY_PATH"
echo "-----------------------------------"
echo ""

echo "-----------------------------------"
echo "Secret Name: SSH_PORT"
echo "Secret Value:"
echo "22"
echo "-----------------------------------"
echo ""

echo "-----------------------------------"
echo "Secret Name: REACT_APP_API_URL"
echo "Secret Value:"
echo "http://vmi2804403.contaboserver.net/api"
echo "Note: Change to https:// after SSL setup"
echo "-----------------------------------"
echo ""

echo "-----------------------------------"
echo "Secret Name: JWT_SECRET"
echo "Secret Value:"
echo "$JWT_SECRET"
echo "-----------------------------------"
echo ""

echo "-----------------------------------"
echo "Secret Name: MONGODB_URI"
echo "Secret Value:"
echo "mongodb://localhost:27017/parc360"
echo "-----------------------------------"
echo ""

# Save to file for reference
SECRETS_FILE="github-secrets-values.txt"
cat > "$SECRETS_FILE" << EOF
PARC360 - GitHub Secrets Values
Generated: $(date)

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
$(cat "$SSH_KEY_PATH")

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
$JWT_SECRET

-----------------------------------
MONGODB_URI
-----------------------------------
mongodb://localhost:27017/parc360

EOF

echo "=================================="
echo "5. SAVED TO FILE"
echo "=================================="
echo ""
echo "✅ All secret values have been saved to: $SECRETS_FILE"
echo ""
echo "⚠️  IMPORTANT: This file contains sensitive data!"
echo "   - Keep it secure"
echo "   - Delete it after adding secrets to GitHub"
echo "   - Never commit it to Git"
echo ""

# Next steps
echo "=================================="
echo "6. NEXT STEPS"
echo "=================================="
echo ""
echo "1. ✅ Add all secrets to GitHub (see above or $SECRETS_FILE)"
echo "2. ⏳ Prepare your Contabo VM (run initial setup)"
echo "3. ⏳ Test deployment (push to main branch)"
echo ""
echo "For initial VM setup, see: DEPLOYMENT_GUIDE.md"
echo "For quick deployment, see: QUICK_DEPLOY.md"
echo ""
echo "=================================="
echo "Setup complete!"
echo "=================================="
