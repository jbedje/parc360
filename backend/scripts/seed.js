const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connexion à MongoDB réussie');

    // Nettoyer les données existantes
    await User.deleteMany({});
    await Vehicle.deleteMany({});
    await Driver.deleteMany({});
    console.log('🗑️  Données existantes supprimées');

    // Créer un utilisateur admin
    const admin = await User.create({
      nom: 'Admin',
      prenom: 'PARC360',
      email: 'admin@parc360.ci',
      password: 'admin123',
      telephone: '+225 07 00 00 00 00',
      role: 'admin',
    });
    console.log('👤 Utilisateur admin créé');

    // Créer un gestionnaire
    const gestionnaire = await User.create({
      nom: 'Kouassi',
      prenom: 'Jean',
      email: 'gestionnaire@parc360.ci',
      password: 'gestionnaire123',
      telephone: '+225 07 11 11 11 11',
      role: 'gestionnaire',
    });
    console.log('👤 Utilisateur gestionnaire créé');

    // Créer quelques conducteurs
    const conducteur1 = await User.create({
      nom: 'Koné',
      prenom: 'Amadou',
      email: 'amadou.kone@parc360.ci',
      password: 'conducteur123',
      telephone: '+225 07 22 22 22 22',
      role: 'conducteur',
    });

    const conducteur2 = await User.create({
      nom: 'Bamba',
      prenom: 'Marie',
      email: 'marie.bamba@parc360.ci',
      password: 'conducteur123',
      telephone: '+225 07 33 33 33 33',
      role: 'conducteur',
    });

    console.log('👤 Conducteurs créés');

    // Créer des profils conducteurs
    const driver1 = await Driver.create({
      user: conducteur1._id,
      numeroPermis: 'CI2023001234',
      categoriePermis: ['B', 'C'],
      dateDelivrance: new Date('2020-01-15'),
      dateExpiration: new Date('2030-01-15'),
      adresse: 'Cocody Angré, Abidjan',
      ville: 'Abidjan',
      dateEmbauche: new Date('2021-06-01'),
      departement: 'Transport',
      statut: 'actif',
    });

    const driver2 = await Driver.create({
      user: conducteur2._id,
      numeroPermis: 'CI2023005678',
      categoriePermis: ['B'],
      dateDelivrance: new Date('2019-03-20'),
      dateExpiration: new Date('2029-03-20'),
      adresse: 'Plateau, Abidjan',
      ville: 'Abidjan',
      dateEmbauche: new Date('2022-01-15'),
      departement: 'Administration',
      statut: 'actif',
    });

    console.log('🚗 Profils conducteurs créés');

    // Créer des véhicules
    const vehicles = [
      {
        immatriculation: 'CI-1234-AB',
        marque: 'Toyota',
        modele: 'Hilux',
        annee: 2022,
        type: 'utilitaire',
        couleur: 'Blanc',
        numeroSerie: 'TYT2022HL1234',
        kilometrage: 15000,
        dateAchat: new Date('2022-01-10'),
        prixAchat: 25000000,
        statut: 'disponible',
        carburant: 'diesel',
        capaciteReservoir: 80,
        consommationMoyenne: 8.5,
        departement: 'Transport',
      },
      {
        immatriculation: 'CI-5678-CD',
        marque: 'Peugeot',
        modele: '508',
        annee: 2021,
        type: 'voiture',
        couleur: 'Noir',
        numeroSerie: 'PGT2021508567',
        kilometrage: 32000,
        dateAchat: new Date('2021-06-15'),
        prixAchat: 18000000,
        statut: 'en_service',
        carburant: 'essence',
        capaciteReservoir: 65,
        consommationMoyenne: 6.8,
        departement: 'Administration',
        conducteurActuel: driver1._id,
      },
      {
        immatriculation: 'CI-9012-EF',
        marque: 'Nissan',
        modele: 'Patrol',
        annee: 2023,
        type: 'utilitaire',
        couleur: 'Gris',
        numeroSerie: 'NSN2023PT9012',
        kilometrage: 8000,
        dateAchat: new Date('2023-03-20'),
        prixAchat: 35000000,
        statut: 'disponible',
        carburant: 'diesel',
        capaciteReservoir: 90,
        consommationMoyenne: 12.5,
        departement: 'Logistique',
      },
      {
        immatriculation: 'CI-3456-GH',
        marque: 'Mercedes',
        modele: 'Sprinter',
        annee: 2020,
        type: 'bus',
        couleur: 'Blanc',
        numeroSerie: 'MBZ2020SP3456',
        kilometrage: 65000,
        dateAchat: new Date('2020-09-01'),
        prixAchat: 42000000,
        statut: 'en_maintenance',
        carburant: 'diesel',
        capaciteReservoir: 100,
        consommationMoyenne: 15.0,
        departement: 'Transport',
      },
      {
        immatriculation: 'CI-7890-IJ',
        marque: 'Renault',
        modele: 'Kangoo',
        annee: 2022,
        type: 'utilitaire',
        couleur: 'Blanc',
        numeroSerie: 'RNT2022KG7890',
        kilometrage: 18000,
        dateAchat: new Date('2022-05-10'),
        prixAchat: 12000000,
        statut: 'en_service',
        carburant: 'essence',
        capaciteReservoir: 50,
        consommationMoyenne: 7.2,
        departement: 'Maintenance',
        conducteurActuel: driver2._id,
      },
    ];

    await Vehicle.insertMany(vehicles);
    console.log('🚗 Véhicules créés');

    // Mettre à jour les conducteurs avec leurs véhicules assignés
    await Driver.findByIdAndUpdate(driver1._id, {
      vehiculeAssigne: vehicles.find((v) => v.immatriculation === 'CI-5678-CD'),
    });
    await Driver.findByIdAndUpdate(driver2._id, {
      vehiculeAssigne: vehicles.find((v) => v.immatriculation === 'CI-7890-IJ'),
    });

    console.log('✅ Base de données initialisée avec succès !');
    console.log('\n📋 Comptes créés:');
    console.log('Admin: admin@parc360.ci / admin123');
    console.log('Gestionnaire: gestionnaire@parc360.ci / gestionnaire123');
    console.log('Conducteur 1: amadou.kone@parc360.ci / conducteur123');
    console.log('Conducteur 2: marie.bamba@parc360.ci / conducteur123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    process.exit(1);
  }
};

seedData();
