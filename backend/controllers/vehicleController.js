const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');

// @desc    Obtenir tous les véhicules
// @route   GET /api/vehicles
// @access  Private
exports.getVehicles = async (req, res) => {
  try {
    const { statut, type, departement, search } = req.query;
    let query = {};

    if (statut) query.statut = statut;
    if (type) query.type = type;
    if (departement) query.departement = departement;
    if (search) {
      query.$or = [
        { immatriculation: { $regex: search, $options: 'i' } },
        { marque: { $regex: search, $options: 'i' } },
        { modele: { $regex: search, $options: 'i' } }
      ];
    }

    const vehicles = await Vehicle.find(query)
      .populate('conducteurActuel', 'user')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Obtenir un véhicule
// @route   GET /api/vehicles/:id
// @access  Private
exports.getVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)
      .populate('conducteurActuel', 'user numeroPermis');

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Véhicule non trouvé' });
    }

    res.status(200).json({ success: true, data: vehicle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Créer un véhicule
// @route   POST /api/vehicles
// @access  Private (Admin, Gestionnaire)
exports.createVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.create(req.body);
    res.status(201).json({ success: true, data: vehicle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mettre à jour un véhicule
// @route   PUT /api/vehicles/:id
// @access  Private (Admin, Gestionnaire)
exports.updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Véhicule non trouvé' });
    }

    res.status(200).json({ success: true, data: vehicle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Supprimer un véhicule
// @route   DELETE /api/vehicles/:id
// @access  Private (Admin)
exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Véhicule non trouvé' });
    }

    res.status(200).json({ success: true, message: 'Véhicule supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Assigner un conducteur à un véhicule
// @route   PUT /api/vehicles/:id/assign-driver
// @access  Private (Admin, Gestionnaire)
exports.assignDriver = async (req, res) => {
  try {
    const { driverId } = req.body;

    // Vérifier si le conducteur existe
    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ success: false, message: 'Conducteur non trouvé' });
    }

    // Mettre à jour le véhicule
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { conducteurActuel: driverId, statut: 'en_service' },
      { new: true }
    ).populate('conducteurActuel');

    // Mettre à jour le conducteur
    await Driver.findByIdAndUpdate(driverId, { vehiculeAssigne: req.params.id });

    res.status(200).json({ success: true, data: vehicle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Obtenir l'historique d'un véhicule
// @route   GET /api/vehicles/:id/history
// @access  Private
exports.getVehicleHistory = async (req, res) => {
  try {
    const Maintenance = require('../models/Maintenance');
    const Fuel = require('../models/Fuel');
    const Trip = require('../models/Trip');

    const [maintenances, fuels, trips] = await Promise.all([
      Maintenance.find({ vehicule: req.params.id }).sort('-createdAt').limit(10),
      Fuel.find({ vehicule: req.params.id }).sort('-createdAt').limit(10),
      Trip.find({ vehicule: req.params.id }).sort('-createdAt').limit(10)
    ]);

    res.status(200).json({
      success: true,
      data: {
        maintenances,
        fuels,
        trips
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
