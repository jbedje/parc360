const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const Maintenance = require('../models/Maintenance');
const Fuel = require('../models/Fuel');
const Trip = require('../models/Trip');
const Document = require('../models/Document');

// @desc    Obtenir les statistiques du dashboard
// @route   GET /api/reports/dashboard
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalVehicles,
      totalDrivers,
      vehiculesDisponibles,
      vehiculesEnService,
      vehiculesEnMaintenance,
      maintenancesEnCours,
      tripsEnCours,
      documentsExpirant
    ] = await Promise.all([
      Vehicle.countDocuments(),
      Driver.countDocuments({ statut: 'actif' }),
      Vehicle.countDocuments({ statut: 'disponible' }),
      Vehicle.countDocuments({ statut: 'en_service' }),
      Vehicle.countDocuments({ statut: 'en_maintenance' }),
      Maintenance.countDocuments({ statut: 'en_cours' }),
      Trip.countDocuments({ statut: 'en_cours' }),
      Document.countDocuments({ statut: { $in: ['expire', 'a_renouveler'] } })
    ]);

    // Calculer les dépenses du mois
    const debutMois = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const finMois = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    const [depensesMaintenance, depensesCarburant] = await Promise.all([
      Maintenance.aggregate([
        {
          $match: {
            dateDebut: { $gte: debutMois, $lte: finMois }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$coutTotal' }
          }
        }
      ]),
      Fuel.aggregate([
        {
          $match: {
            dateRavitaillement: { $gte: debutMois, $lte: finMois }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$montantTotal' }
          }
        }
      ])
    ]);

    const totalDepensesMois =
      (depensesMaintenance[0]?.total || 0) +
      (depensesCarburant[0]?.total || 0);

    res.status(200).json({
      success: true,
      data: {
        vehicules: {
          total: totalVehicles,
          disponibles: vehiculesDisponibles,
          enService: vehiculesEnService,
          enMaintenance: vehiculesEnMaintenance
        },
        conducteurs: {
          total: totalDrivers
        },
        maintenances: {
          enCours: maintenancesEnCours
        },
        trajets: {
          enCours: tripsEnCours
        },
        documents: {
          expirant: documentsExpirant
        },
        finances: {
          depensesMois: totalDepensesMois,
          depensesMaintenance: depensesMaintenance[0]?.total || 0,
          depensesCarburant: depensesCarburant[0]?.total || 0
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Rapport sur les véhicules
// @route   GET /api/reports/vehicles
// @access  Private (Admin, Gestionnaire)
exports.getVehicleReport = async (req, res) => {
  try {
    const { dateDebut, dateFin } = req.query;

    const vehicles = await Vehicle.find().lean();

    const vehicleReports = await Promise.all(
      vehicles.map(async (vehicle) => {
        const query = { vehicule: vehicle._id };
        if (dateDebut && dateFin) {
          query.dateDebut = { $gte: new Date(dateDebut), $lte: new Date(dateFin) };
        }

        const [maintenances, fuels, trips] = await Promise.all([
          Maintenance.find(query),
          Fuel.find({ ...query, dateRavitaillement: query.dateDebut }),
          Trip.find({ ...query, dateDepart: query.dateDebut })
        ]);

        const coutMaintenance = maintenances.reduce((sum, m) => sum + m.coutTotal, 0);
        const coutCarburant = fuels.reduce((sum, f) => sum + f.montantTotal, 0);
        const distanceParcourue = trips.reduce((sum, t) => sum + (t.distanceParcourue || 0), 0);

        return {
          vehicule: vehicle,
          nombreMaintenances: maintenances.length,
          coutMaintenance,
          nombreRavitaillements: fuels.length,
          coutCarburant,
          nombreTrajets: trips.length,
          distanceParcourue,
          coutTotal: coutMaintenance + coutCarburant
        };
      })
    );

    res.status(200).json({ success: true, data: vehicleReports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Rapport de maintenance
// @route   GET /api/reports/maintenance
// @access  Private (Admin, Gestionnaire)
exports.getMaintenanceReport = async (req, res) => {
  try {
    const { dateDebut, dateFin, type } = req.query;
    let query = {};

    if (dateDebut && dateFin) {
      query.dateDebut = { $gte: new Date(dateDebut), $lte: new Date(dateFin) };
    }
    if (type) query.type = type;

    const maintenances = await Maintenance.find(query)
      .populate('vehicule', 'immatriculation marque modele')
      .lean();

    const stats = {
      total: maintenances.length,
      coutTotal: maintenances.reduce((sum, m) => sum + m.coutTotal, 0),
      parType: {},
      parStatut: {},
      moyenneCout: 0
    };

    maintenances.forEach(m => {
      stats.parType[m.type] = (stats.parType[m.type] || 0) + 1;
      stats.parStatut[m.statut] = (stats.parStatut[m.statut] || 0) + 1;
    });

    stats.moyenneCout = stats.total > 0 ? stats.coutTotal / stats.total : 0;

    res.status(200).json({
      success: true,
      data: {
        stats,
        maintenances
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Rapport de carburant
// @route   GET /api/reports/fuel
// @access  Private (Admin, Gestionnaire)
exports.getFuelReport = async (req, res) => {
  try {
    const { dateDebut, dateFin, vehicule } = req.query;
    let query = {};

    if (dateDebut && dateFin) {
      query.dateRavitaillement = { $gte: new Date(dateDebut), $lte: new Date(dateFin) };
    }
    if (vehicule) query.vehicule = vehicule;

    const fuels = await Fuel.find(query)
      .populate('vehicule', 'immatriculation marque modele')
      .populate('conducteur', 'user')
      .lean();

    const stats = {
      total: fuels.length,
      quantiteTotale: fuels.reduce((sum, f) => sum + f.quantite, 0),
      coutTotal: fuels.reduce((sum, f) => sum + f.montantTotal, 0),
      moyenneQuantite: 0,
      moyenneCout: 0,
      parVehicule: {}
    };

    stats.moyenneQuantite = stats.total > 0 ? stats.quantiteTotale / stats.total : 0;
    stats.moyenneCout = stats.total > 0 ? stats.coutTotal / stats.total : 0;

    res.status(200).json({
      success: true,
      data: {
        stats,
        ravitaillements: fuels
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Rapport des conducteurs
// @route   GET /api/reports/drivers
// @access  Private (Admin, Gestionnaire)
exports.getDriverReport = async (req, res) => {
  try {
    const drivers = await Driver.find()
      .populate('user', 'nom prenom email')
      .populate('vehiculeAssigne', 'immatriculation marque modele')
      .lean();

    const driverReports = await Promise.all(
      drivers.map(async (driver) => {
        const trips = await Trip.find({ conducteur: driver._id });
        const infractions = driver.infractions || [];
        const formations = driver.formations || [];

        return {
          conducteur: driver,
          nombreTrajets: trips.length,
          distanceTotale: trips.reduce((sum, t) => sum + (t.distanceParcourue || 0), 0),
          nombreInfractions: infractions.length,
          nombreFormations: formations.length
        };
      })
    );

    res.status(200).json({ success: true, data: driverReports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Analyse des coûts
// @route   GET /api/reports/costs
// @access  Private (Admin, Gestionnaire)
exports.getCostAnalysis = async (req, res) => {
  try {
    const { dateDebut, dateFin } = req.query;
    let dateQuery = {};

    if (dateDebut && dateFin) {
      dateQuery = { $gte: new Date(dateDebut), $lte: new Date(dateFin) };
    }

    const [maintenances, fuels, trips] = await Promise.all([
      Maintenance.find(dateDebut && dateFin ? { dateDebut: dateQuery } : {}),
      Fuel.find(dateDebut && dateFin ? { dateRavitaillement: dateQuery } : {}),
      Trip.find(dateDebut && dateFin ? { dateDepart: dateQuery } : {})
    ]);

    const coutMaintenance = maintenances.reduce((sum, m) => sum + m.coutTotal, 0);
    const coutCarburant = fuels.reduce((sum, f) => sum + f.montantTotal, 0);
    const coutTrajets = trips.reduce((sum, t) => sum + (t.coutTotal || 0), 0);
    const coutTotal = coutMaintenance + coutCarburant + coutTrajets;

    res.status(200).json({
      success: true,
      data: {
        coutMaintenance,
        coutCarburant,
        coutTrajets,
        coutTotal,
        pourcentages: {
          maintenance: coutTotal > 0 ? ((coutMaintenance / coutTotal) * 100).toFixed(2) : 0,
          carburant: coutTotal > 0 ? ((coutCarburant / coutTotal) * 100).toFixed(2) : 0,
          trajets: coutTotal > 0 ? ((coutTrajets / coutTotal) * 100).toFixed(2) : 0
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
