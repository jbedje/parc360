# 🚀 Guide de Déploiement PARC360 sur Contabo VM

## 📋 Prérequis

- ✅ VM Contabo (vmi2804403.contaboserver.net)
- ✅ Accès SSH root ou sudo
- ✅ Git installé sur la VM
- ✅ Node.js 18+ et npm
- ✅ MongoDB installé ou accessible (local/cloud)
- ✅ Compte GitHub avec repository parc360

---

## 🔧 PARTIE 1 : Configuration de la VM Contabo

### Étape 1 : Connexion à la VM

```bash
ssh root@vmi2804403.contaboserver.net
# Ou avec votre utilisateur
ssh votre-user@vmi2804403.contaboserver.net
```

### Étape 2 : Mise à jour du système

```bash
sudo apt update && sudo apt upgrade -y
```

### Étape 3 : Installation de Node.js 18

```bash
# Installer Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Vérifier l'installation
node --version  # Devrait afficher v18.x.x
npm --version
```

### Étape 4 : Installation de MongoDB

**Option A : MongoDB Local**
```bash
# Import de la clé publique
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Ajout du repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Installation
sudo apt update
sudo apt install -y mongodb-org

# Démarrer MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Vérifier le statut
sudo systemctl status mongod
```

**Option B : MongoDB Atlas (Cloud)**
- Créer un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Créer un cluster gratuit
- Obtenir la connection string
- Autoriser l'IP de votre VM dans MongoDB Atlas

### Étape 5 : Installation de PM2

```bash
sudo npm install -g pm2
```

### Étape 6 : Installation de Nginx

```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Étape 7 : Configuration du Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

---

## 📦 PARTIE 2 : Déploiement Initial de l'Application

### Étape 1 : Cloner le repository

```bash
# Créer le répertoire de l'application
sudo mkdir -p /var/www/parc360
sudo chown -R $USER:$USER /var/www/parc360

# Cloner le repository
cd /var/www
git clone https://github.com/jbedje/parc360.git
cd parc360
```

### Étape 2 : Configuration Backend (.env)

```bash
# Créer le fichier .env backend
cd /var/www/parc360/backend
nano .env
```

Contenu du fichier `.env` :
```env
# Server
PORT=5000
NODE_ENV=production

# MongoDB
MONGODB_URI=mongodb://localhost:27017/parc360
# Ou pour MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/parc360?retryWrites=true&w=majority

# JWT
JWT_SECRET=votre_secret_jwt_tres_securise_et_long_pour_production
JWT_EXPIRE=30d

# Optional
ADMIN_EMAIL=admin@parc360.ci
```

**⚠️ IMPORTANT** : Générer un JWT_SECRET fort :
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Étape 3 : Configuration Frontend (.env)

```bash
# Créer le fichier .env frontend
cd /var/www/parc360/frontend
nano .env
```

Contenu du fichier `.env` :
```env
# Production API URL
REACT_APP_API_URL=http://vmi2804403.contaboserver.net/api

# Ou avec votre domaine personnalisé:
# REACT_APP_API_URL=https://parc360.votre-domaine.com/api
```

### Étape 4 : Installation des dépendances et build

```bash
# Backend
cd /var/www/parc360/backend
npm ci --production

# Frontend
cd /var/www/parc360/frontend
npm ci
npm run build
```

### Étape 5 : Seed de la base de données (optionnel)

```bash
cd /var/www/parc360/backend
node scripts/seed.js
```

Cela créera :
- Utilisateur admin: `admin@parc360.ci` / `admin123`
- 7 véhicules de test
- 5 conducteurs
- Données de test

### Étape 6 : Démarrer l'application avec PM2

```bash
cd /var/www/parc360
pm2 start ecosystem.config.js
pm2 save
sudo pm2 startup systemd -u $USER --hp /home/$USER
```

### Étape 7 : Configurer Nginx

```bash
# Copier la configuration Nginx
sudo cp /var/www/parc360/nginx.conf /etc/nginx/sites-available/parc360

# Créer un lien symbolique
sudo ln -s /etc/nginx/sites-available/parc360 /etc/nginx/sites-enabled/

# Supprimer la configuration par défaut (optionnel)
sudo rm /etc/nginx/sites-enabled/default

# Tester la configuration
sudo nginx -t

# Recharger Nginx
sudo systemctl reload nginx
```

### Étape 8 : Vérifier le déploiement

```bash
# Vérifier PM2
pm2 status
pm2 logs parc360-backend

# Vérifier Nginx
sudo systemctl status nginx

# Tester l'API
curl http://localhost:5000/api/auth/me
```

**Accéder à l'application** :
- Frontend: http://vmi2804403.contaboserver.net
- API: http://vmi2804403.contaboserver.net/api

---

## 🔐 PARTIE 3 : Configuration GitHub Actions (CI/CD)

### Étape 1 : Générer une clé SSH pour le déploiement

Sur votre VM :
```bash
# Générer une paire de clés SSH
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions -N ""

# Afficher la clé publique
cat ~/.ssh/github_actions.pub

# Ajouter la clé publique aux authorized_keys
cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# Afficher la clé privée (à copier pour GitHub Secrets)
cat ~/.ssh/github_actions
```

### Étape 2 : Configurer les GitHub Secrets

Aller sur : https://github.com/jbedje/parc360/settings/secrets/actions

Ajouter les secrets suivants :

| Nom du Secret | Valeur | Description |
|---------------|--------|-------------|
| `SSH_HOST` | `vmi2804403.contaboserver.net` | Hostname de votre VM |
| `SSH_USERNAME` | `root` ou votre user | Utilisateur SSH |
| `SSH_PRIVATE_KEY` | Contenu de `~/.ssh/github_actions` | Clé privée SSH |
| `SSH_PORT` | `22` | Port SSH (généralement 22) |
| `REACT_APP_API_URL` | `http://vmi2804403.contaboserver.net/api` | URL de l'API pour le frontend |

