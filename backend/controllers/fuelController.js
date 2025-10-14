const Fuel = require('../models/Fuel');
const Vehicle = require('../models/Vehicle');

// @desc    Obtenir tous les enregistrements de carburant
// @route   GET /api/fuel
// @access  Private
exports.getFuelRecords = async (req, res) => {
  try {
    const { vehicule, conducteur, dateDebut, dateFin } = req.query;
    let query = {};

    if (vehicule) query.vehicule = vehicule;
    if (conducteur) query.conducteur = conducteur;
    if (dateDebut && dateFin) {
      query.dateRavitaillement = {
        $gte: new Date(dateDebut),
        $lte: new Date(dateFin)
      };
    }

    const fuelRecords = await Fuel.find(query)
      .populate('vehicule', 'immatriculation marque modele')
      .populate('conducteur', 'user numeroPermis')
      .sort('-dateRavitaillement');

    res.status(200).json({
      success: true,
      count: fuelRecords.length,
      data: fuelRecords
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Obtenir un enregistrement de carburant
// @route   GET /api/fuel/:id
// @access  Private
exports.getFuelRecord = async (req, res) => {
  try {
    const fuelRecord = await Fuel.findById(req.params.id)
      .populate('vehicule conducteur');

    if (!fuelRecord) {
      return res.status(404).json({ success: false, message: 'Enregistrement non trouvé' });
    }

    res.status(200).json({ success: true, data: fuelRecord });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Créer un enregistrement de carburant
// @route   POST /api/fuel
// @access  Private
exports.createFuelRecord = async (req, res) => {
  try {
    // Calculer le montant total
    req.body.montantTotal = req.body.quantite * req.body.prixUnitaire;

    const fuelRecord = await Fuel.create(req.body);

    // Mettre à jour le kilométrage du véhicule
    await Vehicle.findByIdAndUpdate(req.body.vehicule, {
      kilometrage: req.body.kilometrageActuel
    });

    res.status(201).json({ success: true, data: fuelRecord });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mettre à jour un enregistrement de carburant
// @route   PUT /api/fuel/:id
// @access  Private (Admin, Gestionnaire)
exports.updateFuelRecord = async (req, res) => {
  try {
    if (req.body.quantite && req.body.prixUnitaire) {
      req.body.montantTotal = req.body.quantite * req.body.prixUnitaire;
    }

    const fuelRecord = await Fuel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('vehicule conducteur');

    if (!fuelRecord) {
      return res.status(404).json({ success: false, message: 'Enregistrement non trouvé' });
    }

    res.status(200).json({ success: true, data: fuelRecord });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Supprimer un enregistrement de carburant
// @route   DELETE /api/fuel/:id
// @access  Private (Admin)
exports.deleteFuelRecord = async (req, res) => {
  try {
    const fuelRecord = await Fuel.findByIdAndDelete(req.params.id);

    if (!fuelRecord) {
      return res.status(404).json({ success: false, message: 'Enregistrement non trouvé' });
    }

    res.status(200).json({ success: true, message: 'Enregistrement supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Obtenir les statistiques de carburant
// @route   GET /api/fuel/stats
// @access  Private
exports.getFuelStats = async (req, res) => {
  try {
    const { vehicule, dateDebut, dateFin } = req.query;
    let matchStage = {};

    if (vehicule) matchStage.vehicule = vehicule;
    if (dateDebut && dateFin) {
      matchStage.dateRavitaillement = {
        $gte: new Date(dateDebut),
        $lte: new Date(dateFin)
      };
    }

    const stats = await Fuel.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$vehicule',
          totalQuantite: { $sum: '$quantite' },
          totalMontant: { $sum: '$montantTotal' },
          nombreRavitaillements: { $count: {} },
          moyenneQuantite: { $avg: '$quantite' },
          moyenneMontant: { $avg: '$montantTotal' }
        }
      }
    ]);

    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
