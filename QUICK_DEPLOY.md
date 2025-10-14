# ⚡ Quick Deploy - PARC360 sur Contabo VM

Guide rapide en 5 minutes pour déployer PARC360 sur votre VM Contabo.

---

## 🎯 Vue d'Ensemble

**VM** : vmi2804403.contaboserver.net
**Repository** : https://github.com/jbedje/parc360
**Architecture** : Backend (Node.js + MongoDB) + Frontend (React)
**Reverse Proxy** : Nginx
**Process Manager** : PM2
**CI/CD** : GitHub Actions

---

## 🚀 Déploiement en 5 Étapes

### 1️⃣ Connexion à la VM et Installation des Prérequis

```bash
# Se connecter à la VM
ssh root@vmi2804403.contaboserver.net

# Mise à jour du système
sudo apt update && sudo apt upgrade -y

# Installation de Node.js 18, MongoDB, PM2, Nginx
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs mongodb-org nginx
sudo npm install -g pm2

# Démarrer les services
sudo systemctl start mongod nginx
sudo systemctl enable mongod nginx
```

### 2️⃣ Cloner et Configurer l'Application

```bash
# Cloner le repository
sudo mkdir -p /var/www
cd /var/www
git clone https://github.com/jbedje/parc360.git
cd parc360
sudo chown -R $USER:$USER /var/www/parc360

# Configuration Backend
cd backend
cp .env.example .env
nano .env  # Éditer avec vos valeurs
npm ci --production

# Configuration Frontend
cd ../frontend
cp .env.example .env
nano .env  # Éditer REACT_APP_API_URL
npm ci
npm run build
```

**Contenu minimal de `backend/.env`** :
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/parc360
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
JWT_EXPIRE=30d
```

**Contenu minimal de `frontend/.env`** :
```env
REACT_APP_API_URL=http://vmi2804403.contaboserver.net/api
```

### 3️⃣ Démarrer l'Application avec PM2

```bash
cd /var/www/parc360
pm2 start ecosystem.config.js
pm2 save
sudo pm2 startup systemd -u $USER --hp /home/$USER
```

### 4️⃣ Configurer Nginx

```bash
# Copier la configuration
sudo cp nginx.conf /etc/nginx/sites-available/parc360
sudo ln -s /etc/nginx/sites-available/parc360 /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Tester et recharger
sudo nginx -t
sudo systemctl reload nginx
```

### 5️⃣ Seed de la Base de Données (Optionnel)

```bash
cd /var/www/parc360/backend
node scripts/seed.js
```

✅ **C'est tout ! Votre application est maintenant accessible à :**
- Frontend: http://vmi2804403.contaboserver.net
- API: http://vmi2804403.contaboserver.net/api

**Connexion par défaut** :
- Email: `admin@parc360.ci`
- Password: `admin123`

---

## 🔐 Configuration CI/CD GitHub Actions

### Étape 1 : Générer une Clé SSH

Sur la VM :
```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions -N ""
cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys
cat ~/.ssh/github_actions  # Copier la clé privée
```

### Étape 2 : Ajouter les Secrets GitHub

Aller sur : https://github.com/jbedje/parc360/settings/secrets/actions

Ajouter :
- `SSH_HOST` = `vmi2804403.contaboserver.net`
- `SSH_USERNAME` = `root` (ou votre user)
- `SSH_PRIVATE_KEY` = (coller la clé privée)
- `SSH_PORT` = `22`
- `REACT_APP_API_URL` = `http://vmi2804403.contaboserver.net/api`

### Étape 3 : Tester

```bash
# Sur votre machine locale
echo "# Test CI/CD" >> README.md
git add .
git commit -m "test: CI/CD deployment"
git push origin main
```

Vérifier sur : https://github.com/jbedje/parc360/actions

---

## 🔒 Activer SSL (Recommandé)

```bash
# Installer Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtenir un certificat SSL
sudo certbot --nginx -d vmi2804403.contaboserver.net

# Le renouvellement est automatique !
```

Après SSL, mettre à jour `frontend/.env` :
```env
REACT_APP_API_URL=https://vmi2804403.contaboserver.net/api
```

Rebuild :
```bash
cd /var/www/parc360/frontend
npm run build
pm2 restart parc360-backend
```

---

## 📊 Commandes Utiles

```bash
# Status des services
pm2 status
sudo systemctl status nginx
sudo systemctl status mongod

# Logs
pm2 logs parc360-backend
sudo tail -f /var/log/nginx/parc360-access.log

# Restart
pm2 restart parc360-backend
sudo systemctl reload nginx

# Mise à jour manuelle
cd /var/www/parc360
git pull origin main
cd backend && npm ci --production && cd ..
cd frontend && npm ci && npm run build && cd ..
pm2 restart parc360-backend

# Health Check
cd /var/www/parc360
bash check-deployment.sh
```

---

## 🆘 Dépannage Rapide

**Backend ne démarre pas** :
```bash
pm2 logs parc360-backend --err
cat /var/www/parc360/backend/.env
```

**Erreur 502** :
```bash
pm2 status  # Backend doit être "online"
sudo systemctl status nginx
sudo nginx -t
```

**Port déjà utilisé** :
```bash
sudo lsof -i :5000
sudo kill -9 <PID>
pm2 restart parc360-backend
```

---

## 📚 Documentation Complète

Pour plus de détails, consultez :
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Guide complet étape par étape
- **[README.md](README.md)** - Documentation de l'application
- **[PUSH_TO_GITHUB.md](PUSH_TO_GITHUB.md)** - Guide Git/GitHub

---

## ✅ Checklist de Déploiement

- [ ] Node.js 18+ installé
- [ ] MongoDB installé et démarré
- [ ] PM2 installé
- [ ] Nginx installé et configuré
- [ ] Repository cloné
- [ ] Fichiers .env créés
- [ ] Dépendances installées
- [ ] Frontend build créé
- [ ] PM2 démarré
- [ ] Nginx configuré
- [ ] Application accessible
- [ ] GitHub Secrets configurés
- [ ] CI/CD testé
- [ ] SSL activé (recommandé)

---

**Temps estimé** : 15-20 minutes (première fois), 5 minutes (déploiements suivants via CI/CD)

**Support** : Consultez les logs avec `pm2 logs` et `sudo tail -f /var/log/nginx/error.log`

🎉 **Bon déploiement !**
