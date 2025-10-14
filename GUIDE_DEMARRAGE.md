# 🚀 Guide de Démarrage - PARC360

## ✅ Configuration Terminée !

Votre application PARC360 est maintenant prête à être utilisée avec :
- ✅ Backend Node.js/Express connecté à MongoDB Atlas
- ✅ Base de données avec données de démonstration
- ✅ 7 utilisateurs de test (différents rôles)
- ✅ 5 véhicules, 4 conducteurs, maintenances, trajets, etc.

---

## 🎯 Accès Rapide

### Backend API
**URL :** http://localhost:5000
**Status :** ✅ En cours d'exécution

### Frontend React
**URL :** http://localhost:3000
**Status :** À démarrer (voir instructions ci-dessous)

---

## 👤 Comptes de Test Disponibles

| Rôle | Email | Mot de passe | Permissions |
|------|-------|--------------|-------------|
| **Admin** | admin@parc360.ci | admin123 | Accès complet, gestion utilisateurs |
| **Gestionnaire** | gestionnaire@parc360.ci | gestionnaire123 | Gestion véhicules, conducteurs, rapports |
| **Technicien** | technicien@parc360.ci | technicien123 | Maintenance, réparations |
| **Conducteur** | mohamed.diallo@parc360.ci | conducteur123 | Trajets, ravitaillements |

---

## 📊 Données Disponibles

- **5 Véhicules** : Toyota Hilux, Mercedes Sprinter, Renault Duster, Peugeot Partner, Nissan Patrol
- **4 Conducteurs** : Avec permis, départements assignés
- **2 Maintenances** : Une en cours, une terminée
- **3 Ravitaillements** : Historique de carburant
- **3 Trajets** : Planifiés, en cours, terminés
- **3 Documents** : Assurances, cartes grises, permis

---

## 🎬 Démarrage de l'Application

### Option 1 : Démarrage Complet (Recommandé)

Depuis la racine du projet :

```bash
# Terminal 1 - Backend (déjà en cours)
# Le backend tourne déjà sur le port 5000

# Terminal 2 - Frontend
cd frontend
npm start
```

Le frontend s'ouvrira automatiquement sur http://localhost:3000

### Option 2 : Redémarrer tout

```bash
# Arrêter tous les processus en cours (Ctrl+C dans chaque terminal)

# Démarrer ensemble (depuis la racine)
npm run dev
```

---

## 🔐 Première Connexion

1. **Ouvrir** http://localhost:3000
2. **Se connecter** avec un compte (admin recommandé pour commencer)
3. **Explorer** le tableau de bord
4. **Important** : Changez le mot de passe admin après la première connexion

---

## 📱 Fonctionnalités Disponibles

### 🚗 Gestion des Véhicules
- ✅ Liste complète avec filtres
- ✅ Ajout/Modification/Suppression
- ✅ Assignation de conducteurs
- ✅ Historique détaillé
- ✅ Statuts en temps réel

### 👨‍✈️ Gestion des Conducteurs
- ✅ Profils complets
- ✅ Gestion des permis
- ✅ Infractions et formations
- ✅ Assignation de véhicules

### 🔧 Maintenance
- ✅ Planification préventive/corrective
- ✅ Suivi des coûts
- ✅ Gestion des pièces
- ✅ Alertes d'entretien

### ⛽ Carburant
- ✅ Enregistrement des ravitaillements
- ✅ Calcul de consommation
- ✅ Statistiques par véhicule
- ✅ Analyse des coûts

### 🗺️ Trajets
- ✅ Création de missions
- ✅ Suivi kilométrique
- ✅ Gestion des frais
- ✅ Validation gestionnaire

### 📄 Documents
- ✅ Centralisation documentaire
- ✅ Alertes d'expiration
- ✅ Catégorisation

### 📊 Rapports
- ✅ Tableau de bord dynamique
- ✅ Statistiques en temps réel
- ✅ Analyses de coûts
- ✅ Export des données

