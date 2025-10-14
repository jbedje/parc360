const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Données en mémoire (simulation de base de données)
let users = [
  {
    _id: '1',
    nom: 'Admin',
    prenom: 'PARC360',
    email: 'admin@parc360.ci',
    password: '$2a$10$Xw4gPJ7qE4yYYDZPCKzNseOPPIUEZHEYKUJNOW7xHGPFSO8RxZhHu', // admin123
    telephone: '+225 07 00 00 00 00',
    role: 'admin',
    actif: true
  }
];

let vehicles = [
  {
    _id: '1',
    immatriculation: 'CI-1234-AB',
    marque: 'Toyota',
    modele: 'Hilux',
    annee: 2022,
    type: 'utilitaire',
    couleur: 'Blanc',
    kilometrage: 15000,
    dateAchat: '2022-01-10',
    prixAchat: 25000000,
    statut: 'disponible',
    carburant: 'diesel',
    capaciteReservoir: 80,
    departement: 'Transport'
  },
  {
    _id: '2',
    immatriculation: 'CI-5678-CD',
    marque: 'Peugeot',
    modele: '508',
    annee: 2021,
    type: 'voiture',
    couleur: 'Noir',
    kilometrage: 32000,
    dateAchat: '2021-06-15',
    prixAchat: 18000000,
    statut: 'en_service',
    carburant: 'essence',
    capaciteReservoir: 65,
    departement: 'Administration'
  },
  {
    _id: '3',
    immatriculation: 'CI-9012-EF',
    marque: 'Nissan',
    modele: 'Patrol',
    annee: 2023,
    type: 'utilitaire',
    couleur: 'Gris',
    kilometrage: 8000,
    dateAchat: '2023-03-20',
    prixAchat: 35000000,
    statut: 'disponible',
    carburant: 'diesel',
    capaciteReservoir: 90,
    departement: 'Logistique'
  },
  {
    _id: '4',
    immatriculation: 'CI-3456-GH',
    marque: 'Mercedes',
    modele: 'Sprinter',
    annee: 2020,
    type: 'bus',
    couleur: 'Blanc',
    kilometrage: 65000,
    dateAchat: '2020-09-01',
    prixAchat: 42000000,
    statut: 'en_maintenance',
    carburant: 'diesel',
    capaciteReservoir: 100,
    departement: 'Transport'
  },
  {
    _id: '5',
    immatriculation: 'CI-7890-IJ',
    marque: 'Renault',
    modele: 'Kangoo',
    annee: 2022,
    type: 'utilitaire',
    couleur: 'Blanc',
    kilometrage: 18000,
    dateAchat: '2022-05-10',
    prixAchat: 12000000,
    statut: 'en_service',
    carburant: 'essence',
    capaciteReservoir: 50,
    departement: 'Maintenance'
  }
];

// Middleware d'authentification
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Non autorisé, token manquant' });
  }

  try {
    const decoded = jwt.verify(token, 'parc360_secret_key_demo');
    req.user = users.find(u => u._id === decoded.id);
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token invalide' });
  }
};

// Routes d'authentification
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Identifiants invalides' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Identifiants invalides' });
    }

    const token = jwt.sign({ id: user._id }, 'parc360_secret_key_demo', {
      expiresIn: '30d'
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/auth/me', protect, (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      _id: req.user._id,
      nom: req.user.nom,
      prenom: req.user.prenom,
      email: req.user.email,
      role: req.user.role
    }
  });
});

// Routes véhicules
app.get('/api/vehicles', protect, (req, res) => {
  let filteredVehicles = [...vehicles];

  if (req.query.statut) {
    filteredVehicles = filteredVehicles.filter(v => v.statut === req.query.statut);
  }
  if (req.query.type) {
    filteredVehicles = filteredVehicles.filter(v => v.type === req.query.type);
  }
  if (req.query.search) {
    const search = req.query.search.toLowerCase();
    filteredVehicles = filteredVehicles.filter(v =>
      v.immatriculation.toLowerCase().includes(search) ||
      v.marque.toLowerCase().includes(search) ||
      v.modele.toLowerCase().includes(search)
    );
  }

  res.status(200).json({
    success: true,
    count: filteredVehicles.length,
    data: filteredVehicles
  });
});

app.get('/api/vehicles/:id', protect, (req, res) => {
  const vehicle = vehicles.find(v => v._id === req.params.id);
  if (!vehicle) {
    return res.status(404).json({ success: false, message: 'Véhicule non trouvé' });
  }
  res.status(200).json({ success: true, data: vehicle });
});

// Routes rapports/dashboard
app.get('/api/reports/dashboard', protect, (req, res) => {
  const stats = {
    vehicules: {
      total: vehicles.length,
      disponibles: vehicles.filter(v => v.statut === 'disponible').length,
      enService: vehicles.filter(v => v.statut === 'en_service').length,
      enMaintenance: vehicles.filter(v => v.statut === 'en_maintenance').length
    },
    conducteurs: {
      total: 2
    },
    maintenances: {
      enCours: 1
    },
    trajets: {
      enCours: 0
    },
    documents: {
      expirant: 3
    },
    finances: {
      depensesMois: 2500000,
      depensesMaintenance: 1500000,
      depensesCarburant: 1000000
    }
  };

  res.status(200).json({ success: true, data: stats });
});

// Route de test
app.get('/', (req, res) => {
  res.json({
    message: '✅ API PARC360 - Gestion du Parc Auto (Version démo)',
    status: 'En ligne',
    endpoints: {
      login: 'POST /api/auth/login',
      vehicles: 'GET /api/vehicles',
      dashboard: 'GET /api/reports/dashboard'
    }
  });
});

// Routes non trouvées
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route non trouvée: ${req.method} ${req.originalUrl}`
  });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Erreur serveur',
    error: err.message
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('========================================');
  console.log('🚀 Serveur PARC360 démarré avec succès !');
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log('========================================');
  console.log('📋 Compte de test:');
  console.log('   Email: admin@parc360.ci');
  console.log('   Mot de passe: admin123');
  console.log('========================================');
});
