const User = require('../models/User');

// @desc    Enregistrer un utilisateur
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { nom, prenom, email, password, telephone, role } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Cet email est déjà utilisé' });
    }

    // Créer l'utilisateur
    const user = await User.create({
      nom,
      prenom,
      email,
      password,
      telephone,
      role
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Connexion utilisateur
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Valider email et mot de passe
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Veuillez fournir un email et un mot de passe' });
    }

    // Vérifier l'utilisateur
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Identifiants invalides' });
    }

    // Vérifier le mot de passe
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Identifiants invalides' });
    }

    // Vérifier si le compte est actif
    if (!user.actif) {
      return res.status(401).json({ success: false, message: 'Votre compte a été désactivé' });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Obtenir l'utilisateur connecté
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mettre à jour le profil
// @route   PUT /api/auth/updateprofile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const fieldsToUpdate = {
      nom: req.body.nom,
      prenom: req.body.prenom,
      email: req.body.email,
      telephone: req.body.telephone
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Changer le mot de passe
// @route   PUT /api/auth/changepassword
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    // Vérifier l'ancien mot de passe
    if (!(await user.matchPassword(req.body.currentPassword))) {
      return res.status(401).json({ success: false, message: 'Mot de passe actuel incorrect' });
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fonction helper pour envoyer le token
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role
    }
  });
};
