# Configuration MongoDB pour PARC360

## Option 1 : MongoDB Atlas (Cloud - Recommandé)

### Étapes :

1. **Créer un compte MongoDB Atlas**
   - Allez sur https://www.mongodb.com/cloud/atlas/register
   - Créez un compte gratuit

2. **Créer un cluster**
   - Cliquez sur "Build a Database"
   - Choisissez "FREE" (M0)
   - Sélectionnez une région proche (ex: Europe - Frankfurt)
   - Cliquez sur "Create"

3. **Configurer l'accès**
   - Créez un utilisateur de base de données :
     - Username: `parc360user`
     - Password: (générez un mot de passe fort)
   - Ajoutez votre adresse IP :
     - Cliquez sur "Add My Current IP Address"
     - Ou ajoutez `0.0.0.0/0` pour autoriser tous les IPs (développement uniquement)

4. **Obtenir la chaîne de connexion**
   - Cliquez sur "Connect"
   - Choisissez "Connect your application"
   - Copiez la chaîne de connexion (format: `mongodb+srv://...`)

5. **Mettre à jour le fichier .env**
   ```
   MONGODB_URI=mongodb+srv://parc360user:<password>@cluster0.xxxxx.mongodb.net/parc360?retryWrites=true&w=majority
   ```
   Remplacez `<password>` par votre mot de passe réel

---

## Option 2 : MongoDB Local

### Windows :

1. **Télécharger MongoDB**
   - Allez sur https://www.mongodb.com/try/download/community
   - Téléchargez la version Windows
   - Installez avec les options par défaut

2. **Démarrer MongoDB**
   ```bash
   # En tant qu'administrateur
   net start MongoDB
   ```

3. **Vérifier l'installation**
   ```bash
   mongosh
   ```

### Le fichier .env reste inchangé :
```
MONGODB_URI=mongodb://localhost:27017/parc360
```

---

## Après la configuration de MongoDB

### 1. Créer l'utilisateur administrateur

```bash
cd backend
node scripts/createAdmin.js
```

Credentials par défaut :
- **Email:** admin@parc360.ci
- **Mot de passe:** admin123

⚠️ **IMPORTANT:** Changez le mot de passe après la première connexion !

### 2. Démarrer le serveur

```bash
# Depuis la racine du projet
npm run dev

# Ou uniquement le backend
cd backend
npm run dev
```

### 3. Tester l'API

Ouvrez http://localhost:5000 dans votre navigateur.
Vous devriez voir : `{"message":"API PARC360 - Gestion du Parc Auto"}`

### 4. Se connecter au frontend

Utilisez les identifiants de l'administrateur pour vous connecter.

---

## Dépannage

### Erreur : "MongoNetworkError"
- Vérifiez que MongoDB est démarré
- Vérifiez la chaîne de connexion dans `.env`
- Pour Atlas : vérifiez que votre IP est autorisée

### Erreur : "Authentication failed"
- Vérifiez le nom d'utilisateur et le mot de passe
- Pour Atlas : assurez-vous d'avoir remplacé `<password>` par votre vrai mot de passe

### Port 5000 déjà utilisé
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```
