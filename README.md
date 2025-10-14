# PARC360 - Gestion du Parc Auto

Application complète de gestion du parc automobile pour Côte d'Ivoire PME.

## 🚀 Fonctionnalités

### Gestion des Véhicules
- Enregistrement complet des véhicules (immatriculation, marque, modèle, etc.)
- Suivi du kilométrage en temps réel
- Gestion des statuts (disponible, en service, en maintenance, hors service)
- Historique complet par véhicule

### Gestion des Conducteurs
- Profils détaillés des conducteurs
- Gestion des permis de conduire et dates d'expiration
- Suivi des infractions et formations
- **Attribution bidirectionnelle** véhicule ↔ conducteur (depuis les 2 interfaces)

### Maintenance
- Planification des maintenances préventives et correctives
- Suivi des réparations et révisions
- Gestion des coûts (pièces et main d'œuvre)
- Alertes pour les prochains entretiens

### Carburant
- Enregistrement des ravitaillements
- Calcul de la consommation par véhicule
- Analyse des coûts de carburant
- Statistiques de consommation

### Trajets
- Enregistrement des déplacements
- Suivi des kilométrages départ/arrivée
- Gestion des frais (péage, parking, etc.)
- Validation par les gestionnaires

### Documents
- Stockage centralisé des documents
- **Calcul automatique du statut** (valide, à renouveler, expiré)
- Alertes d'expiration (assurance, carte grise, visite technique)
- Catégorisation par type et véhicule
- Fonction de recalcul de statut pour tous les documents

### Rapports et Statistiques
- Tableau de bord avec indicateurs clés
- Rapports détaillés par véhicule, conducteur, maintenance
- Analyse des coûts globaux
- Statistiques de disponibilité du parc

## 🛠️ Technologies Utilisées

### Backend
- **Node.js** & **Express.js** - Serveur API REST
- **MongoDB** & **Mongoose** - Base de données NoSQL
- **JWT** - Authentification sécurisée
- **bcryptjs** - Cryptage des mots de passe

### Frontend
- **React 18** avec **TypeScript** - Interface utilisateur moderne
- **Tailwind CSS** - Framework CSS utilitaire
- **React Router** - Navigation
- **Axios** - Client HTTP

## 📦 Installation

### Prérequis
- Node.js (v16 ou supérieur)
- MongoDB (v5 ou supérieur)
- npm ou yarn

### 1. Cloner le projet
```bash
cd PARC360
```

### 2. Installer les dépendances

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### 3. Configuration

#### Backend
Créer un fichier `.env` dans le dossier `backend`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/parc360
JWT_SECRET=votre_secret_jwt_tres_securise_ici
JWT_EXPIRE=30d
NODE_ENV=development
```

#### Frontend
Créer un fichier `.env` dans le dossier `frontend`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Initialiser la base de données

```bash
cd backend
node scripts/seed.js
```

Cela créera des données de test incluant:
- Utilisateur admin: `admin@parc360.ci` / `admin123`
- Gestionnaire: `gestionnaire@parc360.ci` / `gestionnaire123`
- Conducteurs avec véhicules assignés
- 5 véhicules de test

### 5. Démarrer l'application

#### Option 1: Démarrage séparé

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm start
```

#### Option 2: Démarrage simultané (depuis la racine)
```bash
npm run install-all
npm run dev
```

L'application sera accessible sur:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 👥 Rôles et Permissions

### Administrateur
- Accès complet à toutes les fonctionnalités
- Gestion des utilisateurs
- Suppression de données
- Accès à tous les rapports

### Gestionnaire
- Gestion des véhicules et conducteurs
- Planification des maintenances
- Validation des trajets
- Génération de rapports

### Conducteur
- Consultation des véhicules assignés
- Enregistrement des ravitaillements
- Création de trajets
- Consultation de son historique

### Technicien
- Gestion des maintenances
- Enregistrement des réparations
- Suivi des interventions

## 📱 Captures d'écran

### Tableau de Bord
Affichage des statistiques en temps réel avec indicateurs clés de performance.

### Gestion des Véhicules
Liste complète avec filtres par statut, type et département.

### Rapports
Analyses détaillées et exportables en différents formats.

## 🔒 Sécurité

- Authentification JWT avec tokens sécurisés
- Mots de passe cryptés avec bcrypt
- Middleware de protection des routes
- Validation des données côté serveur
- Gestion des rôles et permissions

## 📊 Structure du Projet

```
PARC360/
├── backend/
│   ├── config/          # Configuration de la base de données
│   ├── controllers/     # Logique métier
│   ├── models/          # Modèles Mongoose
│   ├── routes/          # Routes API
│   ├── middleware/      # Middlewares (auth, etc.)
│   ├── scripts/         # Scripts utilitaires
│   └── server.js        # Point d'entrée
├── frontend/
│   ├── public/          # Fichiers statiques
│   └── src/
│       ├── components/  # Composants réutilisables
│       ├── pages/       # Pages de l'application
│       ├── context/     # Context API (Auth)
│       ├── services/    # Services API
│       └── App.tsx      # Composant principal
└── README.md
```

## 🚧 Améliorations Futures

- [ ] Export des rapports en PDF/Excel
- [ ] Notifications par email/SMS
- [ ] Application mobile (React Native)
- [ ] Intégration avec GPS pour suivi en temps réel
- [ ] Module de facturation
- [ ] Gestion des assurances
- [ ] Planning de réservation des véhicules
- [ ] API pour intégrations tierces

## 📝 API Documentation

### Endpoints Principaux

#### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur

#### Véhicules
- `GET /api/vehicles` - Liste des véhicules
- `POST /api/vehicles` - Créer un véhicule
- `GET /api/vehicles/:id` - Détails d'un véhicule
- `PUT /api/vehicles/:id` - Modifier un véhicule
- `DELETE /api/vehicles/:id` - Supprimer un véhicule

#### Conducteurs
- `GET /api/drivers` - Liste des conducteurs
- `POST /api/drivers` - Créer un conducteur
- `GET /api/drivers/:id` - Détails d'un conducteur
- `PUT /api/drivers/:id` - Modifier un conducteur

#### Maintenance
- `GET /api/maintenance` - Liste des maintenances
- `POST /api/maintenance` - Planifier une maintenance
- `PUT /api/maintenance/:id` - Mettre à jour une maintenance

#### Carburant
- `GET /api/fuel` - Liste des ravitaillements
- `POST /api/fuel` - Enregistrer un ravitaillement
- `GET /api/fuel/stats` - Statistiques de consommation

#### Trajets
- `GET /api/trips` - Liste des trajets
- `POST /api/trips` - Créer un trajet
- `PUT /api/trips/:id/validate` - Valider un trajet

#### Rapports
- `GET /api/reports/dashboard` - Statistiques du dashboard
- `GET /api/reports/vehicles` - Rapport véhicules
- `GET /api/reports/costs` - Analyse des coûts

## 🤝 Support

Pour toute question ou assistance:
- Email: support@parc360.ci
- Téléphone: +225 XX XX XX XX XX

## 📄 Licence

Ce projet est développé pour Côte d'Ivoire PME.
© 2024 PARC360 - Tous droits réservés.
