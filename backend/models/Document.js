const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['vehicule', 'conducteur', 'maintenance', 'assurance', 'autre'],
    required: true
  },
  reference: {
    vehicule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle'
    },
    conducteur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver'
    },
    maintenance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Maintenance'
    }
  },
  categorie: {
    type: String,
    required: true
  },
  nom: {
    type: String,
    required: [true, 'Le nom du document est requis']
  },
  description: String,
  numeroDocument: String,
  dateEmission: Date,
  dateExpiration: Date,
  fichier: {
    url: String,
    nom: String,
    type: String,
    taille: Number
  },
  uploadePar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  statut: {
    type: String,
    enum: ['valide', 'expire', 'a_renouveler'],
    default: 'valide'
  }
}, {
  timestamps: true
});

// Vérifier l'expiration
DocumentSchema.pre('save', function(next) {
  if (this.dateExpiration) {
    const today = new Date();
    const expiration = new Date(this.dateExpiration);
    const joursRestants = Math.floor((expiration - today) / (1000 * 60 * 60 * 24));

    if (joursRestants < 0) {
      this.statut = 'expire';
    } else if (joursRestants <= 30) {
      this.statut = 'a_renouveler';
    } else {
      this.statut = 'valide';
    }
  }
  next();
});

module.exports = mongoose.model('Document', DocumentSchema);
