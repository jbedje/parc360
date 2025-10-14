const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

// Charger les variables d'environnement
dotenv.config();

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/parc360')
  .then(() => console.log('✅ Connexion à MongoDB réussie'))
  .catch((err) => {
    console.error('❌ Erreur de connexion MongoDB:', err);
    process.exit(1);
  });

const createAdmin = async () => {
  try {
    // Vérifier si un admin existe déjà
    const adminExists = await User.findOne({ email: 'admin@parc360.ci' });

    if (adminExists) {
      console.log('⚠️  Un administrateur existe déjà');
      process.exit(0);
    }

    // Créer l'administrateur
    const admin = await User.create({
      nom: 'Admin',
      prenom: 'Parc360',
      email: 'admin@parc360.ci',
      password: 'admin123',
      telephone: '+225 0707070707',
      role: 'admin',
      actif: true
    });

    console.log('✅ Administrateur créé avec succès');
    console.log('📧 Email: admin@parc360.ci');
    console.log('🔑 Mot de passe: admin123');
    console.log('\n⚠️  IMPORTANT: Changez le mot de passe après la première connexion!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'administrateur:', error);
    process.exit(1);
  }
};

createAdmin();
