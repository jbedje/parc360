const PDFDocument = require('pdfkit');
const xlsx = require('xlsx');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const Maintenance = require('../models/Maintenance');
const Fuel = require('../models/Fuel');
const Trip = require('../models/Trip');

// Helper to format date for display
const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('fr-FR');
};

// @desc    Export vehicles to PDF
// @route   GET /api/export/vehicles/pdf
// @access  Private/Admin+Gestionnaire
exports.exportVehiclesPDF = async (req, res) => {
  try {
    const vehicles = await Vehicle.find()
      .populate('conducteurActuel', 'nom prenom')
      .sort('-createdAt');

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=vehicules.pdf');

    doc.pipe(res);

    // Title
    doc.fontSize(20).text('PARC360 - Liste des Véhicules', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).text(`Date: ${formatDate(new Date())}`, { align: 'center' });
    doc.moveDown(2);

    // Table headers
    doc.fontSize(12).fillColor('#ED6D11');
    doc.text('Véhicules enregistrés', { underline: true });
    doc.moveDown();

    // Vehicle data
    doc.fontSize(9).fillColor('#000000');
    vehicles.forEach((vehicle, index) => {
      if (index > 0) doc.moveDown(0.5);

      doc.font('Helvetica-Bold');
      doc.text(`${index + 1}. ${vehicle.marque} ${vehicle.modele} (${vehicle.immatriculation})`);

      doc.font('Helvetica');
      doc.text(`   Type: ${vehicle.type} | Année: ${vehicle.annee} | Statut: ${vehicle.statut}`);
      doc.text(`   Kilométrage: ${vehicle.kilometrage.toLocaleString()} km | Carburant: ${vehicle.carburant}`);

      if (vehicle.conducteurActuel) {
        doc.text(`   Conducteur: ${vehicle.conducteurActuel.prenom} ${vehicle.conducteurActuel.nom}`);
      }

      // New page if needed
      if (doc.y > 700) {
        doc.addPage();
      }
    });

    // Footer
    doc.moveDown(2);
    doc.fontSize(8).fillColor('#666666');
    doc.text(`Total: ${vehicles.length} véhicules`, { align: 'center' });
    doc.text('© 2025 PARC360 - Côte d\'Ivoire PME', { align: 'center' });

    doc.end();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'export PDF',
      error: error.message,
    });
  }
};

// @desc    Export vehicles to Excel
// @route   GET /api/export/vehicles/excel
// @access  Private/Admin+Gestionnaire
exports.exportVehiclesExcel = async (req, res) => {
  try {
    const vehicles = await Vehicle.find()
      .populate('conducteurActuel', 'nom prenom')
      .sort('-createdAt');

    const data = vehicles.map((v) => ({
      Immatriculation: v.immatriculation,
      Marque: v.marque,
      Modèle: v.modele,
      Année: v.annee,
      Type: v.type,
      Couleur: v.couleur,
      Statut: v.statut,
      Kilométrage: v.kilometrage,
      Carburant: v.carburant,
      'Prix d\'achat': v.prixAchat,
      Département: v.departement,
      Conducteur: v.conducteurActuel
        ? `${v.conducteurActuel.prenom} ${v.conducteurActuel.nom}`
        : '',
      'Date d\'achat': formatDate(v.dateAchat),
    }));

    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Véhicules');

    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=vehicules.xlsx');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'export Excel',
      error: error.message,
    });
  }
};

// @desc    Export drivers to PDF
// @route   GET /api/export/drivers/pdf
// @access  Private/Admin+Gestionnaire
exports.exportDriversPDF = async (req, res) => {
  try {
    const drivers = await Driver.find()
      .populate('user', 'nom prenom email telephone')
      .populate('vehiculeAssigne', 'immatriculation marque modele')
      .sort('-createdAt');

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=conducteurs.pdf');

    doc.pipe(res);

    doc.fontSize(20).text('PARC360 - Liste des Conducteurs', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).text(`Date: ${formatDate(new Date())}`, { align: 'center' });
    doc.moveDown(2);

    doc.fontSize(12).fillColor('#ED6D11');
    doc.text('Conducteurs enregistrés', { underline: true });
    doc.moveDown();

    doc.fontSize(9).fillColor('#000000');
    drivers.forEach((driver, index) => {
      if (index > 0) doc.moveDown(0.5);

      doc.font('Helvetica-Bold');
      doc.text(`${index + 1}. ${driver.user.prenom} ${driver.user.nom}`);

      doc.font('Helvetica');
      doc.text(`   Email: ${driver.user.email} | Tél: ${driver.user.telephone}`);
      doc.text(`   Permis: ${driver.numeroPermis} | Catégories: ${driver.categoriePermis.join(', ')}`);
      doc.text(`   Expiration: ${formatDate(driver.dateExpiration)} | Statut: ${driver.statut}`);

      if (driver.vehiculeAssigne) {
        doc.text(`   Véhicule: ${driver.vehiculeAssigne.marque} ${driver.vehiculeAssigne.modele} (${driver.vehiculeAssigne.immatriculation})`);
      }

      if (doc.y > 700) {
        doc.addPage();
      }
    });

    doc.moveDown(2);
    doc.fontSize(8).fillColor('#666666');
    doc.text(`Total: ${drivers.length} conducteurs`, { align: 'center' });
    doc.text('© 2025 PARC360 - Côte d\'Ivoire PME', { align: 'center' });

    doc.end();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'export PDF',
      error: error.message,
    });
  }
};

