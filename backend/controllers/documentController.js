const Document = require('../models/Document');

// @desc    Obtenir tous les documents
// @route   GET /api/documents
// @access  Private
exports.getDocuments = async (req, res) => {
  try {
    const { type, statut, vehicule, conducteur } = req.query;
    let query = {};

    if (type) query.type = type;
    if (statut) query.statut = statut;
    if (vehicule) query['reference.vehicule'] = vehicule;
    if (conducteur) query['reference.conducteur'] = conducteur;

    const documents = await Document.find(query)
      .populate('reference.vehicule', 'immatriculation marque modele')
      .populate('reference.conducteur', 'user numeroPermis')
      .populate('uploadePar', 'nom prenom')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Obtenir un document
// @route   GET /api/documents/:id
// @access  Private
exports.getDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('reference.vehicule reference.conducteur uploadePar');

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document non trouvé' });
    }

    res.status(200).json({ success: true, data: document });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Créer un document
// @route   POST /api/documents
// @access  Private (Admin, Gestionnaire)
exports.createDocument = async (req, res) => {
  try {
    req.body.uploadePar = req.user.id;
    const document = await Document.create(req.body);

    res.status(201).json({ success: true, data: document });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mettre à jour un document
// @route   PUT /api/documents/:id
// @access  Private (Admin, Gestionnaire)
exports.updateDocument = async (req, res) => {
  try {
    // Utiliser findById + save au lieu de findByIdAndUpdate
    // pour déclencher le middleware pre('save') qui recalcule le statut
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document non trouvé' });
    }

    // Mettre à jour les champs
    Object.assign(document, req.body);

    // Sauvegarder (déclenche le pre('save') pour recalculer le statut)
    await document.save();

    // Populate les références pour la réponse
    await document.populate('reference.vehicule reference.conducteur uploadePar');

    res.status(200).json({ success: true, data: document });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Supprimer un document
// @route   DELETE /api/documents/:id
// @access  Private (Admin)
exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findByIdAndDelete(req.params.id);

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document non trouvé' });
    }

    res.status(200).json({ success: true, message: 'Document supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Obtenir les documents qui expirent bientôt
// @route   GET /api/documents/expiring
// @access  Private
exports.getExpiringDocuments = async (req, res) => {
  try {
    const today = new Date();
    const in30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    const documents = await Document.find({
      dateExpiration: { $gte: today, $lte: in30Days },
      statut: { $ne: 'expire' }
    })
      .populate('reference.vehicule reference.conducteur')
      .sort('dateExpiration');

    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Recalculer le statut de tous les documents
// @route   POST /api/documents/refresh-status
// @access  Private (Admin)
exports.refreshDocumentStatus = async (req, res) => {
  try {
    // Récupérer tous les documents qui ont une date d'expiration
    const documents = await Document.find({ dateExpiration: { $exists: true } });

    let updated = 0;
    for (const doc of documents) {
      // Sauvegarder chaque document pour déclencher le recalcul du statut
      await doc.save();
      updated++;
    }

    res.status(200).json({
      success: true,
      message: `Statut de ${updated} document(s) recalculé avec succès`,
      count: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
