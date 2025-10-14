const Trip = require('../models/Trip');
const Vehicle = require('../models/Vehicle');

// @desc    Obtenir tous les déplacements
// @route   GET /api/trips
// @access  Private
exports.getTrips = async (req, res) => {
  try {
    const { statut, vehicule, conducteur, dateDebut, dateFin } = req.query;
    let query = {};

    if (statut) query.statut = statut;
    if (vehicule) query.vehicule = vehicule;
    if (conducteur) query.conducteur = conducteur;
    if (dateDebut && dateFin) {
      query.dateDepart = {
        $gte: new Date(dateDebut),
        $lte: new Date(dateFin)
      };
    }

    const trips = await Trip.find(query)
      .populate('vehicule', 'immatriculation marque modele')
      .populate('conducteur', 'user numeroPermis')
      .populate('validePar', 'nom prenom')
      .sort('-dateDepart');

    res.status(200).json({
      success: true,
      count: trips.length,
      data: trips
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Obtenir un déplacement
// @route   GET /api/trips/:id
// @access  Private
exports.getTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('vehicule conducteur validePar');

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Déplacement non trouvé' });
    }

    res.status(200).json({ success: true, data: trip });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Créer un déplacement
// @route   POST /api/trips
// @access  Private
exports.createTrip = async (req, res) => {
  try {
    const trip = await Trip.create(req.body);

    // Mettre à jour le statut du véhicule
    await Vehicle.findByIdAndUpdate(req.body.vehicule, {
      statut: 'en_service'
    });

    res.status(201).json({ success: true, data: trip });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mettre à jour un déplacement
// @route   PUT /api/trips/:id
// @access  Private
exports.updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('vehicule conducteur');

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Déplacement non trouvé' });
    }

    // Si le trajet est terminé, mettre à jour le véhicule
    if (req.body.statut === 'termine' && req.body.kilometrageArrivee) {
      await Vehicle.findByIdAndUpdate(trip.vehicule._id, {
        statut: 'disponible',
        kilometrage: req.body.kilometrageArrivee
      });
    }

    res.status(200).json({ success: true, data: trip });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Supprimer un déplacement
// @route   DELETE /api/trips/:id
// @access  Private (Admin)
exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Déplacement non trouvé' });
    }

    res.status(200).json({ success: true, message: 'Déplacement supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Valider un déplacement
// @route   PUT /api/trips/:id/validate
// @access  Private (Admin, Gestionnaire)
exports.validateTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndUpdate(
      req.params.id,
      { validePar: req.user.id },
      { new: true }
    ).populate('vehicule conducteur validePar');

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Déplacement non trouvé' });
    }

    res.status(200).json({ success: true, data: trip });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
