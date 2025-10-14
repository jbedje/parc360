const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Driver = require('../models/Driver');
const Vehicle = require('../models/Vehicle');
const Maintenance = require('../models/Maintenance');
const Fuel = require('../models/Fuel');
const Trip = require('../models/Trip');
const Document = require('../models/Document');

dotenv.config();

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connexion à MongoDB réussie'))
  .catch((err) => {
    console.error('❌ Erreur de connexion MongoDB:', err);
    process.exit(1);
  });

const seedData = async () => {
  try {
    console.log('\n🗑️  Nettoyage des anciennes données...\n');

    // Supprimer toutes les données sauf l'admin
    await Promise.all([
      Driver.deleteMany({}),
      Vehicle.deleteMany({}),
      Maintenance.deleteMany({}),
      Fuel.deleteMany({}),
      Trip.deleteMany({}),
      Document.deleteMany({}),
      User.deleteMany({ email: { $ne: 'admin@parc360.ci' } })
    ]);

    console.log('✅ Anciennes données supprimées\n');
    console.log('📝 Création des utilisateurs...\n');

    // Créer un gestionnaire
    const gestionnaire = await User.create({
      nom: 'Koné',
      prenom: 'Awa',
      email: 'gestionnaire@parc360.ci',
      password: 'gestionnaire123',
      telephone: '+225 0707080808',
      role: 'gestionnaire',
      actif: true
    });

    // Créer un technicien
    const technicien = await User.create({
      nom: 'Traoré',
      prenom: 'Moussa',
      email: 'technicien@parc360.ci',
      password: 'technicien123',
      telephone: '+225 0707090909',
      role: 'technicien',
      actif: true
    });

    // Créer des conducteurs
    const conducteurs = await User.insertMany([
      {
        nom: 'Diallo',
        prenom: 'Mohamed',
        email: 'mohamed.diallo@parc360.ci',
        password: 'conducteur123',
        telephone: '+225 0701010101',
        role: 'conducteur',
        actif: true
      },
      {
        nom: 'Bamba',
        prenom: 'Fatou',
        email: 'fatou.bamba@parc360.ci',
        password: 'conducteur123',
        telephone: '+225 0702020202',
        role: 'conducteur',
        actif: true
      },
      {
        nom: 'Ouattara',
        prenom: 'Ibrahim',
        email: 'ibrahim.ouattara@parc360.ci',
        password: 'conducteur123',
        telephone: '+225 0703030303',
        role: 'conducteur',
        actif: true
      },
      {
        nom: 'Coulibaly',
        prenom: 'Mariam',
        email: 'mariam.coulibaly@parc360.ci',
        password: 'conducteur123',
        telephone: '+225 0704040404',
        role: 'conducteur',
        actif: true
      }
    ]);

    console.log(`✅ ${conducteurs.length + 2} utilisateurs créés\n`);
    console.log('🚗 Création des véhicules...\n');

    // Créer des véhicules
    const vehicles = await Vehicle.insertMany([
      {
        immatriculation: 'AB 1234 CI',
        marque: 'Toyota',
        modele: 'Hilux',
        annee: 2021,
        type: 'utilitaire',
        couleur: 'Blanc',
        numeroSerie: 'TOY2021HILUX001',
        kilometrage: 45000,
        dateAchat: new Date('2021-03-15'),
        prixAchat: 25000000,
        statut: 'disponible',
        carburant: 'diesel',
        capaciteReservoir: 80,
        consommationMoyenne: 9.5,
        departement: 'Commercial'
      },
      {
        immatriculation: 'CD 5678 CI',
        marque: 'Mercedes',
        modele: 'Sprinter',
        annee: 2020,
        type: 'bus',
        couleur: 'Blanc',
        numeroSerie: 'MER2020SPR002',
        kilometrage: 78000,
        dateAchat: new Date('2020-06-20'),
        prixAchat: 35000000,
        statut: 'en_service',
        carburant: 'diesel',
        capaciteReservoir: 100,
        consommationMoyenne: 12,
        departement: 'Transport'
      },
      {
        immatriculation: 'EF 9012 CI',
        marque: 'Renault',
        modele: 'Duster',
        annee: 2022,
        type: 'voiture',
        couleur: 'Gris',
        numeroSerie: 'REN2022DUS003',
        kilometrage: 15000,
        dateAchat: new Date('2022-01-10'),
        prixAchat: 12000000,
        statut: 'en_service',
        carburant: 'essence',
        capaciteReservoir: 50,
        consommationMoyenne: 7,
        departement: 'Direction'
      },
      {
        immatriculation: 'GH 3456 CI',
        marque: 'Peugeot',
        modele: 'Partner',
        annee: 2019,
        type: 'utilitaire',
        couleur: 'Bleu',
        numeroSerie: 'PEU2019PAR004',
        kilometrage: 95000,
        dateAchat: new Date('2019-09-05'),
        prixAchat: 8000000,
        statut: 'en_maintenance',
        carburant: 'diesel',
        capaciteReservoir: 60,
        consommationMoyenne: 6.5,
        departement: 'Logistique'
      },
      {
        immatriculation: 'IJ 7890 CI',
        marque: 'Nissan',
        modele: 'Patrol',
        annee: 2023,
        type: 'voiture',
        couleur: 'Noir',
        numeroSerie: 'NIS2023PAT005',
        kilometrage: 8000,
        dateAchat: new Date('2023-05-15'),
        prixAchat: 28000000,
        statut: 'disponible',
        carburant: 'essence',
        capaciteReservoir: 90,
        consommationMoyenne: 13,
        departement: 'Direction'
      }
    ]);

    console.log(`✅ ${vehicles.length} véhicules créés\n`);
    console.log('👨‍✈️ Création des profils conducteurs...\n');

    // Créer des profils conducteurs
    const drivers = await Driver.insertMany([
      {
        user: conducteurs[0]._id,
        numeroPermis: 'CI2015001234',
        categoriePermis: ['B', 'C'],
        dateDelivrance: new Date('2015-03-10'),
        dateExpiration: new Date('2026-03-10'),
        adresse: 'Cocody, Abidjan',
        ville: 'Abidjan',
        dateEmbauche: new Date('2021-01-15'),
        departement: 'Commercial',
        statut: 'actif',
        vehiculeAssigne: vehicles[1]._id
      },
      {
        user: conducteurs[1]._id,
        numeroPermis: 'CI2017005678',
        categoriePermis: ['B'],
        dateDelivrance: new Date('2017-06-20'),
        dateExpiration: new Date('2028-06-20'),
        adresse: 'Yopougon, Abidjan',
        ville: 'Abidjan',
        dateEmbauche: new Date('2020-05-10'),
        departement: 'Transport',
        statut: 'actif',
        vehiculeAssigne: vehicles[2]._id
      },
      {
        user: conducteurs[2]._id,
        numeroPermis: 'CI2016009012',
        categoriePermis: ['B', 'C', 'D'],
        dateDelivrance: new Date('2016-11-15'),
        dateExpiration: new Date('2027-11-15'),
        adresse: 'Abobo, Abidjan',
        ville: 'Abidjan',
        dateEmbauche: new Date('2019-08-20'),
        departement: 'Logistique',
        statut: 'actif'
      },
      {
        user: conducteurs[3]._id,
        numeroPermis: 'CI2018003456',
        categoriePermis: ['B'],
        dateDelivrance: new Date('2018-02-28'),
        dateExpiration: new Date('2029-02-28'),
        adresse: 'Plateau, Abidjan',
        ville: 'Abidjan',
        dateEmbauche: new Date('2022-03-01'),
        departement: 'Direction',
        statut: 'actif'
      }
    ]);

    // Assigner les conducteurs aux véhicules
    await Vehicle.findByIdAndUpdate(vehicles[1]._id, { conducteurActuel: drivers[0]._id });
    await Vehicle.findByIdAndUpdate(vehicles[2]._id, { conducteurActuel: drivers[1]._id });

    console.log(`✅ ${drivers.length} conducteurs créés\n`);
    console.log('🔧 Création des maintenances...\n');

    // Créer des maintenances
    const maintenances = await Maintenance.insertMany([
      {
        vehicule: vehicles[3]._id,
        type: 'corrective',
        description: 'Réparation moteur - problème de démarrage',
        dateDebut: new Date('2024-10-01'),
        statut: 'en_cours',
        kilometrageActuel: 95000,
        prochainEntretien: 105000,
        garage: {
          nom: 'Garage Central Abidjan',
          adresse: 'Zone 4C, Abidjan',
          telephone: '+225 0727272727'
        },
        technicien: technicien._id,
        pieces: [
          { nom: 'Bougie', reference: 'BG-001', quantite: 4, prixUnitaire: 5000 },
          { nom: 'Filtre à air', reference: 'FA-002', quantite: 1, prixUnitaire: 15000 }
        ],
        mainOeuvre: 50000,
        coutTotal: 85000
      },
      {
        vehicule: vehicles[0]._id,
        type: 'preventive',
        description: 'Révision des 50 000 km',
        dateDebut: new Date('2024-09-15'),
        dateFin: new Date('2024-09-16'),
        statut: 'termine',
        kilometrageActuel: 50000,
        prochainEntretien: 60000,
        garage: {
          nom: 'Toyota Service Abidjan',
          adresse: 'Marcory, Abidjan',
          telephone: '+225 0725252525'
        },
        technicien: technicien._id,
        pieces: [
          { nom: 'Huile moteur', reference: 'HM-001', quantite: 5, prixUnitaire: 8000 },
          { nom: 'Filtre à huile', reference: 'FH-002', quantite: 1, prixUnitaire: 12000 }
        ],
        mainOeuvre: 30000,
        coutTotal: 82000,
        facture: { numero: 'FAC-2024-0915', fichier: '' }
      }
    ]);

    console.log(`✅ ${maintenances.length} maintenances créées\n`);
    console.log('⛽ Création des ravitaillements...\n');

    // Créer des ravitaillements
    const fuels = await Fuel.insertMany([
      {
        vehicule: vehicles[1]._id,
        conducteur: drivers[0]._id,
        dateRavitaillement: new Date('2024-10-10'),
        quantite: 70,
        prixUnitaire: 650,
        montantTotal: 45500,
        kilometrageActuel: 78000,
        typeCarburant: 'diesel',
        stationService: { nom: 'Total Riviera', adresse: 'Riviera, Abidjan' },
        reservoirPlein: true
      },
      {
        vehicule: vehicles[2]._id,
        conducteur: drivers[1]._id,
        dateRavitaillement: new Date('2024-10-11'),
        quantite: 40,
        prixUnitaire: 715,
        montantTotal: 28600,
        kilometrageActuel: 15000,
        typeCarburant: 'essence',
        stationService: { nom: 'Shell Cocody', adresse: 'Cocody, Abidjan' },
        reservoirPlein: false
      },
      {
        vehicule: vehicles[0]._id,
        conducteur: drivers[2]._id,
        dateRavitaillement: new Date('2024-10-09'),
        quantite: 65,
        prixUnitaire: 650,
        montantTotal: 42250,
        kilometrageActuel: 45000,
        typeCarburant: 'diesel',
        stationService: { nom: 'Total Plateau', adresse: 'Plateau, Abidjan' },
        reservoirPlein: true
      }
    ]);

    console.log(`✅ ${fuels.length} ravitaillements créés\n`);
    console.log('🚗 Création des trajets...\n');

    // Créer des trajets
    const trips = await Trip.insertMany([
      {
        vehicule: vehicles[1]._id,
        conducteur: drivers[0]._id,
        dateDepart: new Date('2024-10-08'),
        dateRetour: new Date('2024-10-08'),
        lieuDepart: 'Abidjan',
        lieuArrivee: 'Yamoussoukro',
        objet: 'Livraison de matériel',
        kilometrageDepart: 77500,
        kilometrageArrivee: 77750,
        distanceParcourue: 250,
        statut: 'termine',
        fraisPeage: 2000,
        fraisParking: 500,
        autresFrais: 0,
        coutTotal: 2500
      },
      {
        vehicule: vehicles[2]._id,
        conducteur: drivers[1]._id,
        dateDepart: new Date('2024-10-10'),
        lieuDepart: 'Abidjan',
        lieuArrivee: 'Bouaké',
        objet: 'Déplacement professionnel - Réunion',
        kilometrageDepart: 14800,
        statut: 'en_cours',
        fraisPeage: 3000
      },
      {
        vehicule: vehicles[0]._id,
        conducteur: drivers[2]._id,
        dateDepart: new Date('2024-10-11'),
        lieuDepart: 'Abidjan',
        lieuArrivee: 'San Pedro',
        objet: 'Visite de chantier',
        kilometrageDepart: 45000,
        statut: 'planifie'
      }
    ]);

    console.log(`✅ ${trips.length} trajets créés\n`);
    console.log('📄 Création des documents...\n');

    // Créer des documents
    const documents = await Document.insertMany([
      {
        type: 'vehicule',
        reference: { vehicule: vehicles[0]._id },
        categorie: 'assurance',
        nom: 'Assurance Toyota Hilux',
        numeroDocument: 'ASS-2024-001',
        dateEmission: new Date('2024-01-01'),
        dateExpiration: new Date('2025-01-01'),
        uploadePar: gestionnaire._id,
        statut: 'a_renouveler'
      },
      {
        type: 'vehicule',
        reference: { vehicule: vehicles[1]._id },
        categorie: 'carte_grise',
        nom: 'Carte Grise Mercedes Sprinter',
        numeroDocument: 'CG-2020-002',
        dateEmission: new Date('2020-06-20'),
        uploadePar: gestionnaire._id,
        statut: 'valide'
      },
      {
        type: 'conducteur',
        reference: { conducteur: drivers[0]._id },
        categorie: 'permis',
        nom: 'Permis de conduire Mohamed Diallo',
        numeroDocument: 'CI2015001234',
        dateEmission: new Date('2015-03-10'),
        dateExpiration: new Date('2026-03-10'),
        uploadePar: gestionnaire._id,
        statut: 'valide'
      }
    ]);

    console.log(`✅ ${documents.length} documents créés\n`);

    console.log('═══════════════════════════════════════════════════');
    console.log('✨ DONNÉES DE DÉMONSTRATION CRÉÉES AVEC SUCCÈS ✨');
    console.log('═══════════════════════════════════════════════════\n');

    console.log('📊 RÉSUMÉ:');
    console.log(`   • Utilisateurs: ${conducteurs.length + 3} (1 admin, 1 gestionnaire, 1 technicien, ${conducteurs.length} conducteurs)`);
    console.log(`   • Véhicules: ${vehicles.length}`);
    console.log(`   • Conducteurs: ${drivers.length}`);
    console.log(`   • Maintenances: ${maintenances.length}`);
    console.log(`   • Ravitaillements: ${fuels.length}`);
    console.log(`   • Trajets: ${trips.length}`);
    console.log(`   • Documents: ${documents.length}\n`);

    console.log('👤 COMPTES DE TEST:');
    console.log('   ┌─────────────────────────────────────────────────┐');
    console.log('   │ ADMIN                                           │');
    console.log('   │ Email: admin@parc360.ci                         │');
    console.log('   │ Mot de passe: admin123                          │');
    console.log('   ├─────────────────────────────────────────────────┤');
    console.log('   │ GESTIONNAIRE                                    │');
    console.log('   │ Email: gestionnaire@parc360.ci                  │');
    console.log('   │ Mot de passe: gestionnaire123                   │');
    console.log('   ├─────────────────────────────────────────────────┤');
    console.log('   │ TECHNICIEN                                      │');
    console.log('   │ Email: technicien@parc360.ci                    │');
    console.log('   │ Mot de passe: technicien123                     │');
    console.log('   ├─────────────────────────────────────────────────┤');
    console.log('   │ CONDUCTEUR                                      │');
    console.log('   │ Email: mohamed.diallo@parc360.ci                │');
    console.log('   │ Mot de passe: conducteur123                     │');
    console.log('   └─────────────────────────────────────────────────┘\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la création des données:', error);
    process.exit(1);
  }
};

seedData();
