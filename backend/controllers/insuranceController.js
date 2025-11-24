const Insurance = require('../models/Insurance');
const Vehicle = require('../models/Vehicle');

// @desc    Get all insurances
// @route   GET /api/insurances
// @access  Private/Admin+Gestionnaire
exports.getInsurances = async (req, res) => {
  try {
    const { statut, vehicule } = req.query;
    const filter = {};

    if (statut) filter.statut = statut;
    if (vehicule) filter.vehicule = vehicule;

    const insurances = await Insurance.find(filter)
      .populate('vehicule', 'immatriculation marque modele')
      .sort('-dateExpiration');

    res.status(200).json({
      success: true,
      count: insurances.length,
      data: insurances,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des assurances',
      error: error.message,
    });
  }
};

// @desc    Get single insurance
// @route   GET /api/insurances/:id
// @access  Private/Admin+Gestionnaire
exports.getInsurance = async (req, res) => {
  try {
    const insurance = await Insurance.findById(req.params.id).populate(
      'vehicule',
      'immatriculation marque modele annee'
    );

    if (!insurance) {
      return res.status(404).json({
        success: false,
        message: 'Assurance non trouvée',
      });
    }

    res.status(200).json({
      success: true,
      data: insurance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'assurance',
      error: error.message,
    });
  }
};

// @desc    Create new insurance
// @route   POST /api/insurances
// @access  Private/Admin
exports.createInsurance = async (req, res) => {
  try {
    // Check if vehicle exists
    const vehicle = await Vehicle.findById(req.body.vehicule);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Véhicule non trouvé',
      });
    }

    const insurance = await Insurance.create(req.body);

    res.status(201).json({
      success: true,
      data: insurance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'assurance',
      error: error.message,
    });
  }
};

// @desc    Update insurance
// @route   PUT /api/insurances/:id
// @access  Private/Admin+Gestionnaire
exports.updateInsurance = async (req, res) => {
  try {
    let insurance = await Insurance.findById(req.params.id);

    if (!insurance) {
      return res.status(404).json({
        success: false,
        message: 'Assurance non trouvée',
      });
    }

    insurance = await Insurance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: insurance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'assurance',
      error: error.message,
    });
  }
};

// @desc    Delete insurance
// @route   DELETE /api/insurances/:id
// @access  Private/Admin
exports.deleteInsurance = async (req, res) => {
  try {
    const insurance = await Insurance.findById(req.params.id);

    if (!insurance) {
      return res.status(404).json({
        success: false,
        message: 'Assurance non trouvée',
      });
    }

    await insurance.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Assurance supprimée avec succès',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'assurance',
      error: error.message,
    });
  }
};

// @desc    Add sinistre to insurance
// @route   POST /api/insurances/:id/sinistres
// @access  Private/Admin+Gestionnaire
exports.addSinistre = async (req, res) => {
  try {
    const insurance = await Insurance.findById(req.params.id);

    if (!insurance) {
      return res.status(404).json({
        success: false,
        message: 'Assurance non trouvée',
      });
    }

    insurance.sinistres.push(req.body);
    await insurance.save();

    res.status(200).json({
      success: true,
      data: insurance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'ajout du sinistre',
      error: error.message,
    });
  }
};

// @desc    Update sinistre status
// @route   PUT /api/insurances/:id/sinistres/:sinistreId
// @access  Private/Admin+Gestionnaire
exports.updateSinistre = async (req, res) => {
  try {
    const insurance = await Insurance.findById(req.params.id);

    if (!insurance) {
      return res.status(404).json({
        success: false,
        message: 'Assurance non trouvée',
      });
    }

    const sinistre = insurance.sinistres.id(req.params.sinistreId);
    if (!sinistre) {
      return res.status(404).json({
        success: false,
        message: 'Sinistre non trouvé',
      });
    }

    Object.assign(sinistre, req.body);
    await insurance.save();

    res.status(200).json({
      success: true,
      data: insurance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du sinistre',
      error: error.message,
    });
  }
};

// @desc    Get expiring insurances
// @route   GET /api/insurances/alerts/expiring
// @access  Private/Admin+Gestionnaire
exports.getExpiringInsurances = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + parseInt(days));

    const insurances = await Insurance.find({
      dateExpiration: {
        $gte: today,
        $lte: futureDate,
      },
      statut: { $ne: 'annule' },
    })
      .populate('vehicule', 'immatriculation marque modele')
      .sort('dateExpiration');

    res.status(200).json({
      success: true,
      count: insurances.length,
      data: insurances,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des assurances expirant bientôt',
      error: error.message,
    });
  }
};

// @desc    Get insurance statistics
// @route   GET /api/insurances/stats
// @access  Private/Admin+Gestionnaire
exports.getInsuranceStats = async (req, res) => {
  try {
    const totalInsurances = await Insurance.countDocuments();
    const valides = await Insurance.countDocuments({ statut: 'valide' });
    const expires = await Insurance.countDocuments({ statut: 'expire' });

    const today = new Date();
    const in30Days = new Date();
    in30Days.setDate(today.getDate() + 30);

    const expiringSoon = await Insurance.countDocuments({
      dateExpiration: { $gte: today, $lte: in30Days },
      statut: 'valide',
    });

    const totalPrimes = await Insurance.aggregate([
      { $match: { statut: 'valide' } },
      { $group: { _id: null, total: { $sum: '$montantPrime' } } },
    ]);

    const sinistreStats = await Insurance.aggregate([
      { $unwind: '$sinistres' },
      {
        $group: {
          _id: '$sinistres.statut',
          count: { $sum: 1 },
          totalDommages: { $sum: '$sinistres.montantDommages' },
          totalIndemnise: { $sum: '$sinistres.montantIndemnise' },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        total: totalInsurances,
        valides,
        expires,
        expiringSoon,
        totalPrimes: totalPrimes.length > 0 ? totalPrimes[0].total : 0,
        sinistres: sinistreStats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message,
    });
  }
};

// @desc    Refresh all insurance statuses
// @route   PUT /api/insurances/refresh-status
// @access  Private/Admin
exports.refreshAllStatuses = async (req, res) => {
  try {
    const insurances = await Insurance.find({ statut: { $ne: 'annule' } });

    for (const insurance of insurances) {
      await insurance.updateStatut();
    }

    res.status(200).json({
      success: true,
      message: `${insurances.length} assurances mises à jour`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour des statuts',
      error: error.message,
    });
  }
};
