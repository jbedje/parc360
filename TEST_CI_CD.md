# 🧪 Test du CI/CD GitHub Actions avec Contabo

## Prérequis (À FAIRE EN PREMIER)

Avant de tester le CI/CD, vous DEVEZ:

### ✅ Étape Préalable 1: Ajouter la Clé SSH à Contabo

```bash
# 1. Connectez-vous à votre VM Contabo
ssh root@vmi2804403.contaboserver.net

# 2. Exécutez cette commande (copiez TOUT):
mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys << 'EOF'
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCvhfqrGuHIO6UWKXgFjjbX2sSvy+ex2RUxsBfoQcsuqDBmikxZ3kVh2TYg4I/b9hcARUbo8y2DX+qO2lCuV/onM8UTgIYMAA83lHX+TkOCjTBkmSMOIaKCX65vHvk78axS+kYwtUF1TUH23clj8xXR5AA2OSXZcMZbAOGvEJvMgSvGiIhvnRcRrkjefm5A9t9JHJ/N6GDgmVcZ0uxs+za0D9NpvOitsWdG/X+sWHgiGT62Aq2PflOWjNt184G4r+eC91b3fMOky91zJmOIhDpllS+Mr8E8+cKUe0zXF4gHoaK/g8dcZuHbP1o0R3wMsbIYNYAYpWTrY/p+UqZWH0t6drYD1+FRsnhBvkS0nQMpbYg9Gbl1LQ6iVtJhv7VWyaI8GJgQ/yxWjeNx17u6MtWLYQKZh69v+2J/P1Lscg9v8IGi3YXnHceLOCgRjHvKojGHFWPQwvIxtJALwGvqM7/VlsjEnFSpQ1lCsq8S+J9AR83/wESegwAcF8o6QcHcJlbTdlWNXpwZJWFGInE+7BpcPrYMaGMCnKh8XVubtOgDy3Cqz/o739YHF4erZF7/e8z0XPrI+gnCDI2FFTYQXvv2faQwfcqCk0TN12fotq1oXRLyG4rw36OE2egcqz7KA2eP0HNa9uJTgnBe5PDvcoUNN/nCp4O0dlmhUGZ7qZFbVw== github-actions-parc360@contabo
EOF
chmod 600 ~/.ssh/authorized_keys

# 3. Vérifiez que la clé a été ajoutée
echo "✅ Clé ajoutée:"
cat ~/.ssh/authorized_keys
```

### ✅ Étape Préalable 2: Configurer les GitHub Secrets

Allez sur: https://github.com/jbedje/parc360/settings/secrets/actions

**Ajoutez ces 7 secrets** (cliquez "New repository secret" pour chacun):

#### Secret 1: SSH_HOST
- **Name**: `SSH_HOST`
- **Secret**: `vmi2804403.contaboserver.net`

#### Secret 2: SSH_USERNAME
- **Name**: `SSH_USERNAME`
- **Secret**: `root`

#### Secret 3: SSH_PRIVATE_KEY
- **Name**: `SSH_PRIVATE_KEY`
- **Secret**: Ouvrez `CLES_SSH_PARC360.md` et copiez TOUTE la clé privée (de `-----BEGIN` à `-----END`)

#### Secret 4: SSH_PORT
- **Name**: `SSH_PORT`
- **Secret**: `22`

#### Secret 5: REACT_APP_API_URL
- **Name**: `REACT_APP_API_URL`
- **Secret**: `http://vmi2804403.contaboserver.net/api`

#### Secret 6: JWT_SECRET
- **Name**: `JWT_SECRET`
- **Secret**: `noTzpJL0t9JC00IZdQy9BZZDQT2MjvgXTubKsC6q4Z0=`

#### Secret 7: MONGODB_URI
- **Name**: `MONGODB_URI`
- **Secret**: `mongodb://localhost:27017/parc360`

---

## 🚀 Test du CI/CD

### Méthode 1: Commit Vide (Recommandé pour Test)

```bash
# Dans votre terminal Windows
cd C:\Users\JeremieBEDJE\Downloads\PARC360

# Créer un commit vide pour déclencher le CI/CD
git commit --allow-empty -m "🧪 Test CI/CD deployment to Contabo"

# Pousser vers GitHub (déclenche le workflow)
git push origin main
```

### Méthode 2: Ajouter un Fichier de Test

```bash
# Créer un fichier de test
echo "Test CI/CD deployment - $(date)" > TEST_DEPLOY.txt

# Ajouter et commiter
git add TEST_DEPLOY.txt
git commit -m "🧪 Test CI/CD deployment to Contabo"

# Pousser vers GitHub
git push origin main
```

---

## 📊 Surveiller le Déploiement

### 1. Ouvrir la Page GitHub Actions

Allez sur: https://github.com/jbedje/parc360/actions

Vous devriez voir:
- Un nouveau workflow en cours d'exécution: **"Deploy to Contabo VM"**
- Statut: 🟡 En cours... → ✅ Succès (ou ❌ Échec)

### 2. Voir les Détails du Workflow

Cliquez sur le workflow en cours pour voir:

**Étapes attendues**:
1. ✅ **Checkout code** - Récupération du code
2. ✅ **Setup Node.js** - Installation de Node.js
3. ✅ **Install Backend Dependencies** - Installation backend
4. ✅ **Install Frontend Dependencies** - Installation frontend
5. ✅ **Build Frontend** - Build React (avec CI=false)
6. ✅ **Deploy to Contabo VM** - Déploiement SSH vers VM
7. ✅ **Notify Deployment Success** - Notification de succès

### 3. Logs en Temps Réel

Cliquez sur chaque étape pour voir les logs détaillés.

