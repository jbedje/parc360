# 🔧 Fix: SSH Key Authentication Error

## ❌ Erreur Rencontrée

```
ssh.ParsePrivateKey: ssh: no key found
ssh: handshake failed: ssh: unable to authenticate
```

Cette erreur signifie que GitHub Actions ne peut pas utiliser la clé SSH privée.

---

## ✅ Solution: Vérifier et Reconfigurer SSH_PRIVATE_KEY

### Étape 1: Vérifier le Secret sur GitHub

1. Allez sur: https://github.com/jbedje/parc360/settings/secrets/actions

2. Vérifiez que `SSH_PRIVATE_KEY` existe dans la liste

3. **Si le secret existe**: Cliquez dessus → "Remove" → Nous allons le recréer

4. **Si le secret n'existe pas**: Passez à l'étape 2

---

### Étape 2: Copier la Clé Privée Correctement

La clé privée se trouve dans le fichier local: `parc360-deploy-key`

**Option A: Copier depuis le fichier**

```bash
# Sur Windows, affichez la clé
type parc360-deploy-key

# Ou utilisez PowerShell
Get-Content parc360-deploy-key -Raw | Set-Clipboard
```

**Option B: Copier depuis CLES_SSH_PARC360.md**

Ouvrez le fichier `CLES_SSH_PARC360.md` et copiez **TOUTE** la clé privée.

---

### Étape 3: Créer le Secret SSH_PRIVATE_KEY

1. Sur https://github.com/jbedje/parc360/settings/secrets/actions

2. Cliquez **"New repository secret"**

3. **Name**: `SSH_PRIVATE_KEY`

4. **Secret**: Collez la clé privée **COMPLÈTE**

**⚠️ TRÈS IMPORTANT**: La clé DOIT inclure:

```
-----BEGIN OPENSSH PRIVATE KEY-----
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
-----END OPENSSH PRIVATE KEY-----
```

**Points critiques**:
- ✅ Inclure `-----BEGIN OPENSSH PRIVATE KEY-----`
- ✅ Inclure toutes les lignes encodées (ne pas couper)
- ✅ Inclure `-----END OPENSSH PRIVATE KEY-----`
- ✅ Pas d'espaces au début ou à la fin
- ✅ Pas de lignes vides avant BEGIN ou après END

5. Cliquez **"Add secret"**

---

### Étape 4: Vérifier les Autres Secrets

Pendant que vous y êtes, vérifiez que vous avez **tous les 7 secrets**:

```
✅ SSH_HOST = vmi2804403.contaboserver.net
✅ SSH_USERNAME = root
✅ SSH_PRIVATE_KEY = (la clé complète)
✅ SSH_PORT = 22
✅ REACT_APP_API_URL = http://vmi2804403.contaboserver.net/api
✅ JWT_SECRET = noTzpJL0t9JC00IZdQy9BZZDQT2MjvgXTubKsC6q4Z0=
✅ MONGODB_URI = mongodb://localhost:27017/parc360
```

---

### Étape 5: Re-déclencher le Workflow

Après avoir corrigé le secret:

**Option A: Re-run le workflow existant**

1. Allez sur: https://github.com/jbedje/parc360/actions
2. Cliquez sur le workflow qui a échoué
3. Cliquez sur "Re-run all jobs" (en haut à droite)

**Option B: Nouveau commit**

```bash
cd C:\Users\JeremieBEDJE\Downloads\PARC360
git commit --allow-empty -m "🔧 Fix SSH key - Retry CI/CD deployment"
git push origin main
```

---

## 🧪 Test Manuel de la Clé SSH

Pour vérifier que la clé fonctionne localement:

```bash
# Testez la connexion avec la clé
ssh -i parc360-deploy-key root@vmi2804403.contaboserver.net

# Si ça fonctionne, la clé est bonne
# Si ça demande un mot de passe, la clé n'est pas sur le serveur
```

---

## 🔍 Diagnostic des Problèmes Courants

### Problème 1: Clé Tronquée

**Symptôme**: `ssh: no key found`

**Cause**: La clé a été copiée incomplètement

**Solution**: Recopiez TOUTE la clé, de BEGIN à END

### Problème 2: Clé avec Espaces

**Symptôme**: `unable to authenticate`

**Cause**: Des espaces ou caractères invisibles ont été ajoutés

**Solution**: Utilisez `Get-Content -Raw` pour copier sans modification

### Problème 3: Mauvais Format de Clé

**Symptôme**: `ssh: no key found`

**Cause**: GitHub a formaté la clé (ajouté des retours à la ligne)

**Solution**: Copiez depuis le fichier brut `parc360-deploy-key`

---

## 💡 Script PowerShell pour Copier Correctement

```powershell
# Exécutez ceci dans PowerShell
cd C:\Users\JeremieBEDJE\Downloads\PARC360

# Afficher la clé dans la console
Get-Content parc360-deploy-key -Raw

# Copier dans le presse-papier (sans modification)
Get-Content parc360-deploy-key -Raw | Set-Clipboard

# Maintenant collez dans GitHub Secrets
Write-Host "✅ Clé copiée dans le presse-papier!"
Write-Host "Allez sur GitHub et collez-la dans SSH_PRIVATE_KEY"
```

---

## ✅ Vérification Finale

Après avoir configuré le secret correctement:

1. Le secret SSH_PRIVATE_KEY doit être dans la liste
2. Il doit contenir ~50 lignes de texte encodé
3. Il commence par `-----BEGIN OPENSSH PRIVATE KEY-----`
4. Il finit par `-----END OPENSSH PRIVATE KEY-----`

---

## 🚀 Après la Correction

Le workflow devrait:
- ✅ Se connecter à la VM via SSH
- ✅ Déployer le code
- ✅ Passer au vert

---

## 📞 Support

Si le problème persiste après avoir suivi ces étapes:

1. Vérifiez les logs GitHub Actions pour l'erreur exacte
2. Testez la connexion SSH manuellement depuis votre PC
3. Vérifiez que la clé publique est bien dans `~/.ssh/authorized_keys` sur la VM

---

**Allez maintenant configurer le secret SSH_PRIVATE_KEY correctement!** 🔑
