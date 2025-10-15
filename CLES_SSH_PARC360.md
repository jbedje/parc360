# 🔑 Clés SSH et Secrets pour PARC360

## ✅ Paire de Clés Générée

J'ai généré une nouvelle paire de clés SSH RSA 4096 bits spécialement pour votre déploiement.

---

## 📋 ÉTAPE 1: Ajouter la Clé Publique à Contabo VM

### Connexion à votre VM:
```bash
ssh root@vmi2804403.contaboserver.net
```

### Commande à exécuter sur la VM:
```bash
# Créer le répertoire .ssh si nécessaire
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Ajouter la clé publique
cat >> ~/.ssh/authorized_keys << 'EOF'
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCvhfqrGuHIO6UWKXgFjjbX2sSvy+ex2RUxsBfoQcsuqDBmikxZ3kVh2TYg4I/b9hcARUbo8y2DX+qO2lCuV/onM8UTgIYMAA83lHX+TkOCjTBkmSMOIaKCX65vHvk78axS+kYwtUF1TUH23clj8xXR5AA2OSXZcMZbAOGvEJvMgSvGiIhvnRcRrkjefm5A9t9JHJ/N6GDgmVcZ0uxs+za0D9NpvOitsWdG/X+sWHgiGT62Aq2PflOWjNt184G4r+eC91b3fMOky91zJmOIhDpllS+Mr8E8+cKUe0zXF4gHoaK/g8dcZuHbP1o0R3wMsbIYNYAYpWTrY/p+UqZWH0t6drYD1+FRsnhBvkS0nQMpbYg9Gbl1LQ6iVtJhv7VWyaI8GJgQ/yxWjeNx17u6MtWLYQKZh69v+2J/P1Lscg9v8IGi3YXnHceLOCgRjHvKojGHFWPQwvIxtJALwGvqM7/VlsjEnFSpQ1lCsq8S+J9AR83/wESegwAcF8o6QcHcJlbTdlWNXpwZJWFGInE+7BpcPrYMaGMCnKh8XVubtOgDy3Cqz/o739YHF4erZF7/e8z0XPrI+gnCDI2FFTYQXvv2faQwfcqCk0TN12fotq1oXRLyG4rw36OE2egcqz7KA2eP0HNa9uJTgnBe5PDvcoUNN/nCp4O0dlmhUGZ7qZFbVw== github-actions-parc360@contabo
EOF

# Définir les permissions correctes
chmod 600 ~/.ssh/authorized_keys

# Vérifier que la clé a été ajoutée
cat ~/.ssh/authorized_keys
```

### ✅ Tester la Connexion SSH:
```bash
# Sur votre PC Windows, testez la connexion
# La connexion devrait fonctionner sans demander de mot de passe
ssh root@vmi2804403.contaboserver.net
```

---

## 📋 ÉTAPE 2: Ajouter les Secrets à GitHub

### Aller sur la page des secrets:
https://github.com/jbedje/parc360/settings/secrets/actions

### Cliquer sur "New repository secret" pour chaque secret ci-dessous:

---

### Secret #1: SSH_HOST
**Name**: `SSH_HOST`
**Secret**:
```
vmi2804403.contaboserver.net
```

---

### Secret #2: SSH_USERNAME
**Name**: `SSH_USERNAME`
**Secret**:
```
root
```

---

### Secret #3: SSH_PRIVATE_KEY
**Name**: `SSH_PRIVATE_KEY`
**Secret** (copiez TOUT de BEGIN à END):
```
-----BEGIN OPENSSH PRIVATE KEY-----
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
-----END OPENSSH PRIVATE KEY-----
```

⚠️ **IMPORTANT**: Copiez TOUTE la clé privée, y compris les lignes BEGIN et END!

---

### Secret #4: SSH_PORT
**Name**: `SSH_PORT`
**Secret**:
```
22
```

---

### Secret #5: REACT_APP_API_URL
**Name**: `REACT_APP_API_URL`
**Secret**:
```
http://vmi2804403.contaboserver.net/api
```

---

### Secret #6: JWT_SECRET
**Name**: `JWT_SECRET`
**Secret**:
```
noTzpJL0t9JC00IZdQy9BZZDQT2MjvgXTubKsC6q4Z0=
```

---

### Secret #7: MONGODB_URI
**Name**: `MONGODB_URI`
**Secret**:
```
mongodb://localhost:27017/parc360
```

---

## ✅ Vérification

Après avoir ajouté tous les secrets, vous devriez voir 7 secrets sur la page GitHub:

```
Repository secrets (7)

✅ MONGODB_URI
✅ JWT_SECRET
✅ REACT_APP_API_URL
✅ SSH_PORT
✅ SSH_PRIVATE_KEY
✅ SSH_USERNAME
✅ SSH_HOST
```

---

## 🧪 Test du Déploiement

Une fois tous les secrets configurés:

### 1. Tester la connexion SSH depuis GitHub
```bash
# Cette commande devrait fonctionner sans mot de passe
ssh -i parc360-deploy-key root@vmi2804403.contaboserver.net
```

### 2. Déclencher un déploiement automatique
```bash
cd C:\Users\JeremieBEDJE\Downloads\PARC360
git commit --allow-empty -m "Test déploiement automatique"
git push origin main
```

### 3. Surveiller le déploiement
Aller sur: https://github.com/jbedje/parc360/actions

Vous devriez voir:
- ✅ Build Frontend (succès)
- ✅ Deploy to Contabo VM (succès)
- ✅ Notify Deployment Success

---

## 🔒 Sécurité

### ⚠️ IMPORTANT - Après Configuration:

1. **Supprimez les fichiers de clés locaux**:
```bash
del parc360-deploy-key
del parc360-deploy-key.pub
del generate-jwt.ps1
```

2. **NE PARTAGEZ JAMAIS**:
   - ❌ La clé privée SSH
   - ❌ Le JWT_SECRET
   - ❌ Ce fichier CLES_SSH_PARC360.md (supprimez-le après utilisation)

3. **Les secrets GitHub sont sécurisés**:
   - ✅ Chiffrés par GitHub
   - ✅ Jamais visibles après création
   - ✅ Uniquement accessibles aux GitHub Actions

---

## 📝 Résumé des Fichiers

| Fichier | Utilisation | À Garder? |
|---------|------------|-----------|
| `parc360-deploy-key` | Clé privée SSH | ❌ Supprimer après ajout à GitHub |
| `parc360-deploy-key.pub` | Clé publique SSH | ❌ Supprimer après ajout à VM |
| `CLES_SSH_PARC360.md` | Ce guide | ❌ Supprimer après configuration |
| `generate-jwt.ps1` | Script JWT | ❌ Supprimer |

---

## 🆘 Dépannage

### Problème: SSH demande toujours un mot de passe
**Solution**: Vérifiez que la clé publique est bien dans `~/.ssh/authorized_keys` sur la VM

### Problème: GitHub Actions échoue avec "Permission denied"
**Solution**: Vérifiez que SSH_PRIVATE_KEY contient TOUTE la clé (BEGIN et END inclus)

### Problème: Le déploiement échoue
**Solution**: Vérifiez que tous les 7 secrets sont bien configurés avec les noms exacts

---

## 🎯 Prochaines Étapes

Après avoir configuré les secrets:

1. ✅ Testez le déploiement automatique
2. ✅ Supprimez les fichiers de clés locaux
3. ✅ Supprimez ce fichier guide
4. ✅ Chaque push sur `main` déploiera automatiquement!

---

**Généré pour PARC360 - Application de Gestion de Parc Auto**
**Date**: 2025-10-15
**Clés générées**: RSA 4096 bits
