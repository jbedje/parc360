const Driver = require('../models/Driver');
const User = require('../models/User');

// @desc    Obtenir tous les conducteurs
// @route   GET /api/drivers
// @access  Private
exports.getDrivers = async (req, res) => {
  try {
    const { statut, departement, search } = req.query;
    let query = {};

    if (statut) query.statut = statut;
    if (departement) query.departement = departement;

    const drivers = await Driver.find(query)
      .populate('user', 'nom prenom email telephone')
      .populate('vehiculeAssigne', 'immatriculation marque modele')
      .sort('-createdAt');

    // Filtrer par recherche si nécessaire
    let filteredDrivers = drivers;
    if (search) {
      filteredDrivers = drivers.filter(driver =>
        driver.user.nom.toLowerCase().includes(search.toLowerCase()) ||
        driver.user.prenom.toLowerCase().includes(search.toLowerCase()) ||
        driver.numeroPermis.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.status(200).json({
      success: true,
      count: filteredDrivers.length,
      data: filteredDrivers
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Obtenir un conducteur
// @route   GET /api/drivers/:id
// @access  Private
exports.getDriver = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id)
      .populate('user', 'nom prenom email telephone avatar')
      .populate('vehiculeAssigne', 'immatriculation marque modele');

    if (!driver) {
      return res.status(404).json({ success: false, message: 'Conducteur non trouvé' });
    }

    res.status(200).json({ success: true, data: driver });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Créer un conducteur
// @route   POST /api/drivers
// @access  Private (Admin, Gestionnaire)
exports.createDriver = async (req, res) => {
  try {
    const { userData, driverData } = req.body;

    // Créer d'abord l'utilisateur
    const user = await User.create({ ...userData, role: 'conducteur' });

    // Créer le profil conducteur
    const driver = await Driver.create({
      ...driverData,
      user: user._id
    });

    const populatedDriver = await Driver.findById(driver._id).populate('user');

    res.status(201).json({ success: true, data: populatedDriver });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mettre à jour un conducteur
// @route   PUT /api/drivers/:id
// @access  Private (Admin, Gestionnaire)
exports.updateDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('user vehiculeAssigne');

    if (!driver) {
      return res.status(404).json({ success: false, message: 'Conducteur non trouvé' });
    }

    res.status(200).json({ success: true, data: driver });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Supprimer un conducteur
// @route   DELETE /api/drivers/:id
// @access  Private (Admin)
exports.deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);

    if (!driver) {
      return res.status(404).json({ success: false, message: 'Conducteur non trouvé' });
    }

    // Supprimer aussi l'utilisateur associé
    await User.findByIdAndDelete(driver.user);
    await driver.deleteOne();

    res.status(200).json({ success: true, message: 'Conducteur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Ajouter une infraction
// @route   POST /api/drivers/:id/infractions
// @access  Private (Admin, Gestionnaire)
exports.addInfraction = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);

    if (!driver) {
      return res.status(404).json({ success: false, message: 'Conducteur non trouvé' });
    }

    driver.infractions.push(req.body);
    await driver.save();

    res.status(200).json({ success: true, data: driver });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Ajouter une formation
// @route   POST /api/drivers/:id/formations
// @access  Private (Admin, Gestionnaire)
exports.addFormation = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);

    if (!driver) {
      return res.status(404).json({ success: false, message: 'Conducteur non trouvé' });
    }

    driver.formations.push(req.body);
    await driver.save();

    res.status(200).json({ success: true, data: driver });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