---

## 🧪 Tester l'API

### Test Rapide avec curl

```bash
# Test de connexion
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@parc360.ci","password":"admin123"}'

# Liste des véhicules (avec le token obtenu)
curl http://localhost:5000/api/vehicles \
  -H "Authorization: Bearer <VOTRE_TOKEN>"
```

### Avec Postman/Insomnia

Consultez le fichier [API_TESTS.md](API_TESTS.md) pour tous les endpoints disponibles.

---

## 📁 Structure du Projet

```
PARC360/
├── backend/                    # Serveur API
│   ├── controllers/           # Logique métier
│   ├── models/                # Modèles MongoDB
│   ├── routes/                # Routes API
│   ├── middleware/            # Auth, validation
│   ├── scripts/               # Scripts utilitaires
│   │   ├── createAdmin.js    # Créer admin
│   │   ├── seedData.js       # Données démo
│   │   └── testConnection.js # Test MongoDB
│   ├── .env                   # Configuration
│   └── server.js              # Point d'entrée
│
├── frontend/                   # Application React
│   ├── src/
│   │   ├── components/        # Composants UI
│   │   ├── pages/             # Pages
│   │   ├── context/           # Context API
│   │   └── App.tsx            # App principale
│   └── package.json
│
├── README.md                   # Documentation complète
├── QUICK_START.md             # Démarrage rapide
├── SETUP_MONGODB.md           # Config MongoDB
├── API_TESTS.md               # Tests API
└── GUIDE_DEMARRAGE.md         # Ce fichier
```

---

## 🛠️ Commandes Utiles

### Backend

```bash
cd backend

# Démarrer en dev (avec nodemon)
npm run dev

# Créer l'admin
node scripts/createAdmin.js

# Générer données de démo
node scripts/seedData.js

# Tester la connexion MongoDB
node scripts/testConnection.js
```

### Frontend

```bash
cd frontend

# Démarrer le serveur de dev
npm start

# Build pour production
npm run build

# Lancer les tests
npm test
```

---

## 🔍 Dépannage

### Le frontend ne se connecte pas

1. Vérifiez que le backend est démarré sur le port 5000
2. Vérifiez les logs de la console (F12)
3. Assurez-vous que MongoDB est connecté

### Erreur MongoDB

```bash
# Tester la connexion
cd backend
node scripts/testConnection.js
```

### Réinitialiser les données

```bash
cd backend
node scripts/seedData.js
```

Cela supprimera toutes les données (sauf admin) et recréera les données de démonstration.

### Port déjà utilisé

```bash
# Trouver le processus
netstat -ano | findstr :5000

# Tuer le processus
taskkill //PID <PID> //F
```

---

## 📈 Prochaines Étapes

1. **Explorer l'application** avec le compte admin
2. **Tester les différents rôles** (gestionnaire, technicien, conducteur)
3. **Ajouter vos propres données** (véhicules réels, conducteurs, etc.)
4. **Personnaliser** selon vos besoins
5. **Configurer** pour la production

---

## 📚 Documentation Complète

- **[README.md](README.md)** - Vue d'ensemble et installation
- **[QUICK_START.md](QUICK_START.md)** - Résolution problèmes courants
- **[SETUP_MONGODB.md](SETUP_MONGODB.md)** - Configuration MongoDB détaillée
- **[API_TESTS.md](API_TESTS.md)** - Tests et endpoints API

---

## 🆘 Support

Pour toute question :
1. Consultez la documentation
2. Vérifiez les logs du backend et frontend
3. Testez les endpoints API individuellement
4. Réinitialisez les données si nécessaire

---

## 🎉 Bon développement avec PARC360 !

L'application est maintenant prête. Vous pouvez commencer à l'utiliser et la personnaliser selon vos besoins.

**Rappel :** Changez tous les mots de passe par défaut avant de passer en production !