### Étape 3 : Tester le workflow

```bash
# Sur votre machine locale, faire un changement
echo "# Test deployment" >> README.md
git add .
git commit -m "test: Trigger CI/CD deployment"
git push origin main
```

Vérifier sur : https://github.com/jbedje/parc360/actions

---

## 🔒 PARTIE 4 : Sécurisation avec SSL (Let's Encrypt)

### Étape 1 : Installer Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### Étape 2 : Obtenir un certificat SSL

**Option A : Avec domaine personnalisé**
```bash
sudo certbot --nginx -d votre-domaine.com -d www.votre-domaine.com
```

**Option B : Avec hostname Contabo**
```bash
sudo certbot --nginx -d vmi2804403.contaboserver.net
```

### Étape 3 : Renouvellement automatique

```bash
# Tester le renouvellement
sudo certbot renew --dry-run

# Le renouvellement automatique est déjà configuré
sudo systemctl status certbot.timer
```

### Étape 4 : Mettre à jour l'URL de l'API

```bash
# Mettre à jour frontend/.env
cd /var/www/parc360/frontend
nano .env
```

Changer :
```env
REACT_APP_API_URL=https://vmi2804403.contaboserver.net/api
```

Rebuild et restart :
```bash
npm run build
pm2 restart parc360-backend
```

---

## 📊 PARTIE 5 : Monitoring et Maintenance

### PM2 Commands

```bash
# Voir le statut
pm2 status

# Voir les logs
pm2 logs parc360-backend

# Logs en temps réel
pm2 logs parc360-backend --lines 100

# Restart
pm2 restart parc360-backend

# Stop
pm2 stop parc360-backend

# Delete
pm2 delete parc360-backend

# Monitoring web
pm2 monit
```

### Logs

```bash
# Backend logs (PM2)
pm2 logs parc360-backend

# Nginx access logs
sudo tail -f /var/log/nginx/parc360-access.log

# Nginx error logs
sudo tail -f /var/log/nginx/parc360-error.log

# MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
```

### Backup MongoDB

```bash
# Créer un backup
mongodump --db parc360 --out /backups/mongodb/$(date +%Y%m%d)

# Restaurer un backup
mongorestore --db parc360 /backups/mongodb/20250101/parc360
```

### Mise à jour de l'application

**Méthode 1 : Automatique via GitHub Actions**
- Faire un push sur la branche main
- GitHub Actions déploiera automatiquement

**Méthode 2 : Manuel**
```bash
cd /var/www/parc360
git pull origin main
npm ci --production
cd frontend && npm ci && npm run build && cd ..
pm2 restart parc360-backend
```

---

## 🆘 Dépannage

### L'application ne démarre pas

```bash
# Vérifier les logs PM2
pm2 logs parc360-backend --err

# Vérifier la connexion MongoDB
mongo
# ou
mongosh

# Vérifier les variables d'environnement
cat /var/www/parc360/backend/.env
```

### Erreur 502 Bad Gateway

```bash
# Vérifier que le backend tourne
pm2 status
curl http://localhost:5000/api/auth/me

# Vérifier Nginx
sudo nginx -t
sudo systemctl status nginx

# Voir les logs Nginx
sudo tail -f /var/log/nginx/error.log
```

### Port déjà utilisé

```bash
# Trouver le processus utilisant le port 5000
sudo lsof -i :5000

# Tuer le processus
sudo kill -9 PID
```

### Problèmes de permissions

```bash
# Corriger les permissions
sudo chown -R $USER:$USER /var/www/parc360
chmod -R 755 /var/www/parc360
```

---

## ✅ Checklist de Déploiement

- [ ] VM mise à jour (apt update && upgrade)
- [ ] Node.js 18+ installé
- [ ] MongoDB installé et démarré
- [ ] PM2 installé globalement
- [ ] Nginx installé et démarré
- [ ] Firewall configuré (ports 80, 443, 22)
- [ ] Repository cloné dans `/var/www/parc360`
- [ ] Fichier `.env` créé pour backend
- [ ] Fichier `.env` créé pour frontend
- [ ] Dépendances backend installées
- [ ] Frontend build créé
- [ ] Base de données seedée (optionnel)
- [ ] Application démarrée avec PM2
- [ ] Configuration Nginx copiée et activée
- [ ] SSL configuré avec Let's Encrypt (recommandé)
- [ ] GitHub Secrets configurés
- [ ] Workflow GitHub Actions testé
- [ ] Monitoring activé (PM2, logs)
- [ ] Backup MongoDB configuré

---

## 📞 Commandes Utiles Récapitulatives

```bash
# Démarrage complet
cd /var/www/parc360
pm2 start ecosystem.config.js
sudo systemctl start nginx

# Arrêt complet
pm2 stop parc360-backend
sudo systemctl stop nginx

# Restart après mise à jour
cd /var/www/parc360 && git pull origin main
cd backend && npm ci --production && cd ..
cd frontend && npm ci && npm run build && cd ..
pm2 restart parc360-backend

# Monitoring
pm2 monit
sudo tail -f /var/log/nginx/parc360-access.log

# Backup
mongodump --db parc360 --out /backups/mongodb/$(date +%Y%m%d)
```

---

## 🎯 URLs d'Accès

- **Application** : http://vmi2804403.contaboserver.net
- **API** : http://vmi2804403.contaboserver.net/api
- **GitHub Actions** : https://github.com/jbedje/parc360/actions

---

**Bon déploiement ! 🚀**
