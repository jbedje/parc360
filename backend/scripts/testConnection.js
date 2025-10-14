const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config();

console.log('🔍 Test de connexion MongoDB\n');
console.log('Configuration:');
console.log('- MONGODB_URI:', process.env.MONGODB_URI);
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('\n⏳ Tentative de connexion...\n');

const testConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log('✅ Connexion à MongoDB réussie!\n');
    console.log('Détails de la connexion:');
    console.log('- Host:', mongoose.connection.host);
    console.log('- Database:', mongoose.connection.name);
    console.log('- State:', mongoose.connection.readyState); // 1 = connected

    // Tester une opération simple
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📂 Collections existantes:', collections.map(c => c.name).join(', ') || 'Aucune');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur de connexion:\n');

    if (error.name === 'MongooseServerSelectionError') {
      console.error('Impossible de se connecter au serveur MongoDB.');
      console.error('\n💡 Solutions possibles:');
      console.error('1. Si vous utilisez MongoDB local:');
      console.error('   - Vérifiez que MongoDB est installé');
      console.error('   - Démarrez MongoDB: net start MongoDB (Windows)');
      console.error('   - Ou installez MongoDB: https://www.mongodb.com/try/download/community\n');
      console.error('2. Si vous utilisez MongoDB Atlas:');
      console.error('   - Vérifiez votre chaîne de connexion dans .env');
      console.error('   - Vérifiez que votre IP est autorisée dans Atlas');
      console.error('   - Vérifiez le nom d\'utilisateur et mot de passe\n');
    } else {
      console.error('Message d\'erreur:', error.message);
    }

    console.error('\n📋 Checklist:');
    console.error('[ ] MongoDB est installé et démarré OU');
    console.error('[ ] Vous avez un compte MongoDB Atlas configuré');
    console.error('[ ] Le fichier backend/.env existe');
    console.error('[ ] MONGODB_URI est correctement défini dans .env');

    process.exit(1);
  }
};

testConnection();
