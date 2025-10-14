const Maintenance = require('../models/Maintenance');
const Vehicle = require('../models/Vehicle');

// @desc    Obtenir toutes les maintenances
// @route   GET /api/maintenance
// @access  Private
exports.getMaintenances = async (req, res) => {
  try {
    const { statut, type, vehicule } = req.query;
    let query = {};

    if (statut) query.statut = statut;
    if (type) query.type = type;
    if (vehicule) query.vehicule = vehicule;

    const maintenances = await Maintenance.find(query)
      .populate('vehicule', 'immatriculation marque modele')
      .populate('technicien', 'nom prenom')
      .sort('-dateDebut');

    res.status(200).json({
      success: true,
      count: maintenances.length,
      data: maintenances
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Obtenir une maintenance
// @route   GET /api/maintenance/:id
// @access  Private
exports.getMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.findById(req.params.id)
      .populate('vehicule', 'immatriculation marque modele')
      .populate('technicien', 'nom prenom email');

    if (!maintenance) {
      return res.status(404).json({ success: false, message: 'Maintenance non trouvée' });
    }

    res.status(200).json({ success: true, data: maintenance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Créer une maintenance
// @route   POST /api/maintenance
// @access  Private (Admin, Gestionnaire, Technicien)
exports.createMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.create(req.body);

    // Mettre à jour le statut du véhicule
    if (maintenance.statut === 'en_cours') {
      await Vehicle.findByIdAndUpdate(maintenance.vehicule, {
        statut: 'en_maintenance'
      });
    }

    res.status(201).json({ success: true, data: maintenance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mettre à jour une maintenance
// @route   PUT /api/maintenance/:id
// @access  Private (Admin, Gestionnaire, Technicien)
exports.updateMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('vehicule technicien');

    if (!maintenance) {
      return res.status(404).json({ success: false, message: 'Maintenance non trouvée' });
    }

    // Si la maintenance est terminée, mettre à jour le véhicule
    if (req.body.statut === 'termine') {
      await Vehicle.findByIdAndUpdate(maintenance.vehicule._id, {
        statut: 'disponible',
        kilometrage: maintenance.kilometrageActuel
      });
    }

    res.status(200).json({ success: true, data: maintenance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Supprimer une maintenance
// @route   DELETE /api/maintenance/:id
// @access  Private (Admin)
exports.deleteMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.findByIdAndDelete(req.params.id);

    if (!maintenance) {
      return res.status(404).json({ success: false, message: 'Maintenance non trouvée' });
    }

    res.status(200).json({ success: true, message: 'Maintenance supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