// @desc    Export drivers to Excel
// @route   GET /api/export/drivers/excel
// @access  Private/Admin+Gestionnaire
exports.exportDriversExcel = async (req, res) => {
  try {
    const drivers = await Driver.find()
      .populate('user', 'nom prenom email telephone')
      .populate('vehiculeAssigne', 'immatriculation marque modele')
      .sort('-createdAt');

    const data = drivers.map((d) => ({
      Prénom: d.user.prenom,
      Nom: d.user.nom,
      Email: d.user.email,
      Téléphone: d.user.telephone,
      'Numéro Permis': d.numeroPermis,
      'Catégories Permis': d.categoriePermis.join(', '),
      'Date Délivrance': formatDate(d.dateDelivrance),
      'Date Expiration': formatDate(d.dateExpiration),
      Département: d.departement,
      Statut: d.statut,
      Ville: d.ville,
      'Date Embauche': formatDate(d.dateEmbauche),
      'Véhicule Assigné': d.vehiculeAssigne
        ? `${d.vehiculeAssigne.marque} ${d.vehiculeAssigne.modele} (${d.vehiculeAssigne.immatriculation})`
        : '',
    }));

    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Conducteurs');

    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=conducteurs.xlsx');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'export Excel',
      error: error.message,
    });
  }
};

// @desc    Export maintenance to Excel
// @route   GET /api/export/maintenance/excel
// @access  Private/Admin+Gestionnaire
exports.exportMaintenanceExcel = async (req, res) => {
  try {
    const maintenances = await Maintenance.find()
      .populate('vehicule', 'immatriculation marque modele')
      .populate('technicien', 'nom prenom')
      .sort('-dateDebut');

    const data = maintenances.map((m) => ({
      Véhicule: m.vehicule
        ? `${m.vehicule.marque} ${m.vehicule.modele} (${m.vehicule.immatriculation})`
        : '',
      Type: m.type,
      Description: m.description,
      'Date Début': formatDate(m.dateDebut),
      'Date Fin': formatDate(m.dateFin),
      Statut: m.statut,
      'Coût Pièces': m.coutPieces,
      'Coût Main d\'œuvre': m.coutMainOeuvre,
      'Coût Total': m.coutTotal,
      Technicien: m.technicien ? `${m.technicien.prenom} ${m.technicien.nom}` : '',
      'Kilométrage': m.kilometrage,
    }));

    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Maintenances');

    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=maintenances.xlsx');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'export Excel',
      error: error.message,
    });
  }
};

// @desc    Export fuel records to Excel
// @route   GET /api/export/fuel/excel
// @access  Private/Admin+Gestionnaire
exports.exportFuelExcel = async (req, res) => {
  try {
    const fuelRecords = await Fuel.find()
      .populate('vehicule', 'immatriculation marque modele')
      .populate('conducteur', 'nom prenom')
      .sort('-date');

    const data = fuelRecords.map((f) => ({
      Date: formatDate(f.date),
      Véhicule: f.vehicule
        ? `${f.vehicule.marque} ${f.vehicule.modele} (${f.vehicule.immatriculation})`
        : '',
      Conducteur: f.conducteur ? `${f.conducteur.prenom} ${f.conducteur.nom}` : '',
      'Quantité (L)': f.quantite,
      'Prix Unitaire': f.prixUnitaire,
      'Coût Total': f.coutTotal,
      'Type Carburant': f.typeCarburant,
      'Kilométrage': f.kilometrage,
      'Station Service': f.stationService,
    }));

    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Ravitaillements');

    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=carburant.xlsx');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'export Excel',
      error: error.message,
    });
  }
};

// @desc    Export trips to Excel
// @route   GET /api/export/trips/excel
// @access  Private/Admin+Gestionnaire
exports.exportTripsExcel = async (req, res) => {
  try {
    const trips = await Trip.find()
      .populate('vehicule', 'immatriculation marque modele')
      .populate('conducteur', 'nom prenom')
      .sort('-dateDepart');

    const data = trips.map((t) => ({
      'Date Départ': formatDate(t.dateDepart),
      'Date Retour': formatDate(t.dateRetour),
      Véhicule: t.vehicule
        ? `${t.vehicule.marque} ${t.vehicule.modele} (${t.vehicule.immatriculation})`
        : '',
      Conducteur: t.conducteur ? `${t.conducteur.prenom} ${t.conducteur.nom}` : '',
      Départ: t.lieuDepart,
      Destination: t.destination,
      'Km Départ': t.kilometrageDepart,
      'Km Retour': t.kilometrageRetour,
      'Distance (km)': t.distance,
      'Coûts Péage': t.coutPeage,
      'Coûts Parking': t.coutParking,
      'Autres Frais': t.autresFrais,
      'Coût Total': t.coutTotal,
      Statut: t.statut,
    }));

    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Trajets');

    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=trajets.xlsx');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'export Excel',
      error: error.message,
    });
  }
};
