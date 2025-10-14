# 🚀 Guide de Démarrage Rapide - PARC360

## Résolution de l'erreur 401 (Unauthorized)

Cette erreur signifie que l'authentification échoue. Voici comment la résoudre :

### Étape 1 : Vérifier MongoDB

```bash
# Vérifier si MongoDB est installé
mongosh --version
```

**Si MongoDB n'est pas installé, choisissez une option :**

#### Option A : MongoDB Atlas (Cloud - Plus rapide)

1. Allez sur https://www.mongodb.com/cloud/atlas/register
2. Créez un compte gratuit
3. Créez un cluster (FREE M0)
4. Dans "Security" > "Database Access", créez un utilisateur :
   - Username: `parc360user`
   - Password: `Parc360Pass123!` (ou un autre)
5. Dans "Security" > "Network Access", ajoutez votre IP ou `0.0.0.0/0`
6. Cliquez sur "Connect" > "Connect your application"
7. Copiez la chaîne de connexion

#### Option B : MongoDB Local (Windows)

1. Téléchargez : https://www.mongodb.com/try/download/community
2. Installez avec les options par défaut
3. Démarrez MongoDB :
   ```bash
   net start MongoDB
   ```

### Étape 2 : Configurer le Backend

```bash
cd backend
```

Vérifiez que le fichier `.env` existe et contient :

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/parc360
JWT_SECRET=parc360_secret_key_very_secure_2024
JWT_EXPIRE=30d
NODE_ENV=development
```

**Si vous utilisez MongoDB Atlas, remplacez MONGODB_URI par :**
```env
MONGODB_URI=mongodb+srv://parc360user:Parc360Pass123!@cluster0.xxxxx.mongodb.net/parc360?retryWrites=true&w=majority
```

### Étape 3 : Créer l'Utilisateur Admin

```bash
cd backend
node scripts/createAdmin.js
```

Vous devriez voir :
```
✅ Connexion à MongoDB réussie
✅ Administrateur créé avec succès
📧 Email: admin@parc360.ci
🔑 Mot de passe: admin123
```

**Si vous voyez une erreur :**

#### "MongoNetworkError" ou "ECONNREFUSED"
- MongoDB n'est pas démarré
- Pour Windows : `net start MongoDB`
- Pour Atlas : Vérifiez votre chaîne de connexion et IP autorisée

#### "E11000 duplicate key error" ou "Un administrateur existe déjà"
- L'utilisateur admin existe déjà
- Vous pouvez vous connecter directement

### Étape 4 : Démarrer le Serveur Backend

```bash
# Dans le dossier backend
npm run dev
```

Vous devriez voir :
```
🚀 Serveur démarré sur le port 5000
✅ Connexion à MongoDB réussie
```

**Testez l'API :**
Ouvrez http://localhost:5000 dans votre navigateur.
Résultat attendu : `{"message":"API PARC360 - Gestion du Parc Auto"}`

### Étape 5 : Démarrer le Frontend

**Nouveau terminal :**
```bash
cd frontend
npm start
```

Le navigateur devrait s'ouvrir sur http://localhost:3000

### Étape 6 : Se Connecter

**Identifiants par défaut :**
- **Email :** admin@parc360.ci
- **Mot de passe :** admin123

## ✅ Vérifications

### Vérifier que MongoDB fonctionne

```bash
# Option 1: MongoDB Shell
mongosh

# Option 2: Vérifier la connexion dans le backend
# Le backend doit afficher "✅ Connexion à MongoDB réussie"
```

### Vérifier les ports

```bash
# Windows
netstat -ano | findstr :5000
netstat -ano | findstr :3000

# Vous devriez voir le backend sur le port 5000
# Et le frontend sur le port 3000
```

### Vérifier les logs

Regardez dans la console du terminal backend pour voir les erreurs éventuelles.

## 🐛 Problèmes Courants

### Erreur : "Port 5000 already in use"

**Solution :**
```bash
# Trouver le processus
netstat -ano | findstr :5000

# Tuer le processus (remplacez <PID> par le numéro)
taskkill /PID <PID> /F
```

### Erreur : "Cannot connect to MongoDB"

**Solutions :**
1. Vérifiez que MongoDB est démarré : `net start MongoDB`
2. Vérifiez `MONGODB_URI` dans `.env`
3. Pour Atlas : Vérifiez que votre IP est autorisée
4. Vérifiez le mot de passe dans la chaîne de connexion

### Erreur 401 persiste après connexion

**Solutions :**
1. Ouvrez DevTools (F12) > Console pour voir l'erreur exacte
2. Vérifiez que le backend est bien sur le port 5000
3. Videz le cache du navigateur (Ctrl + Shift + Del)
4. Supprimez le localStorage :
   ```javascript
   // Dans la console du navigateur (F12)
   localStorage.clear()
   location.reload()
   ```
5. Recréez l'utilisateur admin :
   ```bash
   # Dans MongoDB Shell
   mongosh
   use parc360
   db.users.deleteOne({email: "admin@parc360.ci"})
   exit

   # Puis recréez
   node scripts/createAdmin.js
   ```

### Erreur : "JWT_SECRET is not defined"

**Solution :**
Vérifiez que le fichier `backend/.env` existe et contient `JWT_SECRET`

### Frontend ne se connecte pas au Backend

**Solution :**
1. Vérifiez que le backend est démarré sur le port 5000
2. Dans le fichier `frontend/src/context/AuthContext.tsx`, vérifiez l'URL :
   ```typescript
   // Ligne 49
   const response = await axios.post('http://localhost:5000/api/auth/login', ...
   ```

## 📞 Support

Si le problème persiste :

1. Vérifiez les logs du backend dans la console
2. Ouvrez les DevTools du navigateur (F12) > Console et Network
3. Partagez les messages d'erreur exacts

---

## Commandes Utiles

### Redémarrer tout

```bash
# Arrêter tous les processus (Ctrl+C dans chaque terminal)

# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

### Réinitialiser la base de données

```bash
# MongoDB Shell
mongosh
use parc360
db.dropDatabase()
exit

# Recréer l'admin
cd backend
node scripts/createAdmin.js
```

### Vérifier l'installation

```bash
# Node.js
node --version  # v16+

# NPM
npm --version

# MongoDB (si local)
mongosh --version
```

---

**Une fois connecté, pensez à changer le mot de passe admin !**
