# 🧪 Tests API - PARC360

## Authentification

### 1. Connexion Admin
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@parc360.ci",
    "password": "admin123"
  }'
```

### 2. Connexion Gestionnaire
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "gestionnaire@parc360.ci",
    "password": "gestionnaire123"
  }'
```

### 3. Obtenir le profil utilisateur
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <TOKEN>"
```

---

## Véhicules

### 1. Liste des véhicules
```bash
curl http://localhost:5000/api/vehicles \
  -H "Authorization: Bearer <TOKEN>"
```

### 2. Filtrer par statut
```bash
curl "http://localhost:5000/api/vehicles?statut=disponible" \
  -H "Authorization: Bearer <TOKEN>"
```

### 3. Créer un véhicule
```bash
curl -X POST http://localhost:5000/api/vehicles \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "immatriculation": "KL 1111 CI",
    "marque": "Ford",
    "modele": "Ranger",
    "annee": 2024,
    "type": "utilitaire",
    "couleur": "Rouge",
    "kilometrage": 0,
    "dateAchat": "2024-10-12",
    "prixAchat": 22000000,
    "statut": "disponible",
    "carburant": "diesel",
    "capaciteReservoir": 80,
    "consommationMoyenne": 8.5,
    "departement": "Logistique"
  }'
```

### 4. Détails d'un véhicule
```bash
curl http://localhost:5000/api/vehicles/<VEHICLE_ID> \
  -H "Authorization: Bearer <TOKEN>"
```

### 5. Historique d'un véhicule
```bash
curl http://localhost:5000/api/vehicles/<VEHICLE_ID>/history \
  -H "Authorization: Bearer <TOKEN>"
```

---

## Conducteurs

### 1. Liste des conducteurs
```bash
curl http://localhost:5000/api/drivers \
  -H "Authorization: Bearer <TOKEN>"
```

### 2. Créer un conducteur
```bash
curl -X POST http://localhost:5000/api/drivers \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "userData": {
      "nom": "Koffi",
      "prenom": "Jean",
      "email": "jean.koffi@parc360.ci",
      "password": "conducteur123",
      "telephone": "+225 0705050505"
    },
    "driverData": {
      "numeroPermis": "CI2020007890",
      "categoriePermis": ["B"],
      "dateDelivrance": "2020-05-15",
      "dateExpiration": "2030-05-15",
      "adresse": "Treichville, Abidjan",
      "ville": "Abidjan",
      "dateEmbauche": "2024-10-12",
      "departement": "Logistique",
      "statut": "actif"
    }
  }'
```

---

## Maintenance

### 1. Liste des maintenances
```bash
curl http://localhost:5000/api/maintenance \
  -H "Authorization: Bearer <TOKEN>"
```

### 2. Créer une maintenance
```bash
curl -X POST http://localhost:5000/api/maintenance \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "vehicule": "<VEHICLE_ID>",
    "type": "preventive",
    "description": "Révision périodique",
    "dateDebut": "2024-10-15",
    "statut": "planifie",
    "kilometrageActuel": 50000,
    "prochainEntretien": 60000,
    "garage": {
      "nom": "Garage Central",
      "adresse": "Abidjan",
      "telephone": "+225 0727272727"
    },
    "coutTotal": 75000
  }'
```

---

## Carburant

### 1. Liste des ravitaillements
```bash
curl http://localhost:5000/api/fuel \
  -H "Authorization: Bearer <TOKEN>"
```

### 2. Enregistrer un ravitaillement
```bash
curl -X POST http://localhost:5000/api/fuel \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "vehicule": "<VEHICLE_ID>",
    "conducteur": "<DRIVER_ID>",
    "dateRavitaillement": "2024-10-12",
    "quantite": 50,
    "prixUnitaire": 650,
    "kilometrageActuel": 50500,
    "typeCarburant": "diesel",
    "stationService": {
      "nom": "Total Plateau",
      "adresse": "Plateau, Abidjan"
    },
    "reservoirPlein": true
  }'
```

### 3. Statistiques de carburant
```bash
curl http://localhost:5000/api/fuel/stats \
  -H "Authorization: Bearer <TOKEN>"
```

---

## Trajets

### 1. Liste des trajets
```bash
curl http://localhost:5000/api/trips \
  -H "Authorization: Bearer <TOKEN>"
```

### 2. Créer un trajet
```bash
curl -X POST http://localhost:5000/api/trips \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "vehicule": "<VEHICLE_ID>",
    "conducteur": "<DRIVER_ID>",
    "dateDepart": "2024-10-12",
    "lieuDepart": "Abidjan",
    "lieuArrivee": "Bouaké",
    "objet": "Mission commerciale",
    "kilometrageDepart": 50000,
    "statut": "planifie",
    "passagers": [
      {
        "nom": "Dupont Jean",
        "telephone": "+225 0701010101"
      }
    ]
  }'
```

---

## Rapports

### 1. Dashboard
```bash
curl http://localhost:5000/api/reports/dashboard \
  -H "Authorization: Bearer <TOKEN>"
```

### 2. Rapport véhicules
```bash
curl http://localhost:5000/api/reports/vehicles \
  -H "Authorization: Bearer <TOKEN>"
```

### 3. Rapport maintenance
```bash
curl http://localhost:5000/api/reports/maintenance \
  -H "Authorization: Bearer <TOKEN>"
```

### 4. Rapport carburant
```bash
curl "http://localhost:5000/api/reports/fuel?dateDebut=2024-10-01&dateFin=2024-10-31" \
  -H "Authorization: Bearer <TOKEN>"
```

### 5. Analyse des coûts
```bash
curl http://localhost:5000/api/reports/costs \
  -H "Authorization: Bearer <TOKEN>"
```

---

## Notes

- Remplacez `<TOKEN>` par le token JWT obtenu lors de la connexion
- Remplacez `<VEHICLE_ID>`, `<DRIVER_ID>`, etc. par les IDs réels de vos documents
- Utilisez Postman ou Insomnia pour des tests plus faciles avec interface graphique

## Tester avec Postman

1. Importez cette collection dans Postman
2. Créez une variable d'environnement `token`
3. Après la connexion, le token sera automatiquement sauvegardé
4. Tous les autres endpoints utiliseront automatiquement ce token