**Étape importante**: "Deploy to Contabo VM"
```
Connecting to vmi2804403.contaboserver.net...
Pulling latest code...
Installing dependencies...
Building frontend...
Restarting PM2...
Reloading Nginx...
✅ Deployment completed successfully!
```

---

## ✅ Vérifier que le Déploiement a Fonctionné

### Vérification 1: GitHub Actions

Sur https://github.com/jbedje/parc360/actions

✅ Le workflow doit être **vert** (succès)

### Vérification 2: SSH dans la VM

```bash
# Se connecter à la VM
ssh root@vmi2804403.contaboserver.net

# Vérifier PM2
pm2 status
# Devrait montrer: parc360-backend | online

# Vérifier les logs
pm2 logs parc360-backend --lines 20
# Devrait montrer: "Serveur démarré sur le port 5000"

# Vérifier Nginx
systemctl status nginx
# Devrait être: active (running)

# Tester l'API
curl http://localhost:5000/api/health
# Devrait retourner: {"success":true,"message":"API is running"}
```

### Vérification 3: Application Web

Ouvrez dans votre navigateur: http://vmi2804403.contaboserver.net

✅ L'application devrait charger
✅ Vous pouvez vous connecter avec:
- Email: `admin@parc360.ci`
- Password: `admin123`

✅ Pas d'erreur 401
✅ Vous pouvez créer un véhicule

---

## 🔍 Dépannage

### ❌ Erreur: "Host key verification failed"

**Problème**: GitHub Actions ne peut pas se connecter à la VM

**Solution**:
```bash
# Sur votre VM, ajoutez la clé SSH à known_hosts
ssh-keyscan -H vmi2804403.contaboserver.net >> ~/.ssh/known_hosts
```

### ❌ Erreur: "Permission denied (publickey)"

**Problème**: La clé SSH n'est pas configurée correctement

**Solutions**:
1. Vérifiez que la clé publique est dans `~/.ssh/authorized_keys` sur la VM
2. Vérifiez que `SSH_PRIVATE_KEY` dans GitHub Secrets contient TOUTE la clé (BEGIN et END inclus)
3. Vérifiez les permissions:
```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

### ❌ Erreur: "Build failed" (ESLint warnings)

**Problème**: ESLint warnings bloquent le build

**Solution**: Déjà corrigé avec `CI=false` dans le workflow

### ❌ Erreur: "pm2: command not found"

**Problème**: PM2 n'est pas installé sur la VM

**Solution**:
```bash
# Sur la VM
npm install -g pm2
```

### ❌ Le workflow ne se déclenche pas

**Vérifications**:
1. Vous avez bien poussé vers la branche `main`
2. Le fichier `.github/workflows/deploy.yml` existe
3. GitHub Actions est activé dans les paramètres du repo

---

## 📝 Chronologie d'un Déploiement Réussi

**Temps total estimé**: 3-5 minutes

```
00:00 - git push origin main
00:05 - GitHub détecte le push
00:10 - Workflow démarre
00:30 - Checkout code ✅
00:40 - Setup Node.js ✅
01:00 - Install dependencies ✅
02:00 - Build frontend ✅
02:30 - SSH connexion à Contabo ✅
03:00 - Pull code sur VM ✅
03:30 - Install deps sur VM ✅
04:00 - Build frontend sur VM ✅
04:30 - Restart PM2 ✅
04:45 - Reload Nginx ✅
05:00 - Déploiement terminé ✅
```

---

## 🎯 Checklist Complète

### Avant le Test:
- [ ] Clé SSH publique ajoutée à Contabo VM
- [ ] Les 7 GitHub Secrets configurés
- [ ] VM Contabo prête (Node.js, MongoDB, PM2, Nginx installés)
- [ ] Application déjà déployée manuellement une fois

### Pendant le Test:
- [ ] Commit créé et poussé vers GitHub
- [ ] Workflow visible dans GitHub Actions
- [ ] Toutes les étapes passent au vert

### Après le Test:
- [ ] Application accessible sur http://vmi2804403.contaboserver.net
- [ ] Connexion fonctionne (admin@parc360.ci / admin123)
- [ ] Pas d'erreur 401
- [ ] Création de véhicule fonctionne

---

## 🚀 Après un Test Réussi

**Félicitations!** 🎉

Votre pipeline CI/CD est maintenant configuré!

**Ce qui se passe maintenant**:
- ✅ Chaque `git push` vers `main` déploie automatiquement
- ✅ Pas besoin de SSH manuellement
- ✅ Pas besoin de rebuild manuellement
- ✅ Déploiement automatique en 3-5 minutes

**Workflow de développement**:
```bash
# 1. Développez localement
# 2. Testez en local
# 3. Commitez vos changements
git add .
git commit -m "Nouvelle fonctionnalité XYZ"

# 4. Poussez (déploie automatiquement!)
git push origin main

# 5. Attendez 3-5 minutes
# 6. Vérifiez sur http://vmi2804403.contaboserver.net
```

---

## 📚 Ressources

- **GitHub Actions**: https://github.com/jbedje/parc360/actions
- **Workflow File**: `.github/workflows/deploy.yml`
- **VM**: vmi2804403.contaboserver.net
- **Application**: http://vmi2804403.contaboserver.net

---

## 🔒 Sécurité Post-Test

Après un test réussi, **supprimez les fichiers sensibles**:

```bash
cd C:\Users\JeremieBEDJE\Downloads\PARC360
del parc360-deploy-key
del parc360-deploy-key.pub
del generate-jwt.ps1
# Gardez CLES_SSH_PARC360.md au cas où vous avez besoin de référence
```

---

**Prêt à tester?** Suivez les étapes ci-dessus! 🚀
